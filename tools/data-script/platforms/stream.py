from typing import List
from models.Platform import Platform
from models.SingleTickerMention import SingleTickerMention
from .reddit import stream as reddit_stream


def stream(platforms: List[Platform]) -> tuple[str, SingleTickerMention]:
    if platforms[0].platform == 'reddit':
        for (text, mention) in reddit_stream(platforms):
            yield (text, mention)
    else:
        raise ValueError('huh?? what is this ==>> ', platforms)
