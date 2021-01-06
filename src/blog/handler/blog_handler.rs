use std::fs::create_dir_all;
use std::fs::File;
use std::io::{BufWriter, Write};

use anyhow::{/*Context,*/ Result};
use chrono::{Local/*, NaiveDateTime*/};
use log::{/*error, */info/*, warn*/};
//use actix_identity::Identity;
use serde_json::json;
use sqlx::{Done, Error};
use uuid::Uuid;

use crate::blog::entity::blog_page_entity::BlogListMsgs;
use crate::blog::req::blog_req::{BlogDeleteReq, BlogEidtReq, BlogListReq, GetBlogMkDownReq};
use crate::blog::resp::blog_resp::{BlogListResp, GetEditMarkDownResp, GetMarkDownResp};
use crate::config::alias::ConnectionPool;
use crate::errors::custome_error::CustomeErrors;
use crate::model::blog_item::{BlogItem, NewBlog};
use crate::model::config::Config;
//use futures::FutureExt;

pub struct BlogHandler(pub ConnectionPool);

#[async_trait]
pub trait BlogHandlerTrait {
    async fn blog_save(&self, form: BlogItem) -> Result<String, CustomeErrors>;

    async fn blog_page_list(&self, form: BlogListReq) -> Result<BlogListMsgs, CustomeErrors>;

    async fn get_blog_mkdown(&self, form: GetBlogMkDownReq) -> Result<GetMarkDownResp, CustomeErrors>;

    async fn get_edit_mkdown(&self, form: GetBlogMkDownReq) -> Result<GetEditMarkDownResp, CustomeErrors>;

    async fn blog_edit_save(&self, form: BlogEidtReq) -> Result<String, CustomeErrors>;

    async fn blog_delete(&self, form: BlogDeleteReq) -> Result<String, CustomeErrors>;

    async fn blog_visit(&self, form: Config) -> Result<String, CustomeErrors>;
}


#[cfg(any(feature = "mysql", feature = "sqlite"))]
#[async_trait]
impl BlogHandlerTrait for BlogHandler {
    async fn blog_save(&self, blog_item: BlogItem) -> Result<String, CustomeErrors> {
        let user_id = blog_item.userid.clone();
        let content = blog_item.content.clone();
        let blog_moudle = blog_item.blog_moudle.clone();
        let content_html = blog_item.content_html.clone();
        info!("handle user_id {}", &user_id);

        if user_id == "" || content == "" || blog_moudle == "" {
            return Err(CustomeErrors::CustomError(String::from("内容不能为空!")));
        }

        let my_uuid = Uuid::new_v4();
        let my_uuid = my_uuid.to_string().replace("-", "").to_uppercase();
    /*    let mut path = String::from("./static/");
        path.push_str(&user_id);

        path.push_str("/");
        path.push_str(&blog_moudle);
        let mut path2 = path.clone();
        let my_uuid = Uuid::new_v4();
        let my_uuid = my_uuid.to_string().replace("-", "").to_uppercase();

        let msg = match create_dir_all(&path) {
            Ok(_t) => {
                path.push_str("/");
                path.push_str(&my_uuid);
                path.push_str(".md");
                info!("path file{}", path);
                match File::create(path) {
                    Ok(t) => {
                        let mut f = BufWriter::new(t);
                        f.write_all(&content.as_bytes()).expect("写入文件失败");
                        json!({"success":"文件创建成功!"})
                    }
                    Err(_e) => json!({"faild":"文件创建失败，请联系管ca理员！！"})
                }
            }
            Err(_e) => json!({"faild":"文件创建失败，请联系管理员！！"})
        };


        let msg2 = match create_dir_all(&path2) {
            Ok(_t) => {
                path2.push_str("/");
                path2.push_str(&my_uuid);
                path2.push_str(".html");
                info!("path file{}", path2);
                match File::create(path2) {
                    Ok(t) => {
                        let mut f = BufWriter::new(t);
                        f.write_all(&content_html.as_bytes()).expect("写入文件失败");
                        json!({"success" :"文件成功！"})
                    }
                    Err(_e) => json!({"faild" :"文件创建失败，请联系管ca理员！！"})
                }
            }
            Err(_e) => json!({"faild":"文件创建失败，请联系管理员！！"})
        };*/


       // if msg.as_object().unwrap().contains_key("success") && msg2.as_object().unwrap().contains_key("success") {
            let new_blog = NewBlog {
                userid: &blog_item.userid,
                blogid: &my_uuid,
                content: &blog_item.content,
                created_at: Local::now().naive_local(),
                updated_at: Local::now().naive_local(),

                title: &blog_item.title,
                blog_moudle: &blog_item.blog_moudle,
                content_html: &blog_item.content_html,
                created_by: &blog_item.userid,
                updated_by: &blog_item.userid,
                updated_times: 1,
                visit_times: 1,
                is_display: "1",

            };


            sqlx::query!(
            r"
     INSERT INTO `blog_item`( `blog_id`, `user_account`, `mark_down_content`, `html_content`, `title`, `blog_moudle`, `created_at`, `updated_at`, `created_by`, `updated_by`, `is_display`) VALUES ( ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?)#",
           new_blog.blogid,
            new_blog.userid,
           new_blog.content,
            new_blog.content_html,
            new_blog.title,
            new_blog.blog_moudle,
            new_blog.created_at,
            new_blog.updated_at,
            new_blog.created_by,
            new_blog.updated_by,
            new_blog.is_display,
        )
                .execute(&***self.0)
                .await
                .map(|d| d.rows_affected())?;
            Ok(String::from("保存成功!"))
   /*     } else {
            return Err(CustomeErrors::CustomError(String::from("本地文件存储失败!")));
        }*/
    }

