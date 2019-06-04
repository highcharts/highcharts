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
        type PlotLineOrBand = any; // @todo
        type PlotSeriesZonesOptions = any; // @todo
        type PointLabelObject = any; // @todo
        type SeriesOptions = any; // @todo
        type SeriesOptionsType = any; // @todo
        type SeriesPlotBoxObject = any; // @todo
        type StackItemObject = any; // @todo
        type Tick = any; // @todo
        type Tooltip = any; // @todo
        type TooltipFormatterCallbackFunction = any; // @todo
        type TooltipPositionerCallbackFunction = any; // @todo
        type TooltipShapeValue = any; // @todo
        type XAxisPlotBandsOptions = any; // @todo
        type XAxisPlotLinesOptions = any; // @todo
        type XAxisScrollbarOptions = any; // @todo
        type YAxisStackLabelsOptions = any; // @todo
        interface Axis {
            extKey?: any; // @todo
            id?: any; // @todo
            oldStacks?: any; // @todo
            ordinalPositions?: any; // @todo
            sector?: any; // @todo
            stacks?: any; // @todo
            usePercentage?: any; // @todo
            addPlotBandOrLine: Function; // @todo
            beforePadding: Function; // @todo
            beforeSetTickPositions: Function; // @todo
            buildStacks: Function; // @todo
            cleanStacks: Function; // @todo
            getLogTickPositions: Function; // @todo
            getMaxLabelDimensions: Function; // @todo
            getTimeTicks: Function; // @todo
            normalizeTimeTickInterval: Function; // @todo
            postProcessTickInterval: Function; // @todo
            renderStackTotals: Function; // @todo
            resetStacks: Function; // @todo
        }
        interface Chart {
            hoverPoint?: any; // @todo
            hoverPoints?: any; // @todo
            hoverSeries?: any; // @todo
            inverted?: any; // @todo
            isPrinting?: any; // @todo
            mapCredits?: any; // @todo
            marginBottom?: any; // @todo
            marginRight?: any; // @todo
            openMenu?: any; // @todo
            polar?: any; // @todo
            runTrackerClick?: any; // @todo
            scroller?: any; // @todo
            tooltip?: any; // @todo
            getStacks: Function; // @todo
            isReadyToRender: Function; // @todo
            pan: Function; // @todo
            setResponsive: Function; // @todo
            zoom: Function; // @todo
        }
        interface ChartOptions {
            forExport?: any; // @todo
            reflow?: any; // @todo
            renderer?: any; // @todo
            skipClone?: any; // @todo
        }
        interface Options {
            exporting?: any; // @todo
            isResponsiveOptions?: boolean; // @todo
            isStock?: boolean; // @todo
            xAxis?: (Array<Dictionary<any>>|Dictionary<any>); // @todo
            yAxis?: (Array<Dictionary<any>>|Dictionary<any>); // @todo
        }
        interface Legend {
            createCheckboxForItem: Function; // @todo
            setItemEvents: Function; // @todo
        }
        interface Point {
            dist?: any; // @todo
            distX?: any; // @todo
            graphic?: any; // @todo
            group?: any; // @todo
            negative?: any; // @todo
            selected?: any; // @todo
            zone?: any; // @todo
            onMouseOut: Function; // @todo
            setState: Function; // @todo
        }
        interface Series {
            _hasPointLabels?: any; // @todo
            _hasPointMarkers?: any; // @todo
            autoIncrement?: any; // @todo
            center?: any; // @todo
            chart?: any; // @todo
            closestPointRange?: number; // @todo
            color?: any; // @todo
            colorCounter?: any; // @todo
            colorIndex?: any; // @todo
            data?: any; // @todo
            dataMax?: any; // @todo
            dataMin?: any; // @todo
            dataLabelsGroup?: any; // @todo
            directTouch?: any; // @todo
            finishedAnimating?: any; // @todo
            fixedBox?: any; // @todo
            forceDL?: any; // @todo
            group?: any; // @todo
            hasCartesianSeries?: any; // @todo
            hasDerivedData?: any; // @todo
            hasGroupedData?: any; // @todo
            hasRendered?: any; // @todo
            id?: any; // @todo
            index?: any; // @todo
            initialType?: any; // @todo
            isCartesian?: any; // @todo
            isDirty?: any; // @todo
            isDirtyData?: any; // @todo
            kdTree?: any; // @todo
            linkedParent?: any; // @todo
            linkedSeries?: any; // @todo
            markerGroup?: any; // @todo
            maxLabelDistance?: any; // @todo
            name?: any; // @todo
            navigatorSeries?: any; // @todo
            noSharedTooltip?: any; // @todo
            options?: any; // @todo
            parallelArrays?: any; // @todo
            pointArrayMap?: any; // @todo
            points?: any; // @todo
            pointValKey?: any; // @todo
            redraw?: any; // @todo
            requireSorting?: any; // @todo
            selected?: any; // @todo
            stickyTracking?: any; // @todo
            symbol?: any; // @todo
            tooltipOptions?: any; // @todo
            translatedThreshold?: any; // @todo
            type?: any; // @todo
            updateTotals?: any; // @todo
            userOptions?: any; // @todo
            visible?: any; // @todo
            xAxis?: any; // @todo
            xData?: any; // @todo
            xIncrement?: any; // @todo
            yAxis?: any; // @todo
            zoneAxis?: any; // @todo
            zones?: any; // @todo
            destroy: Function; // @todo
            generatePoints: Function; // @todo
            getExtremes: Function; // @todo
            getXExtremes: Function; // @todo
            getName: Function; // @todo
            getPlotBox: Function; // @todo
            getPoint: Function; // @todo
            getX: Function; // @todo
            hasData: Function; // @todo
            init: Function; // @todo
            plotGroup: Function; // @todo
            pointAttribs: Function; // @todo
            pointClass: Function; // @todo
            processData: Function; // @todo
            render: Function; // @todo
            searchPoint: Function; // @todo
            setData: Function; // @todo
            setState: Function; // @todo
            sortByAngle: Function; // @todo
            translate: Function; // @todo
            updateParallelArrays: Function; // @todo
        }
        interface SVGRenderer {
            invertChild: Function; // @todo
        }
        const PlotLineOrBand: any; // @todo
        const Series: any; // @todo
        const Tick: any; // @todo
        const Tooltip: any; // @todo
        const SVG_NS: string;
        const addEventListenerPolyfill: any; // @todo
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
        const removeEventListenerPolyfill: any; // @todo
        const symbolSizes: Dictionary<SizeObject>;
        const win: Window;
        const seriesTypes: Dictionary<typeof Series>;
        const svg: boolean;
        function distribute(...args: Array<any>): any; // @todo
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
