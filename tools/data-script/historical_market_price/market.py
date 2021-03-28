import datetime as dt
import json
from typing import List
from yahooquery import Ticker
from models.Ticker import InvestTicker
from models.TickerType import TickerType


def get_stock_data(tickers: List[InvestTicker], d: dt.date):
    intended_day = d.strftime("%Y-%m-%d")
    date_for_api = d + dt.timedelta(days=1)
    date_for_api = date_for_api.strftime("%Y-%m-%d")

    ticker_symbols = [t.get_symbol() for t in tickers]

    query = Ticker(ticker_symbols)
    df = query.history(period="1d", interval="1d",
                       start=date_for_api, end=date_for_api,
                       adj_timezone=False, adj_ohlc=True)

    if isinstance(df, dict):
        for t in tickers:
            symbol_for_yahoo = t.get_symbol()
            if symbol_for_yahoo in df and "open" in df[symbol_for_yahoo]:
                yield {
                    "ticker": t.symbol,
                    "date": intended_day,
                    "is_crypto": t.type == TickerType.Crypto,
                    "open": df[symbol_for_yahoo]["open"].iloc[0],
                    "close": df[symbol_for_yahoo]["close"].iloc[0],
                }
            else:
                pass
                # print("cannot get stock data for", t)
    else:

        df_table = df.to_json(orient='table')
        data = json.loads(df_table)

        for t in tickers:
            symbol_for_yahoo = t.get_symbol()
            row = find_in_yahoo_query_data(
                data["data"], symbol_for_yahoo, intended_day)
            if row:
                yield {
                    "ticker": t.symbol,
                    "date": intended_day,
                    "is_crypto": t.type == TickerType.Crypto,
                    "open": row["open"],
                    "close": row["close"],
                }


def find_in_yahoo_query_data(data, symbol, date):
    for row in data:
        if row["symbol"] == symbol and row["date"].startswith(date):
            return row

    return None
