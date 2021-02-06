from typing import List, Set
import praw
import os
from collections import Counter
import re
from dataclasses import dataclass, field
from datetime import datetime
import json
from firebase_admin import initialize_app
from firebase_admin import credentials
from firebase_admin import db
import requests

from dotenv import load_dotenv
load_dotenv()

firebase_cred = credentials.Certificate('./service_account_credentials.json')
firebase_app = initialize_app(firebase_cred, {
    'databaseURL': 'https://bs-invest-track-default-rtdb.europe-west1.firebasedatabase.app'
})


reddit = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    username=os.getenv('REDDIT_USERNAME'),
    password=os.getenv('REDDIT_PASSWORD'),
    user_agent='test_test',
)

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


def getLastFridayOf(d):
    # const d = new Date(date.getTime())

    # const day = d.getDay()
    # const diff = day <= 5 ? 7 - 5 + day: day - 5

    # d.setDate(d.getDate() - diff)
    # d.setHours(0)
    # d.setMinutes(0)
    # d.setSeconds(0)

    return d


def get_applicable_date(d):
    return d
    # applicableDate = new Date(date.getTime())

    # if (date.getDay() == 6 or date.getDay() == 0):
    #     applicableDate = getLastFridayOf(date)
    # elif (applicableDate.getHours() < 4):
    #     applicableDate.setDate(applicableDate.getDate() - 1)

    # return applicableDate.toISOString().substring(0, 10)


def get_stock_data(tickers: Set[str], d):
    applicable_date = get_applicable_date(d)
    tickers: str = ",".join(tickers)

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
    return r.json()['result_data']


@dataclass
class Submission:
    ups: int
    downs: int
    score: int
    link: str
    url: str
    body: str
    title: str
    subreddit: str
    stickied: bool
    flair: str
    likes: int
    removed: bool
    total_awards: int
    id: str
    created_at_utc: datetime
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


def get_submissions(sub, tickers) -> List[Submission]:
    # TODO: GET DATE? Which day?
    subreddit = reddit.subreddit(sub)
    hot = subreddit.hot(limit=1)

    submissions = []

    for post in hot:

        submission = Submission(
            score=post.score,
            link=post.url,
            ups=post.ups,
            downs=post.downs,
            title=post.title,
            subreddit=sub,
            likes=post.likes,
            id=post.id,
            stickied=post.stickied,
            flair=post.link_flair_text,
            body=post.selftext,
            url='https://www.reddit.com' + post.permalink,
            removed=post.removal_reason is not None,
            total_awards=post.total_awards_received,
            created_at_utc=datetime.fromtimestamp(post.created_utc),
        )
        # continue
        post.comments.replace_more(limit=0)
        comments = post.comments.list()
        submission.set_comments(comments)
        submission.set_all_tickers_mentioned(tickers)
        submission.set_tickers_in_head(tickers)
        submissions.append(submission)

    return submissions


def get_all_submissions():
    date = "2021-02-04"

    with open('./tickers.json', encoding='utf-8') as tickers_json:
        tickers = json.loads(tickers_json.read())

    for sub in subreddits:

        submissions = get_submissions(sub, tickers)
        all_tickers = {
            tick for s in submissions for tick in s.all_tickers_mentioned.keys()}

        stock_data = get_stock_data(all_tickers, datetime(2021, 2, 4))

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


get_all_submissions()
