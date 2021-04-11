
from copy import deepcopy
from .Sentiment import Sentiment


class SingleTickerMention:
    platform: str
    date: str
    post_link: str
    is_head: bool
    sentiment: Sentiment
    ticker: str

    def __init__(self, platform: str, date: str, post_link: str, is_head: bool):
        self.platform = platform
        self.date = date
        self.post_link = post_link
        self.is_head = is_head

    def copy_for_ticker(self, ticker: str, sentiment: Sentiment = None):
        new_mention = deepcopy(self)
        new_mention.ticker = ticker
        if sentiment is None:
            new_mention.sentiment = Sentiment.Neutral
        else:
            new_mention.sentiment = sentiment

        return new_mention
