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

/* *
 *
 *  Imports
 *
 * */

import type Chart from './Chart/Chart';
import type { SeriesTypeRegistry } from './Series/SeriesType';
import type SizeObject from './Renderer/SizeObject';

/* *
 *
 *  Declarations
 *
 * */

declare global {
    type GlobalSVGElement = SVGElement;
    interface CallableFunction {
        apply<TScope, TArguments extends any[], TReturn>(
            this: (this: TScope, ...args: TArguments) => TReturn,
            thisArg: TScope,
            args?: (TArguments|IArguments)
        ): TReturn;
    }
    interface Element {
        setAttribute(
            qualifiedName: string,
            value: (boolean|number|string)
        ): void;
    }
    interface ObjectConstructor {
        /**
         * Sets the prototype of a specified object o to object proto or null.
         * Returns the object o.
         * @param o The object to change its prototype.
         * @param proto The value of the new prototype or null.
         */
        setPrototypeOf?(o: any, proto: object | null): any;
    }
}

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

declare interface HighchartsObjectConstructor extends ObjectConstructor {
    keys<T extends object>(obj: T): keyof T;
}

/* *
 *
 *  Constants
 *
 * */

/**
 * @private
 * @deprecated
 * @todo Rename UMD argument `win` to `window`; move code to `Globals.win`
 */
const WINDOW = (
    typeof win !== 'undefined' ?
        win :
        typeof window !== 'undefined' ?
            window :
            {}
// eslint-disable-next-line node/no-unsupported-features/es-builtins
) as (Window&typeof globalThis);

/* *
 *
 *  Namespace
 *
 * */

/**
 * Shared Highcharts properties.
 */
namespace Globals {

    /* *
     *
     *  Aliases
     *
     * */

    export const Obj = Object as unknown as HighchartsObjectConstructor;

    export const SVG_NS = 'http://www.w3.org/2000/svg';

    /* *
     *
     *  Constants
     *
     * */

    export const
        product = 'Highcharts',
        version = '@product.version@',
        win = WINDOW,
        doc = win.document,
        nav = win.navigator,
        svg = (
            doc &&
            doc.createElementNS &&
            !!(doc.createElementNS(SVG_NS, 'svg') as SVGSVGElement).createSVGRect
        ),
        userAgent = (nav && nav.userAgent) || '',
        isChrome = userAgent.indexOf('Chrome') !== -1,
        isFirefox = userAgent.indexOf('Firefox') !== -1,
        isMS = /(edge|msie|trident)/i.test(userAgent) && !win.opera,
        isSafari = !isChrome && userAgent.indexOf('Safari') !== -1,
        isTouchDevice = /(Mobile|Android|Windows Phone)/.test(userAgent),
        isWebKit = userAgent.indexOf('AppleWebKit') !== -1,
        deg2rad = Math.PI * 2 / 360,
        hasBidiBug = (
            isFirefox &&
            parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
        ),
        hasTouch = !!win.TouchEvent,
        marginNames: ReadonlyArray<string> = [
            'plotTop',
            'marginRight',
            'marginBottom',
            'plotLeft'
        ],
        noop = function (): void {},
        supportsPassiveEvents = (function (): boolean {
            // Checks whether the browser supports passive events, (#11353).
            let supportsPassive = false;

            // Object.defineProperty doesn't work on IE as well as passive
            // events - instead of using polyfill, we can exclude IE totally.
            if (!isMS) {
                const opts = Object.defineProperty({}, 'passive', {
                    get: function (): void {
                        supportsPassive = true;
                    }
                });

                if (win.addEventListener && win.removeEventListener) {
                    win.addEventListener('testPassive', noop, opts);
                    win.removeEventListener('testPassive', noop, opts);
                }
            }

            return supportsPassive;
        }());

    /**
     * An array containing the current chart objects in the page. A chart's
     * position in the array is preserved throughout the page's lifetime. When
     * a chart is destroyed, the array item becomes `undefined`.
     *
     * @name Highcharts.charts
     * @type {Array<Highcharts.Chart|undefined>}
     */
    export const charts: Array<(Chart|undefined)> = [];

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
     * @type {Record<string, Highcharts.TimeFormatCallbackFunction>}
     */
    export const dateFormats: Record<string, Highcharts.TimeFormatCallbackFunction> = {};

    /**
     * @private
     * @deprecated
     * @todo Use only `Core/Series/SeriesRegistry.seriesTypes`
     */
    export const seriesTypes = {} as SeriesTypeRegistry;

    /**
     * @private
     */
    export const symbolSizes: Record<string, SizeObject> = {};

    /* *
     *
     *  Properties
     *
     * */

    export let chartCount: 0;

    /**
     * Theme options that should get applied to the chart. In module mode it
     * might not be possible to change this property because of read-only
     * restrictions, instead use {@link Highcharts.setOptions}.
     *
     * @name Highcharts.theme
     * @type {Highcharts.Options}
     */
    export let theme: (Highcharts.Options|undefined);

}

export default Globals as unknown as (typeof Globals&typeof Highcharts);

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Reference to the global SVGElement class as a workaround for a name conflict
 * in the Highcharts namespace.
 *
 * @global
 * @typedef {global.SVGElement} GlobalSVGElement
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */

''; // detach doclets above

/* *
 *
 *  Deprecated API
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    /**
     * @private
     * @deprecated
     * @todo: Rename UMD argument `win` to `window`
     */
    const win: Window|undefined;
    /**
     * [[include:README.md]]
     * @deprecated
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
    }
    interface Document {
        /** @deprecated */
        exitFullscreen: () => Promise<void>;
        /** @deprecated */
        mozCancelFullScreen: Function;
        /** @deprecated */
        msExitFullscreen: Function;
        /** @deprecated */
        msHidden: boolean;
        /** @deprecated */
        webkitExitFullscreen: Function;
        /** @deprecated */
        webkitHidden: boolean;
    }
    interface Element {
        /** @deprecated */
        currentStyle?: ElementCSSInlineStyle;
        /** @deprecated */
        mozRequestFullScreen: Function;
        /** @deprecated */
        msMatchesSelector: Element['matches'];
        /** @deprecated */
        msRequestFullscreen: Function;
        /** @deprecated */
        webkitMatchesSelector: Element['matches'];
        /** @deprecated */
        webkitRequestFullScreen: Function;
    }
    interface PointerEvent {
        /** @deprecated */
        readonly toElement: Element;
    }
    interface Window {
        /** @deprecated */
        createObjectURL?: (typeof URL)['createObjectURL'];
        /** @deprecated */
        opera?: unknown;
        /** @deprecated */
        webkitAudioContext?: typeof AudioContext;
        /** @deprecated */
        webkitURL?: typeof URL;
    }
}