    async fn blog_page_list(&self, form: BlogListReq) -> Result<BlogListMsgs, CustomeErrors> {
        let blogls: Vec<BlogListResp>;

        let page = form.page as i64;
        let blog_moudle = form.blog_moudle;
        let mut count: i64 = 0;
        let offset_num = (page - 1) * 5;
        println!("offset:{}", offset_num);


        if page >= 0 && !blog_moudle.is_empty() {
            println!("select");

            let row: (i64, ) = sqlx::query_as("select count(*) from blog_item where blog_moudle = ?").bind(&blog_moudle)

                .fetch_one(&***self.0).await?;

            count = row.0;


            blogls = sqlx::query_as::<_, BlogListResp>(
                r#"
select id,blog_id,user_account,mark_down_content,html_content,title,blog_moudle,updated_at,updated_times,visit_times from blog_item where  blog_moudle = ? ORDER BY created_at DESC LIMIT 5 OFFSET ?
        "#
            ).bind(
                &blog_moudle
            ).bind(offset_num)
                .fetch_all(&***self.0) // -> Vec<Country>
                .await?;
        } else {
            blogls = Vec::new();
        }
        Ok(BlogListMsgs {
            count: count,
            message: "success".to_string(),
            blog_list: blogls,
        })
    }

    async fn get_blog_mkdown(&self, form: GetBlogMkDownReq) -> Result<GetMarkDownResp, CustomeErrors> {
        let info = sqlx::query_as::<_, GetMarkDownResp>(
            r#"
select html_content as content from blog_item where blog_id = ?
        "#
        ).bind(&form.bid)

            .fetch_one(&***self.0).await;


        let sql = "UPDATE blog_item SET visit_times=visit_times+1 WHERE blog_id = ?";
        let _result = sqlx::query(sql).bind(&form.bid).execute(&***self.0).await;

        info!("11223{:?}", info);
        if let Ok(t) = info {
            Ok(t)
        } else {
            Err(CustomeErrors::CustomError(String::from("查询失败!")))
        }
    }

    async fn get_edit_mkdown(&self, form: GetBlogMkDownReq) -> Result<GetEditMarkDownResp, CustomeErrors> {
        let info = sqlx::query_as::<_, GetEditMarkDownResp>(
            r#"
select id as id ,mark_down_content as  content ,title as title, blog_moudle  from blog_item where blog_id = ?
        "#
        ).bind(&form.bid)

            .fetch_one(&***self.0).await;

        // info!("11223{:?}", info);
        if let Ok(t) = info {
            Ok(t)
        } else {
            Err(CustomeErrors::CustomError(String::from("查询失败!")))
        }
    }


    async fn blog_edit_save(&self, form: BlogEidtReq) -> Result<String, CustomeErrors> {
        info!("进入blogeidtitem handle");
        let pk_id = form.id.clone();
        let _blogid = form.blogid.clone();
        let blog_moudle = form.blog_moudle.clone();
        let userid = form.userid.clone();
        let blog_content = form.content.clone();
        let blog_content_html = form.content_html.clone();

        if userid == "" || blog_content == "" || blog_moudle == "" {
            return Err(CustomeErrors::CustomError(String::from("内容不能为空!")));
        }


        let sql = "UPDATE blog_item SET mark_down_content = ?, html_content = ?,updated_times=updated_times+1 WHERE id = ?";
        let result = sqlx::query(sql).bind(blog_content).bind(blog_content_html).bind(pk_id).execute(&***self.0).await;
        info!("{:?}", result);
        if let Ok(_t) = result {
            Ok(String::from("保存成功!"))
        } else {
            Err(CustomeErrors::CustomError(String::from("保存失败!")))
        }
    }

    async fn blog_delete(&self, form: BlogDeleteReq) -> Result<String, CustomeErrors> {
        let sql = "DELETE FROM blog_item WHERE blog_id = ?";
        let result = sqlx::query(sql).bind(form.bid).execute(&***self.0).await;
        info!("{:?}", result);

        if let Ok(_t) = result {
            Ok(String::from("删除成功!"))
        } else {
            Err(CustomeErrors::CustomError(String::from("删除失败!")))
        }
    }

    async fn blog_visit(&self, form: Config) -> Result<String, CustomeErrors> {

       info!("blog_visit......start");
        let info = sqlx::query_as::<_, Config>(
            r#"
select * from config where url = ?
        "#
        ).bind(&form.url)

            .fetch_one(&***self.0).await;

info!("config:{:?}",info);

        if let Ok(t) = info {
            let new_times = t.visit_times + 1;
            let sql = "UPDATE config SET visit_times = ? WHERE url = ?";
            let result = sqlx::query(sql).bind(&new_times).bind(&form.url).execute(&***self.0).await;
        } else {
            sqlx::query!(
            r"
     INSERT INTO `config`( `url`, `visit_times`, `updated_at`) VALUES ( ?, ?, ?)#",
         form.url,
        form.visit_times,
        form.updated_at

        )
                .execute(&***self.0)
                .await;
        }

        info!("blog_visit......end");
        Ok("".to_string())
    }
}