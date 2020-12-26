use actix_web::Result;
//use dotenv::dotenv;
//use crate::errors::custome_error::CustomeErrors;
use log::info;
use sqlx::mysql::MySqlPool;

#[derive(Clone)]
pub struct MysqlPools;

impl MysqlPools {
    pub async fn init_mysql_pool() -> Result<MySqlPool, sqlx::Error> {
        let db_url = dotenv::var("DATABASE_URL").expect("数据库连接未配置！");
        info!("数据库连接:{}", db_url);
        let pool = MySqlPool::connect(db_url.as_str()).await;


        pool
    }
}