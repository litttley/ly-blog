#[derive(Deserialize, Serialize, Debug)]
pub struct BlogListReq {
    pub page: usize,
    pub blog_moudle: String,
}

#[derive(Deserialize, Serialize, Debug)]
pub struct GetBlogMkDownReq {
    pub bid: String,
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

