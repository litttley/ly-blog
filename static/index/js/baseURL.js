var getBaseUrl = function () {
    var ishttps = 'https:' == document.location.protocol ? true: false;
    var url=window.location.hostname;
    var port = window.location.port;

    if(ishttps){
        url='https://'+url;
        if (port!=""){
          url = url+  +':'+port
        }
    }else{
        url='http://'+url;
        if (port!=""){
            url = url  +':'+port
        }
    }
    return url
};

function get_moudle_name(){
    var str=location.href;
    var base_url =  getBaseUrl()+"/";
    var blog_moudle="";
    if(str !=""){
        blog_moudle =  str.split(base_url)[1].split("/")[0];
    }
    return blog_moudle;
}
