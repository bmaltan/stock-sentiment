from dotenv import load_dotenv
from typing import List, Set
import praw
from psaw import PushshiftAPI
import os
from collections import Counter
import re
from dataclasses import dataclass, field
import datetime as dt
import json
from firebase_admin import initialize_app
from firebase_admin import credentials
from firebase_admin import db
import requests
import logging

handler = logging.StreamHandler()
handler.setLevel(logging.INFO)

for name in ('psaw', 'praw', 'prawcore'):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)


load_dotenv()

firebase_cred = credentials.Certificate('./service_account_credentials.json')
firebase_app = initialize_app(firebase_cred, {
    'databaseURL': 'https://bs-invest-track-default-rtdb.europe-west1.firebasedatabase.app'
})


r = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    username=os.getenv('REDDIT_USERNAME'),
    password=os.getenv('REDDIT_PASSWORD'),
    user_agent='test_test',
)
reddit = PushshiftAPI(r)

subreddits = [
    'investing',
    'pennystocks',
    'stocks',
    'stockmarket',
    'stock_picks',
    'wallstreetbets',
]


@dataclass
class Comment:
    removed: bool
    stickied: bool
    ups: int
    downs: int
    score: int
    score_hidden: int
    body: str
    id: str


def split_to_words(s: str) -> List[str]:
    s = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()]', '', s)
    s = re.sub(r'\s{2,}', ' ', s)
    return s.split()


def get_stock_data(tickers: Set[str], d: dt.datetime):
    applicable_date = str(d)[:10]
    tickers = ",".join(list(tickers))

    url = 'https://api.unibit.ai/v2/stock/historical'
    query = {
        "tickers": tickers,
        "interval": 1,
        "startDate": applicable_date,
        "endDate": applicable_date,
        "selectedFields": 'all',
        "accessKey": os.getenv("UNIBIT_API_SECRET"),
    }
    query = "&".join(f"{k}={v}" for (k, v) in query.items())
    r = requests.get(f'{url}?{query}', auth=('user', 'pass'))
    r.json()
    return r['result_data'] if 'result_data' in r else dict()


@dataclass
class Submission:
    ups: int
    downs: int
    score: int
    url: str
    body: str
    title: str
    subreddit: str
    flair: str
    total_awards: int
    comments: List[Comment] = field(default_factory=list)
    all_tickers_mentioned: Counter = field(default_factory=Counter)
    tickers_in_head: List[str] = field(default_factory=list)

    def set_comments(self, comments):
        self.comments = [Comment(
            removed=comment.removal_reason is not None,
            stickied=comment.stickied,
            ups=comment.ups,
            downs=comment.downs,
            score=comment.score,
            score_hidden=comment.score_hidden,
            body=comment.body,
            id=comment.id,
        ) for comment in comments]

    def get_post_words(self):
        return split_to_words(f'{self.body} {self.title}')

    def get_comment_words(self):
        return split_to_words(" ".join([comment.body for comment in self.comments]))

    def set_all_tickers_mentioned(self, tickers):
        all_words = self.get_post_words() + self.get_comment_words()

        self.all_tickers_mentioned = Counter(
            t["symbol"] for t in tickers if t["symbol"] in all_words)

    def set_tickers_in_head(self, tickers):
        self.tickers_in_head = list({
            t["symbol"] for t in tickers if t["symbol"] in self.get_post_words()})


def get_submissions(sub, tickers, d: dt.datetime) -> List[Submission]:
    NYC_timezone_diff = dt.timedelta(hours=6)
    d = d - NYC_timezone_diff
    subreddit_posts = reddit.search_submissions(
        after=int(d.timestamp()),
        before=int(
            (d + dt.timedelta(hours=23, minutes=59, seconds=59)).timestamp()),
        subreddit=sub,
        limit=1000,
        filter=['title', 'permalink', "total_awards_received", 'link_flair_text',
                'selftext', 'score', "ups", "downs", "removal_reason"],
    )

    submissions = []

    for post in subreddit_posts:
        removed = post.removal_reason is not None
        if removed:
            continue

        submission = Submission(
            score=post.score,
            ups=post.ups,
            downs=post.downs,
            title=post.title,
            subreddit=sub,
            flair=post.link_flair_text,
            body=post.selftext,
            url='https://www.reddit.com' + post.permalink,
            total_awards=post.total_awards_received,
        )
        post.comments.replace_more()
        comments = post.comments.list()
        submission.set_comments(comments)
        submission.set_all_tickers_mentioned(tickers)
        submission.set_tickers_in_head(tickers)
        submissions.append(submission)

    return submissions


def get_all_submissions(date: str):
    d = dt.datetime.strptime(date, "%Y-%m-%d")

    with open('./tickers.json', encoding='utf-8') as tickers_json:
        tickers = json.loads(tickers_json.read())

    for sub in subreddits:

        submissions = get_submissions(sub, tickers, d)
        all_tickers = {
            tick for s in submissions for tick in s.all_tickers_mentioned.keys()}

        if len(all_tickers) == 0:
            continue

        stock_data = get_stock_data(all_tickers, d)

        has_saved_anything = False
        for ticker in all_tickers:
            mentioned_anywhere = []
            total_mentioned_in_head = 0
            num_of_mentions = 0
            for s in submissions:
                if s.all_tickers_mentioned[ticker] > 0:
                    mentioned_anywhere.append(s)
                    num_of_mentions += s.all_tickers_mentioned[ticker]
                if ticker in s.tickers_in_head:
                    total_mentioned_in_head += 1

            if total_mentioned_in_head or mentioned_anywhere:
                has_saved_anything = True

                ticker_data = {
                    "ticker": ticker,

                    "numOfMentions": num_of_mentions,
                    "numOfPosts": total_mentioned_in_head,
                    "links": [{
                        "title": s.title,
                        "url": s.url,
                        "score": s.score,
                        "awards": s.total_awards,
                        "flair": s.flair,
                        "ups": s.ups,
                        "downs": s.downs,
                    } for s in mentioned_anywhere]
                }

                if ticker in stock_data and stock_data[ticker]:
                    ticker_data |= {
                        "openingPrice":   stock_data[ticker][0]["open"],
                        "closingPrice":   stock_data[ticker][0]["close"],
                        "high": stock_data[ticker][0]["high"],
                        "low": stock_data[ticker][0]["low"],
                    }

                db.reference(
                    f'platforms/r-{sub}/{date}/topStocks/{ticker}').set(ticker_data)

        if has_saved_anything:
            db.reference(
                f'platformMetadata/r-{sub}/availableDates').push().set(date)


get_all_submissions(date="2021-01-25")
