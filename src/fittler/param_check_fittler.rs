use std::task::{Context, Poll};

use actix_identity::{RequestIdentity};
use actix_service::{Service, Transform};
use actix_web::{Error, http, HttpResponse, FromRequest, HttpRequest};
use actix_web::dev::{ServiceRequest, ServiceResponse, PayloadStream};
use futures::future::{Either, ok, Ready};
use log::{info};


use crate::fittler::auth_global_variable::EXCLUDE_PATH;
use crate::utils::claims;
use crate::fittler::param_check_variable::PARAM_CHECK_PATH;
use actix_web::web::{Json, Payload};
use crate::blog::req::blog_req::BlogListReq;
use crate::utils::validator_fn;
use crate::utils::result_msg::ResultMsg;
use std::borrow::Borrow;
use actix_web::body::ResponseBody::Body;


pub struct ParamCheck;

impl<S, B> Transform<S> for ParamCheck
    where
        S: Service<Request=ServiceRequest, Response=ServiceResponse<B>, Error=Error>,
        S::Future: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = ParamCheckMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(ParamCheckMiddleware { service })
    }
}

pub struct ParamCheckMiddleware<S> {
    service: S,
}

impl<S, B> Service for ParamCheckMiddleware<S>
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

    fn call(&mut self, req: ServiceRequest) -> Self::Future {
        info!("ParamCheckMiddleware.........");
        let url = req.uri().path();
        let mut is_check = false;
        for path in PARAM_CHECK_PATH.iter() {
            if url.ends_with(&path.clone()) {
                is_check = true;
                break;
            }
        }


        info!("000000");

        if is_check {
            info!("111111");
            let (x1, mut x2) = req.into_parts();
            let result = futures::executor::block_on(async {
                info!("33333");
                Json::<BlogListReq>::from_request(&x1, &mut x2).await.unwrap()
            });


            info!("22222{:?}", result);
            let req1 = result.0;
            let check_result = validator_fn::check(req1);
            let reqs = ServiceRequest::from_parts(x1, x2).ok().unwrap();
            match check_result {
                Ok(t) => { return Either::Left(self.service.call(reqs)); }
                Err(e) => {
                    let msg: ResultMsg<String> = ResultMsg::new().code(400).msg(e);

                    /*   let resp = match serde_json::to_string(&msg) {
                           Ok(json) => HttpResponse::Ok()
                               .content_type("application/json")
                               .body(json),
                           Err(e) => Error::from(e).into(),
                       };*/
                    let result1 = serde_json::to_string(&msg);
                    Either::Right(ok(reqs.into_response(
                        HttpResponse::Found()
                            .header(http::header::LOCATION, "/login")
                            .finish()
                            .into_body(),
                    )))
                }
            }
        } else {
            return Either::Left(self.service.call(req));
        }
    }
}
