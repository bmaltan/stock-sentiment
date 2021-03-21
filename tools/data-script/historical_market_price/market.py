import datetime as dt

from typing import Set
from yahooquery import Ticker
from ..models.Ticker import InvestTicker


def get_stock_data(tickers: Set[InvestTicker], d: dt.datetime):
    result = {}
    intended_day = d
    date_for_api = d + dt.timedelta(days=1)
    date_for_api = d.strftime("%Y-%m-%d")

    tickers = [t.symbol for t in tickers]

    query = Ticker(tickers)
    df = query.history(period="1d", interval="1d",
                       start=date_for_api, end=date_for_api,
                       adj_timezone=False, adj_ohlc=True)

    for t in tickers:
        if isinstance(df, dict):
            if "open" in df[t]:
                result[t] = {
                    "open": df[t]["open"].iloc[0],
                    "close": df[t]["close"].iloc[0],
                }
            else:
                print("cannot get stock data for", t)
        else:
            result[t] = {
                "open": df.loc[(t, intended_day)]["open"],
                "close": df.loc[(t, intended_day)]["close"],
            }

    return result
