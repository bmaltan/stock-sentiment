
from typing import List
from submissions import get_submissions
import sys
import datetime as dt
import json
from stock_data import get_stock_data
import firebase


def get_all_submissions(date: str, subreddits: List[str], is_crypto: bool = False):
    d = dt.datetime.strptime(date, "%Y-%m-%d")

    file_name = './tickers.json'
    if is_crypto:
        file_name = './cryptos.json'

    with open(file_name, encoding='utf-8') as tickers_json:
        tickers = json.loads(tickers_json.read())

    stock_data = {}

    for sub in subreddits:
        print('fetching for subreddit', sub)

        submissions = get_submissions(sub, tickers, d)
        all_tickers = list({
            tick for submis in submissions for tick in submis.all_tickers_mentioned.keys()})

        if len(all_tickers) == 0:
            continue

        print('getting some stock data', sub)
        def crypto_map(x): return x + '-USD'
        def stock_map(x): return x
        stock_data |= get_stock_data(map(crypto_map if is_crypto else stock_map,
                                         filter(lambda x: x not in stock_data, all_tickers)), d)

        has_saved_anything = False
        for ticker in all_tickers:
            mentioned_anywhere = []
            total_mentioned_in_head = 0
            num_of_mentions = 0
            for submi in submissions:
                if submi.all_tickers_mentioned[ticker] > 0:
                    mentioned_anywhere.append(submi)
                    num_of_mentions += submi.all_tickers_mentioned[ticker]
                if ticker in submi.tickers_in_head:
                    total_mentioned_in_head += 1

            if total_mentioned_in_head or mentioned_anywhere:
                has_saved_anything = True

                ticker_data = {
                    "nm": num_of_mentions,
                    "np": total_mentioned_in_head,
                    "l": [s.to_link() for s in mentioned_anywhere]
                }

                if ticker in stock_data:
                    ticker_data |= {
                        "o": stock_data[ticker]["open"],
                        "c": stock_data[ticker]["close"],
                    }

                firebase.save_ticker_data(
                    subreddit=sub,
                    date=date,
                    ticker=ticker,
                    ticker_data=ticker_data,
                )

        if has_saved_anything:
            firebase.save_available_date(subreddit=sub, date=date)


def run_reddit(date, sub):
    stocks_subreddits = [
        'investing',
        'pennystocks',
        'stocks',
        'stockmarket',
        'stock_picks',
        'wallstreetbets',
        'daytrading',
        'robinhoodpennystocks',
    ]
    crypto_subreddits = [
        'cryptocurrency',
        'cryptomarkets',
        'crypto_currency_news',
        'cryptocurrencies',
    ]

    if sub is not None:
        if sub in stocks_subreddits:
            stocks_subreddits = [sub]
            crypto_subreddits = []
        elif sub in crypto_subreddits:
            crypto_subreddits = [sub]
            stocks_subreddits = []

    if stocks_subreddits:
        print('fetching reddit and stock data for subs',
              stocks_subreddits, 'for date', date)
        get_all_submissions(date, stocks_subreddits)

    if crypto_subreddits:
        print('fetching reddit and crypto data for subs',
              stocks_subreddits, 'for date', date)
        get_all_submissions(date, crypto_subreddits, True)


if __name__ == '__main__':
    arg_date = sys.argv[1]

    arg_sub = None
    if len(sys.argv) > 2:
        arg_sub = sys.argv[2]

    run_reddit(arg_date, arg_sub)
