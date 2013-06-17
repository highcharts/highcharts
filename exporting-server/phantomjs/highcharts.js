/*
 Highcharts JS v3.0.2 (2013-06-05)

 (c) 2009-2013 Torstein HÞnsi

 License: www.highcharts.com/license
*/
(function () {
    function v(a, b) { var c; a || (a = {}); for (c in b) a[c] = b[c]; return a } function x() { var a, b = arguments.length, c = {}, d = function (a, b) { var c, h; for (h in b) b.hasOwnProperty(h) && (c = b[h], typeof a !== "object" && (a = {}), a[h] = c && typeof c === "object" && Object.prototype.toString.call(c) !== "[object Array]" && typeof c.nodeType !== "number" ? d(a[h] || {}, c) : b[h]); return a }; for (a = 0; a < b; a++) c = d(c, arguments[a]); return c } function u(a, b) { return parseInt(a, b || 10) } function fa(a) { return typeof a === "string" } function V(a) {
        return typeof a ===
        "object"
    } function Da(a) { return Object.prototype.toString.call(a) === "[object Array]" } function Ea(a) { return typeof a === "number" } function ka(a) { return I.log(a) / I.LN10 } function da(a) { return I.pow(10, a) } function ga(a, b) { for (var c = a.length; c--;) if (a[c] === b) { a.splice(c, 1); break } } function r(a) { return a !== y && a !== null } function A(a, b, c) { var d, e; if (fa(b)) r(c) ? a.setAttribute(b, c) : a && a.getAttribute && (e = a.getAttribute(b)); else if (r(b) && V(b)) for (d in b) a.setAttribute(d, b[d]); return e } function ha(a) {
        return Da(a) ?
            a : [a]
    } function o() { var a = arguments, b, c, d = a.length; for (b = 0; b < d; b++) if (c = a[b], typeof c !== "undefined" && c !== null) return c } function L(a, b) { if (Fa && b && b.opacity !== y) b.filter = "alpha(opacity=" + b.opacity * 100 + ")"; v(a.style, b) } function U(a, b, c, d, e) { a = z.createElement(a); b && v(a, b); e && L(a, { padding: 0, border: S, margin: 0 }); c && L(a, c); d && d.appendChild(a); return a } function ea(a, b) { var c = function () { }; c.prototype = new a; v(c.prototype, b); return c } function ua(a, b, c, d) {
        var e = N.lang, f = b === -1 ? ((a || 0).toString().split(".")[1] ||
        "").length : isNaN(b = Q(b)) ? 2 : b, b = c === void 0 ? e.decimalPoint : c, d = d === void 0 ? e.thousandsSep : d, e = a < 0 ? "-" : "", c = String(u(a = Q(+a || 0).toFixed(f))), g = c.length > 3 ? c.length % 3 : 0; return e + (g ? c.substr(0, g) + d : "") + c.substr(g).replace(/(\d{3})(?=\d)/g, "$1" + d) + (f ? b + Q(a - c).toFixed(f).slice(2) : "")
    } function va(a, b) { return Array((b || 2) + 1 - String(a).length).join(0) + a } function zb(a, b, c) { var d = a[b]; a[b] = function () { var a = Array.prototype.slice.call(arguments); a.unshift(d); return c.apply(this, a) } } function wa(a, b) {
        for (var c = "{",
        d = !1, e, f, g, h, i, j = []; (c = a.indexOf(c)) !== -1;) { e = a.slice(0, c); if (d) { f = e.split(":"); g = f.shift().split("."); i = g.length; e = b; for (h = 0; h < i; h++) e = e[g[h]]; if (f.length) f = f.join(":"), g = /\.([0-9])/, h = N.lang, i = void 0, /f$/.test(f) ? (i = (i = f.match(g)) ? i[1] : -1, e = ua(e, i, h.decimalPoint, f.indexOf(",") > -1 ? h.thousandsSep : "")) : e = Ua(f, e) } j.push(e); a = a.slice(c + 1); c = (d = !d) ? "}" : "{" } j.push(a); return j.join("")
    } function ib(a, b, c, d) {
        var e, c = o(c, 1); e = a / c; b || (b = [1, 2, 2.5, 5, 10], d && d.allowDecimals === !1 && (c === 1 ? b = [1, 2, 5, 10] : c <= 0.1 && (b =
        [1 / c]))); for (d = 0; d < b.length; d++) if (a = b[d], e <= (b[d] + (b[d + 1] || b[d])) / 2) break; a *= c; return a
    } function Ab(a, b) {
        var c = b || [[Bb, [1, 2, 5, 10, 20, 25, 50, 100, 200, 500]], [jb, [1, 2, 5, 10, 15, 30]], [Va, [1, 2, 5, 10, 15, 30]], [Oa, [1, 2, 3, 4, 6, 8, 12]], [oa, [1, 2]], [Wa, [1, 2]], [Pa, [1, 2, 3, 4, 6]], [xa, null]], d = c[c.length - 1], e = E[d[0]], f = d[1], g; for (g = 0; g < c.length; g++) if (d = c[g], e = E[d[0]], f = d[1], c[g + 1] && a <= (e * f[f.length - 1] + E[c[g + 1][0]]) / 2) break; e === E[xa] && a < 5 * e && (f = [1, 2, 5]); e === E[xa] && a < 5 * e && (f = [1, 2, 5]); c = ib(a / e, f); return {
            unitRange: e, count: c,
            unitName: d[0]
        }
    } function Cb(a, b, c, d) {
        var e = [], f = {}, g = N.global.useUTC, h, i = new Date(b), j = a.unitRange, k = a.count; if (r(b)) {
            j >= E[jb] && (i.setMilliseconds(0), i.setSeconds(j >= E[Va] ? 0 : k * T(i.getSeconds() / k))); if (j >= E[Va]) i[Db](j >= E[Oa] ? 0 : k * T(i[kb]() / k)); if (j >= E[Oa]) i[Eb](j >= E[oa] ? 0 : k * T(i[lb]() / k)); if (j >= E[oa]) i[mb](j >= E[Pa] ? 1 : k * T(i[Qa]() / k)); j >= E[Pa] && (i[Fb](j >= E[xa] ? 0 : k * T(i[Xa]() / k)), h = i[Ya]()); j >= E[xa] && (h -= h % k, i[Gb](h)); if (j === E[Wa]) i[mb](i[Qa]() - i[nb]() + o(d, 1)); b = 1; h = i[Ya](); for (var d = i.getTime(), m = i[Xa](),
            l = i[Qa](), p = g ? 0 : (864E5 + i.getTimezoneOffset() * 6E4) % 864E5; d < c;) e.push(d), j === E[xa] ? d = Za(h + b * k, 0) : j === E[Pa] ? d = Za(h, m + b * k) : !g && (j === E[oa] || j === E[Wa]) ? d = Za(h, m, l + b * k * (j === E[oa] ? 1 : 7)) : d += j * k, b++; e.push(d); n(ob(e, function (a) { return j <= E[Oa] && a % E[oa] === p }), function (a) { f[a] = oa })
        } e.info = v(a, { higherRanks: f, totalRange: j * k }); return e
    } function Hb() { this.symbol = this.color = 0 } function Ib(a, b) { var c = a.length, d, e; for (e = 0; e < c; e++) a[e].ss_i = e; a.sort(function (a, c) { d = b(a, c); return d === 0 ? a.ss_i - c.ss_i : d }); for (e = 0; e < c; e++) delete a[e].ss_i }
    function Ga(a) { for (var b = a.length, c = a[0]; b--;) a[b] < c && (c = a[b]); return c } function pa(a) { for (var b = a.length, c = a[0]; b--;) a[b] > c && (c = a[b]); return c } function Ha(a, b) { for (var c in a) a[c] && a[c] !== b && a[c].destroy && a[c].destroy(), delete a[c] } function Ra(a) { $a || ($a = U(ya)); a && $a.appendChild(a); $a.innerHTML = "" } function qa(a, b) { var c = "Highcharts error #" + a + ": www.highcharts.com/errors/" + a; if (b) throw c; else O.console && console.log(c) } function ia(a) { return parseFloat(a.toPrecision(14)) } function Ia(a, b) { za = o(a, b.animation) }
    function Jb() { var a = N.global.useUTC, b = a ? "getUTC" : "get", c = a ? "setUTC" : "set"; Za = a ? Date.UTC : function (a, b, c, g, h, i) { return (new Date(a, b, o(c, 1), o(g, 0), o(h, 0), o(i, 0))).getTime() }; kb = b + "Minutes"; lb = b + "Hours"; nb = b + "Day"; Qa = b + "Date"; Xa = b + "Month"; Ya = b + "FullYear"; Db = c + "Minutes"; Eb = c + "Hours"; mb = c + "Date"; Fb = c + "Month"; Gb = c + "FullYear" } function ra() { } function Ja(a, b, c, d) { this.axis = a; this.pos = b; this.type = c || ""; this.isNew = !0; !c && !d && this.addLabel() } function pb(a, b) { this.axis = a; if (b) this.options = b, this.id = b.id } function Kb(a,
    b, c, d, e, f) { var g = a.chart.inverted; this.axis = a; this.isNegative = c; this.options = b; this.x = d; this.stack = e; this.percent = f === "percent"; this.alignOptions = { align: b.align || (g ? c ? "left" : "right" : "center"), verticalAlign: b.verticalAlign || (g ? "middle" : c ? "bottom" : "top"), y: o(b.y, g ? 4 : c ? 14 : -6), x: o(b.x, g ? c ? -6 : 6 : 0) }; this.textAlign = b.textAlign || (g ? c ? "right" : "left" : "center") } function ab() { this.init.apply(this, arguments) } function qb() { this.init.apply(this, arguments) } function rb(a, b) { this.init(a, b) } function sb(a, b) {
        this.init(a,
        b)
    } function tb() { this.init.apply(this, arguments) } var y, z = document, O = window, I = Math, t = I.round, T = I.floor, ja = I.ceil, q = I.max, K = I.min, Q = I.abs, Y = I.cos, ca = I.sin, Ka = I.PI, bb = Ka * 2 / 360, Aa = navigator.userAgent, Lb = O.opera, Fa = /msie/i.test(Aa) && !Lb, cb = z.documentMode === 8, db = /AppleWebKit/.test(Aa), eb = /Firefox/.test(Aa), Mb = /(Mobile|Android|Windows Phone)/.test(Aa), sa = "http://www.w3.org/2000/svg", Z = !!z.createElementNS && !!z.createElementNS(sa, "svg").createSVGRect, Sb = eb && parseInt(Aa.split("Firefox/")[1], 10) < 4, $ = !Z && !Fa &&
    !!z.createElement("canvas").getContext, Sa, fb = z.documentElement.ontouchstart !== y, Nb = {}, ub = 0, $a, N, Ua, za, vb, E, ta = function () { }, Ba = [], ya = "div", S = "none", Ob = "rgba(192,192,192," + (Z ? 1.0E-4 : 0.002) + ")", Bb = "millisecond", jb = "second", Va = "minute", Oa = "hour", oa = "day", Wa = "week", Pa = "month", xa = "year", Pb = "stroke-width", Za, kb, lb, nb, Qa, Xa, Ya, Db, Eb, mb, Fb, Gb, aa = {}; O.Highcharts = O.Highcharts ? qa(16, !0) : {}; Ua = function (a, b, c) {
        if (!r(b) || isNaN(b)) return "Invalid date"; var a = o(a, "%Y-%m-%d %H:%M:%S"), d = new Date(b), e, f = d[lb](), g = d[nb](),
        h = d[Qa](), i = d[Xa](), j = d[Ya](), k = N.lang, m = k.weekdays, d = v({ a: m[g].substr(0, 3), A: m[g], d: va(h), e: h, b: k.shortMonths[i], B: k.months[i], m: va(i + 1), y: j.toString().substr(2, 2), Y: j, H: va(f), I: va(f % 12 || 12), l: f % 12 || 12, M: va(d[kb]()), p: f < 12 ? "AM" : "PM", P: f < 12 ? "am" : "pm", S: va(d.getSeconds()), L: va(t(b % 1E3), 3) }, Highcharts.dateFormats); for (e in d) for (; a.indexOf("%" + e) !== -1;) a = a.replace("%" + e, typeof d[e] === "function" ? d[e](b) : d[e]); return c ? a.substr(0, 1).toUpperCase() + a.substr(1) : a
    }; Hb.prototype = {
        wrapColor: function (a) {
            if (this.color >=
            a) this.color = 0
        }, wrapSymbol: function (a) { if (this.symbol >= a) this.symbol = 0 }
    }; E = function () { for (var a = 0, b = arguments, c = b.length, d = {}; a < c; a++) d[b[a++]] = b[a]; return d }(Bb, 1, jb, 1E3, Va, 6E4, Oa, 36E5, oa, 864E5, Wa, 6048E5, Pa, 26784E5, xa, 31556952E3); vb = {
        init: function (a, b, c) {
            var b = b || "", d = a.shift, e = b.indexOf("C") > -1, f = e ? 7 : 3, g, b = b.split(" "), c = [].concat(c), h, i, j = function (a) { for (g = a.length; g--;) a[g] === "M" && a.splice(g + 1, 0, a[g + 1], a[g + 2], a[g + 1], a[g + 2]) }; e && (j(b), j(c)); a.isArea && (h = b.splice(b.length - 6, 6), i = c.splice(c.length -
            6, 6)); if (d <= c.length / f) for (; d--;) c = [].concat(c).splice(0, f).concat(c); a.shift = 0; if (b.length) for (a = c.length; b.length < a;) d = [].concat(b).splice(b.length - f, f), e && (d[f - 6] = d[f - 2], d[f - 5] = d[f - 1]), b = b.concat(d); h && (b = b.concat(h), c = c.concat(i)); return [b, c]
        }, step: function (a, b, c, d) { var e = [], f = a.length; if (c === 1) e = d; else if (f === b.length && c < 1) for (; f--;) d = parseFloat(a[f]), e[f] = isNaN(d) ? a[f] : c * parseFloat(b[f] - d) + d; else e = b; return e }
    }; (function (a) {
        O.HighchartsAdapter = O.HighchartsAdapter || a && {
            init: function (b) {
                var c =
                a.fx, d = c.step, e, f = a.Tween, g = f && f.propHooks; e = a.cssHooks.opacity; a.extend(a.easing, { easeOutQuad: function (a, b, c, d, e) { return -d * (b /= e) * (b - 2) + c } }); a.each(["cur", "_default", "width", "height", "opacity"], function (a, b) { var e = d, k, m; b === "cur" ? e = c.prototype : b === "_default" && f && (e = g[b], b = "set"); (k = e[b]) && (e[b] = function (c) { c = a ? c : this; m = c.elem; return m.attr ? m.attr(c.prop, b === "cur" ? y : c.now) : k.apply(this, arguments) }) }); zb(e, "get", function (a, b, c) { return b.attr ? b.opacity || 0 : a.call(this, b, c) }); e = function (a) {
                    var c = a.elem,
                    d; if (!a.started) d = b.init(c, c.d, c.toD), a.start = d[0], a.end = d[1], a.started = !0; c.attr("d", b.step(a.start, a.end, a.pos, c.toD))
                }; f ? g.d = { set: e } : d.d = e; this.each = Array.prototype.forEach ? function (a, b) { return Array.prototype.forEach.call(a, b) } : function (a, b) { for (var c = 0, d = a.length; c < d; c++) if (b.call(a[c], a[c], c, a) === !1) return c }; a.fn.highcharts = function () {
                    var a = "Chart", b = arguments, c, d; fa(b[0]) && (a = b[0], b = Array.prototype.slice.call(b, 1)); c = b[0]; if (c !== y) c.chart = c.chart || {}, c.chart.renderTo = this[0], new Highcharts[a](c,
                    b[1]), d = this; c === y && (d = Ba[A(this[0], "data-highcharts-chart")]); return d
                }
            }, getScript: a.getScript, inArray: a.inArray, adapterRun: function (b, c) { return a(b)[c]() }, grep: a.grep, map: function (a, c) { for (var d = [], e = 0, f = a.length; e < f; e++) d[e] = c.call(a[e], a[e], e, a); return d }, offset: function (b) { return a(b).offset() }, addEvent: function (b, c, d) { a(b).bind(c, d) }, removeEvent: function (b, c, d) { var e = z.removeEventListener ? "removeEventListener" : "detachEvent"; z[e] && b && !b[e] && (b[e] = function () { }); a(b).unbind(c, d) }, fireEvent: function (b,
            c, d, e) { var f = a.Event(c), g = "detached" + c, h; !Fa && d && (delete d.layerX, delete d.layerY); v(f, d); b[c] && (b[g] = b[c], b[c] = null); a.each(["preventDefault", "stopPropagation"], function (a, b) { var c = f[b]; f[b] = function () { try { c.call(f) } catch (a) { b === "preventDefault" && (h = !0) } } }); a(b).trigger(f); b[g] && (b[c] = b[g], b[g] = null); e && !f.isDefaultPrevented() && !h && e(f) }, washMouseEvent: function (a) { var c = a.originalEvent || a; if (c.pageX === y) c.pageX = a.pageX, c.pageY = a.pageY; return c }, animate: function (b, c, d) {
                var e = a(b); if (!b.style) b.style =
                {}; if (c.d) b.toD = c.d, c.d = 1; e.stop(); e.animate(c, d)
            }, stop: function (b) { a(b).stop() }
        }
    })(O.jQuery); var W = O.HighchartsAdapter, M = W || {}; W && W.init.call(W, vb); var gb = M.adapterRun, Tb = M.getScript, la = M.inArray, n = M.each, ob = M.grep, Ub = M.offset, La = M.map, J = M.addEvent, ba = M.removeEvent, D = M.fireEvent, Qb = M.washMouseEvent, wb = M.animate, Ta = M.stop, M = { enabled: !0, align: "center", x: 0, y: 15, style: { color: "#666", cursor: "default", fontSize: "11px", lineHeight: "14px" } }; N = {
        colors: "#2f7ed8,#0d233a,#8bbc21,#910000,#1aadce,#492970,#f28f43,#77a1e5,#c42525,#a6c96a".split(","),
        symbols: ["circle", "diamond", "square", "triangle", "triangle-down"], lang: { loading: "Loading...", months: "January,February,March,April,May,June,July,August,September,October,November,December".split(","), shortMonths: "Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","), weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","), decimalPoint: ".", numericSymbols: "k,M,G,T,P,E".split(","), resetZoom: "Reset zoom", resetZoomTitle: "Reset zoom level 1:1", thousandsSep: "," }, global: {
            useUTC: !0,
            canvasToolsURL: "http://code.highcharts.com/3.0.2/modules/canvas-tools.js", VMLRadialGradientURL: "http://code.highcharts.com/3.0.2/gfx/vml-radial-gradient.png"
        }, chart: {
            borderColor: "#4572A7", borderRadius: 5, defaultSeriesType: "line", ignoreHiddenSeries: !0, spacingTop: 10, spacingRight: 10, spacingBottom: 15, spacingLeft: 10, style: { fontFamily: '"Lucida Grande", "Lucida Sans Unicode", Verdana, Arial, Helvetica, sans-serif', fontSize: "12px" }, backgroundColor: "#FFFFFF", plotBorderColor: "#C0C0C0", resetZoomButton: {
                theme: { zIndex: 20 },
                position: { align: "right", x: -10, y: 10 }
            }
        }, title: { text: "Chart title", align: "center", y: 15, style: { color: "#274b6d", fontSize: "16px" } }, subtitle: { text: "", align: "center", y: 30, style: { color: "#4d759e" } }, plotOptions: {
            line: {
                allowPointSelect: !1, showCheckbox: !1, animation: { duration: 1E3 }, events: {}, lineWidth: 2, marker: { enabled: !0, lineWidth: 0, radius: 4, lineColor: "#FFFFFF", states: { hover: { enabled: !0 }, select: { fillColor: "#FFFFFF", lineColor: "#000000", lineWidth: 2 } } }, point: { events: {} }, dataLabels: x(M, {
                    enabled: !1, formatter: function () {
                        return ua(this.y,
                        -1)
                    }, verticalAlign: "bottom", y: 0
                }), cropThreshold: 300, pointRange: 0, showInLegend: !0, states: { hover: { marker: {} }, select: { marker: {} } }, stickyTracking: !0
            }
        }, labels: { style: { position: "absolute", color: "#3E576F" } }, legend: {
            enabled: !0, align: "center", layout: "horizontal", labelFormatter: function () { return this.name }, borderWidth: 1, borderColor: "#909090", borderRadius: 5, navigation: { activeColor: "#274b6d", inactiveColor: "#CCC" }, shadow: !1, itemStyle: { cursor: "pointer", color: "#274b6d", fontSize: "12px" }, itemHoverStyle: { color: "#000" },
            itemHiddenStyle: { color: "#CCC" }, itemCheckboxStyle: { position: "absolute", width: "13px", height: "13px" }, symbolWidth: 16, symbolPadding: 5, verticalAlign: "bottom", x: 0, y: 0, title: { style: { fontWeight: "bold" } }
        }, loading: { labelStyle: { fontWeight: "bold", position: "relative", top: "1em" }, style: { position: "absolute", backgroundColor: "white", opacity: 0.5, textAlign: "center" } }, tooltip: {
            enabled: !0, animation: Z, backgroundColor: "rgba(255, 255, 255, .85)", borderWidth: 1, borderRadius: 3, dateTimeLabelFormats: {
                millisecond: "%A, %b %e, %H:%M:%S.%L",
                second: "%A, %b %e, %H:%M:%S", minute: "%A, %b %e, %H:%M", hour: "%A, %b %e, %H:%M", day: "%A, %b %e, %Y", week: "Week from %A, %b %e, %Y", month: "%B %Y", year: "%Y"
            }, headerFormat: '<span style="font-size: 10px">{point.key}</span><br/>', pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b><br/>', shadow: !0, snap: Mb ? 25 : 10, style: { color: "#333333", cursor: "default", fontSize: "12px", padding: "8px", whiteSpace: "nowrap" }
        }, credits: {
            enabled: !0, text: "Highcharts.com", href: "http://www.highcharts.com",
            position: { align: "right", x: -10, verticalAlign: "bottom", y: -5 }, style: { cursor: "pointer", color: "#909090", fontSize: "9px" }
        }
    }; var X = N.plotOptions, W = X.line; Jb(); var ma = function (a) {
        var b = [], c, d; (function (a) {
            a && a.stops ? d = La(a.stops, function (a) { return ma(a[1]) }) : (c = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/.exec(a)) ? b = [u(c[1]), u(c[2]), u(c[3]), parseFloat(c[4], 10)] : (c = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(a)) ? b = [u(c[1], 16), u(c[2], 16), u(c[3],
            16), 1] : (c = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(a)) && (b = [u(c[1]), u(c[2]), u(c[3]), 1])
        })(a); return {
            get: function (c) { var f; d ? (f = x(a), f.stops = [].concat(f.stops), n(d, function (a, b) { f.stops[b] = [f.stops[b][0], a.get(c)] })) : f = b && !isNaN(b[0]) ? c === "rgb" ? "rgb(" + b[0] + "," + b[1] + "," + b[2] + ")" : c === "a" ? b[3] : "rgba(" + b.join(",") + ")" : a; return f }, brighten: function (a) {
                if (d) n(d, function (b) { b.brighten(a) }); else if (Ea(a) && a !== 0) {
                    var c; for (c = 0; c < 3; c++) b[c] += u(a * 255), b[c] < 0 && (b[c] = 0), b[c] > 255 &&
                    (b[c] = 255)
                } return this
            }, rgba: b, setOpacity: function (a) { b[3] = a; return this }
        }
    }; ra.prototype = {
        init: function (a, b) { this.element = b === "span" ? U(b) : z.createElementNS(sa, b); this.renderer = a; this.attrSetters = {} }, opacity: 1, animate: function (a, b, c) { b = o(b, za, !0); Ta(this); if (b) { b = x(b); if (c) b.complete = c; wb(this, a, b) } else this.attr(a), c && c() }, attr: function (a, b) {
            var c, d, e, f, g = this.element, h = g.nodeName.toLowerCase(), i = this.renderer, j, k = this.attrSetters, m = this.shadows, l, p, s = this; fa(a) && r(b) && (c = a, a = {}, a[c] = b); if (fa(a)) c =
            a, h === "circle" ? c = { x: "cx", y: "cy" }[c] || c : c === "strokeWidth" && (c = "stroke-width"), s = A(g, c) || this[c] || 0, c !== "d" && c !== "visibility" && (s = parseFloat(s)); else {
                for (c in a) if (j = !1, d = a[c], e = k[c] && k[c].call(this, d, c), e !== !1) {
                    e !== y && (d = e); if (c === "d") d && d.join && (d = d.join(" ")), /(NaN| {2}|^$)/.test(d) && (d = "M 0 0"); else if (c === "x" && h === "text") for (e = 0; e < g.childNodes.length; e++) f = g.childNodes[e], A(f, "x") === A(g, "x") && A(f, "x", d); else if (this.rotation && (c === "x" || c === "y")) p = !0; else if (c === "fill") d = i.color(d, g, c); else if (h ===
                    "circle" && (c === "x" || c === "y")) c = { x: "cx", y: "cy" }[c] || c; else if (h === "rect" && c === "r") A(g, { rx: d, ry: d }), j = !0; else if (c === "translateX" || c === "translateY" || c === "rotation" || c === "verticalAlign" || c === "scaleX" || c === "scaleY") j = p = !0; else if (c === "stroke") d = i.color(d, g, c); else if (c === "dashstyle") if (c = "stroke-dasharray", d = d && d.toLowerCase(), d === "solid") d = S; else {
                        if (d) {
                            d = d.replace("shortdashdotdot", "3,1,1,1,1,1,").replace("shortdashdot", "3,1,1,1").replace("shortdot", "1,1,").replace("shortdash", "3,1,").replace("longdash",
                            "8,3,").replace(/dot/g, "1,3,").replace("dash", "4,3,").replace(/,$/, "").split(","); for (e = d.length; e--;) d[e] = u(d[e]) * a["stroke-width"]; d = d.join(",")
                        }
                    } else if (c === "width") d = u(d); else if (c === "align") c = "text-anchor", d = { left: "start", center: "middle", right: "end" }[d]; else if (c === "title") e = g.getElementsByTagName("title")[0], e || (e = z.createElementNS(sa, "title"), g.appendChild(e)), e.textContent = d; c === "strokeWidth" && (c = "stroke-width"); if (c === "stroke-width" || c === "stroke") {
                        this[c] = d; if (this.stroke && this["stroke-width"]) A(g,
                        "stroke", this.stroke), A(g, "stroke-width", this["stroke-width"]), this.hasStroke = !0; else if (c === "stroke-width" && d === 0 && this.hasStroke) g.removeAttribute("stroke"), this.hasStroke = !1; j = !0
                    } this.symbolName && /^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c) && (l || (this.symbolAttr(a), l = !0), j = !0); if (m && /^(width|height|visibility|x|y|d|transform)$/.test(c)) for (e = m.length; e--;) A(m[e], c, c === "height" ? q(d - (m[e].cutHeight || 0), 0) : d); if ((c === "width" || c === "height") && h === "rect" && d < 0) d = 0; this[c] = d; c === "text" ?
                    (d !== this.textStr && delete this.bBox, this.textStr = d, this.added && i.buildText(this)) : j || A(g, c, d)
                } p && this.updateTransform()
            } return s
        }, addClass: function (a) { A(this.element, "class", A(this.element, "class") + " " + a); return this }, symbolAttr: function (a) { var b = this; n("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","), function (c) { b[c] = o(a[c], b[c]) }); b.attr({ d: b.renderer.symbols[b.symbolName](b.x, b.y, b.width, b.height, b) }) }, clip: function (a) {
            return this.attr("clip-path", a ? "url(" + this.renderer.url + "#" +
            a.id + ")" : S)
        }, crisp: function (a, b, c, d, e) { var f, g = {}, h = {}, i, a = a || this.strokeWidth || this.attr && this.attr("stroke-width") || 0; i = t(a) % 2 / 2; h.x = T(b || this.x || 0) + i; h.y = T(c || this.y || 0) + i; h.width = T((d || this.width || 0) - 2 * i); h.height = T((e || this.height || 0) - 2 * i); h.strokeWidth = a; for (f in h) this[f] !== h[f] && (this[f] = g[f] = h[f]); return g }, css: function (a) {
            var b = this.element, c = a && a.width && b.nodeName.toLowerCase() === "text", d, e = "", f = function (a, b) { return "-" + b.toLowerCase() }; if (a && a.color) a.fill = a.color; this.styles = a = v(this.styles,
            a); $ && c && delete a.width; if (Fa && !Z) c && delete a.width, L(this.element, a); else { for (d in a) e += d.replace(/([A-Z])/g, f) + ":" + a[d] + ";"; A(b, "style", e) } c && this.added && this.renderer.buildText(this); return this
        }, on: function (a, b) { if (fb && a === "click") this.element.ontouchstart = function (a) { a.preventDefault(); b() }; this.element["on" + a] = b; return this }, setRadialReference: function (a) { this.element.radialReference = a; return this }, translate: function (a, b) { return this.attr({ translateX: a, translateY: b }) }, invert: function () {
            this.inverted =
            !0; this.updateTransform(); return this
        }, htmlCss: function (a) { var b = this.element; if (b = a && b.tagName === "SPAN" && a.width) delete a.width, this.textWidth = b, this.updateTransform(); this.styles = v(this.styles, a); L(this.element, a); return this }, htmlGetBBox: function () { var a = this.element, b = this.bBox; if (!b) { if (a.nodeName === "text") a.style.position = "absolute"; b = this.bBox = { x: a.offsetLeft, y: a.offsetTop, width: a.offsetWidth, height: a.offsetHeight } } return b }, htmlUpdateTransform: function () {
            if (this.added) {
                var a = this.renderer,
                b = this.element, c = this.translateX || 0, d = this.translateY || 0, e = this.x || 0, f = this.y || 0, g = this.textAlign || "left", h = { left: 0, center: 0.5, right: 1 }[g], i = g && g !== "left", j = this.shadows; L(b, { marginLeft: c, marginTop: d }); j && n(j, function (a) { L(a, { marginLeft: c + 1, marginTop: d + 1 }) }); this.inverted && n(b.childNodes, function (c) { a.invertChild(c, b) }); if (b.tagName === "SPAN") {
                    var k, m, j = this.rotation, l, p = 0, s = 1, p = 0, xb; l = u(this.textWidth); var B = this.xCorr || 0, w = this.yCorr || 0, G = [j, g, b.innerHTML, this.textWidth].join(","); k = {}; if (G !== this.cTT) {
                        if (r(j)) a.isSVG ?
                        (B = Fa ? "-ms-transform" : db ? "-webkit-transform" : eb ? "MozTransform" : Lb ? "-o-transform" : "", k[B] = k.transform = "rotate(" + j + "deg)") : (p = j * bb, s = Y(p), p = ca(p), k.filter = j ? ["progid:DXImageTransform.Microsoft.Matrix(M11=", s, ", M12=", -p, ", M21=", p, ", M22=", s, ", sizingMethod='auto expand')"].join("") : S), L(b, k); k = o(this.elemWidth, b.offsetWidth); m = o(this.elemHeight, b.offsetHeight); if (k > l && /[ \-]/.test(b.textContent || b.innerText)) L(b, { width: l + "px", display: "block", whiteSpace: "normal" }), k = l; l = a.fontMetrics(b.style.fontSize).b;
                        B = s < 0 && -k; w = p < 0 && -m; xb = s * p < 0; B += p * l * (xb ? 1 - h : h); w -= s * l * (j ? xb ? h : 1 - h : 1); i && (B -= k * h * (s < 0 ? -1 : 1), j && (w -= m * h * (p < 0 ? -1 : 1)), L(b, { textAlign: g })); this.xCorr = B; this.yCorr = w
                    } L(b, { left: e + B + "px", top: f + w + "px" }); if (db) m = b.offsetHeight; this.cTT = G
                }
            } else this.alignOnAdd = !0
        }, updateTransform: function () {
            var a = this.translateX || 0, b = this.translateY || 0, c = this.scaleX, d = this.scaleY, e = this.inverted, f = this.rotation; e && (a += this.attr("width"), b += this.attr("height")); a = ["translate(" + a + "," + b + ")"]; e ? a.push("rotate(90) scale(-1,1)") :
            f && a.push("rotate(" + f + " " + (this.x || 0) + " " + (this.y || 0) + ")"); (r(c) || r(d)) && a.push("scale(" + o(c, 1) + " " + o(d, 1) + ")"); a.length && A(this.element, "transform", a.join(" "))
        }, toFront: function () { var a = this.element; a.parentNode.appendChild(a); return this }, align: function (a, b, c) {
            var d, e, f, g, h = {}; e = this.renderer; f = e.alignedObjects; if (a) { if (this.alignOptions = a, this.alignByTranslate = b, !c || fa(c)) this.alignTo = d = c || "renderer", ga(f, this), f.push(this), c = null } else a = this.alignOptions, b = this.alignByTranslate, d = this.alignTo;
            c = o(c, e[d], e); d = a.align; e = a.verticalAlign; f = (c.x || 0) + (a.x || 0); g = (c.y || 0) + (a.y || 0); if (d === "right" || d === "center") f += (c.width - (a.width || 0)) / { right: 1, center: 2 }[d]; h[b ? "translateX" : "x"] = t(f); if (e === "bottom" || e === "middle") g += (c.height - (a.height || 0)) / ({ bottom: 1, middle: 2 }[e] || 1); h[b ? "translateY" : "y"] = t(g); this[this.placed ? "animate" : "attr"](h); this.placed = !0; this.alignAttr = h; return this
        }, getBBox: function () {
            var a = this.bBox, b = this.renderer, c, d = this.rotation; c = this.element; var e = this.styles, f = d * bb; if (!a) {
                if (c.namespaceURI ===
                sa || b.forExport) { try { a = c.getBBox ? v({}, c.getBBox()) : { width: c.offsetWidth, height: c.offsetHeight } } catch (g) { } if (!a || a.width < 0) a = { width: 0, height: 0 } } else a = this.htmlGetBBox(); if (b.isSVG) { b = a.width; c = a.height; if (Fa && e && e.fontSize === "11px" && c.toPrecision(3) === "22.7") a.height = c = 14; if (d) a.width = Q(c * ca(f)) + Q(b * Y(f)), a.height = Q(c * Y(f)) + Q(b * ca(f)) } this.bBox = a
            } return a
        }, show: function () { return this.attr({ visibility: "visible" }) }, hide: function () { return this.attr({ visibility: "hidden" }) }, fadeOut: function (a) {
            var b = this;
            b.animate({ opacity: 0 }, { duration: a || 150, complete: function () { b.hide() } })
        }, add: function (a) { var b = this.renderer, c = a || b, d = c.element || b.box, e = d.childNodes, f = this.element, g = A(f, "zIndex"), h; if (a) this.parentGroup = a; this.parentInverted = a && a.inverted; this.textStr !== void 0 && b.buildText(this); if (g) c.handleZ = !0, g = u(g); if (c.handleZ) for (c = 0; c < e.length; c++) if (a = e[c], b = A(a, "zIndex"), a !== f && (u(b) > g || !r(g) && r(b))) { d.insertBefore(f, a); h = !0; break } h || d.appendChild(f); this.added = !0; D(this, "add"); return this }, safeRemoveChild: function (a) {
            var b =
            a.parentNode; b && b.removeChild(a)
        }, destroy: function () { var a = this, b = a.element || {}, c = a.shadows, d, e; b.onclick = b.onmouseout = b.onmouseover = b.onmousemove = b.point = null; Ta(a); if (a.clipPath) a.clipPath = a.clipPath.destroy(); if (a.stops) { for (e = 0; e < a.stops.length; e++) a.stops[e] = a.stops[e].destroy(); a.stops = null } a.safeRemoveChild(b); c && n(c, function (b) { a.safeRemoveChild(b) }); a.alignTo && ga(a.renderer.alignedObjects, a); for (d in a) delete a[d]; return null }, shadow: function (a, b, c) {
            var d = [], e, f, g = this.element, h, i, j, k; if (a) {
                i =
                o(a.width, 3); j = (a.opacity || 0.15) / i; k = this.parentInverted ? "(-1,-1)" : "(" + o(a.offsetX, 1) + ", " + o(a.offsetY, 1) + ")"; for (e = 1; e <= i; e++) { f = g.cloneNode(0); h = i * 2 + 1 - 2 * e; A(f, { isShadow: "true", stroke: a.color || "black", "stroke-opacity": j * e, "stroke-width": h, transform: "translate" + k, fill: S }); if (c) A(f, "height", q(A(f, "height") - h, 0)), f.cutHeight = h; b ? b.element.appendChild(f) : g.parentNode.insertBefore(f, g); d.push(f) } this.shadows = d
            } return this
        }
    }; var Ca = function () { this.init.apply(this, arguments) }; Ca.prototype = {
        Element: ra, init: function (a,
        b, c, d) {
            var e = location, f; f = this.createElement("svg").attr({ xmlns: sa, version: "1.1" }); a.appendChild(f.element); this.isSVG = !0; this.box = f.element; this.boxWrapper = f; this.alignedObjects = []; this.url = (eb || db) && z.getElementsByTagName("base").length ? e.href.replace(/#.*?$/, "").replace(/([\('\)])/g, "\\$1").replace(/ /g, "%20") : ""; this.createElement("desc").add().element.appendChild(z.createTextNode("Created with Highcharts 3.0.2")); this.defs = this.createElement("defs").add(); this.forExport = d; this.gradients = {}; this.setSize(b,
            c, !1); var g; if (eb && a.getBoundingClientRect) this.subPixelFix = b = function () { L(a, { left: 0, top: 0 }); g = a.getBoundingClientRect(); L(a, { left: ja(g.left) - g.left + "px", top: ja(g.top) - g.top + "px" }) }, b(), J(O, "resize", b)
        }, isHidden: function () { return !this.boxWrapper.getBBox().width }, destroy: function () {
            var a = this.defs; this.box = null; this.boxWrapper = this.boxWrapper.destroy(); Ha(this.gradients || {}); this.gradients = null; if (a) this.defs = a.destroy(); this.subPixelFix && ba(O, "resize", this.subPixelFix); return this.alignedObjects =
            null
        }, createElement: function (a) { var b = new this.Element; b.init(this, a); return b }, draw: function () { }, buildText: function (a) {
            for (var b = a.element, c = this, d = c.forExport, e = o(a.textStr, "").toString().replace(/<(b|strong)>/g, '<span style="font-weight:bold">').replace(/<(i|em)>/g, '<span style="font-style:italic">').replace(/<a/g, "<span").replace(/<\/(b|strong|i|em|a)>/g, "</span>").split(/<br.*?>/g), f = b.childNodes, g = /style="([^"]+)"/, h = /href="([^"]+)"/, i = A(b, "x"), j = a.styles, k = j && j.width && u(j.width), m = j && j.lineHeight,
            l = f.length; l--;) b.removeChild(f[l]); k && !a.added && this.box.appendChild(b); e[e.length - 1] === "" && e.pop(); n(e, function (e, f) {
                var l, o = 0, e = e.replace(/<span/g, "|||<span").replace(/<\/span>/g, "</span>|||"); l = e.split("|||"); n(l, function (e) {
                    if (e !== "" || l.length === 1) {
                        var p = {}, n = z.createElementNS(sa, "tspan"), q; g.test(e) && (q = e.match(g)[1].replace(/(;| |^)color([ :])/, "$1fill$2"), A(n, "style", q)); h.test(e) && !d && (A(n, "onclick", 'location.href="' + e.match(h)[1] + '"'), L(n, { cursor: "pointer" })); e = (e.replace(/<(.|\n)*?>/g,
                        "") || " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">"); n.appendChild(z.createTextNode(e)); o ? p.dx = 0 : p.x = i; A(n, p); !o && f && (!Z && d && L(n, { display: "block" }), A(n, "dy", m || c.fontMetrics(/px$/.test(n.style.fontSize) ? n.style.fontSize : j.fontSize).h, db && n.offsetHeight)); b.appendChild(n); o++; if (k) for (var e = e.replace(/([^\^])-/g, "$1- ").split(" "), r, t = []; e.length || t.length;) delete a.bBox, r = a.getBBox().width, p = r > k, !p || e.length === 1 ? (e = t, t = [], e.length && (n = z.createElementNS(sa, "tspan"), A(n, { dy: m || 16, x: i }), q && A(n, "style",
                        q), b.appendChild(n), r > k && (k = r))) : (n.removeChild(n.firstChild), t.unshift(e.pop())), e.length && n.appendChild(z.createTextNode(e.join(" ").replace(/- /g, "-")))
                    }
                })
            })
        }, button: function (a, b, c, d, e, f, g) {
            var h = this.label(a, b, c, null, null, null, null, null, "button"), i = 0, j, k, m, l, p, a = { x1: 0, y1: 0, x2: 0, y2: 1 }, e = x({ "stroke-width": 1, stroke: "#CCCCCC", fill: { linearGradient: a, stops: [[0, "#FEFEFE"], [1, "#F6F6F6"]] }, r: 2, padding: 5, style: { color: "black" } }, e); m = e.style; delete e.style; f = x(e, {
                stroke: "#68A", fill: {
                    linearGradient: a, stops: [[0,
                    "#FFF"], [1, "#ACF"]]
                }
            }, f); l = f.style; delete f.style; g = x(e, { stroke: "#68A", fill: { linearGradient: a, stops: [[0, "#9BD"], [1, "#CDF"]] } }, g); p = g.style; delete g.style; J(h.element, "mouseenter", function () { h.attr(f).css(l) }); J(h.element, "mouseleave", function () { j = [e, f, g][i]; k = [m, l, p][i]; h.attr(j).css(k) }); h.setState = function (a) { (i = a) ? a === 2 && h.attr(g).css(p) : h.attr(e).css(m) }; return h.on("click", function () { d.call(h) }).attr(e).css(v({ cursor: "default" }, m))
        }, crispLine: function (a, b) {
            a[1] === a[4] && (a[1] = a[4] = t(a[1]) - b % 2 /
            2); a[2] === a[5] && (a[2] = a[5] = t(a[2]) + b % 2 / 2); return a
        }, path: function (a) { var b = { fill: S }; Da(a) ? b.d = a : V(a) && v(b, a); return this.createElement("path").attr(b) }, circle: function (a, b, c) { a = V(a) ? a : { x: a, y: b, r: c }; return this.createElement("circle").attr(a) }, arc: function (a, b, c, d, e, f) { if (V(a)) b = a.y, c = a.r, d = a.innerR, e = a.start, f = a.end, a = a.x; return this.symbol("arc", a || 0, b || 0, c || 0, c || 0, { innerR: d || 0, start: e || 0, end: f || 0 }) }, rect: function (a, b, c, d, e, f) {
            e = V(a) ? a.r : e; e = this.createElement("rect").attr({ rx: e, ry: e, fill: S }); return e.attr(V(a) ?
                a : e.crisp(f, a, b, q(c, 0), q(d, 0)))
        }, setSize: function (a, b, c) { var d = this.alignedObjects, e = d.length; this.width = a; this.height = b; for (this.boxWrapper[o(c, !0) ? "animate" : "attr"]({ width: a, height: b }) ; e--;) d[e].align() }, g: function (a) { var b = this.createElement("g"); return r(a) ? b.attr({ "class": "highcharts-" + a }) : b }, image: function (a, b, c, d, e) {
            var f = { preserveAspectRatio: S }; arguments.length > 1 && v(f, { x: b, y: c, width: d, height: e }); f = this.createElement("image").attr(f); f.element.setAttributeNS ? f.element.setAttributeNS("http://www.w3.org/1999/xlink",
            "href", a) : f.element.setAttribute("hc-svg-href", a); return f
        }, symbol: function (a, b, c, d, e, f) {
            var g, h = this.symbols[a], h = h && h(t(b), t(c), d, e, f), i = /^url\((.*?)\)$/, j, k; if (h) g = this.path(h), v(g, { symbolName: a, x: b, y: c, width: d, height: e }), f && v(g, f); else if (i.test(a)) k = function (a, b) { a.element && (a.attr({ width: b[0], height: b[1] }), a.alignByTranslate || a.translate(t((d - b[0]) / 2), t((e - b[1]) / 2))) }, j = a.match(i)[1], a = Nb[j], g = this.image(j).attr({ x: b, y: c }), g.isImg = !0, a ? k(g, a) : (g.attr({ width: 0, height: 0 }), U("img", {
                onload: function () {
                    k(g,
                    Nb[j] = [this.width, this.height])
                }, src: j
            })); return g
        }, symbols: {
            circle: function (a, b, c, d) { var e = 0.166 * c; return ["M", a + c / 2, b, "C", a + c + e, b, a + c + e, b + d, a + c / 2, b + d, "C", a - e, b + d, a - e, b, a + c / 2, b, "Z"] }, square: function (a, b, c, d) { return ["M", a, b, "L", a + c, b, a + c, b + d, a, b + d, "Z"] }, triangle: function (a, b, c, d) { return ["M", a + c / 2, b, "L", a + c, b + d, a, b + d, "Z"] }, "triangle-down": function (a, b, c, d) { return ["M", a, b, "L", a + c, b, a + c / 2, b + d, "Z"] }, diamond: function (a, b, c, d) { return ["M", a + c / 2, b, "L", a + c, b + d / 2, a + c / 2, b + d, a, b + d / 2, "Z"] }, arc: function (a, b, c, d,
            e) { var f = e.start, c = e.r || c || d, g = e.end - 0.001, d = e.innerR, h = e.open, i = Y(f), j = ca(f), k = Y(g), g = ca(g), e = e.end - f < Ka ? 0 : 1; return ["M", a + c * i, b + c * j, "A", c, c, 0, e, 1, a + c * k, b + c * g, h ? "M" : "L", a + d * k, b + d * g, "A", d, d, 0, e, 0, a + d * i, b + d * j, h ? "" : "Z"] }
        }, clipRect: function (a, b, c, d) { var e = "highcharts-" + ub++, f = this.createElement("clipPath").attr({ id: e }).add(this.defs), a = this.rect(a, b, c, d, 0).add(f); a.id = e; a.clipPath = f; return a }, color: function (a, b, c) {
            var d = this, e, f = /^rgba/, g, h, i, j, k, m, l, p = []; a && a.linearGradient ? g = "linearGradient" : a && a.radialGradient &&
            (g = "radialGradient"); if (g) {
                c = a[g]; h = d.gradients; j = a.stops; b = b.radialReference; Da(c) && (a[g] = c = { x1: c[0], y1: c[1], x2: c[2], y2: c[3], gradientUnits: "userSpaceOnUse" }); g === "radialGradient" && b && !r(c.gradientUnits) && (c = x(c, { cx: b[0] - b[2] / 2 + c.cx * b[2], cy: b[1] - b[2] / 2 + c.cy * b[2], r: c.r * b[2], gradientUnits: "userSpaceOnUse" })); for (l in c) l !== "id" && p.push(l, c[l]); for (l in j) p.push(j[l]); p = p.join(","); h[p] ? a = h[p].id : (c.id = a = "highcharts-" + ub++, h[p] = i = d.createElement(g).attr(c).add(d.defs), i.stops = [], n(j, function (a) {
                    f.test(a[1]) ?
                    (e = ma(a[1]), k = e.get("rgb"), m = e.get("a")) : (k = a[1], m = 1); a = d.createElement("stop").attr({ offset: a[0], "stop-color": k, "stop-opacity": m }).add(i); i.stops.push(a)
                })); return "url(" + d.url + "#" + a + ")"
            } else return f.test(a) ? (e = ma(a), A(b, c + "-opacity", e.get("a")), e.get("rgb")) : (b.removeAttribute(c + "-opacity"), a)
        }, text: function (a, b, c, d) {
            var e = N.chart.style, f = $ || !Z && this.forExport; if (d && !this.forExport) return this.html(a, b, c); b = t(o(b, 0)); c = t(o(c, 0)); a = this.createElement("text").attr({ x: b, y: c, text: a }).css({
                fontFamily: e.fontFamily,
                fontSize: e.fontSize
            }); f && a.css({ position: "absolute" }); a.x = b; a.y = c; return a
        }, html: function (a, b, c) {
            var d = N.chart.style, e = this.createElement("span"), f = e.attrSetters, g = e.element, h = e.renderer; f.text = function (a) { a !== g.innerHTML && delete this.bBox; g.innerHTML = a; return !1 }; f.x = f.y = f.align = function (a, b) { b === "align" && (b = "textAlign"); e[b] = a; e.htmlUpdateTransform(); return !1 }; e.attr({ text: a, x: t(b), y: t(c) }).css({ position: "absolute", whiteSpace: "nowrap", fontFamily: d.fontFamily, fontSize: d.fontSize }); e.css = e.htmlCss;
            if (h.isSVG) e.add = function (a) { var b, c = h.box.parentNode, d = []; if (a) { if (b = a.div, !b) { for (; a;) d.push(a), a = a.parentGroup; n(d.reverse(), function (a) { var d; b = a.div = a.div || U(ya, { className: A(a.element, "class") }, { position: "absolute", left: (a.translateX || 0) + "px", top: (a.translateY || 0) + "px" }, b || c); d = b.style; v(a.attrSetters, { translateX: function (a) { d.left = a + "px" }, translateY: function (a) { d.top = a + "px" }, visibility: function (a, b) { d[b] = a } }) }) } } else b = c; b.appendChild(g); e.added = !0; e.alignOnAdd && e.htmlUpdateTransform(); return e };
            return e
        }, fontMetrics: function (a) { var a = u(a || 11), a = a < 24 ? a + 4 : t(a * 1.2), b = t(a * 0.8); return { h: a, b: b } }, label: function (a, b, c, d, e, f, g, h, i) {
            function j() {
                var a, b; a = o.element.style; w = (Ma === void 0 || yb === void 0 || s.styles.textAlign) && o.getBBox(); s.width = (Ma || w.width || 0) + 2 * q + hb; s.height = (yb || w.height || 0) + 2 * q; A = q + p.fontMetrics(a && a.fontSize).b; if (z) {
                    if (!B) a = t(-G * q), b = h ? -A : 0, s.box = B = d ? p.symbol(d, a, b, s.width, s.height) : p.rect(a, b, s.width, s.height, 0, u[Pb]), B.add(s); B.isImg || B.attr(x({ width: s.width, height: s.height }, u));
                    u = null
                }
            } function k() { var a = s.styles, a = a && a.textAlign, b = hb + q * (1 - G), c; c = h ? 0 : A; if (r(Ma) && (a === "center" || a === "right")) b += { center: 0.5, right: 1 }[a] * (Ma - w.width); (b !== o.x || c !== o.y) && o.attr({ x: b, y: c }); o.x = b; o.y = c } function m(a, b) { B ? B.attr(a, b) : u[a] = b } function l() { o.add(s); s.attr({ text: a, x: b, y: c }); B && r(e) && s.attr({ anchorX: e, anchorY: f }) } var p = this, s = p.g(i), o = p.text("", 0, 0, g).attr({ zIndex: 1 }), B, w, G = 0, q = 3, hb = 0, Ma, yb, P, H, C = 0, u = {}, A, g = s.attrSetters, z; J(s, "add", l); g.width = function (a) { Ma = a; return !1 }; g.height = function (a) {
                yb =
                a; return !1
            }; g.padding = function (a) { r(a) && a !== q && (q = a, k()); return !1 }; g.paddingLeft = function (a) { r(a) && a !== hb && (hb = a, k()); return !1 }; g.align = function (a) { G = { left: 0, center: 0.5, right: 1 }[a]; return !1 }; g.text = function (a, b) { o.attr(b, a); j(); k(); return !1 }; g[Pb] = function (a, b) { z = !0; C = a % 2 / 2; m(b, a); return !1 }; g.stroke = g.fill = g.r = function (a, b) { b === "fill" && (z = !0); m(b, a); return !1 }; g.anchorX = function (a, b) { e = a; m(b, a + C - P); return !1 }; g.anchorY = function (a, b) { f = a; m(b, a - H); return !1 }; g.x = function (a) {
                s.x = a; a -= G * ((Ma || w.width) + q);
                P = t(a); s.attr("translateX", P); return !1
            }; g.y = function (a) { H = s.y = t(a); s.attr("translateY", H); return !1 }; var E = s.css; return v(s, {
                css: function (a) { if (a) { var b = {}, a = x(a); n("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration".split(","), function (c) { a[c] !== y && (b[c] = a[c], delete a[c]) }); o.css(b) } return E.call(s, a) }, getBBox: function () { return { width: w.width + 2 * q, height: w.height + 2 * q, x: w.x - q, y: w.y - q } }, shadow: function (a) { B && B.shadow(a); return s }, destroy: function () {
                    ba(s, "add", l); ba(s.element, "mouseenter");
                    ba(s.element, "mouseleave"); o && (o = o.destroy()); B && (B = B.destroy()); ra.prototype.destroy.call(s); s = p = j = k = m = l = null
                }
            })
        }
    }; Sa = Ca; var F; if (!Z && !$) {
        Highcharts.VMLElement = F = {
            init: function (a, b) {
                var c = ["<", b, ' filled="f" stroked="f"'], d = ["position: ", "absolute", ";"], e = b === ya; (b === "shape" || e) && d.push("left:0;top:0;width:1px;height:1px;"); d.push("visibility: ", e ? "hidden" : "visible"); c.push(' style="', d.join(""), '"/>'); if (b) c = e || b === "span" || b === "img" ? c.join("") : a.prepVML(c), this.element = U(c); this.renderer = a; this.attrSetters =
                {}
            }, add: function (a) { var b = this.renderer, c = this.element, d = b.box, d = a ? a.element || a : d; a && a.inverted && b.invertChild(c, d); d.appendChild(c); this.added = !0; this.alignOnAdd && !this.deferUpdateTransform && this.updateTransform(); D(this, "add"); return this }, updateTransform: ra.prototype.htmlUpdateTransform, attr: function (a, b) {
                var c, d, e, f = this.element || {}, g = f.style, h = f.nodeName, i = this.renderer, j = this.symbolName, k, m = this.shadows, l, p = this.attrSetters, s = this; fa(a) && r(b) && (c = a, a = {}, a[c] = b); if (fa(a)) c = a, s = c === "strokeWidth" ||
                c === "stroke-width" ? this.strokeweight : this[c]; else for (c in a) if (d = a[c], l = !1, e = p[c] && p[c].call(this, d, c), e !== !1 && d !== null) {
                    e !== y && (d = e); if (j && /^(x|y|r|start|end|width|height|innerR|anchorX|anchorY)/.test(c)) k || (this.symbolAttr(a), k = !0), l = !0; else if (c === "d") {
                        d = d || []; this.d = d.join(" "); e = d.length; l = []; for (var o; e--;) if (Ea(d[e])) l[e] = t(d[e] * 10) - 5; else if (d[e] === "Z") l[e] = "x"; else if (l[e] = d[e], d.isArc && (d[e] === "wa" || d[e] === "at")) o = d[e] === "wa" ? 1 : -1, l[e + 5] === l[e + 7] && (l[e + 7] -= o), l[e + 6] === l[e + 8] && (l[e + 8] -=
                        o); d = l.join(" ") || "x"; f.path = d; if (m) for (e = m.length; e--;) m[e].path = m[e].cutOff ? this.cutOffPath(d, m[e].cutOff) : d; l = !0
                    } else if (c === "visibility") { if (m) for (e = m.length; e--;) m[e].style[c] = d; h === "DIV" && (d = d === "hidden" ? "-999em" : 0, cb || (g[c] = d ? "visible" : "hidden"), c = "top"); g[c] = d; l = !0 } else if (c === "zIndex") d && (g[c] = d), l = !0; else if (la(c, ["x", "y", "width", "height"]) !== -1) this[c] = d, c === "x" || c === "y" ? c = { x: "left", y: "top" }[c] : d = q(0, d), this.updateClipping ? (this[c] = d, this.updateClipping()) : g[c] = d, l = !0; else if (c === "class" &&
                    h === "DIV") f.className = d; else if (c === "stroke") d = i.color(d, f, c), c = "strokecolor"; else if (c === "stroke-width" || c === "strokeWidth") f.stroked = d ? !0 : !1, c = "strokeweight", this[c] = d, Ea(d) && (d += "px"); else if (c === "dashstyle") (f.getElementsByTagName("stroke")[0] || U(i.prepVML(["<stroke/>"]), null, null, f))[c] = d || "solid", this.dashstyle = d, l = !0; else if (c === "fill") if (h === "SPAN") g.color = d; else { if (h !== "IMG") f.filled = d !== S ? !0 : !1, d = i.color(d, f, c, this), c = "fillcolor" } else if (c === "opacity") l = !0; else if (h === "shape" && c === "rotation") this[c] =
                    d, f.style.left = -t(ca(d * bb) + 1) + "px", f.style.top = t(Y(d * bb)) + "px"; else if (c === "translateX" || c === "translateY" || c === "rotation") this[c] = d, this.updateTransform(), l = !0; else if (c === "text") this.bBox = null, f.innerHTML = d, l = !0; l || (cb ? f[c] = d : A(f, c, d))
                } return s
            }, clip: function (a) { var b = this, c; a ? (c = a.members, ga(c, b), c.push(b), b.destroyClip = function () { ga(c, b) }, a = a.getCSS(b)) : (b.destroyClip && b.destroyClip(), a = { clip: cb ? "inherit" : "rect(auto)" }); return b.css(a) }, css: ra.prototype.htmlCss, safeRemoveChild: function (a) {
                a.parentNode &&
                Ra(a)
            }, destroy: function () { this.destroyClip && this.destroyClip(); return ra.prototype.destroy.apply(this) }, on: function (a, b) { this.element["on" + a] = function () { var a = O.event; a.target = a.srcElement; b(a) }; return this }, cutOffPath: function (a, b) { var c, a = a.split(/[ ,]/); c = a.length; if (c === 9 || c === 11) a[c - 4] = a[c - 2] = u(a[c - 2]) - 10 * b; return a.join(" ") }, shadow: function (a, b, c) {
                var d = [], e, f = this.element, g = this.renderer, h, i = f.style, j, k = f.path, m, l, p, s; k && typeof k.value !== "string" && (k = "x"); l = k; if (a) {
                    p = o(a.width, 3); s = (a.opacity ||
                    0.15) / p; for (e = 1; e <= 3; e++) { m = p * 2 + 1 - 2 * e; c && (l = this.cutOffPath(k.value, m + 0.5)); j = ['<shape isShadow="true" strokeweight="', m, '" filled="false" path="', l, '" coordsize="10 10" style="', f.style.cssText, '" />']; h = U(g.prepVML(j), null, { left: u(i.left) + o(a.offsetX, 1), top: u(i.top) + o(a.offsetY, 1) }); if (c) h.cutOff = m + 1; j = ['<stroke color="', a.color || "black", '" opacity="', s * e, '"/>']; U(g.prepVML(j), null, null, h); b ? b.element.appendChild(h) : f.parentNode.insertBefore(h, f); d.push(h) } this.shadows = d
                } return this
            }
        }; F = ea(ra, F);
        var na = {
            Element: F, isIE8: Aa.indexOf("MSIE 8.0") > -1, init: function (a, b, c) { var d, e; this.alignedObjects = []; d = this.createElement(ya); e = d.element; e.style.position = "relative"; a.appendChild(d.element); this.isVML = !0; this.box = e; this.boxWrapper = d; this.setSize(b, c, !1); if (!z.namespaces.hcv) z.namespaces.add("hcv", "urn:schemas-microsoft-com:vml"), z.createStyleSheet().cssText = "hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } " }, isHidden: function () { return !this.box.offsetWidth },
            clipRect: function (a, b, c, d) { var e = this.createElement(), f = V(a); return v(e, { members: [], left: f ? a.x : a, top: f ? a.y : b, width: f ? a.width : c, height: f ? a.height : d, getCSS: function (a) { var b = a.element, c = b.nodeName, a = a.inverted, d = this.top - (c === "shape" ? b.offsetTop : 0), e = this.left, b = e + this.width, f = d + this.height, d = { clip: "rect(" + t(a ? e : d) + "px," + t(a ? f : b) + "px," + t(a ? b : f) + "px," + t(a ? d : e) + "px)" }; !a && cb && c === "DIV" && v(d, { width: b + "px", height: f + "px" }); return d }, updateClipping: function () { n(e.members, function (a) { a.css(e.getCSS(a)) }) } }) },
            color: function (a, b, c, d) {
                var e = this, f, g = /^rgba/, h, i, j = S; a && a.linearGradient ? i = "gradient" : a && a.radialGradient && (i = "pattern"); if (i) {
                    var k, m, l = a.linearGradient || a.radialGradient, p, s, o, B, w, q = "", a = a.stops, r, t = [], y = function () { h = ['<fill colors="' + t.join(",") + '" opacity="', o, '" o:opacity2="', s, '" type="', i, '" ', q, 'focus="100%" method="any" />']; U(e.prepVML(h), null, null, b) }; p = a[0]; r = a[a.length - 1]; p[0] > 0 && a.unshift([0, p[1]]); r[0] < 1 && a.push([1, r[1]]); n(a, function (a, b) {
                        g.test(a[1]) ? (f = ma(a[1]), k = f.get("rgb"),
                        m = f.get("a")) : (k = a[1], m = 1); t.push(a[0] * 100 + "% " + k); b ? (o = m, B = k) : (s = m, w = k)
                    }); if (c === "fill") if (i === "gradient") c = l.x1 || l[0] || 0, a = l.y1 || l[1] || 0, p = l.x2 || l[2] || 0, l = l.y2 || l[3] || 0, q = 'angle="' + (90 - I.atan((l - a) / (p - c)) * 180 / Ka) + '"', y(); else {
                        var j = l.r, v = j * 2, P = j * 2, H = l.cx, C = l.cy, x = b.radialReference, u, j = function () {
                            x && (u = d.getBBox(), H += (x[0] - u.x) / u.width - 0.5, C += (x[1] - u.y) / u.height - 0.5, v *= x[2] / u.width, P *= x[2] / u.height); q = 'src="' + N.global.VMLRadialGradientURL + '" size="' + v + "," + P + '" origin="0.5,0.5" position="' + H + "," +
                            C + '" color2="' + w + '" '; y()
                        }; d.added ? j() : J(d, "add", j); j = B
                    } else j = k
                } else if (g.test(a) && b.tagName !== "IMG") f = ma(a), h = ["<", c, ' opacity="', f.get("a"), '"/>'], U(this.prepVML(h), null, null, b), j = f.get("rgb"); else { j = b.getElementsByTagName(c); if (j.length) j[0].opacity = 1, j[0].type = "solid"; j = a } return j
            }, prepVML: function (a) {
                var b = this.isIE8, a = a.join(""); b ? (a = a.replace("/>", ' xmlns="urn:schemas-microsoft-com:vml" />'), a = a.indexOf('style="') === -1 ? a.replace("/>", ' style="display:inline-block;behavior:url(#default#VML);" />') :
                a.replace('style="', 'style="display:inline-block;behavior:url(#default#VML);')) : a = a.replace("<", "<hcv:"); return a
            }, text: Ca.prototype.html, path: function (a) { var b = { coordsize: "10 10" }; Da(a) ? b.d = a : V(a) && v(b, a); return this.createElement("shape").attr(b) }, circle: function (a, b, c) { var d = this.symbol("circle"); if (V(a)) c = a.r, b = a.y, a = a.x; d.isCircle = !0; return d.attr({ x: a, y: b, width: 2 * c, height: 2 * c }) }, g: function (a) { var b; a && (b = { className: "highcharts-" + a, "class": "highcharts-" + a }); return this.createElement(ya).attr(b) },
            image: function (a, b, c, d, e) { var f = this.createElement("img").attr({ src: a }); arguments.length > 1 && f.attr({ x: b, y: c, width: d, height: e }); return f }, rect: function (a, b, c, d, e, f) { if (V(a)) b = a.y, c = a.width, d = a.height, f = a.strokeWidth, a = a.x; var g = this.symbol("rect"); g.r = e; return g.attr(g.crisp(f, a, b, q(c, 0), q(d, 0))) }, invertChild: function (a, b) { var c = b.style; L(a, { flip: "x", left: u(c.width) - 1, top: u(c.height) - 1, rotation: -90 }) }, symbols: {
                arc: function (a, b, c, d, e) {
                    var f = e.start, g = e.end, h = e.r || c || d, c = e.innerR, d = Y(f), i = ca(f), j = Y(g),
                    k = ca(g); if (g - f === 0) return ["x"]; f = ["wa", a - h, b - h, a + h, b + h, a + h * d, b + h * i, a + h * j, b + h * k]; e.open && !c && f.push("e", "M", a, b); f.push("at", a - c, b - c, a + c, b + c, a + c * j, b + c * k, a + c * d, b + c * i, "x", "e"); f.isArc = !0; return f
                }, circle: function (a, b, c, d, e) { e && e.isCircle && (a -= c / 2, b -= d / 2); return ["wa", a, b, a + c, b + d, a + c, b + d / 2, a + c, b + d / 2, "e"] }, rect: function (a, b, c, d, e) {
                    var f = a + c, g = b + d, h; !r(e) || !e.r ? f = Ca.prototype.symbols.square.apply(0, arguments) : (h = K(e.r, c, d), f = ["M", a + h, b, "L", f - h, b, "wa", f - 2 * h, b, f, b + 2 * h, f - h, b, f, b + h, "L", f, g - h, "wa", f - 2 * h, g - 2 *
                    h, f, g, f, g - h, f - h, g, "L", a + h, g, "wa", a, g - 2 * h, a + 2 * h, g, a + h, g, a, g - h, "L", a, b + h, "wa", a, b, a + 2 * h, b + 2 * h, a, b + h, a + h, b, "x", "e"]); return f
                }
            }
        }; Highcharts.VMLRenderer = F = function () { this.init.apply(this, arguments) }; F.prototype = x(Ca.prototype, na); Sa = F
    } var Rb; if ($) Highcharts.CanVGRenderer = F = function () { sa = "http://www.w3.org/1999/xhtml" }, F.prototype.symbols = {}, Rb = function () { function a() { var a = b.length, d; for (d = 0; d < a; d++) b[d](); b = [] } var b = []; return { push: function (c, d) { b.length === 0 && Tb(d, a); b.push(c) } } }(), Sa = F; Ja.prototype =
    {
        addLabel: function () {
            var a = this.axis, b = a.options, c = a.chart, d = a.horiz, e = a.categories, f = a.series[0] && a.series[0].names, g = this.pos, h = b.labels, i = a.tickPositions, d = d && e && !h.step && !h.staggerLines && !h.rotation && c.plotWidth / i.length || !d && (c.optionsMarginLeft || c.plotWidth / 2), j = g === i[0], k = g === i[i.length - 1], f = e ? o(e[g], f && f[g], g) : g, e = this.label, i = i.info, m; a.isDatetimeAxis && i && (m = b.dateTimeLabelFormats[i.higherRanks[g] || i.unitName]); this.isFirst = j; this.isLast = k; b = a.labelFormatter.call({
                axis: a, chart: c, isFirst: j,
                isLast: k, dateTimeLabelFormat: m, value: a.isLog ? ia(da(f)) : f
            }); g = d && { width: q(1, t(d - 2 * (h.padding || 10))) + "px" }; g = v(g, h.style); if (r(e)) e && e.attr({ text: b }).css(g); else { d = { align: h.align }; if (Ea(h.rotation)) d.rotation = h.rotation; this.label = r(b) && h.enabled ? c.renderer.text(b, 0, 0, h.useHTML).attr(d).css(g).add(a.labelGroup) : null }
        }, getLabelSize: function () { var a = this.label, b = this.axis; return a ? (this.labelBBox = a.getBBox())[b.horiz ? "height" : "width"] : 0 }, getLabelSides: function () {
            var a = this.axis.options.labels, b = this.labelBBox.width,
            a = b * { left: 0, center: 0.5, right: 1 }[a.align] - a.x; return [-a, b - a]
        }, handleOverflow: function (a, b) { var c = !0, d = this.axis, e = d.chart, f = this.isFirst, g = this.isLast, h = b.x, i = d.reversed, j = d.tickPositions; if (f || g) { var k = this.getLabelSides(), m = k[0], k = k[1], e = e.plotLeft, l = e + d.len, j = (d = d.ticks[j[a + (f ? 1 : -1)]]) && d.label.xy && d.label.xy.x + d.getLabelSides()[f ? 0 : 1]; f && !i || g && i ? h + m < e && (h = e - m, d && h + k > j && (c = !1)) : h + k > l && (h = l - k, d && h + m < j && (c = !1)); b.x = h } return c }, getPosition: function (a, b, c, d) {
            var e = this.axis, f = e.chart, g = d && f.oldChartHeight ||
            f.chartHeight; return { x: a ? e.translate(b + c, null, null, d) + e.transB : e.left + e.offset + (e.opposite ? (d && f.oldChartWidth || f.chartWidth) - e.right - e.left : 0), y: a ? g - e.bottom + e.offset - (e.opposite ? e.height : 0) : g - e.translate(b + c, null, null, d) - e.transB }
        }, getLabelPosition: function (a, b, c, d, e, f, g, h) { var i = this.axis, j = i.transA, k = i.reversed, i = i.staggerLines, a = a + e.x - (f && d ? f * j * (k ? -1 : 1) : 0), b = b + e.y - (f && !d ? f * j * (k ? 1 : -1) : 0); r(e.y) || (b += u(c.styles.lineHeight) * 0.9 - c.getBBox().height / 2); i && (b += g / (h || 1) % i * 16); return { x: a, y: b } }, getMarkPath: function (a,
        b, c, d, e, f) { return f.crispLine(["M", a, b, "L", a + (e ? 0 : -c), b + (e ? c : 0)], d) }, render: function (a, b, c) {
            var d = this.axis, e = d.options, f = d.chart.renderer, g = d.horiz, h = this.type, i = this.label, j = this.pos, k = e.labels, m = this.gridLine, l = h ? h + "Grid" : "grid", p = h ? h + "Tick" : "tick", s = e[l + "LineWidth"], n = e[l + "LineColor"], B = e[l + "LineDashStyle"], w = e[p + "Length"], l = e[p + "Width"] || 0, q = e[p + "Color"], r = e[p + "Position"], p = this.mark, t = k.step, v = !0, u = d.tickmarkOffset, P = this.getPosition(g, j, u, b), H = P.x, P = P.y, C = g && H === d.pos || !g && P === d.pos + d.len ?
            -1 : 1, x = d.staggerLines; this.isActive = !0; if (s) { j = d.getPlotLinePath(j + u, s * C, b, !0); if (m === y) { m = { stroke: n, "stroke-width": s }; if (B) m.dashstyle = B; if (!h) m.zIndex = 1; if (b) m.opacity = 0; this.gridLine = m = s ? f.path(j).attr(m).add(d.gridGroup) : null } if (!b && m && j) m[this.isNew ? "attr" : "animate"]({ d: j, opacity: c }) } if (l && w) r === "inside" && (w = -w), d.opposite && (w = -w), b = this.getMarkPath(H, P, w, l * C, g, f), p ? p.animate({ d: b, opacity: c }) : this.mark = f.path(b).attr({ stroke: q, "stroke-width": l, opacity: c }).add(d.axisGroup); if (i && !isNaN(H)) i.xy =
            P = this.getLabelPosition(H, P, i, g, k, u, a, t), this.isFirst && !o(e.showFirstLabel, 1) || this.isLast && !o(e.showLastLabel, 1) ? v = !1 : !x && g && k.overflow === "justify" && !this.handleOverflow(a, P) && (v = !1), t && a % t && (v = !1), v && !isNaN(P.y) ? (P.opacity = c, i[this.isNew ? "attr" : "animate"](P), this.isNew = !1) : i.attr("y", -9999)
        }, destroy: function () { Ha(this, this.axis) }
    }; pb.prototype = {
        render: function () {
            var a = this, b = a.axis, c = b.horiz, d = (b.pointRange || 0) / 2, e = a.options, f = e.label, g = a.label, h = e.width, i = e.to, j = e.from, k = r(j) && r(i), m = e.value, l =
            e.dashStyle, p = a.svgElem, s = [], n, B = e.color, w = e.zIndex, G = e.events, t = b.chart.renderer; b.isLog && (j = ka(j), i = ka(i), m = ka(m)); if (h) { if (s = b.getPlotLinePath(m, h), d = { stroke: B, "stroke-width": h }, l) d.dashstyle = l } else if (k) { if (j = q(j, b.min - d), i = K(i, b.max + d), s = b.getPlotBandPath(j, i, e), d = { fill: B }, e.borderWidth) d.stroke = e.borderColor, d["stroke-width"] = e.borderWidth } else return; if (r(w)) d.zIndex = w; if (p) s ? p.animate({ d: s }, null, p.onGetPath) : (p.hide(), p.onGetPath = function () { p.show() }); else if (s && s.length && (a.svgElem = p = t.path(s).attr(d).add(),
            G)) for (n in e = function (b) { p.on(b, function (c) { G[b].apply(a, [c]) }) }, G) e(n); if (f && r(f.text) && s && s.length && b.width > 0 && b.height > 0) { f = x({ align: c && k && "center", x: c ? !k && 4 : 10, verticalAlign: !c && k && "middle", y: c ? k ? 16 : 10 : k ? 6 : -4, rotation: c && !k && 90 }, f); if (!g) a.label = g = t.text(f.text, 0, 0).attr({ align: f.textAlign || f.align, rotation: f.rotation, zIndex: w }).css(f.style).add(); b = [s[1], s[4], o(s[6], s[1])]; s = [s[2], s[5], o(s[7], s[2])]; c = Ga(b); k = Ga(s); g.align(f, !1, { x: c, y: k, width: pa(b) - c, height: pa(s) - k }); g.show() } else g && g.hide();
            return a
        }, destroy: function () { ga(this.axis.plotLinesAndBands, this); Ha(this, this.axis) }
    }; Kb.prototype = {
        destroy: function () { Ha(this, this.axis) }, setTotal: function (a) { this.cum = this.total = a }, render: function (a) { var b = this.options, c = b.format, c = c ? wa(c, this) : b.formatter.call(this); this.label ? this.label.attr({ text: c, visibility: "hidden" }) : this.label = this.axis.chart.renderer.text(c, 0, 0, b.useHTML).css(b.style).attr({ align: this.textAlign, rotation: b.rotation, visibility: "hidden" }).add(a) }, setOffset: function (a, b) {
            var c =
            this.axis, d = c.chart, e = d.inverted, f = this.isNegative, g = c.translate(this.percent ? 100 : this.total, 0, 0, 0, 1), c = c.translate(0), c = Q(g - c), h = d.xAxis[0].translate(this.x) + a, i = d.plotHeight, f = { x: e ? f ? g : g - c : h, y: e ? i - h - b : f ? i - g - c : i - g, width: e ? c : b, height: e ? b : c }; if (e = this.label) e.align(this.alignOptions, null, f), f = e.alignAttr, e.attr({ visibility: this.options.crop === !1 || d.isInsidePlot(f.x, f.y) ? Z ? "inherit" : "visible" : "hidden" })
        }
    }; ab.prototype = {
        defaultOptions: {
            dateTimeLabelFormats: {
                millisecond: "%H:%M:%S.%L", second: "%H:%M:%S",
                minute: "%H:%M", hour: "%H:%M", day: "%e. %b", week: "%e. %b", month: "%b '%y", year: "%Y"
            }, endOnTick: !1, gridLineColor: "#C0C0C0", labels: M, lineColor: "#C0D0E0", lineWidth: 1, minPadding: 0.01, maxPadding: 0.01, minorGridLineColor: "#E0E0E0", minorGridLineWidth: 1, minorTickColor: "#A0A0A0", minorTickLength: 2, minorTickPosition: "outside", startOfWeek: 1, startOnTick: !1, tickColor: "#C0D0E0", tickLength: 5, tickmarkPlacement: "between", tickPixelInterval: 100, tickPosition: "outside", tickWidth: 1, title: {
                align: "middle", style: {
                    color: "#4d759e",
                    fontWeight: "bold"
                }
            }, type: "linear"
        }, defaultYAxisOptions: { endOnTick: !0, gridLineWidth: 1, tickPixelInterval: 72, showLastLabel: !0, labels: { align: "right", x: -8, y: 3 }, lineWidth: 0, maxPadding: 0.05, minPadding: 0.05, startOnTick: !0, tickWidth: 0, title: { rotation: 270, text: "Values" }, stackLabels: { enabled: !1, formatter: function () { return ua(this.total, -1) }, style: M.style } }, defaultLeftAxisOptions: { labels: { align: "right", x: -8, y: null }, title: { rotation: 270 } }, defaultRightAxisOptions: { labels: { align: "left", x: 8, y: null }, title: { rotation: 90 } },
        defaultBottomAxisOptions: { labels: { align: "center", x: 0, y: 14 }, title: { rotation: 0 } }, defaultTopAxisOptions: { labels: { align: "center", x: 0, y: -5 }, title: { rotation: 0 } }, init: function (a, b) {
            var c = b.isX; this.horiz = a.inverted ? !c : c; this.xOrY = (this.isXAxis = c) ? "x" : "y"; this.opposite = b.opposite; this.side = this.horiz ? this.opposite ? 0 : 2 : this.opposite ? 1 : 3; this.setOptions(b); var d = this.options, e = d.type; this.labelFormatter = d.labels.formatter || this.defaultLabelFormatter; this.staggerLines = this.horiz && d.labels.staggerLines; this.userOptions =
            b; this.minPixelPadding = 0; this.chart = a; this.reversed = d.reversed; this.zoomEnabled = d.zoomEnabled !== !1; this.categories = d.categories || e === "category"; this.isLog = e === "logarithmic"; this.isDatetimeAxis = e === "datetime"; this.isLinked = r(d.linkedTo); this.tickmarkOffset = this.categories && d.tickmarkPlacement === "between" ? 0.5 : 0; this.ticks = {}; this.minorTicks = {}; this.plotLinesAndBands = []; this.alternateBands = {}; this.len = 0; this.minRange = this.userMinRange = d.minRange || d.maxZoom; this.range = d.range; this.offset = d.offset || 0;
            this.stacks = {}; this._stacksTouched = 0; this.min = this.max = null; var f, d = this.options.events; la(this, a.axes) === -1 && (a.axes.push(this), a[c ? "xAxis" : "yAxis"].push(this)); this.series = this.series || []; if (a.inverted && c && this.reversed === y) this.reversed = !0; this.removePlotLine = this.removePlotBand = this.removePlotBandOrLine; for (f in d) J(this, f, d[f]); if (this.isLog) this.val2lin = ka, this.lin2val = da
        }, setOptions: function (a) {
            this.options = x(this.defaultOptions, this.isXAxis ? {} : this.defaultYAxisOptions, [this.defaultTopAxisOptions,
            this.defaultRightAxisOptions, this.defaultBottomAxisOptions, this.defaultLeftAxisOptions][this.side], x(N[this.isXAxis ? "xAxis" : "yAxis"], a))
        }, update: function (a, b) { var c = this.chart, a = c.options[this.xOrY + "Axis"][this.options.index] = x(this.userOptions, a); this.destroy(); this._addedPlotLB = !1; this.init(c, a); c.isDirtyBox = !0; o(b, !0) && c.redraw() }, remove: function (a) {
            var b = this.chart, c = this.xOrY + "Axis"; n(this.series, function (a) { a.remove(!1) }); ga(b.axes, this); ga(b[c], this); b.options[c].splice(this.options.index,
            1); n(b[c], function (a, b) { a.options.index = b }); this.destroy(); b.isDirtyBox = !0; o(a, !0) && b.redraw()
        }, defaultLabelFormatter: function () { var a = this.axis, b = this.value, c = a.categories, d = this.dateTimeLabelFormat, e = N.lang.numericSymbols, f = e && e.length, g, h = a.options.labels.format, a = a.isLog ? b : a.tickInterval; if (h) g = wa(h, this); else if (c) g = b; else if (d) g = Ua(d, b); else if (f && a >= 1E3) for (; f-- && g === y;) c = Math.pow(1E3, f + 1), a >= c && e[f] !== null && (g = ua(b / c, -1) + e[f]); g === y && (g = b >= 1E3 ? ua(b, 0) : ua(b, -1)); return g }, getSeriesExtremes: function () {
            var a =
            this, b = a.chart, c = a.stacks, d = [], e = [], f = a._stacksTouched += 1, g, h; a.hasVisibleSeries = !1; a.dataMin = a.dataMax = null; n(a.series, function (g) {
                if (g.visible || !b.options.chart.ignoreHiddenSeries) {
                    var j = g.options, k, m, l, p, s, n, B, w, G, t = j.threshold, v, u = [], x = 0; a.hasVisibleSeries = !0; if (a.isLog && t <= 0) t = j.threshold = null; if (a.isXAxis) { if (j = g.xData, j.length) a.dataMin = K(o(a.dataMin, j[0]), Ga(j)), a.dataMax = q(o(a.dataMax, j[0]), pa(j)) } else {
                        var P, H, C, A = g.cropped, z = g.xAxis.getExtremes(), E = !!g.modifyValue; k = j.stacking; a.usePercentage =
                        k === "percent"; if (k) s = j.stack, p = g.type + o(s, ""), n = "-" + p, g.stackKey = p, m = d[p] || [], d[p] = m, l = e[n] || [], e[n] = l; if (a.usePercentage) a.dataMin = 0, a.dataMax = 99; j = g.processedXData; B = g.processedYData; v = B.length; for (h = 0; h < v; h++) {
                            w = j[h]; G = B[h]; if (k) H = (P = G < t) ? l : m, C = P ? n : p, r(H[w]) ? (H[w] = ia(H[w] + G), G = [G, H[w]]) : H[w] = G, c[C] || (c[C] = {}), c[C][w] || (c[C][w] = new Kb(a, a.options.stackLabels, P, w, s, k)), c[C][w].setTotal(H[w]), c[C][w].touched = f; if (G !== null && G !== y && (!a.isLog || G.length || G > 0)) if (E && (G = g.modifyValue(G)), g.getExtremesFromAll ||
                            A || (j[h + 1] || w) >= z.min && (j[h - 1] || w) <= z.max) if (w = G.length) for (; w--;) G[w] !== null && (u[x++] = G[w]); else u[x++] = G
                        } if (!a.usePercentage && u.length) g.dataMin = k = Ga(u), g.dataMax = g = pa(u), a.dataMin = K(o(a.dataMin, k), k), a.dataMax = q(o(a.dataMax, g), g); if (r(t)) if (a.dataMin >= t) a.dataMin = t, a.ignoreMinPadding = !0; else if (a.dataMax < t) a.dataMax = t, a.ignoreMaxPadding = !0
                    }
                }
            }); for (g in c) for (h in c[g]) c[g][h].touched < f && (c[g][h].destroy(), delete c[g][h])
        }, translate: function (a, b, c, d, e, f) {
            var g = this.len, h = 1, i = 0, j = d ? this.oldTransA :
            this.transA, d = d ? this.oldMin : this.min, k = this.minPixelPadding, e = (this.options.ordinal || this.isLog && e) && this.lin2val; if (!j) j = this.transA; c && (h *= -1, i = g); this.reversed && (h *= -1, i -= h * g); b ? (a = a * h + i, a -= k, a = a / j + d, e && (a = this.lin2val(a))) : (e && (a = this.val2lin(a)), a = h * (a - d) * j + i + h * k + (f ? j * this.pointRange / 2 : 0)); return a
        }, toPixels: function (a, b) { return this.translate(a, !1, !this.horiz, null, !0) + (b ? 0 : this.pos) }, toValue: function (a, b) { return this.translate(a - (b ? 0 : this.pos), !0, !this.horiz, null, !0) }, getPlotLinePath: function (a,
        b, c, d) { var e = this.chart, f = this.left, g = this.top, h, i, j, a = this.translate(a, null, null, c), k = c && e.oldChartHeight || e.chartHeight, m = c && e.oldChartWidth || e.chartWidth, l; h = this.transB; c = i = t(a + h); h = j = t(k - a - h); if (isNaN(a)) l = !0; else if (this.horiz) { if (h = g, j = k - this.bottom, c < f || c > f + this.width) l = !0 } else if (c = f, i = m - this.right, h < g || h > g + this.height) l = !0; return l && !d ? null : e.renderer.crispLine(["M", c, h, "L", i, j], b || 0) }, getPlotBandPath: function (a, b) {
            var c = this.getPlotLinePath(b), d = this.getPlotLinePath(a); d && c ? d.push(c[4],
            c[5], c[1], c[2]) : d = null; return d
        }, getLinearTickPositions: function (a, b, c) { for (var d, b = ia(T(b / a) * a), c = ia(ja(c / a) * a), e = []; b <= c;) { e.push(b); b = ia(b + a); if (b === d) break; d = b } return e }, getLogTickPositions: function (a, b, c, d) {
            var e = this.options, f = this.len, g = []; if (!d) this._minorAutoInterval = null; if (a >= 0.5) a = t(a), g = this.getLinearTickPositions(a, b, c); else if (a >= 0.08) for (var f = T(b), h, i, j, k, m, e = a > 0.3 ? [1, 2, 4] : a > 0.15 ? [1, 2, 4, 6, 8] : [1, 2, 3, 4, 5, 6, 7, 8, 9]; f < c + 1 && !m; f++) {
                i = e.length; for (h = 0; h < i && !m; h++) j = ka(da(f) * e[h]), j > b && (!d ||
                k <= c) && g.push(k), k > c && (m = !0), k = j
            } else if (b = da(b), c = da(c), a = e[d ? "minorTickInterval" : "tickInterval"], a = o(a === "auto" ? null : a, this._minorAutoInterval, (c - b) * (e.tickPixelInterval / (d ? 5 : 1)) / ((d ? f / this.tickPositions.length : f) || 1)), a = ib(a, null, I.pow(10, T(I.log(a) / I.LN10))), g = La(this.getLinearTickPositions(a, b, c), ka), !d) this._minorAutoInterval = a / 5; if (!d) this.tickInterval = a; return g
        }, getMinorTickPositions: function () {
            var a = this.options, b = this.tickPositions, c = this.minorTickInterval, d = [], e; if (this.isLog) {
                e = b.length;
                for (a = 1; a < e; a++) d = d.concat(this.getLogTickPositions(c, b[a - 1], b[a], !0))
            } else if (this.isDatetimeAxis && a.minorTickInterval === "auto") d = d.concat(Cb(Ab(c), this.min, this.max, a.startOfWeek)), d[0] < this.min && d.shift(); else for (b = this.min + (b[0] - this.min) % c; b <= this.max; b += c) d.push(b); return d
        }, adjustForMinRange: function () {
            var a = this.options, b = this.min, c = this.max, d, e = this.dataMax - this.dataMin >= this.minRange, f, g, h, i, j; if (this.isXAxis && this.minRange === y && !this.isLog) r(a.min) || r(a.max) ? this.minRange = null : (n(this.series,
            function (a) { i = a.xData; for (g = j = a.xIncrement ? 1 : i.length - 1; g > 0; g--) if (h = i[g] - i[g - 1], f === y || h < f) f = h }), this.minRange = K(f * 5, this.dataMax - this.dataMin)); if (c - b < this.minRange) { var k = this.minRange; d = (k - c + b) / 2; d = [b - d, o(a.min, b - d)]; if (e) d[2] = this.dataMin; b = pa(d); c = [b + k, o(a.max, b + k)]; if (e) c[2] = this.dataMax; c = Ga(c); c - b < k && (d[0] = c - k, d[1] = o(a.min, c - k), b = pa(d)) } this.min = b; this.max = c
        }, setAxisTranslation: function (a) {
            var b = this.max - this.min, c = 0, d, e = 0, f = 0, g = this.linkedParent, h = this.transA; if (this.isXAxis) g ? (e = g.minPointOffset,
            f = g.pointRangePadding) : n(this.series, function (a) { var g = a.pointRange, h = a.options.pointPlacement, m = a.closestPointRange; g > b && (g = 0); c = q(c, g); e = q(e, h ? 0 : g / 2); f = q(f, h === "on" ? 0 : g); !a.noSharedTooltip && r(m) && (d = r(d) ? K(d, m) : m) }), g = this.ordinalSlope && d ? this.ordinalSlope / d : 1, this.minPointOffset = e *= g, this.pointRangePadding = f *= g, this.pointRange = K(c, b), this.closestPointRange = d; if (a) this.oldTransA = h; this.translationSlope = this.transA = h = this.len / (b + f || 1); this.transB = this.horiz ? this.left : this.bottom; this.minPixelPadding =
            h * e
        }, setTickPositions: function (a) {
            var b = this, c = b.chart, d = b.options, e = b.isLog, f = b.isDatetimeAxis, g = b.isXAxis, h = b.isLinked, i = b.options.tickPositioner, j = d.maxPadding, k = d.minPadding, m = d.tickInterval, l = d.minTickInterval, p = d.tickPixelInterval, s = b.categories; h ? (b.linkedParent = c[g ? "xAxis" : "yAxis"][d.linkedTo], c = b.linkedParent.getExtremes(), b.min = o(c.min, c.dataMin), b.max = o(c.max, c.dataMax), d.type !== b.linkedParent.options.type && qa(11, 1)) : (b.min = o(b.userMin, d.min, b.dataMin), b.max = o(b.userMax, d.max, b.dataMax));
            if (e) !a && K(b.min, o(b.dataMin, b.min)) <= 0 && qa(10, 1), b.min = ia(ka(b.min)), b.max = ia(ka(b.max)); if (b.range && (b.userMin = b.min = q(b.min, b.max - b.range), b.userMax = b.max, a)) b.range = null; b.beforePadding && b.beforePadding(); b.adjustForMinRange(); if (!s && !b.usePercentage && !h && r(b.min) && r(b.max) && (c = b.max - b.min)) { if (!r(d.min) && !r(b.userMin) && k && (b.dataMin < 0 || !b.ignoreMinPadding)) b.min -= c * k; if (!r(d.max) && !r(b.userMax) && j && (b.dataMax > 0 || !b.ignoreMaxPadding)) b.max += c * j } b.tickInterval = b.min === b.max || b.min === void 0 || b.max ===
            void 0 ? 1 : h && !m && p === b.linkedParent.options.tickPixelInterval ? b.linkedParent.tickInterval : o(m, s ? 1 : (b.max - b.min) * p / (b.len || 1)); g && !a && n(b.series, function (a) { a.processData(b.min !== b.oldMin || b.max !== b.oldMax) }); b.setAxisTranslation(!0); b.beforeSetTickPositions && b.beforeSetTickPositions(); if (b.postProcessTickInterval) b.tickInterval = b.postProcessTickInterval(b.tickInterval); if (!m && b.tickInterval < l) b.tickInterval = l; if (!f && !e && (a = I.pow(10, T(I.log(b.tickInterval) / I.LN10)), !m)) b.tickInterval = ib(b.tickInterval,
            null, a, d); b.minorTickInterval = d.minorTickInterval === "auto" && b.tickInterval ? b.tickInterval / 5 : d.minorTickInterval; b.tickPositions = i = d.tickPositions ? [].concat(d.tickPositions) : i && i.apply(b, [b.min, b.max]); if (!i) i = f ? (b.getNonLinearTimeTicks || Cb)(Ab(b.tickInterval, d.units), b.min, b.max, d.startOfWeek, b.ordinalPositions, b.closestPointRange, !0) : e ? b.getLogTickPositions(b.tickInterval, b.min, b.max) : b.getLinearTickPositions(b.tickInterval, b.min, b.max), b.tickPositions = i; if (!h) e = i[0], f = i[i.length - 1], h = b.minPointOffset ||
            0, d.startOnTick ? b.min = e : b.min - h > e && i.shift(), d.endOnTick ? b.max = f : b.max + h < f && i.pop(), i.length === 1 && (b.min -= 0.001, b.max += 0.001)
        }, setMaxTicks: function () { var a = this.chart, b = a.maxTicks || {}, c = this.tickPositions, d = this._maxTicksKey = [this.xOrY, this.pos, this.len].join("-"); if (!this.isLinked && !this.isDatetimeAxis && c && c.length > (b[d] || 0) && this.options.alignTicks !== !1) b[d] = c.length; a.maxTicks = b }, adjustTickAmount: function () {
            var a = this._maxTicksKey, b = this.tickPositions, c = this.chart.maxTicks; if (c && c[a] && !this.isDatetimeAxis &&
            !this.categories && !this.isLinked && this.options.alignTicks !== !1) { var d = this.tickAmount, e = b.length; this.tickAmount = a = c[a]; if (e < a) { for (; b.length < a;) b.push(ia(b[b.length - 1] + this.tickInterval)); this.transA *= (e - 1) / (a - 1); this.max = b[b.length - 1] } if (r(d) && a !== d) this.isDirty = !0 }
        }, setScale: function () {
            var a = this.stacks, b, c, d, e; this.oldMin = this.min; this.oldMax = this.max; this.oldAxisLength = this.len; this.setAxisSize(); e = this.len !== this.oldAxisLength; n(this.series, function (a) {
                if (a.isDirtyData || a.isDirty || a.xAxis.isDirty) d =
                !0
            }); if (e || d || this.isLinked || this.forceRedraw || this.userMin !== this.oldUserMin || this.userMax !== this.oldUserMax) if (this.forceRedraw = !1, this.getSeriesExtremes(), this.setTickPositions(), this.oldUserMin = this.userMin, this.oldUserMax = this.userMax, !this.isDirty) this.isDirty = e || this.min !== this.oldMin || this.max !== this.oldMax; if (!this.isXAxis) for (b in a) for (c in a[b]) a[b][c].cum = a[b][c].total; this.setMaxTicks()
        }, setExtremes: function (a, b, c, d, e) {
            var f = this, g = f.chart, c = o(c, !0), e = v(e, { min: a, max: b }); D(f, "setExtremes",
            e, function () { f.userMin = a; f.userMax = b; f.isDirtyExtremes = !0; c && g.redraw(d) })
        }, zoom: function (a, b) { this.allowZoomOutside || (a <= this.dataMin && (a = y), b >= this.dataMax && (b = y)); this.displayBtn = a !== y || b !== y; this.setExtremes(a, b, !1, y, { trigger: "zoom" }); return !0 }, setAxisSize: function () {
            var a = this.chart, b = this.options, c = b.offsetLeft || 0, d = b.offsetRight || 0, e = this.horiz, f, g; this.left = g = o(b.left, a.plotLeft + c); this.top = f = o(b.top, a.plotTop); this.width = c = o(b.width, a.plotWidth - c + d); this.height = b = o(b.height, a.plotHeight);
            this.bottom = a.chartHeight - b - f; this.right = a.chartWidth - c - g; this.len = q(e ? c : b, 0); this.pos = e ? g : f
        }, getExtremes: function () { var a = this.isLog; return { min: a ? ia(da(this.min)) : this.min, max: a ? ia(da(this.max)) : this.max, dataMin: this.dataMin, dataMax: this.dataMax, userMin: this.userMin, userMax: this.userMax } }, getThreshold: function (a) { var b = this.isLog, c = b ? da(this.min) : this.min, b = b ? da(this.max) : this.max; c > a || a === null ? a = c : b < a && (a = b); return this.translate(a, 0, 1, 0, 1) }, addPlotBand: function (a) { this.addPlotBandOrLine(a, "plotBands") },
        addPlotLine: function (a) { this.addPlotBandOrLine(a, "plotLines") }, addPlotBandOrLine: function (a, b) { var c = (new pb(this, a)).render(), d = this.userOptions; b && (d[b] = d[b] || [], d[b].push(a)); this.plotLinesAndBands.push(c); return c }, getOffset: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.tickPositions, f = a.ticks, g = a.horiz, h = a.side, i = b.inverted ? [1, 0, 3, 2][h] : h, j, k = 0, m, l = 0, p = d.title, s = d.labels, t = 0, B = b.axisOffset, w = b.clipOffset, G = [-1, 1, 1, -1][h], v; a.hasData = b = a.hasVisibleSeries || r(a.min) && r(a.max) && !!e;
            a.showAxis = j = b || o(d.showEmpty, !0); if (!a.axisGroup) a.gridGroup = c.g("grid").attr({ zIndex: d.gridZIndex || 1 }).add(), a.axisGroup = c.g("axis").attr({ zIndex: d.zIndex || 2 }).add(), a.labelGroup = c.g("axis-labels").attr({ zIndex: s.zIndex || 7 }).add(); if (b || a.isLinked) n(e, function (b) { f[b] ? f[b].addLabel() : f[b] = new Ja(a, b) }), n(e, function (a) { if (h === 0 || h === 2 || { 1: "left", 3: "right" }[h] === s.align) t = q(f[a].getLabelSize(), t) }), a.staggerLines && (t += (a.staggerLines - 1) * 16); else for (v in f) f[v].destroy(), delete f[v]; if (p && p.text &&
            p.enabled !== !1) { if (!a.axisTitle) a.axisTitle = c.text(p.text, 0, 0, p.useHTML).attr({ zIndex: 7, rotation: p.rotation || 0, align: p.textAlign || { low: "left", middle: "center", high: "right" }[p.align] }).css(p.style).add(a.axisGroup), a.axisTitle.isNew = !0; if (j) k = a.axisTitle.getBBox()[g ? "height" : "width"], l = o(p.margin, g ? 5 : 10), m = p.offset; a.axisTitle[j ? "show" : "hide"]() } a.offset = G * o(d.offset, B[h]); a.axisTitleMargin = o(m, t + l + (h !== 2 && t && G * d.labels[g ? "y" : "x"])); B[h] = q(B[h], a.axisTitleMargin + k + G * a.offset); w[i] = q(w[i], d.lineWidth)
        },
        getLinePath: function (a) { var b = this.chart, c = this.opposite, d = this.offset, e = this.horiz, f = this.left + (c ? this.width : 0) + d; this.lineTop = d = b.chartHeight - this.bottom - (c ? this.height : 0) + d; c || (a *= -1); return b.renderer.crispLine(["M", e ? this.left : f, e ? d : this.top, "L", e ? b.chartWidth - this.right : f, e ? d : b.chartHeight - this.bottom], a) }, getTitlePosition: function () {
            var a = this.horiz, b = this.left, c = this.top, d = this.len, e = this.options.title, f = a ? b : c, g = this.opposite, h = this.offset, i = u(e.style.fontSize || 12), d = {
                low: f + (a ? 0 : d), middle: f +
                d / 2, high: f + (a ? d : 0)
            }[e.align], b = (a ? c + this.height : b) + (a ? 1 : -1) * (g ? -1 : 1) * this.axisTitleMargin + (this.side === 2 ? i : 0); return { x: a ? d : b + (g ? this.width : 0) + h + (e.x || 0), y: a ? b - (g ? this.height : 0) + h : d + (e.y || 0) }
        }, render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.options, e = a.isLog, f = a.isLinked, g = a.tickPositions, h = a.axisTitle, i = a.stacks, j = a.ticks, k = a.minorTicks, m = a.alternateBands, l = d.stackLabels, p = d.alternateGridColor, s = a.tickmarkOffset, o = d.lineWidth, B, w = b.hasRendered && r(a.oldMin) && !isNaN(a.oldMin); B = a.hasData; var q =
            a.showAxis, t, v; n([j, k, m], function (a) { for (var b in a) a[b].isActive = !1 }); if (B || f) if (a.minorTickInterval && !a.categories && n(a.getMinorTickPositions(), function (b) { k[b] || (k[b] = new Ja(a, b, "minor")); w && k[b].isNew && k[b].render(null, !0); k[b].render(null, !1, 1) }), g.length && (n(g.slice(1).concat([g[0]]), function (b, c) { c = c === g.length - 1 ? 0 : c + 1; if (!f || b >= a.min && b <= a.max) j[b] || (j[b] = new Ja(a, b)), w && j[b].isNew && j[b].render(c, !0), j[b].render(c, !1, 1) }), s && a.min === 0 && (j[-1] || (j[-1] = new Ja(a, -1, null, !0)), j[-1].render(-1))),
            p && n(g, function (b, c) { if (c % 2 === 0 && b < a.max) m[b] || (m[b] = new pb(a)), t = b + s, v = g[c + 1] !== y ? g[c + 1] + s : a.max, m[b].options = { from: e ? da(t) : t, to: e ? da(v) : v, color: p }, m[b].render(), m[b].isActive = !0 }), !a._addedPlotLB) n((d.plotLines || []).concat(d.plotBands || []), function (b) { a.addPlotBandOrLine(b) }), a._addedPlotLB = !0; n([j, k, m], function (a) {
                var c, d, e = [], f = za ? za.duration || 500 : 0, g = function () { for (d = e.length; d--;) a[e[d]] && !a[e[d]].isActive && (a[e[d]].destroy(), delete a[e[d]]) }; for (c in a) if (!a[c].isActive) a[c].render(c, !1, 0),
                a[c].isActive = !1, e.push(c); a === m || !b.hasRendered || !f ? g() : f && setTimeout(g, f)
            }); if (o) B = a.getLinePath(o), a.axisLine ? a.axisLine.animate({ d: B }) : a.axisLine = c.path(B).attr({ stroke: d.lineColor, "stroke-width": o, zIndex: 7 }).add(a.axisGroup), a.axisLine[q ? "show" : "hide"](); if (h && q) h[h.isNew ? "attr" : "animate"](a.getTitlePosition()), h.isNew = !1; if (l && l.enabled) {
                var u, x, d = a.stackTotalGroup; if (!d) a.stackTotalGroup = d = c.g("stack-labels").attr({ visibility: "visible", zIndex: 6 }).add(); d.translate(b.plotLeft, b.plotTop); for (u in i) for (x in c =
                i[u], c) c[x].render(d)
            } a.isDirty = !1
        }, removePlotBandOrLine: function (a) { for (var b = this.plotLinesAndBands, c = b.length; c--;) b[c].id === a && b[c].destroy() }, setTitle: function (a, b) { this.update({ title: a }, b) }, redraw: function () { var a = this.chart.pointer; a.reset && a.reset(!0); this.render(); n(this.plotLinesAndBands, function (a) { a.render() }); n(this.series, function (a) { a.isDirty = !0 }) }, setCategories: function (a, b) { this.update({ categories: a }, b) }, destroy: function () {
            var a = this, b = a.stacks, c; ba(a); for (c in b) Ha(b[c]), b[c] = null;
            n([a.ticks, a.minorTicks, a.alternateBands, a.plotLinesAndBands], function (a) { Ha(a) }); n("stackTotalGroup,axisLine,axisGroup,gridGroup,labelGroup,axisTitle".split(","), function (b) { a[b] && (a[b] = a[b].destroy()) })
        }
    }; qb.prototype = {
        init: function (a, b) {
            var c = b.borderWidth, d = b.style, e = u(d.padding); this.chart = a; this.options = b; this.crosshairs = []; this.now = { x: 0, y: 0 }; this.isHidden = !0; this.label = a.renderer.label("", 0, 0, b.shape, null, null, b.useHTML, null, "tooltip").attr({
                padding: e, fill: b.backgroundColor, "stroke-width": c,
                r: b.borderRadius, zIndex: 8
            }).css(d).css({ padding: 0 }).hide().add(); $ || this.label.shadow(b.shadow); this.shared = b.shared
        }, destroy: function () { n(this.crosshairs, function (a) { a && a.destroy() }); if (this.label) this.label = this.label.destroy(); clearTimeout(this.hideTimer); clearTimeout(this.tooltipTimeout) }, move: function (a, b, c, d) {
            var e = this, f = e.now, g = e.options.animation !== !1 && !e.isHidden; v(f, { x: g ? (2 * f.x + a) / 3 : a, y: g ? (f.y + b) / 2 : b, anchorX: g ? (2 * f.anchorX + c) / 3 : c, anchorY: g ? (f.anchorY + d) / 2 : d }); e.label.attr(f); if (g && (Q(a -
            f.x) > 1 || Q(b - f.y) > 1)) clearTimeout(this.tooltipTimeout), this.tooltipTimeout = setTimeout(function () { e && e.move(a, b, c, d) }, 32)
        }, hide: function () { var a = this, b; clearTimeout(this.hideTimer); if (!this.isHidden) b = this.chart.hoverPoints, this.hideTimer = setTimeout(function () { a.label.fadeOut(); a.isHidden = !0 }, o(this.options.hideDelay, 500)), b && n(b, function (a) { a.setState() }), this.chart.hoverPoints = null }, hideCrosshairs: function () { n(this.crosshairs, function (a) { a && a.hide() }) }, getAnchor: function (a, b) {
            var c, d = this.chart, e =
            d.inverted, f = d.plotTop, g = 0, h = 0, i, a = ha(a); c = a[0].tooltipPos; this.followPointer && b && (b.chartX === y && (b = d.pointer.normalize(b)), c = [b.chartX - d.plotLeft, b.chartY - f]); c || (n(a, function (a) { i = a.series.yAxis; g += a.plotX; h += (a.plotLow ? (a.plotLow + a.plotHigh) / 2 : a.plotY) + (!e && i ? i.top - f : 0) }), g /= a.length, h /= a.length, c = [e ? d.plotWidth - h : g, this.shared && !e && a.length > 1 && b ? b.chartY - f : e ? d.plotHeight - g : h]); return La(c, t)
        }, getPosition: function (a, b, c) {
            var d = this.chart, e = d.plotLeft, f = d.plotTop, g = d.plotWidth, h = d.plotHeight, i =
            o(this.options.distance, 12), j = c.plotX, c = c.plotY, d = j + e + (d.inverted ? i : -a - i), k = c - b + f + 15, m; d < 7 && (d = e + q(j, 0) + i); d + a > e + g && (d -= d + a - (e + g), k = c - b + f - i, m = !0); k < f + 5 && (k = f + 5, m && c >= k && c <= k + b && (k = c + f + i)); k + b > f + h && (k = q(f, f + h - b - i)); return { x: d, y: k }
        }, defaultFormatter: function (a) {
            var b = this.points || ha(this), c = b[0].series, d; d = [c.tooltipHeaderFormatter(b[0])]; n(b, function (a) { c = a.series; d.push(c.tooltipFormatter && c.tooltipFormatter(a) || a.point.tooltipFormatter(c.tooltipOptions.pointFormat)) }); d.push(a.options.footerFormat ||
            ""); return d.join("")
        }, refresh: function (a, b) {
            var c = this.chart, d = this.label, e = this.options, f, g, h, i = {}, j, k = []; j = e.formatter || this.defaultFormatter; var i = c.hoverPoints, m, l = e.crosshairs; h = this.shared; clearTimeout(this.hideTimer); this.followPointer = ha(a)[0].series.tooltipOptions.followPointer; g = this.getAnchor(a, b); f = g[0]; g = g[1]; h && (!a.series || !a.series.noSharedTooltip) ? (c.hoverPoints = a, i && n(i, function (a) { a.setState() }), n(a, function (a) { a.setState("hover"); k.push(a.getLabelConfig()) }), i = {
                x: a[0].category,
                y: a[0].y
            }, i.points = k, a = a[0]) : i = a.getLabelConfig(); j = j.call(i, this); i = a.series; h = h || !i.isCartesian || i.tooltipOutsidePlot || c.isInsidePlot(f, g); j === !1 || !h ? this.hide() : (this.isHidden && (Ta(d), d.attr("opacity", 1).show()), d.attr({ text: j }), m = e.borderColor || a.color || i.color || "#606060", d.attr({ stroke: m }), this.updatePosition({ plotX: f, plotY: g }), this.isHidden = !1); if (l) {
                l = ha(l); for (d = l.length; d--;) if (e = a.series[d ? "yAxis" : "xAxis"], l[d] && e) if (h = d ? o(a.stackY, a.y) : a.x, e.isLog && (h = ka(h)), e = e.getPlotLinePath(h, 1), this.crosshairs[d]) this.crosshairs[d].attr({
                    d: e,
                    visibility: "visible"
                }); else { h = { "stroke-width": l[d].width || 1, stroke: l[d].color || "#C0C0C0", zIndex: l[d].zIndex || 2 }; if (l[d].dashStyle) h.dashstyle = l[d].dashStyle; this.crosshairs[d] = c.renderer.path(e).attr(h).add() }
            } D(c, "tooltipRefresh", { text: j, x: f + c.plotLeft, y: g + c.plotTop, borderColor: m })
        }, updatePosition: function (a) { var b = this.chart, c = this.label, c = (this.options.positioner || this.getPosition).call(this, c.width, c.height, a); this.move(t(c.x), t(c.y), a.plotX + b.plotLeft, a.plotY + b.plotTop) }
    }; rb.prototype = {
        init: function (a,
        b) { var c = $ ? "" : b.chart.zoomType, d = a.inverted, e; this.options = b; this.chart = a; this.zoomX = e = /x/.test(c); this.zoomY = c = /y/.test(c); this.zoomHor = e && !d || c && d; this.zoomVert = c && !d || e && d; this.pinchDown = []; this.lastValidTouch = {}; if (b.tooltip.enabled) a.tooltip = new qb(a, b.tooltip); this.setDOMEvents() }, normalize: function (a) {
            var b, c, d, a = a || O.event; if (!a.target) a.target = a.srcElement; a = Qb(a); d = a.touches ? a.touches.item(0) : a; this.chartPosition = b = Ub(this.chart.container); d.pageX === y ? (c = a.x, b = a.y) : (c = d.pageX - b.left, b = d.pageY -
            b.top); return v(a, { chartX: t(c), chartY: t(b) })
        }, getCoordinates: function (a) { var b = { xAxis: [], yAxis: [] }; n(this.chart.axes, function (c) { b[c.isXAxis ? "xAxis" : "yAxis"].push({ axis: c, value: c.toValue(a[c.horiz ? "chartX" : "chartY"]) }) }); return b }, getIndex: function (a) { var b = this.chart; return b.inverted ? b.plotHeight + b.plotTop - a.chartY : a.chartX - b.plotLeft }, runPointActions: function (a) {
            var b = this.chart, c = b.series, d = b.tooltip, e, f = b.hoverPoint, g = b.hoverSeries, h, i, j = b.chartWidth, k = this.getIndex(a); if (d && this.options.tooltip.shared &&
            (!g || !g.noSharedTooltip)) { e = []; h = c.length; for (i = 0; i < h; i++) if (c[i].visible && c[i].options.enableMouseTracking !== !1 && !c[i].noSharedTooltip && c[i].tooltipPoints.length && (b = c[i].tooltipPoints[k], b.series)) b._dist = Q(k - b.clientX), j = K(j, b._dist), e.push(b); for (h = e.length; h--;) e[h]._dist > j && e.splice(h, 1); if (e.length && e[0].clientX !== this.hoverX) d.refresh(e, a), this.hoverX = e[0].clientX } if (g && g.tracker) { if ((b = g.tooltipPoints[k]) && b !== f) b.onMouseOver(a) } else d && d.followPointer && !d.isHidden && (a = d.getAnchor([{}], a),
            d.updatePosition({ plotX: a[0], plotY: a[1] }))
        }, reset: function (a) { var b = this.chart, c = b.hoverSeries, d = b.hoverPoint, e = b.tooltip, b = e && e.shared ? b.hoverPoints : d; (a = a && e && b) && ha(b)[0].plotX === y && (a = !1); if (a) e.refresh(b); else { if (d) d.onMouseOut(); if (c) c.onMouseOut(); e && (e.hide(), e.hideCrosshairs()); this.hoverX = null } }, scaleGroups: function (a, b) {
            var c = this.chart; n(c.series, function (d) {
                d.xAxis && d.xAxis.zoomEnabled && (d.group.attr(a), d.markerGroup && (d.markerGroup.attr(a), d.markerGroup.clip(b ? c.clipRect : null)), d.dataLabelsGroup &&
                d.dataLabelsGroup.attr(a))
            }); c.clipRect.attr(b || c.clipBox)
        }, pinchTranslateDirection: function (a, b, c, d, e, f, g) {
            var h = this.chart, i = a ? "x" : "y", j = a ? "X" : "Y", k = "chart" + j, m = a ? "width" : "height", l = h["plot" + (a ? "Left" : "Top")], p, s, o = 1, n = h.inverted, w = h.bounds[a ? "h" : "v"], q = b.length === 1, t = b[0][k], r = c[0][k], v = !q && b[1][k], u = !q && c[1][k], x, c = function () { !q && Q(t - v) > 20 && (o = Q(r - u) / Q(t - v)); s = (l - r) / o + t; p = h["plot" + (a ? "Width" : "Height")] / o }; c(); b = s; b < w.min ? (b = w.min, x = !0) : b + p > w.max && (b = w.max - p, x = !0); x ? (r -= 0.8 * (r - g[i][0]), q || (u -=
            0.8 * (u - g[i][1])), c()) : g[i] = [r, u]; n || (f[i] = s - l, f[m] = p); f = n ? 1 / o : o; e[m] = p; e[i] = b; d[n ? a ? "scaleY" : "scaleX" : "scale" + j] = o; d["translate" + j] = f * l + (r - f * t)
        }, pinch: function (a) {
            var b = this, c = b.chart, d = b.pinchDown, e = c.tooltip && c.tooltip.options.followTouchMove, f = a.touches, g = f.length, h = b.lastValidTouch, i = b.zoomHor || b.pinchHor, j = b.zoomVert || b.pinchVert, k = i || j, m = b.selectionMarker, l = {}, p = {}; a.type === "touchstart" && (e || k) && a.preventDefault(); La(f, function (a) { return b.normalize(a) }); if (a.type === "touchstart") n(f, function (a,
            b) { d[b] = { chartX: a.chartX, chartY: a.chartY } }), h.x = [d[0].chartX, d[1] && d[1].chartX], h.y = [d[0].chartY, d[1] && d[1].chartY], n(c.axes, function (a) { if (a.zoomEnabled) { var b = c.bounds[a.horiz ? "h" : "v"], d = a.minPixelPadding, e = a.toPixels(a.dataMin), f = a.toPixels(a.dataMax), g = K(e, f), e = q(e, f); b.min = K(a.pos, g - d); b.max = q(a.pos + a.len, e + d) } }); else if (d.length) {
                if (!m) b.selectionMarker = m = v({ destroy: ta }, c.plotBox); i && b.pinchTranslateDirection(!0, d, f, l, m, p, h); j && b.pinchTranslateDirection(!1, d, f, l, m, p, h); b.hasPinched = k; b.scaleGroups(l,
                p); !k && e && g === 1 && this.runPointActions(b.normalize(a))
            }
        }, dragStart: function (a) { var b = this.chart; b.mouseIsDown = a.type; b.cancelClick = !1; b.mouseDownX = this.mouseDownX = a.chartX; this.mouseDownY = a.chartY }, drag: function (a) {
            var b = this.chart, c = b.options.chart, d = a.chartX, a = a.chartY, e = this.zoomHor, f = this.zoomVert, g = b.plotLeft, h = b.plotTop, i = b.plotWidth, j = b.plotHeight, k, m = this.mouseDownX, l = this.mouseDownY; d < g ? d = g : d > g + i && (d = g + i); a < h ? a = h : a > h + j && (a = h + j); this.hasDragged = Math.sqrt(Math.pow(m - d, 2) + Math.pow(l - a, 2)); if (this.hasDragged >
            10) { k = b.isInsidePlot(m - g, l - h); if (b.hasCartesianSeries && (this.zoomX || this.zoomY) && k && !this.selectionMarker) this.selectionMarker = b.renderer.rect(g, h, e ? 1 : i, f ? 1 : j, 0).attr({ fill: c.selectionMarkerFill || "rgba(69,114,167,0.25)", zIndex: 7 }).add(); this.selectionMarker && e && (e = d - m, this.selectionMarker.attr({ width: Q(e), x: (e > 0 ? 0 : e) + m })); this.selectionMarker && f && (e = a - l, this.selectionMarker.attr({ height: Q(e), y: (e > 0 ? 0 : e) + l })); k && !this.selectionMarker && c.panning && b.pan(d) }
        }, drop: function (a) {
            var b = this.chart, c = this.hasPinched;
            if (this.selectionMarker) {
                var d = { xAxis: [], yAxis: [], originalEvent: a.originalEvent || a }, e = this.selectionMarker, f = e.x, g = e.y, h; if (this.hasDragged || c) n(b.axes, function (a) { if (a.zoomEnabled) { var b = a.horiz, c = a.toValue(b ? f : g), b = a.toValue(b ? f + e.width : g + e.height); !isNaN(c) && !isNaN(b) && (d[a.xOrY + "Axis"].push({ axis: a, min: K(c, b), max: q(c, b) }), h = !0) } }), h && D(b, "selection", d, function (a) { b.zoom(v(a, c ? { animation: !1 } : null)) }); this.selectionMarker = this.selectionMarker.destroy(); c && this.scaleGroups({
                    translateX: b.plotLeft,
                    translateY: b.plotTop, scaleX: 1, scaleY: 1
                })
            } if (b) L(b.container, { cursor: b._cursor }), b.cancelClick = this.hasDragged > 10, b.mouseIsDown = this.hasDragged = this.hasPinched = !1, this.pinchDown = []
        }, onContainerMouseDown: function (a) { a = this.normalize(a); a.preventDefault && a.preventDefault(); this.dragStart(a) }, onDocumentMouseUp: function (a) { this.drop(a) }, onDocumentMouseMove: function (a) {
            var b = this.chart, c = this.chartPosition, d = b.hoverSeries, a = Qb(a); c && d && d.isCartesian && !b.isInsidePlot(a.pageX - c.left - b.plotLeft, a.pageY - c.top -
            b.plotTop) && this.reset()
        }, onContainerMouseLeave: function () { this.reset(); this.chartPosition = null }, onContainerMouseMove: function (a) { var b = this.chart, a = this.normalize(a); a.returnValue = !1; b.mouseIsDown === "mousedown" && this.drag(a); b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) && !b.openMenu && this.runPointActions(a) }, inClass: function (a, b) { for (var c; a;) { if (c = A(a, "class")) if (c.indexOf(b) !== -1) return !0; else if (c.indexOf("highcharts-container") !== -1) return !1; a = a.parentNode } }, onTrackerMouseOut: function (a) {
            var b =
            this.chart.hoverSeries; if (b && !b.options.stickyTracking && !this.inClass(a.toElement || a.relatedTarget, "highcharts-tooltip")) b.onMouseOut()
        }, onContainerClick: function (a) {
            var b = this.chart, c = b.hoverPoint, d = b.plotLeft, e = b.plotTop, f = b.inverted, g, h, i, a = this.normalize(a); a.cancelBubble = !0; if (!b.cancelClick) c && this.inClass(a.target, "highcharts-tracker") ? (g = this.chartPosition, h = c.plotX, i = c.plotY, v(c, { pageX: g.left + d + (f ? b.plotWidth - i : h), pageY: g.top + e + (f ? b.plotHeight - h : i) }), D(c.series, "click", v(a, { point: c })), b.hoverPoint &&
            c.firePointEvent("click", a)) : (v(a, this.getCoordinates(a)), b.isInsidePlot(a.chartX - d, a.chartY - e) && D(b, "click", a))
        }, onContainerTouchStart: function (a) { var b = this.chart; a.touches.length === 1 ? (a = this.normalize(a), b.isInsidePlot(a.chartX - b.plotLeft, a.chartY - b.plotTop) && (this.runPointActions(a), this.pinch(a))) : a.touches.length === 2 && this.pinch(a) }, onContainerTouchMove: function (a) { (a.touches.length === 1 || a.touches.length === 2) && this.pinch(a) }, onDocumentTouchEnd: function (a) { this.drop(a) }, setDOMEvents: function () {
            var a =
            this, b = a.chart.container, c; this._events = c = [[b, "onmousedown", "onContainerMouseDown"], [b, "onmousemove", "onContainerMouseMove"], [b, "onclick", "onContainerClick"], [b, "mouseleave", "onContainerMouseLeave"], [z, "mousemove", "onDocumentMouseMove"], [z, "mouseup", "onDocumentMouseUp"]]; fb && c.push([b, "ontouchstart", "onContainerTouchStart"], [b, "ontouchmove", "onContainerTouchMove"], [z, "touchend", "onDocumentTouchEnd"]); n(c, function (b) {
                a["_" + b[2]] = function (c) { a[b[2]](c) }; b[1].indexOf("on") === 0 ? b[0][b[1]] = a["_" + b[2]] :
                J(b[0], b[1], a["_" + b[2]])
            })
        }, destroy: function () { var a = this; n(a._events, function (b) { b[1].indexOf("on") === 0 ? b[0][b[1]] = null : ba(b[0], b[1], a["_" + b[2]]) }); delete a._events; clearInterval(a.tooltipTimeout) }
    }; sb.prototype = {
        init: function (a, b) {
            var c = this, d = b.itemStyle, e = o(b.padding, 8), f = b.itemMarginTop || 0; this.options = b; if (b.enabled) c.baseline = u(d.fontSize) + 3 + f, c.itemStyle = d, c.itemHiddenStyle = x(d, b.itemHiddenStyle), c.itemMarginTop = f, c.padding = e, c.initialItemX = e, c.initialItemY = e - 5, c.maxItemWidth = 0, c.chart = a,
            c.itemHeight = 0, c.lastLineHeight = 0, c.render(), J(c.chart, "endResize", function () { c.positionCheckboxes() })
        }, colorizeItem: function (a, b) { var c = this.options, d = a.legendItem, e = a.legendLine, f = a.legendSymbol, g = this.itemHiddenStyle.color, c = b ? c.itemStyle.color : g, h = b ? a.color : g, g = a.options && a.options.marker, i = { stroke: h, fill: h }, j; d && d.css({ fill: c, color: c }); e && e.attr({ stroke: h }); if (f) { if (g) for (j in g = a.convertAttribs(g), g) d = g[j], d !== y && (i[j] = d); f.attr(i) } }, positionItem: function (a) {
            var b = this.options, c = b.symbolPadding,
            b = !b.rtl, d = a._legendItemPos, e = d[0], d = d[1], f = a.checkbox; a.legendGroup && a.legendGroup.translate(b ? e : this.legendWidth - e - 2 * c - 4, d); if (f) f.x = e, f.y = d
        }, destroyItem: function (a) { var b = a.checkbox; n(["legendItem", "legendLine", "legendSymbol", "legendGroup"], function (b) { a[b] && a[b].destroy() }); b && Ra(a.checkbox) }, destroy: function () { var a = this.group, b = this.box; if (b) this.box = b.destroy(); if (a) this.group = a.destroy() }, positionCheckboxes: function (a) {
            var b = this.group.alignAttr, c, d = this.clipHeight || this.legendHeight; if (b) c =
            b.translateY, n(this.allItems, function (e) { var f = e.checkbox, g; f && (g = c + f.y + (a || 0) + 3, L(f, { left: b.translateX + e.legendItemWidth + f.x - 20 + "px", top: g + "px", display: g > c - 6 && g < c + d - 6 ? "" : S })) })
        }, renderTitle: function () { var a = this.padding, b = this.options.title, c = 0; if (b.text) { if (!this.title) this.title = this.chart.renderer.label(b.text, a - 3, a - 4, null, null, null, null, null, "legend-title").attr({ zIndex: 1 }).css(b.style).add(this.group); c = this.title.getBBox().height; this.contentGroup.attr({ translateY: c }) } this.titleHeight = c }, renderItem: function (a) {
            var w;
            var b = this, c = b.chart, d = c.renderer, e = b.options, f = e.layout === "horizontal", g = e.symbolWidth, h = e.symbolPadding, i = b.itemStyle, j = b.itemHiddenStyle, k = b.padding, m = !e.rtl, l = e.width, p = e.itemMarginBottom || 0, s = b.itemMarginTop, o = b.initialItemX, n = a.legendItem, t = a.series || a, r = t.options, v = r.showCheckbox, u = e.useHTML; if (!n && (a.legendGroup = d.g("legend-item").attr({ zIndex: 1 }).add(b.scrollGroup), t.drawLegendSymbol(b, a), a.legendItem = n = d.text(e.labelFormat ? wa(e.labelFormat, a) : e.labelFormatter.call(a), m ? g + h : -h, b.baseline,
            u).css(x(a.visible ? i : j)).attr({ align: m ? "left" : "right", zIndex: 2 }).add(a.legendGroup), (u ? n : a.legendGroup).on("mouseover", function () { a.setState("hover"); n.css(b.options.itemHoverStyle) }).on("mouseout", function () { n.css(a.visible ? i : j); a.setState() }).on("click", function (b) { var c = function () { a.setVisible() }, b = { browserEvent: b }; a.firePointEvent ? a.firePointEvent("legendItemClick", b, c) : D(a, "legendItemClick", b, c) }), b.colorizeItem(a, a.visible), r && v)) a.checkbox = U("input", { type: "checkbox", checked: a.selected, defaultChecked: a.selected },
            e.itemCheckboxStyle, c.container), J(a.checkbox, "click", function (b) { D(a, "checkboxClick", { checked: b.target.checked }, function () { a.select() }) }); d = n.getBBox(); w = a.legendItemWidth = e.itemWidth || g + h + d.width + k + (v ? 20 : 0), e = w; b.itemHeight = g = d.height; if (f && b.itemX - o + e > (l || c.chartWidth - 2 * k - o)) b.itemX = o, b.itemY += s + b.lastLineHeight + p, b.lastLineHeight = 0; b.maxItemWidth = q(b.maxItemWidth, e); b.lastItemY = s + b.itemY + p; b.lastLineHeight = q(g, b.lastLineHeight); a._legendItemPos = [b.itemX, b.itemY]; f ? b.itemX += e : (b.itemY += s + g + p, b.lastLineHeight =
            g); b.offsetWidth = l || q(f ? b.itemX - o : e, b.offsetWidth)
        }, render: function () {
            var a = this, b = a.chart, c = b.renderer, d = a.group, e, f, g, h, i = a.box, j = a.options, k = a.padding, m = j.borderWidth, l = j.backgroundColor; a.itemX = a.initialItemX; a.itemY = a.initialItemY; a.offsetWidth = 0; a.lastItemY = 0; if (!d) a.group = d = c.g("legend").attr({ zIndex: 7 }).add(), a.contentGroup = c.g().attr({ zIndex: 1 }).add(d), a.scrollGroup = c.g().add(a.contentGroup); a.renderTitle(); e = []; n(b.series, function (a) {
                var b = a.options; b.showInLegend && !r(b.linkedTo) && (e = e.concat(a.legendItems ||
                (b.legendType === "point" ? a.data : a)))
            }); Ib(e, function (a, b) { return (a.options && a.options.legendIndex || 0) - (b.options && b.options.legendIndex || 0) }); j.reversed && e.reverse(); a.allItems = e; a.display = f = !!e.length; n(e, function (b) { a.renderItem(b) }); g = j.width || a.offsetWidth; h = a.lastItemY + a.lastLineHeight + a.titleHeight; h = a.handleOverflow(h); if (m || l) {
                g += k; h += k; if (i) { if (g > 0 && h > 0) i[i.isNew ? "attr" : "animate"](i.crisp(null, null, null, g, h)), i.isNew = !1 } else a.box = i = c.rect(0, 0, g, h, j.borderRadius, m || 0).attr({
                    stroke: j.borderColor,
                    "stroke-width": m || 0, fill: l || S
                }).add(d).shadow(j.shadow), i.isNew = !0; i[f ? "show" : "hide"]()
            } a.legendWidth = g; a.legendHeight = h; n(e, function (b) { a.positionItem(b) }); f && d.align(v({ width: g, height: h }, j), !0, "spacingBox"); b.isResizing || this.positionCheckboxes()
        }, handleOverflow: function (a) {
            var b = this, c = this.chart, d = c.renderer, e = this.options, f = e.y, f = c.spacingBox.height + (e.verticalAlign === "top" ? -f : f) - this.padding, g = e.maxHeight, h = this.clipRect, i = e.navigation, j = o(i.animation, !0), k = i.arrowSize || 12, m = this.nav; e.layout ===
            "horizontal" && (f /= 2); g && (f = K(f, g)); if (a > f && !e.useHTML) {
                this.clipHeight = c = f - 20 - this.titleHeight; this.pageCount = ja(a / c); this.currentPage = o(this.currentPage, 1); this.fullHeight = a; if (!h) h = b.clipRect = d.clipRect(0, 0, 9999, 0), b.contentGroup.clip(h); h.attr({ height: c }); if (!m) this.nav = m = d.g().attr({ zIndex: 1 }).add(this.group), this.up = d.symbol("triangle", 0, 0, k, k).on("click", function () { b.scroll(-1, j) }).add(m), this.pager = d.text("", 15, 10).css(i.style).add(m), this.down = d.symbol("triangle-down", 0, 0, k, k).on("click",
                function () { b.scroll(1, j) }).add(m); b.scroll(0); a = f
            } else if (m) h.attr({ height: c.chartHeight }), m.hide(), this.scrollGroup.attr({ translateY: 1 }), this.clipHeight = 0; return a
        }, scroll: function (a, b) {
            var c = this.pageCount, d = this.currentPage + a, e = this.clipHeight, f = this.options.navigation, g = f.activeColor, h = f.inactiveColor, f = this.pager, i = this.padding; d > c && (d = c); if (d > 0) b !== y && Ia(b, this.chart), this.nav.attr({ translateX: i, translateY: e + 7 + this.titleHeight, visibility: "visible" }), this.up.attr({ fill: d === 1 ? h : g }).css({
                cursor: d ===
                1 ? "default" : "pointer"
            }), f.attr({ text: d + "/" + this.pageCount }), this.down.attr({ x: 18 + this.pager.getBBox().width, fill: d === c ? h : g }).css({ cursor: d === c ? "default" : "pointer" }), e = -K(e * (d - 1), this.fullHeight - e + i) + 1, this.scrollGroup.animate({ translateY: e }), f.attr({ text: d + "/" + c }), this.currentPage = d, this.positionCheckboxes(e)
        }
    }; tb.prototype = {
        init: function (a, b) {
            var c, d = a.series; a.series = null; c = x(N, a); c.series = a.series = d; var d = c.chart, e = d.margin, e = V(e) ? e : [e, e, e, e]; this.optionsMarginTop = o(d.marginTop, e[0]); this.optionsMarginRight =
            o(d.marginRight, e[1]); this.optionsMarginBottom = o(d.marginBottom, e[2]); this.optionsMarginLeft = o(d.marginLeft, e[3]); this.runChartClick = (e = d.events) && !!e.click; this.bounds = { h: {}, v: {} }; this.callback = b; this.isResizing = 0; this.options = c; this.axes = []; this.series = []; this.hasCartesianSeries = d.showAxes; var f = this, g; f.index = Ba.length; Ba.push(f); d.reflow !== !1 && J(f, "load", function () { f.initReflow() }); if (e) for (g in e) J(f, g, e[g]); f.xAxis = []; f.yAxis = []; f.animation = $ ? !1 : o(d.animation, !0); f.pointCount = 0; f.counters = new Hb;
            f.firstRender()
        }, initSeries: function (a) { var b = this.options.chart; (b = aa[a.type || b.type || b.defaultSeriesType]) || qa(17, !0); b = new b; b.init(this, a); return b }, addSeries: function (a, b, c) { var d, e = this; a && (b = o(b, !0), D(e, "addSeries", { options: a }, function () { d = e.initSeries(a); e.isDirtyLegend = !0; b && e.redraw(c) })); return d }, addAxis: function (a, b, c, d) { var b = b ? "xAxis" : "yAxis", e = this.options; new ab(this, x(a, { index: this[b].length })); e[b] = ha(e[b] || {}); e[b].push(a); o(c, !0) && this.redraw(d) }, isInsidePlot: function (a, b, c) {
            var d =
            c ? b : a, a = c ? a : b; return d >= 0 && d <= this.plotWidth && a >= 0 && a <= this.plotHeight
        }, adjustTickAmounts: function () { this.options.chart.alignTicks !== !1 && n(this.axes, function (a) { a.adjustTickAmount() }); this.maxTicks = null }, redraw: function (a) {
            var b = this.axes, c = this.series, d = this.pointer, e = this.legend, f = this.isDirtyLegend, g, h = this.isDirtyBox, i = c.length, j = i, k = this.renderer, m = k.isHidden(), l = []; Ia(a, this); for (m && this.cloneRenderTo() ; j--;) if (a = c[j], a.isDirty && a.options.stacking) { g = !0; break } if (g) for (j = i; j--;) if (a = c[j], a.options.stacking) a.isDirty =
            !0; n(c, function (a) { a.isDirty && a.options.legendType === "point" && (f = !0) }); if (f && e.options.enabled) e.render(), this.isDirtyLegend = !1; if (this.hasCartesianSeries) { if (!this.isResizing) this.maxTicks = null, n(b, function (a) { a.setScale() }); this.adjustTickAmounts(); this.getMargins(); n(b, function (a) { if (a.isDirtyExtremes) a.isDirtyExtremes = !1, l.push(function () { D(a, "afterSetExtremes", a.getExtremes()) }); if (a.isDirty || h || g) a.redraw(), h = !0 }) } h && this.drawChartBox(); n(c, function (a) {
                a.isDirty && a.visible && (!a.isCartesian ||
                a.xAxis) && a.redraw()
            }); d && d.reset && d.reset(!0); k.draw(); D(this, "redraw"); m && this.cloneRenderTo(!0); n(l, function (a) { a.call() })
        }, showLoading: function (a) {
            var b = this.options, c = this.loadingDiv, d = b.loading; if (!c) this.loadingDiv = c = U(ya, { className: "highcharts-loading" }, v(d.style, { zIndex: 10, display: S }), this.container), this.loadingSpan = U("span", null, d.labelStyle, c); this.loadingSpan.innerHTML = a || b.lang.loading; if (!this.loadingShown) L(c, {
                opacity: 0, display: "", left: this.plotLeft + "px", top: this.plotTop + "px", width: this.plotWidth +
                "px", height: this.plotHeight + "px"
            }), wb(c, { opacity: d.style.opacity }, { duration: d.showDuration || 0 }), this.loadingShown = !0
        }, hideLoading: function () { var a = this.options, b = this.loadingDiv; b && wb(b, { opacity: 0 }, { duration: a.loading.hideDuration || 100, complete: function () { L(b, { display: S }) } }); this.loadingShown = !1 }, get: function (a) {
            var b = this.axes, c = this.series, d, e; for (d = 0; d < b.length; d++) if (b[d].options.id === a) return b[d]; for (d = 0; d < c.length; d++) if (c[d].options.id === a) return c[d]; for (d = 0; d < c.length; d++) {
                e = c[d].points ||
                []; for (b = 0; b < e.length; b++) if (e[b].id === a) return e[b]
            } return null
        }, getAxes: function () { var a = this, b = this.options, c = b.xAxis = ha(b.xAxis || {}), b = b.yAxis = ha(b.yAxis || {}); n(c, function (a, b) { a.index = b; a.isX = !0 }); n(b, function (a, b) { a.index = b }); c = c.concat(b); n(c, function (b) { new ab(a, b) }); a.adjustTickAmounts() }, getSelectedPoints: function () { var a = []; n(this.series, function (b) { a = a.concat(ob(b.points || [], function (a) { return a.selected })) }); return a }, getSelectedSeries: function () { return ob(this.series, function (a) { return a.selected }) },
        showResetZoom: function () { var a = this, b = N.lang, c = a.options.chart.resetZoomButton, d = c.theme, e = d.states, f = c.relativeTo === "chart" ? null : "plotBox"; this.resetZoomButton = a.renderer.button(b.resetZoom, null, null, function () { a.zoomOut() }, d, e && e.hover).attr({ align: c.position.align, title: b.resetZoomTitle }).add().align(c.position, !1, f) }, zoomOut: function () { var a = this; D(a, "selection", { resetSelection: !0 }, function () { a.zoom() }) }, zoom: function (a) {
            var b, c = this.pointer, d = !1, e; !a || a.resetSelection ? n(this.axes, function (a) {
                b =
                a.zoom()
            }) : n(a.xAxis.concat(a.yAxis), function (a) { var e = a.axis, h = e.isXAxis; if (c[h ? "zoomX" : "zoomY"] || c[h ? "pinchX" : "pinchY"]) b = e.zoom(a.min, a.max), e.displayBtn && (d = !0) }); e = this.resetZoomButton; if (d && !e) this.showResetZoom(); else if (!d && V(e)) this.resetZoomButton = e.destroy(); b && this.redraw(o(this.options.chart.animation, a && a.animation, this.pointCount < 100))
        }, pan: function (a) {
            var b = this.xAxis[0], c = this.mouseDownX, d = b.pointRange / 2, e = b.getExtremes(), f = b.translate(c - a, !0) + d, c = b.translate(c + this.plotWidth - a, !0) -
            d; (d = this.hoverPoints) && n(d, function (a) { a.setState() }); b.series.length && f > K(e.dataMin, e.min) && c < q(e.dataMax, e.max) && b.setExtremes(f, c, !0, !1, { trigger: "pan" }); this.mouseDownX = a; L(this.container, { cursor: "move" })
        }, setTitle: function (a, b) {
            var f; var c = this, d = c.options, e; e = d.title = x(d.title, a); f = d.subtitle = x(d.subtitle, b), d = f; n([["title", a, e], ["subtitle", b, d]], function (a) {
                var b = a[0], d = c[b], e = a[1], a = a[2]; d && e && (c[b] = d = d.destroy()); a && a.text && !d && (c[b] = c.renderer.text(a.text, 0, 0, a.useHTML).attr({
                    align: a.align,
                    "class": "highcharts-" + b, zIndex: a.zIndex || 4
                }).css(a.style).add().align(a, !1, "spacingBox"))
            })
        }, getChartSize: function () { var a = this.options.chart, b = this.renderToClone || this.renderTo; this.containerWidth = gb(b, "width"); this.containerHeight = gb(b, "height"); this.chartWidth = q(0, a.width || this.containerWidth || 600); this.chartHeight = q(0, o(a.height, this.containerHeight > 19 ? this.containerHeight : 400)) }, cloneRenderTo: function (a) {
            var b = this.renderToClone, c = this.container; a ? b && (this.renderTo.appendChild(c), Ra(b), delete this.renderToClone) :
            (c && this.renderTo.removeChild(c), this.renderToClone = b = this.renderTo.cloneNode(0), L(b, { position: "absolute", top: "-9999px", display: "block" }), z.body.appendChild(b), c && b.appendChild(c))
        }, getContainer: function () {
            var a, b = this.options.chart, c, d, e; this.renderTo = a = b.renderTo; e = "highcharts-" + ub++; if (fa(a)) this.renderTo = a = z.getElementById(a); a || qa(13, !0); c = u(A(a, "data-highcharts-chart")); !isNaN(c) && Ba[c] && Ba[c].destroy(); A(a, "data-highcharts-chart", this.index); a.innerHTML = ""; a.offsetWidth || this.cloneRenderTo();
            this.getChartSize(); c = this.chartWidth; d = this.chartHeight; this.container = a = U(ya, { className: "highcharts-container" + (b.className ? " " + b.className : ""), id: e }, v({ position: "relative", overflow: "hidden", width: c + "px", height: d + "px", textAlign: "left", lineHeight: "normal", zIndex: 0, "-webkit-tap-highlight-color": "rgba(0,0,0,0)" }, b.style), this.renderToClone || a); this._cursor = a.style.cursor; this.renderer = b.forExport ? new Ca(a, c, d, !0) : new Sa(a, c, d); $ && this.renderer.create(this, a, c, d)
        }, getMargins: function () {
            var a = this.options.chart,
            b = a.spacingTop, c = a.spacingRight, d = a.spacingBottom, a = a.spacingLeft, e, f = this.legend, g = this.optionsMarginTop, h = this.optionsMarginLeft, i = this.optionsMarginRight, j = this.optionsMarginBottom, k = this.options.title, m = this.options.subtitle, l = this.options.legend, p = o(l.margin, 10), s = l.x, t = l.y, B = l.align, w = l.verticalAlign; this.resetMargins(); e = this.axisOffset; if ((this.title || this.subtitle) && !r(this.optionsMarginTop)) if (m = q(this.title && !k.floating && !k.verticalAlign && k.y || 0, this.subtitle && !m.floating && !m.verticalAlign &&
            m.y || 0)) this.plotTop = q(this.plotTop, m + o(k.margin, 15) + b); if (f.display && !l.floating) if (B === "right") { if (!r(i)) this.marginRight = q(this.marginRight, f.legendWidth - s + p + c) } else if (B === "left") { if (!r(h)) this.plotLeft = q(this.plotLeft, f.legendWidth + s + p + a) } else if (w === "top") { if (!r(g)) this.plotTop = q(this.plotTop, f.legendHeight + t + p + b) } else if (w === "bottom" && !r(j)) this.marginBottom = q(this.marginBottom, f.legendHeight - t + p + d); this.extraBottomMargin && (this.marginBottom += this.extraBottomMargin); this.extraTopMargin && (this.plotTop +=
            this.extraTopMargin); this.hasCartesianSeries && n(this.axes, function (a) { a.getOffset() }); r(h) || (this.plotLeft += e[3]); r(g) || (this.plotTop += e[0]); r(j) || (this.marginBottom += e[2]); r(i) || (this.marginRight += e[1]); this.setChartSize()
        }, initReflow: function () {
            function a(a) {
                var g = c.width || gb(d, "width"), h = c.height || gb(d, "height"), a = a ? a.target : O; if (!b.hasUserSize && g && h && (a === O || a === z)) {
                    if (g !== b.containerWidth || h !== b.containerHeight) clearTimeout(e), b.reflowTimeout = e = setTimeout(function () {
                        if (b.container) b.setSize(g,
                        h, !1), b.hasUserSize = null
                    }, 100); b.containerWidth = g; b.containerHeight = h
                }
            } var b = this, c = b.options.chart, d = b.renderTo, e; J(O, "resize", a); J(b, "destroy", function () { ba(O, "resize", a) })
        }, setSize: function (a, b, c) {
            var d = this, e, f, g; d.isResizing += 1; g = function () { d && D(d, "endResize", null, function () { d.isResizing -= 1 }) }; Ia(c, d); d.oldChartHeight = d.chartHeight; d.oldChartWidth = d.chartWidth; if (r(a)) d.chartWidth = e = q(0, t(a)), d.hasUserSize = !!e; if (r(b)) d.chartHeight = f = q(0, t(b)); L(d.container, { width: e + "px", height: f + "px" }); d.setChartSize(!0);
            d.renderer.setSize(e, f, c); d.maxTicks = null; n(d.axes, function (a) { a.isDirty = !0; a.setScale() }); n(d.series, function (a) { a.isDirty = !0 }); d.isDirtyLegend = !0; d.isDirtyBox = !0; d.getMargins(); d.redraw(c); d.oldChartHeight = null; D(d, "resize"); za === !1 ? g() : setTimeout(g, za && za.duration || 500)
        }, setChartSize: function (a) {
            var b = this.inverted, c = this.renderer, d = this.chartWidth, e = this.chartHeight, f = this.options.chart, g = f.spacingTop, h = f.spacingRight, i = f.spacingBottom, j = f.spacingLeft, k = this.clipOffset, m, l, p, o; this.plotLeft = m =
            t(this.plotLeft); this.plotTop = l = t(this.plotTop); this.plotWidth = p = q(0, t(d - m - this.marginRight)); this.plotHeight = o = q(0, t(e - l - this.marginBottom)); this.plotSizeX = b ? o : p; this.plotSizeY = b ? p : o; this.plotBorderWidth = b = f.plotBorderWidth || 0; this.spacingBox = c.spacingBox = { x: j, y: g, width: d - j - h, height: e - g - i }; this.plotBox = c.plotBox = { x: m, y: l, width: p, height: o }; c = ja(q(b, k[3]) / 2); d = ja(q(b, k[0]) / 2); this.clipBox = { x: c, y: d, width: T(this.plotSizeX - q(b, k[1]) / 2 - c), height: T(this.plotSizeY - q(b, k[2]) / 2 - d) }; a || n(this.axes, function (a) {
                a.setAxisSize();
                a.setAxisTranslation()
            })
        }, resetMargins: function () { var a = this.options.chart, b = a.spacingRight, c = a.spacingBottom, d = a.spacingLeft; this.plotTop = o(this.optionsMarginTop, a.spacingTop); this.marginRight = o(this.optionsMarginRight, b); this.marginBottom = o(this.optionsMarginBottom, c); this.plotLeft = o(this.optionsMarginLeft, d); this.axisOffset = [0, 0, 0, 0]; this.clipOffset = [0, 0, 0, 0] }, drawChartBox: function () {
            var a = this.options.chart, b = this.renderer, c = this.chartWidth, d = this.chartHeight, e = this.chartBackground, f = this.plotBackground,
            g = this.plotBorder, h = this.plotBGImage, i = a.borderWidth || 0, j = a.backgroundColor, k = a.plotBackgroundColor, m = a.plotBackgroundImage, l = a.plotBorderWidth || 0, p, o = this.plotLeft, n = this.plotTop, t = this.plotWidth, q = this.plotHeight, r = this.plotBox, v = this.clipRect, u = this.clipBox; p = i + (a.shadow ? 8 : 0); if (i || j) if (e) e.animate(e.crisp(null, null, null, c - p, d - p)); else { e = { fill: j || S }; if (i) e.stroke = a.borderColor, e["stroke-width"] = i; this.chartBackground = b.rect(p / 2, p / 2, c - p, d - p, a.borderRadius, i).attr(e).add().shadow(a.shadow) } if (k) f ?
            f.animate(r) : this.plotBackground = b.rect(o, n, t, q, 0).attr({ fill: k }).add().shadow(a.plotShadow); if (m) h ? h.animate(r) : this.plotBGImage = b.image(m, o, n, t, q).add(); v ? v.animate({ width: u.width, height: u.height }) : this.clipRect = b.clipRect(u); if (l) g ? g.animate(g.crisp(null, o, n, t, q)) : this.plotBorder = b.rect(o, n, t, q, 0, l).attr({ stroke: a.plotBorderColor, "stroke-width": l, zIndex: 1 }).add(); this.isDirtyBox = !1
        }, propFromSeries: function () {
            var a = this, b = a.options.chart, c, d = a.options.series, e, f; n(["inverted", "angular", "polar"],
            function (g) { c = aa[b.type || b.defaultSeriesType]; f = a[g] || b[g] || c && c.prototype[g]; for (e = d && d.length; !f && e--;) (c = aa[d[e].type]) && c.prototype[g] && (f = !0); a[g] = f })
        }, render: function () {
            var a = this, b = a.axes, c = a.renderer, d = a.options, e = d.labels, f = d.credits, g; a.setTitle(); a.legend = new sb(a, d.legend); n(b, function (a) { a.setScale() }); a.getMargins(); a.maxTicks = null; n(b, function (a) { a.setTickPositions(!0); a.setMaxTicks() }); a.adjustTickAmounts(); a.getMargins(); a.drawChartBox(); a.hasCartesianSeries && n(b, function (a) { a.render() });
            if (!a.seriesGroup) a.seriesGroup = c.g("series-group").attr({ zIndex: 3 }).add(); n(a.series, function (a) { a.translate(); a.setTooltipPoints(); a.render() }); e.items && n(e.items, function (b) { var d = v(e.style, b.style), f = u(d.left) + a.plotLeft, g = u(d.top) + a.plotTop + 12; delete d.left; delete d.top; c.text(b.html, f, g).attr({ zIndex: 2 }).css(d).add() }); if (f.enabled && !a.credits) g = f.href, a.credits = c.text(f.text, 0, 0).on("click", function () { if (g) location.href = g }).attr({ align: f.position.align, zIndex: 8 }).css(f.style).add().align(f.position);
            a.hasRendered = !0
        }, destroy: function () {
            var a = this, b = a.axes, c = a.series, d = a.container, e, f = d && d.parentNode; D(a, "destroy"); Ba[a.index] = y; a.renderTo.removeAttribute("data-highcharts-chart"); ba(a); for (e = b.length; e--;) b[e] = b[e].destroy(); for (e = c.length; e--;) c[e] = c[e].destroy(); n("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","), function (b) { var c = a[b]; c && c.destroy && (a[b] = c.destroy()) });
            if (d) d.innerHTML = "", ba(d), f && Ra(d); for (e in a) delete a[e]
        }, isReadyToRender: function () { var a = this; return !Z && O == O.top && z.readyState !== "complete" || $ && !O.canvg ? ($ ? Rb.push(function () { a.firstRender() }, a.options.global.canvasToolsURL) : z.attachEvent("onreadystatechange", function () { z.detachEvent("onreadystatechange", a.firstRender); z.readyState === "complete" && a.firstRender() }), !1) : !0 }, firstRender: function () {
            var a = this, b = a.options, c = a.callback; if (a.isReadyToRender()) a.getContainer(), D(a, "init"), a.resetMargins(),
            a.setChartSize(), a.propFromSeries(), a.getAxes(), n(b.series || [], function (b) { a.initSeries(b) }), D(a, "beforeRender"), a.pointer = new rb(a, b), a.render(), a.renderer.draw(), c && c.apply(a, [a]), n(a.callbacks, function (b) { b.apply(a, [a]) }), a.cloneRenderTo(!0), D(a, "load")
        }
    }; tb.prototype.callbacks = []; var Na = function () { }; Na.prototype = {
        init: function (a, b, c) {
            this.series = a; this.applyOptions(b, c); this.pointAttr = {}; if (a.options.colorByPoint && (b = a.options.colors || a.chart.options.colors, this.color = this.color || b[a.colorCounter++],
            a.colorCounter === b.length)) a.colorCounter = 0; a.chart.pointCount++; return this
        }, applyOptions: function (a, b) { var c = this.series, d = c.pointValKey, a = Na.prototype.optionsToObject.call(this, a); v(this, a); this.options = this.options ? v(this.options, a) : a; if (d) this.y = this[d]; if (this.x === y && c) this.x = b === y ? c.autoIncrement() : b; return this }, optionsToObject: function (a) {
            var b, c = this.series, d = c.pointArrayMap || ["y"], e = d.length, f = 0, g = 0; if (typeof a === "number" || a === null) b = { y: a }; else if (Da(a)) {
                b = {}; if (a.length > e) {
                    c = typeof a[0];
                    if (c === "string") b.name = a[0]; else if (c === "number") b.x = a[0]; f++
                } for (; g < e;) b[d[g++]] = a[f++]
            } else if (typeof a === "object") { b = a; if (a.dataLabels) c._hasPointLabels = !0; if (a.marker) c._hasPointMarkers = !0 } return b
        }, destroy: function () {
            var a = this.series.chart, b = a.hoverPoints, c; a.pointCount--; if (b && (this.setState(), ga(b, this), !b.length)) a.hoverPoints = null; if (this === a.hoverPoint) this.onMouseOut(); if (this.graphic || this.dataLabel) ba(this), this.destroyElements(); this.legendItem && a.legend.destroyItem(this); for (c in this) this[c] =
            null
        }, destroyElements: function () { for (var a = "graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","), b, c = 6; c--;) b = a[c], this[b] && (this[b] = this[b].destroy()) }, getLabelConfig: function () { return { x: this.category, y: this.y, key: this.name || this.category, series: this.series, point: this, percentage: this.percentage, total: this.total || this.stackTotal } }, select: function (a, b) {
            var c = this, d = c.series, e = d.chart, a = o(a, !c.selected); c.firePointEvent(a ? "select" : "unselect", { accumulate: b }, function () {
                c.selected =
                c.options.selected = a; d.options.data[la(c, d.data)] = c.options; c.setState(a && "select"); b || n(e.getSelectedPoints(), function (a) { if (a.selected && a !== c) a.selected = a.options.selected = !1, d.options.data[la(a, d.data)] = a.options, a.setState(""), a.firePointEvent("unselect") })
            })
        }, onMouseOver: function (a) { var b = this.series, c = b.chart, d = c.tooltip, e = c.hoverPoint; if (e && e !== this) e.onMouseOut(); this.firePointEvent("mouseOver"); d && (!d.shared || b.noSharedTooltip) && d.refresh(this, a); this.setState("hover"); c.hoverPoint = this },
        onMouseOut: function () { var a = this.series.chart, b = a.hoverPoints; if (!b || la(this, b) === -1) this.firePointEvent("mouseOut"), this.setState(), a.hoverPoint = null }, tooltipFormatter: function (a) { var b = this.series, c = b.tooltipOptions, d = o(c.valueDecimals, ""), e = c.valuePrefix || "", f = c.valueSuffix || ""; n(b.pointArrayMap || ["y"], function (b) { b = "{point." + b; if (e || f) a = a.replace(b + "}", e + b + "}" + f); a = a.replace(b + "}", b + ":,." + d + "f}") }); return wa(a, { point: this, series: this.series }) }, update: function (a, b, c) {
            var d = this, e = d.series, f = d.graphic,
            g, h = e.data, i = e.chart, b = o(b, !0); d.firePointEvent("update", { options: a }, function () { d.applyOptions(a); V(a) && (e.getAttribs(), f && f.attr(d.pointAttr[e.state])); g = la(d, h); e.xData[g] = d.x; e.yData[g] = e.toYData ? e.toYData(d) : d.y; e.zData[g] = d.z; e.options.data[g] = d.options; e.isDirty = !0; e.isDirtyData = !0; b && i.redraw(c) })
        }, remove: function (a, b) {
            var c = this, d = c.series, e = d.chart, f, g = d.data; Ia(b, e); a = o(a, !0); c.firePointEvent("remove", null, function () {
                f = la(c, g); g.splice(f, 1); d.options.data.splice(f, 1); d.xData.splice(f, 1);
                d.yData.splice(f, 1); d.zData.splice(f, 1); c.destroy(); d.isDirty = !0; d.isDirtyData = !0; a && e.redraw()
            })
        }, firePointEvent: function (a, b, c) { var d = this, e = this.series.options; (e.point.events[a] || d.options && d.options.events && d.options.events[a]) && this.importEvents(); a === "click" && e.allowPointSelect && (c = function (a) { d.select(null, a.ctrlKey || a.metaKey || a.shiftKey) }); D(this, a, b, c) }, importEvents: function () {
            if (!this.hasImportedEvents) {
                var a = x(this.series.options.point, this.options).events, b; this.events = a; for (b in a) J(this,
                b, a[b]); this.hasImportedEvents = !0
            }
        }, setState: function (a) {
            var b = this.plotX, c = this.plotY, d = this.series, e = d.options.states, f = X[d.type].marker && d.options.marker, g = f && !f.enabled, h = f && f.states[a], i = h && h.enabled === !1, j = d.stateMarkerGraphic, k = this.marker || {}, m = d.chart, l = this.pointAttr, a = a || ""; if (!(a === this.state || this.selected && a !== "select" || e[a] && e[a].enabled === !1 || a && (i || g && !h.enabled))) {
                if (this.graphic) e = f && this.graphic.symbolName && l[a].r, this.graphic.attr(x(l[a], e ? { x: b - e, y: c - e, width: 2 * e, height: 2 * e } : {}));
                else { if (a && h) e = h.radius, k = k.symbol || d.symbol, j && j.currentSymbol !== k && (j = j.destroy()), j ? j.attr({ x: b - e, y: c - e }) : (d.stateMarkerGraphic = j = m.renderer.symbol(k, b - e, c - e, 2 * e, 2 * e).attr(l[a]).add(d.markerGroup), j.currentSymbol = k); if (j) j[a && m.isInsidePlot(b, c) ? "show" : "hide"]() } this.state = a
            }
        }
    }; var R = function () { }; R.prototype = {
        isCartesian: !0, type: "line", pointClass: Na, sorted: !0, requireSorting: !0, pointAttrToOptions: { stroke: "lineColor", "stroke-width": "lineWidth", fill: "fillColor", r: "radius" }, colorCounter: 0, init: function (a,
        b) {
            var c, d, e = a.series; this.chart = a; this.options = b = this.setOptions(b); this.bindAxes(); v(this, { name: b.name, state: "", pointAttr: {}, visible: b.visible !== !1, selected: b.selected === !0 }); if ($) b.animation = !1; d = b.events; for (c in d) J(this, c, d[c]); if (d && d.click || b.point && b.point.events && b.point.events.click || b.allowPointSelect) a.runTrackerClick = !0; this.getColor(); this.getSymbol(); this.setData(b.data, !1); if (this.isCartesian) a.hasCartesianSeries = !0; e.push(this); this._i = e.length - 1; Ib(e, function (a, b) {
                return o(a.options.index,
                a._i) - o(b.options.index, a._i)
            }); n(e, function (a, b) { a.index = b; a.name = a.name || "Series " + (b + 1) }); c = b.linkedTo; this.linkedSeries = []; if (fa(c) && (c = c === ":previous" ? e[this.index - 1] : a.get(c))) c.linkedSeries.push(this), this.linkedParent = c
        }, bindAxes: function () { var a = this, b = a.options, c = a.chart, d; a.isCartesian && n(["xAxis", "yAxis"], function (e) { n(c[e], function (c) { d = c.options; if (b[e] === d.index || b[e] !== y && b[e] === d.id || b[e] === y && d.index === 0) c.series.push(a), a[e] = c, c.isDirty = !0 }); a[e] || qa(18, !0) }) }, autoIncrement: function () {
            var a =
            this.options, b = this.xIncrement, b = o(b, a.pointStart, 0); this.pointInterval = o(this.pointInterval, a.pointInterval, 1); this.xIncrement = b + this.pointInterval; return b
        }, getSegments: function () { var a = -1, b = [], c, d = this.points, e = d.length; if (e) if (this.options.connectNulls) { for (c = e; c--;) d[c].y === null && d.splice(c, 1); d.length && (b = [d]) } else n(d, function (c, g) { c.y === null ? (g > a + 1 && b.push(d.slice(a + 1, g)), a = g) : g === e - 1 && b.push(d.slice(a + 1, g + 1)) }); this.segments = b }, setOptions: function (a) {
            var b = this.chart.options, c = b.plotOptions,
            d = c[this.type]; this.userOptions = a; a = x(d, c.series, a); this.tooltipOptions = x(b.tooltip, a.tooltip); d.marker === null && delete a.marker; return a
        }, getColor: function () { var a = this.options, b = this.userOptions, c = this.chart.options.colors, d = this.chart.counters, e; e = a.color || X[this.type].color; if (!e && !a.colorByPoint) r(b._colorIndex) ? a = b._colorIndex : (b._colorIndex = d.color, a = d.color++), e = c[a]; this.color = e; d.wrapColor(c.length) }, getSymbol: function () {
            var a = this.userOptions, b = this.options.marker, c = this.chart, d = c.options.symbols,
            c = c.counters; this.symbol = b.symbol; if (!this.symbol) r(a._symbolIndex) ? a = a._symbolIndex : (a._symbolIndex = c.symbol, a = c.symbol++), this.symbol = d[a]; if (/^url/.test(this.symbol)) b.radius = 0; c.wrapSymbol(d.length)
        }, drawLegendSymbol: function (a) {
            var b = this.options, c = b.marker, d = a.options.symbolWidth, e = this.chart.renderer, f = this.legendGroup, a = a.baseline, g; if (b.lineWidth) { g = { "stroke-width": b.lineWidth }; if (b.dashStyle) g.dashstyle = b.dashStyle; this.legendLine = e.path(["M", 0, a - 4, "L", d, a - 4]).attr(g).add(f) } if (c && c.enabled) b =
            c.radius, this.legendSymbol = e.symbol(this.symbol, d / 2 - b, a - 4 - b, 2 * b, 2 * b).add(f)
        }, addPoint: function (a, b, c, d) {
            var e = this.options, f = this.data, g = this.graph, h = this.area, i = this.chart, j = this.xData, k = this.yData, m = this.zData, l = this.names, p = g && g.shift || 0, n = e.data; Ia(d, i); if (g && c) g.shift = p + 1; if (h) { if (c) h.shift = p + 1; h.isArea = !0 } b = o(b, !0); d = { series: this }; this.pointClass.prototype.applyOptions.apply(d, [a]); j.push(d.x); k.push(this.toYData ? this.toYData(d) : d.y); m.push(d.z); if (l) l[d.x] = d.name; n.push(a); e.legendType === "point" &&
            this.generatePoints(); c && (f[0] && f[0].remove ? f[0].remove(!1) : (f.shift(), j.shift(), k.shift(), m.shift(), n.shift())); this.getAttribs(); this.isDirtyData = this.isDirty = !0; b && i.redraw()
        }, setData: function (a, b) {
            var c = this.points, d = this.options, e = this.chart, f = null, g = this.xAxis, h = g && g.categories && !g.categories.length ? [] : null, i; this.xIncrement = null; this.pointRange = g && g.categories ? 1 : d.pointRange; this.colorCounter = 0; var j = [], k = [], m = [], l = a ? a.length : [], p = (i = this.pointArrayMap) && i.length, n = !!this.toYData; if (l > (d.turboThreshold ||
            1E3)) { for (i = 0; f === null && i < l;) f = a[i], i++; if (Ea(f)) { f = o(d.pointStart, 0); d = o(d.pointInterval, 1); for (i = 0; i < l; i++) j[i] = f, k[i] = a[i], f += d; this.xIncrement = f } else if (Da(f)) if (p) for (i = 0; i < l; i++) d = a[i], j[i] = d[0], k[i] = d.slice(1, p + 1); else for (i = 0; i < l; i++) d = a[i], j[i] = d[0], k[i] = d[1] } else for (i = 0; i < l; i++) if (a[i] !== y && (d = { series: this }, this.pointClass.prototype.applyOptions.apply(d, [a[i]]), j[i] = d.x, k[i] = n ? this.toYData(d) : d.y, m[i] = d.z, h && d.name)) h[i] = d.name; this.requireSorting && j.length > 1 && j[1] < j[0] && qa(15); fa(k[0]) &&
            qa(14, !0); this.data = []; this.options.data = a; this.xData = j; this.yData = k; this.zData = m; this.names = h; for (i = c && c.length || 0; i--;) c[i] && c[i].destroy && c[i].destroy(); if (g) g.minRange = g.userMinRange; this.isDirty = this.isDirtyData = e.isDirtyBox = !0; o(b, !0) && e.redraw(!1)
        }, remove: function (a, b) { var c = this, d = c.chart, a = o(a, !0); if (!c.isRemoving) c.isRemoving = !0, D(c, "remove", null, function () { c.destroy(); d.isDirtyLegend = d.isDirtyBox = !0; a && d.redraw(b) }); c.isRemoving = !1 }, processData: function (a) {
            var b = this.xData, c = this.yData,
            d = b.length, e = 0, f = d, g, h, i = this.xAxis, j = this.options, k = j.cropThreshold, m = this.isCartesian; if (m && !this.isDirty && !i.isDirty && !this.yAxis.isDirty && !a) return !1; if (m && this.sorted && (!k || d > k || this.forceCrop)) if (a = i.getExtremes(), i = a.min, k = a.max, b[d - 1] < i || b[0] > k) b = [], c = []; else if (b[0] < i || b[d - 1] > k) { for (a = 0; a < d; a++) if (b[a] >= i) { e = q(0, a - 1); break } for (; a < d; a++) if (b[a] > k) { f = a + 1; break } b = b.slice(e, f); c = c.slice(e, f); g = !0 } for (a = b.length - 1; a > 0; a--) if (d = b[a] - b[a - 1], d > 0 && (h === y || d < h)) h = d; this.cropped = g; this.cropStart = e;
            this.processedXData = b; this.processedYData = c; if (j.pointRange === null) this.pointRange = h || 1; this.closestPointRange = h
        }, generatePoints: function () {
            var a = this.options.data, b = this.data, c, d = this.processedXData, e = this.processedYData, f = this.pointClass, g = d.length, h = this.cropStart || 0, i, j = this.hasGroupedData, k, m = [], l; if (!b && !j) b = [], b.length = a.length, b = this.data = b; for (l = 0; l < g; l++) i = h + l, j ? m[l] = (new f).init(this, [d[l]].concat(ha(e[l]))) : (b[i] ? k = b[i] : a[i] !== y && (b[i] = k = (new f).init(this, a[i], d[l])), m[l] = k); if (b && (g !==
            (c = b.length) || j)) for (l = 0; l < c; l++) if (l === h && !j && (l += g), b[l]) b[l].destroyElements(), b[l].plotX = y; this.data = b; this.points = m
        }, translate: function () {
            this.processedXData || this.processData(); this.generatePoints(); var a = this.options, b = a.stacking, c = this.xAxis, d = c.categories, e = this.yAxis, f = this.points, g = f.length, h = !!this.modifyValue, i, j, k = a.pointPlacement === "between", m = a.threshold; j = e.series.sort(function (a, b) { return a.index - b.index }); for (a = j.length; a--;) if (j[a].visible) { j[a] === this && (i = !0); break } for (a = 0; a <
            g; a++) {
                j = f[a]; var l = j.x, p = j.y, n = j.low, q = e.stacks[(p < m ? "-" : "") + this.stackKey]; if (e.isLog && p <= 0) j.y = p = null; j.plotX = c.translate(l, 0, 0, 0, 1, k); if (b && this.visible && q && q[l]) n = q[l], q = n.total, n.cum = n = n.cum - p, p = n + p, i && (n = o(m, e.min)), e.isLog && n <= 0 && (n = null), b === "percent" && (n = q ? n * 100 / q : 0, p = q ? p * 100 / q : 0), j.percentage = q ? j.y * 100 / q : 0, j.total = j.stackTotal = q, j.stackY = p; j.yBottom = r(n) ? e.translate(n, 0, 1, 0, 1) : null; h && (p = this.modifyValue(p, j)); j.plotY = typeof p === "number" && p !== Infinity ? t(e.translate(p, 0, 1, 0, 1) * 10) / 10 : y;
                j.clientX = k ? c.translate(l, 0, 0, 0, 1) : j.plotX; j.negative = j.y < (m || 0); j.category = d && d[j.x] !== y ? d[j.x] : j.x
            } this.getSegments()
        }, setTooltipPoints: function (a) {
            var b = [], c, d, e = (c = this.xAxis) ? c.tooltipLen || c.len : this.chart.plotSizeX, f, g, h = []; if (this.options.enableMouseTracking !== !1) {
                if (a) this.tooltipPoints = null; n(this.segments || this.points, function (a) { b = b.concat(a) }); c && c.reversed && (b = b.reverse()); a = b.length; for (g = 0; g < a; g++) {
                    f = b[g]; c = b[g - 1] ? d + 1 : 0; for (d = b[g + 1] ? q(0, T((f.clientX + (b[g + 1] ? b[g + 1].clientX : e)) / 2)) : e; c >=
                    0 && c <= d;) h[c++] = f
                } this.tooltipPoints = h
            }
        }, tooltipHeaderFormatter: function (a) { var b = this.tooltipOptions, c = b.xDateFormat, d = b.dateTimeLabelFormats, e = this.xAxis, f = e && e.options.type === "datetime", b = b.headerFormat, e = e && e.closestPointRange, g; if (f && !c) if (e) for (g in E) { if (E[g] >= e) { c = d[g]; break } } else c = d.day; f && c && Ea(a.key) && (b = b.replace("{point.key}", "{point.key:" + c + "}")); return wa(b, { point: a, series: this }) }, onMouseOver: function () {
            var a = this.chart, b = a.hoverSeries; if (b && b !== this) b.onMouseOut(); this.options.events.mouseOver &&
            D(this, "mouseOver"); this.setState("hover"); a.hoverSeries = this
        }, onMouseOut: function () { var a = this.options, b = this.chart, c = b.tooltip, d = b.hoverPoint; if (d) d.onMouseOut(); this && a.events.mouseOut && D(this, "mouseOut"); c && !a.stickyTracking && (!c.shared || this.noSharedTooltip) && c.hide(); this.setState(); b.hoverSeries = null }, animate: function (a) {
            var b = this, c = b.chart, d = c.renderer, e; e = b.options.animation; var f = c.clipBox, g = c.inverted, h; if (e && !V(e)) e = X[b.type].animation; h = "_sharedClip" + e.duration + e.easing; if (a) a = c[h],
            e = c[h + "m"], a || (c[h] = a = d.clipRect(v(f, { width: 0 })), c[h + "m"] = e = d.clipRect(-99, g ? -c.plotLeft : -c.plotTop, 99, g ? c.chartWidth : c.chartHeight)), b.group.clip(a), b.markerGroup.clip(e), b.sharedClipKey = h; else { if (a = c[h]) a.animate({ width: c.plotSizeX }, e), c[h + "m"].animate({ width: c.plotSizeX + 99 }, e); b.animate = null; b.animationTimeout = setTimeout(function () { b.afterAnimate() }, e.duration) }
        }, afterAnimate: function () {
            var a = this.chart, b = this.sharedClipKey, c = this.group; c && this.options.clip !== !1 && (c.clip(a.clipRect), this.markerGroup.clip());
            setTimeout(function () { b && a[b] && (a[b] = a[b].destroy(), a[b + "m"] = a[b + "m"].destroy()) }, 100)
        }, drawPoints: function () {
            var a, b = this.points, c = this.chart, d, e, f, g, h, i, j, k, m = this.options.marker, l, n = this.markerGroup; if (m.enabled || this._hasPointMarkers) for (f = b.length; f--;) if (g = b[f], d = g.plotX, e = g.plotY, k = g.graphic, i = g.marker || {}, a = m.enabled && i.enabled === y || i.enabled, l = c.isInsidePlot(t(d), e, c.inverted), a && e !== y && !isNaN(e) && g.y !== null) if (a = g.pointAttr[g.selected ? "select" : ""], h = a.r, i = o(i.symbol, this.symbol), j = i.indexOf("url") ===
            0, k) k.attr({ visibility: l ? Z ? "inherit" : "visible" : "hidden" }).animate(v({ x: d - h, y: e - h }, k.symbolName ? { width: 2 * h, height: 2 * h } : {})); else { if (l && (h > 0 || j)) g.graphic = c.renderer.symbol(i, d - h, e - h, 2 * h, 2 * h).attr(a).add(n) } else if (k) g.graphic = k.destroy()
        }, convertAttribs: function (a, b, c, d) { var e = this.pointAttrToOptions, f, g, h = {}, a = a || {}, b = b || {}, c = c || {}, d = d || {}; for (f in e) g = e[f], h[f] = o(a[g], b[f], c[f], d[f]); return h }, getAttribs: function () {
            var a = this, b = a.options, c = X[a.type].marker ? b.marker : b, d = c.states, e = d.hover, f, g = a.color,
            h = { stroke: g, fill: g }, i = a.points || [], j = [], k, m = a.pointAttrToOptions, l = b.negativeColor, p; b.marker ? (e.radius = e.radius || c.radius + 2, e.lineWidth = e.lineWidth || c.lineWidth + 1) : e.color = e.color || ma(e.color || g).brighten(e.brightness).get(); j[""] = a.convertAttribs(c, h); n(["hover", "select"], function (b) { j[b] = a.convertAttribs(d[b], j[""]) }); a.pointAttr = j; for (g = i.length; g--;) {
                h = i[g]; if ((c = h.options && h.options.marker || h.options) && c.enabled === !1) c.radius = 0; if (h.negative && l) h.color = h.fillColor = l; f = b.colorByPoint || h.color;
                if (h.options) for (p in m) r(c[m[p]]) && (f = !0); if (f) { c = c || {}; k = []; d = c.states || {}; f = d.hover = d.hover || {}; if (!b.marker) f.color = ma(f.color || h.color).brighten(f.brightness || e.brightness).get(); k[""] = a.convertAttribs(v({ color: h.color }, c), j[""]); k.hover = a.convertAttribs(d.hover, j.hover, k[""]); k.select = a.convertAttribs(d.select, j.select, k[""]); if (h.negative && b.marker && l) k[""].fill = k.hover.fill = k.select.fill = a.convertAttribs({ fillColor: l }).fill } else k = j; h.pointAttr = k
            }
        }, update: function (a, b) {
            var c = this.chart, d =
            this.type, a = x(this.userOptions, { animation: !1, index: this.index, pointStart: this.xData[0] }, a); this.remove(!1); v(this, aa[a.type || d].prototype); this.init(c, a); o(b, !0) && c.redraw(!1)
        }, destroy: function () {
            var a = this, b = a.chart, c = /AppleWebKit\/533/.test(Aa), d, e, f = a.data || [], g, h, i; D(a, "destroy"); ba(a); n(["xAxis", "yAxis"], function (b) { if (i = a[b]) ga(i.series, a), i.isDirty = i.forceRedraw = !0 }); a.legendItem && a.chart.legend.destroyItem(a); for (e = f.length; e--;) (g = f[e]) && g.destroy && g.destroy(); a.points = null; clearTimeout(a.animationTimeout);
            n("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","), function (b) { a[b] && (d = c && b === "group" ? "hide" : "destroy", a[b][d]()) }); if (b.hoverSeries === a) b.hoverSeries = null; ga(b.series, a); for (h in a) delete a[h]
        }, drawDataLabels: function () {
            var a = this, b = a.options.dataLabels, c = a.points, d, e, f, g; if (b.enabled || a._hasPointLabels) a.dlProcessOptions && a.dlProcessOptions(b), g = a.plotGroup("dataLabelsGroup", "data-labels", a.visible ? "visible" : "hidden", b.zIndex || 6), e = b, n(c, function (c) {
                var i,
                j = c.dataLabel, k, m, l = c.connector, n = !0; d = c.options && c.options.dataLabels; i = e.enabled || d && d.enabled; if (j && !i) c.dataLabel = j.destroy(); else if (i) {
                    i = b.rotation; b = x(e, d); k = c.getLabelConfig(); f = b.format ? wa(b.format, k) : b.formatter.call(k, b); b.style.color = o(b.color, b.style.color, a.color, "black"); if (j) if (r(f)) j.attr({ text: f }), n = !1; else { if (c.dataLabel = j = j.destroy(), l) c.connector = l.destroy() } else if (r(f)) {
                        j = {
                            fill: b.backgroundColor, stroke: b.borderColor, "stroke-width": b.borderWidth, r: b.borderRadius || 0, rotation: i,
                            padding: b.padding, zIndex: 1
                        }; for (m in j) j[m] === y && delete j[m]; j = c.dataLabel = a.chart.renderer[i ? "text" : "label"](f, 0, -999, null, null, null, b.useHTML).attr(j).css(b.style).add(g).shadow(b.shadow)
                    } j && a.alignDataLabel(c, j, b, null, n)
                }
            })
        }, alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart, g = f.inverted, h = o(a.plotX, -999), a = o(a.plotY, -999), i = b.getBBox(), d = v({ x: g ? f.plotWidth - a : h, y: t(g ? f.plotHeight - h : a), width: 0, height: 0 }, d); v(c, { width: i.width, height: i.height }); c.rotation ? (d = {
                align: c.align, x: d.x + c.x + d.width / 2, y: d.y +
                c.y + d.height / 2
            }, b[e ? "attr" : "animate"](d)) : b.align(c, null, d); b.attr({ visibility: c.crop === !1 || f.isInsidePlot(h, a, g) ? f.renderer.isSVG ? "inherit" : "visible" : "hidden" })
        }, getSegmentPath: function (a) { var b = this, c = [], d = b.options.step; n(a, function (e, f) { var g = e.plotX, h = e.plotY, i; b.getPointSpline ? c.push.apply(c, b.getPointSpline(a, e, f)) : (c.push(f ? "L" : "M"), d && f && (i = a[f - 1], d === "right" ? c.push(i.plotX, h) : d === "center" ? c.push((i.plotX + g) / 2, i.plotY, (i.plotX + g) / 2, h) : c.push(g, i.plotY)), c.push(e.plotX, e.plotY)) }); return c },
        getGraphPath: function () { var a = this, b = [], c, d = []; n(a.segments, function (e) { c = a.getSegmentPath(e); e.length > 1 ? b = b.concat(c) : d.push(e[0]) }); a.singlePoints = d; return a.graphPath = b }, drawGraph: function () {
            var a = this, b = this.options, c = [["graph", b.lineColor || this.color]], d = b.lineWidth, e = b.dashStyle, f = this.getGraphPath(), g = b.negativeColor; g && c.push(["graphNeg", g]); n(c, function (c, g) {
                var j = c[0], k = a[j]; if (k) Ta(k), k.animate({ d: f }); else if (d && f.length) {
                    k = { stroke: c[1], "stroke-width": d, zIndex: 1 }; if (e) k.dashstyle = e; a[j] =
                    a.chart.renderer.path(f).attr(k).add(a.group).shadow(!g && b.shadow)
                }
            })
        }, clipNeg: function () {
            var a = this.options, b = this.chart, c = b.renderer, d = a.negativeColor, e, f = this.graph, g = this.area, h = this.posClip, i = this.negClip; e = b.chartWidth; var j = b.chartHeight, k = q(e, j); if (d && (f || g)) d = ja(this.yAxis.len - this.yAxis.translate(a.threshold || 0)), a = { x: 0, y: 0, width: k, height: d }, k = { x: 0, y: d, width: k, height: k - d }, b.inverted && c.isVML && (a = { x: b.plotWidth - d - b.plotLeft, y: 0, width: e, height: j }, k = {
                x: d + b.plotLeft - e, y: 0, width: b.plotLeft + d,
                height: e
            }), this.yAxis.reversed ? (b = k, e = a) : (b = a, e = k), h ? (h.animate(b), i.animate(e)) : (this.posClip = h = c.clipRect(b), this.negClip = i = c.clipRect(e), f && (f.clip(h), this.graphNeg.clip(i)), g && (g.clip(h), this.areaNeg.clip(i)))
        }, invertGroups: function () { function a() { var a = { width: b.yAxis.len, height: b.xAxis.len }; n(["group", "markerGroup"], function (c) { b[c] && b[c].attr(a).invert() }) } var b = this, c = b.chart; if (b.xAxis) J(c, "resize", a), J(b, "destroy", function () { ba(c, "resize", a) }), a(), b.invertGroups = a }, plotGroup: function (a, b,
        c, d, e) { var f = this[a], g = !f, h = this.chart, i = this.xAxis, j = this.yAxis; g && (this[a] = f = h.renderer.g(b).attr({ visibility: c, zIndex: d || 0.1 }).add(e)); f[g ? "attr" : "animate"]({ translateX: i ? i.left : h.plotLeft, translateY: j ? j.top : h.plotTop, scaleX: 1, scaleY: 1 }); return f }, render: function () {
            var a = this.chart, b, c = this.options, d = c.animation && !!this.animate && a.renderer.isSVG, e = this.visible ? "visible" : "hidden", f = c.zIndex, g = this.hasRendered, h = a.seriesGroup; b = this.plotGroup("group", "series", e, f, h); this.markerGroup = this.plotGroup("markerGroup",
            "markers", e, f, h); d && this.animate(!0); this.getAttribs(); b.inverted = this.isCartesian ? a.inverted : !1; this.drawGraph && (this.drawGraph(), this.clipNeg()); this.drawDataLabels(); this.drawPoints(); this.options.enableMouseTracking !== !1 && this.drawTracker(); a.inverted && this.invertGroups(); c.clip !== !1 && !this.sharedClipKey && !g && b.clip(a.clipRect); d ? this.animate() : g || this.afterAnimate(); this.isDirty = this.isDirtyData = !1; this.hasRendered = !0
        }, redraw: function () {
            var a = this.chart, b = this.isDirtyData, c = this.group, d = this.xAxis,
            e = this.yAxis; c && (a.inverted && c.attr({ width: a.plotWidth, height: a.plotHeight }), c.animate({ translateX: o(d && d.left, a.plotLeft), translateY: o(e && e.top, a.plotTop) })); this.translate(); this.setTooltipPoints(!0); this.render(); b && D(this, "updatedData")
        }, setState: function (a) { var b = this.options, c = this.graph, d = this.graphNeg, e = b.states, b = b.lineWidth, a = a || ""; if (this.state !== a) this.state = a, e[a] && e[a].enabled === !1 || (a && (b = e[a].lineWidth || b + 1), c && !c.dashstyle && (a = { "stroke-width": b }, c.attr(a), d && d.attr(a))) }, setVisible: function (a,
        b) {
            var c = this, d = c.chart, e = c.legendItem, f, g = d.options.chart.ignoreHiddenSeries, h = c.visible; f = (c.visible = a = c.userOptions.visible = a === y ? !h : a) ? "show" : "hide"; n(["group", "dataLabelsGroup", "markerGroup", "tracker"], function (a) { if (c[a]) c[a][f]() }); if (d.hoverSeries === c) c.onMouseOut(); e && d.legend.colorizeItem(c, a); c.isDirty = !0; c.options.stacking && n(d.series, function (a) { if (a.options.stacking && a.visible) a.isDirty = !0 }); n(c.linkedSeries, function (b) { b.setVisible(a, !1) }); if (g) d.isDirtyBox = !0; b !== !1 && d.redraw(); D(c,
            f)
        }, show: function () { this.setVisible(!0) }, hide: function () { this.setVisible(!1) }, select: function (a) { this.selected = a = a === y ? !this.selected : a; if (this.checkbox) this.checkbox.checked = a; D(this, a ? "select" : "unselect") }, drawTracker: function () {
            var a = this, b = a.options, c = b.trackByArea, d = [].concat(c ? a.areaPath : a.graphPath), e = d.length, f = a.chart, g = f.pointer, h = f.renderer, i = f.options.tooltip.snap, j = a.tracker, k = b.cursor, k = k && { cursor: k }, m = a.singlePoints, l, n = function () { if (f.hoverSeries !== a) a.onMouseOver() }; if (e && !c) for (l =
            e + 1; l--;) d[l] === "M" && d.splice(l + 1, 0, d[l + 1] - i, d[l + 2], "L"), (l && d[l] === "M" || l === e) && d.splice(l, 0, "L", d[l - 2] + i, d[l - 1]); for (l = 0; l < m.length; l++) e = m[l], d.push("M", e.plotX - i, e.plotY, "L", e.plotX + i, e.plotY); if (j) j.attr({ d: d }); else if (a.tracker = j = h.path(d).attr({ "class": "highcharts-tracker", "stroke-linejoin": "round", visibility: a.visible ? "visible" : "hidden", stroke: Ob, fill: c ? Ob : S, "stroke-width": b.lineWidth + (c ? 0 : 2 * i), zIndex: 2 }).addClass("highcharts-tracker").on("mouseover", n).on("mouseout", function (a) { g.onTrackerMouseOut(a) }).css(k).add(a.markerGroup),
            fb) j.on("touchstart", n)
        }
    }; M = ea(R); aa.line = M; X.area = x(W, { threshold: 0 }); M = ea(R, {
        type: "area", getSegments: function () {
            var a = [], b = [], c = [], d = this.xAxis, e = this.yAxis, f = e.stacks[this.stackKey], g = {}, h, i, j = this.points, k, m; if (this.options.stacking && !this.cropped) {
                for (k = 0; k < j.length; k++) g[j[k].x] = j[k]; for (m in f) c.push(+m); c.sort(function (a, b) { return a - b }); n(c, function (a) { g[a] ? b.push(g[a]) : (h = d.translate(a), i = e.toPixels(f[a].cum, !0), b.push({ y: null, plotX: h, clientX: h, plotY: i, yBottom: i, onMouseOver: ta })) }); b.length &&
                a.push(b)
            } else R.prototype.getSegments.call(this), a = this.segments; this.segments = a
        }, getSegmentPath: function (a) { var b = R.prototype.getSegmentPath.call(this, a), c = [].concat(b), d, e = this.options; b.length === 3 && c.push("L", b[1], b[2]); if (e.stacking && !this.closedStacks) for (d = a.length - 1; d >= 0; d--) d < a.length - 1 && e.step && c.push(a[d + 1].plotX, a[d].yBottom), c.push(a[d].plotX, a[d].yBottom); else this.closeSegment(c, a); this.areaPath = this.areaPath.concat(c); return b }, closeSegment: function (a, b) {
            var c = this.yAxis.getThreshold(this.options.threshold);
            a.push("L", b[b.length - 1].plotX, c, "L", b[0].plotX, c)
        }, drawGraph: function () { this.areaPath = []; R.prototype.drawGraph.apply(this); var a = this, b = this.areaPath, c = this.options, d = [["area", this.color, c.fillColor]]; c.negativeColor && d.push(["areaNeg", c.negativeColor, c.negativeFillColor]); n(d, function (d) { var f = d[0], g = a[f]; g ? g.animate({ d: b }) : a[f] = a.chart.renderer.path(b).attr({ fill: o(d[2], ma(d[1]).setOpacity(c.fillOpacity || 0.75).get()), zIndex: 0 }).add(a.group) }) }, drawLegendSymbol: function (a, b) {
            b.legendSymbol = this.chart.renderer.rect(0,
            a.baseline - 11, a.options.symbolWidth, 12, 2).attr({ zIndex: 3 }).add(b.legendGroup)
        }
    }); aa.area = M; X.spline = x(W); F = ea(R, {
        type: "spline", getPointSpline: function (a, b, c) {
            var d = b.plotX, e = b.plotY, f = a[c - 1], g = a[c + 1], h, i, j, k; if (f && g) { a = f.plotY; j = g.plotX; var g = g.plotY, m; h = (1.5 * d + f.plotX) / 2.5; i = (1.5 * e + a) / 2.5; j = (1.5 * d + j) / 2.5; k = (1.5 * e + g) / 2.5; m = (k - i) * (j - d) / (j - h) + e - k; i += m; k += m; i > a && i > e ? (i = q(a, e), k = 2 * e - i) : i < a && i < e && (i = K(a, e), k = 2 * e - i); k > g && k > e ? (k = q(g, e), i = 2 * e - k) : k < g && k < e && (k = K(g, e), i = 2 * e - k); b.rightContX = j; b.rightContY = k } c ?
            (b = ["C", f.rightContX || f.plotX, f.rightContY || f.plotY, h || d, i || e, d, e], f.rightContX = f.rightContY = null) : b = ["M", d, e]; return b
        }
    }); aa.spline = F; X.areaspline = x(X.area); na = M.prototype; F = ea(F, { type: "areaspline", closedStacks: !0, getSegmentPath: na.getSegmentPath, closeSegment: na.closeSegment, drawGraph: na.drawGraph }); aa.areaspline = F; X.column = x(W, {
        borderColor: "#FFFFFF", borderWidth: 1, borderRadius: 0, groupPadding: 0.2, marker: null, pointPadding: 0.1, minPointLength: 0, cropThreshold: 50, pointRange: null, states: {
            hover: {
                brightness: 0.1,
                shadow: !1
            }, select: { color: "#C0C0C0", borderColor: "#000000", shadow: !1 }
        }, dataLabels: { align: null, verticalAlign: null, y: null }, stickyTracking: !1, threshold: 0
    }); F = ea(R, {
        type: "column", tooltipOutsidePlot: !0, requireSorting: !1, pointAttrToOptions: { stroke: "borderColor", "stroke-width": "borderWidth", fill: "color", r: "borderRadius" }, trackerGroups: ["group", "dataLabelsGroup"], init: function () { R.prototype.init.apply(this, arguments); var a = this, b = a.chart; b.hasRendered && n(b.series, function (b) { if (b.type === a.type) b.isDirty = !0 }) },
        getColumnMetrics: function () {
            var a = this, b = a.chart, c = a.options, d = this.xAxis, e = d.reversed, f, g = {}, h, i = 0; c.grouping === !1 ? i = 1 : n(b.series, function (b) { var c = b.options; if (b.type === a.type && b.visible && a.options.group === c.group) c.stacking ? (f = b.stackKey, g[f] === y && (g[f] = i++), h = g[f]) : c.grouping !== !1 && (h = i++), b.columnIndex = h }); var b = K(Q(d.transA) * (d.ordinalSlope || c.pointRange || d.closestPointRange || 1), d.len), d = b * c.groupPadding, j = (b - 2 * d) / i, k = c.pointWidth, c = r(k) ? (j - k) / 2 : j * c.pointPadding, k = o(k, j - 2 * c); return a.columnMetrics =
            { width: k, offset: c + (d + ((e ? i - (a.columnIndex || 0) : a.columnIndex) || 0) * j - b / 2) * (e ? -1 : 1) }
        }, translate: function () {
            var a = this, b = a.chart, c = a.options, d = c.stacking, e = c.borderWidth, f = a.yAxis, g = a.translatedThreshold = f.getThreshold(c.threshold), h = o(c.minPointLength, 5), c = a.getColumnMetrics(), i = c.width, j = ja(q(i, 1 + 2 * e)), k = c.offset; R.prototype.translate.apply(a); n(a.points, function (c) {
                var l = K(q(-999, c.plotY), f.len + 999), n = o(c.yBottom, g), s = c.plotX + k, t = ja(K(l, n)), l = ja(q(l, n) - t), r = f.stacks[(c.y < 0 ? "-" : "") + a.stackKey]; d && a.visible &&
                r && r[c.x] && r[c.x].setOffset(k, j); Q(l) < h && h && (l = h, t = Q(t - g) > h ? n - h : g - (f.translate(c.y, 0, 1, 0, 1) <= g ? h : 0)); c.barX = s; c.pointWidth = i; c.shapeType = "rect"; c.shapeArgs = c = b.renderer.Element.prototype.crisp.call(0, e, s, t, j, l); e % 2 && (c.y -= 1, c.height += 1)
            })
        }, getSymbol: ta, drawLegendSymbol: M.prototype.drawLegendSymbol, drawGraph: ta, drawPoints: function () {
            var a = this, b = a.options, c = a.chart.renderer, d; n(a.points, function (e) {
                var f = e.plotY, g = e.graphic; if (f !== y && !isNaN(f) && e.y !== null) d = e.shapeArgs, g ? (Ta(g), g.animate(x(d))) : e.graphic =
                c[e.shapeType](d).attr(e.pointAttr[e.selected ? "select" : ""]).add(a.group).shadow(b.shadow, null, b.stacking && !b.borderRadius); else if (g) e.graphic = g.destroy()
            })
        }, drawTracker: function () {
            var a = this, b = a.chart.pointer, c = a.options.cursor, d = c && { cursor: c }, e = function (b) { var c = b.target, d; for (a.onMouseOver() ; c && !d;) d = c.point, c = c.parentNode; if (d !== y) d.onMouseOver(b) }; n(a.points, function (a) { if (a.graphic) a.graphic.element.point = a; if (a.dataLabel) a.dataLabel.element.point = a }); a._hasTracking ? a._hasTracking = !0 : n(a.trackerGroups,
            function (c) { if (a[c] && (a[c].addClass("highcharts-tracker").on("mouseover", e).on("mouseout", function (a) { b.onTrackerMouseOut(a) }).css(d), fb)) a[c].on("touchstart", e) })
        }, alignDataLabel: function (a, b, c, d, e) {
            var f = this.chart, g = f.inverted, h = a.dlBox || a.shapeArgs, i = a.below || a.plotY > o(this.translatedThreshold, f.plotSizeY), j = o(c.inside, !!this.options.stacking); if (h && (d = x(h), g && (d = { x: f.plotWidth - d.y - d.height, y: f.plotHeight - d.x - d.width, width: d.height, height: d.width }), !j)) g ? (d.x += i ? 0 : d.width, d.width = 0) : (d.y += i ? d.height :
            0, d.height = 0); c.align = o(c.align, !g || j ? "center" : i ? "right" : "left"); c.verticalAlign = o(c.verticalAlign, g || j ? "middle" : i ? "top" : "bottom"); R.prototype.alignDataLabel.call(this, a, b, c, d, e)
        }, animate: function (a) { var b = this.yAxis, c = this.options, d = this.chart.inverted, e = {}; if (Z) a ? (e.scaleY = 0.001, a = K(b.pos + b.len, q(b.pos, b.toPixels(c.threshold))), d ? e.translateX = a - b.len : e.translateY = a, this.group.attr(e)) : (e.scaleY = 1, e[d ? "translateX" : "translateY"] = b.pos, this.group.animate(e, this.options.animation), this.animate = null) },
        remove: function () { var a = this, b = a.chart; b.hasRendered && n(b.series, function (b) { if (b.type === a.type) b.isDirty = !0 }); R.prototype.remove.apply(a, arguments) }
    }); aa.column = F; X.bar = x(X.column); na = ea(F, { type: "bar", inverted: !0 }); aa.bar = na; X.scatter = x(W, { lineWidth: 0, tooltip: { headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>', pointFormat: "x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>", followPointer: !0 }, stickyTracking: !1 }); na = ea(R, {
        type: "scatter", sorted: !1, requireSorting: !1,
        noSharedTooltip: !0, trackerGroups: ["markerGroup"], drawTracker: F.prototype.drawTracker, setTooltipPoints: ta
    }); aa.scatter = na; X.pie = x(W, { borderColor: "#FFFFFF", borderWidth: 1, center: [null, null], clip: !1, colorByPoint: !0, dataLabels: { distance: 30, enabled: !0, formatter: function () { return this.point.name } }, ignoreHiddenPoint: !0, legendType: "point", marker: null, size: null, showInLegend: !1, slicedOffset: 10, states: { hover: { brightness: 0.1, shadow: !1 } }, stickyTracking: !1, tooltip: { followPointer: !0 } }); W = {
        type: "pie", isCartesian: !1,
        pointClass: ea(Na, {
            init: function () { Na.prototype.init.apply(this, arguments); var a = this, b; if (a.y < 0) a.y = null; v(a, { visible: a.visible !== !1, name: o(a.name, "Slice") }); b = function () { a.slice() }; J(a, "select", b); J(a, "unselect", b); return a }, setVisible: function (a) {
                var b = this, c = b.series, d = c.chart, e; b.visible = b.options.visible = a = a === y ? !b.visible : a; c.options.data[la(b, c.data)] = b.options; e = a ? "show" : "hide"; n(["graphic", "dataLabel", "connector", "shadowGroup"], function (a) { if (b[a]) b[a][e]() }); b.legendItem && d.legend.colorizeItem(b,
                a); if (!c.isDirty && c.options.ignoreHiddenPoint) c.isDirty = !0, d.redraw()
            }, slice: function (a, b, c) { var d = this.series; Ia(c, d.chart); o(b, !0); this.sliced = this.options.sliced = a = r(a) ? a : !this.sliced; d.options.data[la(this, d.data)] = this.options; a = a ? this.slicedTranslation : { translateX: 0, translateY: 0 }; this.graphic.animate(a); this.shadowGroup && this.shadowGroup.animate(a) }
        }), requireSorting: !1, noSharedTooltip: !0, trackerGroups: ["group", "dataLabelsGroup"], pointAttrToOptions: {
            stroke: "borderColor", "stroke-width": "borderWidth",
            fill: "color"
        }, getColor: ta, animate: function (a) { var b = this, c = b.points, d = b.startAngleRad; if (!a) n(c, function (a) { var c = a.graphic, a = a.shapeArgs; c && (c.attr({ r: b.center[3] / 2, start: d, end: d }), c.animate({ r: a.r, start: a.start, end: a.end }, b.options.animation)) }), b.animate = null }, setData: function (a, b) { R.prototype.setData.call(this, a, !1); this.processData(); this.generatePoints(); o(b, !0) && this.chart.redraw() }, getCenter: function () {
            var a = this.options, b = this.chart, c = 2 * (a.slicedOffset || 0), d, e = b.plotWidth - 2 * c, f = b.plotHeight -
            2 * c, b = a.center, a = [o(b[0], "50%"), o(b[1], "50%"), a.size || "100%", a.innerSize || 0], g = K(e, f), h; return La(a, function (a, b) { h = /%$/.test(a); d = b < 2 || b === 2 && h; return (h ? [e, f, g, g][b] * u(a) / 100 : a) + (d ? c : 0) })
        }, translate: function (a) {
            this.generatePoints(); var b = 0, c = 0, d = this.options, e = d.slicedOffset, f = e + d.borderWidth, g, h, i, j = this.startAngleRad = Ka / 180 * ((d.startAngle || 0) % 360 - 90), k = this.points, m = 2 * Ka, l = d.dataLabels.distance, n = d.ignoreHiddenPoint, o, q = k.length, r; if (!a) this.center = a = this.getCenter(); this.getX = function (b, c) {
                i =
                I.asin((b - a[1]) / (a[2] / 2 + l)); return a[0] + (c ? -1 : 1) * Y(i) * (a[2] / 2 + l)
            }; for (o = 0; o < q; o++) r = k[o], b += n && !r.visible ? 0 : r.y; for (o = 0; o < q; o++) {
                r = k[o]; d = b ? r.y / b : 0; g = t((j + c * m) * 1E3) / 1E3; if (!n || r.visible) c += d; h = t((j + c * m) * 1E3) / 1E3; r.shapeType = "arc"; r.shapeArgs = { x: a[0], y: a[1], r: a[2] / 2, innerR: a[3] / 2, start: g, end: h }; i = (h + g) / 2; i > 0.75 * m && (i -= 2 * Ka); r.slicedTranslation = { translateX: t(Y(i) * e), translateY: t(ca(i) * e) }; g = Y(i) * a[2] / 2; h = ca(i) * a[2] / 2; r.tooltipPos = [a[0] + g * 0.7, a[1] + h * 0.7]; r.half = i < m / 4 ? 0 : 1; r.angle = i; f = K(f, l / 2); r.labelPos =
                [a[0] + g + Y(i) * l, a[1] + h + ca(i) * l, a[0] + g + Y(i) * f, a[1] + h + ca(i) * f, a[0] + g, a[1] + h, l < 0 ? "center" : r.half ? "right" : "left", i]; r.percentage = d * 100; r.total = b
            } this.setTooltipPoints()
        }, drawGraph: null, drawPoints: function () {
            var a = this, b = a.chart.renderer, c, d, e = a.options.shadow, f, g; if (e && !a.shadowGroup) a.shadowGroup = b.g("shadow").add(a.group); n(a.points, function (h) {
                d = h.graphic; g = h.shapeArgs; f = h.shadowGroup; if (e && !f) f = h.shadowGroup = b.g("shadow").add(a.shadowGroup); c = h.sliced ? h.slicedTranslation : { translateX: 0, translateY: 0 };
                f && f.attr(c); d ? d.animate(v(g, c)) : h.graphic = d = b.arc(g).setRadialReference(a.center).attr(h.pointAttr[h.selected ? "select" : ""]).attr({ "stroke-linejoin": "round" }).attr(c).add(a.group).shadow(e, f); h.visible === !1 && h.setVisible(!1)
            })
        }, drawDataLabels: function () {
            var a = this, b = a.data, c, d = a.chart, e = a.options.dataLabels, f = o(e.connectorPadding, 10), g = o(e.connectorWidth, 1), h = d.plotWidth, d = d.plotHeight, i, j, k = o(e.softConnector, !0), m = e.distance, l = a.center, p = l[2] / 2, s = l[1], r = m > 0, v, w, u, x, y = [[], []], A, z, E, H, C, D = [0, 0, 0, 0],
            K = function (a, b) { return b.y - a.y }, M = function (a, b) { a.sort(function (a, c) { return a.angle !== void 0 && (c.angle - a.angle) * b }) }; if (e.enabled || a._hasPointLabels) {
                R.prototype.drawDataLabels.apply(a); n(b, function (a) { a.dataLabel && y[a.half].push(a) }); for (H = 0; !x && b[H];) x = b[H] && b[H].dataLabel && (b[H].dataLabel.getBBox().height || 21), H++; for (H = 2; H--;) {
                    var b = [], L = [], I = y[H], J = I.length, F; M(I, H - 0.5); if (m > 0) {
                        for (C = s - p - m; C <= s + p + m; C += x) b.push(C); w = b.length; if (J > w) {
                            c = [].concat(I); c.sort(K); for (C = J; C--;) c[C].rank = C; for (C = J; C--;) I[C].rank >=
                            w && I.splice(C, 1); J = I.length
                        } for (C = 0; C < J; C++) { c = I[C]; u = c.labelPos; c = 9999; var O, N; for (N = 0; N < w; N++) O = Q(b[N] - u[1]), O < c && (c = O, F = N); if (F < C && b[C] !== null) F = C; else for (w < J - C + F && b[C] !== null && (F = w - J + C) ; b[F] === null;) F++; L.push({ i: F, y: b[F] }); b[F] = null } L.sort(K)
                    } for (C = 0; C < J; C++) {
                        c = I[C]; u = c.labelPos; v = c.dataLabel; E = c.visible === !1 ? "hidden" : "visible"; c = u[1]; if (m > 0) { if (w = L.pop(), F = w.i, z = w.y, c > z && b[F + 1] !== null || c < z && b[F - 1] !== null) z = c } else z = c; A = e.justify ? l[0] + (H ? -1 : 1) * (p + m) : a.getX(F === 0 || F === b.length - 1 ? c : z, H); v._attr =
                        { visibility: E, align: u[6] }; v._pos = { x: A + e.x + ({ left: f, right: -f }[u[6]] || 0), y: z + e.y - 10 }; v.connX = A; v.connY = z; if (this.options.size === null) w = v.width, A - w < f ? D[3] = q(t(w - A + f), D[3]) : A + w > h - f && (D[1] = q(t(A + w - h + f), D[1])), z - x / 2 < 0 ? D[0] = q(t(-z + x / 2), D[0]) : z + x / 2 > d && (D[2] = q(t(z + x / 2 - d), D[2]))
                    }
                } if (pa(D) === 0 || this.verifyDataLabelOverflow(D)) this.placeDataLabels(), r && g && n(this.points, function (b) {
                    i = b.connector; u = b.labelPos; if ((v = b.dataLabel) && v._pos) E = v._attr.visibility, A = v.connX, z = v.connY, j = k ? ["M", A + (u[6] === "left" ? 5 : -5), z,
                    "C", A, z, 2 * u[2] - u[4], 2 * u[3] - u[5], u[2], u[3], "L", u[4], u[5]] : ["M", A + (u[6] === "left" ? 5 : -5), z, "L", u[2], u[3], "L", u[4], u[5]], i ? (i.animate({ d: j }), i.attr("visibility", E)) : b.connector = i = a.chart.renderer.path(j).attr({ "stroke-width": g, stroke: e.connectorColor || b.color || "#606060", visibility: E }).add(a.group); else if (i) b.connector = i.destroy()
                })
            }
        }, verifyDataLabelOverflow: function (a) {
            var b = this.center, c = this.options, d = c.center, e = c = c.minSize || 80, f; d[0] !== null ? e = q(b[2] - q(a[1], a[3]), c) : (e = q(b[2] - a[1] - a[3], c), b[0] += (a[3] -
            a[1]) / 2); d[1] !== null ? e = q(K(e, b[2] - q(a[0], a[2])), c) : (e = q(K(e, b[2] - a[0] - a[2]), c), b[1] += (a[0] - a[2]) / 2); e < b[2] ? (b[2] = e, this.translate(b), n(this.points, function (a) { if (a.dataLabel) a.dataLabel._pos = null }), this.drawDataLabels()) : f = !0; return f
        }, placeDataLabels: function () { n(this.points, function (a) { var a = a.dataLabel, b; if (a) (b = a._pos) ? (a.attr(a._attr), a[a.moved ? "animate" : "attr"](b), a.moved = !0) : a && a.attr({ y: -999 }) }) }, alignDataLabel: ta, drawTracker: F.prototype.drawTracker, drawLegendSymbol: M.prototype.drawLegendSymbol,
        getSymbol: ta
    }; W = ea(R, W); aa.pie = W; v(Highcharts, {
        Axis: ab, Chart: tb, Color: ma, Legend: sb, Pointer: rb, Point: Na, Tick: Ja, Tooltip: qb, Renderer: Sa, Series: R, SVGElement: ra, SVGRenderer: Ca, arrayMin: Ga, arrayMax: pa, charts: Ba, dateFormat: Ua, format: wa, pathAnim: vb, getOptions: function () { return N }, hasBidiBug: Sb, isTouchDevice: Mb, numberFormat: ua, seriesTypes: aa, setOptions: function (a) { N = x(N, a); Jb(); return N }, addEvent: J, removeEvent: ba, createElement: U, discardElement: Ra, css: L, each: n, extend: v, map: La, merge: x, pick: o, splat: ha, extendClass: ea,
        pInt: u, wrap: zb, svg: Z, canvas: $, vml: !Z && !$, product: "Highcharts", version: "3.0.2"
    })
})();