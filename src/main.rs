use actix_files as fs;
use actix_session::{CookieSession, Session};
use actix_utils::mpsc;
use actix_web::http::{header, Method, StatusCode};
use actix_web::{
    error, get, guard, middleware, web, App, Error, HttpRequest, HttpResponse,
    HttpServer, Result,
};

/*#[macro_use]
extern crate sqlx;*/

#[macro_use]
extern crate async_trait;

#[macro_use]
extern crate serde;

use std::{env, io};
//use sqlx::mysql::{MySqlPool};
//use thiserror;
use std::sync::Arc;
//use actix_identity::Identity;
use actix_identity::{CookieIdentityPolicy, IdentityService/*,RequestIdentity*/};
//use chrono::Duration;

use time::Duration;


mod config;
mod errors;
mod auth;
mod common;
mod blog;
mod model;
mod utils;
mod fittler;

use config::mysql_config;
use mysql_config::MysqlPools;
//use log::{error, info, warn};
use log4rs;

use common::controller::common_controller;
use fittler::{auth_fittler, visit_fittler};
use utils::constants;

#[actix_web::main]
async fn main() -> io::Result<()> {
    env::set_var("RUST_LOG", "actix_web=debug,actix_server=info");
    // env_logger::init();

    log4rs::init_file("log4rs.yaml", Default::default()).unwrap();
    let result = MysqlPools::init_mysql_pool().await;
    let pool = result.expect("连接池初始化失败！");
    let pool_data = Arc::new(pool);//Arc 可跨线程传递，用于跨线程共享一个对象；

    let secret: String = std::env::var("SECRET_KEY").unwrap_or_else(|_| "0123".repeat(8));
    let domain: String = std::env::var("DOMAIN").unwrap_or_else(|_| "localhost".to_string());

    HttpServer::new(move || {
        App::new()
            //数据库连接池
            .data(pool_data.clone())

            // cookie会话中间件
            .wrap(CookieSession::signed(&[0; 32]).secure(false))
            //启用记录器-始终最后注册actix-Web Logger中间件
            .wrap(middleware::Logger::default())
            //登录拦截器
            .wrap(auth_fittler::Authentication)
            .wrap(visit_fittler::Views)
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(secret.as_bytes())
                    .name(constants::AUTHORIZATION)
                    .path("/")
                    .domain(domain.as_str())
                    .max_age_time(Duration::days(1))
                    .secure(false), // this can only be true if you have https
            ))
            //注册页面路由
            .configure(config::app::config_common_services)
            //注册服务路由
            .configure(config::app::config_blog_services)
            // default
            .default_service(web::route().to(common_controller::page_404))
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}