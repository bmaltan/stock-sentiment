from typing import List
from .RedditSubmission import RedditSubmission


class DailyTickerMention:
    platform: str
    date: str
    ticker: str
    open: float = None
    close: float = None
    num_of_posts: int
    bull_mention: int
    bear_mention: int
    neutral_mention: int
    links: List[RedditSubmission]

    def __init__(self,
                 platform: str,
                 date: str,
                 ticker: str,
                 links,
                 bull_mention: int,
                 bear_mention: int,
                 neutral_mention: int,
                 num_of_posts: int,
                 ):
        self.links = links
        self.platform = platform
        self.date = date
        self.ticker = ticker
        self.bull_mention = bull_mention
        self.bear_mention = bear_mention
        self.neutral_mention = neutral_mention
        self.num_of_posts = num_of_posts
