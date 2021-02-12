
from submissions import get_submissions
import sys
import datetime as dt
import json
from stock_data import get_stock_data
import firebase

subreddits = [
    'investing',
    'pennystocks',
    'stocks',
    'stockmarket',
    'stock_picks',
    'wallstreetbets',
]


def get_all_submissions(date: str):
    d = dt.datetime.strptime(date, "%Y-%m-%d")

    with open('./tickers.json', encoding='utf-8') as tickers_json:
        tickers = json.loads(tickers_json.read())

    stock_data = {}

    for sub in subreddits:
        print('fetching for subreddit', sub)

        submissions = get_submissions(sub, tickers, d)
        all_tickers = list({
            tick for s in submissions for tick in s.all_tickers_mentioned.keys()})

        if len(all_tickers) == 0:
            continue

        stock_data |= get_stock_data(
            filter(lambda x: x not in stock_data, all_tickers), d)

        has_saved_anything = False
        for ticker in all_tickers:
            mentioned_anywhere = []
            total_mentioned_in_head = 0
            num_of_mentions = 0
            for s in submissions:
                if s.all_tickers_mentioned[ticker] > 0:
                    mentioned_anywhere.append(s)
                    num_of_mentions += s.all_tickers_mentioned[ticker]
                if ticker in s.tickers_in_head:
                    total_mentioned_in_head += 1

            if total_mentioned_in_head or mentioned_anywhere:
                has_saved_anything = True

                ticker_data = {
                    "ticker": ticker,
                    "numOfMentions": num_of_mentions,
                    "numOfPosts": total_mentioned_in_head,
                    "links": [s.to_link() for s in mentioned_anywhere]
                }

                if ticker in stock_data and stock_data[ticker]:
                    stock_data_for_ticker = stock_data[ticker][1] if len(
                        stock_data[ticker]) == 2 else stock_data[ticker][0]
                    ticker_data |= {
                        "openingPrice": stock_data_for_ticker["open"],
                        "closingPrice": stock_data_for_ticker["close"],
                        "high": stock_data_for_ticker["high"],
                        "low": stock_data_for_ticker["low"],
                    }

                firebase.save_ticker_data(
                    subreddit=sub,
                    date=date,
                    ticker=ticker,
                    ticker_data=ticker_data,
                )

        if has_saved_anything:
            firebase.save_available_date(subreddit=sub, date=date)


if __name__ == '__main__':
    arg_date = sys.argv[1]
    print('fetching reddit and stock data for ', arg_date)
    get_all_submissions(date=arg_date)
