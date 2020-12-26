use chrono::{NaiveDateTime};
use serde::{Serialize};






#[derive(Deserialize,Serialize, Debug,Clone)]
#[serde(rename_all = "camelCase")]
pub struct User {
    pub id: i64,
    pub user_name: Option<String>,
    pub pass_word: Option<String>,
    pub email: Option<String>,
    pub created_at: Option<NaiveDateTime> ,
    pub updated_at: Option<NaiveDateTime>,
    pub created_by: Option<String>,
    pub updated_by: Option<String>,
}







#[derive(Deserialize,Serialize, Debug)]
pub struct SignupUser {
    pub username: String,
    pub email: String,
    pub password: String,
    pub confirm_password: String,
}

#[derive(Deserialize,Serialize, Debug)]
pub struct SigninUser {
    pub username: String,
    pub password: String,

}





