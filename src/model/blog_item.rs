use chrono::NaiveDateTime;

#[derive(Deserialize, Serialize, Debug)]
pub struct BlogItem {
    pub blogid: String,
    pub userid: String,
    pub content: String,
    pub content_html: String,
    pub title: String,
    pub blog_moudle: String,

}

#[derive(Deserialize, Serialize, Debug)]
pub struct BlogEidtItem {
    pub id: i32,
    pub blogid: String,
    pub userid: String,
    pub content: String,
    pub content_html: String,
    pub title: String,
    pub blog_moudle: String,
}


pub struct NewBlog<'a> {
    pub userid: &'a str,
    pub blogid: &'a str,
    pub content: &'a str,
    pub content_html: &'a str,
    pub title: &'a str,
    pub blog_moudle: &'a str,
    pub created_at: NaiveDateTime,
    pub updated_at: NaiveDateTime,
    pub created_by: &'a str,
    pub updated_by: &'a str,
    pub updated_times: i32,
    pub visit_times: i32,
    pub is_display: &'a str,
}





