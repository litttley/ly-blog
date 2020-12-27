use std::sync::Arc;
use sqlx::mysql::MySqlPool;

pub type ConnectionPool = actix_web::web::Data<Arc<MySqlPool>>;

//pub type Result<T> = std::result::Result<T, Error>;