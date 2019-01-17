/* *
 *
 *  (c) 2010-2018 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */
/* eslint-disable */
/**
 * Reference to the global SVGElement class as a workaround for a name conflict
 * in the Highcharts namespace.
 *
 * @global
 * @typedef {global.SVGElement} GlobalSVGElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */
'use strict';
const glob = (typeof win === 'undefined' ? window : win);
var Highcharts;
(function (Highcharts) {
    Highcharts.product = '@product.name@';
    Highcharts.version = '@product.version@';
    Highcharts.win = glob;
    Highcharts.userAgent = ((glob.navigator && glob.navigator.userAgent) || '');
    Highcharts.isChrome = Highcharts.userAgent.indexOf('Chrome') !== -1;
    Highcharts.isFirefox = Highcharts.userAgent.indexOf('Firefox') !== -1;
    Highcharts.isMS = /(edge|msie|trident)/i.test(Highcharts.userAgent) && !glob.opera;
    Highcharts.isSafari = !Highcharts.isChrome && Highcharts.userAgent.indexOf('Safari') !== -1;
    Highcharts.isTouchDevice = /(Mobile|Android|Windows Phone)/.test(Highcharts.userAgent);
    Highcharts.isWebKit = Highcharts.userAgent.indexOf('AppleWebKit') !== -1;
    Highcharts.doc = glob.document;
    Highcharts.hasBidiBug = (Highcharts.isFirefox &&
        parseInt(Highcharts.userAgent.split('Firefox/')[1], 10) < 4 // issue #38
    );
    Highcharts.hasTouch = (Highcharts.doc && Highcharts.doc.documentElement.ontouchstart !== undefined);
    Highcharts.noop = function () {
        return undefined;
    };
    Highcharts.SVG_NS = 'http://www.w3.org/2000/svg';
    Highcharts.svg = (Highcharts.doc &&
        Highcharts.doc.createElementNS &&
        !!Highcharts.doc.createElementNS(Highcharts.SVG_NS, 'svg').createSVGRect);
    Highcharts.chartCount = 0;
    Highcharts.deg2rad = Math.PI * 2 / 360;
    Highcharts.marginNames = [
        'plotTop', 'marginRight', 'marginBottom', 'plotLeft'
    ];
    Highcharts.seriesTypes = {};
    Highcharts.symbolSizes = {};
    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     *
     * @name Highcharts.charts
     * @type {Array<Highcharts.Chart>}
     */
    Highcharts.charts = [];
})(Highcharts || (Highcharts = {}));
if (glob.Highcharts) {
    glob.Highcharts.error(16, true);
}
export default Highcharts;
