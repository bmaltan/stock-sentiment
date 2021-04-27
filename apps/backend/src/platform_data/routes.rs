use crate::platform_data::{CorrelationData, DailyTicker};
use actix_web::{get, web, Error, HttpRequest, HttpResponse, Responder};
use futures::future::{ready, Ready};
use serde::{Deserialize, Serialize};
use serde_json::json;
use sqlx::PgPool;
use std::collections::HashMap;

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

#[derive(Deserialize, Serialize)]
pub struct TickerCorrelationData {
    pub day: String,
    pub close: Option<f32>,
    pub total_mention: i32,
}

impl Responder for TickerCorrelationData {
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

#[get("/platforms/{platform}/availableDates")]
async fn find_available_dates(
    web::Path(platform): web::Path<String>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result = DailyTicker::find_available_dates(&platform, db_pool.get_ref()).await;
    match result {
        Ok(available_dates) => HttpResponse::Ok().json(json!({ "data": available_dates })),
        _ => HttpResponse::BadRequest().body("bad request"),
    }
}

#[get("/platforms/{platform}/{date}")]
async fn get_platform_data(
    web::Path((platform, date)): web::Path<(String, String)>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result = DailyTicker::find_by_date_and_platform(&platform, &date, db_pool.get_ref()).await;
    match result {
        Ok(result) => HttpResponse::Ok().json(json!({ "data": result })),
        _ => HttpResponse::BadRequest().body("bad request"),
    }
}

#[get("/platforms/{platform}/correlation")]
async fn get_correlation_last_week(
    web::Path(platform): web::Path<String>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result =
        CorrelationData::get_correlation_for_top_mentions_last_week(&platform, db_pool.get_ref())
            .await;
    match result {
        Ok(result) => {
            let mut ticker_data: HashMap<String, Vec<TickerCorrelationData>> = HashMap::new();
            result.into_iter().for_each(|data| {
                let ticker = ticker_data.entry(data.ticker).or_insert(vec![]);
                ticker.push(TickerCorrelationData {
                    day: data.day,
                    close: data.close,
                    total_mention: data.total_mention,
                });
            });
            HttpResponse::Ok().json(json!({ "data": ticker_data }))
        }
        _ => HttpResponse::BadRequest().body("bad request"),
    }
}

// function that will be called on new Application to configure routes for this module
pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_available_dates);
    cfg.service(get_correlation_last_week);
    cfg.service(get_platform_data);
}
