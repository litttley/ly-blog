# ly-blog
个人博客/笔记

#### 主要组件及介绍
###### 1.actix-web web框架
###### 2.sqlx 数据库操作
###### 2.log4rs 日志记录 
###### 3.anyhow 错误处理

### 静态编译配置.config 中配置target.x86_64-pc-windows-msvc
`[source.crates-io]
 replace-with = 'tuna'
 [source.tuna]
 registry = "https://mirrors.tuna.tsinghua.edu.cn/git/crates.io-index.git"
 [target.x86_64-pc-windows-msvc]
 rustflags = ["-C", "target-feature=+crt-static"]`
