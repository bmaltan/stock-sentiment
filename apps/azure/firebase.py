
from typing import Any
from firebase_admin import initialize_app
from firebase_admin import credentials
from firebase_admin import db

firebase_cred = credentials.Certificate('./service_account_credentials.json')
firebase_app = initialize_app(firebase_cred, {
    'databaseURL': 'https://bs-invest-track-default-rtdb.europe-west1.firebasedatabase.app'
})


def save_ticker_data(subreddit: str, date: str, ticker: str, ticker_data: Any):
    db.reference(
        f'platforms/r-{subreddit}/{date}/topStocks/{ticker}').set(ticker_data)


def save_available_date(subreddit: str, date: str):
    db.reference(
        f'platformMetadata/r-{subreddit}/availableDates').push().set(date)
