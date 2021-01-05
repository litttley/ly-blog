use chrono::{NaiveDateTime};
use serde::{Serialize};

#[derive(Deserialize, Serialize, Debug, Clone, sqlx::FromRow)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub id: i64,
    pub url: String,
    pub visit_times: i64,
    pub updated_at: NaiveDateTime,
}