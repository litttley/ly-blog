use once_cell::sync::{Lazy};


pub static EXCLUDE_PATH: Lazy<Vec<&'static str>> = Lazy::new(|| {
    let mut paths = Vec::new();
    //放行路径
    paths.push("/static/**");
    paths.push("/favicon");
    paths.push("/index");
    paths.push("/login");
    paths.push("/register");
    paths.push("/blognew");
    paths.push("/test_md");
    paths.push("/unauth");
    paths.push("/blogList");
    paths.push("/blogedit");
    //  paths.push("/bloglistcontent");
    paths.push("/signup");
    paths.push("/signin");
    paths.push("/sendmail");
    paths.push("/");

    paths
});