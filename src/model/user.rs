use chrono::{NaiveDateTime};
use serde::{Serialize};
use validator::{Validate, ValidationError};


#[derive(Deserialize, Serialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: i64,
    pub user_name: Option<String>,
    pub pass_word: Option<String>,
    pub email: Option<String>,
    pub created_at: Option<NaiveDateTime>,
    pub updated_at: Option<NaiveDateTime>,
    pub created_by: Option<String>,
    pub updated_by: Option<String>,
}


#[derive(Deserialize, Serialize, Debug, Validate)]
pub struct SignupUser {
    #[validate(custom(function = "crate::utils::validator_fn::not_empty", message = "参数不能为空!"))]
    pub username: String,
    #[validate(email)]
    pub email: String,
    #[validate(custom(function = "crate::utils::validator_fn::not_empty", message = "参数不能为空!"))]
    pub password: String,
    #[validate(must_match(other = "password"))]
    pub confirm_password: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct SigninUser {
    pub username: String,
    pub password: String,

}





