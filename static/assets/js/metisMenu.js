!function(n, i) {
    if ("function" == typeof define && define.amd)
        define(["jquery"], i);
    else if ("undefined" != typeof exports)
        i(require("jquery"));
    else {
        var t = {
            exports: {}
        };
        i(n.jquery),
            n.metisMenu = t.exports
    }
}(this, function(n) {
    "use strict";
    function i(n) {
        return n && n.__esModule ? n : {
            "default": n
        }
    }
    function t(n, i) {
        if (!(n instanceof i))
            throw new TypeError("Cannot call a class as a function")
    }
    var e = (i(n),
            "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(n) {
                    return typeof n
                }
                : function(n) {
                    return n && "function" == typeof Symbol && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n
                }
    )
        , s = function(n) {
        function i() {
            return {
                bindType: o.end,
                delegateType: o.end,
                handle: function(i) {
                    if (n(i.target).is(this))
                        return i.handleObj.handler.apply(this, arguments)
                }
            }
        }
        function t() {
            if (window.QUnit)
                return !1;
            var n = document.createElement("mm");
            for (var i in a)
                if (void 0 !== n.style[i])
                    return {
                        end: a[i]
                    };
            return !1
        }
        function e(i) {
            var t = this
                , e = !1;
            return n(this).one(r.TRANSITION_END, function() {
                e = !0
            }),
                setTimeout(function() {
                    e || r.triggerTransitionEnd(t)
                }, i),
                this
        }
        function s() {
            o = t(),
                n.fn.emulateTransitionEnd = e,
            r.supportsTransitionEnd() && (n.event.special[r.TRANSITION_END] = i())
        }
        var o = !1
            , a = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        }
            , r = {
            TRANSITION_END: "mmTransitionEnd",
            triggerTransitionEnd: function(i) {
                n(i).trigger(o.end)
            },
            supportsTransitionEnd: function() {
                return Boolean(o)
            }
        };
        return s(),
            r
    }(jQuery);
    (function(n) {
            var i = "metisMenu"
                , o = "metisMenu"
                , a = "." + o
                , r = ".data-api"
                , l = n.fn[i]
                , c = 350
                , f = {
                toggle: !0,
                preventDefault: !0,
                activeClass: "active",
                collapseClass: "collapse",
                collapseInClass: "in",
                collapsingClass: "collapsing",
                triggerElement: "a",
                parentTrigger: "li",
                subMenu: "ul"
            }
                , g = {
                SHOW: "show" + a,
                SHOWN: "shown" + a,
                HIDE: "hide" + a,
                HIDDEN: "hidden" + a,
                CLICK_DATA_API: "click" + a + r
            }
                , h = function() {
                function i(n, e) {
                    t(this, i),
                        this._element = n,
                        this._config = this._getConfig(e),
                        this._transitioning = null,
                        this.init()
                }
                return i.prototype.init = function() {
                    var i = this;
                    n(this._element).find(this._config.parentTrigger + "." + this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded", !0).addClass(this._config.collapseClass + " " + this._config.collapseInClass),
                        n(this._element).find(this._config.parentTrigger).not("." + this._config.activeClass).has(this._config.subMenu).children(this._config.subMenu).attr("aria-expanded", !1).addClass(this._config.collapseClass),
                        n(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).on(g.CLICK_DATA_API, function(t) {
                            var e = n(this)
                                , s = e.parent(i._config.parentTrigger)
                                , o = s.siblings(i._config.parentTrigger).children(i._config.triggerElement)
                                , a = s.children(i._config.subMenu);
                            i._config.preventDefault && t.preventDefault(),
                            "true" !== e.attr("aria-disabled") && (s.hasClass(i._config.activeClass) ? (e.attr("aria-expanded", !1),
                                i._hide(a)) : (i._show(a),
                                e.attr("aria-expanded", !0),
                            i._config.toggle && o.attr("aria-expanded", !1)),
                            i._config.onTransitionStart && i._config.onTransitionStart(t))
                        })
                }
                    ,
                    i.prototype._show = function(i) {
                        if (!this._transitioning && !n(i).hasClass(this._config.collapsingClass)) {
                            var t = this
                                , e = n(i)
                                , o = n.Event(g.SHOW);
                            if (e.trigger(o),
                                !o.isDefaultPrevented()) {
                                e.parent(this._config.parentTrigger).addClass(this._config.activeClass),
                                this._config.toggle && this._hide(e.parent(this._config.parentTrigger).siblings().children(this._config.subMenu + "." + this._config.collapseInClass).attr("aria-expanded", !1)),
                                    e.removeClass(this._config.collapseClass).addClass(this._config.collapsingClass).height(0),
                                    this.setTransitioning(!0);
                                var a = function() {
                                    e.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass + " " + t._config.collapseInClass).height("").attr("aria-expanded", !0),
                                        t.setTransitioning(!1),
                                        e.trigger(g.SHOWN)
                                };
                                return s.supportsTransitionEnd() ? void e.height(e[0].scrollHeight).one(s.TRANSITION_END, a).emulateTransitionEnd(c) : void a()
                            }
                        }
                    }
                    ,
                    i.prototype._hide = function(i) {
                        if (!this._transitioning && n(i).hasClass(this._config.collapseInClass)) {
                            var t = this
                                , e = n(i)
                                , o = n.Event(g.HIDE);
                            if (e.trigger(o),
                                !o.isDefaultPrevented()) {
                                e.parent(this._config.parentTrigger).removeClass(this._config.activeClass),
                                    e.height(e.height())[0].offsetHeight,
                                    e.addClass(this._config.collapsingClass).removeClass(this._config.collapseClass).removeClass(this._config.collapseInClass),
                                    this.setTransitioning(!0);
                                var a = function() {
                                    t._transitioning && t._config.onTransitionEnd && t._config.onTransitionEnd(),
                                        t.setTransitioning(!1),
                                        e.trigger(g.HIDDEN),
                                        e.removeClass(t._config.collapsingClass).addClass(t._config.collapseClass).attr("aria-expanded", !1)
                                };
                                return s.supportsTransitionEnd() ? void (0 == e.height() || "none" == e.css("display") ? a() : e.height(0).one(s.TRANSITION_END, a).emulateTransitionEnd(c)) : void a()
                            }
                        }
                    }
                    ,
                    i.prototype.setTransitioning = function(n) {
                        this._transitioning = n
                    }
                    ,
                    i.prototype.dispose = function() {
                        n.removeData(this._element, o),
                            n(this._element).find(this._config.parentTrigger).has(this._config.subMenu).children(this._config.triggerElement).off("click"),
                            this._transitioning = null,
                            this._config = null,
                            this._element = null
                    }
                    ,
                    i.prototype._getConfig = function(i) {
                        return i = n.extend({}, f, i)
                    }
                    ,
                    i._jQueryInterface = function(t) {
                        return this.each(function() {
                            var s = n(this)
                                , a = s.data(o)
                                , r = n.extend({}, f, s.data(), "object" === ("undefined" == typeof t ? "undefined" : e(t)) && t);
                            if (!a && /dispose/.test(t) && this.dispose(),
                            a || (a = new i(this,r),
                                s.data(o, a)),
                            "string" == typeof t) {
                                if (void 0 === a[t])
                                    throw new Error('No method named "' + t + '"');
                                a[t]()
                            }
                        })
                    }
                    ,
                    i
            }();
            return n.fn[i] = h._jQueryInterface,
                n.fn[i].Constructor = h,
                n.fn[i].noConflict = function() {
                    return n.fn[i] = l,
                        h._jQueryInterface
                }
                ,
                h
        }
    )(jQuery)
});
