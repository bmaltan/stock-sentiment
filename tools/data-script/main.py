import sys
import logging
import datetime as dt
from typing import List
from models.Platform import Platform
from models.TickerType import TickerType
from models.SingleTickerMention import SingleTickerMention
from models.RedditSubmission import RedditSubmission
from platforms.stream import stream
from platforms import reddit
import helper
from tickers.tickers import get_tickers
from historical_market_price import market
from models.Sentiment import Sentiment
from db import db

handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
for logger_name in ("praw", "prawcore"):
    logger = logging.getLogger(logger_name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)


available_platforms = [
    Platform("reddit", "r-investing", "investing", TickerType.Stock),
    Platform("reddit", "r-pennystocks", "pennystocks", TickerType.Stock),
    Platform("reddit", "r-stocks", "stocks", TickerType.Stock),
    Platform("reddit", "r-stockmarket", "stockmarket", TickerType.Stock),
    Platform("reddit", "r-stock_picks", "stock_picks", TickerType.Stock),
    Platform("reddit", "r-wsb", "wallstreetbets", TickerType.Stock),
    Platform("reddit", "r-daytrading", "daytrading", TickerType.Stock),
    Platform("reddit", "r-RHpennystocks",
             "robinhoodpennystocks", TickerType.Stock),
    Platform("reddit", "r-cryptocurrency",
             "cryptocurrency", TickerType.Crypto),
    Platform("reddit", "r-cryptomarkets", "cryptomarkets", TickerType.Crypto),
    Platform("reddit", "r-crypto_currency_news",
             "crypto_currency_news", TickerType.Crypto),
    Platform("reddit", "r-cryptocurrencies",
             "cryptocurrencies", TickerType.Crypto),
]


def run(platform: Platform):

    tickers = get_tickers(platform.type)

    for (text, mention) in stream(platform):
        mentioned_tickers = helper.find_mentioned_tickers(text, tickers)

        for t in mentioned_tickers:
            m = mention.copy_for_ticker(t.symbol, Sentiment.Neutral)
            db.save_single_mention(m)


def get_reddit_submissions(mentions: List[SingleTickerMention]) -> List[RedditSubmission]:

    def find_platform(platform: str) -> Platform:
        for p in available_platforms:
            if p.display == platform:
                return p

    unique = set((x["platform"], x["post_link"])
                 for x in mentions if x["platform"].startswith("r-"))

    result = []
    for (platform, id) in unique:
        if (subm := reddit.get_one_submission_by_id(
            platform=find_platform(platform),
            id=id
        )) is not None:
            result.append(subm)

    return result


def fetch_market_prices():
    yesterday = dt.date.today() - dt.timedelta(1)
    tickers = get_tickers(TickerType.All)
    for market_price in market.get_stock_data(tickers, yesterday):
        db.save_market_price(market_price)


def aggregate_for_yesterday():
    tickers = get_tickers(TickerType.All)
    temp_mentions = db.get_all_temp_mentions()
    submissions = get_reddit_submissions(temp_mentions)

    print(submissions)
    print('aggregation uuu')

    # db.delete_temp_mentions()


if __name__ == '__main__':
    command = sys.argv[1]
    if command == "help":
        print("""
commands:

    market: 
        fetches yesterday's market prices for all tickers (stocks and cryptos)
    sentiment <platform>: 
        starts fetchign real-time data from given platform. 
    help: 
        prints this text""")
    elif command == "market":
        fetch_market_prices()
    elif command == "aggregate":
        aggregate_for_yesterday()
    elif command == "sentiment":
        if len(sys.argv) > 2 and (platform := sys.argv[2]) and platform in available_platforms:
            index = available_platforms.index(platform)
            platform = available_platforms[index]
            run(platform)
        else:
            print('we do not support that platform. try other platforms. currently available ones:',
                  available_platforms)
    else:
        print("cannot understand what you want. try running help?")
