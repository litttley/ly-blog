
$(document).ready(function() {
    $("#submit_register").click(function(){
        $("#submit_register").attr("disabled",true);
        $("#submit_register").text("提交中..");

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


        var username = $("#signup-username").val();
        var email = $("#signup-email").val();
        var password = $("#signup-password").val();
        var confirm_password = $("#confirm_password").val();
        if( password =="" ||  confirm_password==""){
            toastr.warning("密码不能为空！！！");
            $("#submit_register").attr("disabled",false);
            $("#submit_register").text("注册");
            return  false;
        }
        if(password != confirm_password  ){
            toastr.warning("密码输入不致，请重新填写！！");
            $("#submit_register").remove("disabled");
            $("#submit_register").attr("disabled",false);
            return false;
        }
        var  jsondata = JSON.stringify({
            "username":username,
            "email":email,
            "password":password,
            "confirm_password":confirm_password
        });
        $.ajax({
            url: "/signup",
            type:'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data:jsondata ,
            success: function (message) {
                alert(message);
                if(message.message =='success'){
                    toastr.success("注册成功，即将跳转至登录页面！");




                   setTimeout("javascript:location.href='/login'", 5000);
                }else{
                    toastr.error("网络异常，请重新注册！");
                    setTimeout(function(){
                        location.reload();
                    }, 5000);
                }
            }
        });

    });
});
