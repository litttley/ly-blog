use crate::errors::custome_error::CustomeErrors;
use crate::config::mail_config::MAIL_CONFIG;
use std::ops::Deref;

use lettre::smtp::authentication::{Credentials, Mechanism};
use lettre::smtp::ConnectionReuseParameters;
use lettre::{SmtpClient, Transport};
use lettre_email::Email;

#[derive(Debug, Serialize, Deserialize)]
pub struct MailUtils {
    pub mail_server_host: String,
    pub mail_server_username: String,
    pub mail_server_password: String,
    pub mail_to_addr: String,
    pub mail_from_addr: String,
    pub mail_content: String,
    pub mail_title: String,

}

impl MailUtils {
    pub fn new( mail_to_addr: String, mail_content: String, mail_title: String) -> Self {
        MailUtils {
            mail_server_host: MAIL_CONFIG.get("mail_server_host").unwrap().clone(),
            mail_server_username: MAIL_CONFIG.get("mail_server_username").unwrap().clone(),
            mail_server_password: MAIL_CONFIG.get("mail_server_password").unwrap().clone(),
            mail_to_addr,
            mail_from_addr:MAIL_CONFIG.get("mail_from_addr").unwrap().clone(),
            mail_content,
            mail_title,
        }
    }

    pub fn send_mail(&self) -> Result<String, CustomeErrors> {
        let email = Email::builder()
            .to(self.mail_to_addr.clone())
            .from(self.mail_from_addr.clone())
            .subject(self.mail_title.clone())
            .text(self.mail_content.clone())
            .build()
            .unwrap();

        let mut mailer = SmtpClient::new_simple(&self.mail_server_host.deref())
            .unwrap()
            .smtp_utf8(true)
            .credentials(Credentials::new(self.mail_server_username.clone(),
                                          self.mail_server_password.clone(),
            ))
            .authentication_mechanism(Mechanism::Plain)
            .connection_reuse(ConnectionReuseParameters::ReuseUnlimited)
            .transport();

        // 发送邮件
        let result = mailer.send(email.into());
        mailer.close();

        match result {
            Ok(_t) => Ok(String::from("发送成功!")),
            Err(_e) => Err( CustomeErrors::CustomError(String::from("发送失败")))
        }
    }
}