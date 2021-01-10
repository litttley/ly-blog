use std::borrow::Cow;
use std::fmt::{self, Debug, Display};

use actix_web::{
    error, Error, http::StatusCode, HttpRequest, HttpResponse, Responder, ResponseError,
};
use anyhow::Result;
use futures::future::{ready, Ready};
use log::info;
use serde::Serialize;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ResultMsg<T = ()> {
    pub code: i32,
    pub msg: Option<Cow<'static, str>>,
    //写时复制
    pub data: Option<T>,
}

impl<T: Serialize> ResultMsg<T> {
    pub fn new() -> Self {
        Self {
            code: 200,
            msg: None,
            data: None,
        }
    }


    pub fn code(mut self, code: i32) -> Self {
        self.code = code;
        self
    }
    pub fn ok(mut self) -> Self {
        self.code = 200;
        self
    }

    pub fn error(mut self) -> Self {
        self.code = -1;
        self
    }

    pub fn msg<S: Into<Cow<'static, str>>>(mut self, msg: S) -> Self {
        self.msg = Some(msg.into());
        self
    }

    pub fn get_msg(&self) -> &str {
        self.msg.as_ref().map(|s| s.as_ref()).unwrap_or_default()
    }

    pub fn data(mut self, data: T) -> Self {
        self.data = Some(data);
        self
    }

    //打印日志
    pub fn log_to_resp(&self, req: &HttpRequest) -> HttpResponse {
        self.log(req);
        self.to_resp()
    }

    pub fn log(&self, req: &HttpRequest) {
        info!(
            "{} \"{} {} {:?}\" {}",
            req.peer_addr().unwrap(),
            req.method(),
            req.uri(),
            req.version(),
            self.code
        );
    }

    //序列化成json字符串并响应
    pub fn to_resp(&self) -> HttpResponse {
        let resp = match serde_json::to_string(self) {
            Ok(json) => HttpResponse::Ok()
                .content_type("application/json")
                .body(json),
            Err(e) => Error::from(e).into(),
        };

        resp
    }
}

impl<T: Debug + Serialize> Display for ResultMsg<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "{:?}", self)
    }
}

pub type ResultError = ResultMsg<()>;

impl<T: Debug + Serialize> ResponseError for ResultMsg<T> {
    fn status_code(&self) -> StatusCode {
        StatusCode::OK
    }
    fn error_response(&self) -> HttpResponse {
        self.to_resp()
    }
}

//实现
pub enum ResultRt<L, R> {
    Ref(L),
    T(R),
}

// 实现Responder 转换成http response
impl<T, R> Responder for ResultRt<R, ResultMsg<T>>
    where
        T: Serialize,
        R: AsRef<ResultMsg<T>>,
{
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, req: &HttpRequest) -> Self::Future {
        match self {
            ResultRt::Ref(a) => a.as_ref().respond_to(req),
            ResultRt::T(b) => b.respond_to(req),
        }
    }
}

impl<T: Serialize> Responder for ResultMsg<T> {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, req: &HttpRequest) -> Self::Future {
        (&self).respond_to(req)
    }
}

impl<T: Serialize> Responder for &ResultMsg<T> {
    type Error = Error;
    type Future = Ready<Result<HttpResponse, Error>>;

    fn respond_to(self, req: &HttpRequest) -> Self::Future {
        ready(Ok(self.log_to_resp(req)))
    }
}

// return 200 all
pub fn json_error_handler<E: std::fmt::Display + std::fmt::Debug + 'static>(
    err: E,
    req: &HttpRequest,
) -> error::Error {
    let detail = err.to_string();
    let msg = ResultMsg::new().data(()).code(400).msg(detail);
    let response = msg.log_to_resp(req);

    error::InternalError::from_response(err, response).into()
}

//404 异常
pub async fn notfound(req: HttpRequest) -> Result<HttpResponse, Error> {
    let msg = ResultMsg::new()
        .data(())
        .code(404)
        .msg("route not found");

    msg.respond_to(&req).await
}





