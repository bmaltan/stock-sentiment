import psycopg2
from os import getenv

conn = psycopg2.connect(getenv("DATABASE_URL"))

cur = conn.cursor()

cur.execute("""INSERT INTO temp_daily 
(platform, date, ticker, post_link, head, bear, neutral, bull) 
VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
""",
            (100, "abc'def"))




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
