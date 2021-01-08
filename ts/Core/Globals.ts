/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from './Chart/Chart';
import type { SeriesTypeRegistry } from './Series/SeriesType';
import type SizeObject from './Renderer/SizeObject';

declare module './Chart/ChartLike' {
    interface ChartLike {
        frameShapes?: any; // @todo highcharts 3d
        isBoosting?: any; // @todo boost module
    }
}

declare module './Series/PointLike' {
    interface PointLike {
        startR?: any; // @todo solid-gauge
        tooltipDateKeys?: any; // @todo xrange
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    /**
     * [[include:README.md]]
     */
    namespace Highcharts {
        interface Axis {
            rightWall?: any; // @todo
            beforePadding?: Function; // @todo
        }
        interface XAxisOptions {
            stackLabels?: any; // @todo
        }
        interface ChartOptions {
            forExport?: any; // @todo
        }
        interface Options {
            toolbar?: any; // @todo stock-tools
        }
        const SVG_NS: string;
        const charts: Array<Chart|undefined>;
        const dateFormats: Record<string, TimeFormatCallbackFunction>;
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
        const noop: () => void;
        const product: string;
        const supportsPassiveEvents: boolean;
        const symbolSizes: Record<string, SizeObject>;
        const win: GlobalWindow;
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
        /** @deprecated */
        exitFullscreen: () => Promise<void>;
        /** @deprecated */
        mozCancelFullScreen: Function;
        /** @deprecated */
        msExitFullscreen: Function;
        msHidden: boolean;
        /** @deprecated */
        webkitExitFullscreen: Function;
        webkitHidden: boolean;
    }
    interface Element {
        /** @deprecated */
        currentStyle?: ElementCSSInlineStyle;
        /** @deprecated */
        mozRequestFullScreen: Function;
        msMatchesSelector: Element['matches'];
        /** @deprecated */
        msRequestFullscreen: Function;
        webkitMatchesSelector: Element['matches'];
        /** @deprecated */
        webkitRequestFullScreen: Function;
        setAttribute(
            qualifiedName: string,
            value: (boolean|number|string)
        ): void;
    }/*
    interface Highcharts {
        /**
         * @deprecated
         * /
        [key: string]: any;
    }*/
    interface ObjectConstructor {
        /**
         * Sets the prototype of a specified object o to object proto or null.
         * Returns the object o.
         * @param o The object to change its prototype.
         * @param proto The value of the new prototype or null.
         */
        setPrototypeOf?(o: any, proto: object | null): any;
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
    ),
    noop = function (): void {},
    // Checks whether the browser supports passive events, (#11353).
    checkPassiveEvents = function (): boolean {
        let supportsPassive = false;

        // Object.defineProperty doesn't work on IE as well as passive events -
        // instead of using polyfill, we can exclude IE totally.
        if (!isMS) {
            const opts = Object.defineProperty({}, 'passive', {
                get: function (): void {
                    supportsPassive = true;
                }
            });

            if (glob.addEventListener && glob.removeEventListener) {
                glob.addEventListener('testPassive', noop, opts);
                glob.removeEventListener('testPassive', noop, opts);
            }
        }

        return supportsPassive;
    };

var H: typeof Highcharts = {
    product: 'Highcharts',
    version: '@product.version@',
    deg2rad: Math.PI * 2 / 360,
    doc,
    hasBidiBug: hasBidiBug,
    hasTouch: !!glob.TouchEvent,
    isMS,
    isWebKit: userAgent.indexOf('AppleWebKit') !== -1,
    isFirefox,
    isChrome,
    isSafari: !isChrome && userAgent.indexOf('Safari') !== -1,
    isTouchDevice: /(Mobile|Android|Windows Phone)/.test(userAgent),
    SVG_NS,
    chartCount: 0,
    seriesTypes: {} as SeriesTypeRegistry,
    supportsPassiveEvents: checkPassiveEvents(),
    symbolSizes: {},
    svg,
    win: glob,
    marginNames: ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'],
    noop,

    /**
     * Theme options that should get applied to the chart. In module mode it
     * might not be possible to change this property because of read-only
     * restrictions, instead use {@link Highcharts.setOptions}.
     *
     * @name Highcharts.theme
     * @type {Highcharts.Options}
     */

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
