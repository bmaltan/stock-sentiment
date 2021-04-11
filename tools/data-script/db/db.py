from typing import List
import psycopg2
from os import getenv
import json
from models.SingleTickerMention import SingleTickerMention
from models.DailyTickerMention import DailyTickerMention
from models.Sentiment import Sentiment


def save_market_price(market_price):
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute("""INSERT INTO historical_market_price 
    (ticker, day, is_crypto, open, close) 
    VALUES (%s, %s, %s, %s, %s)
    """,
                         (
                             market_price["ticker"],
                             market_price["date"],
                             market_price["is_crypto"],
                             market_price["open"],
                             market_price["close"],
                         )
                         )


def obj_dict(obj):
    return obj.__dict__


def save_daily_tickers(daily: List[DailyTickerMention]):
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            for mention in daily:
                curs.execute("""INSERT INTO daily_tickers 
    (platform, day, ticker, open, close, num_of_posts, bull_mention, bear_mention, neutral_mention, links) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    """,
                             (
                                 mention.platform,
                                 mention.date,
                                 mention.ticker,
                                 mention.open,
                                 mention.close,
                                 mention.num_of_posts,
                                 mention.bull_mention,
                                 mention.bear_mention,
                                 mention.neutral_mention,
                                 json.dumps(mention.links, default=obj_dict),
                             )
                             )


def get_market_prices(date):
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute(
                "SELECT ticker, open, close, is_crypto from historical_market_price WHERE day = %s",
                (date,)
            )
            return [{
                "ticker": record[0],
                "open": record[2],
                "close": record[3],
                "is_crypto": record[4],
            } for record in curs]


def get_all_temp_mentions() -> List[SingleTickerMention]:
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute(
                "SELECT platform, day, ticker, post_link, head, bear, neutral, bull from temp_mentions")
            return [{
                "platform": record[0],
                "day": record[1],
                "ticker": record[2],
                "post_link": record[3],
                "head": record[4],
                "bear": record[5],
                "neutral": record[6],
                "bull": record[7],
            } for record in curs]


def delete_temp_mentions():
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute("DELETE from temp_mentions;")


def save_single_mention(mention: SingleTickerMention):
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute("""INSERT INTO temp_mentions 
    (platform, day, ticker, post_link, head, bear, neutral, bull) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """,
                         (
                             mention.platform,
                             mention.date,
                             mention.ticker,
                             mention.post_link,
                             1 if mention.is_head else 0,
                             1 if mention.sentiment == Sentiment.Bear else 0,
                             1 if mention.sentiment == Sentiment.Neutral else 0,
                             1 if mention.sentiment == Sentiment.Bull else 0,
                         )
                         )


def aggregate():
    pass


# head = (1=title or body, 0 = mention)
# sentiment = (-1 = bear, 0 = neutral, 1 = bull)
# platform date ticker post_link        head     bear  neutral   bull
# r-wsb    2020-01-14  APPL  aefahwhk   0        1     0         0
#
#
#
