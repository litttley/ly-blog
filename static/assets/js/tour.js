$(document).ready(function() {
    "use strict";
    function t() {
        a = !1
    }
    function e() {
        a ? s.cancel() : s.start(),
            a = !a
    }
    var a = !1
        , s = new Shepherd.Tour({
        defaults: {
            classes: "shepherd-theme-arrows",
            showCancelLink: !0
        }
    });
    s.addStep("welcome", {
        text: ["Welcome! This is a guided tour example which you can use in your projects."],
        attachTo: "#tour-trigger bottom",
        buttons: [{
            text: "Exit",
            classes: "shepherd-button-secondary",
            action: s.cancel
        }, {
            text: "Next",
            action: s.next,
            classes: "shepherd-button-primary"
        }]
    }),
        s.addStep("dashboards", {
            title: "Dashboards",
            text: "Dashboard examples designed for specific use cases to show you the power of the template. We will add more dashboard designs in the future as well!",
            attachTo: ".nav-dashboards right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: s.back
            }, {
                text: "Next",
                action: s.next
            }]
        }),
        s.addStep("Widgets", {
            title: "Widgets",
            text: "Check out the various widgets you can use in your projects.",
            attachTo: ".nav-widgets right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: s.back
            }, {
                text: "Next",
                action: s.next
            }]
        }),
        s.addStep("app-pages", {
            title: "App Pages",
            text: "Discover the useful app pages. They are based on real-world use cases too.",
            attachTo: ".nav-app-pages right",
            buttons: [{
                text: "Back",
                classes: "shepherd-button-secondary",
                action: s.back
            }, {
                text: "Done",
                action: s.next
            }]
        }),
        s.on("complete", t),
        s.on("cancel", t),
        $("#tour-trigger").on("click", e),
        $(".main-nav-wrapper").on("webkitTransitionEnd transitionend msTransitionEnd oTransitionEnd", function() {
            s.currentStep && s.currentStep.tether && s.currentStep.tether.position()
        }),
    "tutorial" == $(document.body).data("trigger") && e()
});
