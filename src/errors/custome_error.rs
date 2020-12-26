use sqlx::Error as DatabaseError;
//use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum CustomeErrors {
    /*    #[error("errorssss the data for key {0}is not available")]
        SqlExecutionError(String),
        #[error("数据库连接异常")]
        Disconnect(String),
        #[error("无效参数 (expected {expected:?}, found {found:?})")]
        InvalidParameter {
            expected: String,
            found: String,
        },*/
    #[error("自定错误：{0}")]
    CustomError(String),

    #[error("未授权：{0}")]
    Unauthorized(String),

    #[error("数据库查询异常:{0}!")]
    Database(#[from] DatabaseError),

    #[error(transparent)]
    Other(#[from] anyhow::Error),
}


