use once_cell::sync::{Lazy};
use std::collections::HashMap;
pub static MAIL_CONFIG: Lazy< HashMap<&'static str, String>> = Lazy::new(|| {
    let mail_server_host = dotenv::var("mail_server_host").expect("mail_server_host must be set");
    let mail_server_port = dotenv::var("mail_server_port").expect("mail_server_port must be set");
    let mail_server_username = dotenv::var("mail_server_username").expect("mail_server_username must be set");
    let mail_server_password = dotenv::var("mail_server_password").expect("mail_server_password must be set");
    let mail_from_addr = dotenv::var("mail_from_addr").expect("mail_server_password must be set");


    let mut m = HashMap::new();
    m.insert("mail_server_host", mail_server_host);
    m.insert("mail_server_port", mail_server_port);
    m.insert("mail_server_username", mail_server_username);
    m.insert("mail_server_password", mail_server_password);
    m.insert("mail_from_addr", mail_from_addr);

    m
});