/* *
 *
 *  (c) 2010-2018 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */

/* eslint-disable */

/**
 * The Highcharts object is the placeholder for all other members, and various
 * utility functions. The most important member of the namespace would be the
 * chart constructor.
 *
 * @example
 * var chart = Highcharts.chart('container', { ... });
 */

/* *
 *
 *  Types
 *
 * */

/**
 * Reference to the global SVGElement class as a workaround for a name conflict
 * in the Highcharts namespace.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/SVGElement
 */
export type GlobalSVGElement = SVGElement;

/* *
 *
 *  Interfaces
 *
 * */

/**
 * Generic dictionary in TypeScript notation.
 */
export interface Dictionary<T> {
    [key: string]: any;
}

/* *
 *
 *  Properties
 *
 * */

/** @ignore */
export const product = '@product.name@';
/** @ignore */
export const SVG_NS = 'http://www.w3.org/2000/svg';
/** @ignore */
export const version = '@product.version@';

/** @ignore */
export var win = (typeof win === 'undefined' ? window : win) as Window;
/** @ignore */
export const doc = win.document;

/** @ignore */
const deg2rad = (Math.PI * 2 / 360);
/** @ignore */
const svg = (
    doc &&
    doc.createElementNS &&
    !!doc.createElementNS(SVG_NS, 'svg').createSVGRect
);

/** @ignore */
export const userAgent = ((win.navigator && win.navigator.userAgent) || '');
/** @ignore */
export const isChrome = userAgent.indexOf('Chrome') !== -1;
/** @ignore */
export const isFirefox = userAgent.indexOf('Firefox') !== -1;
/** @ignore */
export const isMS = (
    /(edge|msie|trident)/i.test(userAgent) && !(win as any).opera
);
/** @ignore */
export const isSafari = !isChrome && userAgent.indexOf('Safari') !== -1;
/** @ignore */
export const isTouchDevice = /(Mobile|Android|Windows Phone)/.test(userAgent);
/** @ignore */
export const isWebKit = userAgent.indexOf('AppleWebKit') !== -1;
/** @ignore */
export const hasBidiBug = (
    isFirefox &&
    parseInt(userAgent.split('Firefox/')[1], 10) < 4 // issue #38
);
/** @ignore */
export const hasTouch = (
    doc && doc.documentElement.ontouchstart !== undefined
);

/** @ignore */
export let chartCount = 0;
/**
 * An array containing the current chart objects in the page. A chart's
 * position in the array is preserved throughout the page's lifetime. When
 * a chart is destroyed, the array item becomes `undefined`.
 */
export const charts = [] as Array<any>;
/** @ignore */
const marginNames = ['plotTop', 'marginRight', 'marginBottom', 'plotLeft'];
/** @ignore */
const seriesTypes = {} as Dictionary<any>;
/** @ignore */
const symbolSizes = {} as Dictionary<any>;

/* *
 *
 *  Functions
 *
 * */

/** @ignore */
function noop () {
    return undefined;
};

/**
 * The Highcharts object is the placeholder for all other members, and various
 * utility functions. The most important member of the namespace would be the
 * chart constructor.
 *
 * @example
 * var chart = Highcharts.chart('container', { ... });
 */
let Highcharts = {
    /** @ignore */
    chartCount,
    charts,
    /** @ignore */
    deg2rad,
    /** @ignore */
    doc,
    /** @ignore */
    hasBidiBug,
    /** @ignore */
    hasTouch,
    /** @ignore */
    isChrome,
    /** @ignore */
    isFirefox,
    /** @ignore */
    isMS,
    /** @ignore */
    isSafari,
    /** @ignore */
    isTouchDevice,
    /** @ignore */
    isWebKit,
    /** @ignore */
    marginNames,
    /** @ignore */
    noop,
    /** @ignore */
    product,
    /** @ignore */
    seriesTypes,
    /** @ignore */
    svg,
    /** @ignore */
    symbolSizes,
    /** @ignore */
    version,
    /** @ignore */
    win
};

/** @ignore */
const GlobalHighcharts = ((win as any).Highcharts ?
    (win as any).Highcharts.error(16, true) :
    Highcharts
);

declare global {
    let Highcharts: typeof GlobalHighcharts ;
}

export default Highcharts;
