use std::{io};

use actix_files as fs;
use actix_web::{error, HttpRequest, HttpResponse, web};
use actix_web::http::{header, Method, StatusCode};
use log::info;

use crate::blog::controller::blog_controller;
use crate::common::controller::common_controller;

pub fn config_common_services(cfg: &mut web::ServiceConfig) {
    info!("加载页面路由......");

    // 注册网站图标
    cfg.service(common_controller::favicon)
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
        .service(web::resource(r"/{module}/pblogdetails").route(web::get().to(common_controller::public_blog_details)));
}


pub fn config_blog_services(cfg: &mut web::ServiceConfig) {
    info!("加载服务路由......");

    //注册
    cfg.service(web::resource("/signup").route(web::post().to(blog_controller::blog_signup)))
        //登录
        .service(web::resource("/signin").route(web::post().to(blog_controller::blog_signin)))
        //新建博客
        .service(web::resource("/blogsave").route(web::post().to(blog_controller::blog_save)))
        //博客列表
        .service(web::resource("/bloglistcontent").route(web::post().to(blog_controller::public_blog_list_content)))
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
        //发送邮件
        .service(web::resource("/sendmail").route(web::post().to(blog_controller::send_mail)))
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
        })));
}