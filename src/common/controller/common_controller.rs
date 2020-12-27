use actix_files as fs;
use actix_identity::Identity;
use actix_web::{get, HttpRequest, HttpResponse, Result, web::{/*self,*/ /*Data,*/ Path}};
use actix_web::http::StatusCode;
use log::info;

use crate::utils::claims;

/*pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(blog_login);
}*/

// 网站图标
#[get("/favicon")]
pub async fn favicon() -> Result<fs::NamedFile> {
    Ok(fs::NamedFile::open("static/favicon.ico")?)
}

// 介绍页
#[get("/index")]
pub async fn blog_index(_req: HttpRequest) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/index/index.html")))
}


pub async fn page_404(_req: HttpRequest) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/error_page/404_page.html")))
}

// 登录页
#[get("/login")]
pub async fn blog_login(_req: HttpRequest) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/login/login.html")))
}

//注册页面
#[get("/register")]
pub async fn blog_register(_req: HttpRequest) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/login/signup.html")))
}

//新建博客页面
#[get("/blognew")]
pub async fn blog_new(id: Identity) -> Result<HttpResponse> {
    let mut flag = String::from("");

    if let Some(token) = id.identity() {
        info!("token{}", &token);

        match claims::decode_token(&token) {
            Ok(token_data) => {
                info!("token_data");
                flag.push_str(token_data.trim())
            }

            Err(e) => {
                info!("Unauthorized:{:?}", e);
                flag.push_str("")
            }
        }
    } else {
        info!("error{:?}", id.identity());
    }

    if flag.is_empty() {
        Ok(
            HttpResponse::build(StatusCode::from_u16(302).unwrap())
                .header("location", "/static/error_page/page_unlogon.html")
                .finish()
        )
    } else {
        Ok(HttpResponse::build(StatusCode::OK)
            .content_type("text/html; charset=utf-8")
            .body(include_str!("../../../static/blog_list/blog_new.html")))
    }
}


//注册页面
#[get("/test_md")]
pub async fn test_md(_req: HttpRequest) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/editor.md-master/test.md")))
}


pub async fn public_blog_details(_id: Identity, _req: HttpRequest, _path: Path<(String, )>) -> Result<HttpResponse> {
    // response
    Ok(HttpResponse::build(StatusCode::OK)
        .content_type("text/html; charset=utf-8")
        .body(include_str!(
            "../../../static/blog_list/public_blog_details.html"
        )))
}

// 博客列表页
pub async fn blog_list_page(_req: HttpRequest, path: Path<(String, )>) -> HttpResponse {
    let module_name = &path.0;
    info!("{:?}", module_name);
    HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(include_str!("../../../static/blog_list/blog_list.html"))
}


pub async fn blog_edit(id: Identity, _req: HttpRequest) -> Result<HttpResponse> {
    let mut flag = String::from("");

    if let Some(token) = id.identity() {
        info!("token{}", &token);

        match claims::decode_token(&token) {
            Ok(token_data) => {
                info!("token_data");
                flag.push_str(token_data.trim())
            }

            Err(e) => {
                info!("Unauthorized:{:?}", e);
                flag.push_str("")
            }
        }
    } else {
        info!("error{:?}", id.identity());
    }


    if flag.is_empty() {
        Ok(HttpResponse::build(StatusCode::from_u16(302).unwrap()).header("location", "/static/error_page/page_unlogon.html")
            .finish())
    } else {
        // response
        Ok(HttpResponse::build(StatusCode::OK)
            .content_type("text/html; charset=utf-8")
            .body(include_str!("../../../static/blog_list/blog_edit.html")))
    }
}



