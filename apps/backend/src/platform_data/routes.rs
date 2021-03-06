use crate::platform_data::DailyTicker;
use actix_web::{get, web, HttpResponse, Responder};
use serde_json::json;
use sqlx::PgPool;

#[get("/platforms/{platform}/availableDates")]
async fn find_available_dates(
    web::Path(platform): web::Path<String>,
    db_pool: web::Data<PgPool>,
) -> impl Responder {
    let result = DailyTicker::find_available_dates(&platform, db_pool.get_ref()).await;
    match result {
        Ok(available_dates) => HttpResponse::Ok().json(json!({ "data": available_dates })),
        _ => HttpResponse::BadRequest().body(format!(
            "Error trying to get available dates for {}",
            platform,
        )),
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

// function that will be called on new Application to configure routes for this module
pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(find_available_dates);
    cfg.service(get_platform_data);
}
