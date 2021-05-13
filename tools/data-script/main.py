import sys
import logging
import datetime as dt
from typing import List
from models.Platform import Platform
from models.TickerType import TickerType
from models.SingleTickerMention import SingleTickerMention
from models.DailyTickerMention import DailyTickerMention
from models.RedditSubmission import RedditSubmission
from platforms.stream import stream
from platforms import reddit
import helper
from tickers.tickers import get_tickers
from historical_market_price import market
from models.Sentiment import Sentiment
from db import db
from dotenv import load_dotenv
import traceback
import time

load_dotenv()

# handler = logging.StreamHandler()
# handler.setLevel(logging.DEBUG)
# for logger_name in ("praw", "prawcore"):
#     logger = logging.getLogger(logger_name)
#     logger.setLevel(logging.DEBUG)
#     logger.addHandler(handler)

available_platforms = {
    "wsb": [
        Platform("reddit", "r-wsb", "wallstreetbets", TickerType.Stock),
    ],
    "stock": [
        Platform("reddit", "r-investing", "investing", TickerType.Stock),
        Platform("reddit", "r-pennystocks", "pennystocks", TickerType.Stock),
        Platform("reddit", "r-stocks", "stocks", TickerType.Stock),
        Platform("reddit", "r-stockmarket", "stockmarket", TickerType.Stock),
        Platform("reddit", "r-stock_picks", "stock_picks", TickerType.Stock),
        Platform("reddit", "r-daytrading", "daytrading", TickerType.Stock),
        Platform("reddit", "r-RHpennystocks",
                 "robinhoodpennystocks", TickerType.Stock),
    ],
    "crypto": [
        Platform("reddit", "r-cryptocurrency",
                 "cryptocurrency", TickerType.Crypto),
        Platform("reddit", "r-cryptomarkets",
                 "cryptomarkets", TickerType.Crypto),
        Platform("reddit", "r-crypto_currency_news",
                 "crypto_currency_news", TickerType.Crypto),
        Platform("reddit", "r-cryptocurrencies",
                 "cryptocurrencies", TickerType.Crypto),
    ]
}


def run(platforms: List[Platform]):

    tickers = get_tickers(platforms[0].type)

    for (text, mention) in stream(platforms):
        mentioned_tickers = helper.find_mentioned_tickers(text, tickers)

        for t in mentioned_tickers:
            # find sentiment here
            m = mention.copy_for_ticker(t.symbol, Sentiment.Neutral)
            db.save_single_mention(m)


def find(arr: List, pred):
    return next(filter(pred, arr), None)


def get_platform(platform_wanted: str) -> Platform:
    if (platform := find(available_platforms["stock"],
                         lambda p: p.display == platform_wanted)) is not None:
        return platform
    elif (platform := find(available_platforms["crypto"],
                           lambda p: p.display == platform_wanted)) is not None:
        return platform
    elif (platform := find(available_platforms["wsb"],
                           lambda p: p.display == platform_wanted)) is not None:
        return platform
    else:
        print("what is this platform", platform_wanted)


def get_reddit_submissions(mentions: List[SingleTickerMention]) -> List[RedditSubmission]:
    unique = set((get_platform(x["platform"]), x["post_link"])
                 for x in mentions if x["platform"].startswith("r-"))

    result = []
    for (platform, id) in unique:
        if (subm := reddit.get_one_submission_by_id(
            platform=platform,
            id=id
        )) is not None:
            result.append(subm)

    return result


def yesterday():
    return dt.date.today() - dt.timedelta(1)


def fetch_market_prices():
    date = yesterday()
    tickers = get_tickers(TickerType.All)
    for market_price in market.get_stock_data(tickers, date):
        db.save_market_price(market_price)


def aggregate_tickers_and_reddit(mentions, submissions):
    daily_mentions = []

    for mention in mentions:
        d = find(daily_mentions, lambda x: x.ticker ==
                 mention["ticker"] and x.platform == mention["platform"])

        mention_submission = find(
            submissions, lambda x: mention["post_link"] == x.id)
        if not mention_submission:
            continue

        if d:
            d.bull_mention += mention["bull"]
            d.bear_mention += mention["bear"]
            d.neutral_mention += mention["neutral"]
            d.num_of_posts += mention["head"]
            if not find(d.links, lambda x: mention["post_link"] == x.id):
                d.links.append(mention_submission)
        else:
            d = DailyTickerMention(
                platform=mention["platform"],
                date=mention["day"],
                ticker=mention["ticker"],
                bull_mention=mention["bull"],
                bear_mention=mention["bear"],
                neutral_mention=mention["neutral"],
                num_of_posts=mention["head"],
                links=[mention_submission],
            )
            if "open" in mention:
                d.open = mention["open"]
                d.close = mention["close"]

            daily_mentions.append(d)

    return daily_mentions


def add_market_to_mentions(mentions, date):
    market_prices = db.get_market_prices(date)
    for mention in mentions:
        platform = get_platform(mention["platform"])
        is_crypto = platform.type == TickerType.Crypto

        market_price = find(
            market_prices,
            lambda x: x["is_crypto"] == is_crypto and x["ticker"] == mention["ticker"]
        )

        if market_price:
            mention["open"] = market_price["open"]
            mention["close"] = market_price["close"]

    return mentions


def aggregate_for_yesterday():
    day = yesterday().strftime("%Y-%m-%d")
    temp_mentions = db.get_all_temp_mentions(day)
    reddit_submissions = get_reddit_submissions(temp_mentions)

    temp_mentions = add_market_to_mentions(temp_mentions, day)
    daily = aggregate_tickers_and_reddit(
        temp_mentions, reddit_submissions)

    db.save_daily_tickers(daily)

    db.delete_temp_mentions(day)


def main():
    try:
        if len(sys.argv) > 1:
            command = sys.argv[1]
        else:
            command = 'help'

        if command == "help":
            print("""
    commands:

        market:
            fetches yesterday's market prices for all tickers (stocks and cryptos)
        aggregate:
            aggregates yesterday's mentions with market prices and reddit post scores
        sentiment <platform>:
            starts fetchign real-time data from given platform.
            platform: 
                can be either wsb, crypto or stock
        help:
            prints this text""")
        elif command == "market":
            fetch_market_prices()
        elif command == "aggregate":
            aggregate_for_yesterday()
        elif command == "sentiment":
            if len(sys.argv) > 2 and (platform := sys.argv[2]):
                if platform in available_platforms:
                    run(available_platforms[platform])
                else:
                    print(
                        'we do not support that platform. try other platforms: stock, crypto or wsb')

            else:
                print(
                    'we do not support that platform. try other platforms: stock, crypto or wsb')
        else:
            print("cannot understand what you want. try running help?")
    except Exception:
        with open("error-log.txt", "a") as f:
            f.write(str(dt.datetime.now()) + "\n")
            traceback.print_exc(file=f)
        time.sleep(30)
        main()

if __name__ == '__main__':
    main()

