use actix_web::Result;
//use dotenv::dotenv;
//use crate::errors::custome_error::CustomeErrors;
use log::info;
use sqlx::mysql::{MySqlPool, MySqlConnectOptions, MySqlPoolOptions};
use std::str::FromStr;
use sqlx::ConnectOptions;
use std::time::Duration;

#[derive(Clone)]
pub struct MysqlPools;

impl MysqlPools {
    pub async fn init_mysql_pool() -> Result<MySqlPool, sqlx::Error> {
        let db_url = dotenv::var("DATABASE_URL").expect("数据库连接未配置！");
        info!("数据库连接:{}", db_url);
        let mut connection_options = MySqlConnectOptions::from_str(db_url.as_str())?;
        connection_options.log_statements(log::LevelFilter::Info)
            .log_slow_statements(log::LevelFilter::Info, Duration::from_secs(1));
        let pool = MySqlPoolOptions::new().connect_with(connection_options).await;

      //  MySqlPool::connect_with(connection_options).await;

      //  let pool = MySqlPool::connect(db_url.as_str()).await;


        pool
    }
}