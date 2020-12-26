
use crate::blog::resp::blog_resp::{BlogListResp};
#[derive(Deserialize,Serialize, Debug)]
pub struct BlogListMsgs {
    pub count: i64,
    pub message : String,
    pub blog_list: Vec<BlogListResp>,
}