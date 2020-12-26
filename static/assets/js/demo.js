$(document).ready(function() {
    "use strict";
    var e = $("#color-options li")
        , o = $("#color-options li a");
    $("#config-trigger").click(function(e) {
        e.preventDefault(),
            $("#config-panel").toggleClass("config-panel-open")
    }),
        $("#config-close").on("click", function() {
            $("#config-trigger").trigger("click")
        }),
        $("#demo-topalert-toggle").on("change", function() {
            $(this).is(":checked") ? $("#top-alert").slideDown() : $("#top-alert").slideUp()
        }),
        $("#demo-footer-toggle").on("change", function() {
            $(this).is(":checked") ? $("#footer").show() : $("#footer").hide()
        }),
        o.on("click", function() {
            var o = $(this)
                , t = o.closest("li")
                , i = o.data("style")
                , c = $("body");
            e.removeClass("active"),
                c.removeClass("theme-1 theme-2 theme-3 theme-4"),
                c.addClass(i),
                t.addClass(i)
        })
});
