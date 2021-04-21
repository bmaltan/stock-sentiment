use actix_web::{App, HttpServer};
use dotenv::dotenv;
use sqlx::postgres::PgPoolOptions;
use std::env;
#[macro_use]
extern crate serde_derive;

mod platform_data;

#[actix_rt::main]
async fn main() -> std::result::Result<(), anyhow::Error> {
    dotenv().ok();
    env_logger::init();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_pool = PgPoolOptions::new()
        .max_connections(8)
        .connect(&database_url)
        .await?;

    let host = env::var("HOST").expect("HOST is not set in .env file");
    let port = env::var("PORT").expect("PORT is not set in .env file");
    HttpServer::new(move || {
        App::new()
            .data(db_pool.clone()) // pass database pool to application so we can access it inside handlers
            .configure(platform_data::init) // init platform_data routes
    })
    .bind(format!("{}:{}", host, port))?
    .run()
    .await?;

    Ok(())
}
