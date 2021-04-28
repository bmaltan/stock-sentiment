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

DROP VIEW correlation_data_last_7_days;
CREATE VIEW correlation_data_last_7_days AS 
WITH latest_day AS (
                        SELECT 
                            max(day) as upper
                        FROM daily_tickers 
                    ),
                    tickers AS (
                        select 
                            platform,
                            ticker, 
                            day, 
                            close, 
                            (
                                coalesce(neutral_mention, 0) 
                                + coalesce(bull_mention, 0) 
                                + coalesce(bear_mention, 0)
                            ) AS total_mention
                        from 
                            daily_tickers, latest_day 
                        where 
                            day BETWEEN latest_day.upper - INTERVAL '7 DAY' AND latest_day.upper
                    ),
                    most_mentioned AS (
                        select platform, ticker, sum(total_mention) as total
                        from tickers
                        group by platform, ticker
                        ORDER BY platform, total DESC
                    ),
                    limiting AS (
                        SELECT 
                            ROW_NUMBER() OVER (PARTITION BY platform ORDER BY total DESC) AS r,
                            m.*
                        FROM most_mentioned as m
                    )
                    SELECT t.platform, t.ticker, t.day, t.close, t.total_mention
                    FROM tickers t
                        JOIN limiting l
                        ON t.platform = l.platform 
                        AND t.ticker = l.ticker
                    WHERE 
                        l.r <= 20;