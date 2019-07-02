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
    namespace Highcharts {
        type LabelFormatterCallbackFunction = any; // @todo
        type OptionsOverflowValue = ('allow'|'justify');
        type OptionsPosition3dValue = ('chart'|'flap'|'offset'|'ortho');
        type PatternObject = object; // @todo
        type XAxisScrollbarOptions = any; // @todo
        type YAxisStackLabelsOptions = any; // @todo
        interface Axis {
            extKey?: any; // @todo
            id?: any; // @todo
            labelLeft?: any; // @todo
            labelRight?: any; // @todo
            sector?: any; // @todo
            beforePadding: Function; // @todo
            getMaxLabelDimensions: Function; // @todo
            toFixedRange: Function; // @todo
        }
        interface AxisLabelsFormatterContextObject {
            tickPositionInfo?: any; // @todo
        }
        interface Chart {
            fixedRange?: any; // @todo
            hoverPoint?: any; // @todo
            hoverPoints?: any; // @todo
            hoverSeries?: any; // @todo
            inverted?: any; // @todo
            isBoosting?: any; // @todo
            isPrinting?: any; // @todo
            mapCredits?: any; // @todo
            marginBottom?: any; // @todo
            marginRight?: any; // @todo
            navigator?: Navigator; // @todo
            openMenu?: any; // @todo
            polar?: any; // @todo
            rangeSelector?: any; // @todo
            redrawTrigger?: any; // @todo
            runTrackerClick?: any; // @todo
            scrollablePixelsX?: any; // @todo
            scrollablePixelsY?: any; // @todo
            tooltip?: any; // @todo
        }
        interface ChartOptions {
            forExport?: any; // @todo
            reflow?: any; // @todo
            renderer?: any; // @todo
            skipClone?: any; // @todo
        }
        interface ColorAxis {
            legendItem?: any; // @todo
        }
        interface Options {
            exporting?: any; // @todo
            isStock?: boolean; // @todo
            navigation?: any; // @todo
        }
        interface PlotSeriesOptions {
            accessibility?: any; // @todo
            center?: any; // @todo
            colorByPoint?: any; // @todo
            inactiveOtherPoints?: any; // @todo
            innerSize?: any; // @todo
            lineColor?: any; // @todo
            minSize?: any; // @todo
            negativeFillColor?: any; // @todo
            size?: any; // @todo
            startFromThreshold?: any; // @todo
            tooltip?: any; // @todo
            trackByArea?: any; // @todo
        }
        interface Point {
            allowShadow?: unknown; // @todo
            below?: any; // @todo
            dataLabelOnNull?: any; // @todo
            dist?: any; // @todo
            distX?: any; // @todo
            dlBox?: any; // @todo
            dlOptions?: any; // @todo
            graphic?: any; // @todo
            group?: any; // @todo
            half?: any; // @todo
            isCliff?: any; // @todo
            labelDistance?: any; // @todo
            name?: any; // @todo
            plotHigh?: any; // @todo
            plotLow?: any; // @todo
            selected?: any; // @todo
            startR?: any; // @todo
            tooltipDateKeys?: any; // @todo
            tooltipPos?: any; // @todo
            ttBelow?: any; // @todo
            zone?: any; // @todo
            getDataLabelPath: Function; // @todo
        }
        interface PointOptionsObject {
            states?: any; // @todo
        }
        interface Series {
            allowDG?: any; // @todo
            areaPath?: any; // @todo
            barW?: any; // @todo
            center?: any; // @todo
            clipBox?: any; // @todo
            colorKey?: any; // @todo
            fillColor?: any; // @todo
            fillGraph?: any; // @todo
            fixedBox?: any; // @todo
            forceDL?: any; // @todo
            gappedPath?: any; // @todo
            group?: any; // @todo
            hasDerivedData?: any; // @todo
            invertable?: any; // @todo
            isSeriesBoosting?: any; // @todo
            labelBySeries?: any; // @todo
            maxLabelDistance?: any; // @todo
            modifyValue?: any; // @todo
            pointArrayMap?: any; // @todo
            pointAttrToOptions?: any; // @todo
            pointXOffset?: any; // @todo
            radii?: any; // @todo
            resetZones?: any; // @todo
            showLine?: any; // @todo
            specialGroup?: any; // @todo
            symbol?: any; // @todo
            takeOrdinalPosition?: any; // @todo
            translatedThreshold?: any; // @todo
            useCommonDataGrouping?: any; // @todo
            valueMax?: any; // @todo
            valueMin?: any; // @todo
            getPoint: Function; // @todo
            toYData: Function; // @todo
        }
        interface SeriesOptions {
            endAngle?: any; // @todo
            startAngle?: any; // @todo
        }
        interface SeriesStatesHoverOptions {
            opacity?: any; // @todo
        }
        interface SVGRenderer {
            invertChild: Function; // @todo
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
