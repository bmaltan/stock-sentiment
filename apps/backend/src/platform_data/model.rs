use actix_web::{Error, HttpRequest, HttpResponse, Responder};
use anyhow::Result;
use bigdecimal::ToPrimitive;
use futures::future::{ready, Ready};
use serde_json::from_value;
use sqlx::types::chrono::NaiveDate;

extern crate serde;
extern crate serde_json;

use std::fmt;
use std::marker::PhantomData;

use serde::de::{Deserialize, Deserializer, SeqAccess, Visitor};
use serde::Serialize;
use sqlx::{FromRow, PgPool};

#[derive(Serialize, Deserialize, FromRow)]
pub struct Link {
    id: String,
    title: String,
    score: i32,
    awards: i32,
}

#[derive(Serialize, Deserialize, FromRow)]
pub struct DailyTicker {
    pub platform: String,
    pub ticker: String,
    pub day: String,
    pub open: Option<f32>,
    pub close: Option<f32>,
    pub num_of_posts: i32,
    pub bull_mention: i32,
    pub bear_mention: i32,
    pub neutral_mention: i32,
    #[serde(deserialize_with = "skip_nulls")]
    pub links: Vec<Link>,
}

impl Responder for DailyTicker {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, _req: &HttpRequest) -> Self::Future {
        let body = serde_json::to_string(&self).unwrap();
        // create response and set content type
        ready(Ok(HttpResponse::Ok()
            .content_type("application/json")
            .body(body)))
    }
}

impl DailyTicker {
    pub async fn find_available_dates(platform: &str, pool: &PgPool) -> Result<Vec<String>> {
        let recs = sqlx::query!(
            r#"
                select distinct day 
                from daily_tickers 
                where platform = $1;
            "#,
            platform
        )
        .fetch_all(pool)
        .await?;

        Ok(recs
            .into_iter()
            .map(|r| r.day.to_string())
            .collect::<Vec<String>>())
    }

    pub async fn find_by_date_and_platform(
        platform: &str,
        date: &str,
        pool: &PgPool,
    ) -> Result<Vec<DailyTicker>> {
        let recs = sqlx::query!(
            r#"
                    select * 
                    from daily_tickers 
                    where platform = $1 and day = $2;
            "#,
            platform,
            NaiveDate::parse_from_str(date, "%Y-%m-%d")?,
        )
        .fetch_all(&*pool)
        .await?;

        Ok(recs
            .into_iter()
            .map(|r| DailyTicker {
                platform: r.platform,
                day: r.day.to_string(),
                ticker: r.ticker,
                open: r.open.map_or(None, |x| x.to_f32()),
                close: r.close.map_or(None, |x| x.to_f32()),
                num_of_posts: r.num_of_posts,
                bear_mention: r.bear_mention,
                bull_mention: r.bull_mention,
                neutral_mention: r.neutral_mention,
                links: r.links.map_or(vec![], |x| from_value(x).unwrap()),
            })
            .collect())
    }
}

fn skip_nulls<'de, D, T>(deserializer: D) -> Result<Vec<T>, D::Error>
where
    D: Deserializer<'de>,
    T: Deserialize<'de>,
{
    struct SkipNulls<T>(PhantomData<T>);

    impl<'de, T> Visitor<'de> for SkipNulls<T>
    where
        T: Deserialize<'de>,
    {
        type Value = Vec<T>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("array with nulls")
        }

        fn visit_seq<A>(self, mut seq: A) -> Result<Self::Value, A::Error>
        where
            A: SeqAccess<'de>,
        {
            let mut vec = Vec::new();
            while let Some(elem) = seq.next_element::<Option<T>>()? {
                vec.extend(elem);
            }
            Ok(vec)
        }
    }

    deserializer.deserialize_seq(SkipNulls(PhantomData))
}
