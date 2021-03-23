import sys
import logging
import datetime as dt
from models.Platform import Platform
from models.TickerType import TickerType
from platforms.stream import stream
import helper
from tickers.tickers import get_tickers
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


if __name__ == '__main__':
    platform = sys.argv[1]

    if platform in available_platforms:
        index = available_platforms.index(platform)
        platform = available_platforms[index]
        run(platform)
    else:
        print('try other platforms. available ones:', available_platforms)
