$(function () {
    init_page();

});

//初始下方分页现示
function init_page_html(page_int, page_num, mark) {
    //page_list:每页要显示的条数
    var page_list = 5;
    //记录显示
    var start_num = (page_int - 1) * page_list + 1;
    var end_num = (page_int - 1) * page_list + 1 + page_num % page_list;//不足1页数据
    var end_num_full = (page_int - 1) * page_list + page_list;
    if (page_num != 0 && page_num % page_list > 0 && page_num % page_list < page_list) {//一页记录不足3条时
        if (start_num > page_num) {
            $("#page_count").text("无数据");
        } else {
            var end_num = end_num - 1;
            if (page_int * page_list < page_num) {

                $("#page_count").text("第" + start_num + "-" + end_num_full + "条 共" + page_num + "条");
            } else {
                $("#page_count").text("第" + start_num + "-" + end_num + "条 共" + page_num + "条");
            }

        }

    } else {
        if (start_num > page_num) {
            $("#page_count").text("无数据");
        } else {
            $("#page_count").text("第" + start_num + "-" + end_num_full + "条 共" + page_num + "条");
        }

    }

    //初始化页码
    if (page_int < 5) {//5为5页为一组
        $(".page_li").removeClass("active");
        $(".pagenum").each(function (index, element) {
            let flag = $(this).attr("flag");
            //let flag = element.getAttribute("flag");
            let flag_new = parseInt(page_int) + index;
            $(this).text(flag_new + "");

            if (index == 0) {
                $(this).parent().addClass("active");
            }
            $(this).attr("flag", "" + flag_new);
            //console.log(element.getAttribute("flag"));

        });
    } else {
        $(".page_li").removeClass("active");
        $(".pagenum").each(function (index, element) {
            let flag = $(this).attr("flag");
            //let flag = element.getAttribute("flag");
            let flag_new = parseInt(page_int) + index;
            $(this).text(flag_new + "");

            if (index == 0) {
                $(this).parent().addClass("active");
            }
            $(this).attr("flag", "" + flag_new);
            //console.log(element.getAttribute("flag"));

        });

    }

}

function ajaxData(pageInt, blogMoudle, mark) {
    $.ajax({
        url: '/bloglistcontent',
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({"page": pageInt, "blogMoudle": blogMoudle}),
        cache: false,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            if (data.code == 200) {
                var blogArray = data.data.blog_list;
                var page_num = data.data.count;
                var page_int = parseInt(page_num/5)+1　 ;
                $("#blogContent").empty();
                for (var i in blogArray) {
                    /*  <tr>
                          <td class="topic"><i class="fa fa-star"></i> <a href="/pblogdetails">UX review process</a> <span class="label label-success">NEW</span></td>
                          <td class="posts">3 <br><span class="note">Posts</span></td>
                          <td class="poster"><a href="#"><img class="profile" src="/static/assets/images/profiles/profile-15.png" alt=""></a></td>
                          <td class="views">1,326<br><span class="note">Views</span></td>
                          <td class="updated">Last posted by <a href="#">Alice White</a><br>12 mins ago</td>
                          </tr>*/
                    /*onclick="bloginfo( \''+blogArray[i].blogid+'\',\''+blogArray[i].title+'\')"*/
                    var tr_flag = '<tr > '
                    tr_flag += ' <td class="topic"><i class="fa fa-star"></i> <a >' + blogArray[i].title + '</a> <span class="label label-success">NEW</span></td>';
                    tr_flag += ' <td class="posts">' + blogArray[i].updated_times + ' <br><span class="note">更新次数</span></td>';
                    tr_flag += '<td class="poster"><a href="#"><img class="profile" src="/static/assets/images/profiles/mycat.jpg" alt=""></a></td>';
                    tr_flag += '<td class="views">' + blogArray[i].visit_times + '<br><span class="note">流览量</span></td>';
                    var date = blogArray[i].updated_at.split("T")[0];
                    var time = blogArray[i].updated_at.split("T")[1].split(".")[0];
                    tr_flag += '<td class="updated">最近 <a href="#">更新时间</a><br>' + date + " " + time + '</td>';
                    tr_flag += '<td class="edit">  <a onclick="bloginfo( \'' + blogArray[i].blog_id + '\',\'' + blogArray[i].title + '\')">查看</a>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="blogEdit( \'' + blogArray[i].blog_id + '\',\'' + blogArray[i].title + '\')">编辑</a>&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '<a onclick="blogDelte( \'' + blogArray[i].blog_id + '\',\'' + blogArray[i].title + '\')">删除</a></td>'
                    tr_flag += '</tr>'

                    $("#blogContent").append(tr_flag);
                }

                init_page_html(page_int, page_num, mark);
            } else {
                toastr.error(data.msg);
            }
        }, error: function (xhr, textStatus, errorThrown) {
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
            if (xhr.readyState==4 && xhr.status==200) {
                toastr.error("没有访问权限,请重新登录!");
                var href_url = xhr.getResponseHeader("location");
                setTimeout(function () {
                    location.href=href_url;
                }, 2000);
            } else {
                toastr.error("网络异常，请重新登录！");
            }
        }
    });
}

