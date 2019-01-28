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

declare const win: any;

const glob = (typeof win === 'undefined' ? window : win) as any;

namespace Highcharts {

    export const product = '@product.name@';
    export const version = '@product.version@';

    export const win = glob;

    export const userAgent = (
        (glob.navigator && glob.navigator.userAgent) || ''
    );
    export const isChrome = userAgent.indexOf('Chrome') !== -1;
    export const isFirefox = userAgent.indexOf('Firefox') !== -1;
    export const isMS = /(edge|msie|trident)/i.test(userAgent) && !glob.opera;
    export const isSafari = !isChrome && userAgent.indexOf('Safari') !== -1;
    export const isTouchDevice = /(Mobile|Android|Windows Phone)/.test(userAgent);
    export const isWebKit = userAgent.indexOf('AppleWebKit') !== -1;

    export const doc = glob.document;
    export const hasBidiBug = (
        isFirefox &&
        parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
    );
    export const hasTouch = (
        doc && doc.documentElement.ontouchstart !== undefined
    );
    export const noop = function () {
        return undefined;
    };


    export const SVG_NS = 'http://www.w3.org/2000/svg';
    export const svg = (
        doc &&
        doc.createElementNS &&
        !!doc.createElementNS(SVG_NS, 'svg').createSVGRect
    );

    export let chartCount = 0;
    export const deg2rad = Math.PI * 2 / 360;
    export const marginNames = [
        'plotTop', 'marginRight', 'marginBottom', 'plotLeft'
    ];
    export const seriesTypes = {};
    export const symbolSizes = {};

    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     *
     * @name Highcharts.charts
     * @type {Array<Highcharts.Chart>}
     */
    export const charts = [];
}

if (glob.Highcharts) {
    glob.Highcharts.error(16, true);
}

export default Highcharts as any;
