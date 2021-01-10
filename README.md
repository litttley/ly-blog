# ly-blog
个人博客/笔记

#### 主要组件及介绍
###### 1.actix-web web框架
###### 2.sqlx 数据库操作

数据库连接池日志级别 
`  let mut connection_options = MySqlConnectOptions::from_str(db_url.as_str())?;
         connection_options.log_statements(log::LevelFilter::Info)
             .log_slow_statements(log::LevelFilter::Info, Duration::from_secs(1));
         let pool = MySqlPoolOptions::new().connect_with(connection_options).await;`
         
         
| regular        | query format   |  slow query format  |
| --------   | -----:  | :----:  |
| off      | ___   |   ___     |
| trace       |   full query, interpolated    |   full query, interpolated   |
| debug       |    short summary + parameters     |  short summary + parameters  |
| info        |    short summary     |  short summary + parameters  |
| warn        |    short summary     |  short summary + parameters  |
| error       |    short summary    |  short summary + parameters |
 		
 	 	
 	 	
 	 	
###### 2.log4rs 日志记录 
###### 3.anyhow 错误处理



###  发布相关
静态编译配置.config 中配置target.x86_64-pc-windows-msvc

`[source.crates-io]
 replace-with = 'tuna'
 [source.tuna]
 registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
 [target.x86_64-pc-windows-msvc]
 rustflags = ["-C", "target-feature=+crt-static"]`
