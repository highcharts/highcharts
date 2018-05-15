/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
/* global win, window */

// glob is a temporary fix to allow our es-modules to work.
var glob = typeof win === 'undefined' ? window : win,
    doc = glob.document,
    SVG_NS = 'http://www.w3.org/2000/svg',
    userAgent = (glob.navigator && glob.navigator.userAgent) || '',
    svg = (
        doc &&
        doc.createElementNS &&
        !!doc.createElementNS(SVG_NS, 'svg').createSVGRect
    ),
    isMS = /(edge|msie|trident)/i.test(userAgent) && !glob.opera,
    isFirefox = userAgent.indexOf('Firefox') !== -1,
    isChrome = userAgent.indexOf('Chrome') !== -1,
    hasBidiBug = (
        isFirefox &&
        parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
    );

var Highcharts = glob.Highcharts ? glob.Highcharts.error(16, true) :
/** @lends Highcharts */
{
    /**
     * @type {string}
     */
    product: '@product.name@',
    /**
     * @type {string}
     */
    version: '@product.version@',
    /**
     * @type {number}
     */
    deg2rad: Math.PI * 2 / 360,
    /**
     * @type {Document}
     */
    doc: doc,
    /**
     * @type {boolean}
     */
    hasBidiBug: hasBidiBug,
    /**
     * @type {boolean}
     */
    hasTouch: doc && doc.documentElement.ontouchstart !== undefined,
    /**
     * @type {boolean}
     */
    isMS: isMS,
    /**
     * @type {boolean}
     */
    isWebKit: userAgent.indexOf('AppleWebKit') !== -1,
    /**
     * @type {boolean}
     */
    isFirefox: isFirefox,
    /**
     * @type {boolean}
     */
    isChrome: isChrome,
    /**
     * @type {boolean}
     */
    isSafari: !isChrome && userAgent.indexOf('Safari') !== -1,
    /**
     * @type {boolean}
     */
    isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
    /**
     * @type {string}
     */
    SVG_NS: SVG_NS,
    /**
     * @type {number}
     */
    chartCount: 0,
    /**
     * @namespace
     * @chart-private
     */
    seriesTypes: {},
    /**
     * @type {Object}
     */
    symbolSizes: {},
    /**
     * @type {Function}
     */
    svg: svg,
    /**
     * @type {Window}
     */
    win: glob,
    /**
     * @type {string[]}
     */
    marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
    /**
     * @type {Function}
     */
    noop: function () {
        return undefined;
    },
    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     * @type {Array<Chart>}
     * @memberOf Highcharts
     */
    charts: []
};
export default Highcharts;
