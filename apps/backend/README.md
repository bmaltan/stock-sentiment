# Usage

## Prerequisites

* Rust
* SQLite

Change into the project sub-directory

## Set up the database

* Create new database using `schema.sql`
* Copy `.env-example` into `.env` and adjust DATABASE_URL to match your sql address, username and password 

## Run the application

To run the application execute:

```bash
cargo run
```

By default application will be available on `http://localhost:5000`. If you wish to change address or port you can do it inside `.env` file

# to build

```bash
rustup target add x86_64-unknown-linux-musl
RUSTFLAGS='-C link-arg=-s' cargo build --release --target x86_64-unknown-linux-musl
```