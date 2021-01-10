use serde::Deserialize;
use validator::{Validate, ValidationError, ValidationErrors};
#[derive(Deserialize, Serialize, Debug,Validate)]
pub struct BlogListReq {
    pub page: usize,
    #[validate(custom(function = "crate::utils::validator_fn::valid_custom_fn", message = "参数不能为空!"))]
  //  #[serde(rename = "blogMoudle")]
    pub blog_moudle: String,
}


#[derive(Deserialize, Serialize, Debug)]
pub struct GetBlogMkDownReq {
    pub bid: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GetBlogMkDownPathReq {
    pub name: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct BlogEidtReq {
    pub id: i32,
    pub blogid: String,
    pub userid: String,
    pub content: String,
    pub content_html: String,
    pub title: String,
    pub blog_moudle: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct BlogDeleteReq {
    pub bid: String,
    pub blog_moudle: String,
    pub userid: String,
}

#[derive(Deserialize, Clone)]
pub struct Info {
    pub guid: String,
}


#[derive(Deserialize, Serialize, Debug)]
pub struct SendMailReq {
    pub mail_to_addr: String,
    pub mail_content: String,
    pub mail_title: String,
}

