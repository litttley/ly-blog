use validator::{Validate, ValidationError};
use log::{info};
use std::borrow::Cow;

pub fn not_empty(param: &str) -> Result<(), ValidationError> {
    if "".eq(param) {
        Err(ValidationError::new("not_empty"))
    } else {
        Ok(())
    }
}

pub fn check<T>(entity: T) -> Result<(), String> where T: Validate {
    let is_err = entity.validate();
    info!("校验{:?}", is_err);
    if is_err.is_err() {
        let err = is_err.unwrap_err();
        let errs = err.field_errors();
        info!("errs:{:?}", errs);
        let mut err_message = "".to_string();
        for (key, value) in &errs {
            info!("error key: {:?} ===> error value {:?}", key, value);
            if key.eq(&String::from("email")) {
                let err_msg = errs.clone()[key][0].clone().message.map(|s| Cow::from("邮箱格式不正确")).unwrap_or(Cow::from("邮箱格式不正确"));
                let err_param_value = errs.clone()[key][0].clone().params["value"].to_string();
                err_message = format!("{}:{}-{}", err_msg, key, err_param_value);


                break;
            } else {
                let err_msg = errs[key][0].clone().message.unwrap_or(Cow::from("")).parse().unwrap_or(String::from(""));
                let err_param_value = errs.clone()[key][0].clone().params["value"].to_string();
                /*   let code = errs.clone()[key][0].clone().code;
                   if code.eq(&String::from("must_match")){
                       err_message = format!("{}:{}-{}", "", key, err_param_value);
                   }*/
                err_message = format!("{}:{}-{}", err_msg, key, err_param_value);
                break;
            }
        }
        info!("err_mag:{:?}", err_message);
        return Err(String::from(err_message));
    } else {
        return Ok(());
    }
}