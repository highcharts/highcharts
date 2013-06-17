/*
 Highstock JS v1.3.2 (2013-06-05)

 (c) 2009-2013 Torstein HÞnsi

 License: www.highcharts.com/license
*/
(function () {
    function y(a, b) { var c; a || (a = {}); for (c in b) a[c] = b[c]; return a } function z() { var a, b = arguments.length, c = {}, d = function (a, b) { var c, h; for (h in b) b.hasOwnProperty(h) && (c = b[h], typeof a !== "object" && (a = {}), a[h] = c && typeof c === "object" && Object.prototype.toString.call(c) !== "[object Array]" && typeof c.nodeType !== "number" ? d(a[h] || {}, c) : b[h]); return a }; for (a = 0; a < b; a++) c = d(c, arguments[a]); return c } function jb() { for (var a = 0, b = arguments, c = b.length, d = {}; a < c; a++) d[b[a++]] = b[a]; return d } function C(a, b) {
        return parseInt(a,
        b || 10)
    } function ma(a) { return typeof a === "string" } function da(a) { return typeof a === "object" } function Wa(a) { return Object.prototype.toString.call(a) === "[object Array]" } function Ja(a) { return typeof a === "number" } function ra(a) { return P.log(a) / P.LN10 } function la(a) { return P.pow(10, a) } function na(a, b) { for (var c = a.length; c--;) if (a[c] === b) { a.splice(c, 1); break } } function v(a) { return a !== w && a !== null } function G(a, b, c) {
        var d, e; if (ma(b)) v(c) ? a.setAttribute(b, c) : a && a.getAttribute && (e = a.getAttribute(b)); else if (v(b) &&
        da(b)) for (d in b) a.setAttribute(d, b[d]); return e
    } function ja(a) { return Wa(a) ? a : [a] } function p() { var a = arguments, b, c, d = a.length; for (b = 0; b < d; b++) if (c = a[b], typeof c !== "undefined" && c !== null) return c } function L(a, b) { if (Xa && b && b.opacity !== w) b.filter = "alpha(opacity=" + b.opacity * 100 + ")"; y(a.style, b) } function aa(a, b, c, d, e) { a = H.createElement(a); b && y(a, b); e && L(a, { padding: 0, border: ba, margin: 0 }); c && L(a, c); d && d.appendChild(a); return a } function ea(a, b) { var c = function () { }; c.prototype = new a; y(c.prototype, b); return c }
    function xa(a, b, c, d) { var e = M.lang, f = b === -1 ? ((a || 0).toString().split(".")[1] || "").length : isNaN(b = U(b)) ? 2 : b, b = c === void 0 ? e.decimalPoint : c, d = d === void 0 ? e.thousandsSep : d, e = a < 0 ? "-" : "", c = String(C(a = U(+a || 0).toFixed(f))), g = c.length > 3 ? c.length % 3 : 0; return e + (g ? c.substr(0, g) + d : "") + c.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + d) + (f ? b + U(a - c).toFixed(f).slice(2) : "") } function Ka(a, b) { return Array((b || 2) + 1 - String(a).length).join(0) + a } function sa(a, b, c) {
        var d = a[b]; a[b] = function () {
            var a = Array.prototype.slice.call(arguments);
            a.unshift(d); return c.apply(this, a)
        }
    } function La(a, b) { for (var c = "{", d = !1, e, f, g, h, i, j = []; (c = a.indexOf(c)) !== -1;) { e = a.slice(0, c); if (d) { f = e.split(":"); g = f.shift().split("."); i = g.length; e = b; for (h = 0; h < i; h++) e = e[g[h]]; if (f.length) f = f.join(":"), g = /\.([0-9])/, h = M.lang, i = void 0, /f$/.test(f) ? (i = (i = f.match(g)) ? i[1] : -1, e = xa(e, i, h.decimalPoint, f.indexOf(",") > -1 ? h.thousandsSep : "")) : e = ya(f, e) } j.push(e); a = a.slice(c + 1); c = (d = !d) ? "}" : "{" } j.push(a); return j.join("") } function yb(a, b, c, d) {
        var e, c = p(c, 1); e = a / c; b || (b = [1,
        2, 2.5, 5, 10], d && d.allowDecimals === !1 && (c === 1 ? b = [1, 2, 5, 10] : c <= 0.1 && (b = [1 / c]))); for (d = 0; d < b.length; d++) if (a = b[d], e <= (b[d] + (b[d + 1] || b[d])) / 2) break; a *= c; return a
    } function zb(a, b) {
        var c = b || [[kb, [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], [eb, [1, 2, 5, 10, 15, 30]], [Ya, [1, 2, 5, 10, 15, 30]], [za, [1, 2, 3, 4, 6, 8, 12]], [ga, [1, 2]], [Ma, [1, 2]], [Na, [1, 2, 3, 4, 6]], [ta, null]], d = c[c.length - 1], e = I[d[0]], f = d[1], g; for (g = 0; g < c.length; g++) if (d = c[g], e = I[d[0]], f = d[1], c[g + 1] && a <= (e * f[f.length - 1] + I[c[g + 1][0]]) / 2) break; e === I[ta] && a < 5 * e && (f = [1, 2, 5]);
        e === I[ta] && a < 5 * e && (f = [1, 2, 5]); c = yb(a / e, f); return { unitRange: e, count: c, unitName: d[0] }
    } function fb(a, b, c, d) {
        var e = [], f = {}, g = M.global.useUTC, h, i = new Date(b), j = a.unitRange, k = a.count; if (v(b)) {
            j >= I[eb] && (i.setMilliseconds(0), i.setSeconds(j >= I[Ya] ? 0 : k * W(i.getSeconds() / k))); if (j >= I[Ya]) i[Nb](j >= I[za] ? 0 : k * W(i[Ab]() / k)); if (j >= I[za]) i[Ob](j >= I[ga] ? 0 : k * W(i[Bb]() / k)); if (j >= I[ga]) i[Cb](j >= I[Na] ? 1 : k * W(i[Oa]() / k)); j >= I[Na] && (i[Pb](j >= I[ta] ? 0 : k * W(i[lb]() / k)), h = i[mb]()); j >= I[ta] && (h -= h % k, i[Qb](h)); if (j === I[Ma]) i[Cb](i[Oa]() -
            i[Db]() + p(d, 1)); b = 1; h = i[mb](); for (var d = i.getTime(), m = i[lb](), l = i[Oa](), o = g ? 0 : (864E5 + i.getTimezoneOffset() * 6E4) % 864E5; d < c;) e.push(d), j === I[ta] ? d = nb(h + b * k, 0) : j === I[Na] ? d = nb(h, m + b * k) : !g && (j === I[ga] || j === I[Ma]) ? d = nb(h, m, l + b * k * (j === I[ga] ? 1 : 7)) : d += j * k, b++; e.push(d); n(Eb(e, function (a) { return j <= I[za] && a % I[ga] === o }), function (a) { f[a] = ga })
        } e.info = y(a, { higherRanks: f, totalRange: j * k }); return e
    } function Rb() { this.symbol = this.color = 0 } function Sb(a, b) {
        var c = a.length, d, e; for (e = 0; e < c; e++) a[e].ss_i = e; a.sort(function (a,
        c) { d = b(a, c); return d === 0 ? a.ss_i - c.ss_i : d }); for (e = 0; e < c; e++) delete a[e].ss_i
    } function Pa(a) { for (var b = a.length, c = a[0]; b--;) a[b] < c && (c = a[b]); return c } function ua(a) { for (var b = a.length, c = a[0]; b--;) a[b] > c && (c = a[b]); return c } function Aa(a, b) { for (var c in a) a[c] && a[c] !== b && a[c].destroy && a[c].destroy(), delete a[c] } function Za(a) { ob || (ob = aa(Qa)); a && ob.appendChild(a); ob.innerHTML = "" } function Ba(a, b) { var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a; if (b) throw c; else Y.console && console.log(c) } function oa(a) { return parseFloat(a.toPrecision(14)) }
    function $a(a, b) { Ra = p(a, b.animation) } function Tb() { var a = M.global.useUTC, b = a ? "getUTC" : "get", c = a ? "setUTC" : "set"; nb = a ? Date.UTC : function (a, b, c, g, h, i) { return (new Date(a, b, p(c, 1), p(g, 0), p(h, 0), p(i, 0))).getTime() }; Ab = b + "Minutes"; Bb = b + "Hours"; Db = b + "Day"; Oa = b + "Date"; lb = b + "Month"; mb = b + "FullYear"; Nb = c + "Minutes"; Ob = c + "Hours"; Cb = c + "Date"; Pb = c + "Month"; Qb = c + "FullYear" } function Ca() { } function ab(a, b, c, d) { this.axis = a; this.pos = b; this.type = c || ""; this.isNew = !0; !c && !d && this.addLabel() } function Fb(a, b) {
        this.axis = a; if (b) this.options =
        b, this.id = b.id
    } function Ub(a, b, c, d, e, f) { var g = a.chart.inverted; this.axis = a; this.isNegative = c; this.options = b; this.x = d; this.stack = e; this.percent = f === "percent"; this.alignOptions = { align: b.align || (g ? c ? "left" : "right" : "center"), verticalAlign: b.verticalAlign || (g ? "middle" : c ? "bottom" : "top"), y: p(b.y, g ? 4 : c ? 14 : -6), x: p(b.x, g ? c ? -6 : 6 : 0) }; this.textAlign = b.textAlign || (g ? c ? "right" : "left" : "center") } function Da() { this.init.apply(this, arguments) } function Gb() { this.init.apply(this, arguments) } function pb(a, b) {
        this.init(a,
        b)
    } function Hb(a, b) { this.init(a, b) } function Sa() { this.init.apply(this, arguments) } function Ib(a) {
        var b = a.options, c = b.navigator, d = c.enabled, b = b.scrollbar, e = b.enabled, f = d ? c.height : 0, g = e ? b.height : 0, h = c.baseSeries; this.baseSeries = a.series[h] || typeof h === "string" && a.get(h) || a.series[0]; this.handles = []; this.scrollbarButtons = []; this.elementsToDestroy = []; this.chart = a; this.height = f; this.scrollbarHeight = g; this.scrollbarEnabled = e; this.navigatorEnabled = d; this.navigatorOptions = c; this.scrollbarOptions = b; this.outlineHeight =
        f + g; this.init()
    } function Jb(a) { this.init(a) } var w, H = document, Y = window, P = Math, r = P.round, W = P.floor, pa = P.ceil, t = P.max, A = P.min, U = P.abs, ha = P.cos, ka = P.sin, bb = P.PI, qb = bb * 2 / 360, Ta = navigator.userAgent, Vb = Y.opera, Xa = /msie/i.test(Ta) && !Vb, rb = H.documentMode === 8, sb = /AppleWebKit/.test(Ta), tb = /Firefox/.test(Ta), ub = /(Mobile|Android|Windows Phone)/.test(Ta), Ea = "http://www.w3.org/2000/svg", ca = !!H.createElementNS && !!H.createElementNS(Ea, "svg").createSVGRect, cc = tb && parseInt(Ta.split("Firefox/")[1], 10) < 4, ia = !ca && !Xa &&
    !!H.createElement("canvas").getContext, cb, gb = H.documentElement.ontouchstart !== w, Wb = {}, Kb = 0, ob, M, ya, Ra, Lb, I, qa = function () { }, Ua = [], Qa = "div", ba = "none", Xb = "rgba(192,192,192," + (ca ? 1.0E-4 : 0.002) + ")", kb = "millisecond", eb = "second", Ya = "minute", za = "hour", ga = "day", Ma = "week", Na = "month", ta = "year", Yb = "stroke-width", nb, Ab, Bb, Db, Oa, lb, mb, Nb, Ob, Cb, Pb, Qb, Q = {}; Y.Highcharts = Y.Highcharts ? Ba(16, !0) : {}; ya = function (a, b, c) {
        if (!v(b) || isNaN(b)) return "Invalid date"; var a = p(a, "%Y-%m-%d %H:%M:%S"), d = new Date(b), e, f = d[Bb](), g = d[Db](),
        h = d[Oa](), i = d[lb](), j = d[mb](), k = M.lang, m = k.weekdays, d = y({ a: m[g].substr(0, 3), A: m[g], d: Ka(h), e: h, b: k.shortMonths[i], B: k.months[i], m: Ka(i + 1), y: j.toString().substr(2, 2), Y: j, H: Ka(f), I: Ka(f % 12 || 12), l: f % 12 || 12, M: Ka(d[Ab]()), p: f < 12 ? "AM" : "PM", P: f < 12 ? "am" : "pm", S: Ka(d.getSeconds()), L: Ka(r(b % 1E3), 3) }, Highcharts.dateFormats); for (e in d) for (; a.indexOf("%" + e) !== -1;) a = a.replace("%" + e, typeof d[e] === "function" ? d[e](b) : d[e]); return c ? a.substr(0, 1).toUpperCase() + a.substr(1) : a
    }; Rb.prototype = {
        wrapColor: function (a) {
            if (this.color >=
            a) this.color = 0
        }, wrapSymbol: function (a) { if (this.symbol >= a) this.symbol = 0 }
    }; I = jb(kb, 1, eb, 1E3, Ya, 6E4, za, 36E5, ga, 864E5, Ma, 6048E5, Na, 26784E5, ta, 31556952E3); Lb = {
        init: function (a, b, c) {
            var b = b || "", d = a.shift, e = b.indexOf("C") > -1, f = e ? 7 : 3, g, b = b.split(" "), c = [].concat(c), h, i, j = function (a) { for (g = a.length; g--;) a[g] === "M" && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2]) }; e && (j(b), j(c)); a.isArea && (h = b.splice(b.length - 6, 6), i = c.splice(c.length - 6, 6)); if (d <= c.length / f) for (; d--;) c = [].concat(c).splice(0, f).concat(c); a.shift =
            0; if (b.length) for (a = c.length; b.length < a;) d = [].concat(b).splice(b.length - f, f), e && (d[f - 6] = d[f - 2], d[f - 5] = d[f - 1]), b = b.concat(d); h && (b = b.concat(h), c = c.concat(i)); return [b, c]
        }, step: function (a, b, c, d) { var e = [], f = a.length; if (c === 1) e = d; else if (f === b.length && c < 1) for (; f--;) d = parseFloat(a[f]), e[f] = isNaN(d) ? a[f] : c * parseFloat(b[f] - d) + d; else e = b; return e }
    }; (function (a) {
        Y.HighchartsAdapter = Y.HighchartsAdapter || a && {
            init: function (b) {
                var c = a.fx, d = c.step, e, f = a.Tween, g = f && f.propHooks; e = a.cssHooks.opacity; a.extend(a.easing,
                { easeOutQuad: function (a, b, c, d, e) { return -d * (b /= e) * (b - 2) + c } }); a.each(["cur", "_default", "width", "height", "opacity"], function (a, b) { var e = d, k, m; b === "cur" ? e = c.prototype : b === "_default" && f && (e = g[b], b = "set"); (k = e[b]) && (e[b] = function (c) { c = a ? c : this; m = c.elem; return m.attr ? m.attr(c.prop, b === "cur" ? w : c.now) : k.apply(this, arguments) }) }); sa(e, "get", function (a, b, c) { return b.attr ? b.opacity || 0 : a.call(this, b, c) }); e = function (a) {
                    var c = a.elem, d; if (!a.started) d = b.init(c, c.d, c.toD), a.start = d[0], a.end = d[1], a.started = !0; c.attr("d",
                    b.step(a.start, a.end, a.pos, c.toD))
                }; f ? g.d = { set: e } : d.d = e; this.each = Array.prototype.forEach ? function (a, b) { return Array.prototype.forEach.call(a, b) } : function (a, b) { for (var c = 0, d = a.length; c < d; c++) if (b.call(a[c], a[c], c, a) === !1) return c }; a.fn.highcharts = function () { var a = "Chart", b = arguments, c, d; ma(b[0]) && (a = b[0], b = Array.prototype.slice.call(b, 1)); c = b[0]; if (c !== w) c.chart = c.chart || {}, c.chart.renderTo = this[0], new Highcharts[a](c, b[1]), d = this; c === w && (d = Ua[G(this[0], "data-highcharts-chart")]); return d }
            }, getScript: a.getScript,
            inArray: a.inArray, adapterRun: function (b, c) { return a(b)[c]() }, grep: a.grep, map: function (a, c) { for (var d = [], e = 0, f = a.length; e < f; e++) d[e] = c.call(a[e], a[e], e, a); return d }, offset: function (b) { return a(b).offset() }, addEvent: function (b, c, d) { a(b).bind(c, d) }, removeEvent: function (b, c, d) { var e = H.removeEventListener ? "removeEventListener" : "detachEvent"; H[e] && b && !b[e] && (b[e] = function () { }); a(b).unbind(c, d) }, fireEvent: function (b, c, d, e) {
                var f = a.Event(c), g = "detached" + c, h; !Xa && d && (delete d.layerX, delete d.layerY); y(f, d);
                b[c] && (b[g] = b[c], b[c] = null); a.each(["preventDefault", "stopPropagation"], function (a, b) { var c = f[b]; f[b] = function () { try { c.call(f) } catch (a) { b === "preventDefault" && (h = !0) } } }); a(b).trigger(f); b[g] && (b[c] = b[g], b[g] = null); e && !f.isDefaultPrevented() && !h && e(f)
            }, washMouseEvent: function (a) { var c = a.originalEvent || a; if (c.pageX === w) c.pageX = a.pageX, c.pageY = a.pageY; return c }, animate: function (b, c, d) { var e = a(b); if (!b.style) b.style = {}; if (c.d) b.toD = c.d, c.d = 1; e.stop(); e.animate(c, d) }, stop: function (b) { a(b).stop() }
        }
    })(Y.jQuery);
    var R = Y.HighchartsAdapter, D = R || {}; R && R.init.call(R, Lb); var vb = D.adapterRun, dc = D.getScript, va = D.inArray, n = D.each, Eb = D.grep, ec = D.offset, Fa = D.map, F = D.addEvent, X = D.removeEvent, K = D.fireEvent, Zb = D.washMouseEvent, Mb = D.animate, hb = D.stop, D = { enabled: !0, align: "center", x: 0, y: 15, style: { color: "#666", cursor: "default", fontSize: "11px", lineHeight: "14px" } }; M = {
        colors: "#2f7ed8,#0d233a,#8bbc21,#910000,#1aadce,#492970,#f28f43,#77a1e5,#c42525,#a6c96a".split(","), symbols: ["circle", "diamond", "square", "triangle", "triangle-down"],
        lang: { loading: "Loading...", months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","), shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), decimalPoint: ".", numericSymbols: "k,M,G,T,P,E".split(","), resetZoom: "Reset zoom", resetZoomTitle: "Reset zoom level 1:1", thousandsSep: "," }, global: {
            useUTC: !0, canvasToolsURL: "http://code.highcharts.com/stock/1.3.2/modules/canvas-tools.js",
            VMLRadialGradientURL: "http://code.highcharts.com/stock/1.3.2/gfx/vml-radial-gradient.png"
        }, chart: { borderColor: "#4572A7", borderRadius: 5, defaultSeriesType: "line", ignoreHiddenSeries: !0, spacingTop: 10, spacingRight: 10, spacingBottom: 15, spacingLeft: 10, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', fontSize: "12px" }, backgroundColor: "#FFFFFF", plotBorderColor: "#C0C0C0", resetZoomButton: { theme: { zIndex: 20 }, position: { align: "right", x: -10, y: 10 } } }, title: {
            text: "Chart title",
            align: "center", y: 15, style: { color: "#274b6d", fontSize: "16px" }
        }, subtitle: { text: "", align: "center", y: 30, style: { color: "#4d759e" } }, plotOptions: {
            line: {
                allowPointSelect: !1, showCheckbox: !1, animation: { duration: 1E3 }, events: {}, lineWidth: 2, marker: { enabled: !0, lineWidth: 0, radius: 4, lineColor: "#FFFFFF", states: { hover: { enabled: !0 }, select: { fillColor: "#FFFFFF", lineColor: "#000000", lineWidth: 2 } } }, point: { events: {} }, dataLabels: z(D, { enabled: !1, formatter: function () { return xa(this.y, -1) }, verticalAlign: "bottom", y: 0 }), cropThreshold: 300,
                pointRange: 0, showInLegend: !0, states: { hover: { marker: {} }, select: { marker: {} } }, stickyTracking: !0
            }
        }, labels: { style: { position: "absolute", color: "#3E576F" } }, legend: {
            enabled: !0, align: "center", layout: "horizontal", labelFormatter: function () { return this.name }, borderWidth: 1, borderColor: "#909090", borderRadius: 5, navigation: { activeColor: "#274b6d", inactiveColor: "#CCC" }, shadow: !1, itemStyle: { cursor: "pointer", color: "#274b6d", fontSize: "12px" }, itemHoverStyle: { color: "#000" }, itemHiddenStyle: { color: "#CCC" }, itemCheckboxStyle: {
                position: "absolute",
                width: "13px", height: "13px"
            }, symbolWidth: 16, symbolPadding: 5, verticalAlign: "bottom", x: 0, y: 0, title: { style: { fontWeight: "bold" } }
        }, loading: { labelStyle: { fontWeight: "bold", position: "relative", top: "1em" }, style: { position: "absolute", backgroundColor: "white", opacity: 0.5, textAlign: "center" } }, tooltip: {
            enabled: !0, animation: ca, backgroundColor: "rgba(255, 255, 255, .85)", borderWidth: 1, borderRadius: 3, dateTimeLabelFormats: {
                millisecond: "%A, %b %e, %H:%M:%S.%L", second: "%A, %b %e, %H:%M:%S", minute: "%A, %b %e, %H:%M", hour: "%A, %b %e, %H:%M",
                day: "%A, %b %e, %Y", week: "Week from %A, %b %e, %Y", month: "%B %Y", year: "%Y"
            }, headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>', pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>', shadow: !0, snap: ub ? 25 : 10, style: { color: "#333333", cursor: "default", fontSize: "12px", padding: "8px", whiteSpace: "nowrap" }
        }, credits: {
            enabled: !0, text: "Highcharts.com", href: "http://www.highcharts.com", position: { align: "right", x: -10, verticalAlign: "bottom", y: -5 }, style: {
                cursor: "pointer",
                color: "#909090", fontSize: "9px"
            }
        }
    }; var S = M.plotOptions, R = S.line; Tb(); var wa = function (a) {
        var b = [], c, d; (function (a) {
            a && a.stops ? d = Fa(a.stops, function (a) { return wa(a[1]) }) : (c = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a)) ? b = [C(c[1]), C(c[2]), C(c[3]), parseFloat(c[4], 10)] : (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a)) ? b = [C(c[1], 16), C(c[2], 16), C(c[3], 16), 1] : (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a)) &&
            (b = [C(c[1]), C(c[2]), C(c[3]), 1])
        })(a); return { get: function (c) { var f; d ? (f = z(a), f.stops = [].concat(f.stops), n(d, function (a, b) { f.stops[b] = [f.stops[b][0], a.get(c)] })) : f = b && !isNaN(b[0]) ? c === "rgb" ? "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")" : c === "a" ? b[3] : "rgba(" + b.join(",") + ")" : a; return f }, brighten: function (a) { if (d) n(d, function (b) { b.brighten(a) }); else if (Ja(a) && a !== 0) { var c; for (c = 0; c < 3; c++) b[c] += C(a * 255), b[c] < 0 && (b[c] = 0), b[c] > 255 && (b[c] = 255) } return this }, rgba: b, setOpacity: function (a) { b[3] = a; return this } }
    }; Ca.prototype =
    {
        init: function (a, b) { this.element = b === "span" ? aa(b) : H.createElementNS(Ea, b); this.renderer = a; this.attrSetters = {} }, opacity: 1, animate: function (a, b, c) { b = p(b, Ra, !0); hb(this); if (b) { b = z(b); if (c) b.complete = c; Mb(this, a, b) } else this.attr(a), c && c() }, attr: function (a, b) {
            var c, d, e, f, g = this.element, h = g.nodeName.toLowerCase(), i = this.renderer, j, k = this.attrSetters, m = this.shadows, l, o, q = this; ma(a) && v(b) && (c = a, a = {}, a[c] = b); if (ma(a)) c = a, h === "circle" ? c = { x: "cx", y: "cy" }[c] || c : c === "strokeWidth" && (c = "stroke-width"), q = G(g, c) ||
            this[c] || 0, c !== "d" && c !== "visibility" && (q = parseFloat(q)); else {
                for (c in a) if (j = !1, d = a[c], e = k[c] && k[c].call(this, d, c), e !== !1) {
                    e !== w && (d = e); if (c === "d") d && d.join && (d = d.join(" ")), /(NaN| {2}|^$)/.test(d) && (d = "M 0 0"); else if (c === "x" && h === "text") for (e = 0; e < g.childNodes.length; e++) f = g.childNodes[e], G(f, "x") === G(g, "x") && G(f, "x", d); else if (this.rotation && (c === "x" || c === "y")) o = !0; else if (c === "fill") d = i.color(d, g, c); else if (h === "circle" && (c === "x" || c === "y")) c = { x: "cx", y: "cy" }[c] || c; else if (h === "rect" && c === "r") G(g,
                    { rx: d, ry: d }), j = !0; else if (c === "translateX" || c === "translateY" || c === "rotation" || c === "verticalAlign" || c === "scaleX" || c === "scaleY") j = o = !0; else if (c === "stroke") d = i.color(d, g, c); else if (c === "dashstyle") if (c = "stroke-dasharray", d = d && d.toLowerCase(), d === "solid") d = ba; else {
                        if (d) {
                            d = d.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash", "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(",");
                            for (e = d.length; e--;) d[e] = C(d[e]) * a["stroke-width"]; d = d.join(",")
                        }
                    } else if (c === "width") d = C(d); else if (c === "align") c = "text-anchor", d = { left: "start", center: "middle", right: "end" }[d]; else if (c === "title") e = g.getElementsByTagName("title")[0], e || (e = H.createElementNS(Ea, "title"), g.appendChild(e)), e.textContent = d; c === "strokeWidth" && (c = "stroke-width"); if (c === "stroke-width" || c === "stroke") {
                        this[c] = d; if (this.stroke && this["stroke-width"]) G(g, "stroke", this.stroke), G(g, "stroke-width", this["stroke-width"]), this.hasStroke =
                        !0; else if (c === "stroke-width" && d === 0 && this.hasStroke) g.removeAttribute("stroke"), this.hasStroke = !1; j = !0
                    } this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c) && (l || (this.symbolAttr(a), l = !0), j = !0); if (m && /^(width|height|visibility|x|y|d|transform)$/.test(c)) for (e = m.length; e--;) G(m[e], c, c === "height" ? t(d - (m[e].cutHeight || 0), 0) : d); if ((c === "width" || c === "height") && h === "rect" && d < 0) d = 0; this[c] = d; c === "text" ? (d !== this.textStr && delete this.bBox, this.textStr = d, this.added && i.buildText(this)) :
                    j || G(g, c, d)
                } o && this.updateTransform()
            } return q
        }, addClass: function (a) { G(this.element, "class", G(this.element, "class") + " " + a); return this }, symbolAttr: function (a) { var b = this; n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","), function (c) { b[c] = p(a[c], b[c]) }); b.attr({ d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b) }) }, clip: function (a) { return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" + a.id + ")" : ba) }, crisp: function (a, b, c, d, e) {
            var f, g = {}, h = {}, i, a = a || this.strokeWidth ||
            this.attr && this.attr("stroke-width") || 0; i = r(a) % 2 / 2; h.x = W(b || this.x || 0) + i; h.y = W(c || this.y || 0) + i; h.width = W((d || this.width || 0) - 2 * i); h.height = W((e || this.height || 0) - 2 * i); h.strokeWidth = a; for (f in h) this[f] !== h[f] && (this[f] = g[f] = h[f]); return g
        }, css: function (a) {
            var b = this.element, c = a && a.width && b.nodeName.toLowerCase() === "text", d, e = "", f = function (a, b) { return "-" + b.toLowerCase() }; if (a && a.color) a.fill = a.color; this.styles = a = y(this.styles, a); ia && c && delete a.width; if (Xa && !ca) c && delete a.width, L(this.element, a); else {
                for (d in a) e +=
                d.replace(/([A-Z])/g, f) + ":" + a[d] + ";"; G(b, "style", e)
            } c && this.added && this.renderer.buildText(this); return this
        }, on: function (a, b) { if (gb && a === "click") this.element.ontouchstart = function (a) { a.preventDefault(); b() }; this.element["on" + a] = b; return this }, setRadialReference: function (a) { this.element.radialReference = a; return this }, translate: function (a, b) { return this.attr({ translateX: a, translateY: b }) }, invert: function () { this.inverted = !0; this.updateTransform(); return this }, htmlCss: function (a) {
            var b = this.element; if (b =
            a && b.tagName === "SPAN" && a.width) delete a.width, this.textWidth = b, this.updateTransform(); this.styles = y(this.styles, a); L(this.element, a); return this
        }, htmlGetBBox: function () { var a = this.element, b = this.bBox; if (!b) { if (a.nodeName === "text") a.style.position = "absolute"; b = this.bBox = { x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight } } return b }, htmlUpdateTransform: function () {
            if (this.added) {
                var a = this.renderer, b = this.element, c = this.translateX || 0, d = this.translateY || 0, e = this.x || 0, f = this.y || 0, g =
                this.textAlign || "left", h = { left: 0, center: 0.5, right: 1 }[g], i = g && g !== "left", j = this.shadows; L(b, { marginLeft: c, marginTop: d }); j && n(j, function (a) { L(a, { marginLeft: c + 1, marginTop: d + 1 }) }); this.inverted && n(b.childNodes, function (c) { a.invertChild(c, b) }); if (b.tagName === "SPAN") {
                    var k, m, j = this.rotation, l, o = 0, q = 1, o = 0, O; l = C(this.textWidth); var u = this.xCorr || 0, s = this.yCorr || 0, x = [j, g, b.innerHTML, this.textWidth].join(","); k = {}; if (x !== this.cTT) {
                        if (v(j)) a.isSVG ? (u = Xa ? "-ms-transform" : sb ? "-webkit-transform" : tb ? "MozTransform" :
                        Vb ? "-o-transform" : "", k[u] = k.transform = "rotate(" + j + "deg)") : (o = j * qb, q = ha(o), o = ka(o), k.filter = j ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", q, ", M12=", -o, ", M21=", o, ", M22=", q, ", sizingMethod='auto expand')"].join("") : ba), L(b, k); k = p(this.elemWidth, b.offsetWidth); m = p(this.elemHeight, b.offsetHeight); if (k > l && /[ \-]/.test(b.textContent || b.innerText)) L(b, { width: l + "px", display: "block", whiteSpace: "normal" }), k = l; l = a.fontMetrics(b.style.fontSize).b; u = q < 0 && -k; s = o < 0 && -m; O = q * o < 0; u += o * l * (O ? 1 - h : h); s -= q * l * (j ?
                        O ? h : 1 - h : 1); i && (u -= k * h * (q < 0 ? -1 : 1), j && (s -= m * h * (o < 0 ? -1 : 1)), L(b, { textAlign: g })); this.xCorr = u; this.yCorr = s
                    } L(b, { left: e + u + "px", top: f + s + "px" }); if (sb) m = b.offsetHeight; this.cTT = x
                }
            } else this.alignOnAdd = !0
        }, updateTransform: function () {
            var a = this.translateX || 0, b = this.translateY || 0, c = this.scaleX, d = this.scaleY, e = this.inverted, f = this.rotation; e && (a += this.attr("width"), b += this.attr("height")); a = ["translate(" + a + "," + b + ")"]; e ? a.push("rotate(90) scale(-1,1)") : f && a.push("rotate(" + f + " " + (this.x || 0) + " " + (this.y || 0) + ")");
            (v(c) || v(d)) && a.push("scale(" + p(c, 1) + " " + p(d, 1) + ")"); a.length && G(this.element, "transform", a.join(" "))
        }, toFront: function () { var a = this.element; a.parentNode.appendChild(a); return this }, align: function (a, b, c) {
            var d, e, f, g, h = {}; e = this.renderer; f = e.alignedObjects; if (a) { if (this.alignOptions = a, this.alignByTranslate = b, !c || ma(c)) this.alignTo = d = c || "renderer", na(f, this), f.push(this), c = null } else a = this.alignOptions, b = this.alignByTranslate, d = this.alignTo; c = p(c, e[d], e); d = a.align; e = a.verticalAlign; f = (c.x || 0) + (a.x ||
            0); g = (c.y || 0) + (a.y || 0); if (d === "right" || d === "center") f += (c.width - (a.width || 0)) / { right: 1, center: 2 }[d]; h[b ? "translateX" : "x"] = r(f); if (e === "bottom" || e === "middle") g += (c.height - (a.height || 0)) / ({ bottom: 1, middle: 2 }[e] || 1); h[b ? "translateY" : "y"] = r(g); this[this.placed ? "animate" : "attr"](h); this.placed = !0; this.alignAttr = h; return this
        }, getBBox: function () {
            var a = this.bBox, b = this.renderer, c, d = this.rotation; c = this.element; var e = this.styles, f = d * qb; if (!a) {
                if (c.namespaceURI === Ea || b.forExport) {
                    try {
                        a = c.getBBox ? y({}, c.getBBox()) :
{ width: c.offsetWidth, height: c.offsetHeight }
                    } catch (g) { } if (!a || a.width < 0) a = { width: 0, height: 0 }
                } else a = this.htmlGetBBox(); if (b.isSVG) { b = a.width; c = a.height; if (Xa && e && e.fontSize === "11px" && c.toPrecision(3) === "22.7") a.height = c = 14; if (d) a.width = U(c * ka(f)) + U(b * ha(f)), a.height = U(c * ha(f)) + U(b * ka(f)) } this.bBox = a
            } return a
        }, show: function () { return this.attr({ visibility: "visible" }) }, hide: function () { return this.attr({ visibility: "hidden" }) }, fadeOut: function (a) { var b = this; b.animate({ opacity: 0 }, { duration: a || 150, complete: function () { b.hide() } }) },
        add: function (a) { var b = this.renderer, c = a || b, d = c.element || b.box, e = d.childNodes, f = this.element, g = G(f, "zIndex"), h; if (a) this.parentGroup = a; this.parentInverted = a && a.inverted; this.textStr !== void 0 && b.buildText(this); if (g) c.handleZ = !0, g = C(g); if (c.handleZ) for (c = 0; c < e.length; c++) if (a = e[c], b = G(a, "zIndex"), a !== f && (C(b) > g || !v(g) && v(b))) { d.insertBefore(f, a); h = !0; break } h || d.appendChild(f); this.added = !0; K(this, "add"); return this }, safeRemoveChild: function (a) { var b = a.parentNode; b && b.removeChild(a) }, destroy: function () {
            var a =
            this, b = a.element || {}, c = a.shadows, d, e; b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null; hb(a); if (a.clipPath) a.clipPath = a.clipPath.destroy(); if (a.stops) { for (e = 0; e < a.stops.length; e++) a.stops[e] = a.stops[e].destroy(); a.stops = null } a.safeRemoveChild(b); c && n(c, function (b) { a.safeRemoveChild(b) }); a.alignTo && na(a.renderer.alignedObjects, a); for (d in a) delete a[d]; return null
        }, shadow: function (a, b, c) {
            var d = [], e, f, g = this.element, h, i, j, k; if (a) {
                i = p(a.width, 3); j = (a.opacity || 0.15) / i; k = this.parentInverted ?
                "(-1,-1)" : "(" + p(a.offsetX, 1) + ", " + p(a.offsetY, 1) + ")"; for (e = 1; e <= i; e++) { f = g.cloneNode(0); h = i * 2 + 1 - 2 * e; G(f, { isShadow: "true", stroke: a.color || "black", "stroke-opacity": j * e, "stroke-width": h, transform: "translate" + k, fill: ba }); if (c) G(f, "height", t(G(f, "height") - h, 0)), f.cutHeight = h; b ? b.element.appendChild(f) : g.parentNode.insertBefore(f, g); d.push(f) } this.shadows = d
            } return this
        }
    }; var Ga = function () { this.init.apply(this, arguments) }; Ga.prototype = {
        Element: Ca, init: function (a, b, c, d) {
            var e = location, f; f = this.createElement("svg").attr({
                xmlns: Ea,
                version: "1.1"
            }); a.appendChild(f.element); this.isSVG = !0; this.box = f.element; this.boxWrapper = f; this.alignedObjects = []; this.url = (tb || sb) && H.getElementsByTagName("base").length ? e.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : ""; this.createElement("desc").add().element.appendChild(H.createTextNode("Created with Highstock 1.3.2")); this.defs = this.createElement("defs").add(); this.forExport = d; this.gradients = {}; this.setSize(b, c, !1); var g; if (tb && a.getBoundingClientRect) this.subPixelFix =
            b = function () { L(a, { left: 0, top: 0 }); g = a.getBoundingClientRect(); L(a, { left: pa(g.left) - g.left + "px", top: pa(g.top) - g.top + "px" }) }, b(), F(Y, "resize", b)
        }, isHidden: function () { return !this.boxWrapper.getBBox().width }, destroy: function () { var a = this.defs; this.box = null; this.boxWrapper = this.boxWrapper.destroy(); Aa(this.gradients || {}); this.gradients = null; if (a) this.defs = a.destroy(); this.subPixelFix && X(Y, "resize", this.subPixelFix); return this.alignedObjects = null }, createElement: function (a) {
            var b = new this.Element; b.init(this,
            a); return b
        }, draw: function () { }, buildText: function (a) {
            for (var b = a.element, c = this, d = c.forExport, e = p(a.textStr, "").toString().replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g), f = b.childNodes, g = /style="([^"]+)"/, h = /href="([^"]+)"/, i = G(b, "x"), j = a.styles, k = j && j.width && C(j.width), m = j && j.lineHeight, l = f.length; l--;) b.removeChild(f[l]); k && !a.added && this.box.appendChild(b);
            e[e.length - 1] === "" && e.pop(); n(e, function (e, f) {
                var l, u = 0, e = e.replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||"); l = e.split("|||"); n(l, function (e) {
                    if (e !== "" || l.length === 1) {
                        var o = {}, n = H.createElementNS(Ea, "tspan"), p; g.test(e) && (p = e.match(g)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), G(n, "style", p)); h.test(e) && !d && (G(n, "onclick", 'location.href="' + e.match(h)[1] + '"'), L(n, { cursor: "pointer" })); e = (e.replace(/<(.|\n)*?>/g, "") || " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); n.appendChild(H.createTextNode(e));
                        u ? o.dx = 0 : o.x = i; G(n, o); !u && f && (!ca && d && L(n, { display: "block" }), G(n, "dy", m || c.fontMetrics(/px$/.test(n.style.fontSize) ? n.style.fontSize : j.fontSize).h, sb && n.offsetHeight)); b.appendChild(n); u++; if (k) for (var e = e.replace(/([^\^])-/g, "$1- ").split(" "), E, B = []; e.length || B.length;) delete a.bBox, E = a.getBBox().width, o = E > k, !o || e.length === 1 ? (e = B, B = [], e.length && (n = H.createElementNS(Ea, "tspan"), G(n, { dy: m || 16, x: i }), p && G(n, "style", p), b.appendChild(n), E > k && (k = E))) : (n.removeChild(n.firstChild), B.unshift(e.pop())), e.length &&
                        n.appendChild(H.createTextNode(e.join(" ").replace(/- /g, "-")))
                    }
                })
            })
        }, button: function (a, b, c, d, e, f, g) {
            var h = this.label(a, b, c, null, null, null, null, null, "button"), i = 0, j, k, m, l, o, a = { x1: 0, y1: 0, x2: 0, y2: 1 }, e = z({ "stroke-width": 1, stroke: "#CCCCCC", fill: { linearGradient: a, stops: [[0, "#FEFEFE"], [1, "#F6F6F6"]] }, r: 2, padding: 5, style: { color: "black" } }, e); m = e.style; delete e.style; f = z(e, { stroke: "#68A", fill: { linearGradient: a, stops: [[0, "#FFF"], [1, "#ACF"]] } }, f); l = f.style; delete f.style; g = z(e, {
                stroke: "#68A", fill: {
                    linearGradient: a,
                    stops: [[0, "#9BD"], [1, "#CDF"]]
                }
            }, g); o = g.style; delete g.style; F(h.element, "mouseenter", function () { h.attr(f).css(l) }); F(h.element, "mouseleave", function () { j = [e, f, g][i]; k = [m, l, o][i]; h.attr(j).css(k) }); h.setState = function (a) { (i = a) ? a === 2 && h.attr(g).css(o) : h.attr(e).css(m) }; return h.on("click", function () { d.call(h) }).attr(e).css(y({ cursor: "default" }, m))
        }, crispLine: function (a, b) { a[1] === a[4] && (a[1] = a[4] = r(a[1]) - b % 2 / 2); a[2] === a[5] && (a[2] = a[5] = r(a[2]) + b % 2 / 2); return a }, path: function (a) {
            var b = { fill: ba }; Wa(a) ? b.d =
                a : da(a) && y(b, a); return this.createElement("path").attr(b)
        }, circle: function (a, b, c) { a = da(a) ? a : { x: a, y: b, r: c }; return this.createElement("circle").attr(a) }, arc: function (a, b, c, d, e, f) { if (da(a)) b = a.y, c = a.r, d = a.innerR, e = a.start, f = a.end, a = a.x; return this.symbol("arc", a || 0, b || 0, c || 0, c || 0, { innerR: d || 0, start: e || 0, end: f || 0 }) }, rect: function (a, b, c, d, e, f) { e = da(a) ? a.r : e; e = this.createElement("rect").attr({ rx: e, ry: e, fill: ba }); return e.attr(da(a) ? a : e.crisp(f, a, b, t(c, 0), t(d, 0))) }, setSize: function (a, b, c) {
            var d = this.alignedObjects,
            e = d.length; this.width = a; this.height = b; for (this.boxWrapper[p(c, !0) ? "animate" : "attr"]({ width: a, height: b }) ; e--;) d[e].align()
        }, g: function (a) { var b = this.createElement("g"); return v(a) ? b.attr({ "class": "highcharts-" + a }) : b }, image: function (a, b, c, d, e) { var f = { preserveAspectRatio: ba }; arguments.length > 1 && y(f, { x: b, y: c, width: d, height: e }); f = this.createElement("image").attr(f); f.element.setAttributeNS ? f.element.setAttributeNS("http://www.w3.org/1999/xlink", "href", a) : f.element.setAttribute("hc-svg-href", a); return f },
        symbol: function (a, b, c, d, e, f) { var g, h = this.symbols[a], h = h && h(r(b), r(c), d, e, f), i = /^url\((.*?)\)$/, j, k; if (h) g = this.path(h), y(g, { symbolName: a, x: b, y: c, width: d, height: e }), f && y(g, f); else if (i.test(a)) k = function (a, b) { a.element && (a.attr({ width: b[0], height: b[1] }), a.alignByTranslate || a.translate(r((d - b[0]) / 2), r((e - b[1]) / 2))) }, j = a.match(i)[1], a = Wb[j], g = this.image(j).attr({ x: b, y: c }), g.isImg = !0, a ? k(g, a) : (g.attr({ width: 0, height: 0 }), aa("img", { onload: function () { k(g, Wb[j] = [this.width, this.height]) }, src: j })); return g },
        symbols: {
            circle: function (a, b, c, d) { var e = 0.166 * c; return ["M", a + c / 2, b, "C", a + c + e, b, a + c + e, b + d, a + c / 2, b + d, "C", a - e, b + d, a - e, b, a + c / 2, b, "Z"] }, square: function (a, b, c, d) { return ["M", a, b, "L", a + c, b, a + c, b + d, a, b + d, "Z"] }, triangle: function (a, b, c, d) { return ["M", a + c / 2, b, "L", a + c, b + d, a, b + d, "Z"] }, "triangle-down": function (a, b, c, d) { return ["M", a, b, "L", a + c, b, a + c / 2, b + d, "Z"] }, diamond: function (a, b, c, d) { return ["M", a + c / 2, b, "L", a + c, b + d / 2, a + c / 2, b + d, a, b + d / 2, "Z"] }, arc: function (a, b, c, d, e) {
                var f = e.start, c = e.r || c || d, g = e.end - 0.001, d = e.innerR,
                h = e.open, i = ha(f), j = ka(f), k = ha(g), g = ka(g), e = e.end - f < bb ? 0 : 1; return ["M", a + c * i, b + c * j, "A", c, c, 0, e, 1, a + c * k, b + c * g, h ? "M" : "L", a + d * k, b + d * g, "A", d, d, 0, e, 0, a + d * i, b + d * j, h ? "" : "Z"]
            }
        }, clipRect: function (a, b, c, d) { var e = "highcharts-" + Kb++, f = this.createElement("clipPath").attr({ id: e }).add(this.defs), a = this.rect(a, b, c, d, 0).add(f); a.id = e; a.clipPath = f; return a }, color: function (a, b, c) {
            var d = this, e, f = /^rgba/, g, h, i, j, k, m, l, o = []; a && a.linearGradient ? g = "linearGradient" : a && a.radialGradient && (g = "radialGradient"); if (g) {
                c = a[g]; h = d.gradients;
                j = a.stops; b = b.radialReference; Wa(c) && (a[g] = c = { x1: c[0], y1: c[1], x2: c[2], y2: c[3], gradientUnits: "userSpaceOnUse" }); g === "radialGradient" && b && !v(c.gradientUnits) && (c = z(c, { cx: b[0] - b[2] / 2 + c.cx * b[2], cy: b[1] - b[2] / 2 + c.cy * b[2], r: c.r * b[2], gradientUnits: "userSpaceOnUse" })); for (l in c) l !== "id" && o.push(l, c[l]); for (l in j) o.push(j[l]); o = o.join(","); h[o] ? a = h[o].id : (c.id = a = "highcharts-" + Kb++, h[o] = i = d.createElement(g).attr(c).add(d.defs), i.stops = [], n(j, function (a) {
                    f.test(a[1]) ? (e = wa(a[1]), k = e.get("rgb"), m = e.get("a")) :
                    (k = a[1], m = 1); a = d.createElement("stop").attr({ offset: a[0], "stop-color": k, "stop-opacity": m }).add(i); i.stops.push(a)
                })); return "url(" + d.url + "#" + a + ")"
            } else return f.test(a) ? (e = wa(a), G(b, c + "-opacity", e.get("a")), e.get("rgb")) : (b.removeAttribute(c + "-opacity"), a)
        }, text: function (a, b, c, d) {
            var e = M.chart.style, f = ia || !ca && this.forExport; if (d && !this.forExport) return this.html(a, b, c); b = r(p(b, 0)); c = r(p(c, 0)); a = this.createElement("text").attr({ x: b, y: c, text: a }).css({ fontFamily: e.fontFamily, fontSize: e.fontSize }); f &&
            a.css({ position: "absolute" }); a.x = b; a.y = c; return a
        }, html: function (a, b, c) {
            var d = M.chart.style, e = this.createElement("span"), f = e.attrSetters, g = e.element, h = e.renderer; f.text = function (a) { a !== g.innerHTML && delete this.bBox; g.innerHTML = a; return !1 }; f.x = f.y = f.align = function (a, b) { b === "align" && (b = "textAlign"); e[b] = a; e.htmlUpdateTransform(); return !1 }; e.attr({ text: a, x: r(b), y: r(c) }).css({ position: "absolute", whiteSpace: "nowrap", fontFamily: d.fontFamily, fontSize: d.fontSize }); e.css = e.htmlCss; if (h.isSVG) e.add = function (a) {
                var b,
                c = h.box.parentNode, d = []; if (a) { if (b = a.div, !b) { for (; a;) d.push(a), a = a.parentGroup; n(d.reverse(), function (a) { var d; b = a.div = a.div || aa(Qa, { className: G(a.element, "class") }, { position: "absolute", left: (a.translateX || 0) + "px", top: (a.translateY || 0) + "px" }, b || c); d = b.style; y(a.attrSetters, { translateX: function (a) { d.left = a + "px" }, translateY: function (a) { d.top = a + "px" }, visibility: function (a, b) { d[b] = a } }) }) } } else b = c; b.appendChild(g); e.added = !0; e.alignOnAdd && e.htmlUpdateTransform(); return e
            }; return e
        }, fontMetrics: function (a) {
            var a =
            C(a || 11), a = a < 24 ? a + 4 : r(a * 1.2), b = r(a * 0.8); return { h: a, b: b }
        }, label: function (a, b, c, d, e, f, g, h, i) {
            function j() { var a, b; a = O.element.style; p = (E === void 0 || B === void 0 || q.styles.textAlign) && O.getBBox(); q.width = (E || p.width || 0) + 2 * N + fa; q.height = (B || p.height || 0) + 2 * N; db = N + o.fontMetrics(a && a.fontSize).b; if (A) { if (!u) a = r(-x * N), b = h ? -db : 0, q.box = u = d ? o.symbol(d, a, b, q.width, q.height) : o.rect(a, b, q.width, q.height, 0, wb[Yb]), u.add(q); u.isImg || u.attr(z({ width: q.width, height: q.height }, wb)); wb = null } } function k() {
                var a = q.styles,
                a = a && a.textAlign, b = fa + N * (1 - x), c; c = h ? 0 : db; if (v(E) && (a === "center" || a === "right")) b += { center: 0.5, right: 1 }[a] * (E - p.width); (b !== O.x || c !== O.y) && O.attr({ x: b, y: c }); O.x = b; O.y = c
            } function m(a, b) { u ? u.attr(a, b) : wb[a] = b } function l() { O.add(q); q.attr({ text: a, x: b, y: c }); u && v(e) && q.attr({ anchorX: e, anchorY: f }) } var o = this, q = o.g(i), O = o.text("", 0, 0, g).attr({ zIndex: 1 }), u, p, x = 0, N = 3, fa = 0, E, B, T, t, J = 0, wb = {}, db, g = q.attrSetters, A; F(q, "add", l); g.width = function (a) { E = a; return !1 }; g.height = function (a) { B = a; return !1 }; g.padding = function (a) {
                v(a) &&
                a !== N && (N = a, k()); return !1
            }; g.paddingLeft = function (a) { v(a) && a !== fa && (fa = a, k()); return !1 }; g.align = function (a) { x = { left: 0, center: 0.5, right: 1 }[a]; return !1 }; g.text = function (a, b) { O.attr(b, a); j(); k(); return !1 }; g[Yb] = function (a, b) { A = !0; J = a % 2 / 2; m(b, a); return !1 }; g.stroke = g.fill = g.r = function (a, b) { b === "fill" && (A = !0); m(b, a); return !1 }; g.anchorX = function (a, b) { e = a; m(b, a + J - T); return !1 }; g.anchorY = function (a, b) { f = a; m(b, a - t); return !1 }; g.x = function (a) { q.x = a; a -= x * ((E || p.width) + N); T = r(a); q.attr("translateX", T); return !1 };
            g.y = function (a) { t = q.y = r(a); q.attr("translateY", t); return !1 }; var C = q.css; return y(q, {
                css: function (a) { if (a) { var b = {}, a = z(a); n("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration".split(","), function (c) { a[c] !== w && (b[c] = a[c], delete a[c]) }); O.css(b) } return C.call(q, a) }, getBBox: function () { return { width: p.width + 2 * N, height: p.height + 2 * N, x: p.x - N, y: p.y - N } }, shadow: function (a) { u && u.shadow(a); return q }, destroy: function () {
                    X(q, "add", l); X(q.element, "mouseenter"); X(q.element, "mouseleave"); O && (O = O.destroy());
                    u && (u = u.destroy()); Ca.prototype.destroy.call(q); q = o = j = k = m = l = null
                }
            })
        }
    }; cb = Ga; var ib, Z; if (!ca && !ia) Highcharts.VMLElement = Z = {
        init: function (a, b) { var c = ["<", b, ' filled="f" stroked="f"'], d = ["position: ", "absolute", ";"], e = b === Qa; (b === "shape" || e) && d.push("left:0;top:0;width:1px;height:1px;"); d.push("visibility: ", e ? "hidden" : "visible"); c.push(' style="', d.join(""), '"/>'); if (b) c = e || b === "span" || b === "img" ? c.join("") : a.prepVML(c), this.element = aa(c); this.renderer = a; this.attrSetters = {} }, add: function (a) {
            var b = this.renderer,
            c = this.element, d = b.box, d = a ? a.element || a : d; a && a.inverted && b.invertChild(c, d); d.appendChild(c); this.added = !0; this.alignOnAdd && !this.deferUpdateTransform && this.updateTransform(); K(this, "add"); return this
        }, updateTransform: Ca.prototype.htmlUpdateTransform, attr: function (a, b) {
            var c, d, e, f = this.element || {}, g = f.style, h = f.nodeName, i = this.renderer, j = this.symbolName, k, m = this.shadows, l, o = this.attrSetters, q = this; ma(a) && v(b) && (c = a, a = {}, a[c] = b); if (ma(a)) c = a, q = c === "strokeWidth" || c === "stroke-width" ? this.strokeweight :
            this[c]; else for (c in a) if (d = a[c], l = !1, e = o[c] && o[c].call(this, d, c), e !== !1 && d !== null) {
                e !== w && (d = e); if (j && /^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c)) k || (this.symbolAttr(a), k = !0), l = !0; else if (c === "d") {
                    d = d || []; this.d = d.join(" "); e = d.length; l = []; for (var n; e--;) if (Ja(d[e])) l[e] = r(d[e] * 10) - 5; else if (d[e] === "Z") l[e] = "x"; else if (l[e] = d[e], d.isArc && (d[e] === "wa" || d[e] === "at")) n = d[e] === "wa" ? 1 : -1, l[e + 5] === l[e + 7] && (l[e + 7] -= n), l[e + 6] === l[e + 8] && (l[e + 8] -= n); d = l.join(" ") || "x"; f.path = d; if (m) for (e =
                    m.length; e--;) m[e].path = m[e].cutOff ? this.cutOffPath(d, m[e].cutOff) : d; l = !0
                } else if (c === "visibility") { if (m) for (e = m.length; e--;) m[e].style[c] = d; h === "DIV" && (d = d === "hidden" ? "-999em" : 0, rb || (g[c] = d ? "visible" : "hidden"), c = "top"); g[c] = d; l = !0 } else if (c === "zIndex") d && (g[c] = d), l = !0; else if (va(c, ["x", "y", "width", "height"]) !== -1) this[c] = d, c === "x" || c === "y" ? c = { x: "left", y: "top" }[c] : d = t(0, d), this.updateClipping ? (this[c] = d, this.updateClipping()) : g[c] = d, l = !0; else if (c === "class" && h === "DIV") f.className = d; else if (c === "stroke") d =
                i.color(d, f, c), c = "strokecolor"; else if (c === "stroke-width" || c === "strokeWidth") f.stroked = d ? !0 : !1, c = "strokeweight", this[c] = d, Ja(d) && (d += "px"); else if (c === "dashstyle") (f.getElementsByTagName("stroke")[0] || aa(i.prepVML(["<stroke/>"]), null, null, f))[c] = d || "solid", this.dashstyle = d, l = !0; else if (c === "fill") if (h === "SPAN") g.color = d; else { if (h !== "IMG") f.filled = d !== ba ? !0 : !1, d = i.color(d, f, c, this), c = "fillcolor" } else if (c === "opacity") l = !0; else if (h === "shape" && c === "rotation") this[c] = d, f.style.left = -r(ka(d * qb) + 1) + "px",
                f.style.top = r(ha(d * qb)) + "px"; else if (c === "translateX" || c === "translateY" || c === "rotation") this[c] = d, this.updateTransform(), l = !0; else if (c === "text") this.bBox = null, f.innerHTML = d, l = !0; l || (rb ? f[c] = d : G(f, c, d))
            } return q
        }, clip: function (a) { var b = this, c; a ? (c = a.members, na(c, b), c.push(b), b.destroyClip = function () { na(c, b) }, a = a.getCSS(b)) : (b.destroyClip && b.destroyClip(), a = { clip: rb ? "inherit" : "rect(auto)" }); return b.css(a) }, css: Ca.prototype.htmlCss, safeRemoveChild: function (a) { a.parentNode && Za(a) }, destroy: function () {
            this.destroyClip &&
            this.destroyClip(); return Ca.prototype.destroy.apply(this)
        }, on: function (a, b) { this.element["on" + a] = function () { var a = Y.event; a.target = a.srcElement; b(a) }; return this }, cutOffPath: function (a, b) { var c, a = a.split(/[ ,]/); c = a.length; if (c === 9 || c === 11) a[c - 4] = a[c - 2] = C(a[c - 2]) - 10 * b; return a.join(" ") }, shadow: function (a, b, c) {
            var d = [], e, f = this.element, g = this.renderer, h, i = f.style, j, k = f.path, m, l, o, q; k && typeof k.value !== "string" && (k = "x"); l = k; if (a) {
                o = p(a.width, 3); q = (a.opacity || 0.15) / o; for (e = 1; e <= 3; e++) {
                    m = o * 2 + 1 - 2 * e;
                    c && (l = this.cutOffPath(k.value, m + 0.5)); j = ['<shape isShadow="true" strokeweight="', m, '" filled="false" path="', l, '" coordsize="10 10" style="', f.style.cssText, '" />']; h = aa(g.prepVML(j), null, { left: C(i.left) + p(a.offsetX, 1), top: C(i.top) + p(a.offsetY, 1) }); if (c) h.cutOff = m + 1; j = ['<stroke color="', a.color || "black", '" opacity="', q * e, '"/>']; aa(g.prepVML(j), null, null, h); b ? b.element.appendChild(h) : f.parentNode.insertBefore(h, f); d.push(h)
                } this.shadows = d
            } return this
        }
    }, Z = ea(Ca, Z), Z = {
        Element: Z, isIE8: Ta.indexOf("MSIE 8.0") >
        -1, init: function (a, b, c) { var d, e; this.alignedObjects = []; d = this.createElement(Qa); e = d.element; e.style.position = "relative"; a.appendChild(d.element); this.isVML = !0; this.box = e; this.boxWrapper = d; this.setSize(b, c, !1); if (!H.namespaces.hcv) H.namespaces.add("hcv", "urn:schemas-microsoft-com:vml"), H.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } " }, isHidden: function () { return !this.box.offsetWidth }, clipRect: function (a, b, c, d) {
            var e =
            this.createElement(), f = da(a); return y(e, { members: [], left: f ? a.x : a, top: f ? a.y : b, width: f ? a.width : c, height: f ? a.height : d, getCSS: function (a) { var b = a.element, c = b.nodeName, a = a.inverted, d = this.top - (c === "shape" ? b.offsetTop : 0), e = this.left, b = e + this.width, f = d + this.height, d = { clip: "rect(" + r(a ? e : d) + "px," + r(a ? f : b) + "px," + r(a ? b : f) + "px," + r(a ? d : e) + "px)" }; !a && rb && c === "DIV" && y(d, { width: b + "px", height: f + "px" }); return d }, updateClipping: function () { n(e.members, function (a) { a.css(e.getCSS(a)) }) } })
        }, color: function (a, b, c, d) {
            var e =
            this, f, g = /^rgba/, h, i, j = ba; a && a.linearGradient ? i = "gradient" : a && a.radialGradient && (i = "pattern"); if (i) {
                var k, m, l = a.linearGradient || a.radialGradient, o, q, p, u, s, x = "", a = a.stops, N, fa = [], E = function () { h = ['<fill colors="' + fa.join(",") + '" opacity="', p, '" o:opacity2="', q, '" type="', i, '" ', x, 'focus="100%" method="any" />']; aa(e.prepVML(h), null, null, b) }; o = a[0]; N = a[a.length - 1]; o[0] > 0 && a.unshift([0, o[1]]); N[0] < 1 && a.push([1, N[1]]); n(a, function (a, b) {
                    g.test(a[1]) ? (f = wa(a[1]), k = f.get("rgb"), m = f.get("a")) : (k = a[1], m = 1);
                    fa.push(a[0] * 100 + "% " + k); b ? (p = m, u = k) : (q = m, s = k)
                }); if (c === "fill") if (i === "gradient") c = l.x1 || l[0] || 0, a = l.y1 || l[1] || 0, o = l.x2 || l[2] || 0, l = l.y2 || l[3] || 0, x = 'angle="' + (90 - P.atan((l - a) / (o - c)) * 180 / bb) + '"', E(); else {
                    var j = l.r, B = j * 2, T = j * 2, t = l.cx, w = l.cy, v = b.radialReference, r, j = function () { v && (r = d.getBBox(), t += (v[0] - r.x) / r.width - 0.5, w += (v[1] - r.y) / r.height - 0.5, B *= v[2] / r.width, T *= v[2] / r.height); x = 'src="' + M.global.VMLRadialGradientURL + '" size="' + B + "," + T + '" origin="0.5,0.5" position="' + t + "," + w + '" color2="' + s + '" '; E() };
                    d.added ? j() : F(d, "add", j); j = u
                } else j = k
            } else if (g.test(a) && b.tagName !== "IMG") f = wa(a), h = ["<", c, ' opacity="', f.get("a"), '"/>'], aa(this.prepVML(h), null, null, b), j = f.get("rgb"); else { j = b.getElementsByTagName(c); if (j.length) j[0].opacity = 1, j[0].type = "solid"; j = a } return j
        }, prepVML: function (a) {
            var b = this.isIE8, a = a.join(""); b ? (a = a.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />'), a = a.indexOf('style="') === -1 ? a.replace("/>", ' style="display:inline-block;behavior:url(#default#VML);" />') : a.replace('style="',
            'style="display:inline-block;behavior:url(#default#VML);')) : a = a.replace("<", "<hcv:"); return a
        }, text: Ga.prototype.html, path: function (a) { var b = { coordsize: "10 10" }; Wa(a) ? b.d = a : da(a) && y(b, a); return this.createElement("shape").attr(b) }, circle: function (a, b, c) { var d = this.symbol("circle"); if (da(a)) c = a.r, b = a.y, a = a.x; d.isCircle = !0; return d.attr({ x: a, y: b, width: 2 * c, height: 2 * c }) }, g: function (a) { var b; a && (b = { className: "highcharts-" + a, "class": "highcharts-" + a }); return this.createElement(Qa).attr(b) }, image: function (a,
        b, c, d, e) { var f = this.createElement("img").attr({ src: a }); arguments.length > 1 && f.attr({ x: b, y: c, width: d, height: e }); return f }, rect: function (a, b, c, d, e, f) { if (da(a)) b = a.y, c = a.width, d = a.height, f = a.strokeWidth, a = a.x; var g = this.symbol("rect"); g.r = e; return g.attr(g.crisp(f, a, b, t(c, 0), t(d, 0))) }, invertChild: function (a, b) { var c = b.style; L(a, { flip: "x", left: C(c.width) - 1, top: C(c.height) - 1, rotation: -90 }) }, symbols: {
            arc: function (a, b, c, d, e) {
                var f = e.start, g = e.end, h = e.r || c || d, c = e.innerR, d = ha(f), i = ka(f), j = ha(g), k = ka(g); if (g -
                f === 0) return ["x"]; f = ["wa", a - h, b - h, a + h, b + h, a + h * d, b + h * i, a + h * j, b + h * k]; e.open && !c && f.push("e", "M", a, b); f.push("at", a - c, b - c, a + c, b + c, a + c * j, b + c * k, a + c * d, b + c * i, "x", "e"); f.isArc = !0; return f
            }, circle: function (a, b, c, d, e) { e && e.isCircle && (a -= c / 2, b -= d / 2); return ["wa", a, b, a + c, b + d, a + c, b + d / 2, a + c, b + d / 2, "e"] }, rect: function (a, b, c, d, e) {
                var f = a + c, g = b + d, h; !v(e) || !e.r ? f = Ga.prototype.symbols.square.apply(0, arguments) : (h = A(e.r, c, d), f = ["M", a + h, b, "L", f - h, b, "wa", f - 2 * h, b, f, b + 2 * h, f - h, b, f, b + h, "L", f, g - h, "wa", f - 2 * h, g - 2 * h, f, g, f, g - h, f -
                h, g, "L", a + h, g, "wa", a, g - 2 * h, a + 2 * h, g, a + h, g, a, g - h, "L", a, b + h, "wa", a, b, a + 2 * h, b + 2 * h, a, b + h, a + h, b, "x", "e"]); return f
            }
        }
    }, Highcharts.VMLRenderer = ib = function () { this.init.apply(this, arguments) }, ib.prototype = z(Ga.prototype, Z), cb = ib; var $b; if (ia) Highcharts.CanVGRenderer = Z = function () { Ea = "http://www.w3.org/1999/xhtml" }, Z.prototype.symbols = {}, $b = function () { function a() { var a = b.length, d; for (d = 0; d < a; d++) b[d](); b = [] } var b = []; return { push: function (c, d) { b.length === 0 && dc(d, a); b.push(c) } } }(), cb = Z; ab.prototype = {
        addLabel: function () {
            var a =
            this.axis, b = a.options, c = a.chart, d = a.horiz, e = a.categories, f = a.series[0] && a.series[0].names, g = this.pos, h = b.labels, i = a.tickPositions, d = d && e && !h.step && !h.staggerLines && !h.rotation && c.plotWidth / i.length || !d && (c.optionsMarginLeft || c.plotWidth / 2), j = g === i[0], k = g === i[i.length - 1], f = e ? p(e[g], f && f[g], g) : g, e = this.label, i = i.info, m; a.isDatetimeAxis && i && (m = b.dateTimeLabelFormats[i.higherRanks[g] || i.unitName]); this.isFirst = j; this.isLast = k; b = a.labelFormatter.call({
                axis: a, chart: c, isFirst: j, isLast: k, dateTimeLabelFormat: m,
                value: a.isLog ? oa(la(f)) : f
            }); g = d && { width: t(1, r(d - 2 * (h.padding || 10))) + "px" }; g = y(g, h.style); if (v(e)) e && e.attr({ text: b }).css(g); else { d = { align: h.align }; if (Ja(h.rotation)) d.rotation = h.rotation; this.label = v(b) && h.enabled ? c.renderer.text(b, 0, 0, h.useHTML).attr(d).css(g).add(a.labelGroup) : null }
        }, getLabelSize: function () { var a = this.label, b = this.axis; return a ? (this.labelBBox = a.getBBox())[b.horiz ? "height" : "width"] : 0 }, getLabelSides: function () {
            var a = this.axis.options.labels, b = this.labelBBox.width, a = b * {
                left: 0, center: 0.5,
                right: 1
            }[a.align] - a.x; return [-a, b - a]
        }, handleOverflow: function (a, b) { var c = !0, d = this.axis, e = d.chart, f = this.isFirst, g = this.isLast, h = b.x, i = d.reversed, j = d.tickPositions; if (f || g) { var k = this.getLabelSides(), m = k[0], k = k[1], e = e.plotLeft, l = e + d.len, j = (d = d.ticks[j[a + (f ? 1 : -1)]]) && d.label.xy && d.label.xy.x + d.getLabelSides()[f ? 0 : 1]; f && !i || g && i ? h + m < e && (h = e - m, d && h + k > j && (c = !1)) : h + k > l && (h = l - k, d && h + m < j && (c = !1)); b.x = h } return c }, getPosition: function (a, b, c, d) {
            var e = this.axis, f = e.chart, g = d && f.oldChartHeight || f.chartHeight;
            return { x: a ? e.translate(b + c, null, null, d) + e.transB : e.left + e.offset + (e.opposite ? (d && f.oldChartWidth || f.chartWidth) - e.right - e.left : 0), y: a ? g - e.bottom + e.offset - (e.opposite ? e.height : 0) : g - e.translate(b + c, null, null, d) - e.transB }
        }, getLabelPosition: function (a, b, c, d, e, f, g, h) { var i = this.axis, j = i.transA, k = i.reversed, i = i.staggerLines, a = a + e.x - (f && d ? f * j * (k ? -1 : 1) : 0), b = b + e.y - (f && !d ? f * j * (k ? 1 : -1) : 0); v(e.y) || (b += C(c.styles.lineHeight) * 0.9 - c.getBBox().height / 2); i && (b += g / (h || 1) % i * 16); return { x: a, y: b } }, getMarkPath: function (a,
        b, c, d, e, f) { return f.crispLine(["M", a, b, "L", a + (e ? 0 : -c), b + (e ? c : 0)], d) }, render: function (a, b, c) {
            var d = this.axis, e = d.options, f = d.chart.renderer, g = d.horiz, h = this.type, i = this.label, j = this.pos, k = e.labels, m = this.gridLine, l = h ? h + "Grid" : "grid", o = h ? h + "Tick" : "tick", q = e[l + "LineWidth"], n = e[l + "LineColor"], u = e[l + "LineDashStyle"], s = e[o + "Length"], l = e[o + "Width"] || 0, x = e[o + "Color"], t = e[o + "Position"], o = this.mark, fa = k.step, E = !0, B = d.tickmarkOffset, T = this.getPosition(g, j, B, b), v = T.x, T = T.y, r = g && v === d.pos || !g && T === d.pos + d.len ?
            -1 : 1, z = d.staggerLines; this.isActive = !0; if (q) { j = d.getPlotLinePath(j + B, q * r, b, !0); if (m === w) { m = { stroke: n, "stroke-width": q }; if (u) m.dashstyle = u; if (!h) m.zIndex = 1; if (b) m.opacity = 0; this.gridLine = m = q ? f.path(j).attr(m).add(d.gridGroup) : null } if (!b && m && j) m[this.isNew ? "attr" : "animate"]({ d: j, opacity: c }) } if (l && s) t === "inside" && (s = -s), d.opposite && (s = -s), b = this.getMarkPath(v, T, s, l * r, g, f), o ? o.animate({ d: b, opacity: c }) : this.mark = f.path(b).attr({ stroke: x, "stroke-width": l, opacity: c }).add(d.axisGroup); if (i && !isNaN(v)) i.xy =
            T = this.getLabelPosition(v, T, i, g, k, B, a, fa), this.isFirst && !p(e.showFirstLabel, 1) || this.isLast && !p(e.showLastLabel, 1) ? E = !1 : !z && g && k.overflow === "justify" && !this.handleOverflow(a, T) && (E = !1), fa && a % fa && (E = !1), E && !isNaN(T.y) ? (T.opacity = c, i[this.isNew ? "attr" : "animate"](T), this.isNew = !1) : i.attr("y", -9999)
        }, destroy: function () { Aa(this, this.axis) }
    }; Fb.prototype = {
        render: function () {
            var a = this, b = a.axis, c = b.horiz, d = (b.pointRange || 0) / 2, e = a.options, f = e.label, g = a.label, h = e.width, i = e.to, j = e.from, k = v(j) && v(i), m = e.value,
            l = e.dashStyle, o = a.svgElem, q = [], n, u = e.color, s = e.zIndex, x = e.events, N = b.chart.renderer; b.isLog && (j = ra(j), i = ra(i), m = ra(m)); if (h) { if (q = b.getPlotLinePath(m, h), d = { stroke: u, "stroke-width": h }, l) d.dashstyle = l } else if (k) { if (j = t(j, b.min - d), i = A(i, b.max + d), q = b.getPlotBandPath(j, i, e), d = { fill: u }, e.borderWidth) d.stroke = e.borderColor, d["stroke-width"] = e.borderWidth } else return; if (v(s)) d.zIndex = s; if (o) q ? o.animate({ d: q }, null, o.onGetPath) : (o.hide(), o.onGetPath = function () { o.show() }); else if (q && q.length && (a.svgElem = o = N.path(q).attr(d).add(),
            x)) for (n in e = function (b) { o.on(b, function (c) { x[b].apply(a, [c]) }) }, x) e(n); if (f && v(f.text) && q && q.length && b.width > 0 && b.height > 0) { f = z({ align: c && k && "center", x: c ? !k && 4 : 10, verticalAlign: !c && k && "middle", y: c ? k ? 16 : 10 : k ? 6 : -4, rotation: c && !k && 90 }, f); if (!g) a.label = g = N.text(f.text, 0, 0).attr({ align: f.textAlign || f.align, rotation: f.rotation, zIndex: s }).css(f.style).add(); b = [q[1], q[4], p(q[6], q[1])]; q = [q[2], q[5], p(q[7], q[2])]; c = Pa(b); k = Pa(q); g.align(f, !1, { x: c, y: k, width: ua(b) - c, height: ua(q) - k }); g.show() } else g && g.hide();
            return a
        }, destroy: function () { na(this.axis.plotLinesAndBands, this); Aa(this, this.axis) }
    }; Ub.prototype = {
        destroy: function () { Aa(this, this.axis) }, setTotal: function (a) { this.cum = this.total = a }, render: function (a) { var b = this.options, c = b.format, c = c ? La(c, this) : b.formatter.call(this); this.label ? this.label.attr({ text: c, visibility: "hidden" }) : this.label = this.axis.chart.renderer.text(c, 0, 0, b.useHTML).css(b.style).attr({ align: this.textAlign, rotation: b.rotation, visibility: "hidden" }).add(a) }, setOffset: function (a, b) {
            var c =
            this.axis, d = c.chart, e = d.inverted, f = this.isNegative, g = c.translate(this.percent ? 100 : this.total, 0, 0, 0, 1), c = c.translate(0), c = U(g - c), h = d.xAxis[0].translate(this.x) + a, i = d.plotHeight, f = { x: e ? f ? g : g - c : h, y: e ? i - h - b : f ? i - g - c : i - g, width: e ? c : b, height: e ? b : c }; if (e = this.label) e.align(this.alignOptions, null, f), f = e.alignAttr, e.attr({ visibility: this.options.crop === !1 || d.isInsidePlot(f.x, f.y) ? ca ? "inherit" : "visible" : "hidden" })
        }
    }; Da.prototype = {
        defaultOptions: {
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L", second: "%H:%M:%S",
                minute: "%H:%M", hour: "%H:%M", day: "%e. %b", week: "%e. %b", month: "%b '%y", year: "%Y"
            }, endOnTick: !1, gridLineColor: "#C0C0C0", labels: D, lineColor: "#C0D0E0", lineWidth: 1, minPadding: 0.01, maxPadding: 0.01, minorGridLineColor: "#E0E0E0", minorGridLineWidth: 1, minorTickColor: "#A0A0A0", minorTickLength: 2, minorTickPosition: "outside", startOfWeek: 1, startOnTick: !1, tickColor: "#C0D0E0", tickLength: 5, tickmarkPlacement: "between", tickPixelInterval: 100, tickPosition: "outside", tickWidth: 1, title: {
                align: "middle", style: {
                    color: "#4d759e",
                    fontWeight: "bold"
                }
            }, type: "linear"
        }, defaultYAxisOptions: { endOnTick: !0, gridLineWidth: 1, tickPixelInterval: 72, showLastLabel: !0, labels: { align: "right", x: -8, y: 3 }, lineWidth: 0, maxPadding: 0.05, minPadding: 0.05, startOnTick: !0, tickWidth: 0, title: { rotation: 270, text: "Values" }, stackLabels: { enabled: !1, formatter: function () { return xa(this.total, -1) }, style: D.style } }, defaultLeftAxisOptions: { labels: { align: "right", x: -8, y: null }, title: { rotation: 270 } }, defaultRightAxisOptions: { labels: { align: "left", x: 8, y: null }, title: { rotation: 90 } },
        defaultBottomAxisOptions: { labels: { align: "center", x: 0, y: 14 }, title: { rotation: 0 } }, defaultTopAxisOptions: { labels: { align: "center", x: 0, y: -5 }, title: { rotation: 0 } }, init: function (a, b) {
            var c = b.isX; this.horiz = a.inverted ? !c : c; this.xOrY = (this.isXAxis = c) ? "x" : "y"; this.opposite = b.opposite; this.side = this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3; this.setOptions(b); var d = this.options, e = d.type; this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter; this.staggerLines = this.horiz && d.labels.staggerLines; this.userOptions =
            b; this.minPixelPadding = 0; this.chart = a; this.reversed = d.reversed; this.zoomEnabled = d.zoomEnabled !== !1; this.categories = d.categories || e === "category"; this.isLog = e === "logarithmic"; this.isDatetimeAxis = e === "datetime"; this.isLinked = v(d.linkedTo); this.tickmarkOffset = this.categories && d.tickmarkPlacement === "between" ? 0.5 : 0; this.ticks = {}; this.minorTicks = {}; this.plotLinesAndBands = []; this.alternateBands = {}; this.len = 0; this.minRange = this.userMinRange = d.minRange || d.maxZoom; this.range = d.range; this.offset = d.offset || 0;
            this.stacks = {}; this._stacksTouched = 0; this.min = this.max = null; var f, d = this.options.events; va(this, a.axes) === -1 && (a.axes.push(this), a[c ? "xAxis" : "yAxis"].push(this)); this.series = this.series || []; if (a.inverted && c && this.reversed === w) this.reversed = !0; this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine; for (f in d) F(this, f, d[f]); if (this.isLog) this.val2lin = ra, this.lin2val = la
        }, setOptions: function (a) {
            this.options = z(this.defaultOptions, this.isXAxis ? {} : this.defaultYAxisOptions, [this.defaultTopAxisOptions,
            this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], z(M[this.isXAxis ? "xAxis" : "yAxis"], a))
        }, update: function (a, b) { var c = this.chart, a = c.options[this.xOrY + "Axis"][this.options.index] = z(this.userOptions, a); this.destroy(); this._addedPlotLB = !1; this.init(c, a); c.isDirtyBox = !0; p(b, !0) && c.redraw() }, remove: function (a) {
            var b = this.chart, c = this.xOrY + "Axis"; n(this.series, function (a) { a.remove(!1) }); na(b.axes, this); na(b[c], this); b.options[c].splice(this.options.index,
            1); n(b[c], function (a, b) { a.options.index = b }); this.destroy(); b.isDirtyBox = !0; p(a, !0) && b.redraw()
        }, defaultLabelFormatter: function () { var a = this.axis, b = this.value, c = a.categories, d = this.dateTimeLabelFormat, e = M.lang.numericSymbols, f = e && e.length, g, h = a.options.labels.format, a = a.isLog ? b : a.tickInterval; if (h) g = La(h, this); else if (c) g = b; else if (d) g = ya(d, b); else if (f && a >= 1E3) for (; f-- && g === w;) c = Math.pow(1E3, f + 1), a >= c && e[f] !== null && (g = xa(b / c, -1) + e[f]); g === w && (g = b >= 1E3 ? xa(b, 0) : xa(b, -1)); return g }, getSeriesExtremes: function () {
            var a =
            this, b = a.chart, c = a.stacks, d = [], e = [], f = a._stacksTouched += 1, g, h; a.hasVisibleSeries = !1; a.dataMin = a.dataMax = null; n(a.series, function (g) {
                if (g.visible || !b.options.chart.ignoreHiddenSeries) {
                    var j = g.options, k, m, l, o, q, n, u, s, x, N = j.threshold, fa, E = [], B = 0; a.hasVisibleSeries = !0; if (a.isLog && N <= 0) N = j.threshold = null; if (a.isXAxis) { if (j = g.xData, j.length) a.dataMin = A(p(a.dataMin, j[0]), Pa(j)), a.dataMax = t(p(a.dataMax, j[0]), ua(j)) } else {
                        var T, r, J, z = g.cropped, y = g.xAxis.getExtremes(), C = !!g.modifyValue; k = j.stacking; a.usePercentage =
                        k === "percent"; if (k) q = j.stack, o = g.type + p(q, ""), n = "-" + o, g.stackKey = o, m = d[o] || [], d[o] = m, l = e[n] || [], e[n] = l; if (a.usePercentage) a.dataMin = 0, a.dataMax = 99; j = g.processedXData; u = g.processedYData; fa = u.length; for (h = 0; h < fa; h++) {
                            s = j[h]; x = u[h]; if (k) r = (T = x < N) ? l : m, J = T ? n : o, v(r[s]) ? (r[s] = oa(r[s] + x), x = [x, r[s]]) : r[s] = x, c[J] || (c[J] = {}), c[J][s] || (c[J][s] = new Ub(a, a.options.stackLabels, T, s, q, k)), c[J][s].setTotal(r[s]), c[J][s].touched = f; if (x !== null && x !== w && (!a.isLog || x.length || x > 0)) if (C && (x = g.modifyValue(x)), g.getExtremesFromAll ||
                            z || (j[h + 1] || s) >= y.min && (j[h - 1] || s) <= y.max) if (s = x.length) for (; s--;) x[s] !== null && (E[B++] = x[s]); else E[B++] = x
                        } if (!a.usePercentage && E.length) g.dataMin = k = Pa(E), g.dataMax = g = ua(E), a.dataMin = A(p(a.dataMin, k), k), a.dataMax = t(p(a.dataMax, g), g); if (v(N)) if (a.dataMin >= N) a.dataMin = N, a.ignoreMinPadding = !0; else if (a.dataMax < N) a.dataMax = N, a.ignoreMaxPadding = !0
                    }
                }
            }); for (g in c) for (h in c[g]) c[g][h].touched < f && (c[g][h].destroy(), delete c[g][h])
        }, translate: function (a, b, c, d, e, f) {
            var g = this.len, h = 1, i = 0, j = d ? this.oldTransA :
            this.transA, d = d ? this.oldMin : this.min, k = this.minPixelPadding, e = (this.options.ordinal || this.isLog && e) && this.lin2val; if (!j) j = this.transA; c && (h *= -1, i = g); this.reversed && (h *= -1, i -= h * g); b ? (a = a * h + i, a -= k, a = a / j + d, e && (a = this.lin2val(a))) : (e && (a = this.val2lin(a)), a = h * (a - d) * j + i + h * k + (f ? j * this.pointRange / 2 : 0)); return a
        }, toPixels: function (a, b) { return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos) }, toValue: function (a, b) { return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0) }, getPlotLinePath: function (a,
        b, c, d) { var e = this.chart, f = this.left, g = this.top, h, i, j, a = this.translate(a, null, null, c), k = c && e.oldChartHeight || e.chartHeight, m = c && e.oldChartWidth || e.chartWidth, l; h = this.transB; c = i = r(a + h); h = j = r(k - a - h); if (isNaN(a)) l = !0; else if (this.horiz) { if (h = g, j = k - this.bottom, c < f || c > f + this.width) l = !0 } else if (c = f, i = m - this.right, h < g || h > g + this.height) l = !0; return l && !d ? null : e.renderer.crispLine(["M", c, h, "L", i, j], b || 0) }, getPlotBandPath: function (a, b) {
            var c = this.getPlotLinePath(b), d = this.getPlotLinePath(a); d && c ? d.push(c[4],
            c[5], c[1], c[2]) : d = null; return d
        }, getLinearTickPositions: function (a, b, c) { for (var d, b = oa(W(b / a) * a), c = oa(pa(c / a) * a), e = []; b <= c;) { e.push(b); b = oa(b + a); if (b === d) break; d = b } return e }, getLogTickPositions: function (a, b, c, d) {
            var e = this.options, f = this.len, g = []; if (!d) this._minorAutoInterval = null; if (a >= 0.5) a = r(a), g = this.getLinearTickPositions(a, b, c); else if (a >= 0.08) for (var f = W(b), h, i, j, k, m, e = a > 0.3 ? [1, 2, 4] : a > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < c + 1 && !m; f++) {
                i = e.length; for (h = 0; h < i && !m; h++) j = ra(la(f) * e[h]), j > b && (!d ||
                k <= c) && g.push(k), k > c && (m = !0), k = j
            } else if (b = la(b), c = la(c), a = e[d ? "minorTickInterval" : "tickInterval"], a = p(a === "auto" ? null : a, this._minorAutoInterval, (c - b) * (e.tickPixelInterval / (d ? 5 : 1)) / ((d ? f / this.tickPositions.length : f) || 1)), a = yb(a, null, P.pow(10, W(P.log(a) / P.LN10))), g = Fa(this.getLinearTickPositions(a, b, c), ra), !d) this._minorAutoInterval = a / 5; if (!d) this.tickInterval = a; return g
        }, getMinorTickPositions: function () {
            var a = this.options, b = this.tickPositions, c = this.minorTickInterval, d = [], e; if (this.isLog) {
                e = b.length;
                for (a = 1; a < e; a++) d = d.concat(this.getLogTickPositions(c, b[a - 1], b[a], !0))
            } else if (this.isDatetimeAxis && a.minorTickInterval === "auto") d = d.concat(fb(zb(c), this.min, this.max, a.startOfWeek)), d[0] < this.min && d.shift(); else for (b = this.min + (b[0] - this.min) % c; b <= this.max; b += c) d.push(b); return d
        }, adjustForMinRange: function () {
            var a = this.options, b = this.min, c = this.max, d, e = this.dataMax - this.dataMin >= this.minRange, f, g, h, i, j; if (this.isXAxis && this.minRange === w && !this.isLog) v(a.min) || v(a.max) ? this.minRange = null : (n(this.series,
            function (a) { i = a.xData; for (g = j = a.xIncrement ? 1 : i.length - 1; g > 0; g--) if (h = i[g] - i[g - 1], f === w || h < f) f = h }), this.minRange = A(f * 5, this.dataMax - this.dataMin)); if (c - b < this.minRange) { var k = this.minRange; d = (k - c + b) / 2; d = [b - d, p(a.min, b - d)]; if (e) d[2] = this.dataMin; b = ua(d); c = [b + k, p(a.max, b + k)]; if (e) c[2] = this.dataMax; c = Pa(c); c - b < k && (d[0] = c - k, d[1] = p(a.min, c - k), b = ua(d)) } this.min = b; this.max = c
        }, setAxisTranslation: function (a) {
            var b = this.max - this.min, c = 0, d, e = 0, f = 0, g = this.linkedParent, h = this.transA; if (this.isXAxis) g ? (e = g.minPointOffset,
            f = g.pointRangePadding) : n(this.series, function (a) { var g = a.pointRange, h = a.options.pointPlacement, m = a.closestPointRange; g > b && (g = 0); c = t(c, g); e = t(e, h ? 0 : g / 2); f = t(f, h === "on" ? 0 : g); !a.noSharedTooltip && v(m) && (d = v(d) ? A(d, m) : m) }), g = this.ordinalSlope && d ? this.ordinalSlope / d : 1, this.minPointOffset = e *= g, this.pointRangePadding = f *= g, this.pointRange = A(c, b), this.closestPointRange = d; if (a) this.oldTransA = h; this.translationSlope = this.transA = h = this.len / (b + f || 1); this.transB = this.horiz ? this.left : this.bottom; this.minPixelPadding =
            h * e
        }, setTickPositions: function (a) {
            var b = this, c = b.chart, d = b.options, e = b.isLog, f = b.isDatetimeAxis, g = b.isXAxis, h = b.isLinked, i = b.options.tickPositioner, j = d.maxPadding, k = d.minPadding, m = d.tickInterval, l = d.minTickInterval, o = d.tickPixelInterval, q = b.categories; h ? (b.linkedParent = c[g ? "xAxis" : "yAxis"][d.linkedTo], c = b.linkedParent.getExtremes(), b.min = p(c.min, c.dataMin), b.max = p(c.max, c.dataMax), d.type !== b.linkedParent.options.type && Ba(11, 1)) : (b.min = p(b.userMin, d.min, b.dataMin), b.max = p(b.userMax, d.max, b.dataMax));
            if (e) !a && A(b.min, p(b.dataMin, b.min)) <= 0 && Ba(10, 1), b.min = oa(ra(b.min)), b.max = oa(ra(b.max)); if (b.range && (b.userMin = b.min = t(b.min, b.max - b.range), b.userMax = b.max, a)) b.range = null; b.beforePadding && b.beforePadding(); b.adjustForMinRange(); if (!q && !b.usePercentage && !h && v(b.min) && v(b.max) && (c = b.max - b.min)) { if (!v(d.min) && !v(b.userMin) && k && (b.dataMin < 0 || !b.ignoreMinPadding)) b.min -= c * k; if (!v(d.max) && !v(b.userMax) && j && (b.dataMax > 0 || !b.ignoreMaxPadding)) b.max += c * j } b.tickInterval = b.min === b.max || b.min === void 0 || b.max ===
            void 0 ? 1 : h && !m && o === b.linkedParent.options.tickPixelInterval ? b.linkedParent.tickInterval : p(m, q ? 1 : (b.max - b.min) * o / (b.len || 1)); g && !a && n(b.series, function (a) { a.processData(b.min !== b.oldMin || b.max !== b.oldMax) }); b.setAxisTranslation(!0); b.beforeSetTickPositions && b.beforeSetTickPositions(); if (b.postProcessTickInterval) b.tickInterval = b.postProcessTickInterval(b.tickInterval); if (!m && b.tickInterval < l) b.tickInterval = l; if (!f && !e && (a = P.pow(10, W(P.log(b.tickInterval) / P.LN10)), !m)) b.tickInterval = yb(b.tickInterval,
            null, a, d); b.minorTickInterval = d.minorTickInterval === "auto" && b.tickInterval ? b.tickInterval / 5 : d.minorTickInterval; b.tickPositions = i = d.tickPositions ? [].concat(d.tickPositions) : i && i.apply(b, [b.min, b.max]); if (!i) i = f ? (b.getNonLinearTimeTicks || fb)(zb(b.tickInterval, d.units), b.min, b.max, d.startOfWeek, b.ordinalPositions, b.closestPointRange, !0) : e ? b.getLogTickPositions(b.tickInterval, b.min, b.max) : b.getLinearTickPositions(b.tickInterval, b.min, b.max), b.tickPositions = i; if (!h) e = i[0], f = i[i.length - 1], h = b.minPointOffset ||
            0, d.startOnTick ? b.min = e : b.min - h > e && i.shift(), d.endOnTick ? b.max = f : b.max + h < f && i.pop(), i.length === 1 && (b.min -= 0.001, b.max += 0.001)
        }, setMaxTicks: function () { var a = this.chart, b = a.maxTicks || {}, c = this.tickPositions, d = this._maxTicksKey = [this.xOrY, this.pos, this.len].join("-"); if (!this.isLinked && !this.isDatetimeAxis && c && c.length > (b[d] || 0) && this.options.alignTicks !== !1) b[d] = c.length; a.maxTicks = b }, adjustTickAmount: function () {
            var a = this._maxTicksKey, b = this.tickPositions, c = this.chart.maxTicks; if (c && c[a] && !this.isDatetimeAxis &&
            !this.categories && !this.isLinked && this.options.alignTicks !== !1) { var d = this.tickAmount, e = b.length; this.tickAmount = a = c[a]; if (e < a) { for (; b.length < a;) b.push(oa(b[b.length - 1] + this.tickInterval)); this.transA *= (e - 1) / (a - 1); this.max = b[b.length - 1] } if (v(d) && a !== d) this.isDirty = !0 }
        }, setScale: function () {
            var a = this.stacks, b, c, d, e; this.oldMin = this.min; this.oldMax = this.max; this.oldAxisLength = this.len; this.setAxisSize(); e = this.len !== this.oldAxisLength; n(this.series, function (a) {
                if (a.isDirtyData || a.isDirty || a.xAxis.isDirty) d =
                !0
            }); if (e || d || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax) if (this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickPositions(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, !this.isDirty) this.isDirty = e || this.min !== this.oldMin || this.max !== this.oldMax; if (!this.isXAxis) for (b in a) for (c in a[b]) a[b][c].cum = a[b][c].total; this.setMaxTicks()
        }, setExtremes: function (a, b, c, d, e) {
            var f = this, g = f.chart, c = p(c, !0), e = y(e, { min: a, max: b }); K(f, "setExtremes",
            e, function () { f.userMin = a; f.userMax = b; f.isDirtyExtremes = !0; c && g.redraw(d) })
        }, zoom: function (a, b) { this.allowZoomOutside || (a <= this.dataMin && (a = w), b >= this.dataMax && (b = w)); this.displayBtn = a !== w || b !== w; this.setExtremes(a, b, !1, w, { trigger: "zoom" }); return !0 }, setAxisSize: function () {
            var a = this.chart, b = this.options, c = b.offsetLeft || 0, d = b.offsetRight || 0, e = this.horiz, f, g; this.left = g = p(b.left, a.plotLeft + c); this.top = f = p(b.top, a.plotTop); this.width = c = p(b.width, a.plotWidth - c + d); this.height = b = p(b.height, a.plotHeight);
            this.bottom = a.chartHeight - b - f; this.right = a.chartWidth - c - g; this.len = t(e ? c : b, 0); this.pos = e ? g : f
        }, getExtremes: function () { var a = this.isLog; return { min: a ? oa(la(this.min)) : this.min, max: a ? oa(la(this.max)) : this.max, dataMin: this.dataMin, dataMax: this.dataMax, userMin: this.userMin, userMax: this.userMax } }, getThreshold: function (a) { var b = this.isLog, c = b ? la(this.min) : this.min, b = b ? la(this.max) : this.max; c > a || a === null ? a = c : b < a && (a = b); return this.translate(a, 0, 1, 0, 1) }, addPlotBand: function (a) { this.addPlotBandOrLine(a, "plotBands") },
        addPlotLine: function (a) { this.addPlotBandOrLine(a, "plotLines") }, addPlotBandOrLine: function (a, b) { var c = (new Fb(this, a)).render(), d = this.userOptions; b && (d[b] = d[b] || [], d[b].push(a)); this.plotLinesAndBands.push(c); return c }, getOffset: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.tickPositions, f = a.ticks, g = a.horiz, h = a.side, i = b.inverted ? [1, 0, 3, 2][h] : h, j, k = 0, m, l = 0, o = d.title, q = d.labels, O = 0, u = b.axisOffset, s = b.clipOffset, x = [-1, 1, 1, -1][h], r; a.hasData = b = a.hasVisibleSeries || v(a.min) && v(a.max) && !!e;
            a.showAxis = j = b || p(d.showEmpty, !0); if (!a.axisGroup) a.gridGroup = c.g("grid").attr({ zIndex: d.gridZIndex || 1 }).add(), a.axisGroup = c.g("axis").attr({ zIndex: d.zIndex || 2 }).add(), a.labelGroup = c.g("axis-labels").attr({ zIndex: q.zIndex || 7 }).add(); if (b || a.isLinked) n(e, function (b) { f[b] ? f[b].addLabel() : f[b] = new ab(a, b) }), n(e, function (a) { if (h === 0 || h === 2 || { 1: "left", 3: "right" }[h] === q.align) O = t(f[a].getLabelSize(), O) }), a.staggerLines && (O += (a.staggerLines - 1) * 16); else for (r in f) f[r].destroy(), delete f[r]; if (o && o.text &&
            o.enabled !== !1) { if (!a.axisTitle) a.axisTitle = c.text(o.text, 0, 0, o.useHTML).attr({ zIndex: 7, rotation: o.rotation || 0, align: o.textAlign || { low: "left", middle: "center", high: "right" }[o.align] }).css(o.style).add(a.axisGroup), a.axisTitle.isNew = !0; if (j) k = a.axisTitle.getBBox()[g ? "height" : "width"], l = p(o.margin, g ? 5 : 10), m = o.offset; a.axisTitle[j ? "show" : "hide"]() } a.offset = x * p(d.offset, u[h]); a.axisTitleMargin = p(m, O + l + (h !== 2 && O && x * d.labels[g ? "y" : "x"])); u[h] = t(u[h], a.axisTitleMargin + k + x * a.offset); s[i] = t(s[i], d.lineWidth)
        },
        getLinePath: function (a) { var b = this.chart, c = this.opposite, d = this.offset, e = this.horiz, f = this.left + (c ? this.width : 0) + d; this.lineTop = d = b.chartHeight - this.bottom - (c ? this.height : 0) + d; c || (a *= -1); return b.renderer.crispLine(["M", e ? this.left : f, e ? d : this.top, "L", e ? b.chartWidth - this.right : f, e ? d : b.chartHeight - this.bottom], a) }, getTitlePosition: function () {
            var a = this.horiz, b = this.left, c = this.top, d = this.len, e = this.options.title, f = a ? b : c, g = this.opposite, h = this.offset, i = C(e.style.fontSize || 12), d = {
                low: f + (a ? 0 : d), middle: f +
                d / 2, high: f + (a ? d : 0)
            }[e.align], b = (a ? c + this.height : b) + (a ? 1 : -1) * (g ? -1 : 1) * this.axisTitleMargin + (this.side === 2 ? i : 0); return { x: a ? d : b + (g ? this.width : 0) + h + (e.x || 0), y: a ? b - (g ? this.height : 0) + h : d + (e.y || 0) }
        }, render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.isLog, f = a.isLinked, g = a.tickPositions, h = a.axisTitle, i = a.stacks, j = a.ticks, k = a.minorTicks, m = a.alternateBands, l = d.stackLabels, o = d.alternateGridColor, q = a.tickmarkOffset, p = d.lineWidth, u, s = b.hasRendered && v(a.oldMin) && !isNaN(a.oldMin); u = a.hasData; var x =
            a.showAxis, r, t; n([j, k, m], function (a) { for (var b in a) a[b].isActive = !1 }); if (u || f) if (a.minorTickInterval && !a.categories && n(a.getMinorTickPositions(), function (b) { k[b] || (k[b] = new ab(a, b, "minor")); s && k[b].isNew && k[b].render(null, !0); k[b].render(null, !1, 1) }), g.length && (n(g.slice(1).concat([g[0]]), function (b, c) { c = c === g.length - 1 ? 0 : c + 1; if (!f || b >= a.min && b <= a.max) j[b] || (j[b] = new ab(a, b)), s && j[b].isNew && j[b].render(c, !0), j[b].render(c, !1, 1) }), q && a.min === 0 && (j[-1] || (j[-1] = new ab(a, -1, null, !0)), j[-1].render(-1))),
            o && n(g, function (b, c) { if (c % 2 === 0 && b < a.max) m[b] || (m[b] = new Fb(a)), r = b + q, t = g[c + 1] !== w ? g[c + 1] + q : a.max, m[b].options = { from: e ? la(r) : r, to: e ? la(t) : t, color: o }, m[b].render(), m[b].isActive = !0 }), !a._addedPlotLB) n((d.plotLines || []).concat(d.plotBands || []), function (b) { a.addPlotBandOrLine(b) }), a._addedPlotLB = !0; n([j, k, m], function (a) {
                var c, d, e = [], f = Ra ? Ra.duration || 500 : 0, g = function () { for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]]) }; for (c in a) if (!a[c].isActive) a[c].render(c, !1, 0),
                a[c].isActive = !1, e.push(c); a === m || !b.hasRendered || !f ? g() : f && setTimeout(g, f)
            }); if (p) u = a.getLinePath(p), a.axisLine ? a.axisLine.animate({ d: u }) : a.axisLine = c.path(u).attr({ stroke: d.lineColor, "stroke-width": p, zIndex: 7 }).add(a.axisGroup), a.axisLine[x ? "show" : "hide"](); if (h && x) h[h.isNew ? "attr" : "animate"](a.getTitlePosition()), h.isNew = !1; if (l && l.enabled) {
                var E, B, d = a.stackTotalGroup; if (!d) a.stackTotalGroup = d = c.g("stack-labels").attr({ visibility: "visible", zIndex: 6 }).add(); d.translate(b.plotLeft, b.plotTop); for (E in i) for (B in c =
                i[E], c) c[B].render(d)
            } a.isDirty = !1
        }, removePlotBandOrLine: function (a) { for (var b = this.plotLinesAndBands, c = b.length; c--;) b[c].id === a && b[c].destroy() }, setTitle: function (a, b) { this.update({ title: a }, b) }, redraw: function () { var a = this.chart.pointer; a.reset && a.reset(!0); this.render(); n(this.plotLinesAndBands, function (a) { a.render() }); n(this.series, function (a) { a.isDirty = !0 }) }, setCategories: function (a, b) { this.update({ categories: a }, b) }, destroy: function () {
            var a = this, b = a.stacks, c; X(a); for (c in b) Aa(b[c]), b[c] = null;
            n([a.ticks, a.minorTicks, a.alternateBands, a.plotLinesAndBands], function (a) { Aa(a) }); n("stackTotalGroup,axisLine,axisGroup,gridGroup,labelGroup,axisTitle".split(","), function (b) { a[b] && (a[b] = a[b].destroy()) })
        }
    }; Gb.prototype = {
        init: function (a, b) {
            var c = b.borderWidth, d = b.style, e = C(d.padding); this.chart = a; this.options = b; this.crosshairs = []; this.now = { x: 0, y: 0 }; this.isHidden = !0; this.label = a.renderer.label("", 0, 0, b.shape, null, null, b.useHTML, null, "tooltip").attr({
                padding: e, fill: b.backgroundColor, "stroke-width": c,
                r: b.borderRadius, zIndex: 8
            }).css(d).css({ padding: 0 }).hide().add(); ia || this.label.shadow(b.shadow); this.shared = b.shared
        }, destroy: function () { n(this.crosshairs, function (a) { a && a.destroy() }); if (this.label) this.label = this.label.destroy(); clearTimeout(this.hideTimer); clearTimeout(this.tooltipTimeout) }, move: function (a, b, c, d) {
            var e = this, f = e.now, g = e.options.animation !== !1 && !e.isHidden; y(f, { x: g ? (2 * f.x + a) / 3 : a, y: g ? (f.y + b) / 2 : b, anchorX: g ? (2 * f.anchorX + c) / 3 : c, anchorY: g ? (f.anchorY + d) / 2 : d }); e.label.attr(f); if (g && (U(a -
            f.x) > 1 || U(b - f.y) > 1)) clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () { e && e.move(a, b, c, d) }, 32)
        }, hide: function () { var a = this, b; clearTimeout(this.hideTimer); if (!this.isHidden) b = this.chart.hoverPoints, this.hideTimer = setTimeout(function () { a.label.fadeOut(); a.isHidden = !0 }, p(this.options.hideDelay, 500)), b && n(b, function (a) { a.setState() }), this.chart.hoverPoints = null }, hideCrosshairs: function () { n(this.crosshairs, function (a) { a && a.hide() }) }, getAnchor: function (a, b) {
            var c, d = this.chart, e =
            d.inverted, f = d.plotTop, g = 0, h = 0, i, a = ja(a); c = a[0].tooltipPos; this.followPointer && b && (b.chartX === w && (b = d.pointer.normalize(b)), c = [b.chartX - d.plotLeft, b.chartY - f]); c || (n(a, function (a) { i = a.series.yAxis; g += a.plotX; h += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && i ? i.top - f : 0) }), g /= a.length, h /= a.length, c = [e ? d.plotWidth - h : g, this.shared && !e && a.length > 1 && b ? b.chartY - f : e ? d.plotHeight - g : h]); return Fa(c, r)
        }, getPosition: function (a, b, c) {
            var d = this.chart, e = d.plotLeft, f = d.plotTop, g = d.plotWidth, h = d.plotHeight, i =
            p(this.options.distance, 12), j = c.plotX, c = c.plotY, d = j + e + (d.inverted ? i : -a - i), k = c - b + f + 15, m; d < 7 && (d = e + t(j, 0) + i); d + a > e + g && (d -= d + a - (e + g), k = c - b + f - i, m = !0); k < f + 5 && (k = f + 5, m && c >= k && c <= k + b && (k = c + f + i)); k + b > f + h && (k = t(f, f + h - b - i)); return { x: d, y: k }
        }, defaultFormatter: function (a) {
            var b = this.points || ja(this), c = b[0].series, d; d = [c.tooltipHeaderFormatter(b[0])]; n(b, function (a) { c = a.series; d.push(c.tooltipFormatter && c.tooltipFormatter(a) || a.point.tooltipFormatter(c.tooltipOptions.pointFormat)) }); d.push(a.options.footerFormat ||
            ""); return d.join("")
        }, refresh: function (a, b) {
            var c = this.chart, d = this.label, e = this.options, f, g, h, i = {}, j, k = []; j = e.formatter || this.defaultFormatter; var i = c.hoverPoints, m, l = e.crosshairs; h = this.shared; clearTimeout(this.hideTimer); this.followPointer = ja(a)[0].series.tooltipOptions.followPointer; g = this.getAnchor(a, b); f = g[0]; g = g[1]; h && (!a.series || !a.series.noSharedTooltip) ? (c.hoverPoints = a, i && n(i, function (a) { a.setState() }), n(a, function (a) { a.setState("hover"); k.push(a.getLabelConfig()) }), i = {
                x: a[0].category,
                y: a[0].y
            }, i.points = k, a = a[0]) : i = a.getLabelConfig(); j = j.call(i, this); i = a.series; h = h || !i.isCartesian || i.tooltipOutsidePlot || c.isInsidePlot(f, g); j === !1 || !h ? this.hide() : (this.isHidden && (hb(d), d.attr("opacity", 1).show()), d.attr({ text: j }), m = e.borderColor || a.color || i.color || "#606060", d.attr({ stroke: m }), this.updatePosition({ plotX: f, plotY: g }), this.isHidden = !1); if (l) {
                l = ja(l); for (d = l.length; d--;) if (e = a.series[d ? "yAxis" : "xAxis"], l[d] && e) if (h = d ? p(a.stackY, a.y) : a.x, e.isLog && (h = ra(h)), e = e.getPlotLinePath(h, 1), this.crosshairs[d]) this.crosshairs[d].attr({
                    d: e,
                    visibility: "visible"
                }); else { h = { "stroke-width": l[d].width || 1, stroke: l[d].color || "#C0C0C0", zIndex: l[d].zIndex || 2 }; if (l[d].dashStyle) h.dashstyle = l[d].dashStyle; this.crosshairs[d] = c.renderer.path(e).attr(h).add() }
            } K(c, "tooltipRefresh", { text: j, x: f + c.plotLeft, y: g + c.plotTop, borderColor: m })
        }, updatePosition: function (a) { var b = this.chart, c = this.label, c = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a); this.move(r(c.x), r(c.y), a.plotX + b.plotLeft, a.plotY + b.plotTop) }
    }; pb.prototype = {
        init: function (a,
        b) { var c = ia ? "" : b.chart.zoomType, d = a.inverted, e; this.options = b; this.chart = a; this.zoomX = e = /x/.test(c); this.zoomY = c = /y/.test(c); this.zoomHor = e && !d || c && d; this.zoomVert = c && !d || e && d; this.pinchDown = []; this.lastValidTouch = {}; if (b.tooltip.enabled) a.tooltip = new Gb(a, b.tooltip); this.setDOMEvents() }, normalize: function (a) {
            var b, c, d, a = a || Y.event; if (!a.target) a.target = a.srcElement; a = Zb(a); d = a.touches ? a.touches.item(0) : a; this.chartPosition = b = ec(this.chart.container); d.pageX === w ? (c = a.x, b = a.y) : (c = d.pageX - b.left, b =
            d.pageY - b.top); return y(a, { chartX: r(c), chartY: r(b) })
        }, getCoordinates: function (a) { var b = { xAxis: [], yAxis: [] }; n(this.chart.axes, function (c) { b[c.isXAxis ? "xAxis" : "yAxis"].push({ axis: c, value: c.toValue(a[c.horiz ? "chartX" : "chartY"]) }) }); return b }, getIndex: function (a) { var b = this.chart; return b.inverted ? b.plotHeight + b.plotTop - a.chartY : a.chartX - b.plotLeft }, runPointActions: function (a) {
            var b = this.chart, c = b.series, d = b.tooltip, e, f = b.hoverPoint, g = b.hoverSeries, h, i, j = b.chartWidth, k = this.getIndex(a); if (d && this.options.tooltip.shared &&
            (!g || !g.noSharedTooltip)) { e = []; h = c.length; for (i = 0; i < h; i++) if (c[i].visible && c[i].options.enableMouseTracking !== !1 && !c[i].noSharedTooltip && c[i].tooltipPoints.length && (b = c[i].tooltipPoints[k], b.series)) b._dist = U(k - b.clientX), j = A(j, b._dist), e.push(b); for (h = e.length; h--;) e[h]._dist > j && e.splice(h, 1); if (e.length && e[0].clientX !== this.hoverX) d.refresh(e, a), this.hoverX = e[0].clientX } if (g && g.tracker) { if ((b = g.tooltipPoints[k]) && b !== f) b.onMouseOver(a) } else d && d.followPointer && !d.isHidden && (a = d.getAnchor([{}], a),
            d.updatePosition({ plotX: a[0], plotY: a[1] }))
        }, reset: function (a) { var b = this.chart, c = b.hoverSeries, d = b.hoverPoint, e = b.tooltip, b = e && e.shared ? b.hoverPoints : d; (a = a && e && b) && ja(b)[0].plotX === w && (a = !1); if (a) e.refresh(b); else { if (d) d.onMouseOut(); if (c) c.onMouseOut(); e && (e.hide(), e.hideCrosshairs()); this.hoverX = null } }, scaleGroups: function (a, b) {
            var c = this.chart; n(c.series, function (d) {
                d.xAxis && d.xAxis.zoomEnabled && (d.group.attr(a), d.markerGroup && (d.markerGroup.attr(a), d.markerGroup.clip(b ? c.clipRect : null)), d.dataLabelsGroup &&
                d.dataLabelsGroup.attr(a))
            }); c.clipRect.attr(b || c.clipBox)
        }, pinchTranslateDirection: function (a, b, c, d, e, f, g) {
            var h = this.chart, i = a ? "x" : "y", j = a ? "X" : "Y", k = "chart" + j, m = a ? "width" : "height", l = h["plot" + (a ? "Left" : "Top")], o, q, n = 1, p = h.inverted, s = h.bounds[a ? "h" : "v"], x = b.length === 1, r = b[0][k], t = c[0][k], E = !x && b[1][k], B = !x && c[1][k], v, c = function () { !x && U(r - E) > 20 && (n = U(t - B) / U(r - E)); q = (l - t) / n + r; o = h["plot" + (a ? "Width" : "Height")] / n }; c(); b = q; b < s.min ? (b = s.min, v = !0) : b + o > s.max && (b = s.max - o, v = !0); v ? (t -= 0.8 * (t - g[i][0]), x || (B -=
            0.8 * (B - g[i][1])), c()) : g[i] = [t, B]; p || (f[i] = q - l, f[m] = o); f = p ? 1 / n : n; e[m] = o; e[i] = b; d[p ? a ? "scaleY" : "scaleX" : "scale" + j] = n; d["translate" + j] = f * l + (t - f * r)
        }, pinch: function (a) {
            var b = this, c = b.chart, d = b.pinchDown, e = c.tooltip && c.tooltip.options.followTouchMove, f = a.touches, g = f.length, h = b.lastValidTouch, i = b.zoomHor || b.pinchHor, j = b.zoomVert || b.pinchVert, k = i || j, m = b.selectionMarker, l = {}, o = {}; a.type === "touchstart" && (e || k) && a.preventDefault(); Fa(f, function (a) { return b.normalize(a) }); if (a.type === "touchstart") n(f, function (a,
            b) { d[b] = { chartX: a.chartX, chartY: a.chartY } }), h.x = [d[0].chartX, d[1] && d[1].chartX], h.y = [d[0].chartY, d[1] && d[1].chartY], n(c.axes, function (a) { if (a.zoomEnabled) { var b = c.bounds[a.horiz ? "h" : "v"], d = a.minPixelPadding, e = a.toPixels(a.dataMin), f = a.toPixels(a.dataMax), g = A(e, f), e = t(e, f); b.min = A(a.pos, g - d); b.max = t(a.pos + a.len, e + d) } }); else if (d.length) {
                if (!m) b.selectionMarker = m = y({ destroy: qa }, c.plotBox); i && b.pinchTranslateDirection(!0, d, f, l, m, o, h); j && b.pinchTranslateDirection(!1, d, f, l, m, o, h); b.hasPinched = k; b.scaleGroups(l,
                o); !k && e && g === 1 && this.runPointActions(b.normalize(a))
            }
        }, dragStart: function (a) { var b = this.chart; b.mouseIsDown = a.type; b.cancelClick = !1; b.mouseDownX = this.mouseDownX = a.chartX; this.mouseDownY = a.chartY }, drag: function (a) {
            var b = this.chart, c = b.options.chart, d = a.chartX, a = a.chartY, e = this.zoomHor, f = this.zoomVert, g = b.plotLeft, h = b.plotTop, i = b.plotWidth, j = b.plotHeight, k, m = this.mouseDownX, l = this.mouseDownY; d < g ? d = g : d > g + i && (d = g + i); a < h ? a = h : a > h + j && (a = h + j); this.hasDragged = Math.sqrt(Math.pow(m - d, 2) + Math.pow(l - a, 2)); if (this.hasDragged >
            10) { k = b.isInsidePlot(m - g, l - h); if (b.hasCartesianSeries && (this.zoomX || this.zoomY) && k && !this.selectionMarker) this.selectionMarker = b.renderer.rect(g, h, e ? 1 : i, f ? 1 : j, 0).attr({ fill: c.selectionMarkerFill || "rgba(69,114,167,0.25)", zIndex: 7 }).add(); this.selectionMarker && e && (e = d - m, this.selectionMarker.attr({ width: U(e), x: (e > 0 ? 0 : e) + m })); this.selectionMarker && f && (e = a - l, this.selectionMarker.attr({ height: U(e), y: (e > 0 ? 0 : e) + l })); k && !this.selectionMarker && c.panning && b.pan(d) }
        }, drop: function (a) {
            var b = this.chart, c = this.hasPinched;
            if (this.selectionMarker) {
                var d = { xAxis: [], yAxis: [], originalEvent: a.originalEvent || a }, e = this.selectionMarker, f = e.x, g = e.y, h; if (this.hasDragged || c) n(b.axes, function (a) { if (a.zoomEnabled) { var b = a.horiz, c = a.toValue(b ? f : g), b = a.toValue(b ? f + e.width : g + e.height); !isNaN(c) && !isNaN(b) && (d[a.xOrY + "Axis"].push({ axis: a, min: A(c, b), max: t(c, b) }), h = !0) } }), h && K(b, "selection", d, function (a) { b.zoom(y(a, c ? { animation: !1 } : null)) }); this.selectionMarker = this.selectionMarker.destroy(); c && this.scaleGroups({
                    translateX: b.plotLeft,
                    translateY: b.plotTop, scaleX: 1, scaleY: 1
                })
            } if (b) L(b.container, { cursor: b._cursor }), b.cancelClick = this.hasDragged > 10, b.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []
        }, onContainerMouseDown: function (a) { a = this.normalize(a); a.preventDefault && a.preventDefault(); this.dragStart(a) }, onDocumentMouseUp: function (a) { this.drop(a) }, onDocumentMouseMove: function (a) {
            var b = this.chart, c = this.chartPosition, d = b.hoverSeries, a = Zb(a); c && d && d.isCartesian && !b.isInsidePlot(a.pageX - c.left - b.plotLeft, a.pageY - c.top -
            b.plotTop) && this.reset()
        }, onContainerMouseLeave: function () { this.reset(); this.chartPosition = null }, onContainerMouseMove: function (a) { var b = this.chart, a = this.normalize(a); a.returnValue = !1; b.mouseIsDown === "mousedown" && this.drag(a); b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) && !b.openMenu && this.runPointActions(a) }, inClass: function (a, b) { for (var c; a;) { if (c = G(a, "class")) if (c.indexOf(b) !== -1) return !0; else if (c.indexOf("highcharts-container") !== -1) return !1; a = a.parentNode } }, onTrackerMouseOut: function (a) {
            var b =
            this.chart.hoverSeries; if (b && !b.options.stickyTracking && !this.inClass(a.toElement || a.relatedTarget, "highcharts-tooltip")) b.onMouseOut()
        }, onContainerClick: function (a) {
            var b = this.chart, c = b.hoverPoint, d = b.plotLeft, e = b.plotTop, f = b.inverted, g, h, i, a = this.normalize(a); a.cancelBubble = !0; if (!b.cancelClick) c && this.inClass(a.target, "highcharts-tracker") ? (g = this.chartPosition, h = c.plotX, i = c.plotY, y(c, { pageX: g.left + d + (f ? b.plotWidth - i : h), pageY: g.top + e + (f ? b.plotHeight - h : i) }), K(c.series, "click", y(a, { point: c })), b.hoverPoint &&
            c.firePointEvent("click", a)) : (y(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - d, a.chartY - e) && K(b, "click", a))
        }, onContainerTouchStart: function (a) { var b = this.chart; a.touches.length === 1 ? (a = this.normalize(a), b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) && (this.runPointActions(a), this.pinch(a))) : a.touches.length === 2 && this.pinch(a) }, onContainerTouchMove: function (a) { (a.touches.length === 1 || a.touches.length === 2) && this.pinch(a) }, onDocumentTouchEnd: function (a) { this.drop(a) }, setDOMEvents: function () {
            var a =
            this, b = a.chart.container, c; this._events = c = [[b, "onmousedown", "onContainerMouseDown"], [b, "onmousemove", "onContainerMouseMove"], [b, "onclick", "onContainerClick"], [b, "mouseleave", "onContainerMouseLeave"], [H, "mousemove", "onDocumentMouseMove"], [H, "mouseup", "onDocumentMouseUp"]]; gb && c.push([b, "ontouchstart", "onContainerTouchStart"], [b, "ontouchmove", "onContainerTouchMove"], [H, "touchend", "onDocumentTouchEnd"]); n(c, function (b) {
                a["_" + b[2]] = function (c) { a[b[2]](c) }; b[1].indexOf("on") === 0 ? b[0][b[1]] = a["_" + b[2]] :
                F(b[0], b[1], a["_" + b[2]])
            })
        }, destroy: function () { var a = this; n(a._events, function (b) { b[1].indexOf("on") === 0 ? b[0][b[1]] = null : X(b[0], b[1], a["_" + b[2]]) }); delete a._events; clearInterval(a.tooltipTimeout) }
    }; Hb.prototype = {
        init: function (a, b) {
            var c = this, d = b.itemStyle, e = p(b.padding, 8), f = b.itemMarginTop || 0; this.options = b; if (b.enabled) c.baseline = C(d.fontSize) + 3 + f, c.itemStyle = d, c.itemHiddenStyle = z(d, b.itemHiddenStyle), c.itemMarginTop = f, c.padding = e, c.initialItemX = e, c.initialItemY = e - 5, c.maxItemWidth = 0, c.chart = a, c.itemHeight =
            0, c.lastLineHeight = 0, c.render(), F(c.chart, "endResize", function () { c.positionCheckboxes() })
        }, colorizeItem: function (a, b) { var c = this.options, d = a.legendItem, e = a.legendLine, f = a.legendSymbol, g = this.itemHiddenStyle.color, c = b ? c.itemStyle.color : g, h = b ? a.color : g, g = a.options && a.options.marker, i = { stroke: h, fill: h }, j; d && d.css({ fill: c, color: c }); e && e.attr({ stroke: h }); if (f) { if (g) for (j in g = a.convertAttribs(g), g) d = g[j], d !== w && (i[j] = d); f.attr(i) } }, positionItem: function (a) {
            var b = this.options, c = b.symbolPadding, b = !b.rtl,
            d = a._legendItemPos, e = d[0], d = d[1], f = a.checkbox; a.legendGroup && a.legendGroup.translate(b ? e : this.legendWidth - e - 2 * c - 4, d); if (f) f.x = e, f.y = d
        }, destroyItem: function (a) { var b = a.checkbox; n(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function (b) { a[b] && a[b].destroy() }); b && Za(a.checkbox) }, destroy: function () { var a = this.group, b = this.box; if (b) this.box = b.destroy(); if (a) this.group = a.destroy() }, positionCheckboxes: function (a) {
            var b = this.group.alignAttr, c, d = this.clipHeight || this.legendHeight; if (b) c = b.translateY,
            n(this.allItems, function (e) { var f = e.checkbox, g; f && (g = c + f.y + (a || 0) + 3, L(f, { left: b.translateX + e.legendItemWidth + f.x - 20 + "px", top: g + "px", display: g > c - 6 && g < c + d - 6 ? "" : ba })) })
        }, renderTitle: function () { var a = this.padding, b = this.options.title, c = 0; if (b.text) { if (!this.title) this.title = this.chart.renderer.label(b.text, a - 3, a - 4, null, null, null, null, null, "legend-title").attr({ zIndex: 1 }).css(b.style).add(this.group); c = this.title.getBBox().height; this.contentGroup.attr({ translateY: c }) } this.titleHeight = c }, renderItem: function (a) {
            var u;
            var b = this, c = b.chart, d = c.renderer, e = b.options, f = e.layout === "horizontal", g = e.symbolWidth, h = e.symbolPadding, i = b.itemStyle, j = b.itemHiddenStyle, k = b.padding, m = !e.rtl, l = e.width, o = e.itemMarginBottom || 0, q = b.itemMarginTop, n = b.initialItemX, p = a.legendItem, s = a.series || a, x = s.options, r = x.showCheckbox, v = e.useHTML; if (!p && (a.legendGroup = d.g("legend-item").attr({ zIndex: 1 }).add(b.scrollGroup), s.drawLegendSymbol(b, a), a.legendItem = p = d.text(e.labelFormat ? La(e.labelFormat, a) : e.labelFormatter.call(a), m ? g + h : -h, b.baseline,
            v).css(z(a.visible ? i : j)).attr({ align: m ? "left" : "right", zIndex: 2 }).add(a.legendGroup), (v ? p : a.legendGroup).on("mouseover", function () { a.setState("hover"); p.css(b.options.itemHoverStyle) }).on("mouseout", function () { p.css(a.visible ? i : j); a.setState() }).on("click", function (b) { var c = function () { a.setVisible() }, b = { browserEvent: b }; a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : K(a, "legendItemClick", b, c) }), b.colorizeItem(a, a.visible), x && r)) a.checkbox = aa("input", { type: "checkbox", checked: a.selected, defaultChecked: a.selected },
            e.itemCheckboxStyle, c.container), F(a.checkbox, "click", function (b) { K(a, "checkboxClick", { checked: b.target.checked }, function () { a.select() }) }); d = p.getBBox(); u = a.legendItemWidth = e.itemWidth || g + h + d.width + k + (r ? 20 : 0), e = u; b.itemHeight = g = d.height; if (f && b.itemX - n + e > (l || c.chartWidth - 2 * k - n)) b.itemX = n, b.itemY += q + b.lastLineHeight + o, b.lastLineHeight = 0; b.maxItemWidth = t(b.maxItemWidth, e); b.lastItemY = q + b.itemY + o; b.lastLineHeight = t(g, b.lastLineHeight); a._legendItemPos = [b.itemX, b.itemY]; f ? b.itemX += e : (b.itemY += q + g + o, b.lastLineHeight =
            g); b.offsetWidth = l || t(f ? b.itemX - n : e, b.offsetWidth)
        }, render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.group, e, f, g, h, i = a.box, j = a.options, k = a.padding, m = j.borderWidth, l = j.backgroundColor; a.itemX = a.initialItemX; a.itemY = a.initialItemY; a.offsetWidth = 0; a.lastItemY = 0; if (!d) a.group = d = c.g("legend").attr({ zIndex: 7 }).add(), a.contentGroup = c.g().attr({ zIndex: 1 }).add(d), a.scrollGroup = c.g().add(a.contentGroup); a.renderTitle(); e = []; n(b.series, function (a) {
                var b = a.options; b.showInLegend && !v(b.linkedTo) && (e = e.concat(a.legendItems ||
                (b.legendType === "point" ? a.data : a)))
            }); Sb(e, function (a, b) { return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0) }); j.reversed && e.reverse(); a.allItems = e; a.display = f = !!e.length; n(e, function (b) { a.renderItem(b) }); g = j.width || a.offsetWidth; h = a.lastItemY + a.lastLineHeight + a.titleHeight; h = a.handleOverflow(h); if (m || l) {
                g += k; h += k; if (i) { if (g > 0 && h > 0) i[i.isNew ? "attr" : "animate"](i.crisp(null, null, null, g, h)), i.isNew = !1 } else a.box = i = c.rect(0, 0, g, h, j.borderRadius, m || 0).attr({
                    stroke: j.borderColor,
                    "stroke-width": m || 0, fill: l || ba
                }).add(d).shadow(j.shadow), i.isNew = !0; i[f ? "show" : "hide"]()
            } a.legendWidth = g; a.legendHeight = h; n(e, function (b) { a.positionItem(b) }); f && d.align(y({ width: g, height: h }, j), !0, "spacingBox"); b.isResizing || this.positionCheckboxes()
        }, handleOverflow: function (a) {
            var b = this, c = this.chart, d = c.renderer, e = this.options, f = e.y, f = c.spacingBox.height + (e.verticalAlign === "top" ? -f : f) - this.padding, g = e.maxHeight, h = this.clipRect, i = e.navigation, j = p(i.animation, !0), k = i.arrowSize || 12, m = this.nav; e.layout ===
            "horizontal" && (f /= 2); g && (f = A(f, g)); if (a > f && !e.useHTML) {
                this.clipHeight = c = f - 20 - this.titleHeight; this.pageCount = pa(a / c); this.currentPage = p(this.currentPage, 1); this.fullHeight = a; if (!h) h = b.clipRect = d.clipRect(0, 0, 9999, 0), b.contentGroup.clip(h); h.attr({ height: c }); if (!m) this.nav = m = d.g().attr({ zIndex: 1 }).add(this.group), this.up = d.symbol("triangle", 0, 0, k, k).on("click", function () { b.scroll(-1, j) }).add(m), this.pager = d.text("", 15, 10).css(i.style).add(m), this.down = d.symbol("triangle-down", 0, 0, k, k).on("click",
                function () { b.scroll(1, j) }).add(m); b.scroll(0); a = f
            } else if (m) h.attr({ height: c.chartHeight }), m.hide(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight = 0; return a
        }, scroll: function (a, b) {
            var c = this.pageCount, d = this.currentPage + a, e = this.clipHeight, f = this.options.navigation, g = f.activeColor, h = f.inactiveColor, f = this.pager, i = this.padding; d > c && (d = c); if (d > 0) b !== w && $a(b, this.chart), this.nav.attr({ translateX: i, translateY: e + 7 + this.titleHeight, visibility: "visible" }), this.up.attr({ fill: d === 1 ? h : g }).css({
                cursor: d ===
                1 ? "default" : "pointer"
            }), f.attr({ text: d + "/" + this.pageCount }), this.down.attr({ x: 18 + this.pager.getBBox().width, fill: d === c ? h : g }).css({ cursor: d === c ? "default" : "pointer" }), e = -A(e * (d - 1), this.fullHeight - e + i) + 1, this.scrollGroup.animate({ translateY: e }), f.attr({ text: d + "/" + c }), this.currentPage = d, this.positionCheckboxes(e)
        }
    }; Sa.prototype = {
        init: function (a, b) {
            var c, d = a.series; a.series = null; c = z(M, a); c.series = a.series = d; var d = c.chart, e = d.margin, e = da(e) ? e : [e, e, e, e]; this.optionsMarginTop = p(d.marginTop, e[0]); this.optionsMarginRight =
            p(d.marginRight, e[1]); this.optionsMarginBottom = p(d.marginBottom, e[2]); this.optionsMarginLeft = p(d.marginLeft, e[3]); this.runChartClick = (e = d.events) && !!e.click; this.bounds = { h: {}, v: {} }; this.callback = b; this.isResizing = 0; this.options = c; this.axes = []; this.series = []; this.hasCartesianSeries = d.showAxes; var f = this, g; f.index = Ua.length; Ua.push(f); d.reflow !== !1 && F(f, "load", function () { f.initReflow() }); if (e) for (g in e) F(f, g, e[g]); f.xAxis = []; f.yAxis = []; f.animation = ia ? !1 : p(d.animation, !0); f.pointCount = 0; f.counters =
            new Rb; f.firstRender()
        }, initSeries: function (a) { var b = this.options.chart; (b = Q[a.type || b.type || b.defaultSeriesType]) || Ba(17, !0); b = new b; b.init(this, a); return b }, addSeries: function (a, b, c) { var d, e = this; a && (b = p(b, !0), K(e, "addSeries", { options: a }, function () { d = e.initSeries(a); e.isDirtyLegend = !0; b && e.redraw(c) })); return d }, addAxis: function (a, b, c, d) { var b = b ? "xAxis" : "yAxis", e = this.options; new Da(this, z(a, { index: this[b].length })); e[b] = ja(e[b] || {}); e[b].push(a); p(c, !0) && this.redraw(d) }, isInsidePlot: function (a,
        b, c) { var d = c ? b : a, a = c ? a : b; return d >= 0 && d <= this.plotWidth && a >= 0 && a <= this.plotHeight }, adjustTickAmounts: function () { this.options.chart.alignTicks !== !1 && n(this.axes, function (a) { a.adjustTickAmount() }); this.maxTicks = null }, redraw: function (a) {
            var b = this.axes, c = this.series, d = this.pointer, e = this.legend, f = this.isDirtyLegend, g, h = this.isDirtyBox, i = c.length, j = i, k = this.renderer, m = k.isHidden(), l = []; $a(a, this); for (m && this.cloneRenderTo() ; j--;) if (a = c[j], a.isDirty && a.options.stacking) { g = !0; break } if (g) for (j = i; j--;) if (a =
            c[j], a.options.stacking) a.isDirty = !0; n(c, function (a) { a.isDirty && a.options.legendType === "point" && (f = !0) }); if (f && e.options.enabled) e.render(), this.isDirtyLegend = !1; if (this.hasCartesianSeries) { if (!this.isResizing) this.maxTicks = null, n(b, function (a) { a.setScale() }); this.adjustTickAmounts(); this.getMargins(); n(b, function (a) { if (a.isDirtyExtremes) a.isDirtyExtremes = !1, l.push(function () { K(a, "afterSetExtremes", a.getExtremes()) }); if (a.isDirty || h || g) a.redraw(), h = !0 }) } h && this.drawChartBox(); n(c, function (a) {
                a.isDirty &&
                a.visible && (!a.isCartesian || a.xAxis) && a.redraw()
            }); d && d.reset && d.reset(!0); k.draw(); K(this, "redraw"); m && this.cloneRenderTo(!0); n(l, function (a) { a.call() })
        }, showLoading: function (a) {
            var b = this.options, c = this.loadingDiv, d = b.loading; if (!c) this.loadingDiv = c = aa(Qa, { className: "highcharts-loading" }, y(d.style, { zIndex: 10, display: ba }), this.container), this.loadingSpan = aa("span", null, d.labelStyle, c); this.loadingSpan.innerHTML = a || b.lang.loading; if (!this.loadingShown) L(c, {
                opacity: 0, display: "", left: this.plotLeft +
                "px", top: this.plotTop + "px", width: this.plotWidth + "px", height: this.plotHeight + "px"
            }), Mb(c, { opacity: d.style.opacity }, { duration: d.showDuration || 0 }), this.loadingShown = !0
        }, hideLoading: function () { var a = this.options, b = this.loadingDiv; b && Mb(b, { opacity: 0 }, { duration: a.loading.hideDuration || 100, complete: function () { L(b, { display: ba }) } }); this.loadingShown = !1 }, get: function (a) {
            var b = this.axes, c = this.series, d, e; for (d = 0; d < b.length; d++) if (b[d].options.id === a) return b[d]; for (d = 0; d < c.length; d++) if (c[d].options.id === a) return c[d];
            for (d = 0; d < c.length; d++) { e = c[d].points || []; for (b = 0; b < e.length; b++) if (e[b].id === a) return e[b] } return null
        }, getAxes: function () { var a = this, b = this.options, c = b.xAxis = ja(b.xAxis || {}), b = b.yAxis = ja(b.yAxis || {}); n(c, function (a, b) { a.index = b; a.isX = !0 }); n(b, function (a, b) { a.index = b }); c = c.concat(b); n(c, function (b) { new Da(a, b) }); a.adjustTickAmounts() }, getSelectedPoints: function () { var a = []; n(this.series, function (b) { a = a.concat(Eb(b.points || [], function (a) { return a.selected })) }); return a }, getSelectedSeries: function () {
            return Eb(this.series,
            function (a) { return a.selected })
        }, showResetZoom: function () { var a = this, b = M.lang, c = a.options.chart.resetZoomButton, d = c.theme, e = d.states, f = c.relativeTo === "chart" ? null : "plotBox"; this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function () { a.zoomOut() }, d, e && e.hover).attr({ align: c.position.align, title: b.resetZoomTitle }).add().align(c.position, !1, f) }, zoomOut: function () { var a = this; K(a, "selection", { resetSelection: !0 }, function () { a.zoom() }) }, zoom: function (a) {
            var b, c = this.pointer, d = !1, e; !a || a.resetSelection ?
            n(this.axes, function (a) { b = a.zoom() }) : n(a.xAxis.concat(a.yAxis), function (a) { var e = a.axis, h = e.isXAxis; if (c[h ? "zoomX" : "zoomY"] || c[h ? "pinchX" : "pinchY"]) b = e.zoom(a.min, a.max), e.displayBtn && (d = !0) }); e = this.resetZoomButton; if (d && !e) this.showResetZoom(); else if (!d && da(e)) this.resetZoomButton = e.destroy(); b && this.redraw(p(this.options.chart.animation, a && a.animation, this.pointCount < 100))
        }, pan: function (a) {
            var b = this.xAxis[0], c = this.mouseDownX, d = b.pointRange / 2, e = b.getExtremes(), f = b.translate(c - a, !0) + d, c = b.translate(c +
            this.plotWidth - a, !0) - d; (d = this.hoverPoints) && n(d, function (a) { a.setState() }); b.series.length && f > A(e.dataMin, e.min) && c < t(e.dataMax, e.max) && b.setExtremes(f, c, !0, !1, { trigger: "pan" }); this.mouseDownX = a; L(this.container, { cursor: "move" })
        }, setTitle: function (a, b) {
            var f; var c = this, d = c.options, e; e = d.title = z(d.title, a); f = d.subtitle = z(d.subtitle, b), d = f; n([["title", a, e], ["subtitle", b, d]], function (a) {
                var b = a[0], d = c[b], e = a[1], a = a[2]; d && e && (c[b] = d = d.destroy()); a && a.text && !d && (c[b] = c.renderer.text(a.text, 0, 0, a.useHTML).attr({
                    align: a.align,
                    "class": "highcharts-" + b, zIndex: a.zIndex || 4
                }).css(a.style).add().align(a, !1, "spacingBox"))
            })
        }, getChartSize: function () { var a = this.options.chart, b = this.renderToClone || this.renderTo; this.containerWidth = vb(b, "width"); this.containerHeight = vb(b, "height"); this.chartWidth = t(0, a.width || this.containerWidth || 600); this.chartHeight = t(0, p(a.height, this.containerHeight > 19 ? this.containerHeight : 400)) }, cloneRenderTo: function (a) {
            var b = this.renderToClone, c = this.container; a ? b && (this.renderTo.appendChild(c), Za(b), delete this.renderToClone) :
            (c && this.renderTo.removeChild(c), this.renderToClone = b = this.renderTo.cloneNode(0), L(b, { position: "absolute", top: "-9999px", display: "block" }), H.body.appendChild(b), c && b.appendChild(c))
        }, getContainer: function () {
            var a, b = this.options.chart, c, d, e; this.renderTo = a = b.renderTo; e = "highcharts-" + Kb++; if (ma(a)) this.renderTo = a = H.getElementById(a); a || Ba(13, !0); c = C(G(a, "data-highcharts-chart")); !isNaN(c) && Ua[c] && Ua[c].destroy(); G(a, "data-highcharts-chart", this.index); a.innerHTML = ""; a.offsetWidth || this.cloneRenderTo();
            this.getChartSize(); c = this.chartWidth; d = this.chartHeight; this.container = a = aa(Qa, { className: "highcharts-container" + (b.className ? " " + b.className : ""), id: e }, y({ position: "relative", overflow: "hidden", width: c + "px", height: d + "px", textAlign: "left", lineHeight: "normal", zIndex: 0, "-webkit-tap-highlight-color": "rgba(0,0,0,0)" }, b.style), this.renderToClone || a); this._cursor = a.style.cursor; this.renderer = b.forExport ? new Ga(a, c, d, !0) : new cb(a, c, d); ia && this.renderer.create(this, a, c, d)
        }, getMargins: function () {
            var a = this.options.chart,
            b = a.spacingTop, c = a.spacingRight, d = a.spacingBottom, a = a.spacingLeft, e, f = this.legend, g = this.optionsMarginTop, h = this.optionsMarginLeft, i = this.optionsMarginRight, j = this.optionsMarginBottom, k = this.options.title, m = this.options.subtitle, l = this.options.legend, o = p(l.margin, 10), q = l.x, O = l.y, u = l.align, s = l.verticalAlign; this.resetMargins(); e = this.axisOffset; if ((this.title || this.subtitle) && !v(this.optionsMarginTop)) if (m = t(this.title && !k.floating && !k.verticalAlign && k.y || 0, this.subtitle && !m.floating && !m.verticalAlign &&
            m.y || 0)) this.plotTop = t(this.plotTop, m + p(k.margin, 15) + b); if (f.display && !l.floating) if (u === "right") { if (!v(i)) this.marginRight = t(this.marginRight, f.legendWidth - q + o + c) } else if (u === "left") { if (!v(h)) this.plotLeft = t(this.plotLeft, f.legendWidth + q + o + a) } else if (s === "top") { if (!v(g)) this.plotTop = t(this.plotTop, f.legendHeight + O + o + b) } else if (s === "bottom" && !v(j)) this.marginBottom = t(this.marginBottom, f.legendHeight - O + o + d); this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin); this.extraTopMargin && (this.plotTop +=
            this.extraTopMargin); this.hasCartesianSeries && n(this.axes, function (a) { a.getOffset() }); v(h) || (this.plotLeft += e[3]); v(g) || (this.plotTop += e[0]); v(j) || (this.marginBottom += e[2]); v(i) || (this.marginRight += e[1]); this.setChartSize()
        }, initReflow: function () {
            function a(a) {
                var g = c.width || vb(d, "width"), h = c.height || vb(d, "height"), a = a ? a.target : Y; if (!b.hasUserSize && g && h && (a === Y || a === H)) {
                    if (g !== b.containerWidth || h !== b.containerHeight) clearTimeout(e), b.reflowTimeout = e = setTimeout(function () {
                        if (b.container) b.setSize(g,
                        h, !1), b.hasUserSize = null
                    }, 100); b.containerWidth = g; b.containerHeight = h
                }
            } var b = this, c = b.options.chart, d = b.renderTo, e; F(Y, "resize", a); F(b, "destroy", function () { X(Y, "resize", a) })
        }, setSize: function (a, b, c) {
            var d = this, e, f, g; d.isResizing += 1; g = function () { d && K(d, "endResize", null, function () { d.isResizing -= 1 }) }; $a(c, d); d.oldChartHeight = d.chartHeight; d.oldChartWidth = d.chartWidth; if (v(a)) d.chartWidth = e = t(0, r(a)), d.hasUserSize = !!e; if (v(b)) d.chartHeight = f = t(0, r(b)); L(d.container, { width: e + "px", height: f + "px" }); d.setChartSize(!0);
            d.renderer.setSize(e, f, c); d.maxTicks = null; n(d.axes, function (a) { a.isDirty = !0; a.setScale() }); n(d.series, function (a) { a.isDirty = !0 }); d.isDirtyLegend = !0; d.isDirtyBox = !0; d.getMargins(); d.redraw(c); d.oldChartHeight = null; K(d, "resize"); Ra === !1 ? g() : setTimeout(g, Ra && Ra.duration || 500)
        }, setChartSize: function (a) {
            var b = this.inverted, c = this.renderer, d = this.chartWidth, e = this.chartHeight, f = this.options.chart, g = f.spacingTop, h = f.spacingRight, i = f.spacingBottom, j = f.spacingLeft, k = this.clipOffset, m, l, o, q; this.plotLeft = m =
            r(this.plotLeft); this.plotTop = l = r(this.plotTop); this.plotWidth = o = t(0, r(d - m - this.marginRight)); this.plotHeight = q = t(0, r(e - l - this.marginBottom)); this.plotSizeX = b ? q : o; this.plotSizeY = b ? o : q; this.plotBorderWidth = b = f.plotBorderWidth || 0; this.spacingBox = c.spacingBox = { x: j, y: g, width: d - j - h, height: e - g - i }; this.plotBox = c.plotBox = { x: m, y: l, width: o, height: q }; c = pa(t(b, k[3]) / 2); d = pa(t(b, k[0]) / 2); this.clipBox = { x: c, y: d, width: W(this.plotSizeX - t(b, k[1]) / 2 - c), height: W(this.plotSizeY - t(b, k[2]) / 2 - d) }; a || n(this.axes, function (a) {
                a.setAxisSize();
                a.setAxisTranslation()
            })
        }, resetMargins: function () { var a = this.options.chart, b = a.spacingRight, c = a.spacingBottom, d = a.spacingLeft; this.plotTop = p(this.optionsMarginTop, a.spacingTop); this.marginRight = p(this.optionsMarginRight, b); this.marginBottom = p(this.optionsMarginBottom, c); this.plotLeft = p(this.optionsMarginLeft, d); this.axisOffset = [0, 0, 0, 0]; this.clipOffset = [0, 0, 0, 0] }, drawChartBox: function () {
            var a = this.options.chart, b = this.renderer, c = this.chartWidth, d = this.chartHeight, e = this.chartBackground, f = this.plotBackground,
            g = this.plotBorder, h = this.plotBGImage, i = a.borderWidth || 0, j = a.backgroundColor, k = a.plotBackgroundColor, m = a.plotBackgroundImage, l = a.plotBorderWidth || 0, o, q = this.plotLeft, n = this.plotTop, p = this.plotWidth, s = this.plotHeight, x = this.plotBox, r = this.clipRect, t = this.clipBox; o = i + (a.shadow ? 8 : 0); if (i || j) if (e) e.animate(e.crisp(null, null, null, c - o, d - o)); else { e = { fill: j || ba }; if (i) e.stroke = a.borderColor, e["stroke-width"] = i; this.chartBackground = b.rect(o / 2, o / 2, c - o, d - o, a.borderRadius, i).attr(e).add().shadow(a.shadow) } if (k) f ?
            f.animate(x) : this.plotBackground = b.rect(q, n, p, s, 0).attr({ fill: k }).add().shadow(a.plotShadow); if (m) h ? h.animate(x) : this.plotBGImage = b.image(m, q, n, p, s).add(); r ? r.animate({ width: t.width, height: t.height }) : this.clipRect = b.clipRect(t); if (l) g ? g.animate(g.crisp(null, q, n, p, s)) : this.plotBorder = b.rect(q, n, p, s, 0, l).attr({ stroke: a.plotBorderColor, "stroke-width": l, zIndex: 1 }).add(); this.isDirtyBox = !1
        }, propFromSeries: function () {
            var a = this, b = a.options.chart, c, d = a.options.series, e, f; n(["inverted", "angular", "polar"],
            function (g) { c = Q[b.type || b.defaultSeriesType]; f = a[g] || b[g] || c && c.prototype[g]; for (e = d && d.length; !f && e--;) (c = Q[d[e].type]) && c.prototype[g] && (f = !0); a[g] = f })
        }, render: function () {
            var a = this, b = a.axes, c = a.renderer, d = a.options, e = d.labels, f = d.credits, g; a.setTitle(); a.legend = new Hb(a, d.legend); n(b, function (a) { a.setScale() }); a.getMargins(); a.maxTicks = null; n(b, function (a) { a.setTickPositions(!0); a.setMaxTicks() }); a.adjustTickAmounts(); a.getMargins(); a.drawChartBox(); a.hasCartesianSeries && n(b, function (a) { a.render() });
            if (!a.seriesGroup) a.seriesGroup = c.g("series-group").attr({ zIndex: 3 }).add(); n(a.series, function (a) { a.translate(); a.setTooltipPoints(); a.render() }); e.items && n(e.items, function (b) { var d = y(e.style, b.style), f = C(d.left) + a.plotLeft, g = C(d.top) + a.plotTop + 12; delete d.left; delete d.top; c.text(b.html, f, g).attr({ zIndex: 2 }).css(d).add() }); if (f.enabled && !a.credits) g = f.href, a.credits = c.text(f.text, 0, 0).on("click", function () { if (g) location.href = g }).attr({ align: f.position.align, zIndex: 8 }).css(f.style).add().align(f.position);
            a.hasRendered = !0
        }, destroy: function () {
            var a = this, b = a.axes, c = a.series, d = a.container, e, f = d && d.parentNode; K(a, "destroy"); Ua[a.index] = w; a.renderTo.removeAttribute("data-highcharts-chart"); X(a); for (e = b.length; e--;) b[e] = b[e].destroy(); for (e = c.length; e--;) c[e] = c[e].destroy(); n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","), function (b) { var c = a[b]; c && c.destroy && (a[b] = c.destroy()) });
            if (d) d.innerHTML = "", X(d), f && Za(d); for (e in a) delete a[e]
        }, isReadyToRender: function () { var a = this; return !ca && Y == Y.top && H.readyState !== "complete" || ia && !Y.canvg ? (ia ? $b.push(function () { a.firstRender() }, a.options.global.canvasToolsURL) : H.attachEvent("onreadystatechange", function () { H.detachEvent("onreadystatechange", a.firstRender); H.readyState === "complete" && a.firstRender() }), !1) : !0 }, firstRender: function () {
            var a = this, b = a.options, c = a.callback; if (a.isReadyToRender()) a.getContainer(), K(a, "init"), a.resetMargins(),
            a.setChartSize(), a.propFromSeries(), a.getAxes(), n(b.series || [], function (b) { a.initSeries(b) }), K(a, "beforeRender"), a.pointer = new pb(a, b), a.render(), a.renderer.draw(), c && c.apply(a, [a]), n(a.callbacks, function (b) { b.apply(a, [a]) }), a.cloneRenderTo(!0), K(a, "load")
        }
    }; Sa.prototype.callbacks = []; var Ha = function () { }; Ha.prototype = {
        init: function (a, b, c) {
            this.series = a; this.applyOptions(b, c); this.pointAttr = {}; if (a.options.colorByPoint && (b = a.options.colors || a.chart.options.colors, this.color = this.color || b[a.colorCounter++],
            a.colorCounter === b.length)) a.colorCounter = 0; a.chart.pointCount++; return this
        }, applyOptions: function (a, b) { var c = this.series, d = c.pointValKey, a = Ha.prototype.optionsToObject.call(this, a); y(this, a); this.options = this.options ? y(this.options, a) : a; if (d) this.y = this[d]; if (this.x === w && c) this.x = b === w ? c.autoIncrement() : b; return this }, optionsToObject: function (a) {
            var b, c = this.series, d = c.pointArrayMap || ["y"], e = d.length, f = 0, g = 0; if (typeof a === "number" || a === null) b = { y: a }; else if (Wa(a)) {
                b = {}; if (a.length > e) {
                    c = typeof a[0];
                    if (c === "string") b.name = a[0]; else if (c === "number") b.x = a[0]; f++
                } for (; g < e;) b[d[g++]] = a[f++]
            } else if (typeof a === "object") { b = a; if (a.dataLabels) c._hasPointLabels = !0; if (a.marker) c._hasPointMarkers = !0 } return b
        }, destroy: function () {
            var a = this.series.chart, b = a.hoverPoints, c; a.pointCount--; if (b && (this.setState(), na(b, this), !b.length)) a.hoverPoints = null; if (this === a.hoverPoint) this.onMouseOut(); if (this.graphic || this.dataLabel) X(this), this.destroyElements(); this.legendItem && a.legend.destroyItem(this); for (c in this) this[c] =
            null
        }, destroyElements: function () { for (var a = "graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","), b, c = 6; c--;) b = a[c], this[b] && (this[b] = this[b].destroy()) }, getLabelConfig: function () { return { x: this.category, y: this.y, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage, total: this.total || this.stackTotal } }, select: function (a, b) {
            var c = this, d = c.series, e = d.chart, a = p(a, !c.selected); c.firePointEvent(a ? "select" : "unselect", { accumulate: b }, function () {
                c.selected =
                c.options.selected = a; d.options.data[va(c, d.data)] = c.options; c.setState(a && "select"); b || n(e.getSelectedPoints(), function (a) { if (a.selected && a !== c) a.selected = a.options.selected = !1, d.options.data[va(a, d.data)] = a.options, a.setState(""), a.firePointEvent("unselect") })
            })
        }, onMouseOver: function (a) { var b = this.series, c = b.chart, d = c.tooltip, e = c.hoverPoint; if (e && e !== this) e.onMouseOut(); this.firePointEvent("mouseOver"); d && (!d.shared || b.noSharedTooltip) && d.refresh(this, a); this.setState("hover"); c.hoverPoint = this },
        onMouseOut: function () { var a = this.series.chart, b = a.hoverPoints; if (!b || va(this, b) === -1) this.firePointEvent("mouseOut"), this.setState(), a.hoverPoint = null }, tooltipFormatter: function (a) { var b = this.series, c = b.tooltipOptions, d = p(c.valueDecimals, ""), e = c.valuePrefix || "", f = c.valueSuffix || ""; n(b.pointArrayMap || ["y"], function (b) { b = "{point." + b; if (e || f) a = a.replace(b + "}", e + b + "}" + f); a = a.replace(b + "}", b + ":,." + d + "f}") }); return La(a, { point: this, series: this.series }) }, update: function (a, b, c) {
            var d = this, e = d.series, f = d.graphic,
            g, h = e.data, i = e.chart, b = p(b, !0); d.firePointEvent("update", { options: a }, function () { d.applyOptions(a); da(a) && (e.getAttribs(), f && f.attr(d.pointAttr[e.state])); g = va(d, h); e.xData[g] = d.x; e.yData[g] = e.toYData ? e.toYData(d) : d.y; e.zData[g] = d.z; e.options.data[g] = d.options; e.isDirty = !0; e.isDirtyData = !0; b && i.redraw(c) })
        }, remove: function (a, b) {
            var c = this, d = c.series, e = d.chart, f, g = d.data; $a(b, e); a = p(a, !0); c.firePointEvent("remove", null, function () {
                f = va(c, g); g.splice(f, 1); d.options.data.splice(f, 1); d.xData.splice(f, 1);
                d.yData.splice(f, 1); d.zData.splice(f, 1); c.destroy(); d.isDirty = !0; d.isDirtyData = !0; a && e.redraw()
            })
        }, firePointEvent: function (a, b, c) { var d = this, e = this.series.options; (e.point.events[a] || d.options && d.options.events && d.options.events[a]) && this.importEvents(); a === "click" && e.allowPointSelect && (c = function (a) { d.select(null, a.ctrlKey || a.metaKey || a.shiftKey) }); K(this, a, b, c) }, importEvents: function () {
            if (!this.hasImportedEvents) {
                var a = z(this.series.options.point, this.options).events, b; this.events = a; for (b in a) F(this,
                b, a[b]); this.hasImportedEvents = !0
            }
        }, setState: function (a) {
            var b = this.plotX, c = this.plotY, d = this.series, e = d.options.states, f = S[d.type].marker && d.options.marker, g = f && !f.enabled, h = f && f.states[a], i = h && h.enabled === !1, j = d.stateMarkerGraphic, k = this.marker || {}, m = d.chart, l = this.pointAttr, a = a || ""; if (!(a === this.state || this.selected && a !== "select" || e[a] && e[a].enabled === !1 || a && (i || g && !h.enabled))) {
                if (this.graphic) e = f && this.graphic.symbolName && l[a].r, this.graphic.attr(z(l[a], e ? { x: b - e, y: c - e, width: 2 * e, height: 2 * e } : {}));
                else { if (a && h) e = h.radius, k = k.symbol || d.symbol, j && j.currentSymbol !== k && (j = j.destroy()), j ? j.attr({ x: b - e, y: c - e }) : (d.stateMarkerGraphic = j = m.renderer.symbol(k, b - e, c - e, 2 * e, 2 * e).attr(l[a]).add(d.markerGroup), j.currentSymbol = k); if (j) j[a && m.isInsidePlot(b, c) ? "show" : "hide"]() } this.state = a
            }
        }
    }; var $ = function () { }; $.prototype = {
        isCartesian: !0, type: "line", pointClass: Ha, sorted: !0, requireSorting: !0, pointAttrToOptions: { stroke: "lineColor", "stroke-width": "lineWidth", fill: "fillColor", r: "radius" }, colorCounter: 0, init: function (a,
        b) {
            var c, d, e = a.series; this.chart = a; this.options = b = this.setOptions(b); this.bindAxes(); y(this, { name: b.name, state: "", pointAttr: {}, visible: b.visible !== !1, selected: b.selected === !0 }); if (ia) b.animation = !1; d = b.events; for (c in d) F(this, c, d[c]); if (d && d.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0; this.getColor(); this.getSymbol(); this.setData(b.data, !1); if (this.isCartesian) a.hasCartesianSeries = !0; e.push(this); this._i = e.length - 1; Sb(e, function (a, b) {
                return p(a.options.index,
                a._i) - p(b.options.index, a._i)
            }); n(e, function (a, b) { a.index = b; a.name = a.name || "Series " + (b + 1) }); c = b.linkedTo; this.linkedSeries = []; if (ma(c) && (c = c === ":previous" ? e[this.index - 1] : a.get(c))) c.linkedSeries.push(this), this.linkedParent = c
        }, bindAxes: function () { var a = this, b = a.options, c = a.chart, d; a.isCartesian && n(["xAxis", "yAxis"], function (e) { n(c[e], function (c) { d = c.options; if (b[e] === d.index || b[e] !== w && b[e] === d.id || b[e] === w && d.index === 0) c.series.push(a), a[e] = c, c.isDirty = !0 }); a[e] || Ba(18, !0) }) }, autoIncrement: function () {
            var a =
            this.options, b = this.xIncrement, b = p(b, a.pointStart, 0); this.pointInterval = p(this.pointInterval, a.pointInterval, 1); this.xIncrement = b + this.pointInterval; return b
        }, getSegments: function () { var a = -1, b = [], c, d = this.points, e = d.length; if (e) if (this.options.connectNulls) { for (c = e; c--;) d[c].y === null && d.splice(c, 1); d.length && (b = [d]) } else n(d, function (c, g) { c.y === null ? (g > a + 1 && b.push(d.slice(a + 1, g)), a = g) : g === e - 1 && b.push(d.slice(a + 1, g + 1)) }); this.segments = b }, setOptions: function (a) {
            var b = this.chart.options, c = b.plotOptions,
            d = c[this.type]; this.userOptions = a; a = z(d, c.series, a); this.tooltipOptions = z(b.tooltip, a.tooltip); d.marker === null && delete a.marker; return a
        }, getColor: function () { var a = this.options, b = this.userOptions, c = this.chart.options.colors, d = this.chart.counters, e; e = a.color || S[this.type].color; if (!e && !a.colorByPoint) v(b._colorIndex) ? a = b._colorIndex : (b._colorIndex = d.color, a = d.color++), e = c[a]; this.color = e; d.wrapColor(c.length) }, getSymbol: function () {
            var a = this.userOptions, b = this.options.marker, c = this.chart, d = c.options.symbols,
            c = c.counters; this.symbol = b.symbol; if (!this.symbol) v(a._symbolIndex) ? a = a._symbolIndex : (a._symbolIndex = c.symbol, a = c.symbol++), this.symbol = d[a]; if (/^url/.test(this.symbol)) b.radius = 0; c.wrapSymbol(d.length)
        }, drawLegendSymbol: function (a) {
            var b = this.options, c = b.marker, d = a.options.symbolWidth, e = this.chart.renderer, f = this.legendGroup, a = a.baseline, g; if (b.lineWidth) { g = { "stroke-width": b.lineWidth }; if (b.dashStyle) g.dashstyle = b.dashStyle; this.legendLine = e.path(["M", 0, a - 4, "L", d, a - 4]).attr(g).add(f) } if (c && c.enabled) b =
            c.radius, this.legendSymbol = e.symbol(this.symbol, d / 2 - b, a - 4 - b, 2 * b, 2 * b).add(f)
        }, addPoint: function (a, b, c, d) {
            var e = this.options, f = this.data, g = this.graph, h = this.area, i = this.chart, j = this.xData, k = this.yData, m = this.zData, l = this.names, o = g && g.shift || 0, q = e.data; $a(d, i); if (g && c) g.shift = o + 1; if (h) { if (c) h.shift = o + 1; h.isArea = !0 } b = p(b, !0); d = { series: this }; this.pointClass.prototype.applyOptions.apply(d, [a]); j.push(d.x); k.push(this.toYData ? this.toYData(d) : d.y); m.push(d.z); if (l) l[d.x] = d.name; q.push(a); e.legendType === "point" &&
            this.generatePoints(); c && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), j.shift(), k.shift(), m.shift(), q.shift())); this.getAttribs(); this.isDirtyData = this.isDirty = !0; b && i.redraw()
        }, setData: function (a, b) {
            var c = this.points, d = this.options, e = this.chart, f = null, g = this.xAxis, h = g && g.categories && !g.categories.length ? [] : null, i; this.xIncrement = null; this.pointRange = g && g.categories ? 1 : d.pointRange; this.colorCounter = 0; var j = [], k = [], m = [], l = a ? a.length : [], o = (i = this.pointArrayMap) && i.length, q = !!this.toYData; if (l > (d.turboThreshold ||
            1E3)) { for (i = 0; f === null && i < l;) f = a[i], i++; if (Ja(f)) { f = p(d.pointStart, 0); d = p(d.pointInterval, 1); for (i = 0; i < l; i++) j[i] = f, k[i] = a[i], f += d; this.xIncrement = f } else if (Wa(f)) if (o) for (i = 0; i < l; i++) d = a[i], j[i] = d[0], k[i] = d.slice(1, o + 1); else for (i = 0; i < l; i++) d = a[i], j[i] = d[0], k[i] = d[1] } else for (i = 0; i < l; i++) if (a[i] !== w && (d = { series: this }, this.pointClass.prototype.applyOptions.apply(d, [a[i]]), j[i] = d.x, k[i] = q ? this.toYData(d) : d.y, m[i] = d.z, h && d.name)) h[i] = d.name; this.requireSorting && j.length > 1 && j[1] < j[0] && Ba(15); ma(k[0]) &&
            Ba(14, !0); this.data = []; this.options.data = a; this.xData = j; this.yData = k; this.zData = m; this.names = h; for (i = c && c.length || 0; i--;) c[i] && c[i].destroy && c[i].destroy(); if (g) g.minRange = g.userMinRange; this.isDirty = this.isDirtyData = e.isDirtyBox = !0; p(b, !0) && e.redraw(!1)
        }, remove: function (a, b) { var c = this, d = c.chart, a = p(a, !0); if (!c.isRemoving) c.isRemoving = !0, K(c, "remove", null, function () { c.destroy(); d.isDirtyLegend = d.isDirtyBox = !0; a && d.redraw(b) }); c.isRemoving = !1 }, processData: function (a) {
            var b = this.xData, c = this.yData,
            d = b.length, e = 0, f = d, g, h, i = this.xAxis, j = this.options, k = j.cropThreshold, m = this.isCartesian; if (m && !this.isDirty && !i.isDirty && !this.yAxis.isDirty && !a) return !1; if (m && this.sorted && (!k || d > k || this.forceCrop)) if (a = i.getExtremes(), i = a.min, k = a.max, b[d - 1] < i || b[0] > k) b = [], c = []; else if (b[0] < i || b[d - 1] > k) { for (a = 0; a < d; a++) if (b[a] >= i) { e = t(0, a - 1); break } for (; a < d; a++) if (b[a] > k) { f = a + 1; break } b = b.slice(e, f); c = c.slice(e, f); g = !0 } for (a = b.length - 1; a > 0; a--) if (d = b[a] - b[a - 1], d > 0 && (h === w || d < h)) h = d; this.cropped = g; this.cropStart = e;
            this.processedXData = b; this.processedYData = c; if (j.pointRange === null) this.pointRange = h || 1; this.closestPointRange = h
        }, generatePoints: function () {
            var a = this.options.data, b = this.data, c, d = this.processedXData, e = this.processedYData, f = this.pointClass, g = d.length, h = this.cropStart || 0, i, j = this.hasGroupedData, k, m = [], l; if (!b && !j) b = [], b.length = a.length, b = this.data = b; for (l = 0; l < g; l++) i = h + l, j ? m[l] = (new f).init(this, [d[l]].concat(ja(e[l]))) : (b[i] ? k = b[i] : a[i] !== w && (b[i] = k = (new f).init(this, a[i], d[l])), m[l] = k); if (b && (g !==
            (c = b.length) || j)) for (l = 0; l < c; l++) if (l === h && !j && (l += g), b[l]) b[l].destroyElements(), b[l].plotX = w; this.data = b; this.points = m
        }, translate: function () {
            this.processedXData || this.processData(); this.generatePoints(); var a = this.options, b = a.stacking, c = this.xAxis, d = c.categories, e = this.yAxis, f = this.points, g = f.length, h = !!this.modifyValue, i, j, k = a.pointPlacement === "between", m = a.threshold; j = e.series.sort(function (a, b) { return a.index - b.index }); for (a = j.length; a--;) if (j[a].visible) { j[a] === this && (i = !0); break } for (a = 0; a <
            g; a++) {
                j = f[a]; var l = j.x, o = j.y, q = j.low, n = e.stacks[(o < m ? "-" : "") + this.stackKey]; if (e.isLog && o <= 0) j.y = o = null; j.plotX = c.translate(l, 0, 0, 0, 1, k); if (b && this.visible && n && n[l]) q = n[l], n = q.total, q.cum = q = q.cum - o, o = q + o, i && (q = p(m, e.min)), e.isLog && q <= 0 && (q = null), b === "percent" && (q = n ? q * 100 / n : 0, o = n ? o * 100 / n : 0), j.percentage = n ? j.y * 100 / n : 0, j.total = j.stackTotal = n, j.stackY = o; j.yBottom = v(q) ? e.translate(q, 0, 1, 0, 1) : null; h && (o = this.modifyValue(o, j)); j.plotY = typeof o === "number" && o !== Infinity ? r(e.translate(o, 0, 1, 0, 1) * 10) / 10 : w;
                j.clientX = k ? c.translate(l, 0, 0, 0, 1) : j.plotX; j.negative = j.y < (m || 0); j.category = d && d[j.x] !== w ? d[j.x] : j.x
            } this.getSegments()
        }, setTooltipPoints: function (a) {
            var b = [], c, d, e = (c = this.xAxis) ? c.tooltipLen || c.len : this.chart.plotSizeX, f, g, h = []; if (this.options.enableMouseTracking !== !1) {
                if (a) this.tooltipPoints = null; n(this.segments || this.points, function (a) { b = b.concat(a) }); c && c.reversed && (b = b.reverse()); a = b.length; for (g = 0; g < a; g++) {
                    f = b[g]; c = b[g - 1] ? d + 1 : 0; for (d = b[g + 1] ? t(0, W((f.clientX + (b[g + 1] ? b[g + 1].clientX : e)) / 2)) : e; c >=
                    0 && c <= d;) h[c++] = f
                } this.tooltipPoints = h
            }
        }, tooltipHeaderFormatter: function (a) { var b = this.tooltipOptions, c = b.xDateFormat, d = b.dateTimeLabelFormats, e = this.xAxis, f = e && e.options.type === "datetime", b = b.headerFormat, e = e && e.closestPointRange, g; if (f && !c) if (e) for (g in I) { if (I[g] >= e) { c = d[g]; break } } else c = d.day; f && c && Ja(a.key) && (b = b.replace("{point.key}", "{point.key:" + c + "}")); return La(b, { point: a, series: this }) }, onMouseOver: function () {
            var a = this.chart, b = a.hoverSeries; if (b && b !== this) b.onMouseOut(); this.options.events.mouseOver &&
            K(this, "mouseOver"); this.setState("hover"); a.hoverSeries = this
        }, onMouseOut: function () { var a = this.options, b = this.chart, c = b.tooltip, d = b.hoverPoint; if (d) d.onMouseOut(); this && a.events.mouseOut && K(this, "mouseOut"); c && !a.stickyTracking && (!c.shared || this.noSharedTooltip) && c.hide(); this.setState(); b.hoverSeries = null }, animate: function (a) {
            var b = this, c = b.chart, d = c.renderer, e; e = b.options.animation; var f = c.clipBox, g = c.inverted, h; if (e && !da(e)) e = S[b.type].animation; h = "_sharedClip" + e.duration + e.easing; if (a) a = c[h],
            e = c[h + "m"], a || (c[h] = a = d.clipRect(y(f, { width: 0 })), c[h + "m"] = e = d.clipRect(-99, g ? -c.plotLeft : -c.plotTop, 99, g ? c.chartWidth : c.chartHeight)), b.group.clip(a), b.markerGroup.clip(e), b.sharedClipKey = h; else { if (a = c[h]) a.animate({ width: c.plotSizeX }, e), c[h + "m"].animate({ width: c.plotSizeX + 99 }, e); b.animate = null; b.animationTimeout = setTimeout(function () { b.afterAnimate() }, e.duration) }
        }, afterAnimate: function () {
            var a = this.chart, b = this.sharedClipKey, c = this.group; c && this.options.clip !== !1 && (c.clip(a.clipRect), this.markerGroup.clip());
            setTimeout(function () { b && a[b] && (a[b] = a[b].destroy(), a[b + "m"] = a[b + "m"].destroy()) }, 100)
        }, drawPoints: function () {
            var a, b = this.points, c = this.chart, d, e, f, g, h, i, j, k, m = this.options.marker, l, o = this.markerGroup; if (m.enabled || this._hasPointMarkers) for (f = b.length; f--;) if (g = b[f], d = g.plotX, e = g.plotY, k = g.graphic, i = g.marker || {}, a = m.enabled && i.enabled === w || i.enabled, l = c.isInsidePlot(r(d), e, c.inverted), a && e !== w && !isNaN(e) && g.y !== null) if (a = g.pointAttr[g.selected ? "select" : ""], h = a.r, i = p(i.symbol, this.symbol), j = i.indexOf("url") ===
            0, k) k.attr({ visibility: l ? ca ? "inherit" : "visible" : "hidden" }).animate(y({ x: d - h, y: e - h }, k.symbolName ? { width: 2 * h, height: 2 * h } : {})); else { if (l && (h > 0 || j)) g.graphic = c.renderer.symbol(i, d - h, e - h, 2 * h, 2 * h).attr(a).add(o) } else if (k) g.graphic = k.destroy()
        }, convertAttribs: function (a, b, c, d) { var e = this.pointAttrToOptions, f, g, h = {}, a = a || {}, b = b || {}, c = c || {}, d = d || {}; for (f in e) g = e[f], h[f] = p(a[g], b[f], c[f], d[f]); return h }, getAttribs: function () {
            var a = this, b = a.options, c = S[a.type].marker ? b.marker : b, d = c.states, e = d.hover, f, g = a.color,
            h = { stroke: g, fill: g }, i = a.points || [], j = [], k, m = a.pointAttrToOptions, l = b.negativeColor, o; b.marker ? (e.radius = e.radius || c.radius + 2, e.lineWidth = e.lineWidth || c.lineWidth + 1) : e.color = e.color || wa(e.color || g).brighten(e.brightness).get(); j[""] = a.convertAttribs(c, h); n(["hover", "select"], function (b) { j[b] = a.convertAttribs(d[b], j[""]) }); a.pointAttr = j; for (g = i.length; g--;) {
                h = i[g]; if ((c = h.options && h.options.marker || h.options) && c.enabled === !1) c.radius = 0; if (h.negative && l) h.color = h.fillColor = l; f = b.colorByPoint || h.color;
                if (h.options) for (o in m) v(c[m[o]]) && (f = !0); if (f) { c = c || {}; k = []; d = c.states || {}; f = d.hover = d.hover || {}; if (!b.marker) f.color = wa(f.color || h.color).brighten(f.brightness || e.brightness).get(); k[""] = a.convertAttribs(y({ color: h.color }, c), j[""]); k.hover = a.convertAttribs(d.hover, j.hover, k[""]); k.select = a.convertAttribs(d.select, j.select, k[""]); if (h.negative && b.marker && l) k[""].fill = k.hover.fill = k.select.fill = a.convertAttribs({ fillColor: l }).fill } else k = j; h.pointAttr = k
            }
        }, update: function (a, b) {
            var c = this.chart, d =
            this.type, a = z(this.userOptions, { animation: !1, index: this.index, pointStart: this.xData[0] }, a); this.remove(!1); y(this, Q[a.type || d].prototype); this.init(c, a); p(b, !0) && c.redraw(!1)
        }, destroy: function () {
            var a = this, b = a.chart, c = /AppleWebKit\/533/.test(Ta), d, e, f = a.data || [], g, h, i; K(a, "destroy"); X(a); n(["xAxis", "yAxis"], function (b) { if (i = a[b]) na(i.series, a), i.isDirty = i.forceRedraw = !0 }); a.legendItem && a.chart.legend.destroyItem(a); for (e = f.length; e--;) (g = f[e]) && g.destroy && g.destroy(); a.points = null; clearTimeout(a.animationTimeout);
            n("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","), function (b) { a[b] && (d = c && b === "group" ? "hide" : "destroy", a[b][d]()) }); if (b.hoverSeries === a) b.hoverSeries = null; na(b.series, a); for (h in a) delete a[h]
        }, drawDataLabels: function () {
            var a = this, b = a.options.dataLabels, c = a.points, d, e, f, g; if (b.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(b), g = a.plotGroup("dataLabelsGroup", "data-labels", a.visible ? "visible" : "hidden", b.zIndex || 6), e = b, n(c, function (c) {
                var i,
                j = c.dataLabel, k, m, l = c.connector, o = !0; d = c.options && c.options.dataLabels; i = e.enabled || d && d.enabled; if (j && !i) c.dataLabel = j.destroy(); else if (i) {
                    i = b.rotation; b = z(e, d); k = c.getLabelConfig(); f = b.format ? La(b.format, k) : b.formatter.call(k, b); b.style.color = p(b.color, b.style.color, a.color, "black"); if (j) if (v(f)) j.attr({ text: f }), o = !1; else { if (c.dataLabel = j = j.destroy(), l) c.connector = l.destroy() } else if (v(f)) {
                        j = {
                            fill: b.backgroundColor, stroke: b.borderColor, "stroke-width": b.borderWidth, r: b.borderRadius || 0, rotation: i,
                            padding: b.padding, zIndex: 1
                        }; for (m in j) j[m] === w && delete j[m]; j = c.dataLabel = a.chart.renderer[i ? "text" : "label"](f, 0, -999, null, null, null, b.useHTML).attr(j).css(b.style).add(g).shadow(b.shadow)
                    } j && a.alignDataLabel(c, j, b, null, o)
                }
            })
        }, alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart, g = f.inverted, h = p(a.plotX, -999), a = p(a.plotY, -999), i = b.getBBox(), d = y({ x: g ? f.plotWidth - a : h, y: r(g ? f.plotHeight - h : a), width: 0, height: 0 }, d); y(c, { width: i.width, height: i.height }); c.rotation ? (d = {
                align: c.align, x: d.x + c.x + d.width / 2, y: d.y +
                c.y + d.height / 2
            }, b[e ? "attr" : "animate"](d)) : b.align(c, null, d); b.attr({ visibility: c.crop === !1 || f.isInsidePlot(h, a, g) ? f.renderer.isSVG ? "inherit" : "visible" : "hidden" })
        }, getSegmentPath: function (a) { var b = this, c = [], d = b.options.step; n(a, function (e, f) { var g = e.plotX, h = e.plotY, i; b.getPointSpline ? c.push.apply(c, b.getPointSpline(a, e, f)) : (c.push(f ? "L" : "M"), d && f && (i = a[f - 1], d === "right" ? c.push(i.plotX, h) : d === "center" ? c.push((i.plotX + g) / 2, i.plotY, (i.plotX + g) / 2, h) : c.push(g, i.plotY)), c.push(e.plotX, e.plotY)) }); return c },
        getGraphPath: function () { var a = this, b = [], c, d = []; n(a.segments, function (e) { c = a.getSegmentPath(e); e.length > 1 ? b = b.concat(c) : d.push(e[0]) }); a.singlePoints = d; return a.graphPath = b }, drawGraph: function () {
            var a = this, b = this.options, c = [["graph", b.lineColor || this.color]], d = b.lineWidth, e = b.dashStyle, f = this.getGraphPath(), g = b.negativeColor; g && c.push(["graphNeg", g]); n(c, function (c, g) {
                var j = c[0], k = a[j]; if (k) hb(k), k.animate({ d: f }); else if (d && f.length) {
                    k = { stroke: c[1], "stroke-width": d, zIndex: 1 }; if (e) k.dashstyle = e; a[j] =
                    a.chart.renderer.path(f).attr(k).add(a.group).shadow(!g && b.shadow)
                }
            })
        }, clipNeg: function () {
            var a = this.options, b = this.chart, c = b.renderer, d = a.negativeColor, e, f = this.graph, g = this.area, h = this.posClip, i = this.negClip; e = b.chartWidth; var j = b.chartHeight, k = t(e, j); if (d && (f || g)) d = pa(this.yAxis.len - this.yAxis.translate(a.threshold || 0)), a = { x: 0, y: 0, width: k, height: d }, k = { x: 0, y: d, width: k, height: k - d }, b.inverted && c.isVML && (a = { x: b.plotWidth - d - b.plotLeft, y: 0, width: e, height: j }, k = {
                x: d + b.plotLeft - e, y: 0, width: b.plotLeft + d,
                height: e
            }), this.yAxis.reversed ? (b = k, e = a) : (b = a, e = k), h ? (h.animate(b), i.animate(e)) : (this.posClip = h = c.clipRect(b), this.negClip = i = c.clipRect(e), f && (f.clip(h), this.graphNeg.clip(i)), g && (g.clip(h), this.areaNeg.clip(i)))
        }, invertGroups: function () { function a() { var a = { width: b.yAxis.len, height: b.xAxis.len }; n(["group", "markerGroup"], function (c) { b[c] && b[c].attr(a).invert() }) } var b = this, c = b.chart; if (b.xAxis) F(c, "resize", a), F(b, "destroy", function () { X(c, "resize", a) }), a(), b.invertGroups = a }, plotGroup: function (a, b,
        c, d, e) { var f = this[a], g = !f, h = this.chart, i = this.xAxis, j = this.yAxis; g && (this[a] = f = h.renderer.g(b).attr({ visibility: c, zIndex: d || 0.1 }).add(e)); f[g ? "attr" : "animate"]({ translateX: i ? i.left : h.plotLeft, translateY: j ? j.top : h.plotTop, scaleX: 1, scaleY: 1 }); return f }, render: function () {
            var a = this.chart, b, c = this.options, d = c.animation && !!this.animate && a.renderer.isSVG, e = this.visible ? "visible" : "hidden", f = c.zIndex, g = this.hasRendered, h = a.seriesGroup; b = this.plotGroup("group", "series", e, f, h); this.markerGroup = this.plotGroup("markerGroup",
            "markers", e, f, h); d && this.animate(!0); this.getAttribs(); b.inverted = this.isCartesian ? a.inverted : !1; this.drawGraph && (this.drawGraph(), this.clipNeg()); this.drawDataLabels(); this.drawPoints(); this.options.enableMouseTracking !== !1 && this.drawTracker(); a.inverted && this.invertGroups(); c.clip !== !1 && !this.sharedClipKey && !g && b.clip(a.clipRect); d ? this.animate() : g || this.afterAnimate(); this.isDirty = this.isDirtyData = !1; this.hasRendered = !0
        }, redraw: function () {
            var a = this.chart, b = this.isDirtyData, c = this.group, d = this.xAxis,
            e = this.yAxis; c && (a.inverted && c.attr({ width: a.plotWidth, height: a.plotHeight }), c.animate({ translateX: p(d && d.left, a.plotLeft), translateY: p(e && e.top, a.plotTop) })); this.translate(); this.setTooltipPoints(!0); this.render(); b && K(this, "updatedData")
        }, setState: function (a) { var b = this.options, c = this.graph, d = this.graphNeg, e = b.states, b = b.lineWidth, a = a || ""; if (this.state !== a) this.state = a, e[a] && e[a].enabled === !1 || (a && (b = e[a].lineWidth || b + 1), c && !c.dashstyle && (a = { "stroke-width": b }, c.attr(a), d && d.attr(a))) }, setVisible: function (a,
        b) {
            var c = this, d = c.chart, e = c.legendItem, f, g = d.options.chart.ignoreHiddenSeries, h = c.visible; f = (c.visible = a = c.userOptions.visible = a === w ? !h : a) ? "show" : "hide"; n(["group", "dataLabelsGroup", "markerGroup", "tracker"], function (a) { if (c[a]) c[a][f]() }); if (d.hoverSeries === c) c.onMouseOut(); e && d.legend.colorizeItem(c, a); c.isDirty = !0; c.options.stacking && n(d.series, function (a) { if (a.options.stacking && a.visible) a.isDirty = !0 }); n(c.linkedSeries, function (b) { b.setVisible(a, !1) }); if (g) d.isDirtyBox = !0; b !== !1 && d.redraw(); K(c,
            f)
        }, show: function () { this.setVisible(!0) }, hide: function () { this.setVisible(!1) }, select: function (a) { this.selected = a = a === w ? !this.selected : a; if (this.checkbox) this.checkbox.checked = a; K(this, a ? "select" : "unselect") }, drawTracker: function () {
            var a = this, b = a.options, c = b.trackByArea, d = [].concat(c ? a.areaPath : a.graphPath), e = d.length, f = a.chart, g = f.pointer, h = f.renderer, i = f.options.tooltip.snap, j = a.tracker, k = b.cursor, k = k && { cursor: k }, m = a.singlePoints, l, o = function () { if (f.hoverSeries !== a) a.onMouseOver() }; if (e && !c) for (l =
            e + 1; l--;) d[l] === "M" && d.splice(l + 1, 0, d[l + 1] - i, d[l + 2], "L"), (l && d[l] === "M" || l === e) && d.splice(l, 0, "L", d[l - 2] + i, d[l - 1]); for (l = 0; l < m.length; l++) e = m[l], d.push("M", e.plotX - i, e.plotY, "L", e.plotX + i, e.plotY); if (j) j.attr({ d: d }); else if (a.tracker = j = h.path(d).attr({ "class": "highcharts-tracker", "stroke-linejoin": "round", visibility: a.visible ? "visible" : "hidden", stroke: Xb, fill: c ? Xb : ba, "stroke-width": b.lineWidth + (c ? 0 : 2 * i), zIndex: 2 }).addClass("highcharts-tracker").on("mouseover", o).on("mouseout", function (a) { g.onTrackerMouseOut(a) }).css(k).add(a.markerGroup),
            gb) j.on("touchstart", o)
        }
    }; D = ea($); Q.line = D; S.area = z(R, { threshold: 0 }); D = ea($, {
        type: "area", getSegments: function () {
            var a = [], b = [], c = [], d = this.xAxis, e = this.yAxis, f = e.stacks[this.stackKey], g = {}, h, i, j = this.points, k, m; if (this.options.stacking && !this.cropped) {
                for (k = 0; k < j.length; k++) g[j[k].x] = j[k]; for (m in f) c.push(+m); c.sort(function (a, b) { return a - b }); n(c, function (a) { g[a] ? b.push(g[a]) : (h = d.translate(a), i = e.toPixels(f[a].cum, !0), b.push({ y: null, plotX: h, clientX: h, plotY: i, yBottom: i, onMouseOver: qa })) }); b.length &&
                a.push(b)
            } else $.prototype.getSegments.call(this), a = this.segments; this.segments = a
        }, getSegmentPath: function (a) { var b = $.prototype.getSegmentPath.call(this, a), c = [].concat(b), d, e = this.options; b.length === 3 && c.push("L", b[1], b[2]); if (e.stacking && !this.closedStacks) for (d = a.length - 1; d >= 0; d--) d < a.length - 1 && e.step && c.push(a[d + 1].plotX, a[d].yBottom), c.push(a[d].plotX, a[d].yBottom); else this.closeSegment(c, a); this.areaPath = this.areaPath.concat(c); return b }, closeSegment: function (a, b) {
            var c = this.yAxis.getThreshold(this.options.threshold);
            a.push("L", b[b.length - 1].plotX, c, "L", b[0].plotX, c)
        }, drawGraph: function () { this.areaPath = []; $.prototype.drawGraph.apply(this); var a = this, b = this.areaPath, c = this.options, d = [["area", this.color, c.fillColor]]; c.negativeColor && d.push(["areaNeg", c.negativeColor, c.negativeFillColor]); n(d, function (d) { var f = d[0], g = a[f]; g ? g.animate({ d: b }) : a[f] = a.chart.renderer.path(b).attr({ fill: p(d[2], wa(d[1]).setOpacity(c.fillOpacity || 0.75).get()), zIndex: 0 }).add(a.group) }) }, drawLegendSymbol: function (a, b) {
            b.legendSymbol = this.chart.renderer.rect(0,
            a.baseline - 11, a.options.symbolWidth, 12, 2).attr({ zIndex: 3 }).add(b.legendGroup)
        }
    }); Q.area = D; S.spline = z(R); Z = ea($, {
        type: "spline", getPointSpline: function (a, b, c) {
            var d = b.plotX, e = b.plotY, f = a[c - 1], g = a[c + 1], h, i, j, k; if (f && g) { a = f.plotY; j = g.plotX; var g = g.plotY, m; h = (1.5 * d + f.plotX) / 2.5; i = (1.5 * e + a) / 2.5; j = (1.5 * d + j) / 2.5; k = (1.5 * e + g) / 2.5; m = (k - i) * (j - d) / (j - h) + e - k; i += m; k += m; i > a && i > e ? (i = t(a, e), k = 2 * e - i) : i < a && i < e && (i = A(a, e), k = 2 * e - i); k > g && k > e ? (k = t(g, e), i = 2 * e - k) : k < g && k < e && (k = A(g, e), i = 2 * e - k); b.rightContX = j; b.rightContY = k } c ?
            (b = ["C", f.rightContX || f.plotX, f.rightContY || f.plotY, h || d, i || e, d, e], f.rightContX = f.rightContY = null) : b = ["M", d, e]; return b
        }
    }); Q.spline = Z; S.areaspline = z(S.area); var Va = D.prototype; Z = ea(Z, { type: "areaspline", closedStacks: !0, getSegmentPath: Va.getSegmentPath, closeSegment: Va.closeSegment, drawGraph: Va.drawGraph }); Q.areaspline = Z; S.column = z(R, {
        borderColor: "#FFFFFF", borderWidth: 1, borderRadius: 0, groupPadding: 0.2, marker: null, pointPadding: 0.1, minPointLength: 0, cropThreshold: 50, pointRange: null, states: {
            hover: {
                brightness: 0.1,
                shadow: !1
            }, select: { color: "#C0C0C0", borderColor: "#000000", shadow: !1 }
        }, dataLabels: { align: null, verticalAlign: null, y: null }, stickyTracking: !1, threshold: 0
    }); Z = ea($, {
        type: "column", tooltipOutsidePlot: !0, requireSorting: !1, pointAttrToOptions: { stroke: "borderColor", "stroke-width": "borderWidth", fill: "color", r: "borderRadius" }, trackerGroups: ["group", "dataLabelsGroup"], init: function () { $.prototype.init.apply(this, arguments); var a = this, b = a.chart; b.hasRendered && n(b.series, function (b) { if (b.type === a.type) b.isDirty = !0 }) },
        getColumnMetrics: function () {
            var a = this, b = a.chart, c = a.options, d = this.xAxis, e = d.reversed, f, g = {}, h, i = 0; c.grouping === !1 ? i = 1 : n(b.series, function (b) { var c = b.options; if (b.type === a.type && b.visible && a.options.group === c.group) c.stacking ? (f = b.stackKey, g[f] === w && (g[f] = i++), h = g[f]) : c.grouping !== !1 && (h = i++), b.columnIndex = h }); var b = A(U(d.transA) * (d.ordinalSlope || c.pointRange || d.closestPointRange || 1), d.len), d = b * c.groupPadding, j = (b - 2 * d) / i, k = c.pointWidth, c = v(k) ? (j - k) / 2 : j * c.pointPadding, k = p(k, j - 2 * c); return a.columnMetrics =
            { width: k, offset: c + (d + ((e ? i - (a.columnIndex || 0) : a.columnIndex) || 0) * j - b / 2) * (e ? -1 : 1) }
        }, translate: function () {
            var a = this, b = a.chart, c = a.options, d = c.stacking, e = c.borderWidth, f = a.yAxis, g = a.translatedThreshold = f.getThreshold(c.threshold), h = p(c.minPointLength, 5), c = a.getColumnMetrics(), i = c.width, j = pa(t(i, 1 + 2 * e)), k = c.offset; $.prototype.translate.apply(a); n(a.points, function (c) {
                var l = A(t(-999, c.plotY), f.len + 999), o = p(c.yBottom, g), q = c.plotX + k, n = pa(A(l, o)), l = pa(t(l, o) - n), u = f.stacks[(c.y < 0 ? "-" : "") + a.stackKey]; d && a.visible &&
                u && u[c.x] && u[c.x].setOffset(k, j); U(l) < h && h && (l = h, n = U(n - g) > h ? o - h : g - (f.translate(c.y, 0, 1, 0, 1) <= g ? h : 0)); c.barX = q; c.pointWidth = i; c.shapeType = "rect"; c.shapeArgs = c = b.renderer.Element.prototype.crisp.call(0, e, q, n, j, l); e % 2 && (c.y -= 1, c.height += 1)
            })
        }, getSymbol: qa, drawLegendSymbol: D.prototype.drawLegendSymbol, drawGraph: qa, drawPoints: function () {
            var a = this, b = a.options, c = a.chart.renderer, d; n(a.points, function (e) {
                var f = e.plotY, g = e.graphic; if (f !== w && !isNaN(f) && e.y !== null) d = e.shapeArgs, g ? (hb(g), g.animate(z(d))) : e.graphic =
                c[e.shapeType](d).attr(e.pointAttr[e.selected ? "select" : ""]).add(a.group).shadow(b.shadow, null, b.stacking && !b.borderRadius); else if (g) e.graphic = g.destroy()
            })
        }, drawTracker: function () {
            var a = this, b = a.chart.pointer, c = a.options.cursor, d = c && { cursor: c }, e = function (b) { var c = b.target, d; for (a.onMouseOver() ; c && !d;) d = c.point, c = c.parentNode; if (d !== w) d.onMouseOver(b) }; n(a.points, function (a) { if (a.graphic) a.graphic.element.point = a; if (a.dataLabel) a.dataLabel.element.point = a }); a._hasTracking ? a._hasTracking = !0 : n(a.trackerGroups,
            function (c) { if (a[c] && (a[c].addClass("highcharts-tracker").on("mouseover", e).on("mouseout", function (a) { b.onTrackerMouseOut(a) }).css(d), gb)) a[c].on("touchstart", e) })
        }, alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart, g = f.inverted, h = a.dlBox || a.shapeArgs, i = a.below || a.plotY > p(this.translatedThreshold, f.plotSizeY), j = p(c.inside, !!this.options.stacking); if (h && (d = z(h), g && (d = { x: f.plotWidth - d.y - d.height, y: f.plotHeight - d.x - d.width, width: d.height, height: d.width }), !j)) g ? (d.x += i ? 0 : d.width, d.width = 0) : (d.y += i ? d.height :
            0, d.height = 0); c.align = p(c.align, !g || j ? "center" : i ? "right" : "left"); c.verticalAlign = p(c.verticalAlign, g || j ? "middle" : i ? "top" : "bottom"); $.prototype.alignDataLabel.call(this, a, b, c, d, e)
        }, animate: function (a) { var b = this.yAxis, c = this.options, d = this.chart.inverted, e = {}; if (ca) a ? (e.scaleY = 0.001, a = A(b.pos + b.len, t(b.pos, b.toPixels(c.threshold))), d ? e.translateX = a - b.len : e.translateY = a, this.group.attr(e)) : (e.scaleY = 1, e[d ? "translateX" : "translateY"] = b.pos, this.group.animate(e, this.options.animation), this.animate = null) },
        remove: function () { var a = this, b = a.chart; b.hasRendered && n(b.series, function (b) { if (b.type === a.type) b.isDirty = !0 }); $.prototype.remove.apply(a, arguments) }
    }); Q.column = Z; S.bar = z(S.column); Va = ea(Z, { type: "bar", inverted: !0 }); Q.bar = Va; S.scatter = z(R, { lineWidth: 0, tooltip: { headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>', pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>", followPointer: !0 }, stickyTracking: !1 }); Va = ea($, {
        type: "scatter", sorted: !1, requireSorting: !1,
        noSharedTooltip: !0, trackerGroups: ["markerGroup"], drawTracker: Z.prototype.drawTracker, setTooltipPoints: qa
    }); Q.scatter = Va; S.pie = z(R, { borderColor: "#FFFFFF", borderWidth: 1, center: [null, null], clip: !1, colorByPoint: !0, dataLabels: { distance: 30, enabled: !0, formatter: function () { return this.point.name } }, ignoreHiddenPoint: !0, legendType: "point", marker: null, size: null, showInLegend: !1, slicedOffset: 10, states: { hover: { brightness: 0.1, shadow: !1 } }, stickyTracking: !1, tooltip: { followPointer: !0 } }); R = {
        type: "pie", isCartesian: !1,
        pointClass: ea(Ha, {
            init: function () { Ha.prototype.init.apply(this, arguments); var a = this, b; if (a.y < 0) a.y = null; y(a, { visible: a.visible !== !1, name: p(a.name, "Slice") }); b = function () { a.slice() }; F(a, "select", b); F(a, "unselect", b); return a }, setVisible: function (a) {
                var b = this, c = b.series, d = c.chart, e; b.visible = b.options.visible = a = a === w ? !b.visible : a; c.options.data[va(b, c.data)] = b.options; e = a ? "show" : "hide"; n(["graphic", "dataLabel", "connector", "shadowGroup"], function (a) { if (b[a]) b[a][e]() }); b.legendItem && d.legend.colorizeItem(b,
                a); if (!c.isDirty && c.options.ignoreHiddenPoint) c.isDirty = !0, d.redraw()
            }, slice: function (a, b, c) { var d = this.series; $a(c, d.chart); p(b, !0); this.sliced = this.options.sliced = a = v(a) ? a : !this.sliced; d.options.data[va(this, d.data)] = this.options; a = a ? this.slicedTranslation : { translateX: 0, translateY: 0 }; this.graphic.animate(a); this.shadowGroup && this.shadowGroup.animate(a) }
        }), requireSorting: !1, noSharedTooltip: !0, trackerGroups: ["group", "dataLabelsGroup"], pointAttrToOptions: {
            stroke: "borderColor", "stroke-width": "borderWidth",
            fill: "color"
        }, getColor: qa, animate: function (a) { var b = this, c = b.points, d = b.startAngleRad; if (!a) n(c, function (a) { var c = a.graphic, a = a.shapeArgs; c && (c.attr({ r: b.center[3] / 2, start: d, end: d }), c.animate({ r: a.r, start: a.start, end: a.end }, b.options.animation)) }), b.animate = null }, setData: function (a, b) { $.prototype.setData.call(this, a, !1); this.processData(); this.generatePoints(); p(b, !0) && this.chart.redraw() }, getCenter: function () {
            var a = this.options, b = this.chart, c = 2 * (a.slicedOffset || 0), d, e = b.plotWidth - 2 * c, f = b.plotHeight -
            2 * c, b = a.center, a = [p(b[0], "50%"), p(b[1], "50%"), a.size || "100%", a.innerSize || 0], g = A(e, f), h; return Fa(a, function (a, b) { h = /%$/.test(a); d = b < 2 || b === 2 && h; return (h ? [e, f, g, g][b] * C(a) / 100 : a) + (d ? c : 0) })
        }, translate: function (a) {
            this.generatePoints(); var b = 0, c = 0, d = this.options, e = d.slicedOffset, f = e + d.borderWidth, g, h, i, j = this.startAngleRad = bb / 180 * ((d.startAngle || 0) % 360 - 90), k = this.points, m = 2 * bb, l = d.dataLabels.distance, o = d.ignoreHiddenPoint, q, n = k.length, p; if (!a) this.center = a = this.getCenter(); this.getX = function (b, c) {
                i =
                P.asin((b - a[1]) / (a[2] / 2 + l)); return a[0] + (c ? -1 : 1) * ha(i) * (a[2] / 2 + l)
            }; for (q = 0; q < n; q++) p = k[q], b += o && !p.visible ? 0 : p.y; for (q = 0; q < n; q++) {
                p = k[q]; d = b ? p.y / b : 0; g = r((j + c * m) * 1E3) / 1E3; if (!o || p.visible) c += d; h = r((j + c * m) * 1E3) / 1E3; p.shapeType = "arc"; p.shapeArgs = { x: a[0], y: a[1], r: a[2] / 2, innerR: a[3] / 2, start: g, end: h }; i = (h + g) / 2; i > 0.75 * m && (i -= 2 * bb); p.slicedTranslation = { translateX: r(ha(i) * e), translateY: r(ka(i) * e) }; g = ha(i) * a[2] / 2; h = ka(i) * a[2] / 2; p.tooltipPos = [a[0] + g * 0.7, a[1] + h * 0.7]; p.half = i < m / 4 ? 0 : 1; p.angle = i; f = A(f, l / 2); p.labelPos =
                [a[0] + g + ha(i) * l, a[1] + h + ka(i) * l, a[0] + g + ha(i) * f, a[1] + h + ka(i) * f, a[0] + g, a[1] + h, l < 0 ? "center" : p.half ? "right" : "left", i]; p.percentage = d * 100; p.total = b
            } this.setTooltipPoints()
        }, drawGraph: null, drawPoints: function () {
            var a = this, b = a.chart.renderer, c, d, e = a.options.shadow, f, g; if (e && !a.shadowGroup) a.shadowGroup = b.g("shadow").add(a.group); n(a.points, function (h) {
                d = h.graphic; g = h.shapeArgs; f = h.shadowGroup; if (e && !f) f = h.shadowGroup = b.g("shadow").add(a.shadowGroup); c = h.sliced ? h.slicedTranslation : { translateX: 0, translateY: 0 };
                f && f.attr(c); d ? d.animate(y(g, c)) : h.graphic = d = b.arc(g).setRadialReference(a.center).attr(h.pointAttr[h.selected ? "select" : ""]).attr({ "stroke-linejoin": "round" }).attr(c).add(a.group).shadow(e, f); h.visible === !1 && h.setVisible(!1)
            })
        }, drawDataLabels: function () {
            var a = this, b = a.data, c, d = a.chart, e = a.options.dataLabels, f = p(e.connectorPadding, 10), g = p(e.connectorWidth, 1), h = d.plotWidth, d = d.plotHeight, i, j, k = p(e.softConnector, !0), m = e.distance, l = a.center, o = l[2] / 2, q = l[1], v = m > 0, u, s, x, w, z = [[], []], E, B, y, A, J, C = [0, 0, 0, 0],
            db = function (a, b) { return b.y - a.y }, F = function (a, b) { a.sort(function (a, c) { return a.angle !== void 0 && (c.angle - a.angle) * b }) }; if (e.enabled || a._hasPointLabels) {
                $.prototype.drawDataLabels.apply(a); n(b, function (a) { a.dataLabel && z[a.half].push(a) }); for (A = 0; !w && b[A];) w = b[A] && b[A].dataLabel && (b[A].dataLabel.getBBox().height || 21), A++; for (A = 2; A--;) {
                    var b = [], G = [], I = z[A], H = I.length, D; F(I, A - 0.5); if (m > 0) {
                        for (J = q - o - m; J <= q + o + m; J += w) b.push(J); s = b.length; if (H > s) {
                            c = [].concat(I); c.sort(db); for (J = H; J--;) c[J].rank = J; for (J = H; J--;) I[J].rank >=
                            s && I.splice(J, 1); H = I.length
                        } for (J = 0; J < H; J++) { c = I[J]; x = c.labelPos; c = 9999; var K, L; for (L = 0; L < s; L++) K = U(b[L] - x[1]), K < c && (c = K, D = L); if (D < J && b[J] !== null) D = J; else for (s < H - J + D && b[J] !== null && (D = s - H + J) ; b[D] === null;) D++; G.push({ i: D, y: b[D] }); b[D] = null } G.sort(db)
                    } for (J = 0; J < H; J++) {
                        c = I[J]; x = c.labelPos; u = c.dataLabel; y = c.visible === !1 ? "hidden" : "visible"; c = x[1]; if (m > 0) { if (s = G.pop(), D = s.i, B = s.y, c > B && b[D + 1] !== null || c < B && b[D - 1] !== null) B = c } else B = c; E = e.justify ? l[0] + (A ? -1 : 1) * (o + m) : a.getX(D === 0 || D === b.length - 1 ? c : B, A); u._attr =
                        { visibility: y, align: x[6] }; u._pos = { x: E + e.x + ({ left: f, right: -f }[x[6]] || 0), y: B + e.y - 10 }; u.connX = E; u.connY = B; if (this.options.size === null) s = u.width, E - s < f ? C[3] = t(r(s - E + f), C[3]) : E + s > h - f && (C[1] = t(r(E + s - h + f), C[1])), B - w / 2 < 0 ? C[0] = t(r(-B + w / 2), C[0]) : B + w / 2 > d && (C[2] = t(r(B + w / 2 - d), C[2]))
                    }
                } if (ua(C) === 0 || this.verifyDataLabelOverflow(C)) this.placeDataLabels(), v && g && n(this.points, function (b) {
                    i = b.connector; x = b.labelPos; if ((u = b.dataLabel) && u._pos) y = u._attr.visibility, E = u.connX, B = u.connY, j = k ? ["M", E + (x[6] === "left" ? 5 : -5), B,
                    "C", E, B, 2 * x[2] - x[4], 2 * x[3] - x[5], x[2], x[3], "L", x[4], x[5]] : ["M", E + (x[6] === "left" ? 5 : -5), B, "L", x[2], x[3], "L", x[4], x[5]], i ? (i.animate({ d: j }), i.attr("visibility", y)) : b.connector = i = a.chart.renderer.path(j).attr({ "stroke-width": g, stroke: e.connectorColor || b.color || "#606060", visibility: y }).add(a.group); else if (i) b.connector = i.destroy()
                })
            }
        }, verifyDataLabelOverflow: function (a) {
            var b = this.center, c = this.options, d = c.center, e = c = c.minSize || 80, f; d[0] !== null ? e = t(b[2] - t(a[1], a[3]), c) : (e = t(b[2] - a[1] - a[3], c), b[0] += (a[3] -
            a[1]) / 2); d[1] !== null ? e = t(A(e, b[2] - t(a[0], a[2])), c) : (e = t(A(e, b[2] - a[0] - a[2]), c), b[1] += (a[0] - a[2]) / 2); e < b[2] ? (b[2] = e, this.translate(b), n(this.points, function (a) { if (a.dataLabel) a.dataLabel._pos = null }), this.drawDataLabels()) : f = !0; return f
        }, placeDataLabels: function () { n(this.points, function (a) { var a = a.dataLabel, b; if (a) (b = a._pos) ? (a.attr(a._attr), a[a.moved ? "animate" : "attr"](b), a.moved = !0) : a && a.attr({ y: -999 }) }) }, alignDataLabel: qa, drawTracker: Z.prototype.drawTracker, drawLegendSymbol: D.prototype.drawLegendSymbol,
        getSymbol: qa
    }; R = ea($, R); Q.pie = R; var V = $.prototype, fc = V.processData, gc = V.generatePoints, hc = V.destroy, ic = V.tooltipHeaderFormatter, jc = {
        approximation: "average", groupPixelWidth: 2, dateTimeLabelFormats: jb(kb, ["%A, %b %e, %H:%M:%S.%L", "%A, %b %e, %H:%M:%S.%L", "-%H:%M:%S.%L"], eb, ["%A, %b %e, %H:%M:%S", "%A, %b %e, %H:%M:%S", "-%H:%M:%S"], Ya, ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"], za, ["%A, %b %e, %H:%M", "%A, %b %e, %H:%M", "-%H:%M"], ga, ["%A, %b %e, %Y", "%A, %b %e", "-%A, %b %e, %Y"], Ma, ["Week from %A, %b %e, %Y",
        "%A, %b %e", "-%A, %b %e, %Y"], Na, ["%B %Y", "%B", "-%B %Y"], ta, ["%Y", "%Y", "-%Y"])
    }, ac = { line: {}, spline: {}, area: {}, areaspline: {}, column: { approximation: "sum", groupPixelWidth: 10 }, arearange: { approximation: "range" }, areasplinerange: { approximation: "range" }, columnrange: { approximation: "range", groupPixelWidth: 10 }, candlestick: { approximation: "ohlc", groupPixelWidth: 10 }, ohlc: { approximation: "ohlc", groupPixelWidth: 5 } }, bc = [[kb, [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], [eb, [1, 2, 5, 10, 15, 30]], [Ya, [1, 2, 5, 10, 15, 30]], [za, [1, 2, 3, 4, 6,
    8, 12]], [ga, [1]], [Ma, [1]], [Na, [1, 3, 6]], [ta, null]], Ia = {
        sum: function (a) { var b = a.length, c; if (!b && a.hasNulls) c = null; else if (b) for (c = 0; b--;) c += a[b]; return c }, average: function (a) { var b = a.length, a = Ia.sum(a); typeof a === "number" && b && (a /= b); return a }, open: function (a) { return a.length ? a[0] : a.hasNulls ? null : w }, high: function (a) { return a.length ? ua(a) : a.hasNulls ? null : w }, low: function (a) { return a.length ? Pa(a) : a.hasNulls ? null : w }, close: function (a) { return a.length ? a[a.length - 1] : a.hasNulls ? null : w }, ohlc: function (a, b, c, d) {
            a =
            Ia.open(a); b = Ia.high(b); c = Ia.low(c); d = Ia.close(d); if (typeof a === "number" || typeof b === "number" || typeof c === "number" || typeof d === "number") return [a, b, c, d]
        }, range: function (a, b) { a = Ia.low(a); b = Ia.high(b); if (typeof a === "number" || typeof b === "number") return [a, b] }
    }; V.groupData = function (a, b, c, d) {
        var e = this.data, f = this.options.data, g = [], h = [], i = a.length, j, k, m = !!b, l = [[], [], [], []], d = typeof d === "function" ? d : Ia[d], o = this.pointArrayMap, q = o && o.length, n; for (n = 0; n <= i; n++) {
            for (; c[1] !== w && a[n] >= c[1] || n === i;) if (j = c.shift(),
            k = d.apply(0, l), k !== w && (g.push(j), h.push(k)), l[0] = [], l[1] = [], l[2] = [], l[3] = [], n === i) break; if (n === i) break; if (o) { j = this.cropStart + n; j = e && e[j] || this.pointClass.prototype.applyOptions.apply({ series: this }, [f[j]]); var p; for (k = 0; k < q; k++) if (p = j[o[k]], typeof p === "number") l[k].push(p); else if (p === null) l[k].hasNulls = !0 } else if (j = m ? b[n] : null, typeof j === "number") l[0].push(j); else if (j === null) l[0].hasNulls = !0
        } return [g, h]
    }; V.processData = function () {
        var a = this.chart, b = this.options, c = b.dataGrouping, d = c && p(c.enabled,
        a.options._stock), e; this.forceCrop = d; if (fc.apply(this, arguments) !== !1 && d) {
            this.destroyGroupedData(); var d = this.processedXData, f = this.processedYData, g = a.plotSizeX, h = this.xAxis, i = p(h.groupPixelWidth, c.groupPixelWidth), j = d.length, k = a.series, m = this.pointRange; if (!h.groupPixelWidth) { for (a = k.length; a--;) k[a].xAxis === h && k[a].options.dataGrouping && (i = t(i, k[a].options.dataGrouping.groupPixelWidth)); h.groupPixelWidth = i } if (j > g / i || j && c.forced) {
                e = !0; this.points = null; a = h.getExtremes(); j = a.min; k = a.max; a = h.getGroupIntervalFactor &&
                h.getGroupIntervalFactor(j, k, d) || 1; g = i * (k - j) / g * a; h = (h.getNonLinearTimeTicks || fb)(zb(g, c.units || bc), j, k, null, d, this.closestPointRange); f = V.groupData.apply(this, [d, f, h, c.approximation]); d = f[0]; f = f[1]; if (c.smoothed) { a = d.length - 1; for (d[a] = k; a-- && a > 0;) d[a] += g / 2; d[0] = j } this.currentDataGrouping = h.info; if (b.pointRange === null) this.pointRange = h.info.totalRange; this.closestPointRange = h.info.totalRange; this.processedXData = d; this.processedYData = f
            } else this.currentDataGrouping = null, this.pointRange = m; this.hasGroupedData =
            e
        }
    }; V.destroyGroupedData = function () { var a = this.groupedData; n(a || [], function (b, c) { b && (a[c] = b.destroy ? b.destroy() : null) }); this.groupedData = null }; V.generatePoints = function () { gc.apply(this); this.destroyGroupedData(); this.groupedData = this.hasGroupedData ? this.points : null }; V.tooltipHeaderFormatter = function (a) {
        var b = this.tooltipOptions, c = this.options.dataGrouping, d = b.xDateFormat, e, f = this.xAxis, g, h; if (f && f.options.type === "datetime" && c && Ja(a.key)) {
            g = this.currentDataGrouping; c = c.dateTimeLabelFormats; if (g) f =
            c[g.unitName], g.count === 1 ? d = f[0] : (d = f[1], e = f[2]); else if (!d && c) for (h in I) if (I[h] >= f.closestPointRange) { d = c[h][0]; break } d = ya(d, a.key); e && (d += ya(e, a.key + g.totalRange - 1)); a = b.headerFormat.replace("{point.key}", d)
        } else a = ic.call(this, a); return a
    }; V.destroy = function () { for (var a = this.groupedData || [], b = a.length; b--;) a[b] && a[b].destroy(); hc.apply(this) }; sa(V, "setOptions", function (a, b) {
        var c = a.call(this, b), d = this.type, e = this.chart.options.plotOptions, f = S[d].dataGrouping; if (ac[d]) f || (f = z(jc, ac[d])), c.dataGrouping =
        z(f, e.series && e.series.dataGrouping, e[d].dataGrouping, b.dataGrouping); if (this.chart.options._stock) this.requireSorting = !0; return c
    }); S.ohlc = z(S.column, { lineWidth: 1, tooltip: { pointFormat: '<span style="color:{series.color};font-weight:bold">{series.name}</span><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>' }, states: { hover: { lineWidth: 3 } }, threshold: null }); R = ea(Q.column, {
        type: "ohlc", pointArrayMap: ["open", "high", "low", "close"], toYData: function (a) {
            return [a.open,
            a.high, a.low, a.close]
        }, pointValKey: "high", pointAttrToOptions: { stroke: "color", "stroke-width": "lineWidth" }, upColorProp: "stroke", getAttribs: function () { Q.column.prototype.getAttribs.apply(this, arguments); var a = this.options, b = a.states, a = a.upColor || this.color, c = z(this.pointAttr), d = this.upColorProp; c[""][d] = a; c.hover[d] = b.hover.upColor || a; c.select[d] = b.select.upColor || a; n(this.points, function (a) { if (a.open < a.close) a.pointAttr = c }) }, translate: function () {
            var a = this.yAxis; Q.column.prototype.translate.apply(this);
            n(this.points, function (b) { if (b.open !== null) b.plotOpen = a.translate(b.open, 0, 1, 0, 1); if (b.close !== null) b.plotClose = a.translate(b.close, 0, 1, 0, 1) })
        }, drawPoints: function () {
            var a = this, b = a.chart, c, d, e, f, g, h, i, j; n(a.points, function (k) {
                if (k.plotY !== w) i = k.graphic, c = k.pointAttr[k.selected ? "selected" : ""], f = c["stroke-width"] % 2 / 2, j = r(k.plotX) + f, g = r(k.shapeArgs.width / 2), h = ["M", j, r(k.yBottom), "L", j, r(k.plotY)], k.open !== null && (d = r(k.plotOpen) + f, h.push("M", j, d, "L", j - g, d)), k.close !== null && (e = r(k.plotClose) + f, h.push("M",
                j, e, "L", j + g, e)), i ? i.animate({ d: h }) : k.graphic = b.renderer.path(h).attr(c).add(a.group)
            })
        }, animate: null
    }); Q.ohlc = R; S.candlestick = z(S.column, { lineColor: "black", lineWidth: 1, states: { hover: { lineWidth: 2 } }, tooltip: S.ohlc.tooltip, threshold: null, upColor: "white" }); R = ea(R, {
        type: "candlestick", pointAttrToOptions: { fill: "color", stroke: "lineColor", "stroke-width": "lineWidth" }, upColorProp: "fill", drawPoints: function () {
            var a = this, b = a.chart, c, d, e, f, g, h, i, j, k, m; n(a.points, function (l) {
                j = l.graphic; if (l.plotY !== w) c = l.pointAttr[l.selected ?
                "selected" : ""], h = c["stroke-width"] % 2 / 2, i = r(l.plotX) + h, d = r(l.plotOpen) + h, e = r(l.plotClose) + h, f = P.min(d, e), g = P.max(d, e), m = r(l.shapeArgs.width / 2), k = ["M", i - m, g, "L", i - m, f, "L", i + m, f, "L", i + m, g, "L", i - m, g, "M", i, g, "L", i, r(l.yBottom), "M", i, f, "L", i, r(l.plotY), "Z"], j ? j.animate({ d: k }) : l.graphic = b.renderer.path(k).attr(c).add(a.group)
            })
        }
    }); Q.candlestick = R; var xb = Ga.prototype.symbols; S.flags = z(S.column, {
        dataGrouping: null, fillColor: "white", lineWidth: 1, pointRange: 0, shape: "flag", stackDistance: 7, states: {
            hover: {
                lineColor: "black",
                fillColor: "#FCFFC5"
            }
        }, style: { fontSize: "11px", fontWeight: "bold", textAlign: "center" }, tooltip: { pointFormat: "{point.text}<br/>" }, threshold: null, y: -30
    }); Q.flags = ea(Q.column, {
        type: "flags", sorted: !1, noSharedTooltip: !0, takeOrdinalPosition: !1, forceCrop: !0, init: $.prototype.init, pointAttrToOptions: { fill: "fillColor", stroke: "color", "stroke-width": "lineWidth", r: "radius" }, translate: function () {
            Q.column.prototype.translate.apply(this); var a = this.chart, b = this.points, c = b.length - 1, d, e, f = this.options.onSeries, f = (d = f &&
            a.get(f)) && d.options.step, g = d && d.points, h = g && g.length, i = this.xAxis, j = i.getExtremes(), k, m, l; if (d && d.visible && h) { m = g[h - 1].x; for (b.sort(function (a, b) { return a.x - b.x }) ; h-- && b[c];) if (d = b[c], k = g[h], k.x <= d.x && k.plotY !== w) { if (d.x <= m) d.plotY = k.plotY, k.x < d.x && !f && (l = g[h + 1]) && l.plotY !== w && (d.plotY += (d.x - k.x) / (l.x - k.x) * (l.plotY - k.plotY)); c--; h++; if (c < 0) break } } n(b, function (c, d) {
                if (c.plotY === w) c.x >= j.min && c.x <= j.max ? c.plotY = i.lineTop - a.plotTop : c.shapeArgs = {}; if ((e = b[d - 1]) && e.plotX === c.plotX) {
                    if (e.stackIndex ===
                    w) e.stackIndex = 0; c.stackIndex = e.stackIndex + 1
                }
            })
        }, drawPoints: function () {
            var a, b = this.points, c = this.chart.renderer, d, e, f = this.options, g = f.y, h, i, j, k, m, l = f.lineWidth % 2 / 2, o; for (j = b.length; j--;) if (k = b[j], d = k.plotX + l, a = k.stackIndex, h = k.options.shape || f.shape, e = k.plotY, e !== w && (e = k.plotY + g + l - (a !== w && a * f.stackDistance)), i = a ? w : k.plotX + l, o = a ? w : k.plotY, m = k.graphic, e !== w) a = k.pointAttr[k.selected ? "select" : ""], m ? m.attr({ x: d, y: e, r: a.r, anchorX: i, anchorY: o }) : m = k.graphic = c.label(k.options.title || f.title || "A", d, e, h, i,
            o, f.useHTML).css(z(f.style, k.style)).attr(a).attr({ align: h === "flag" ? "left" : "center", width: f.width, height: f.height }).add(this.group).shadow(f.shadow), i = m.box, a = i.getBBox(), k.shapeArgs = y(a, { x: d - (h === "flag" ? 0 : i.attr("width") / 2), y: e }); else if (m) k.graphic = m.destroy()
        }, drawTracker: function () { Q.column.prototype.drawTracker.apply(this); ca && n(this.points, function (a) { a.graphic && F(a.graphic.element, "mouseover", function () { a.graphic.toFront() }) }) }, animate: qa
    }); xb.flag = function (a, b, c, d, e) {
        var f = e && e.anchorX || a,
        e = e && e.anchorY || b; return ["M", f, e, "L", a, b + d, a, b, a + c, b, a + c, b + d, a, b + d, "M", f, e, "Z"]
    }; n(["circle", "square"], function (a) { xb[a + "pin"] = function (b, c, d, e, f) { var g = f && f.anchorX, f = f && f.anchorY, b = xb[a](b, c, d, e); g && f && b.push("M", g, c > f ? c : c + e, "L", g, f); return b } }); cb === ib && n(["flag", "circlepin", "squarepin"], function (a) { ib.prototype.symbols[a] = xb[a] }); R = jb("linearGradient", { x1: 0, y1: 0, x2: 0, y2: 1 }, "stops", [[0, "#FFF"], [1, "#CCC"]]); D = [].concat(bc); D[4] = [ga, [1, 2, 3, 4]]; D[5] = [Ma, [1, 2, 3]]; y(M, {
        navigator: {
            handles: {
                backgroundColor: "#FFF",
                borderColor: "#666"
            }, height: 40, margin: 10, maskFill: "rgba(255, 255, 255, 0.75)", outlineColor: "#444", outlineWidth: 1, series: { type: "areaspline", color: "#4572A7", compare: null, fillOpacity: 0.4, dataGrouping: { approximation: "average", groupPixelWidth: 2, smoothed: !0, units: D }, dataLabels: { enabled: !1, zIndex: 2 }, id: "highcharts-navigator-series", lineColor: "#4572A7", lineWidth: 1, marker: { enabled: !1 }, pointRange: 0, shadow: !1 }, xAxis: { tickWidth: 0, lineWidth: 0, gridLineWidth: 1, tickPixelInterval: 200, labels: { align: "left", x: 3, y: -4 } },
            yAxis: { gridLineWidth: 0, startOnTick: !1, endOnTick: !1, minPadding: 0.1, maxPadding: 0.1, labels: { enabled: !1 }, title: { text: null }, tickWidth: 0 }
        }, scrollbar: {
            height: ub ? 20 : 14, barBackgroundColor: R, barBorderRadius: 2, barBorderWidth: 1, barBorderColor: "#666", buttonArrowColor: "#666", buttonBackgroundColor: R, buttonBorderColor: "#666", buttonBorderRadius: 2, buttonBorderWidth: 1, minWidth: 6, rifleColor: "#666", trackBackgroundColor: jb("linearGradient", { x1: 0, y1: 0, x2: 0, y2: 1 }, "stops", [[0, "#EEE"], [1, "#FFF"]]), trackBorderColor: "#CCC",
            trackBorderWidth: 1, liveRedraw: ca
        }
    }); Ib.prototype = {
        drawHandle: function (a, b) {
            var c = this.chart, d = c.renderer, e = this.elementsToDestroy, f = this.handles, g = this.navigatorOptions.handles, g = { fill: g.backgroundColor, stroke: g.borderColor, "stroke-width": 1 }, h; this.rendered || (f[b] = d.g().css({ cursor: "e-resize" }).attr({ zIndex: 4 - b }).add(), h = d.rect(-4.5, 0, 9, 16, 3, 1).attr(g).add(f[b]), e.push(h), h = d.path(["M", -1.5, 4, "L", -1.5, 12, "M", 0.5, 4, "L", 0.5, 12]).attr(g).add(f[b]), e.push(h)); f[b][c.isResizing ? "animate" : "attr"]({
                translateX: this.scrollerLeft +
                this.scrollbarHeight + parseInt(a, 10), translateY: this.top + this.height / 2 - 8
            })
        }, drawScrollbarButton: function (a) {
            var b = this.chart.renderer, c = this.elementsToDestroy, d = this.scrollbarButtons, e = this.scrollbarHeight, f = this.scrollbarOptions, g; this.rendered || (d[a] = b.g().add(this.scrollbarGroup), g = b.rect(-0.5, -0.5, e + 1, e + 1, f.buttonBorderRadius, f.buttonBorderWidth).attr({ stroke: f.buttonBorderColor, "stroke-width": f.buttonBorderWidth, fill: f.buttonBackgroundColor }).add(d[a]), c.push(g), g = b.path(["M", e / 2 + (a ? -1 : 1), e / 2 -
            3, "L", e / 2 + (a ? -1 : 1), e / 2 + 3, e / 2 + (a ? 2 : -2), e / 2]).attr({ fill: f.buttonArrowColor }).add(d[a]), c.push(g)); a && d[a].attr({ translateX: this.scrollerWidth - e })
        }, render: function (a, b, c, d) {
            var e = this.chart, f = e.renderer, g, h, i, j, k = this.scrollbarGroup, m = this.navigatorGroup, l = this.scrollbar, m = this.xAxis, o = this.scrollbarTrack, n = this.scrollbarHeight, v = this.scrollbarEnabled, u = this.navigatorOptions, s = this.scrollbarOptions, x = s.minWidth, w = this.height, z = this.top, E = this.navigatorEnabled, B = u.outlineWidth, y = B / 2, D = 0, J = this.outlineHeight,
            I = s.barBorderRadius, H = s.barBorderWidth, F = z + y; if (!isNaN(a)) {
                this.navigatorLeft = g = p(m.left, e.plotLeft + n); this.navigatorWidth = h = p(m.len, e.plotWidth - 2 * n); this.scrollerLeft = i = g - n; this.scrollerWidth = j = j = h + 2 * n; if (m.getExtremes) { var G = e.xAxis[0].getExtremes(), L = G.dataMin === null, K = m.getExtremes(), M = A(G.dataMin, K.dataMin), G = t(G.dataMax, K.dataMax); !L && (M !== K.min || G !== K.max) && m.setExtremes(M, G, !0, !1) } c = p(c, m.translate(a)); d = p(d, m.translate(b)); this.zoomedMax = a = A(C(t(c, d)), h); this.zoomedMin = d = this.fixedWidth ?
                a - this.fixedWidth : t(C(A(c, d)), 0); this.range = c = a - d; if (!this.rendered) {
                    if (E) this.navigatorGroup = m = f.g("navigator").attr({ zIndex: 3 }).add(), this.leftShade = f.rect().attr({ fill: u.maskFill }).add(m), this.rightShade = f.rect().attr({ fill: u.maskFill }).add(m), this.outline = f.path().attr({ "stroke-width": B, stroke: u.outlineColor }).add(m); if (v) this.scrollbarGroup = k = f.g("scrollbar").add(), l = s.trackBorderWidth, this.scrollbarTrack = o = f.rect().attr({
                        y: -l % 2 / 2, fill: s.trackBackgroundColor, stroke: s.trackBorderColor, "stroke-width": l,
                        r: s.trackBorderRadius || 0, height: n
                    }).add(k), this.scrollbar = l = f.rect().attr({ y: -H % 2 / 2, height: n, fill: s.barBackgroundColor, stroke: s.barBorderColor, "stroke-width": H, r: I }).add(k), this.scrollbarRifles = f.path().attr({ stroke: s.rifleColor, "stroke-width": 1 }).add(k)
                } e = e.isResizing ? "animate" : "attr"; E && (this.leftShade[e]({ x: g, y: z, width: d, height: w }), this.rightShade[e]({ x: g + a, y: z, width: h - a, height: w }), this.outline[e]({ d: ["M", i, F, "L", g + d + y, F, g + d + y, F + J - n, "M", g + a - y, F + J - n, "L", g + a - y, F, i + j, F] }), this.drawHandle(d + y, 0), this.drawHandle(a +
                y, 1)); if (v) this.drawScrollbarButton(0), this.drawScrollbarButton(1), k[e]({ translateX: i, translateY: r(F + w) }), o[e]({ width: j }), g = n + d, h = c - H, h < x && (D = (x - h) / 2, h = x, g -= D), this.scrollbarPad = D, l[e]({ x: W(g) + H % 2 / 2, width: h }), x = n + d + c / 2 - 0.5, this.scrollbarRifles.attr({ visibility: c > 12 ? "visible" : "hidden" })[e]({ d: ["M", x - 3, n / 4, "L", x - 3, 2 * n / 3, "M", x, n / 4, "L", x, 2 * n / 3, "M", x + 3, n / 4, "L", x + 3, 2 * n / 3] }); this.scrollbarPad = D; this.rendered = !0
            }
        }, addEvents: function () {
            var a = this.chart.container, b = this.mouseDownHandler, c = this.mouseMoveHandler,
            d = this.mouseUpHandler, e; e = [[a, "mousedown", b], [a, "mousemove", c], [document, "mouseup", d]]; gb && e.push([a, "touchstart", b], [a, "touchmove", c], [document, "touchend", d]); n(e, function (a) { F.apply(null, a) }); this._events = e
        }, removeEvents: function () { n(this._events, function (a) { X.apply(null, a) }); this._events = w; this.navigatorEnabled && this.baseSeries && X(this.baseSeries, "updatedData", this.updatedDataHandler) }, init: function () {
            var a = this, b = a.chart, c, d, e = a.scrollbarHeight, f = a.navigatorOptions, g = a.height, h = a.top, i, j, k, m =
            document.body.style, l, o = a.baseSeries, n; a.mouseDownHandler = function (d) {
                var d = b.pointer.normalize(d), e = a.zoomedMin, f = a.zoomedMax, h = a.top, i = a.scrollbarHeight, k = a.scrollerLeft, o = a.scrollerWidth, n = a.navigatorLeft, p = a.navigatorWidth, q = a.scrollbarPad, r = a.range, s = d.chartX, u = d.chartY, d = b.xAxis[0], t = ub ? 10 : 7; if (u > h && u < h + g + i) if ((h = !a.scrollbarEnabled || u < h + g) && P.abs(s - e - n) < t) a.grabbedLeft = !0, a.otherHandlePos = f; else if (h && P.abs(s - f - n) < t) a.grabbedRight = !0, a.otherHandlePos = e; else if (s > n + e - q && s < n + f + q) {
                    a.grabbedCenter =
                    s; a.fixedWidth = r; if (b.renderer.isSVG) l = m.cursor, m.cursor = "ew-resize"; j = s - e
                } else if (s > k && s < k + o && (f = h ? s - n - r / 2 : s < n ? e - A(10, r) : s > k + o - i ? e + A(10, r) : s < n + e ? e - r : f, f < 0 ? f = 0 : f + r > p && (f = p - r), f !== e)) { a.fixedWidth = r; if (!d.ordinalPositions) d.fixedRange = d.max - d.min; e = c.translate(f, !0); d.setExtremes(e, d.fixedRange ? e + d.fixedRange : c.translate(f + r, !0), !0, !1, { trigger: "navigator" }) }
            }; a.mouseMoveHandler = function (c) {
                var d = a.scrollbarHeight, e = a.navigatorLeft, f = a.navigatorWidth, g = a.scrollerLeft, h = a.scrollerWidth, i = a.range, l; if (c.pageX !==
                0) c = b.pointer.normalize(c), l = c.chartX, l < e ? l = e : l > g + h - d && (l = g + h - d), a.grabbedLeft ? (k = !0, a.render(0, 0, l - e, a.otherHandlePos)) : a.grabbedRight ? (k = !0, a.render(0, 0, a.otherHandlePos, l - e)) : a.grabbedCenter && (k = !0, l < j ? l = j : l > f + j - i && (l = f + j - i), a.render(0, 0, l - j, l - j + i)), k && a.scrollbarOptions.liveRedraw && setTimeout(function () { a.mouseUpHandler(c) }, 0)
            }; a.mouseUpHandler = function (d) {
                k && b.xAxis[0].setExtremes(c.translate(a.zoomedMin, !0), c.translate(a.zoomedMax, !0), !0, !1, { trigger: "navigator", DOMEvent: d }); if (d.type !== "mousemove") a.grabbedLeft =
                a.grabbedRight = a.grabbedCenter = a.fixedWidth = k = j = null, m.cursor = l || ""
            }; a.updatedDataHandler = function () { var c = o.xAxis, d = c.getExtremes(), e = d.min, f = d.max, g = d.dataMin, d = d.dataMax, h = f - e, j, k, l, m, p; j = i.xData; var r = !!c.setExtremes; k = f >= j[j.length - 1]; j = e <= g; if (!n) i.options.pointStart = o.xData[0], i.setData(o.options.data, !1), p = !0; j && (m = g, l = m + h); k && (l = d, j || (m = t(l - h, i.xData[0]))); r && (j || k) ? c.setExtremes(m, l, !0, !1, { trigger: "updatedData" }) : (p && b.redraw(!1), a.render(t(e, g), A(f, d))) }; var r = b.xAxis.length, u = b.yAxis.length;
            b.extraBottomMargin = a.outlineHeight + f.margin; if (a.navigatorEnabled) {
                var s = o ? o.options : {}, x = s.data, v = f.series; n = v.data; a.xAxis = c = new Da(b, z({ ordinal: o && o.xAxis.options.ordinal }, f.xAxis, { isX: !0, type: "datetime", index: r, height: g, offset: 0, offsetLeft: e, offsetRight: -e, startOnTick: !1, endOnTick: !1, minPadding: 0, maxPadding: 0, zoomEnabled: !1 })); a.yAxis = d = new Da(b, z(f.yAxis, { alignTicks: !1, height: g, offset: 0, index: u, zoomEnabled: !1 })); r = z(s, v, {
                    threshold: null, clip: !1, enableMouseTracking: !1, group: "nav", padXAxis: !1,
                    xAxis: r, yAxis: u, name: "Navigator", showInLegend: !1, isInternal: !0, visible: !0
                }); r.data = n || x; i = b.initSeries(r); if (o && f.adaptToUpdatedData !== !1) F(o, "updatedData", a.updatedDataHandler), o.userOptions.events = y(o.userOptions.event, { updatedData: a.updatedDataHandler })
            } else a.xAxis = c = { translate: function (a, c) { var d = b.xAxis[0].getExtremes(), f = b.plotWidth - 2 * e, g = d.dataMin, d = d.dataMax - g; return c ? a * d / f + g : f * (a - g) / d } }; a.series = i; sa(b, "getMargins", function (b) {
                var e = this.legend, f = e.options; b.call(this); a.top = h = a.navigatorOptions.top ||
                this.chartHeight - a.height - a.scrollbarHeight - this.options.chart.spacingBottom - (f.verticalAlign === "bottom" && f.enabled && !f.floating ? e.legendHeight + p(f.margin, 10) : 0); if (c && d) c.options.top = d.options.top = h, c.setAxisSize(), d.setAxisSize()
            }); a.addEvents()
        }, destroy: function () {
            this.removeEvents(); n([this.xAxis, this.yAxis, this.leftShade, this.rightShade, this.outline, this.scrollbarTrack, this.scrollbarRifles, this.scrollbarGroup, this.scrollbar], function (a) { a && a.destroy && a.destroy() }); this.xAxis = this.yAxis = this.leftShade =
            this.rightShade = this.outline = this.scrollbarTrack = this.scrollbarRifles = this.scrollbarGroup = this.scrollbar = null; n([this.scrollbarButtons, this.handles, this.elementsToDestroy], function (a) { Aa(a) })
        }
    }; Highcharts.Scroller = Ib; sa(Da.prototype, "zoom", function (a, b, c) {
        var d = this.chart, e = d.options, f = e.chart.zoomType, g = e.navigator, e = e.rangeSelector, h; if (this.isXAxis && (g && g.enabled || e && e.enabled)) if (f === "x") d.resetZoomButton = "blocked"; else if (f === "y") h = !1; else if (f === "xy") d = this.previousZoom, v(b) ? this.previousZoom =
        [this.min, this.max] : d && (b = d[0], c = d[1], delete this.previousZoom); return h !== w ? h : a.call(this, b, c)
    }); sa(Sa.prototype, "init", function (a, b, c) { F(this, "beforeRender", function () { var a = this.options; if (a.navigator.enabled || a.scrollbar.enabled) this.scroller = new Ib(this) }); a.call(this, b, c) }); y(M, { rangeSelector: { buttonTheme: { width: 28, height: 16, padding: 1, r: 0, stroke: "#68A", zIndex: 7 }, inputPosition: { align: "right" }, labelStyle: { color: "#666" } } }); M.lang = z(M.lang, { rangeSelectorZoom: "Zoom", rangeSelectorFrom: "From", rangeSelectorTo: "To" });
    Jb.prototype = {
        clickButton: function (a, b, c) {
            var d = this, e = d.chart, f = d.buttons, g = e.xAxis[0], h = g && g.getExtremes(), i = e.scroller && e.scroller.xAxis, j = i && i.getExtremes && i.getExtremes(), i = j && j.dataMin, j = j && j.dataMax, k = h && h.dataMin, m = h && h.dataMax, l = (v(k) && v(i) ? A : p)(k, i), o = (v(m) && v(j) ? t : p)(m, j), q, h = g && A(h.max, p(o, h.max)), i = new Date(h), j = b.type, k = b.count, r, u, m = { millisecond: 1, second: 1E3, minute: 6E4, hour: 36E5, day: 864E5, week: 6048E5 }; if (!(l === null || o === null || a === d.selected)) {
                if (m[j]) r = m[j] * k, q = t(h - r, l); else if (j ===
                "month" || j === "year") r = { month: "Month", year: "FullYear" }[j], i["set" + r](i["get" + r]() - k), q = t(i.getTime(), p(l, Number.MIN_VALUE)), r = { month: 30, year: 365 }[j] * 864E5 * k; else if (j === "ytd") if (g) { if (o === w) l = Number.MAX_VALUE, o = Number.MIN_VALUE, n(e.series, function (a) { a = a.xData; l = A(a[0], l); o = t(a[a.length - 1], o) }), c = !1; h = new Date(o); u = h.getFullYear(); q = u = t(l || 0, Date.UTC(u, 0, 1)); h = h.getTime(); h = A(o || h, h) } else { F(e, "beforeRender", function () { d.clickButton(a, b) }); return } else j === "all" && g && (q = l, h = o); f[a] && f[a].setState(2);
                g ? g.setExtremes(q, h, p(c, 1), 0, { trigger: "rangeSelectorButton", rangeSelectorButton: b }) : (c = e.options.xAxis, c[0] = z(c[0], { range: r, min: u })); d.selected = a
            }
        }, defaultButtons: [{ type: "month", count: 1, text: "1m" }, { type: "month", count: 3, text: "3m" }, { type: "month", count: 6, text: "6m" }, { type: "ytd", text: "YTD" }, { type: "year", count: 1, text: "1y" }, { type: "all", text: "All" }], init: function (a) {
            var b = this, c = a.options.rangeSelector, d = c.buttons || [].concat(b.defaultButtons), e = b.buttons = [], c = c.selected, f = b.blurInputs = function () {
                var a = b.minInput,
                c = b.maxInput; a && a.blur(); c && c.blur()
            }; b.chart = a; a.extraTopMargin = 25; b.buttonOptions = d; F(a.container, "mousedown", f); F(a, "resize", f); c !== w && d[c] && this.clickButton(c, d[c], !1); F(a, "load", function () { F(a.xAxis[0], "afterSetExtremes", function () { if (this.fixedRange !== this.max - this.min) e[b.selected] && !a.renderer.forExport && e[b.selected].setState(0), b.selected = null; this.fixedRange = null }) })
        }, setInputValue: function (a, b) {
            var c = this.chart.options.rangeSelector; if (b) this[a + "Input"].HCTime = b; this[a + "Input"].value =
            ya(c.inputEditDateFormat || "%Y-%m-%d", this[a + "Input"].HCTime); this[a + "DateBox"].attr({ text: ya(c.inputDateFormat || "%b %e, %Y", this[a + "Input"].HCTime) })
        }, drawInput: function (a) {
            var b = this, c = b.chart, d = c.options.chart.style, e = c.renderer, f = c.options.rangeSelector, g = b.div, h = a === "min", i, j, k, m = this.inputGroup; this[a + "Label"] = j = e.label(M.lang[h ? "rangeSelectorFrom" : "rangeSelectorTo"], this.inputGroup.offset).attr({ padding: 1 }).css(z(d, f.labelStyle)).add(m); m.offset += j.width + 5; this[a + "DateBox"] = k = e.label("", m.offset).attr({
                padding: 1,
                width: 90, height: 16, stroke: "silver", "stroke-width": 1
            }).css(z({ textAlign: "center" }, d, f.inputStyle)).on("click", function () { b[a + "Input"].focus() }).add(m); m.offset += k.width + (h ? 10 : 0); this[a + "Input"] = i = aa("input", { name: a, className: "highcharts-range-selector", type: "text" }, y({ position: "absolute", border: 0, width: "1px", height: "1px", padding: 0, textAlign: "center", fontSize: d.fontSize, fontFamily: d.fontFamily, top: c.plotTop + "px" }, f.inputStyle), g); i.onfocus = function () {
                L(this, {
                    left: m.translateX + k.x + "px", top: m.translateY +
                    "px", width: k.width - 2 + "px", height: k.height - 2 + "px", border: "2px solid silver"
                })
            }; i.onblur = function () { L(this, { border: 0, width: "1px", height: "1px" }); b.setInputValue(a) }; i.onchange = function () {
                var a = i.value, d = Date.parse(a), e = c.xAxis[0].getExtremes(); isNaN(d) && (d = a.split("-"), d = Date.UTC(C(d[0]), C(d[1]) - 1, C(d[2]))); if (!isNaN(d) && (M.global.useUTC || (d += (new Date).getTimezoneOffset() * 6E4), h && d >= e.dataMin && d <= b.maxInput.HCTime || !h && d <= e.dataMax && d >= b.minInput.HCTime)) c.xAxis[0].setExtremes(h ? d : e.min, h ? e.max : d, w,
                w, { trigger: "rangeSelectorInput" })
            }
        }, render: function (a, b) {
            var c = this, d = c.chart, e = d.renderer, f = d.container, g = d.options, h = g.exporting && d.options.navigation.buttonOptions, i = g.rangeSelector, j = c.buttons, k = M.lang, m = c.div, m = c.inputGroup, l = i.buttonTheme, o = i.inputEnabled !== !1, p = l && l.states, r = d.plotLeft, u; if (!c.rendered && (c.zoomText = e.text(k.rangeSelectorZoom, r, d.plotTop - 10).css(i.labelStyle).add(), u = r + c.zoomText.getBBox().width + 5, n(c.buttonOptions, function (a, b) {
            j[b] = e.button(a.text, u, d.plotTop - 25, function () {
            c.clickButton(b,
            a); c.isActive = !0
            }, l, p && p.hover, p && p.select).css({ textAlign: "center" }).add(); u += j[b].width + (i.buttonSpacing || 0); c.selected === b && j[b].setState(2)
            }), o)) c.div = m = aa("div", null, { position: "relative", height: 0, zIndex: 1 }), f.parentNode.insertBefore(m, f), c.inputGroup = m = e.g("input-group").add(), m.offset = 0, c.drawInput("min"), c.drawInput("max"); o && (f = d.plotTop - 35, m.align(y({ y: f, width: m.offset, x: h && f < (h.y || 0) + h.height - g.chart.spacingTop ? -40 : 0 }, i.inputPosition), !0, d.spacingBox), c.setInputValue("min", a), c.setInputValue("max",
            b)); c.rendered = !0
        }, destroy: function () { var a = this.minInput, b = this.maxInput, c = this.chart, d = this.blurInputs, e; X(c.container, "mousedown", d); X(c, "resize", d); Aa(this.buttons); if (a) a.onfocus = a.onblur = a.onchange = null; if (b) b.onfocus = b.onblur = b.onchange = null; for (e in this) this[e] && e !== "chart" && (this[e].destroy ? this[e].destroy() : this[e].nodeType && Za(this[e])), this[e] = null }
    }; sa(Sa.prototype, "init", function (a, b, c) {
        F(this, "init", function () { if (this.options.rangeSelector.enabled) this.rangeSelector = new Jb(this) });
        a.call(this, b, c)
    }); Highcharts.RangeSelector = Jb; Sa.prototype.callbacks.push(function (a) {
        function b() { f = a.xAxis[0].getExtremes(); g.render(t(f.min, f.dataMin), A(f.max, p(f.dataMax, Number.MAX_VALUE))) } function c() { f = a.xAxis[0].getExtremes(); h.render(f.min, f.max) } function d(a) { g.render(a.min, a.max) } function e(a) { h.render(a.min, a.max) } var f, g = a.scroller, h = a.rangeSelector; g && (F(a.xAxis[0], "afterSetExtremes", d), sa(a, "drawChartBox", function (a) { var c = this.isDirtyBox; a.call(this); c && b() }), b()); h && (F(a.xAxis[0],
        "afterSetExtremes", e), F(a, "resize", c), c()); F(a, "destroy", function () { g && X(a.xAxis[0], "afterSetExtremes", d); h && (X(a, "resize", c), X(a.xAxis[0], "afterSetExtremes", e)) })
    }); Highcharts.StockChart = function (a, b) {
        var c = a.series, d, e = { marker: { enabled: !1, states: { hover: { radius: 5 } } }, states: { hover: { lineWidth: 2 } } }, f = { shadow: !1, borderWidth: 0 }; a.xAxis = Fa(ja(a.xAxis || {}), function (a) { return z({ minPadding: 0, maxPadding: 0, ordinal: !0, title: { text: null }, labels: { overflow: "justify" }, showLastLabel: !0 }, a, { type: "datetime", categories: null }) });
        a.yAxis = Fa(ja(a.yAxis || {}), function (a) { d = a.opposite; return z({ labels: { align: d ? "right" : "left", x: d ? -2 : 2, y: -2 }, showLastLabel: !1, title: { text: null } }, a) }); a.series = null; a = z({ chart: { panning: !0, pinchType: "x" }, navigator: { enabled: !0 }, scrollbar: { enabled: !0 }, rangeSelector: { enabled: !0 }, title: { text: null }, tooltip: { shared: !0, crosshairs: !0 }, legend: { enabled: !1 }, plotOptions: { line: e, spline: e, area: e, areaspline: e, arearange: e, areasplinerange: e, column: f, columnrange: f, candlestick: f, ohlc: f } }, a, { _stock: !0, chart: { inverted: !1 } });
        a.series = c; return new Sa(a, b)
    }; sa(pb.prototype, "init", function (a, b, c) { var d = c.chart.pinchType || ""; a.call(this, b, c); this.pinchX = this.pinchHor = d.indexOf("x") !== -1; this.pinchY = this.pinchVert = d.indexOf("y") !== -1 }); var kc = V.init, lc = V.processData, mc = Ha.prototype.tooltipFormatter; V.init = function () { kc.apply(this, arguments); this.setCompare(this.options.compare) }; V.setCompare = function (a) {
        this.modifyValue = a === "value" || a === "percent" ? function (b, c) {
            var d = this.compareValue, b = a === "value" ? b - d : b = 100 * (b / d) - 100; if (c) c.change =
            b; return b
        } : null; if (this.chart.hasRendered) this.isDirty = !0
    }; V.processData = function () { lc.apply(this, arguments); if (this.options.compare) for (var a = 0, b = this.processedXData, c = this.processedYData, d = c.length, e = this.xAxis.getExtremes().min; a < d; a++) if (typeof c[a] === "number" && b[a] >= e) { this.compareValue = c[a]; break } }; Da.prototype.setCompare = function (a, b) { this.isXAxis || (n(this.series, function (b) { b.setCompare(a) }), p(b, !0) && this.chart.redraw()) }; Ha.prototype.tooltipFormatter = function (a) {
        a = a.replace("{point.change}",
        (this.change > 0 ? "+" : "") + xa(this.change, this.series.tooltipOptions.changeDecimals || 2)); return mc.apply(this, [a])
    }; (function () {
        var a = V.init, b = V.getSegments; V.init = function () {
            var b, d; a.apply(this, arguments); b = this.chart; (d = this.xAxis) && d.options.ordinal && F(this, "updatedData", function () { delete d.ordinalIndex }); if (d && d.options.ordinal && !d.hasOrdinalExtension) {
                d.hasOrdinalExtension = !0; d.beforeSetTickPositions = function () {
                    var a, b = [], c = !1, e, j = this.getExtremes(), k = j.min, j = j.max, m; if (this.options.ordinal) {
                        n(this.series,
                        function (c, d) { if (c.visible !== !1 && c.takeOrdinalPosition !== !1 && (b = b.concat(c.processedXData), a = b.length, b.sort(function (a, b) { return a - b }), a)) for (d = a - 1; d--;) b[d] === b[d + 1] && b.splice(d, 1) }); a = b.length; if (a > 2) { e = b[1] - b[0]; for (m = a - 1; m-- && !c;) b[m + 1] - b[m] !== e && (c = !0) } c ? (this.ordinalPositions = b, c = d.val2lin(k, !0), e = d.val2lin(j, !0), this.ordinalSlope = j = (j - k) / (e - c), this.ordinalOffset = k - c * j) : this.ordinalPositions = this.ordinalSlope = this.ordinalOffset = w
                    }
                }; d.val2lin = function (a, b) {
                    var c = this.ordinalPositions; if (c) {
                        var d =
                        c.length, e, k; for (e = d; e--;) if (c[e] === a) { k = e; break } for (e = d - 1; e--;) if (a > c[e] || e === 0) { c = (a - c[e]) / (c[e + 1] - c[e]); k = e + c; break } return b ? k : this.ordinalSlope * (k || 0) + this.ordinalOffset
                    } else return a
                }; d.lin2val = function (a, b) { var c = this.ordinalPositions; if (c) { var d = this.ordinalSlope, e = this.ordinalOffset, k = c.length - 1, m, l; if (b) a < 0 ? a = c[0] : a > k ? a = c[k] : (k = W(a), l = a - k); else for (; k--;) if (m = d * k + e, a >= m) { d = d * (k + 1) + e; l = (a - m) / (d - m); break } return l !== w && c[k] !== w ? c[k] + (l ? l * (c[k + 1] - c[k]) : 0) : a } else return a }; d.getExtendedPositions =
                function () {
                    var a = d.series[0].currentDataGrouping, e = d.ordinalIndex, h = a ? a.count + a.unitName : "raw", i = d.getExtremes(), j, k; if (!e) e = d.ordinalIndex = {}; if (!e[h]) j = { series: [], getExtremes: function () { return { min: i.dataMin, max: i.dataMax } }, options: { ordinal: !0 } }, n(d.series, function (d) { k = { xAxis: j, xData: d.xData, chart: b, destroyGroupedData: qa }; k.options = { dataGrouping: a ? { enabled: !0, forced: !0, approximation: "open", units: [[a.unitName, [a.count]]] } : { enabled: !1 } }; d.processData.apply(k); j.series.push(k) }), d.beforeSetTickPositions.apply(j),
                    e[h] = j.ordinalPositions; return e[h]
                }; d.getGroupIntervalFactor = function (a, b, c) { for (var d = 0, e = c.length, k = []; d < e - 1; d++) k[d] = c[d + 1] - c[d]; k.sort(function (a, b) { return a - b }); d = k[W(e / 2)]; a = t(a, c[0]); b = A(b, c[e - 1]); return e * d / (b - a) }; d.postProcessTickInterval = function (a) { var b = this.ordinalSlope; return b ? a / (b / d.closestPointRange) : a }; d.getNonLinearTimeTicks = function (a, b, c, e, j, k, m) {
                    var l = 0, n = 0, p, r = {}, u, s, t, y = [], z = -Number.MAX_VALUE, A = d.options.tickPixelInterval; if (!j || j.length === 1 || b === w) return fb(a, b, c, e); for (s =
                    j.length; n < s; n++) { t = n && j[n - 1] > c; j[n] < b && (l = n); if (n === s - 1 || j[n + 1] - j[n] > k * 5 || t) { if (j[n] > z) { for (p = fb(a, j[l], j[n], e) ; p.length && p[0] <= z;) p.shift(); p.length && (z = p[p.length - 1]); y = y.concat(p) } l = n + 1 } if (t) break } a = p.info; if (m && a.unitRange <= I[za]) { n = y.length - 1; for (l = 1; l < n; l++) (new Date(y[l]))[Oa]() !== (new Date(y[l - 1]))[Oa]() && (r[y[l]] = ga, u = !0); u && (r[y[0]] = ga); a.higherRanks = r } y.info = a; if (m && v(A)) {
                        var m = a = y.length, n = [], B; for (u = []; m--;) l = d.translate(y[m]), B && (u[m] = B - l), n[m] = B = l; u.sort(); u = u[W(u.length / 2)]; u < A * 0.6 &&
                        (u = null); m = y[a - 1] > c ? a - 1 : a; for (B = void 0; m--;) l = n[m], c = B - l, B && c < A * 0.8 && (u === null || c < u * 0.8) ? (r[y[m]] && !r[y[m + 1]] ? (c = m + 1, B = l) : c = m, y.splice(c, 1)) : B = l
                    } return y
                }; var e = b.pan; b.pan = function (a) {
                    var d = b.xAxis[0], h = !1; if (d.options.ordinal && d.series.length) {
                        var i = b.mouseDownX, j = d.getExtremes(), k = j.dataMax, m = j.min, l = j.max, o; o = b.hoverPoints; var p = d.closestPointRange, i = (i - a) / (d.translationSlope * (d.ordinalSlope || p)), r = { ordinalPositions: d.getExtendedPositions() }, u, p = d.lin2val, s = d.val2lin; if (r.ordinalPositions) {
                            if (U(i) >
                            1) o && n(o, function (a) { a.setState() }), i < 0 ? (o = r, r = d.ordinalPositions ? d : r) : o = d.ordinalPositions ? d : r, u = r.ordinalPositions, k > u[u.length - 1] && u.push(k), o = p.apply(o, [s.apply(o, [m, !0]) + i, !0]), i = p.apply(r, [s.apply(r, [l, !0]) + i, !0]), o > A(j.dataMin, m) && i < t(k, l) && d.setExtremes(o, i, !0, !1, { trigger: "pan" }), b.mouseDownX = a, L(b.container, { cursor: "move" })
                        } else h = !0
                    } else h = !0; h && e.apply(b, arguments)
                }
            }
        }; V.getSegments = function () {
            var a = this, d, e = a.options.gapSize; b.apply(a); if (e) d = a.segments, n(d, function (b, g) {
                for (var h = b.length -
                1; h--;) b[h + 1].x - b[h].x > a.xAxis.closestPointRange * e && d.splice(g + 1, 0, b.splice(h + 1, b.length - h))
            })
        }
    })(); y(Highcharts, {
        Axis: Da, Chart: Sa, Color: wa, Legend: Hb, Pointer: pb, Point: Ha, Tick: ab, Tooltip: Gb, Renderer: cb, Series: $, SVGElement: Ca, SVGRenderer: Ga, arrayMin: Pa, arrayMax: ua, charts: Ua, dateFormat: ya, format: La, pathAnim: Lb, getOptions: function () { return M }, hasBidiBug: cc, isTouchDevice: ub, numberFormat: xa, seriesTypes: Q, setOptions: function (a) { M = z(M, a); Tb(); return M }, addEvent: F, removeEvent: X, createElement: aa, discardElement: Za,
        css: L, each: n, extend: y, map: Fa, merge: z, pick: p, splat: ja, extendClass: ea, pInt: C, wrap: sa, svg: ca, canvas: ia, vml: !ca && !ia, product: "Highstock", version: "1.3.2"
    })
})();