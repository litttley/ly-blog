$(function(){
    $.ajax({
        url: "/pblogListContent",
        type:'GET',
        success: function (data) {
            if((data.message != undefined) && (data.message="success")){
                var blogArray = data.blog_list;
                for (var i in blogArray){
                    var divflag = '<div class="ajax-load-con content posts-default wow fadeInUp" style="visibility: hidden; animation-name: none;">';
                    divflag+='  <div class="content-box"><div class="posts-default-box"> <div class="posts-default-title"><h2>';
                    divflag+='<a  title="trendion |个人生活博客和杂志的查看详情" onclick="bloginfo( \''+blogArray[i].blogid+'\')" >trendion |个人生活博客和杂志的查看详情</a></h2></div>';
                    divflag+=' <div class="posts-default-content">';
                    divflag+='  <div class="posts-text">'+blogArray[i].content.substr(0,200)+'…</div>';
                    divflag+='  <div class="posts-default-info"> <ul><li class="ico-cat blogInfo" ><i class="icon-list-2"></i> <a  href="#" onclick="bloginfo(\''+blogArray[i].blogid+'\')" >查看详情</a></li>';
                    var date = blogArray[i].created_at.split("T")[0];
                    var time = blogArray[i].created_at.split("T")[1].split(".")[0];
                    divflag+='<li class="ico-time"><i class="icon-clock-1"></i>'+date+" "+ time+'</li>';
                    divflag+='<li class="ico-eye hidden-xs"><i class="icon-eye-4"></i> 1,533</li>';
                    divflag+='   <li class="ico-like hidden-xs"><i class="icon-heart"></i> 39</li>';
                    divflag+='   </ul></div></div></div></div></div>';
                    $("#blogContent").prepend(divflag);
                }

            }
           /* if(message.message =='success'){
                toastr.success("注册成功，即将跳转至登录页面！");
                setTimeout("javascript:location.href='/blogList'", 5000);
            }else{
                toastr.error("网络异常，请重新注册！");
                setTimeout(function(){
                    location.reload();
                }, 5000);
            }*/
        }
    });


});



function bloginfo(id) {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-full-width",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }

    window.location.href="http://127.0.0.1:80/pblogdetails?bid="+id;
   /* $.ajax({
        url: "http://127.0.0.1:80/pblogBid?bid="+id,
        type:'GET',
        success: function (message) {
          var jsonObj =   $.parseJSON( message );
            if(jsonObj.success =='true'){
                window.location.href="/pblogdetails";
            }else{
                toastr.error("网络异常，请等待页面刷新");
                setTimeout(function(){
                    location.reload();
                }, 5000);
            }
        }
    });*/



}

