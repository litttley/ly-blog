use std::task::{Context, Poll};

use actix_identity::{RequestIdentity};
use actix_service::{Service, Transform};
//use actix_session::UserSession;
use actix_web::{Error, http, HttpResponse};
use actix_web::dev::{/*ResourcePath, */ServiceRequest, ServiceResponse};
use futures::future::{Either, ok, Ready};
use log::{/*error, */info/*, warn*/};

use crate::fittler::auth_global_variable::EXCLUDE_PATH;
use crate::utils::claims;


pub struct Authentication;

impl<S, B> Transform<S> for Authentication
    where
        S: Service<Request=ServiceRequest, Response=ServiceResponse<B>, Error=Error>,
        S::Future: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = AuthenticationMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(AuthenticationMiddleware { service })
    }
}

pub struct AuthenticationMiddleware<S> {
    service: S,
}

impl<S, B> Service for AuthenticationMiddleware<S>
    where
        S: Service<Request=ServiceRequest, Response=ServiceResponse<B>, Error=Error>,
        S::Future: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type Future = Either<S::Future, Ready<Result<Self::Response, Self::Error>>>;

    fn poll_ready(&mut self, cx: &mut Context) -> Poll<Result<(), Self::Error>> {
        self.service.poll_ready(cx)
    }

    fn call(&mut self, mut req: ServiceRequest) -> Self::Future {

        let url = req.uri().path();
        let mut is_pass = false;
        for path in EXCLUDE_PATH.iter() {
            if path.ends_with("/**") {
                if url.contains(&path.clone().replace("/**", "")) {
                    is_pass = true;
                    break;
                }
            } else {
                if url.ends_with(&path.clone()) {
                    is_pass = true;
                    break;
                }
            }
        }
       info!("is_pass====>{:?}", is_pass);
        if is_pass {
            return Either::Left(self.service.call(req));
        }

        let mut user_name = String::from("");
        let identity = req.get_identity();
        info!("{:?}", req.uri());
        let mut is_effective = false;

        match identity {
            Some(token) => {
                info!("auth cookie值为：{}", token);

                if let Ok(data) = claims::decode_token(&token) {
                    user_name.push_str(data.as_str());
                    is_effective = true;
                } else {
                    is_effective = false;
                }
            }
            None => {
                is_effective = false;
            }
        }

        if is_effective {
            info!("当前用户:{:?}", user_name);
            //   if let Some(pool) = req.app_data::<ConnectionPool>() {} 注去数据库确认用户是否存在,此逻辑暂不实现
            Either::Left(self.service.call(req))
        } else {
            info!("没有访问权限,重定向/login");
            Either::Right(ok(req.into_response(
                HttpResponse::Found()
                    .header(http::header::LOCATION, "/login")
                    .finish()
                    .into_body(),
            )))
        }
    }
}
