use jsonwebtoken::{decode, encode, Header, Validation, DecodingKey, EncodingKey};
use std::env;
use crate::errors::custome_error::CustomeErrors;


#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub    username: String,

}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserToken{
    pub    username: String,
}
// struct to get converted to token and back
//
impl Claims {
    fn with_user_name(username: &str) -> Self {
        Claims {
            username: username.to_owned(),
        }
    }
}

impl From<Claims> for UserToken {
    fn from(claims: Claims) -> Self {
        UserToken {
            username: claims.username,
        }
    }
}
pub fn create_token(data:&UserToken) -> Result<String, CustomeErrors> {
    let claims = Claims::with_user_name(data.username.as_str());
 //let ref key=   EncodingKey::from_secret(get_secret().as_bytes());
    encode(&Header::default(), &claims, &EncodingKey::from_secret(get_secret().as_bytes()))
        .map_err(|_err| CustomeErrors::CustomError("token加密异常！".to_string()))
}
pub fn decode_token(token: &str) -> Result<String, CustomeErrors> {
    let validation = Validation {
        validate_exp: false,
        ..Default::default()
    };




  //let ref decoding_key =   DecodingKey::from_secret(get_secret().as_bytes());
    decode::<Claims>(token,&DecodingKey::from_secret(get_secret().as_bytes()) , &validation)
        .map(|data| Ok(data.claims.username))
        .map_err(|_err| CustomeErrors::Unauthorized("token未授权".to_string()))?
}
fn get_secret() -> String {
    env::var("JWT_SECRET").unwrap_or_else(|_| "my secret".into())


}



