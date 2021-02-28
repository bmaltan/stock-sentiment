import datetime as dt
from typing import Set
from yahooquery import Ticker


def get_stock_data(tickers: Set[str], d: dt.datetime):
    result = {}
    d = d + dt.timedelta(days=1)
    d = d.strftime("%Y-%m-%d")
    for t in tickers:
        ticker = Ticker(t)
        df = ticker.history(period="1d", interval="1d",
                            start=d, end=d)
        if "open" not in df or "close" not in df:
            continue

        result[t] = {
            "open": df["open"].iloc[0],
            "close": df["close"].iloc[0],
        }

    return result
