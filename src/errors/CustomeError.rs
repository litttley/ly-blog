use std::io;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum CustomerError {
    #[error("errorssss the data for key {0}is not available")]
    SqlExecutionError(String),
    #[error("数据库连接异常")]
    Disconnect(String),
    #[error("无效参数 (expected {expected:?}, found {found:?})")]
    InvalidParameter {
        expected: String,
        found: String,
    },
    #[error(transparent)]
    Other(#[from] anyhow::Error),
}