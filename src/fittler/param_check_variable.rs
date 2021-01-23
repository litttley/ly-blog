use once_cell::sync::{Lazy};

pub static PARAM_CHECK_PATH: Lazy<Vec<&'static str>> = Lazy::new(|| {
    let mut paths = Vec::new();
    /*访问计数路径*/
    paths.push("/blogListContent");
    paths
});