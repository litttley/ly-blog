$(document).ready(function() {

    toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": /*"toast-top-full-width"*/"toast-top-center",
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

    var bid_value  =  localStorage.getItem('bid');
    var bname  =  localStorage.getItem('bname');
    if (bid_value =="" || bid_value ==null || bid_value ==undefined || bname ==""|| bname==null || bname ==undefined){
        toastr['warning']("session已过期即将跳转至首页。。。");
        setTimeout("javascript:location.href='/index'", 5000);
    };
    var  blog_moudle_name =get_moudle_name();
    var url = "/"+blog_moudle_name+"/getmkdown";
    $.ajax({
        url: url,
        type:'POST',
        dataType: "json",
        data:JSON.stringify({"bid":bid_value}),
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if(data.code==200){
               /* var converter = new Markdown.Converter();*/
               /* var htm = converter.makeHtml(data.content);*/
              /*  $("#blog_id").text(bname);*/
                $("#blog_id").append(bname);
                $('#test').html(data.data.content);


            }else{
              /*  var converter = new Markdown.Converter();
                var htm = converter.makeHtml("# 文件加载失败");*/
                $('#test').html("文件加载失败");
            }


        },

        error:function(data){

            if(data.success=="true"){
                var converter = new Markdown.Converter();
                var htm = converter.makeHtml(data.content);
                $('#test').html(htm);
            }else{
                var converter = new Markdown.Converter();
                var htm = converter.makeHtml("# 文件加载失败");
                $('#test').html(htm);
            }

    }

    });
});