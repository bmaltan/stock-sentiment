import re
from typing import List
from models.Ticker import InvestTicker


def split_to_words(s: str) -> List[str]:
    s = re.sub(r'[\.,\/#!\$\%\^&\*;:\+-\?{}\[\]"\'=\-_`<>~\(\)]', ' ', s)
    s = re.sub(r'\s{2,}', ' ', s)
    return s.split()


def find_mentioned_tickers(s: str, tickers: List[InvestTicker]) -> List[InvestTicker]:
    result = []

    # count ticker however many is mentioned
    for word in split_to_words(s):
        if word in tickers:
            index = tickers.index(word)
            result.append(tickers[index])

    return result
