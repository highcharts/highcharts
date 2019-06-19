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
    }
    const win: Window; // @todo: UMD variable
    function parseFloat (value: (number|string)): number;
    namespace Highcharts {
        type LabelFormatterCallbackFunction = any; // @todo
        type OptionsOverflowValue = ('allow'|'justify');
        type OptionsPosition3dValue = ('chart'|'flap'|'offset'|'ortho');
        type PatternObject = any; // @todo
        type PlotSeriesOptions = any; // @todo
        type PlotSeriesZonesOptions = any; // @todo
        type SeriesOptions = any; // @todo
        type SeriesOptionsType = any; // @todo
        type SeriesPlotBoxObject = any; // @todo
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
        interface Point {
            dist?: any; // @todo
            distX?: any; // @todo
            graphic?: any; // @todo
            group?: any; // @todo
            negative?: any; // @todo
            selected?: any; // @todo
            tooltipDateKeys?: any; // @todo
            zone?: any; // @todo
        }
        interface PointOptionsObject {
            events?: PointEventsOptionsObject; // @todo
        }
        interface Series {
            _hasPointLabels?: any; // @todo
            _hasPointMarkers?: any; // @todo
            allowDG?: any; // @todo
            areaPath?: any; // @todo
            autoIncrement?: any; // @todo
            center?: any; // @todo
            chart: Chart; // @todo
            closestPointRange?: number; // @todo
            color?: any; // @todo
            colorCounter?: any; // @todo
            colorIndex?: any; // @todo
            colorKey?: any; // @todo
            currentDataGrouping?: any; // @todo
            data?: any; // @todo
            dataMax?: any; // @todo
            dataMin?: any; // @todo
            dataLabelsGroup?: any; // @todo
            directTouch?: any; // @todo
            finishedAnimating?: any; // @todo
            fixedBox?: any; // @todo
            forceCrop?: any; // @todo
            forceDL?: any; // @todo
            graph?: any; // @todo
            graphPath?: any; // @todo
            group?: any; // @todo
            groupPixelWidth?: any; // @todo
            hasCartesianSeries?: any; // @todo
            hasDerivedData?: any; // @todo
            hasGroupedData?: any; // @todo
            hasProcessed?: any; // @todo
            hasRendered?: any; // @todo
            id?: any; // @todo
            index?: any; // @todo
            initialType?: any; // @todo
            isCartesian?: any; // @todo
            isDirty?: any; // @todo
            isDirtyData?: any; // @todo
            isSeriesBoosting?: any; // @todo
            kdTree?: any; // @todo
            labelBySeries?: any; // @todo
            linkedParent?: any; // @todo
            linkedSeries?: any; // @todo
            marker?: any; // @todo
            markerGroup?: any; // @todo
            maxLabelDistance?: any; // @todo
            name?: any; // @todo
            noSharedTooltip?: any; // @todo
            options?: any; // @todo
            parallelArrays?: any; // @todo
            pointArrayMap?: any; // @todo
            points: Array<Point>; // @todo
            pointValKey?: any; // @todo
            processedXData?: any; // @todo
            processedYData?: any; // @todo
            redraw?: any; // @todo
            requireSorting?: any; // @todo
            selected?: any; // @todo
            stickyTracking?: any; // @todo
            symbol?: any; // @todo
            takeOrdinalPosition?: any; // @todo
            tooltipOptions?: any; // @todo
            trackerGroups?: any; // @todo
            translatedThreshold?: any; // @todo
            type?: any; // @todo
            updateTotals?: any; // @todo
            useCommonDataGrouping?: any; // @todo
            userOptions?: any; // @todo
            valueMax?: any; // @todo
            valueMin?: any; // @todo
            visible?: any; // @todo
            xAxis: Axis; // @todo
            xIncrement?: any; // @todo
            yAxis: Axis; // @todo
            zoneAxis?: any; // @todo
            zones?: any; // @todo
            cropData: Function; // @todo
            destroy: Function; // @todo
            getExtremes: Function; // @todo
            getXExtremes: Function; // @todo
            getName: Function; // @todo
            getPlotBox: Function; // @todo
            getPoint: Function; // @todo
            getX: Function; // @todo
            hasData: Function; // @todo
            init: Function; // @todo
            markerAttribs: Function; // @todo
            plotGroup: Function; // @todo
            pointAttribs: Function; // @todo
            pointClass: Function; // @todo
            processData: Function; // @todo
            render: Function; // @todo
            searchPoint: Function; // @todo
            setData: Function; // @todo
            sortByAngle: Function; // @todo
            translate: Function; // @todo
            updateParallelArrays: Function; // @todo
        }
        interface SVGRenderer {
            invertChild: Function; // @todo
        }
        interface Tick {
            slotWidth?: any; // @todo
        }
        const Series: any; // @todo
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
    product: '@product.name@',
    version: '@product.version@',
    deg2rad: Math.PI * 2 / 360,
    doc: doc,
    hasBidiBug: hasBidiBug,
    hasTouch: doc && typeof doc.documentElement.ontouchstart !== 'undefined',
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
