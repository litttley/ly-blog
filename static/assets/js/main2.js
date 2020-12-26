$(document).ready(function() {
    "use strict";
    function a() {
        l.toggleClass("compact", o.width() <= 1200),
            l.toggleClass("mobile", o.width() <= 768)
    }
    function e(a) {
        var e, o = $(a.target);
        o.hasClass("module-content") && o.closest(".module").toggleClass("collapsed", a.data.collapsed),
        o.hasClass("panel-collapse") && (e = o.prev().find(".fa"),
            e.hasClass("fa-plus-square") || e.hasClass("fa-minus-square") ? e.toggleClass("fa-plus-square", a.data.collapsed).toggleClass("fa-minus-square", a.data.collapsed) : (e.hasClass("fa-caret-right") || e.hasClass("fa-caret-down")) && e.toggleClass("fa-caret-right", a.data.collapsed).toggleClass("fa-caret-down", a.data.collapsed))
    }
    var o = $(window)
        , l = $("body")
        , s = $("#main-search-input-wrapper")
        , n = $("#masonry");
    $(".js-cloak").removeClass("js-cloak"),
        a(),
        s.hide(),
        $('[data-toggle="tooltip"]').tooltip({
            container: "body"
        }),
        $('[data-toggle="popover"]').popover({
            container: "body"
        }),
        $("#menu").metisMenu(),
        o.on("scroll", function() {
            o.scrollTop() > 0 ? $("#header").addClass("header-change") : $("#header").removeClass("header-change")
        }).on("resize", a).on("load", function() {
            l.removeClass("preload")
        }),
        $("#signup-link").on("click", function(a) {
            $("#signup-modal").modal(),
                $("#login-modal").modal("toggle"),
                a.preventDefault()
        }),
        $("#login-link").on("click", function(a) {
            $("#login-modal").modal(),
                $("#signup-modal").modal("toggle"),
                a.preventDefault()
        }),
        n.imagesLoaded(function() {
            n.masonry({
                itemSelector: ".masonry-item"
            })
        }),
        $("#content-wrapper").on("transitionend webkitTransitionEnd oTransitionEnd", function(a) {
            a.target && !$(a.target).hasClass("masonry-item") && n.masonry()
        }),
        l.on("click", ".close-module", function(a) {
            n.data("masonry") ? n.masonry("remove", $(a.target).closest(".masonry-item")) : $(a.target).closest(".module").remove()
        }),
        l.on("hide.bs.collapse", {
            collapse: !1
        }, e),
        l.on("show.bs.collapse", {
            collapse: !0
        }, e),
        $("#main-nav-toggle").click(function() {
            l.toggleClass("nav-toggled")
        }),
        $("#side-panel-toggle").click(function() {
            $(this).hasClass("panel-show") ? ($("#side-panel").animate({
                right: "-=320"
            }, 500),
                $(this).removeClass("panel-show").addClass("panel-hide")) : ($("#side-panel").animate({
                right: "+=320"
            }, 500),
                $(this).removeClass("panel-hide").addClass("panel-show"),
                $(this).tooltip("hide"))
        }),
        $("#side-panel .close").on("click", function() {
            $("#side-panel-toggle.panel-show").click()
        }),
        $("#modal-view-controller").on("click", function() {
            $(this).closest(".modal").toggleClass("modal-fullscreen")
        }),
        $("#main-search-toggle").on("click", function() {
            s.toggle(),
                $("#main-search-input").trigger("focus")
        }),
        $("#clear-search").on("click", function() {
            $(this).closest("#main-search").find("#main-search-toggle").trigger("click")
        }),
        $("#main-search-input").on("keydown", function() {
            var a = $(this);
            "Search..." !== a.val() && a.val().length > 0 && a.closest("form").find("#clear-search").show().one("click", function() {
                a.val(""),
                    a.trigger("blur")
            })
        }).on("blur", function() {
            var a = $(this);
            0 === a.val().length && $(this).closest("form").find("#clear-search").hide()
        }),
        $("#top-alert-close").on("click", function() {
            $(this).closest("#top-alert").slideUp()
        }),
        $(".cursor-pointer").on("click", function() {
            $(this).closest(".input-group-icon-click").find("input").focus()
        })
});
