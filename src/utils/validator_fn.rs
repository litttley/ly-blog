use validator::{Validate, ValidationError};
use log::{info};
pub fn check<T>(entity: T) -> Result<(), String> where T : Validate {
    let is_err = entity.validate();
    info!("校验{:?}", is_err);
    if is_err.is_err() {
        let err = is_err.unwrap_err();
        let errs = err.field_errors();
        info!("errs:{:?}", errs);
        let err_mag = errs["blog_moudle"][0].clone().message.unwrap();
        info!("err_mag:{:?}", err_mag);
        return Err(String::from(err_mag));
    } else {
        return Ok(());
    }
}


pub fn valid_custom_fn(param: &str) -> Result<(), ValidationError> {
    if "".eq(param) {
        Err(ValidationError::new("meh"))
    } else {
        Ok(())
    }
}