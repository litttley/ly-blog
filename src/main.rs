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
use blog::controller::blog_controller;
use fittler::auth_fittler;

/// simple index handler
#[get("/welcome")]
async fn welcome(session: Session, req: HttpRequest) -> Result<HttpResponse> {
    println!("{:?}", req);

    // session
    let mut counter = 1;
    if let Some(count) = session.get::<i32>("counter")? {
        println!("SESSION value: {}", count);
        counter = count + 1;
    }

    // set counter to session
    session.set("counter", counter)?;

    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../static/welcome.html")))
}



/// response body
async fn response_body(path: web::Path<String>) -> HttpResponse {
    let text = format!("Hello {}!", *path);

    let (tx, rx_body) = mpsc::channel();
    let _ = tx.send(Ok::<_, Error>(web::Bytes::from(text)));

    HttpResponse::Ok().streaming(rx_body)
}


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
            .wrap(IdentityService::new(
                CookieIdentityPolicy::new(secret.as_bytes())
                    .name("auth")
                    .path("/")
                    .domain(domain.as_str())
                    .max_age_time(Duration::days(1))
                    .secure(false), // this can only be true if you have https
            ))
            // 注册网站图标
            .service(common_controller::favicon)
            //博客首页
            .service(common_controller::blog_index)
            // 登录页面init_mysql_pool
            .service(common_controller::blog_login)
            // 注册页面
            .service(common_controller::blog_register)
            //新建博客页面
            .service(common_controller::blog_new)
            //博客编辑器默认加载文件
            .service(common_controller::test_md)
            //带路径参数
            .service(web::resource(r"/{module}/blogList").route(web::get().to(common_controller::blog_list_page)))

            //博客编辑页
            .service(web::resource("/{name}/blogedit").route(web::get().to(common_controller::blog_edit)))

            //博客查看页面
            .service(web::resource(r"/{module}/pblogdetails").route(web::get().to(common_controller::public_blog_details)) )

            // 注册
            .service(web::resource("/signup").route(web::post().to(blog_controller::blog_signup)))
            //登录
            .service(web::resource("/signin").route(web::post().to(blog_controller::blog_signin)))
            //新建博客
            .service(web::resource("/blogsave").route(web::post().to(blog_controller::blog_save)))
            //博客列表
            .service(web::resource("/pblogListContent").route(web::post().to(blog_controller::public_blog_list_content)))

            //博客查看页面
            .service(web::resource("/{name}/getmkdown").route(web::post().to(blog_controller::get_blog_mkdown)))


            //博客内容加载
            .service(web::resource("/geteditmkdown").route(web::post().to(blog_controller::get_edit_mkdown)))
            //博客内容更新
            .service(web::resource("/blogeditsave").route(web::post().to(blog_controller::blog_edit_save)))
            //博客删除
            .service(web::resource("/blogdelete").route(web::post().to(blog_controller::blog_delete)))

            //图片上传
            .service(web::resource("/uploadimg").route(web::post().to(blog_controller::save_file)))
            // 异步响应主体
            .service(
                web::resource("/async-body/{name}").route(web::get().to(response_body)),
            )
            .service(
                web::resource("/test").to(|req: HttpRequest| match *req.method() {
                    Method::GET => HttpResponse::Ok(),
                    Method::POST => HttpResponse::MethodNotAllowed(),
                    _ => HttpResponse::NotFound(),
                }),
            )
            .service(web::resource("/error").to(|| async {
                error::InternalError::new(
                    io::Error::new(io::ErrorKind::Other, "test"),
                    StatusCode::INTERNAL_SERVER_ERROR,
                )
            }))
            // 静态文件资源
            .service(fs::Files::new("/static", "static").show_files_listing())
            // 重定向 redirect
            .service(web::resource("/").route(web::get().to(|req: HttpRequest| {
                println!("{:?}", req);
                HttpResponse::Found()
                    .header(header::LOCATION, "/index")
                    .finish()
            })))
            // default
            .default_service(
                // 404 for GET request
                //404处理
                web::resource("")
                    .route(web::get().to(common_controller::page_404))
                    // all requests that are not `GET`
                    .route(
                        web::route()
                            .guard(guard::Not(guard::Get()))
                            .to(HttpResponse::MethodNotAllowed),
                    ),
            )
    })
        .bind("127.0.0.1:8080")?
        .run()
        .await
}