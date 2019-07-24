/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type NavigationOptions = any; // @todo exporting module
        type PatternObject = object; // @todo pattern module
        type VariablePieSeries = any; // @todo variable pie module
        interface Axis {
            beforePadding?: Function; // @todo
            getMaxLabelDimensions?: Function; // @todo
        }
        interface Chart {
            drilldownLevels?: any; // @todo drilldown module
            hasParallelCoordinates?: any; // @todo parallel module
            is3d?: any; // @todo highcharts 3d
            isBoosting?: any; // @todo boost module
            isPrinting?: any; // @todo exporting module
            openMenu?: any; // @todo exporting module
            redrawTrigger?: any; // @todo static-scale module
            hideOverlappingLabels: Function; // @todo overlapping module
        }
        interface ChartOptions {
            forExport?: any; // @todo
        }
        interface ColumnSeries {
            animateDrillupFrom: Function; // @todo drilldown module
            animateDrillupTo: Function; // @todo drilldown module
            translate3dPoints: Function; // @todo
            translate3dShapes: Function; // @todo
        }
        interface NetworkgraphLayout {
            beforeStep: Function; // @todo networkgraph
        }
        interface Options {
            drilldown?: any; // @todo drilldown module
            exporting?: any; // @todo exporting module
            navigation?: any; // @todo exporting module
        }
        interface PlotSeriesOptions {
            accessibility?: any; // @todo
        }
        interface Point {
            startR?: any; // @todo solid-gauge
            tooltipDateKeys?: any; // @todo xrange
        }
        interface Series {
            fillGraph?: any; // @todo ichimoku indicator
            gappedPath?: any; // @todo broken axis module
            invertable?: any; // @todo sankey
            isSeriesBoosting?: any; // @todo boost module
            labelBySeries?: any; // @todo series label module
            layout?: any; // @todo networkgraph
            resetZones?: any; // @todo macd indicator
            useCommonDataGrouping?: any; // @todo indicators
            getPoint: Function; // @todo boost module
        }
        interface Tick {
            slotWidth?: any; // @todo
        }
        const SVG_NS: string;
        const charts: Array<Chart|undefined>;
        const dateFormats: Dictionary<TimeFormatCallbackFunction>;
        const deg2rad: number;
        const doc: Document;
        const hasBidiBug: boolean;
        const hasTouch: boolean;
        const isChrome: boolean;
        const isFirefox: boolean;
        const isMS: boolean;
        const isSafari: boolean;
        const isTouchDevice: boolean;
        const isWebKit: boolean;
        const marginNames: Array<string>;
        const noop: Function;
        const symbolSizes: Dictionary<SizeObject>;
        const win: Window;
        const seriesTypes: Dictionary<typeof Series>;
        const svg: boolean;
    }
    type GlobalHighcharts = typeof Highcharts;
    type GlobalHTMLElement = HTMLElement;
    type GlobalSVGElement = SVGElement;
    interface Document {
        msHidden: boolean;
        webkitHidden: boolean;
    }
    interface Window {
        Image: typeof Image;
        opera?: any;
        TouchEvent?: typeof TouchEvent;
    }
    const win: Window; // @todo: UMD variable
    function parseFloat (value: (number|string)): number;
}

/* globals Image, window */

/**
 * Reference to the global SVGElement class as a workaround for a name conflict
 * in the Highcharts namespace.
 *
 * @global
 * @typedef {global.SVGElement} GlobalSVGElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */

// glob is a temporary fix to allow our es-modules to work.
var glob = typeof win === 'undefined' ?
        (typeof window !== 'undefined' ? window : {} as Window) :
        win,
    doc = glob.document,
    SVG_NS = 'http://www.w3.org/2000/svg',
    userAgent = (glob.navigator && glob.navigator.userAgent) || '',
    svg = (
        doc &&
        doc.createElementNS &&
        !!(doc.createElementNS(SVG_NS, 'svg') as SVGSVGElement).createSVGRect
    ),
    isMS = /(edge|msie|trident)/i.test(userAgent) && !(glob as any).opera,
    isFirefox = userAgent.indexOf('Firefox') !== -1,
    isChrome = userAgent.indexOf('Chrome') !== -1,
    hasBidiBug = (
        isFirefox &&
        parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
    );

var H: GlobalHighcharts = {
    product: 'Highcharts',
    version: '@product.version@',
    deg2rad: Math.PI * 2 / 360,
    doc: doc,
    hasBidiBug: hasBidiBug,
    hasTouch: !!win.TouchEvent,
    isMS: isMS,
    isWebKit: userAgent.indexOf('AppleWebKit') !== -1,
    isFirefox: isFirefox,
    isChrome: isChrome,
    isSafari: !isChrome && userAgent.indexOf('Safari') !== -1,
    isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
    SVG_NS: SVG_NS,
    chartCount: 0,
    seriesTypes: {},
    symbolSizes: {},
    svg: svg,
    win: glob,
    marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
    noop: function (): void {},
    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     *
     * @name Highcharts.charts
     * @type {Array<Highcharts.Chart|undefined>}
     */
    charts: [],

    /**
     * A hook for defining additional date format specifiers. New
     * specifiers are defined as key-value pairs by using the
     * specifier as key, and a function which takes the timestamp as
     * value. This function returns the formatted portion of the
     * date.
     *
     * @sample highcharts/global/dateformats/
     *         Adding support for week number
     *
     * @name Highcharts.dateFormats
     * @type {Highcharts.Dictionary<Highcharts.TimeFormatCallbackFunction>}
     */
    dateFormats: {}
} as any;

export default H;
