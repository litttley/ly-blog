$("#submit").click(function(){

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
    var content =    testEditor.getMarkdown();
    var content_html =    testEditor.getHTML();
    console.log(content);
    var title = $("#title").val();
    $("#submit").attr("disabled",true);
    $("#submit").text("提交中..");
    var module_value="";
    $(".blog_module").each(function (index,element) {
        var value = $(this).attr("value");
        if (value !=""){
            module_value =value;
           // toastr['warning']("模块不能为空!!!");
            return false;
        }
    });
    if (title==""){
        toastr['warning']("标题不能为空。。。");
        //toastr.error("标题不能为空");
        $("#submit").attr("disabled",false);
        $("#submit").text("提交");
        return false;
    }
    if(module_value==""){
        toastr['warning']("请选择模块");
        //toastr.error("标题不能为空");
        $("#submit").attr("disabled",false);
        $("#submit").text("提交");
        return false;
    }



    var  jsondata = JSON.stringify({
        "blogid":"",
        "userid":"admin",
        "content":content,
        "content_html":content_html,
        "title":title,
        "blog_moudle":module_value
    });

    $.ajax({
        /* url: "http://127.0.0.1:80/blogsave",*/
        url:"/blogsave",
        type:'POST',
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        data:jsondata ,
        success: function (message) {
            if(message.code ==200){
                toastr.success("提交成功，即将跳转至登录页面！");
                var href_url="/"+module_value+'/blogList';
                setTimeout(function () {
                    location.href=href_url;
                }, 5000);
            }else{
                toastr.error("网络异常，请重新注册！");
                setTimeout(function(){
                    location.reload();
                }, 5000);
            }
        }
    });


});

$('#test-editormd').on("paste",function(e){
    //判断图片类型的正则
    var isImage=(/.jpg$|.jpeg$|.png$|.gif$/i);
    var e = e || event;
    //IE支持window.clipboardData,chrome支持e.originalEvent.clipboardData
    var clipboardData = e.originalEvent.clipboardData || window.clipboardData;
    if(!(clipboardData&&clipboardData.items)){
        return;
    }
//http://localhost/uploadimg?guid=1564673641404
    //判断图片类型的正则
    var isImage=(/.jpg$|.jpeg$|.png$|.gif$/i);
    for(var i=0,length=clipboardData.items.length;i<length;i++) {
        var item = clipboardData.items[i];
        if (item.kind === 'file' && isImage.test(item.type)) {
            img = item.getAsFile();
            //服务器地址
            // var url='http://localhost/uploadimg?guid=1564673641404';
            var url  = getBaseUrl()+"/uploadimg?guid=1564673641404"
            var contentE=$('#test-editormd');
            var formData=new FormData();
            //将得到的图片文件添加到FormData
            formData.append('file',img);

            //上传图片
            var xhr=new XMLHttpRequest();
            //上传结束
            xhr.open('POST',url,true);
            xhr.onload = uploadComplete; //请求完成
            xhr.onerror =  uploadFailed; //请求失败
            xhr.send(formData);
            //当剪贴板里是图片时，禁止默认的粘贴
            return false;
        }
    }



});


//上传成功响应
function uploadComplete(evt) {
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
    //服务断接收完文件返回的结果

    var data = JSON.parse(evt.target.responseText);
    if(data.success) {
        /*var contentE=$('.CodeMirror-code')[0];*/
        var _editor =   document.querySelectorAll("div.CodeMirror.cm-s-default")[0].CodeMirror;
        _editor.doc.cm.replaceSelection("![image](" + data.url + ")\r\n");
        /* var editor = CodeMirror(/!*document.getElementById("code")*!/contentE);
  document.querySelectorAll("div.CodeMirror.cm-s-default")[0].CodeMirror;
         //contentE.insertAtCaret("![image](" + data.url + ")\r\n");
         _editor.doc.cm.replaceSelection("![image](" + data.url + ")\r\n");*/
        toastr.success("图片上传成功！！！");
    }else{
        toastr.error("图片上传成功失改");
    }

}
//上传失败
function uploadFailed(evt) {
    toastr.error("图片上传成功失改");
}


$(".blog_module").on("click",function(){
    $(".blog_module").each(function (index,element) {
        $(this).removeClass();
        $(this).addClass("btn btn-primary blog_module");
        $(this).attr("value","");
    });
    $(this).removeClass("btn btn-primary");
    $(this).addClass("btn btn-red");
    var flag = $(this).attr("module_flag");
    $(this).attr("value",flag);
    //alert($(this).text())
});