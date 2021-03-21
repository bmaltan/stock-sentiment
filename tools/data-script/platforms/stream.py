from typing import Iterable, Tuple
from models.Platform import Platform
from models.SingleTickerMention import SingleTickerMention
from .reddit import stream as reddit_stream


def stream(platform: Platform) -> tuple[str, SingleTickerMention]:
    if platform.platform == 'reddit':
        for (text, mention) in reddit_stream(platform):
            yield (text, mention)
    else:
        raise ValueError('huh?? what is this ==>> ', platform)
