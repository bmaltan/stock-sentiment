import json
from enum import Enum
from collections import namedtuple
from typing import List


class TickerType(Enum):
    Stock = 1
    Crypto = 2


Ticker = namedtuple('Ticker', ['symbol', 'type'])


def get_tickers() -> List[Ticker]:
    result = []

    with open('./tickers.json', encoding='utf-8') as tickers_json:
        stock_tickers = json.loads(tickers_json.read())
        result += [Ticker(x["symbol"], TickerType.Stock)
                   for x in stock_tickers]

    with open('./cryptos.json', encoding='utf-8') as cryptos_json:
        crypto_tickers = json.loads(cryptos_json.read())
        result += [Ticker(x["symbol"], TickerType.Crypto)
                   for x in crypto_tickers]

    return result
