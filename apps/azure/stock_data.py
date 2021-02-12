import requests
import os
import datetime as dt
from typing import Set


def get_stock_data(tickers: Set[str], d: dt.datetime):
    print('getting some stock data')
    applicable_date = str(d)[:10]
    tickers = ",".join(list(tickers))

    url = 'https://api.unibit.ai/v2/stock/historical'
    query = {
        "tickers": tickers,
        "interval": 1,
        "startDate": applicable_date,
        "endDate": applicable_date,
        "accessKey": os.getenv("UNIBIT_API_SECRET"),
    }
    query = "&".join(f"{k}={v}" for (k, v) in query.items())
    r = requests.get(f'{url}?{query}')
    json = r.json()
    if 'result_data' in json:
        return json['result_data']
    else:
        print('something went wrong with stock api', r.text)
        return dict()
