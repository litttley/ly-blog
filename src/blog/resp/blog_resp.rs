use chrono::NaiveDateTime;

#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
#[sqlx(rename_all = "snake_case")]
pub struct BlogListResp {
    pub id: i64,
    pub blog_id: String,
    pub user_account: String,
    pub mark_down_content: String,
    pub html_content: String,
    pub title: String,
    pub blog_moudle: String,
    pub created_at: NaiveDateTime,
}


#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
#[sqlx(rename_all = "camelCase")]
pub struct GetMarkDownResp {
    pub content: String
}


#[derive(Deserialize, Serialize, Debug, sqlx::FromRow)]
#[sqlx(rename_all = "camelCase")]
pub struct GetEditMarkDownResp {
    pub id: i64,
    pub content: String,
    pub title: String,
    pub blog_moudle: String,
}