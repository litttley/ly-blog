use std::sync::Arc;

//use sqlx::Error as SqlxError;
use actix_web::Error;
//use actix_web::web::Data;
use sqlx::mysql::MySqlPool;

pub type ConnectionPool = actix_web::web::Data<Arc<MySqlPool>>;

pub type Result<T> = std::result::Result<T, Error>;