
from submissions import get_submissions
import sys
import datetime as dt
import json
from stock_data import get_stock_data
import firebase


def get_all_submissions(date: str, subreddits):
    d = dt.datetime.strptime(date, "%Y-%m-%d")

    with open('./tickers.json', encoding='utf-8') as tickers_json:
        tickers = json.loads(tickers_json.read())

    stock_data = {}

    for sub in subreddits:
        print('fetching for subreddit', sub)

        submissions = get_submissions(sub, tickers, d)
        all_tickers = list({
            tick for submis in submissions for tick in submis.all_tickers_mentioned.keys()})

        if len(all_tickers) == 0:
            continue

        stock_data |= get_stock_data(
            filter(lambda x: x not in stock_data, all_tickers), d)

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
    subreddits = [
        'investing',
        'pennystocks',
        'stocks',
        'stockmarket',
        'stock_picks',
        'wallstreetbets',
        'daytrading',
        'robinhoodpennystocks',
    ]
    if sub is not None and sub in subreddits:
        subreddits = [sub]

    print('fetching reddit and stock data for subs',
          subreddits, 'for date', date)
    get_all_submissions(date, subreddits)


if __name__ == '__main__':
    arg_date = sys.argv[1]

    arg_sub = None
    if len(sys.argv) > 2:
        arg_sub = sys.argv[2]

    run_reddit(arg_date, arg_sub)
