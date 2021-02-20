fetch_reddit_stocks() {
    yesterdate="$(date -d "yesterday 13:00" '+%Y-%m-%d')"

    echo "$yesterdate"

    pipenv run python reddit.py $yesterdate investing &
    pipenv run python reddit.py $yesterdate pennystocks &
    pipenv run python reddit.py $yesterdate stocks &
    pipenv run python reddit.py $yesterdate stockmarket &
    pipenv run python reddit.py $yesterdate stock_picks &
    pipenv run python reddit.py $yesterdate wallstreetbets &
    pipenv run python reddit.py $yesterdate daytrading &
    pipenv run python reddit.py $yesterdate robinhoodpennystocks
}

fetch_reddit_stocks