function init_page() {
    var blog_moudle = get_moudle_name();
    var page_int = 1;//page_int：页数
    if (blog_moudle != "") {
        ajaxData(page_int, blog_moudle, "");
    }
}


function bloginfo(id, name) {
    localStorage.setItem('bid', id);
    localStorage.setItem('bname', name);
    var blog_moudle_name = get_moudle_name();
    var url = "/" + blog_moudle_name + "/pblogdetails";
    window.location.href = url;
}

function blogEdit(id, name) {
    var blog_moudle_name = get_moudle_name();
    var url = "/" + blog_moudle_name + "/blogedit";
    localStorage.setItem('edit_bid', id);
    localStorage.setItem('edit_bname', name);
    window.location.href = url;
}

$(".pagenum").on("click", function () {
    $(".page_li").each(function (index, element) {
        $(this).removeClass("active");

    });
    $(this).parent().addClass("active");
    $(this).css("background-color", "#797f8b;");
    $(this).css("border", "none");
    var page = $(this).attr("flag");

    var page_int = parseInt(page);
    var blog_moudle = get_moudle_name();
    if (blog_moudle != "") {
        ajaxData(page_int, blog_moudle, "");
    }
});


$(".prev_next_page").on("click", function () {
        var mark = $(this).attr("mark");

        var blog_moudle = get_moudle_name();
        var flag = "0"
        $(".active").each(function (index, element) {
            flag = element.children[0].getAttribute("flag");

        });
        var flag_num = parseInt(flag);

        if (mark == "prev") {//往前翻业
            if (flag_num < 5) {
                ajaxData(1, blog_moudle, mark);
            } else {
                var page_int = (parseInt(flag_num / 5) - 1) * 5 + 1
                ajaxData(page_int, blog_moudle, mark);

            }
        } else {//向后翻页
            var page_int = (parseInt(flag_num / 5) + 1) * 5 + 1
            ajaxData(page_int, blog_moudle, mark);
        }

    }
);

function blogDelte(id, name) {
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
    var blog_moudle_name = get_moudle_name();
    var url = "/blogdelete";
    localStorage.setItem('delete_bid', id);
    localStorage.setItem('delete_bname', name);
    /* window.location.href=url;*/
    $.ajax({
        url: url,
        type: 'POST',
        dataType: "json",
        data: JSON.stringify({"bid": id, "blog_moudle": blog_moudle_name, "userid": "admin"}),
        cache: false,
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (data) {
            console.log(data);
            if (data.code == 200) {
                toastr.success("成功删除,即将刷新页面");
                setTimeout(function () {
                    init_page();
                }, 2000);
            } else if (data.message == "unauth") {
                // toastr.success("未登录,稍后即将跳转登录页面");
                //setTimeout(function () {
                location.href = "/unauth";
                //}, 2000);
            } else {
                setTimeout(function () {
                    toastr.error("请刷新页面重试");
                }, 2000);

            }

        }
    });
}