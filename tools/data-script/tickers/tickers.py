import json
from typing import List
from models.Ticker import InvestTicker
from models.TickerType import TickerType
import os

def get_path(filepath: str) -> str:
    script_dir = os.path.dirname(__file__)
    return os.path.join(script_dir, filepath)

def get_stocks() -> List[InvestTicker]:
    with open(get_path('../tickers.json'), encoding='utf-8') as tickers_json:
        stock_tickers = json.loads(tickers_json.read())
        stock_tickers = [InvestTicker(x["symbol"], TickerType.Stock)
                         for x in stock_tickers]
        return stock_tickers


def get_crypto() -> List[InvestTicker]:
    with open(get_path('../cryptos.json'), encoding='utf-8') as cryptos_json:
        crypto_tickers = json.loads(cryptos_json.read())
        crypto_tickers = [InvestTicker(x["symbol"], TickerType.Crypto)
                          for x in crypto_tickers]
        return crypto_tickers


def get_tickers(type: TickerType = None) -> List[InvestTicker]:
    if type == TickerType.All or type is None:
        return get_crypto() + get_stocks()
    elif type == TickerType.Crypto:
        return get_crypto()
    elif type == TickerType.Stock:
        return get_stocks()
    else:
        return []
