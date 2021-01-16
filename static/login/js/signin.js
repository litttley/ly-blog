$(document).ready(function () {
    $("#submit_register").click(function () {
        $("#submit_register").attr("disabled", true);
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


        var username = $("#login-username").val();
        var password = $("#login-password").val();
        var jsondata = JSON.stringify({
            "username": username,
            "password": password,
        });
        $.ajax({
            url: "/signin",
            type: 'POST',
            dataType: "json",
            contentType: "application/json;charset=utf-8",
            data: jsondata,
            success: function (data) {
                if (data.code == 200) {
                    toastr.success("登录成功，即将跳转页面！");
                    var allcookies = document.cookie;
                    console.log(allcookies);
                    setTimeout("javascript:location.href='/index'", 5000);
                } else {
                    toastr.error(data.msg);
                    setTimeout(function () {
                        location.reload();
                    }, 5000);
                }
            }
        });

    });
});