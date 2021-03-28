CREATE TABLE IF NOT EXISTS daily_tickers (
    platform        VARCHAR(64) NOT NULL,
    ticker          VARCHAR(10) NOT NULL,
    day             DATE NOT NULL,         
    open            DECIMAL(18, 8),
    close           DECIMAL(18, 8),
    num_of_posts    INTEGER NOT NULL DEFAULT 0,
    bull_mention    INTEGER NOT NULL DEFAULT 0, 
    bear_mention    INTEGER NOT NULL DEFAULT 0,
    neutral_mention INTEGER NOT NULL DEFAULT 0,
    links           JSON,

    PRIMARY KEY(platform, ticker, day)
);

CREATE TABLE IF NOT EXISTS temp_mentions (
    platform        VARCHAR(64) NOT NULL,
    ticker          VARCHAR(10) NOT NULL,
    day             DATE NOT NULL,         
    post_link       VARCHAR(128),
    head            INTEGER,
    bear            INTEGER,
    neutral         INTEGER,
    bull            INTEGER
);

CREATE TABLE IF NOT EXISTS historical_market_price (
    ticker          VARCHAR(10) NOT NULL,
    day             DATE NOT NULL,
    is_crypto       BOOLEAN NOT NULL,         
    open            DECIMAL(18, 8),
    close           DECIMAL(18, 8),

    PRIMARY KEY(ticker, day, is_crypto)
);