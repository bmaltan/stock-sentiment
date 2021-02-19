import praw
from psaw import PushshiftAPI
import os
from dataclasses import dataclass, field
from typing import List
import re
from collections import Counter
import datetime as dt
import time
import logging
from dotenv import load_dotenv
load_dotenv()

handler = logging.StreamHandler()
handler.setLevel(logging.INFO)

for name in ('psaw', 'praw', 'prawcore'):
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)
    logger.addHandler(handler)

r = praw.Reddit(
    client_id=os.getenv('REDDIT_CLIENT_ID'),
    client_secret=os.getenv('REDDIT_CLIENT_SECRET'),
    username=os.getenv('REDDIT_USERNAME'),
    password=os.getenv('REDDIT_PASSWORD'),
    user_agent='test_Agent_for_our_new_bot',
)
reddit = PushshiftAPI(r)


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
    s = re.sub(r'[.,\/#!$%\^&\*;:{}=\-_`~()]', ' ', s)
    s = re.sub(r'\s{2,}', ' ', s)
    return s.split()


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

    def to_link(self) -> dict:
        return {
            "t": self.title,
            "u": self.url,
            "s": self.score,
            "a": self.total_awards,
        }

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
        return split_to_words(
            " ".join([comment.body for comment in self.comments]))

    def set_all_tickers_mentioned(self, tickers):
        all_words = self.get_post_words() + self.get_comment_words()

        self.all_tickers_mentioned = Counter(
            t["symbol"] for t in tickers if t["symbol"] in all_words)

    def set_tickers_in_head(self, tickers):
        self.tickers_in_head = list({
            t["symbol"] for t in tickers if t["symbol"] in self.get_post_words()})


def get_submissions(subreddit, tickers, d: dt.datetime) -> List[Submission]:
    NYC_timezone_diff = dt.timedelta(hours=6)
    d = d - NYC_timezone_diff
    subreddit_posts = reddit.search_submissions(
        after=int(
            d.timestamp()),
        before=int(
            (d +
             dt.timedelta(
                 hours=23,
                 minutes=59,
                 seconds=59)).timestamp()),
        subreddit=subreddit,
        limit=5000,
        filter=[
            'title',
            'permalink',
            "total_awards_received",
            'link_flair_text',
            'selftext',
            'score',
            "ups",
            "downs",
            "removal_reason"],
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
            subreddit=subreddit,
            flair=post.link_flair_text,
            body=post.selftext,
            url=post.id,
            total_awards=post.total_awards_received,
        )
        time.sleep(1)
        post.comments.replace_more(limit=None)
        comments = post.comments.list()
        submission.set_comments(comments)
        submission.set_all_tickers_mentioned(tickers)
        submission.set_tickers_in_head(tickers)
        submissions.append(submission)

    return submissions
