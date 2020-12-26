!function(e) {
    function t() {
        return "Markdown.mk_block( " + uneval(this.toString()) + ", " + uneval(this.trailing) + ", " + uneval(this.lineNumber) + " )"
    }
    function r() {
        var e = require("util");
        return "Markdown.mk_block( " + e.inspect(this.toString()) + ", " + e.inspect(this.trailing) + ", " + e.inspect(this.lineNumber) + " )"
    }
    function n(e) {
        return e.split("\n").length - 1
    }
    function i(e) {
        return e && e.length > 0 ? e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;") : ""
    }
    function l(e) {
        if ("string" == typeof e)
            return i(e);
        var t = e.shift()
            , r = {}
            , n = [];
        for (!e.length || "object" != typeof e[0] || e[0]instanceof Array || (r = e.shift()); e.length; )
            n.push(l(e.shift()));
        var a = "";
        "undefined" != typeof r.src && (a += ' src="' + i(r.src) + '"',
            delete r.src);
        for (var s in r) {
            var c = i(r[s]);
            c && c.length && (a += " " + s + '="' + c + '"')
        }
        return "img" === t || "br" === t || "hr" === t ? "<" + t + a + "/>" : "<" + t + a + ">" + n.join("") + "</" + t + ">"
    }
    function a(e, t, r) {
        var n;
        r = r || {};
        var i = e.slice(0);
        "function" == typeof r.preprocessTreeNode && (i = r.preprocessTreeNode(i, t));
        var l = d(i);
        if (l) {
            i[1] = {};
            for (n in l)
                i[1][n] = l[n];
            l = i[1]
        }
        if ("string" == typeof i)
            return i;
        switch (i[0]) {
            case "header":
                i[0] = "h" + i[1].level,
                    delete i[1].level;
                break;
            case "bulletlist":
                i[0] = "ul";
                break;
            case "numberlist":
                i[0] = "ol";
                break;
            case "listitem":
                i[0] = "li";
                break;
            case "para":
                i[0] = "p";
                break;
            case "markdown":
                i[0] = "html",
                l && delete l.references;
                break;
            case "code_block":
                i[0] = "pre",
                    n = l ? 2 : 1;
                var s = ["code"];
                s.push.apply(s, i.splice(n, i.length - n)),
                    i[n] = s;
                break;
            case "inlinecode":
                i[0] = "code";
                break;
            case "img":
                i[1].src = i[1].href,
                    delete i[1].href;
                break;
            case "linebreak":
                i[0] = "br";
                break;
            case "link":
                i[0] = "a";
                break;
            case "link_ref":
                i[0] = "a";
                var c = t[l.ref];
                if (!c)
                    return l.original;
                delete l.ref,
                    l.href = c.href,
                c.title && (l.title = c.title),
                    delete l.original;
                break;
            case "img_ref":
                i[0] = "img";
                var c = t[l.ref];
                if (!c)
                    return l.original;
                delete l.ref,
                    l.src = c.href,
                c.title && (l.title = c.title),
                    delete l.original
        }
        if (n = 1,
            l) {
            for (var o in i[1]) {
                n = 2;
                break
            }
            1 === n && i.splice(n, 1)
        }
        for (; n < i.length; ++n)
            i[n] = a(i[n], t, r);
        return i
    }
    function s(e) {
        for (var t = d(e) ? 2 : 1; t < e.length; )
            "string" == typeof e[t] ? t + 1 < e.length && "string" == typeof e[t + 1] ? e[t] += e.splice(t + 1, 1)[0] : ++t : (s(e[t]),
                ++t)
    }
    function c(e, t) {
        function r(e) {
            this.len_after = e,
                this.name = "close_" + t
        }
        var n = e + "_state"
            , i = "strong" === e ? "em_state" : "strong_state";
        return function(l) {
            if (this[n][0] === t)
                return this[n].shift(),
                    [l.length, new r(l.length - t.length)];
            var a = this[i].slice()
                , s = this[n].slice();
            this[n].unshift(t);
            var c = this.processInline(l.substr(t.length))
                , o = c[c.length - 1];
            this[n].shift();
            if (o instanceof r) {
                c.pop();
                var h = l.length - o.len_after;
                return [h, [e].concat(c)]
            }
            return this[i] = a,
                this[n] = s,
                [t.length, t]
        }
    }
    function o() {
        d(this.tree) || this.tree.splice(1, 0, {});
        var e = d(this.tree);
        return void 0 === e.references && (e.references = {}),
            e
    }
    function h(e, t) {
        t[2] && "<" === t[2][0] && ">" === t[2][t[2].length - 1] && (t[2] = t[2].substring(1, t[2].length - 1));
        var r = e.references[t[1].toLowerCase()] = {
            href: t[2]
        };
        void 0 !== t[4] ? r.title = t[4] : void 0 !== t[5] && (r.title = t[5])
    }
    function f(e) {
        for (var t = e.split(""), r = [""], n = !1; t.length; ) {
            var i = t.shift();
            switch (i) {
                case " ":
                    n ? r[r.length - 1] += i : r.push("");
                    break;
                case "'":
                case '"':
                    n = !n;
                    break;
                case "\\":
                    i = t.shift();
                default:
                    r[r.length - 1] += i
            }
        }
        return r
    }
    var u = {};
    u.mk_block = function(e, n, i) {
        1 === arguments.length && (n = "\n\n");
        var l = new String(e);
        return l.trailing = n,
            l.inspect = r,
            l.toSource = t,
        void 0 !== i && (l.lineNumber = i),
            l
    }
    ;
    var p = u.isArray = Array.isArray || function(e) {
            return "[object Array]" === Object.prototype.toString.call(e)
        }
    ;
    Array.prototype.forEach ? u.forEach = function(e, t, r) {
            return e.forEach(t, r)
        }
        : u.forEach = function(e, t, r) {
            for (var n = 0; n < e.length; n++)
                t.call(r || e, e[n], n, e)
        }
        ,
        u.isEmpty = function(e) {
            for (var t in e)
                if (hasOwnProperty.call(e, t))
                    return !1;
            return !0
        }
        ,
        u.extract_attr = function(e) {
            return p(e) && e.length > 1 && "object" == typeof e[1] && !p(e[1]) ? e[1] : void 0
        }
    ;
    var g = function(e) {
        switch (typeof e) {
            case "undefined":
                this.dialect = g.dialects.Gruber;
                break;
            case "object":
                this.dialect = e;
                break;
            default:
                if (!(e in g.dialects))
                    throw new Error("Unknown Markdown dialect '" + String(e) + "'");
                this.dialect = g.dialects[e]
        }
        this.em_state = [],
            this.strong_state = [],
            this.debug_indent = ""
    };
    g.dialects = {};
    var v = g.mk_block = u.mk_block
        , p = u.isArray;
    g.parse = function(e, t) {
        var r = new g(t);
        return r.toTree(e)
    }
        ,
        g.prototype.split_blocks = function(e) {
            e = e.replace(/\r\n?/g, "\n");
            var t, r = /([\s\S]+?)($|\n#|\n(?:\s*\n|$)+)/g, i = [], l = 1;
            for (null !== (t = /^(\s*\n)/.exec(e)) && (l += n(t[0]),
                r.lastIndex = t[0].length); null !== (t = r.exec(e)); )
                "\n#" === t[2] && (t[2] = "\n",
                    r.lastIndex--),
                    i.push(v(t[1], t[2], l)),
                    l += n(t[0]);
            return i
        }
        ,
        g.prototype.processBlock = function(e, t) {
            var r = this.dialect.block
                , n = r.__order__;
            if ("__call__"in r)
                return r.__call__.call(this, e, t);
            for (var i = 0; i < n.length; i++) {
                var l = r[n[i]].call(this, e, t);
                if (l)
                    return (!p(l) || l.length > 0 && !p(l[0]) && "string" != typeof l[0]) && this.debug(n[i], "didn't return proper JsonML"),
                        l
            }
            return []
        }
        ,
        g.prototype.processInline = function(e) {
            return this.dialect.inline.__call__.call(this, String(e))
        }
        ,
        g.prototype.toTree = function(e, t) {
            var r = e instanceof Array ? e : this.split_blocks(e)
                , n = this.tree;
            try {
                for (this.tree = t || this.tree || ["markdown"]; r.length; ) {
                    var i = this.processBlock(r.shift(), r);
                    i.length && this.tree.push.apply(this.tree, i)
                }
                return this.tree
            } finally {
                t && (this.tree = n)
            }
        }
        ,
        g.prototype.debug = function() {
            var e = Array.prototype.slice.call(arguments);
            e.unshift(this.debug_indent),
            "undefined" != typeof print && print.apply(print, e),
            "undefined" != typeof console && "undefined" != typeof console.log && console.log.apply(null, e)
        }
        ,
        g.prototype.loop_re_over_block = function(e, t, r) {
            for (var n, i = t.valueOf(); i.length && null !== (n = e.exec(i)); )
                i = i.substr(n[0].length),
                    r.call(this, n);
            return i
        }
        ,
        g.buildBlockOrder = function(e) {
            var t = [];
            for (var r in e)
                "__order__" !== r && "__call__" !== r && t.push(r);
            e.__order__ = t
        }
        ,
        g.buildInlinePatterns = function(e) {
            var t = [];
            for (var r in e)
                if (!r.match(/^__.*__$/)) {
                    var n = r.replace(/([\\.*+?^$|()\[\]{}])/g, "\\$1").replace(/\n/, "\\n");
                    t.push(1 === r.length ? n : "(?:" + n + ")")
                }
            t = t.join("|"),
                e.__patterns__ = t;
            var i = e.__call__;
            e.__call__ = function(e, r) {
                return void 0 !== r ? i.call(this, e, r) : i.call(this, e, t)
            }
        }
    ;
    var d = u.extract_attr;
    g.renderJsonML = function(e, t) {
        t = t || {},
            t.root = t.root || !1;
        var r = [];
        if (t.root)
            r.push(l(e));
        else
            for (e.shift(),
                 !e.length || "object" != typeof e[0] || e[0]instanceof Array || e.shift(); e.length; )
                r.push(l(e.shift()));
        return r.join("\n\n")
    }
        ,
        g.toHTMLTree = function(e, t, r) {
            "string" == typeof e && (e = this.parse(e, t));
            var n = d(e)
                , i = {};
            n && n.references && (i = n.references);
            var l = a(e, i, r);
            return s(l),
                l
        }
        ,
        g.toHTML = function(e, t, r) {
            var n = this.toHTMLTree(e, t, r);
            return this.renderJsonML(n)
        }
    ;
    var _ = {};
    _.inline_until_char = function(e, t) {
        for (var r = 0, n = []; ; ) {
            if (e.charAt(r) === t)
                return r++,
                    [r, n];
            if (r >= e.length)
                return [r, null, n];
            var i = this.dialect.inline.__oneElement__.call(this, e.substr(r));
            r += i[0],
                n.push.apply(n, i.slice(1))
        }
    }
        ,
        _.subclassDialect = function(e) {
            function t() {}
            function r() {}
            return t.prototype = e.block,
                r.prototype = e.inline,
                {
                    block: new t,
                    inline: new r
                }
        }
    ;
    var b = u.forEach
        , d = u.extract_attr
        , v = u.mk_block
        , m = u.isEmpty
        , k = _.inline_until_char
        , y = /(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]+-?)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?/i.source
        , w = {
        block: {
            atxHeader: function(e, t) {
                var r = e.match(/^(#{1,6})\s*(.*?)\s*#*\s*(?:\n|$)/);
                if (r) {
                    var n = ["header", {
                        level: r[1].length
                    }];
                    return Array.prototype.push.apply(n, this.processInline(r[2])),
                    r[0].length < e.length && t.unshift(v(e.substr(r[0].length), e.trailing, e.lineNumber + 2)),
                        [n]
                }
            },
            setextHeader: function(e, t) {
                var r = e.match(/^(.*)\n([-=])\2\2+(?:\n|$)/);
                if (r) {
                    var n = "=" === r[2] ? 1 : 2
                        , i = ["header", {
                        level: n
                    }].concat(this.processInline(r[1]));
                    return r[0].length < e.length && t.unshift(v(e.substr(r[0].length), e.trailing, e.lineNumber + 2)),
                        [i]
                }
            },
            code: function(e, t) {
                var r = []
                    , n = /^(?: {0,3}\t| {4})(.*)\n?/;
                if (e.match(n)) {
                    e: for (; ; ) {
                        var i = this.loop_re_over_block(n, e.valueOf(), function(e) {
                            r.push(e[1])
                        });
                        if (i.length) {
                            t.unshift(v(i, e.trailing));
                            break e
                        }
                        if (!t.length)
                            break e;
                        if (!t[0].match(n))
                            break e;
                        r.push(e.trailing.replace(/[^\n]/g, "").substring(2)),
                            e = t.shift()
                    }
                    return [["code_block", r.join("\n")]]
                }
            },
            horizRule: function(e, t) {
                var r = e.match(/^(?:([\s\S]*?)\n)?[ \t]*([-_*])(?:[ \t]*\2){2,}[ \t]*(?:\n([\s\S]*))?$/);
                if (r) {
                    var n = [["hr"]];
                    if (r[1]) {
                        var i = v(r[1], "", e.lineNumber);
                        n.unshift.apply(n, this.toTree(i, []))
                    }
                    return r[3] && t.unshift(v(r[3], e.trailing, e.lineNumber + 1)),
                        n
                }
            },
            lists: function() {
                function e(e) {
                    return new RegExp("(?:^(" + c + "{0," + e + "} {0,3})(" + l + ")\\s+)|(^" + c + "{0," + (e - 1) + "}[ ]{0,4})")
                }
                function t(e) {
                    return e.replace(/ {0,3}\t/g, "    ")
                }
                function r(e, t, r, n) {
                    if (t)
                        return void e.push(["para"].concat(r));
                    var i = e[e.length - 1]instanceof Array && "para" === e[e.length - 1][0] ? e[e.length - 1] : e;
                    n && e.length > 1 && r.unshift(n);
                    for (var l = 0; l < r.length; l++) {
                        var a = r[l]
                            , s = "string" == typeof a;
                        s && i.length > 1 && "string" == typeof i[i.length - 1] ? i[i.length - 1] += a : i.push(a)
                    }
                }
                function n(e, t) {
                    for (var r = new RegExp("^(" + c + "{" + e + "}.*?\\n?)*$"), n = new RegExp("^" + c + "{" + e + "}","gm"), i = []; t.length > 0 && r.exec(t[0]); ) {
                        var l = t.shift()
                            , a = l.replace(n, "");
                        i.push(v(a, l.trailing, l.lineNumber))
                    }
                    return i
                }
                function i(e, t, r) {
                    var n = e.list
                        , i = n[n.length - 1];
                    if (!(i[1]instanceof Array && "para" === i[1][0]))
                        if (t + 1 === r.length)
                            i.push(["para"].concat(i.splice(1, i.length - 1)));
                        else {
                            var l = i.pop();
                            i.push(["para"].concat(i.splice(1, i.length - 1)), l)
                        }
                }
                var l = "[*+-]|\\d+\\."
                    , a = /[*+-]/
                    , s = new RegExp("^( {0,3})(" + l + ")[ \t]+")
                    , c = "(?: {0,3}\\t| {4})";
                return function(l, c) {
                    function o(e) {
                        var t = a.exec(e[2]) ? ["bulletlist"] : ["numberlist"];
                        return p.push({
                            list: t,
                            indent: e[1]
                        }),
                            t
                    }
                    var h = l.match(s);
                    if (h) {
                        for (var f, u, p = [], g = o(h), v = !1, d = [p[0].list]; ; ) {
                            for (var _ = l.split(/(?=\n)/), m = "", k = "", y = 0; y < _.length; y++) {
                                k = "";
                                var w = _[y].replace(/^\n/, function(e) {
                                    return k = e,
                                        ""
                                })
                                    , $ = e(p.length);
                                if (h = w.match($),
                                void 0 !== h[1]) {
                                    m.length && (r(f, v, this.processInline(m), k),
                                        v = !1,
                                        m = ""),
                                        h[1] = t(h[1]);
                                    var x = Math.floor(h[1].length / 4) + 1;
                                    if (x > p.length)
                                        g = o(h),
                                            f.push(g),
                                            f = g[1] = ["listitem"];
                                    else {
                                        var M = !1;
                                        for (u = 0; u < p.length; u++)
                                            if (p[u].indent === h[1]) {
                                                g = p[u].list,
                                                    p.splice(u + 1, p.length - (u + 1)),
                                                    M = !0;
                                                break
                                            }
                                        M || (x++,
                                            x <= p.length ? (p.splice(x, p.length - x),
                                                g = p[x - 1].list) : (g = o(h),
                                                f.push(g))),
                                            f = ["listitem"],
                                            g.push(f)
                                    }
                                    k = ""
                                }
                                w.length > h[0].length && (m += k + w.substr(h[0].length))
                            }
                            if (m.length) {
                                var S = this.processBlock(m, [])
                                    , E = S[0];
                                E && (E.shift(),
                                    S.splice.apply(S, [0, 1].concat(E)),
                                    r(f, v, S, k),
                                "\n" === f[f.length - 1] && f.pop(),
                                    v = !1,
                                    m = "")
                            }
                            var A = n(p.length, c);
                            A.length > 0 && (b(p, i, this),
                                f.push.apply(f, this.toTree(A, [])));
                            var T = c[0] && c[0].valueOf() || "";
                            if (!T.match(s) && !T.match(/^ /))
                                break;
                            l = c.shift();
                            var L = this.dialect.block.horizRule.call(this, l, c);
                            if (L) {
                                d.push.apply(d, L);
                                break
                            }
                            p[p.length - 1].indent === l.match(/^\s*/)[0] && b(p, i, this),
                                v = !0
                        }
                        return d
                    }
                }
            }(),
            blockquote: function(e, t) {
                var r = /(^|\n) +(\>[\s\S]*)/.exec(e);
                if (r && r[2] && r[2].length) {
                    var n = e.replace(/(^|\n) +\>/, "$1>");
                    return t.unshift(n),
                        []
                }
                if (e.match(/^>/m)) {
                    var i = [];
                    if (">" !== e[0]) {
                        for (var l = e.split(/\n/), a = [], s = e.lineNumber; l.length && ">" !== l[0][0]; )
                            a.push(l.shift()),
                                s++;
                        var c = v(a.join("\n"), "\n", e.lineNumber);
                        i.push.apply(i, this.processBlock(c, [])),
                            e = v(l.join("\n"), e.trailing, s)
                    }
                    for (; t.length && ">" === t[0][0]; ) {
                        var o = t.shift();
                        e = v(e + e.trailing + o, o.trailing, e.lineNumber)
                    }
                    var h = e.replace(/^> ?/gm, "")
                        , f = (this.tree,
                        this.toTree(h, ["blockquote"]))
                        , u = d(f);
                    return u && u.references && (delete u.references,
                    m(u) && f.splice(1, 1)),
                        i.push(f),
                        i
                }
            },
            referenceDefn: function(e, t) {
                var r = /^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*)\3|\((.*?)\)))?\n?/;
                if (e.match(r)) {
                    var n = o.call(this)
                        , i = this.loop_re_over_block(r, e, function(e) {
                        h(n, e)
                    });
                    return i.length && t.unshift(v(i, e.trailing)),
                        []
                }
            },
            para: function(e) {
                return [["para"].concat(this.processInline(e))]
            }
        },
        inline: {
            __oneElement__: function(e, t, r) {
                var n, i;
                t = t || this.dialect.inline.__patterns__;
                var l = new RegExp("([\\s\\S]*?)(" + (t.source || t) + ")");
                if (n = l.exec(e),
                    !n)
                    return [e.length, e];
                if (n[1])
                    return [n[1].length, n[1]];
                var i;
                return n[2]in this.dialect.inline && (i = this.dialect.inline[n[2]].call(this, e.substr(n.index), n, r || [])),
                    i = i || [n[2].length, n[2]]
            },
            __call__: function(e, t) {
                function r(e) {
                    "string" == typeof e && "string" == typeof i[i.length - 1] ? i[i.length - 1] += e : i.push(e)
                }
                for (var n, i = []; e.length > 0; )
                    n = this.dialect.inline.__oneElement__.call(this, e, t, i),
                        e = e.substr(n.shift()),
                        b(n, r);
                return i
            },
            "]": function() {},
            "}": function() {},
            __escape__: /^\\[\\`\*_{}<>\[\]()#\+.!\-]/,
            "\\": function(e) {
                return this.dialect.inline.__escape__.exec(e) ? [2, e.charAt(1)] : [1, "\\"]
            },
            "![": function(e) {
                if (!(e.indexOf("(") >= 0 && e.indexOf(")") === -1)) {
                    var t = e.match(new RegExp("^!\\[(.*?)][ \\t]*\\((" + y + ")\\)([ \\t])*([\"'].*[\"'])?")) || e.match(/^!\[(.*?)\][ \t]*\([ \t]*([^")]*?)(?:[ \t]+(["'])(.*?)\3)?[ \t]*\)/);
                    if (t) {
                        t[2] && "<" === t[2][0] && ">" === t[2][t[2].length - 1] && (t[2] = t[2].substring(1, t[2].length - 1)),
                            t[2] = this.dialect.inline.__call__.call(this, t[2], /\\/)[0];
                        var r = {
                            alt: t[1],
                            href: t[2] || ""
                        };
                        return void 0 !== t[4] && (r.title = t[4]),
                            [t[0].length, ["img", r]]
                    }
                    return t = e.match(/^!\[(.*?)\][ \t]*\[(.*?)\]/),
                        t ? [t[0].length, ["img_ref", {
                            alt: t[1],
                            ref: t[2].toLowerCase(),
                            original: t[0]
                        }]] : [2, "!["]
                }
            },
            "[": function x(e) {
                for (var t = 1, r = 0; r < e.length; r++) {
                    var n = e.charAt(r);
                    if ("[" === n && t++,
                    "]" === n && t--,
                    t > 3)
                        return [1, "["]
                }
                var i = String(e)
                    , l = k.call(this, e.substr(1), "]");
                if (!l[1])
                    return [l[0] + 1, e.charAt(0)].concat(l[2]);
                var x, a, s = 1 + l[0], c = l[1];
                e = e.substr(s);
                var f = e.match(/^\s*\([ \t]*([^"']*)(?:[ \t]+(["'])(.*?)\2)?[ \t]*\)/);
                if (f) {
                    var u = f[1].replace(/\s+$/, "");
                    if (s += f[0].length,
                    u && "<" === u[0] && ">" === u[u.length - 1] && (u = u.substring(1, u.length - 1)),
                        !f[3])
                        for (var p = 1, g = 0; g < u.length; g++)
                            switch (u[g]) {
                                case "(":
                                    p++;
                                    break;
                                case ")":
                                    0 === --p && (s -= u.length - g,
                                        u = u.substring(0, g))
                            }
                    return u = this.dialect.inline.__call__.call(this, u, /\\/)[0],
                        a = {
                            href: u || ""
                        },
                    void 0 !== f[3] && (a.title = f[3]),
                        x = ["link", a].concat(c),
                        [s, x]
                }
                if (f = e.match(new RegExp("^\\((" + y + ")\\)")),
                f && f[1])
                    return s += f[0].length,
                        x = ["link", {
                            href: f[1]
                        }].concat(c),
                        [s, x];
                if (f = e.match(/^\s*\[(.*?)\]/),
                f && (s += f[0].length,
                    a = {
                        ref: (f[1] || String(c)).toLowerCase(),
                        original: i.substr(0, s)
                    },
                c && c.length > 0))
                    return x = ["link_ref", a].concat(c),
                        [s, x];
                if (f = i.match(/^\s*\[(.*?)\]:\s*(\S+)(?:\s+(?:(['"])(.*?)\3|\((.*?)\)))?\n?/)) {
                    var a = o.call(this);
                    return h(a, f),
                        [f[0].length]
                }
                if (1 === c.length && "string" == typeof c[0]) {
                    var v = c[0].toLowerCase().replace(/\s+/, " ");
                    return a = {
                        ref: v,
                        original: i.substr(0, s)
                    },
                        x = ["link_ref", a, c[0]],
                        [s, x]
                }
                return [1, "["]
            },
            "<": function(e) {
                var t;
                return null !== (t = e.match(/^<(?:((https?|ftp|mailto):[^>]+)|(.*?@.*?\.[a-zA-Z]+))>/)) ? t[3] ? [t[0].length, ["link", {
                    href: "mailto:" + t[3]
                }, t[3]]] : "mailto" === t[2] ? [t[0].length, ["link", {
                    href: t[1]
                }, t[1].substr("mailto:".length)]] : [t[0].length, ["link", {
                    href: t[1]
                }, t[1]]] : [1, "<"]
            },
            "`": function(e) {
                var t = e.match(/(`+)(([\s\S]*?)\1)/);
                return t && t[2] ? [t[1].length + t[2].length, ["inlinecode", t[3]]] : [1, "`"]
            },
            "  \n": function() {
                return [3, ["linebreak"]]
            }
        }
    };
    w.inline["**"] = c("strong", "**"),
        w.inline.__ = c("strong", "__"),
        w.inline["*"] = c("em", "*"),
        w.inline._ = c("em", "_"),
        g.dialects.Gruber = w,
        g.buildBlockOrder(g.dialects.Gruber.block),
        g.buildInlinePatterns(g.dialects.Gruber.inline);
    var $ = _.subclassDialect(w)
        , d = u.extract_attr
        , b = u.forEach;
    $.processMetaHash = function(e) {
        for (var t = f(e), r = {}, n = 0; n < t.length; ++n)
            if (/^#/.test(t[n]))
                r.id = t[n].substring(1);
            else if (/^\./.test(t[n]))
                r["class"] ? r["class"] = r["class"] + t[n].replace(/./, " ") : r["class"] = t[n].substring(1);
            else if (/\=/.test(t[n])) {
                var i = t[n].split(/\=/);
                r[i[0]] = i[1]
            }
        return r
    }
        ,
        $.block.document_meta = function(e) {
            if (!(e.lineNumber > 1) && e.match(/^(?:\w+:.*\n)*\w+:.*$/)) {
                d(this.tree) || this.tree.splice(1, 0, {});
                var t = e.split(/\n/);
                for (var r in t) {
                    var n = t[r].match(/(\w+):\s*(.*)$/)
                        , i = n[1].toLowerCase()
                        , l = n[2];
                    this.tree[1][i] = l
                }
                return []
            }
        }
        ,
        $.block.block_meta = function(e) {
            var t = e.match(/(^|\n) {0,3}\{:\s*((?:\\\}|[^\}])*)\s*\}$/);
            if (t) {
                var r, n = this.dialect.processMetaHash(t[2]);
                if ("" === t[1]) {
                    var i = this.tree[this.tree.length - 1];
                    if (r = d(i),
                    "string" == typeof i)
                        return;
                    r || (r = {},
                        i.splice(1, 0, r));
                    for (var l in n)
                        r[l] = n[l];
                    return []
                }
                var a = e.replace(/\n.*$/, "")
                    , s = this.processBlock(a, []);
                r = d(s[0]),
                r || (r = {},
                    s[0].splice(1, 0, r));
                for (var l in n)
                    r[l] = n[l];
                return s
            }
        }
        ,
        $.block.definition_list = function(e, t) {
            var r, n, i = /^((?:[^\s:].*\n)+):\s+([\s\S]+)$/, l = ["dl"];
            if (n = e.match(i)) {
                for (var a = [e]; t.length && i.exec(t[0]); )
                    a.push(t.shift());
                for (var s = 0; s < a.length; ++s) {
                    var n = a[s].match(i)
                        , c = n[1].replace(/\n$/, "").split(/\n/)
                        , o = n[2].split(/\n:\s+/);
                    for (r = 0; r < c.length; ++r)
                        l.push(["dt", c[r]]);
                    for (r = 0; r < o.length; ++r)
                        l.push(["dd"].concat(this.processInline(o[r].replace(/(\n)\s+/, "$1"))))
                }
                return [l]
            }
        }
        ,
        $.block.table = function M(e) {
            var t, r, n = function(e, t) {
                t = t || "\\s",
                t.match(/^[\\|\[\]{}?*.+^$]$/) && (t = "\\" + t);
                for (var r, n = [], i = new RegExp("^((?:\\\\.|[^\\\\" + t + "])*)" + t + "(.*)"); r = e.match(i); )
                    n.push(r[1]),
                        e = r[2];
                return n.push(e),
                    n
            }, i = /^ {0,3}\|(.+)\n {0,3}\|\s*([\-:]+[\-| :]*)\n((?:\s*\|.*(?:\n|$))*)(?=\n|$)/, l = /^ {0,3}(\S(?:\\.|[^\\|])*\|.*)\n {0,3}([\-:]+\s*\|[\-| :]*)\n((?:(?:\\.|[^\\|])*\|.*(?:\n|$))*)(?=\n|$)/;
            if (r = e.match(i))
                r[3] = r[3].replace(/^\s*\|/gm, "");
            else if (!(r = e.match(l)))
                return;
            var M = ["table", ["thead", ["tr"]], ["tbody"]];
            r[2] = r[2].replace(/\|\s*$/, "").split("|");
            var a = [];
            for (b(r[2], function(e) {
                e.match(/^\s*-+:\s*$/) ? a.push({
                    align: "right"
                }) : e.match(/^\s*:-+\s*$/) ? a.push({
                    align: "left"
                }) : e.match(/^\s*:-+:\s*$/) ? a.push({
                    align: "center"
                }) : a.push({})
            }),
                     r[1] = n(r[1].replace(/\|\s*$/, ""), "|"),
                     t = 0; t < r[1].length; t++)
                M[1][1].push(["th", a[t] || {}].concat(this.processInline(r[1][t].trim())));
            return b(r[3].replace(/\|\s*$/gm, "").split("\n"), function(e) {
                var r = ["tr"];
                for (e = n(e, "|"),
                         t = 0; t < e.length; t++)
                    r.push(["td", a[t] || {}].concat(this.processInline(e[t].trim())));
                M[2].push(r)
            }, this),
                [M]
        }
        ,
        $.inline["{:"] = function(e, t, r) {
            if (!r.length)
                return [2, "{:"];
            var n = r[r.length - 1];
            if ("string" == typeof n)
                return [2, "{:"];
            var i = e.match(/^\{:\s*((?:\\\}|[^\}])*)\s*\}/);
            if (!i)
                return [2, "{:"];
            var l = this.dialect.processMetaHash(i[1])
                , a = d(n);
            a || (a = {},
                n.splice(1, 0, a));
            for (var s in l)
                a[s] = l[s];
            return [i[0].length, ""]
        }
        ,
        g.dialects.Maruku = $,
        g.dialects.Maruku.inline.__escape__ = /^\\[\\`\*_{}\[\]()#\+.!\-|:]/,
        g.buildBlockOrder(g.dialects.Maruku.block),
        g.buildInlinePatterns(g.dialects.Maruku.inline),
        e.Markdown = g,
        e.parse = g.parse,
        e.toHTML = g.toHTML,
        e.toHTMLTree = g.toHTMLTree,
        e.renderJsonML = g.renderJsonML,
        e.DialectHelpers = _
}(function() {
    return window.markdown = {},
        window.markdown
}());
