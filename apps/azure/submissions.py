import praw
from psaw import PushshiftAPI
import os
from typing import List
import re
from collections import Counter
import datetime as dt
import logging
from dotenv import load_dotenv
load_dotenv()

handler = logging.StreamHandler()
handler.setLevel(logging.INFO)

for name in ('psaw', 'praw', 'prawcore'):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)


def split_to_words(s: str) -> List[str]:
    s = re.sub(r'[.,/#!$%^&\*;:+-?{}\[\]"\'=-_`<>~()]', ' ', s)
    s = re.sub(r'\s{2,}', ' ', s)
    return s.split()


class Submission:
    score: int
    id: str
    title: str
    subreddit: str
    awards: int
    all_tickers_mentioned: Counter
    tickers_in_head: List[str]

    def __init__(self, score, id, title, subreddit, awards):
        self.score = score
        self.id = id
        self.title = title
        self.subreddit = subreddit
        self.awards = awards

    def to_link(self) -> dict:
        return {
            "t": self.title,
            "u": self.id,
            "s": self.score,
            "a": self.awards,
        }

    def get_post_words(self, body):
        return split_to_words(f'{body} {self.title}')

    def get_comment_words(self, comments):
        return split_to_words(
            " ".join(comment.body for comment in comments))

    def set_all_tickers_mentioned(self, body, tickers, comments):
        all_words = self.get_post_words(
            body) + self.get_comment_words(comments)

        all_tickers = [t["symbol"] for t in tickers]
        self.all_tickers_mentioned = Counter(
            word for word in all_words if word in all_tickers)

    def set_tickers_in_head(self, tickers):
        self.tickers_in_head = list({
            t["symbol"] for t in tickers if t["symbol"] in self.get_post_words()})


def get_submissions(subreddit, tickers, d: dt.datetime) -> List[Submission]:
    praw_instance = praw.Reddit(
        client_id=os.getenv(f'REDDIT_CLIENT_ID_{subreddit}'),
        client_secret=os.getenv(f'REDDIT_CLIENT_SECRET_{subreddit}'),
        username=os.getenv(f'REDDIT_USERNAME_{subreddit}'),
        password=os.getenv(f'REDDIT_PASSWORD_{subreddit}'),
        user_agent=f'UserAgent::bs::Script::{subreddit}',
    )
    reddit_api = PushshiftAPI(praw_instance)

    NYC_timezone_diff = dt.timedelta(hours=6)
    d = d + NYC_timezone_diff
    subreddit_posts = reddit_api.search_submissions(
        after=int(
            d.timestamp()),
        before=int(
            (d +
             dt.timedelta(
                 hours=23,
                 minutes=59,
                 seconds=59)).timestamp()),
        subreddit=subreddit,
        limit=50000,
        filter=[
            'id',
            'title',
            "total_awards_received",
            'selftext',
            'score',
            "removal_reason"],
    )

    submissions = []

    submission_ids = set()
    for post in subreddit_posts:
        removed = (post.removal_reason is not None or post.selftext ==
                   '[removed]') and post.score < 10
        if removed or post.score < 0 or post.id in submission_ids:
            continue

        submission_ids.add(post.id)
        submission = Submission(
            score=post.score,
            title=post.title,
            subreddit=subreddit,
            id=post.id,
            awards=post.total_awards_received,
        )
        post.comments.replace_more(limit=None)
        comments = post.comments.list()
        submission.set_all_tickers_mentioned(post.body, tickers, comments)
        submission.set_tickers_in_head(tickers)
        submissions.append(submission)

    return submissions
