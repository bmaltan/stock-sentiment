
from typing import List
from models.SingleTickerMention import SingleTickerMention
from models.RedditSubmission import RedditSubmission
from models.Platform import Platform
import praw
import os
import datetime as dt


def submissions_and_comments(subreddit, **kwargs):
    results = []
    results.extend(subreddit.new(**kwargs))
    results.extend(subreddit.comments(**kwargs))
    results.sort(key=lambda post: post.created_utc, reverse=True)
    return results


def get_one_submission_by_id(platform: Platform, id: str) -> praw.models.reddit.submission.Submission:
    r = get_reddit_connection(platform)
    submission = r.submission(id="39zje0")
    submission = RedditSubmission(
        score=submission.score,
        title=submission.title,
        id=submission.id,
        awards=submission.total_awards_received,
    )


def stream(platform: Platform) -> List:
    r = get_reddit_connection(platform)

    stream = praw.models.util.stream_generator(
        lambda **kwargs: submissions_and_comments(r.subreddit(platform.name), **kwargs), skip_existing=True)

    for post in stream:
        date = dt.datetime.fromtimestamp(post.created_utc)
        date = date.strftime("%Y-%m-%d")

        text: str = ''
        post_link: str = ''
        is_head: bool = False

        if isinstance(post, praw.models.reddit.comment.Comment):
            text = post.body
            post_link = post.link_id.replace("t3_", '')
            is_head = False
        elif isinstance(post, praw.models.reddit.submission.Submission):
            text = post.title + ' ' + post.selftext
            post_link = post.id
            is_head = True

        mention = SingleTickerMention(
            platform=platform.display, date=date, post_link=post_link, is_head=is_head)

        yield (text, mention)


def get_reddit_connection(platform):
    praw.Reddit(
        client_id=os.getenv(f'REDDIT_CLIENT_ID_{platform.name}'),
        client_secret=os.getenv(f'REDDIT_CLIENT_SECRET_{platform.name}'),
        username=os.getenv(f'REDDIT_USERNAME_{platform.name}'),
        password=os.getenv(f'REDDIT_PASSWORD_{platform.name}'),
        user_agent=f'UserAgent::bs::Script::{platform.name}',
    )
