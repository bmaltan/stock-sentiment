from typing import List
import psycopg2
from os import getenv
from models.SingleTickerMention import SingleTickerMention
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


def get_all_temp_mentions() -> List[SingleTickerMention]:
    with psycopg2.connect(getenv("DATABASE_URL")) as conn:
        with conn.cursor() as curs:
            curs.execute("SELECT * from temp_mentions;")
            return curs.fetchall()


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


# 2020-01-14 and r-wsb
# group by ticker,
# get all post_links
# sum all numeric columns
# count rows = mention
# sum head = post
# sum bear = bear mention
# sum neutral = neutral mention
# sum bull = bull mention
# get all posts again from reddit to get total score awards, and title
