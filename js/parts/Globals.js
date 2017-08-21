/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
/* global win */
var doc = win.document,
	SVG_NS = 'http://www.w3.org/2000/svg',
	userAgent = (win.navigator && win.navigator.userAgent) || '',
	svg = doc && doc.createElementNS && !!doc.createElementNS(SVG_NS, 'svg').createSVGRect,
	isMS = /(edge|msie|trident)/i.test(userAgent) && !win.opera,
	vml = !svg,
	isFirefox = /Firefox/.test(userAgent),
	hasBidiBug = isFirefox && parseInt(userAgent.split('Firefox/')[1], 10) < 4; // issue #38

var Highcharts = win.Highcharts ? win.Highcharts.error(16, true) : {
	product: '@product.name@',
	version: '@product.version@',
	deg2rad: Math.PI * 2 / 360,
	doc: doc,
	hasBidiBug: hasBidiBug,
	hasTouch: doc && doc.documentElement.ontouchstart !== undefined,
	isMS: isMS,
	isWebKit: /AppleWebKit/.test(userAgent),
	isFirefox: isFirefox,
	isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
	SVG_NS: SVG_NS,
	chartCount: 0,
	seriesTypes: {},
	symbolSizes: {},
	svg: svg,
	vml: vml,
	win: win,
	marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
	noop: function () {
		return undefined;
	},
	/**
	 * An array containing the current chart objects in the page. A chart's
	 * position in the array is preserved throughout the page's lifetime. When
	 * a chart is destroyed, the array item becomes `undefined`.
	 * @type {Array.<Highcharts.Chart>}
	 * @memberOf Highcharts
	 */
	charts: []
};
export default Highcharts;
