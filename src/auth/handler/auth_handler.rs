use anyhow::{Result};


use crate::config::alias::ConnectionPool;
use crate::errors::custome_error::CustomeErrors;
use crate::model::user::{SignupUser, User, SigninUser};
use sqlx::Done;
//use actix_identity::Identity;

pub struct AuthHandler(pub ConnectionPool);


#[async_trait]
pub trait IUser {
    async fn user_add(&self, form: SignupUser) -> Result<String, CustomeErrors>;

    async fn user_query(&self, form: SigninUser) -> Result<User, CustomeErrors>;
}


#[cfg(any(feature = "mysql", feature = "sqlite"))]
#[async_trait]
impl IUser for AuthHandler {
    async fn user_add(&self, form: SignupUser) -> Result<String, CustomeErrors> {
        let users: Vec<User> = sqlx::query_as!(
        User,
        r#"
            select * from users
             where user_name =?
        "#,
        form.username
    )
            .fetch_all(&***self.0)
            .await?;

        if (users.len() > 0) {
            return Err(CustomeErrors::CustomError(String::from("当前用户已存在!")));
        }

        sqlx::query!(
            r#"
      INSERT INTO `users`(`user_name`, `pass_word`, `email`)
      VALUES (?, ?, ?)"#,
            form.username,
           form.password,
            form.email
        )
            .execute(&***self.0)
            .await
            .map(|d| d.rows_affected())?;

        Ok(String::from("用户创建成功"))
    }

    async fn user_query(&self, form: SigninUser) -> Result<User, CustomeErrors> {
        let user = sqlx::query_as!(
            User,
            r#"
        SELECT id, user_name, pass_word, email, created_at, updated_at,created_by,updated_by
        FROM users
        where user_name = ? and pass_word =?
                "#,
                form.username,
                form.password,

        )
            .fetch_one(&***self.0)
            .await?;

        Ok(user)
    }
}