var testEditor;
$(function(){

    var blog_id =   localStorage.getItem("edit_bid");
    $.ajax({
        url: '/geteditmkdown',
        type:'POST',
        dataType:"json",
        data:JSON.stringify({"bid":blog_id}),
        cache:false,
        async:false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.code==200){
                var blog_body =  data.data;
                $("#title").val(blog_body.title);
                var moudle = blog_body.blog_moudle;
                var id = blog_body.id;
                $("#table_id").val(id);
                default_moudle(moudle);
                var md =blog_body.content;
                testEditor = editormd("test-editormd", {
                    width: "100%",
                    height: 900,
                    path : '/static/editor.md-master/lib/',
                    theme :/* "dark"*/"default",
                    previewTheme : /*"dark"*/"default",
                    editorTheme : /*"pastel-on-dark"*/"default",
                    markdown : md,
                    codeFold : true,
                    //syncScrolling : false,
                    saveHTMLToTextarea : true,    // 保存 HTML 到 Textarea
                    searchReplace : true,
                    //  watch : false,                // 关闭实时预览
                    htmlDecode : "style,script,iframe|on*",            // 开启 HTML 标签解析，为了安全性，默认不开启
                    //toolbar  : false,             //关闭工具栏
                    //previewCodeHighlight : false, // 关闭预览 HTML 的代码块高亮，默认开启
                    emoji : true,
                    taskList : true,
                    tocm            : true,         // Using [TOCM]
                    tex : true,                   // 开启科学公式TeX语言支持，默认关闭
                    flowChart : true,             // 开启流程图支持，默认关闭
                    sequenceDiagram : true,       // 开启时序/序列图支持，默认关闭,
                    //dialogLockScreen : false,   // 设置弹出层对话框不锁屏，全局通用，默认为true
                    //dialogShowMask : false,     // 设置弹出层对话框显示透明遮罩层，全局通用，默认为true
                    //dialogDraggable : false,    // 设置弹出层对话框不可拖动，全局通用，默认为true
                    //dialogMaskOpacity : 0.4,    // 设置透明遮罩层的透明度，全局通用，默认值为0.1
                    //dialogMaskBgColor : "#000", // 设置透明遮罩层的背景颜色，全局通用，默认为#fff
                    imageUpload : true,
                    imageFormats : ["jpg", "jpeg", "gif", "png", "bmp", "webp"],
                    imageUploadURL : "/uploadimg",
                    onload : function() {
                        console.log('onload', this);
                        //this.fullscreen();
                        //this.unwatch();
                        //this.watch().fullscreen();

                        //this.setMarkdown("#PHP");
                        //this.width("100%");
                        //this.height(480);
                        //this.resize("100%", 640);
                    }
                });
            }

        }
    });


    $("#goto-line-btn").bind("click", function(){
        testEditor.gotoLine(90);
    });

    $("#show-btn").bind('click', function(){
        testEditor.show();
    });

    $("#hide-btn").bind('click', function(){
        testEditor.hide();
    });

    $("#get-md-btn").bind('click', function(){
        alert(testEditor.getMarkdown());
    });

    $("#get-html-btn").bind('click', function() {
        alert(testEditor.getHTML());
    });

    $("#watch-btn").bind('click', function() {
        testEditor.watch();
    });

    $("#unwatch-btn").bind('click', function() {
        testEditor.unwatch();
    });

    $("#preview-btn").bind('click', function() {
        testEditor.previewing();
    });

    $("#fullscreen-btn").bind('click', function() {
        testEditor.fullscreen();
    });

    $("#show-toolbar-btn").bind('click', function() {
        testEditor.showToolbar();
    });

    $("#close-toolbar-btn").bind('click', function() {
        testEditor.hideToolbar();
    });

    $("#toc-menu-btn").click(function(){
        testEditor.config({
            tocDropdown   : true,
            tocTitle      : "目录 Table of Contents",
        });
    });

    $("#toc-default-btn").click(function() {
        testEditor.config("tocDropdown", false);
    });

});
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
        "timeOut": "2000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    var content =    testEditor.getMarkdown();
    var content_html =    testEditor.getHTML();
    //console.log(content);
    var title = $("#title").val();
    $("#submit").attr("disabled",true);
    $("#submit").text("提交中..");
    var module_value="";
    $(".blog_module").each(function (index,element) {
        var value = $(this).attr("value");
        if (value !=""){
            module_value =value;
            return false;
        }
    });
    var blog_id =   localStorage.getItem("edit_bid");
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
        "id":parseInt($("#table_id").val()),
        "blogid":blog_id,
        "userid":"admin",
        "content":content,
        "content_html":content_html,
        "title":title,
        "blog_moudle":module_value
    });

    $.ajax({
        /* url: "http://127.0.0.1:80/blogsave",*/
        url:"/blogeditsave",
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
                }, 2000);
            }else{
                toastr.error("网络异常，请重新注册！");
                setTimeout(function(){
                    location.reload();
                }, 2000);
            }
        }
    });


});
function default_moudle(moudle) {
    $(".blog_module").each(function (index,element) {
        var flag = $(this).attr("module_flag");
        if (flag==moudle){
            $(this).addClass("btn btn-red");
            $(this).attr("value",moudle);
            return false;
        }


    });
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
            var url='http://localhost/uploadimg?guid=1564673641404';
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


