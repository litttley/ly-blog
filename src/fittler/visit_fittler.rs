use std::task::{Context, Poll};
use actix_service::{Service, Transform};
use actix_web::dev::{ServiceRequest, ServiceResponse};
use actix_web::{Error};
use futures::future::{Either, ok, Ready};
use crate::fittler::visit_global_variable::VISIT_PATH;
use crate::blog::handler::blog_handler::{BlogHandler, BlogHandlerTrait};
use crate::config::alias::ConnectionPool;
use crate::model::config::Config;
use chrono::{Local};
use log::{info};


pub struct Views;

impl<S, B> Transform<S> for Views
    where
        S: Service<Request=ServiceRequest, Response=ServiceResponse<B>, Error=Error>,
        S::Future: 'static,
{
    type Request = ServiceRequest;
    type Response = ServiceResponse<B>;
    type Error = Error;
    type InitError = ();
    type Transform = ViewsMiddleware<S>;
    type Future = Ready<Result<Self::Transform, Self::InitError>>;

    fn new_transform(&self, service: S) -> Self::Future {
        ok(ViewsMiddleware { service })
    }
}

pub struct ViewsMiddleware<S> {
    service: S,
}


impl<S, B> Service for ViewsMiddleware<S>
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
        info!("ViewsMiddleware.........");

        let url = req.uri().path();
        let pool = req.app_data::<ConnectionPool>().expect("过滤器Views中获取数据库连接池失败！");
        let vec = VISIT_PATH.clone();


        futures::executor::block_on(async {
            use futures::stream::{StreamExt};

            let fetches = futures::stream::iter(
                vec.into_iter().filter(|visit_path| url.ends_with(visit_path)).map(|visit_path| {
                    async move {
                        let blog_handler = BlogHandler(pool.clone());
                        info!("当前访问url: {}", visit_path);
                        let config = Config {
                            id: 0,
                            url: visit_path.to_string(),
                            visit_times: 1,
                            updated_at: Local::now().naive_local(),
                        };

                        let _result = blog_handler.blog_visit(config).await;
                        ()
                    }
                })
            ).buffer_unordered(2).collect::<Vec<()>>();
            fetches.await;
        });


        return Either::Left(self.service.call(req));
    }
}