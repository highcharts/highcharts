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
    /**
     * [[include:README.md]]
     */
    namespace Highcharts {
        interface Annotation { // @todo annotations
            [key: string]: any; // @todo annotations
        }
        interface AnnotationOptions { // @todo annotations
            [key: string]: any; // @todo annotations
        }
        interface Axis {
            rightWall?: any; // @todo
            beforePadding?: Function; // @todo
        }
        interface XAxisOptions {
            stackLabels?: any; // @todo
        }
        interface Chart {
            frame3d?: any; // @todo highcharts 3d
            frameShapes?: any; // @todo highcharts 3d
            isBoosting?: any; // @todo boost module
            hideOverlappingLabels: Function; // @todo overlapping module
            navigationBindings?: any; // @todo annotations
        }
        interface ChartOptions {
            forExport?: any; // @todo
        }
        interface NavigationBindings { // @todo annotations
            [key: string]: any; // @todo annotations
        }
        interface Options {
            toolbar?: any; // @todo stock-tools
        }
        interface Point {
            startR?: any; // @todo solid-gauge
            tooltipDateKeys?: any; // @todo xrange
        }
        interface Series {
            fillGraph?: any; // @todo ichimoku indicator
            gappedPath?: any; // @todo broken axis module
            isSeriesBoosting?: any; // @todo boost module
            resetZones?: any; // @todo macd indicator
            useCommonDataGrouping?: any; // @todo indicators
            getPoint: Function; // @todo boost module
        }
        interface SeriesTypesDictionary {
            [key: string]: typeof Series;
        }
        interface StockToolsFieldsObject { // @todo annotations
            [key: string]: any; // @todo annotations
        }
        interface Tick {
            slotWidth?: any; // @todo
        }
        const Annotation: any; // @todo annotations
        const AnnotationOptions: any; // @todo annotations
        const NavigationBindings: any; // @todo annotations
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
        const product: string;
        const symbolSizes: Dictionary<SizeObject>;
        const win: GlobalWindow;
        const seriesTypes: SeriesTypesDictionary;
        const svg: boolean;
        const version: string;
        let theme: (Options|undefined);
    }
    type GlobalWindow = typeof window;
    type GlobalHTMLElement = HTMLElement;
    type GlobalSVGElement = SVGElement;
    interface CallableFunction {
        apply<TScope, TArguments extends any[], TReturn>(
            this: (this: TScope, ...args: TArguments) => TReturn,
            thisArg: TScope,
            args?: (TArguments|IArguments)
        ): TReturn;
    }
    interface Document {
        msHidden: boolean;
        webkitHidden: boolean;
    }
    interface Element {
        mozRequestFullScreen: Function;
        msRequestFullscreen: Function;
        webkitRequestFullscreen: Function;
        setAttribute(
            qualifiedName: string,
            value: (boolean|number|string)
        ): void;
    }
    interface OscillatorNode extends AudioNode {
    }
    interface PointerEvent {
        /** @deprecated */
        readonly toElement: Element;
    }
    interface Window {
        TouchEvent?: typeof TouchEvent;
        /** @deprecated */
        createObjectURL?: (typeof URL)['createObjectURL'];
        /** @deprecated */
        opera?: unknown;
        /** @deprecated */
        webkitAudioContext?: typeof AudioContext;
        /** @deprecated */
        webkitURL?: typeof URL;
    }
    const win: GlobalWindow|undefined; // @todo: UMD variable named `window`
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
var glob = ( // @todo UMD variable named `window`, and glob named `win`
        typeof win !== 'undefined' ?
            win :
            typeof window !== 'undefined' ?
                window :
                {} as GlobalWindow
    ),
    doc = glob.document,
    SVG_NS = 'http://www.w3.org/2000/svg',
    userAgent = (glob.navigator && glob.navigator.userAgent) || '',
    svg = (
        doc &&
        doc.createElementNS &&
        !!(doc.createElementNS(SVG_NS, 'svg') as SVGSVGElement).createSVGRect
    ),
    isMS = /(edge|msie|trident)/i.test(userAgent) && !glob.opera,
    isFirefox = userAgent.indexOf('Firefox') !== -1,
    isChrome = userAgent.indexOf('Chrome') !== -1,
    hasBidiBug = (
        isFirefox &&
        parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
    );

var H: typeof Highcharts = {
    product: 'Highcharts',
    version: '@product.version@',
    deg2rad: Math.PI * 2 / 360,
    doc: doc,
    hasBidiBug: hasBidiBug,
    hasTouch: !!glob.TouchEvent,
    isMS: isMS,
    isWebKit: userAgent.indexOf('AppleWebKit') !== -1,
    isFirefox: isFirefox,
    isChrome: isChrome,
    isSafari: !isChrome && userAgent.indexOf('Safari') !== -1,
    isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
    SVG_NS: SVG_NS,
    chartCount: 0,
    seriesTypes: {} as Highcharts.SeriesTypesDictionary,
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
} as unknown as typeof Highcharts;

export default H;
