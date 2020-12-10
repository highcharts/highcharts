/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnimationOptions from '../Animation/AnimationOptions';
import type { AxisType } from '../Axis/Types';
import type BBoxObject from '../Renderer/BBoxObject';
import type {
    CSSObject,
    CursorValue
} from '../Renderer/CSSObject';
import type ChartLike from './ChartLike';
import type ColorAxis from '../Axis/ColorAxis';
import type LineSeries from '../../Series/Line/LineSeries';
import type Point from '../Series/Point';
import type SeriesOptions from '../Series/SeriesOptions';
import type {
    SeriesTypeOptions,
    SeriesTypePlotOptions
} from '../Series/SeriesType';
import type { HTMLDOMElement } from '../Renderer/DOMElementType';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';
import A from '../Animation/AnimationUtilities.js';
const {
    animate,
    animObject,
    setAnimation
} = A;
import Axis from '../Axis/Axis.js';
import BaseSeries from '../Series/Series.js';
import H from '../Globals.js';
const {
    charts,
    doc,
    win
} = H;
import Legend from '../Legend.js';
import MSPointer from '../MSPointer.js';
import O from '../Options.js';
const {
    defaultOptions,
    time
} = O;
import palette from '../../Core/Color/Palette.js';
import Pointer from '../Pointer.js';
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import Time from '../Time.js';
import U from '../Utilities.js';
const {
    addEvent,
    attr,
    cleanRecursively,
    createElement,
    css,
    defined,
    discardElement,
    erase,
    error,
    extend,
    find,
    fireEvent,
    getStyle,
    isArray,
    isFunction,
    isNumber,
    isObject,
    isString,
    merge,
    numberFormat,
    objectEach,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    splat,
    syncTimeout,
    uniqueKey
} = U;

declare module '../Series/SeriesLike' {
    interface SeriesLike {
        index?: number;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            extKey?: string;
            index?: number;
        }
        interface ChartOptions {
            renderer?: string;
            skipClone?: boolean;
        }
        interface CaptionObject extends SVGElement {
            update(titleOptions: CaptionOptions, redraw?: boolean): void;
        }
        interface Options {
            series?: Array<SeriesTypeOptions>;
        }
        interface SubtitleObject extends SVGElement {
            update(titleOptions: SubtitleOptions, redraw?: boolean): void;
        }
        interface TitleObject extends SVGElement {
            update(titleOptions: TitleOptions, redraw?: boolean): void;
        }
        interface XAxisOptions {
            index?: number;
        }
        function chart(
            options: Options,
            callback?: Chart.CallbackFunction
        ): Chart;
        function chart(
            renderTo: (string|HTMLDOMElement),
            options: Options,
            callback?: Chart.CallbackFunction
        ): Chart;
        let Chart: ChartClass;
    }
}
type ChartClass = typeof Chart;


var marginNames = H.marginNames;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The Chart class. The recommended constructor is {@link Highcharts#chart}.
 *
 * @example
 * var chart = Highcharts.chart('container', {
 *        title: {
 *               text: 'My chart'
 *        },
 *        series: [{
 *            data: [1, 3, 2, 4]
 *        }]
 * })
 *
 * @class
 * @name Highcharts.Chart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure.
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        Function to run when the chart has loaded and and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 */
class Chart {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(
        options: Partial<Highcharts.Options>,
        callback?: Chart.CallbackFunction
    );
    public constructor(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Highcharts.Options>,
        callback?: Chart.CallbackFunction
    );
    public constructor(
        a: (string|globalThis.HTMLElement|Partial<Highcharts.Options>),
        b?: (Chart.CallbackFunction|Highcharts.Options),
        c?: Chart.CallbackFunction
    ) {
        this.getArgs(a, b, c);
    }

    /* *
     *
     *  Properties
     *
     * */

    public _cursor?: (CursorValue|null);
    public axes: Array<AxisType> = void 0 as any;
    public axisOffset: Array<number> = void 0 as any;
    public bounds: Record<string, Record<string, number>> = void 0 as any;
    public callback?: Chart.CallbackFunction;
    public chartBackground?: SVGElement;
    public chartHeight: number = void 0 as any;
    public chartWidth: number = void 0 as any;
    public clipBox: BBoxObject = void 0 as any;
    public clipOffset?: Array<number>;
    public clipRect?: SVGElement;
    public colorCounter: number = void 0 as any;
    public container: globalThis.HTMLElement = void 0 as any;
    public containerHeight?: string;
    public containerScaling?: { scaleX: number; scaleY: number };
    public containerWidth?: string;
    public credits?: SVGElement;
    public caption?: SVGElement;
    public hasCartesianSeries?: boolean;
    public hasLoaded?: boolean;
    public hasRendered?: boolean;
    public index: number = void 0 as any;
    public isDirtyBox?: boolean;
    public isDirtyLegend?: boolean;
    public isResizing: number = void 0 as any;
    public labelCollectors: Array<Chart.LabelCollectorFunction> = void 0 as any;
    public legend: Legend = void 0 as any;
    public loadingDiv?: HTMLDOMElement;
    public loadingShown?: boolean;
    public loadingSpan?: HTMLDOMElement;
    public margin: Array<number> = void 0 as any;
    public marginBottom?: number;
    public numberFormatter: Highcharts.NumberFormatterCallbackFunction = void 0 as any;
    public oldChartHeight?: number;
    public oldChartWidth?: number;
    public options: Highcharts.Options = void 0 as any;
    public plotBackground?: SVGElement;
    public plotBGImage?: SVGElement;
    public plotBorder?: SVGElement;
    public plotBorderWidth?: number;
    public plotBox: BBoxObject = void 0 as any;
    public plotHeight: number = void 0 as any;
    public plotLeft: number = void 0 as any;
    public plotSizeX?: number;
    public plotSizeY?: number;
    public plotTop: number = void 0 as any;
    public plotWidth: number = void 0 as any;
    public pointCount: number = void 0 as any;
    public pointer: Pointer = void 0 as any;
    public reflowTimeout?: number;
    public renderer: Chart.Renderer = void 0 as any;
    public renderTo: globalThis.HTMLElement = void 0 as any;
    public series: Array<LineSeries> = void 0 as any;
    public seriesGroup?: SVGElement;
    public spacing: Array<number> = void 0 as any;
    public spacingBox: BBoxObject = void 0 as any;
    public styledMode?: boolean;
    public subtitle?: SVGElement;
    public symbolCounter: number = void 0 as any;
    public time: Time = void 0 as any;
    public title?: SVGElement;
    public titleOffset: Array<number> = void 0 as any;
    public unbindReflow?: Function;
    public userOptions: Partial<Highcharts.Options> = void 0 as any;
    public xAxis: Array<AxisType> = void 0 as any;
    public yAxis: Array<AxisType> = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Handle the arguments passed to the constructor.
     *
     * @private
     * @function Highcharts.Chart#getArgs
     *
     * @param {...Array<*>} arguments
     * All arguments for the constructor.
     *
     * @fires Highcharts.Chart#event:init
     * @fires Highcharts.Chart#event:afterInit
     */
    public getArgs(
        a: (string|globalThis.HTMLElement|Partial<Highcharts.Options>),
        b?: (Chart.CallbackFunction|Highcharts.Options),
        c?: Chart.CallbackFunction
    ): void {
        // Remove the optional first argument, renderTo, and
        // set it on this.
        if (isString(a) || (a as any).nodeName) {
            this.renderTo = a as any;
            this.init(b as any, c);
        } else {
            this.init(a as any, b as any);
        }
    }

    /**
     * Overridable function that initializes the chart. The constructor's
     * arguments are passed on directly.
     *
     * @function Highcharts.Chart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and and all external
     *        images are loaded.
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:init
     * @fires Highcharts.Chart#event:afterInit
     */
    public init(
        userOptions: Partial<Highcharts.Options>,
        callback?: Chart.CallbackFunction
    ): void {

        // Handle regular options
        var options: Highcharts.Options,
            // skip merging data points to increase performance
            seriesOptions = userOptions.series,
            userPlotOptions =
                userOptions.plotOptions || {} as SeriesTypePlotOptions;

        // Fire the event with a default function
        fireEvent(this, 'init', { args: arguments }, function (): void {

            userOptions.series = null as any;
            options = merge(defaultOptions, userOptions); // do the merge

            const optionsChart: Highcharts.ChartOptions = options.chart || {};

            // Override (by copy of user options) or clear tooltip options
            // in chart.options.plotOptions (#6218)
            objectEach(options.plotOptions, function (
                typeOptions: Record<string, any>,
                type: string
            ): void {
                if (isObject(typeOptions)) { // #8766
                    typeOptions.tooltip = (
                        userPlotOptions[type] && // override by copy:
                        merge((userPlotOptions[type] as any).tooltip)
                    ) || void 0; // or clear
                }
            });

            // User options have higher priority than default options
            // (#6218). In case of exporting: path is changed
            (options.tooltip as any).userOptions = (
                userOptions.chart &&
                userOptions.chart.forExport &&
                (userOptions.tooltip as any).userOptions
            ) || userOptions.tooltip;

            // set back the series data
            options.series = userOptions.series = seriesOptions;

            /**
             * The original options given to the constructor or a chart factory
             * like {@link Highcharts.chart} and {@link Highcharts.stockChart}.
             *
             * @name Highcharts.Chart#userOptions
             * @type {Highcharts.Options}
             */
            this.userOptions = userOptions;

            var chartEvents = optionsChart.events;

            this.margin = [];
            this.spacing = [];

            // Pixel data bounds for touch zoom
            this.bounds = { h: {}, v: {} };

            // An array of functions that returns labels that should be
            // considered for anti-collision
            this.labelCollectors = [];

            this.callback = callback;
            this.isResizing = 0;

            /**
             * The options structure for the chart after merging
             * {@link #defaultOptions} and {@link #userOptions}. It contains
             * members for the sub elements like series, legend, tooltip etc.
             *
             * @name Highcharts.Chart#options
             * @type {Highcharts.Options}
             */
            this.options = options;

            /**
             * All the axes in the chart.
             *
             * @see  Highcharts.Chart.xAxis
             * @see  Highcharts.Chart.yAxis
             *
             * @name Highcharts.Chart#axes
             * @type {Array<Highcharts.Axis>}
             */
            this.axes = [];

            /**
             * All the current series in the chart.
             *
             * @name Highcharts.Chart#series
             * @type {Array<Highcharts.Series>}
             */
            this.series = [];

            /**
             * The `Time` object associated with the chart. Since v6.0.5,
             * time settings can be applied individually for each chart. If
             * no individual settings apply, the `Time` object is shared by
             * all instances.
             *
             * @name Highcharts.Chart#time
             * @type {Highcharts.Time}
             */
            this.time =
                userOptions.time && Object.keys(userOptions.time).length ?
                    new Time(userOptions.time) :
                    H.time;

            /**
             * Callback function to override the default function that formats
             * all the numbers in the chart. Returns a string with the formatted
             * number.
             *
             * @name Highcharts.Chart#numberFormatter
             * @type {Highcharts.NumberFormatterCallbackFunction}
             */
            this.numberFormatter = optionsChart.numberFormatter || numberFormat;

            /**
             * Whether the chart is in styled mode, meaning all presentatinoal
             * attributes are avoided.
             *
             * @name Highcharts.Chart#styledMode
             * @type {boolean}
             */
            this.styledMode = optionsChart.styledMode;
            this.hasCartesianSeries = optionsChart.showAxes;

            var chart = this;

            /**
             * Index position of the chart in the {@link Highcharts#charts}
             * property.
             *
             * @name Highcharts.Chart#index
             * @type {number}
             * @readonly
             */
            chart.index = charts.length; // Add the chart to the global lookup

            charts.push(chart);
            H.chartCount++;

            // Chart event handlers
            if (chartEvents) {
                objectEach(chartEvents, function (event, eventType): void {
                    if (isFunction(event)) {
                        addEvent(chart, eventType, event);
                    }
                });
            }

            /**
             * A collection of the X axes in the chart.
             *
             * @name Highcharts.Chart#xAxis
             * @type {Array<Highcharts.Axis>}
             */
            chart.xAxis = [];

            /**
             * A collection of the Y axes in the chart.
             *
             * @name Highcharts.Chart#yAxis
             * @type {Array<Highcharts.Axis>}
             *
             * @todo
             * Make events official: Fire the event `afterInit`.
             */
            chart.yAxis = [];

            chart.pointCount = chart.colorCounter = chart.symbolCounter = 0;

            // Fire after init but before first render, before axes and series
            // have been initialized.
            fireEvent(chart, 'afterInit');

            chart.firstRender();
        });
    }

    /**
     * Internal function to unitialize an individual series.
     *
     * @private
     * @function Highcharts.Chart#initSeries
     */
    public initSeries(options: SeriesOptions): LineSeries {
        var chart = this,
            optionsChart = chart.options.chart as Highcharts.ChartOptions,
            type = (
                options.type ||
                optionsChart.type ||
                optionsChart.defaultSeriesType
            ) as string,
            series: LineSeries,
            SeriesClass = BaseSeries.seriesTypes[type];

        // No such series type
        if (!SeriesClass) {
            error(17, true, chart as any, { missingModuleFor: type });
        }

        series = new SeriesClass();
        if (typeof series.init === 'function') {
            series.init(chart, options);
        }
        return series;
    }

    /**
     * Internal function to set data for all series with enabled sorting.
     *
     * @private
     * @function Highcharts.Chart#setSeriesData
     */
    public setSeriesData(): void {
        this.getSeriesOrderByLinks().forEach(function (series): void {
            // We need to set data for series with sorting after series init
            if (!series.points && !series.data && series.enabledDataSorting) {
                series.setData(series.options.data as any, false);
            }
        });
    }

    /**
     * Sort and return chart series in order depending on the number of linked
     * series.
     *
     * @private
     * @function Highcharts.Series#getSeriesOrderByLinks
     * @return {Array<Highcharts.Series>}
     */
    public getSeriesOrderByLinks(): Array<LineSeries> {
        return this.series.concat().sort(function (a, b): number {
            if (a.linkedSeries.length || b.linkedSeries.length) {
                return b.linkedSeries.length - a.linkedSeries.length;
            }
            return 0;
        });
    }

    /**
     * Order all series above a given index. When series are added and ordered
     * by configuration, only the last series is handled (#248, #1123, #2456,
     * #6112). This function is called on series initialization and destroy.
     *
     * @private
     * @function Highcharts.Series#orderSeries
     * @param {number} [fromIndex]
     * If this is given, only the series above this index are handled.
     */
    public orderSeries(fromIndex?: number): void {
        var series = this.series,
            i = fromIndex || 0;

        for (; i < series.length; i++) {
            if (series[i]) {
                /**
                 * Contains the series' index in the `Chart.series` array.
                 *
                 * @name Highcharts.Series#index
                 * @type {number}
                 * @readonly
                 */
                series[i].index = i;
                series[i].name = series[i].getName();
            }
        }
    }

    /**
     * Check whether a given point is within the plot area.
     *
     * @function Highcharts.Chart#isInsidePlot
     *
     * @param {number} plotX
     * Pixel x relative to the plot area.
     *
     * @param {number} plotY
     * Pixel y relative to the plot area.
     *
     * @param {boolean} [inverted]
     * Whether the chart is inverted.
     *
     * @return {boolean}
     * Returns true if the given point is inside the plot area.
     */
    public isInsidePlot(
        plotX: number,
        plotY: number,
        inverted?: boolean
    ): boolean {
        var x = inverted ? plotY : plotX,
            y = inverted ? plotX : plotY,
            e = {
                x,
                y,
                isInsidePlot: x >= 0 &&
                    x <= this.plotWidth &&
                    y >= 0 &&
                    y <= this.plotHeight
            };

        fireEvent(this, 'afterIsInsidePlot', e);

        return e.isInsidePlot;
    }

    /**
     * Redraw the chart after changes have been done to the data, axis extremes
     * chart size or chart elements. All methods for updating axes, series or
     * points have a parameter for redrawing the chart. This is `true` by
     * default. But in many cases you want to do more than one operation on the
     * chart before redrawing, for example add a number of points. In those
     * cases it is a waste of resources to redraw the chart for each new point
     * added. So you add the points and call `chart.redraw()` after.
     *
     * @function Highcharts.Chart#redraw
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * If or how to apply animation to the redraw.
     *
     * @fires Highcharts.Chart#event:afterSetExtremes
     * @fires Highcharts.Chart#event:beforeRedraw
     * @fires Highcharts.Chart#event:predraw
     * @fires Highcharts.Chart#event:redraw
     * @fires Highcharts.Chart#event:render
     * @fires Highcharts.Chart#event:updatedData
     */
    public redraw(animation?: (boolean|Partial<AnimationOptions>)): void {

        fireEvent(this, 'beforeRedraw');

        var chart = this,
            axes = chart.axes,
            series = chart.series,
            pointer = chart.pointer,
            legend = chart.legend,
            legendUserOptions = chart.userOptions.legend,
            redrawLegend = chart.isDirtyLegend,
            hasStackedSeries: (boolean|undefined),
            hasDirtyStacks,
            hasCartesianSeries = chart.hasCartesianSeries,
            isDirtyBox = chart.isDirtyBox,
            i,
            serie,
            renderer = chart.renderer,
            isHiddenChart = renderer.isHidden(),
            afterRedraw = [] as Array<Function>;

        // Handle responsive rules, not only on resize (#6130)
        if (chart.setResponsive) {
            chart.setResponsive(false);
        }

        // Set the global animation. When chart.hasRendered is not true, the
        // redraw call comes from a responsive rule and animation should not
        // occur.
        setAnimation(chart.hasRendered ? animation : false, chart);

        if (isHiddenChart) {
            chart.temporaryDisplay();
        }

        // Adjust title layout (reflow multiline text)
        chart.layOutTitles();

        // link stacked series
        i = series.length;
        while (i--) {
            serie = series[i];

            if (serie.options.stacking) {
                hasStackedSeries = true;

                if (serie.isDirty) {
                    hasDirtyStacks = true;
                    break;
                }
            }
        }
        if (hasDirtyStacks) { // mark others as dirty
            i = series.length;
            while (i--) {
                serie = series[i];
                if (serie.options.stacking) {
                    serie.isDirty = true;
                }
            }
        }

        // Handle updated data in the series
        series.forEach(function (serie): void {
            if (serie.isDirty) {
                if (serie.options.legendType === 'point') {
                    if (typeof serie.updateTotals === 'function') {
                        serie.updateTotals();
                    }
                    redrawLegend = true;
                } else if (
                    legendUserOptions &&
                    (
                        legendUserOptions.labelFormatter ||
                        legendUserOptions.labelFormat
                    )
                ) {
                    redrawLegend = true; // #2165
                }
            }
            if (serie.isDirtyData) {
                fireEvent(serie, 'updatedData');
            }
        });

        // handle added or removed series
        if (redrawLegend && legend && legend.options.enabled) {
            // draw legend graphics
            legend.render();

            chart.isDirtyLegend = false;
        }

        // reset stacks
        if (hasStackedSeries) {
            chart.getStacks();
        }


        if (hasCartesianSeries) {
            // set axes scales
            axes.forEach(function (axis): void {
                axis.updateNames();
                axis.setScale();
            });
        }

        chart.getMargins(); // #3098

        if (hasCartesianSeries) {
            // If one axis is dirty, all axes must be redrawn (#792, #2169)
            axes.forEach(function (axis): void {
                if (axis.isDirty) {
                    isDirtyBox = true;
                }
            });

            // redraw axes
            axes.forEach(function (axis: Highcharts.Axis): void {

                // Fire 'afterSetExtremes' only if extremes are set
                var key = axis.min + ',' + axis.max;

                if (axis.extKey !== key) { // #821, #4452
                    axis.extKey = key;

                    // prevent a recursive call to chart.redraw() (#1119)
                    afterRedraw.push(function (): void {
                        fireEvent(
                            axis,
                            'afterSetExtremes',
                            extend(axis.eventArgs, axis.getExtremes())
                        ); // #747, #751
                        delete axis.eventArgs;
                    });
                }
                if (isDirtyBox || hasStackedSeries) {
                    axis.redraw();
                }
            });
        }

        // the plot areas size has changed
        if (isDirtyBox) {
            chart.drawChartBox();
        }

        // Fire an event before redrawing series, used by the boost module to
        // clear previous series renderings.
        fireEvent(chart, 'predraw');

        // redraw affected series
        series.forEach(function (serie): void {
            if ((isDirtyBox || serie.isDirty) && serie.visible) {
                serie.redraw();
            }
            // Set it here, otherwise we will have unlimited 'updatedData' calls
            // for a hidden series after setData(). Fixes #6012
            serie.isDirtyData = false;
        });

        // move tooltip or reset
        if (pointer) {
            pointer.reset(true);
        }

        // redraw if canvas
        renderer.draw();

        // Fire the events
        fireEvent(chart, 'redraw');
        fireEvent(chart, 'render');

        if (isHiddenChart) {
            chart.temporaryDisplay(true);
        }

        // Fire callbacks that are put on hold until after the redraw
        afterRedraw.forEach(function (callback): void {
            (callback.call as any)();
        });
    }

    /**
     * Get an axis, series or point object by `id` as given in the configuration
     * options. Returns `undefined` if no item is found.
     *
     * @sample highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @function Highcharts.Chart#get
     *
     * @param {string} id
     * The id as given in the configuration options.
     *
     * @return {Highcharts.Axis|Highcharts.Series|Highcharts.Point|undefined}
     * The retrieved item.
     */
    public get(id: string): (Axis|LineSeries|Point|undefined) {

        var ret: (Axis|LineSeries|Point|undefined),
            series = this.series,
            i;

        /**
         * @private
         * @param {Highcharts.Axis|Highcharts.Series} item
         * @return {boolean}
         */
        function itemById(item: (Axis|LineSeries)): boolean {
            return (
                (item as LineSeries).id === id ||
                (item.options && item.options.id === id)
            );
        }

        ret =
            // Search axes
            find(this.axes, itemById) ||

            // Search series
            find(this.series, itemById);

        // Search points
        for (i = 0; !ret && i < series.length; i++) {
            ret = find((series[i].points as any) || [], itemById);
        }

        return ret;
    }

    /**
     * Create the Axis instances based on the config options.
     *
     * @private
     * @function Highcharts.Chart#getAxes
     * @fires Highcharts.Chart#event:afterGetAxes
     * @fires Highcharts.Chart#event:getAxes
     */
    public getAxes(): void {
        var chart = this,
            options = this.options,
            xAxisOptions = options.xAxis = splat(options.xAxis || {}),
            yAxisOptions = options.yAxis = splat(options.yAxis || {}),
            optionsArray;

        fireEvent(this, 'getAxes');

        // make sure the options are arrays and add some members
        xAxisOptions.forEach(function (axis: any, i: number): void {
            axis.index = i;
            axis.isX = true;
        });

        yAxisOptions.forEach(function (axis: any, i: number): void {
            axis.index = i;
        });

        // concatenate all axis options into one array
        optionsArray = xAxisOptions.concat(yAxisOptions);

        optionsArray.forEach(function (
            axisOptions: Highcharts.AxisOptions
        ): void {
            new Axis(chart, axisOptions); // eslint-disable-line no-new
        });

        fireEvent(this, 'afterGetAxes');
    }

    /**
     * Returns an array of all currently selected points in the chart. Points
     * can be selected by clicking or programmatically by the
     * {@link Highcharts.Point#select}
     * function.
     *
     * @sample highcharts/plotoptions/series-allowpointselect-line/
     *         Get selected points
     *
     * @function Highcharts.Chart#getSelectedPoints
     *
     * @return {Array<Highcharts.Point>}
     *         The currently selected points.
     */
    public getSelectedPoints(): Array<Point> {
        var points = [] as Array<Point>;

        this.series.forEach(function (serie): void {
            // For one-to-one points inspect series.data in order to retrieve
            // points outside the visible range (#6445). For grouped data,
            // inspect the generated series.points.
            points = points.concat(
                serie.getPointsCollection().filter(
                    function (point: Point): boolean {
                        return pick(
                            point.selectedStaging, point.selected as any
                        );
                    }
                )
            );
        });
        return points;
    }

    /**
     * Returns an array of all currently selected series in the chart. Series
     * can be selected either programmatically by the
     * {@link Highcharts.Series#select}
     * function or by checking the checkbox next to the legend item if
     * [series.showCheckBox](https://api.highcharts.com/highcharts/plotOptions.series.showCheckbox)
     * is true.
     *
     * @sample highcharts/members/chart-getselectedseries/
     *         Get selected series
     *
     * @function Highcharts.Chart#getSelectedSeries
     *
     * @return {Array<Highcharts.Series>}
     *         The currently selected series.
     */
    public getSelectedSeries(): Array<LineSeries> {
        return this.series.filter(function (serie): (boolean|undefined) {
            return serie.selected;
        });
    }

    /**
     * Set a new title or subtitle for the chart.
     *
     * @sample highcharts/members/chart-settitle/
     *         Set title text and styles
     *
     * @function Highcharts.Chart#setTitle
     *
     * @param {Highcharts.TitleOptions} [titleOptions]
     *        New title options. The title text itself is set by the
     *        `titleOptions.text` property.
     *
     * @param {Highcharts.SubtitleOptions} [subtitleOptions]
     *        New subtitle options. The subtitle text itself is set by the
     *        `subtitleOptions.text` property.
     *
     * @param {boolean} [redraw]
     *        Whether to redraw the chart or wait for a later call to
     *        `chart.redraw()`.
     */
    public setTitle(
        titleOptions?: Highcharts.TitleOptions,
        subtitleOptions?: Highcharts.SubtitleOptions,
        redraw?: boolean
    ): void {

        this.applyDescription('title', titleOptions);
        this.applyDescription('subtitle', subtitleOptions);

        // The initial call also adds the caption. On update, chart.update will
        // relay to Chart.setCaption.
        this.applyDescription('caption', void 0);

        this.layOutTitles(redraw);
    }

    /**
     * Apply a title, subtitle or caption for the chart
     *
     * @private
     * @function Highcharts.Chart#applyDescription
     * @param name {string}
     * Either title, subtitle or caption
     * @param {Highcharts.TitleOptions|Highcharts.SubtitleOptions|Highcharts.CaptionOptions|undefined} explicitOptions
     * The options to set, will be merged with default options.
     */
    public applyDescription(
        name: ('title'|'subtitle'|'caption'),
        explicitOptions?: Highcharts.DescriptionOptionsType
    ): void {
        const chart = this;

        // Default style
        const style = name === 'title' ? {
            color: palette.neutralColor80,
            fontSize: this.options.isStock ? '16px' : '18px' // #2944
        } : {
            color: palette.neutralColor60
        };

        // Merge default options with explicit options
        const options = this.options[name] = merge(
            // Default styles
            (!this.styledMode && { style }) as
                Highcharts.DescriptionOptionsType,
            this.options[name],
            explicitOptions
        );

        let elem = this[name];

        if (elem && explicitOptions) {
            this[name] = elem = (elem as any).destroy(); // remove old
        }

        if (options && !elem) {
            elem = this.renderer.text(
                options.text as any,
                0,
                0,
                options.useHTML
            )
                .attr({
                    align: options.align,
                    'class': 'highcharts-' + name,
                    zIndex: (options as any).zIndex || 4
                })
                .add();

            // Update methods, shortcut to Chart.setTitle, Chart.setSubtitle and
            // Chart.setCaption
            elem.update = function (
                updateOptions: (Highcharts.DescriptionOptionsType)
            ): void {
                const fn = {
                    title: 'setTitle',
                    subtitle: 'setSubtitle',
                    caption: 'setCaption'
                }[name];
                (chart as any)[fn](updateOptions);
            };

            // Presentational
            if (!this.styledMode) {
                elem.css((options as any).style);
            }

            /**
             * The chart title. The title has an `update` method that allows
             * modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @sample highcharts/members/title-update/
             *         Updating titles
             *
             * @name Highcharts.Chart#title
             * @type {Highcharts.TitleObject}
             */

            /**
             * The chart subtitle. The subtitle has an `update` method that
             * allows modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @name Highcharts.Chart#subtitle
             * @type {Highcharts.SubtitleObject}
             */
            this[name] = elem;
        }

    }

    /**
     * Internal function to lay out the chart title, subtitle and caption, and
     * cache the full offset height for use in `getMargins`. The result is
     * stored in `this.titleOffset`.
     *
     * @private
     * @function Highcharts.Chart#layOutTitles
     *
     * @param {boolean} [redraw=true]
     * @fires Highcharts.Chart#event:afterLayOutTitles
     */
    public layOutTitles(redraw?: boolean): void {
        var titleOffset = [0, 0, 0],
            requiresDirtyBox,
            renderer = this.renderer,
            spacingBox = this.spacingBox;

        // Lay out the title and the subtitle respectively
        ['title', 'subtitle', 'caption'].forEach(function (key: string): void {
            var title = (this as any)[key],
                titleOptions = (this as any).options[key],
                verticalAlign = titleOptions.verticalAlign || 'top',
                offset = key === 'title' ? -3 :
                    // Floating subtitle (#6574)
                    verticalAlign === 'top' ? titleOffset[0] + 2 : 0,
                titleSize,
                height;

            if (title) {

                if (!this.styledMode) {
                    titleSize = titleOptions.style.fontSize;
                }
                titleSize = renderer.fontMetrics(titleSize, title).b;
                title
                    .css({
                        width: (
                            titleOptions.width ||
                            spacingBox.width + (titleOptions.widthAdjust || 0)
                        ) + 'px'
                    });

                // Skip the cache for HTML (#3481, #11666)
                height = Math.round(title.getBBox(titleOptions.useHTML).height);

                title.align(extend({
                    y: verticalAlign === 'bottom' ?
                        titleSize :
                        offset + titleSize,
                    height
                }, titleOptions), false, 'spacingBox');

                if (!titleOptions.floating) {
                    if (verticalAlign === 'top') {
                        titleOffset[0] = Math.ceil(
                            titleOffset[0] +
                            height
                        );
                    } else if (verticalAlign === 'bottom') {
                        titleOffset[2] = Math.ceil(
                            titleOffset[2] +
                            height
                        );
                    }
                }
            }
        }, this);

        // Handle title.margin and caption.margin
        if (
            titleOffset[0] &&
            ((this.options.title as any).verticalAlign || 'top') === 'top'
        ) {
            titleOffset[0] += (this.options.title as any).margin;
        }
        if (
            titleOffset[2] &&
            (this.options.caption as any).verticalAlign === 'bottom'
        ) {
            titleOffset[2] += (this.options.caption as any).margin;
        }

        requiresDirtyBox = (
            !this.titleOffset ||
            this.titleOffset.join(',') !== titleOffset.join(',')
        );

        // Used in getMargins
        this.titleOffset = titleOffset;

        fireEvent(this, 'afterLayOutTitles');

        if (!this.isDirtyBox && requiresDirtyBox) {
            this.isDirtyBox = this.isDirtyLegend = requiresDirtyBox;
            // Redraw if necessary (#2719, #2744)
            if (this.hasRendered && pick(redraw, true) && this.isDirtyBox) {
                this.redraw();
            }
        }
    }

    /**
     * Internal function to get the chart width and height according to options
     * and container size. Sets {@link Chart.chartWidth} and
     * {@link Chart.chartHeight}.
     *
     * @private
     * @function Highcharts.Chart#getChartSize
     */
    public getChartSize(): void {
        var chart = this,
            optionsChart = chart.options.chart as Highcharts.ChartOptions,
            widthOption = optionsChart.width,
            heightOption = optionsChart.height,
            renderTo = chart.renderTo;

        // Get inner width and height
        if (!defined(widthOption)) {
            chart.containerWidth = getStyle(renderTo, 'width') as any;
        }
        if (!defined(heightOption)) {
            chart.containerHeight = getStyle(renderTo, 'height') as any;
        }

        /**
         * The current pixel width of the chart.
         *
         * @name Highcharts.Chart#chartWidth
         * @type {number}
         */
        chart.chartWidth = Math.max( // #1393
            0,
            widthOption || (chart.containerWidth as any) || 600 // #1460
        );
        /**
         * The current pixel height of the chart.
         *
         * @name Highcharts.Chart#chartHeight
         * @type {number}
         */
        chart.chartHeight = Math.max(
            0,
            relativeLength(
                heightOption as any,
                chart.chartWidth
            ) ||
            (
                (chart.containerHeight as any) > 1 ?
                    (chart.containerHeight as any) :
                    400
            )
        );
    }

    /**
     * If the renderTo element has no offsetWidth, most likely one or more of
     * its parents are hidden. Loop up the DOM tree to temporarily display the
     * parents, then save the original display properties, and when the true
     * size is retrieved, reset them. Used on first render and on redraws.
     *
     * @private
     * @function Highcharts.Chart#temporaryDisplay
     *
     * @param {boolean} [revert]
     * Revert to the saved original styles.
     */
    public temporaryDisplay(revert?: boolean): void {
        var node = this.renderTo,
            tempStyle: CSSObject;

        if (!revert) {
            while (node && node.style) {

                // When rendering to a detached node, it needs to be temporarily
                // attached in order to read styling and bounding boxes (#5783,
                // #7024).
                if (!doc.body.contains(node) && !node.parentNode) {
                    (node as any).hcOrigDetached = true;
                    doc.body.appendChild(node);
                }
                if (
                    getStyle(node, 'display', false) === 'none' ||
                    (node as any).hcOricDetached
                ) {
                    (node as any).hcOrigStyle = {
                        display: node.style.display,
                        height: node.style.height,
                        overflow: node.style.overflow
                    };
                    tempStyle = {
                        display: 'block',
                        overflow: 'hidden'
                    };
                    if (node !== this.renderTo) {
                        tempStyle.height = 0;
                    }

                    css(node, tempStyle);

                    // If it still doesn't have an offset width after setting
                    // display to block, it probably has an !important priority
                    // #2631, 6803
                    if (!node.offsetWidth) {
                        node.style.setProperty('display', 'block', 'important');
                    }
                }
                node = node.parentNode as any;

                if (node === doc.body) {
                    break;
                }
            }
        } else {
            while (node && node.style) {
                if ((node as any).hcOrigStyle) {
                    css(node, (node as any).hcOrigStyle);
                    delete (node as any).hcOrigStyle;
                }
                if ((node as any).hcOrigDetached) {
                    doc.body.removeChild(node);
                    (node as any).hcOrigDetached = false;
                }
                node = node.parentNode as any;
            }
        }
    }

    /**
     * Set the {@link Chart.container|chart container's} class name, in
     * addition to `highcharts-container`.
     *
     * @function Highcharts.Chart#setClassName
     *
     * @param {string} [className]
     * The additional class name.
     */
    public setClassName(className?: string): void {
        this.container.className = 'highcharts-container ' + (className || '');
    }

    /**
     * Get the containing element, determine the size and create the inner
     * container div to hold the chart.
     *
     * @private
     * @function Highcharts.Chart#afterGetContainer
     * @fires Highcharts.Chart#event:afterGetContainer
     */
    public getContainer(): void {
        var chart = this,
            container,
            options = chart.options,
            optionsChart = options.chart as Highcharts.ChartOptions,
            chartWidth,
            chartHeight,
            renderTo = chart.renderTo,
            indexAttrName = 'data-highcharts-chart',
            oldChartIndex,
            Ren,
            containerId = uniqueKey(),
            containerStyle,
            key;

        if (!renderTo) {
            chart.renderTo = renderTo =
                optionsChart.renderTo as HTMLDOMElement;
        }

        if (isString(renderTo)) {
            chart.renderTo = renderTo =
                doc.getElementById(renderTo as any) as any;
        }

        // Display an error if the renderTo is wrong
        if (!renderTo) {
            error(13, true, chart);
        }

        // If the container already holds a chart, destroy it. The check for
        // hasRendered is there because web pages that are saved to disk from
        // the browser, will preserve the data-highcharts-chart attribute and
        // the SVG contents, but not an interactive chart. So in this case,
        // charts[oldChartIndex] will point to the wrong chart if any (#2609).
        oldChartIndex = pInt(attr(renderTo, indexAttrName));
        if (
            isNumber(oldChartIndex) &&
            charts[oldChartIndex] &&
            (charts[oldChartIndex] as any).hasRendered
        ) {
            (charts[oldChartIndex] as any).destroy();
        }

        // Make a reference to the chart from the div
        attr(renderTo, indexAttrName, chart.index);

        // remove previous chart
        renderTo.innerHTML = '';

        // If the container doesn't have an offsetWidth, it has or is a child of
        // a node that has display:none. We need to temporarily move it out to a
        // visible state to determine the size, else the legend and tooltips
        // won't render properly. The skipClone option is used in sparklines as
        // a micro optimization, saving about 1-2 ms each chart.
        if (!optionsChart.skipClone && !renderTo.offsetWidth) {
            chart.temporaryDisplay();
        }

        // get the width and height
        chart.getChartSize();
        chartWidth = chart.chartWidth;
        chartHeight = chart.chartHeight;

        // Allow table cells and flex-boxes to shrink without the chart blocking
        // them out (#6427)
        css(renderTo, { overflow: 'hidden' });

        // Create the inner container
        if (!chart.styledMode) {
            containerStyle = extend({
                position: 'relative',
                // needed for context menu (avoidscrollbars) and content
                // overflow in IE
                overflow: 'hidden',
                width: chartWidth + 'px',
                height: chartHeight + 'px',
                textAlign: 'left',
                lineHeight: 'normal', // #427
                zIndex: 0, // #1072
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                userSelect: 'none' // #13503
            }, optionsChart.style as any);
        }

        /**
         * The containing HTML element of the chart. The container is
         * dynamically inserted into the element given as the `renderTo`
         * parameter in the {@link Highcharts#chart} constructor.
         *
         * @name Highcharts.Chart#container
         * @type {Highcharts.HTMLDOMElement}
         */
        container = createElement(
            'div',
            {
                id: containerId
            },
            containerStyle,
            renderTo
        );
        chart.container = container;

        // cache the cursor (#1650)
        chart._cursor = container.style.cursor as CursorValue;

        // Initialize the renderer
        Ren = (H as any)[optionsChart.renderer as any] || H.Renderer;

        /**
         * The renderer instance of the chart. Each chart instance has only one
         * associated renderer.
         *
         * @name Highcharts.Chart#renderer
         * @type {Highcharts.SVGRenderer}
         */
        chart.renderer = new Ren(
            container,
            chartWidth,
            chartHeight,
            null,
            optionsChart.forExport,
            options.exporting && options.exporting.allowHTML,
            chart.styledMode
        );
        // Set the initial animation from the options
        setAnimation(void 0, chart);


        chart.setClassName(optionsChart.className);
        if (!chart.styledMode) {
            chart.renderer.setStyle(optionsChart.style as any);
        } else {
            // Initialize definitions
            for (key in options.defs) { // eslint-disable-line guard-for-in
                this.renderer.definition((options.defs as any)[key]);
            }
        }

        // Add a reference to the charts index
        chart.renderer.chartIndex = chart.index;

        fireEvent(this, 'afterGetContainer');
    }

    /**
     * Calculate margins by rendering axis labels in a preliminary position.
     * Title, subtitle and legend have already been rendered at this stage, but
     * will be moved into their final positions.
     *
     * @private
     * @function Highcharts.Chart#getMargins
     * @fires Highcharts.Chart#event:getMargins
     */
    public getMargins(skipAxes?: boolean): void {
        const { spacing, margin, titleOffset } = this;

        this.resetMargins();

        // Adjust for title and subtitle
        if (titleOffset[0] && !defined(margin[0])) {
            this.plotTop = Math.max(
                this.plotTop,
                titleOffset[0] + spacing[0]
            );
        }

        if (titleOffset[2] && !defined(margin[2])) {
            this.marginBottom = Math.max(
                this.marginBottom as any,
                titleOffset[2] + spacing[2]
            );
        }

        // Adjust for legend
        if (this.legend && this.legend.display) {
            this.legend.adjustMargins(margin, spacing);
        }

        fireEvent(this, 'getMargins');

        if (!skipAxes) {
            this.getAxisMargins();
        }
    }

    /**
     * @private
     * @function Highcharts.Chart#getAxisMargins
     */
    public getAxisMargins(): void {

        var chart = this,
            // [top, right, bottom, left]
            axisOffset = chart.axisOffset = [0, 0, 0, 0],
            colorAxis = chart.colorAxis,
            margin = chart.margin,
            getOffset = function (axes: Array<Highcharts.Axis>): void {
                axes.forEach(function (axis: Highcharts.Axis): void {
                    if (axis.visible) {
                        axis.getOffset();
                    }
                });
            };

        // pre-render axes to get labels offset width
        if (chart.hasCartesianSeries) {
            getOffset(chart.axes);

        } else if (colorAxis && colorAxis.length) {
            getOffset(colorAxis);
        }

        // Add the axis offsets
        marginNames.forEach(function (m: string, side: number): void {
            if (!defined(margin[side])) {
                (chart as any)[m] += axisOffset[side];
            }
        });

        chart.setChartSize();

    }

    /**
     * Reflows the chart to its container. By default, the chart reflows
     * automatically to its container following a `window.resize` event, as per
     * the [chart.reflow](https://api.highcharts.com/highcharts/chart.reflow)
     * option. However, there are no reliable events for div resize, so if the
     * container is resized without a window resize event, this must be called
     * explicitly.
     *
     * @sample highcharts/members/chart-reflow/
     *         Resize div and reflow
     * @sample highcharts/chart/events-container/
     *         Pop up and reflow
     *
     * @function Highcharts.Chart#reflow
     *
     * @param {global.Event} [e]
     *        Event arguments. Used primarily when the function is called
     *        internally as a response to window resize.
     */
    public reflow(e?: Event): void {
        var chart = this,
            optionsChart = chart.options.chart as Highcharts.ChartOptions,
            renderTo = chart.renderTo,
            hasUserSize = (
                defined(optionsChart.width) &&
                defined(optionsChart.height)
            ),
            width = optionsChart.width || getStyle(renderTo, 'width'),
            height = optionsChart.height || getStyle(renderTo, 'height'),
            target = e ? e.target : win;

        // Width and height checks for display:none. Target is doc in IE8 and
        // Opera, win in Firefox, Chrome and IE9.
        if (
            !hasUserSize &&
            !chart.isPrinting &&
            width &&
            height &&
            (target === win || target === doc)
        ) {
            if (
                width !== chart.containerWidth ||
                height !== chart.containerHeight
            ) {
                U.clearTimeout(chart.reflowTimeout as any);
                // When called from window.resize, e is set, else it's called
                // directly (#2224)
                chart.reflowTimeout = syncTimeout(function (): void {
                    // Set size, it may have been destroyed in the meantime
                    // (#1257)
                    if (chart.container) {
                        chart.setSize(void 0, void 0, false);
                    }
                }, e ? 100 : 0);
            }
            chart.containerWidth = width as any;
            chart.containerHeight = height as any;
        }
    }

    /**
     * Toggle the event handlers necessary for auto resizing, depending on the
     * `chart.reflow` option.
     *
     * @private
     * @function Highcharts.Chart#setReflow
     */
    public setReflow(reflow?: boolean): void {
        var chart = this;

        if (reflow !== false && !this.unbindReflow) {
            this.unbindReflow = addEvent(win, 'resize', function (
                e: Event
            ): void {
                // a removed event listener still runs in Edge and IE if the
                // listener was removed while the event runs, so check if the
                // chart is not destroyed (#11609)
                if (chart.options) {
                    chart.reflow(e);
                }
            });
            addEvent(this, 'destroy', this.unbindReflow);

        } else if (reflow === false && this.unbindReflow) {

            // Unbind and unset
            this.unbindReflow = this.unbindReflow();
        }

        // The following will add listeners to re-fit the chart before and after
        // printing (#2284). However it only works in WebKit. Should have worked
        // in Firefox, but not supported in IE.
        /*
        if (win.matchMedia) {
            win.matchMedia('print').addListener(function reflow() {
                chart.reflow();
            });
        }
        //*/
    }

    /**
     * Resize the chart to a given width and height. In order to set the width
     * only, the height argument may be skipped. To set the height only, pass
     * `undefined` for the width.
     *
     * @sample highcharts/members/chart-setsize-button/
     *         Test resizing from buttons
     * @sample highcharts/members/chart-setsize-jquery-resizable/
     *         Add a jQuery UI resizable
     * @sample stock/members/chart-setsize/
     *         Highstock with UI resizable
     *
     * @function Highcharts.Chart#setSize
     *
     * @param {number|null} [width]
     *        The new pixel width of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value (when
     *        setting height only), or `null` to adapt to the width of the
     *        containing element.
     *
     * @param {number|null} [height]
     *        The new pixel height of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value, or `null`
     *        in order to adapt to the height of the containing element.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether and how to apply animation.
     *
     * @return {void}
     *
     * @fires Highcharts.Chart#event:endResize
     * @fires Highcharts.Chart#event:resize
     */
    public setSize(
        width?: (number|null),
        height?: (number|null),
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        var chart = this,
            renderer = chart.renderer,
            globalAnimation;

        // Handle the isResizing counter
        chart.isResizing += 1;

        // set the animation for the current process
        setAnimation(animation, chart);
        globalAnimation = renderer.globalAnimation;

        chart.oldChartHeight = chart.chartHeight;
        chart.oldChartWidth = chart.chartWidth;
        if (typeof width !== 'undefined') {
            (chart.options.chart as any).width = width;
        }
        if (typeof height !== 'undefined') {
            (chart.options.chart as any).height = height;
        }
        chart.getChartSize();

        // Resize the container with the global animation applied if enabled
        // (#2503)
        if (!chart.styledMode) {
            (globalAnimation ? animate : css)(chart.container, {
                width: chart.chartWidth + 'px',
                height: chart.chartHeight + 'px'
            }, globalAnimation);
        }

        chart.setChartSize(true);
        renderer.setSize(
            (chart.chartWidth as any),
            (chart.chartHeight as any),
            globalAnimation
        );

        // handle axes
        chart.axes.forEach(function (axis: Highcharts.Axis): void {
            axis.isDirty = true;
            axis.setScale();
        });

        chart.isDirtyLegend = true; // force legend redraw
        chart.isDirtyBox = true; // force redraw of plot and chart border

        chart.layOutTitles(); // #2857
        chart.getMargins();

        chart.redraw(globalAnimation);


        chart.oldChartHeight = null as any;
        fireEvent(chart, 'resize');

        // Fire endResize and set isResizing back. If animation is disabled,
        // fire without delay
        syncTimeout(function (): void {
            if (chart) {
                fireEvent(chart, 'endResize', null as any, function (): void {
                    chart.isResizing -= 1;
                });
            }
        }, animObject(globalAnimation).duration);
    }

    /**
     * Set the public chart properties. This is done before and after the
     * pre-render to determine margin sizes.
     *
     * @private
     * @function Highcharts.Chart#setChartSize
     * @fires Highcharts.Chart#event:afterSetChartSize
     */
    public setChartSize(skipAxes?: boolean): void {
        var chart = this,
            inverted = chart.inverted,
            renderer = chart.renderer,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            optionsChart = chart.options.chart as Highcharts.ChartOptions,
            spacing = chart.spacing,
            clipOffset = chart.clipOffset,
            clipX,
            clipY,
            plotLeft,
            plotTop,
            plotWidth,
            plotHeight,
            plotBorderWidth;

        /**
         * The current left position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotLeft
         * @type {number}
         */
        chart.plotLeft = plotLeft = Math.round(chart.plotLeft);

        /**
         * The current top position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotTop
         * @type {number}
         */
        chart.plotTop = plotTop = Math.round(chart.plotTop);

        /**
         * The current width of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotWidth
         * @type {number}
         */
        chart.plotWidth = plotWidth = Math.max(
            0,
            Math.round(
                (chartWidth as any) - plotLeft - (chart.marginRight as any)
            )
        );

        /**
         * The current height of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotHeight
         * @type {number}
         */
        chart.plotHeight = plotHeight = Math.max(
            0,
            Math.round(
                (chartHeight as any) - plotTop - (chart.marginBottom as any)
            )
        );

        chart.plotSizeX = inverted ? plotHeight : plotWidth;
        chart.plotSizeY = inverted ? plotWidth : plotHeight;

        chart.plotBorderWidth = optionsChart.plotBorderWidth || 0;

        // Set boxes used for alignment
        chart.spacingBox = renderer.spacingBox = {
            x: spacing[3],
            y: spacing[0],
            width: (chartWidth as any) - spacing[3] - spacing[1],
            height: (chartHeight as any) - spacing[0] - spacing[2]
        };
        chart.plotBox = renderer.plotBox = {
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
        };

        plotBorderWidth = 2 * Math.floor(chart.plotBorderWidth / 2);
        clipX = Math.ceil(
            Math.max(plotBorderWidth, (clipOffset as any)[3]) / 2
        );
        clipY = Math.ceil(
            Math.max(plotBorderWidth, (clipOffset as any)[0]) / 2
        );
        chart.clipBox = {
            x: clipX,
            y: clipY,
            width: Math.floor(
                chart.plotSizeX -
                Math.max(plotBorderWidth, (clipOffset as any)[1]) / 2 -
                clipX
            ),
            height: Math.max(
                0,
                Math.floor(
                    chart.plotSizeY -
                    Math.max(plotBorderWidth, (clipOffset as any)[2]) / 2 -
                    clipY
                )
            )
        };

        if (!skipAxes) {
            chart.axes.forEach(function (axis: Highcharts.Axis): void {
                axis.setAxisSize();
                axis.setAxisTranslation();
            });
        }

        fireEvent(chart, 'afterSetChartSize', { skipAxes: skipAxes });
    }

    /**
     * Initial margins before auto size margins are applied.
     *
     * @private
     * @function Highcharts.Chart#resetMargins
     */
    public resetMargins(): void {

        fireEvent(this, 'resetMargins');

        var chart = this,
            chartOptions = chart.options.chart as Highcharts.ChartOptions;

        // Create margin and spacing array
        ['margin', 'spacing'].forEach(function splashArrays(
            target: string
        ): void {
            var value = (chartOptions as any)[target],
                values = isObject(value) ? value : [value, value, value, value];

            [
                'Top',
                'Right',
                'Bottom',
                'Left'
            ].forEach(function (sideName: string, side: number): void {
                (chart as any)[target][side] = pick(
                    (chartOptions as any)[target + sideName],
                    values[side]
                );
            });
        });

        // Set margin names like chart.plotTop, chart.plotLeft,
        // chart.marginRight, chart.marginBottom.
        marginNames.forEach(function (m: string, side: number): void {
            (chart as any)[m] = pick(chart.margin[side], chart.spacing[side]);
        });
        chart.axisOffset = [0, 0, 0, 0]; // top, right, bottom, left
        chart.clipOffset = [0, 0, 0, 0];
    }

    /**
     * Internal function to draw or redraw the borders and backgrounds for chart
     * and plot area.
     *
     * @private
     * @function Highcharts.Chart#drawChartBox
     * @fires Highcharts.Chart#event:afterDrawChartBox
     */
    public drawChartBox(): void {
        var chart = this,
            optionsChart = chart.options.chart as Highcharts.ChartOptions,
            renderer = chart.renderer,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            chartBackground = chart.chartBackground,
            plotBackground = chart.plotBackground,
            plotBorder = chart.plotBorder,
            chartBorderWidth,
            styledMode = chart.styledMode,
            plotBGImage = chart.plotBGImage,
            chartBackgroundColor = optionsChart.backgroundColor,
            plotBackgroundColor = optionsChart.plotBackgroundColor,
            plotBackgroundImage = optionsChart.plotBackgroundImage,
            mgn,
            bgAttr: SVGAttributes,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            plotBox = chart.plotBox,
            clipRect = chart.clipRect,
            clipBox = chart.clipBox,
            verb = 'animate';

        // Chart area
        if (!chartBackground) {
            chart.chartBackground = chartBackground = renderer.rect()
                .addClass('highcharts-background')
                .add();
            verb = 'attr';
        }

        if (!styledMode) {
            // Presentational
            chartBorderWidth = optionsChart.borderWidth || 0;
            mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

            bgAttr = {
                fill: chartBackgroundColor || 'none'
            };

            if (chartBorderWidth || chartBackground['stroke-width']) { // #980
                bgAttr.stroke = optionsChart.borderColor;
                bgAttr['stroke-width'] = chartBorderWidth;
            }
            chartBackground
                .attr(bgAttr)
                .shadow(optionsChart.shadow);
        } else {
            chartBorderWidth = mgn = chartBackground.strokeWidth();
        }


        chartBackground[verb]({
            x: mgn / 2,
            y: mgn / 2,
            width: (chartWidth as any) - mgn - chartBorderWidth % 2,
            height: (chartHeight as any) - mgn - chartBorderWidth % 2,
            r: optionsChart.borderRadius
        });

        // Plot background
        verb = 'animate';
        if (!plotBackground) {
            verb = 'attr';
            chart.plotBackground = plotBackground = renderer.rect()
                .addClass('highcharts-plot-background')
                .add();
        }
        plotBackground[verb](plotBox);

        if (!styledMode) {
            // Presentational attributes for the background
            plotBackground
                .attr({
                    fill: plotBackgroundColor || 'none'
                })
                .shadow(optionsChart.plotShadow);

            // Create the background image
            if (plotBackgroundImage) {
                if (!plotBGImage) {
                    chart.plotBGImage = renderer.image(
                        plotBackgroundImage,
                        plotLeft,
                        plotTop,
                        plotWidth,
                        plotHeight
                    ).add();
                } else {
                    if (plotBackgroundImage !== plotBGImage.attr('href')) {
                        plotBGImage.attr('href', plotBackgroundImage);
                    }

                    plotBGImage.animate(plotBox as SVGAttributes);
                }
            }
        }

        // Plot clip
        if (!clipRect) {
            chart.clipRect = (renderer.clipRect as any)(clipBox);
        } else {
            clipRect.animate({
                width: (clipBox as any).width,
                height: (clipBox as any).height
            });
        }

        // Plot area border
        verb = 'animate';
        if (!plotBorder) {
            verb = 'attr';
            chart.plotBorder = plotBorder = renderer.rect()
                .addClass('highcharts-plot-border')
                .attr({
                    zIndex: 1 // Above the grid
                })
                .add();
        }

        if (!styledMode) {
            // Presentational
            plotBorder.attr({
                stroke: optionsChart.plotBorderColor,
                'stroke-width': optionsChart.plotBorderWidth || 0,
                fill: 'none'
            });
        }

        plotBorder[verb](plotBorder.crisp({
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
        }, -plotBorder.strokeWidth())); // #3282 plotBorder should be negative;

        // reset
        chart.isDirtyBox = false;

        fireEvent(this, 'afterDrawChartBox');
    }

    /**
     * Detect whether a certain chart property is needed based on inspecting its
     * options and series. This mainly applies to the chart.inverted property,
     * and in extensions to the chart.angular and chart.polar properties.
     *
     * @private
     * @function Highcharts.Chart#propFromSeries
     * @return {void}
     */
    public propFromSeries(): void {
        var chart = this,
            optionsChart: Highcharts.ChartOptions = chart.options.chart as any,
            klass,
            seriesOptions: Array<SeriesOptions> = chart.options.series as any,
            i,
            value;

        /**
         * The flag is set to `true` if a series of the chart is inverted.
         *
         * @name Highcharts.Chart#inverted
         * @type {boolean|undefined}
         */
        ['inverted', 'angular', 'polar'].forEach(function (key: string): void {

            // The default series type's class
            klass = BaseSeries.seriesTypes[(optionsChart.type ||
                optionsChart.defaultSeriesType) as any];

            // Get the value from available chart-wide properties
            value =
                // It is set in the options:
                (optionsChart as any)[key] ||
                // The default series class:
                (klass && (klass.prototype as any)[key]);
            // requires it

            // 4. Check if any the chart's series require it
            i = seriesOptions && seriesOptions.length;
            while (!value && i--) {
                klass = BaseSeries.seriesTypes[seriesOptions[i].type as any];
                if (klass && (klass.prototype as any)[key]) {
                    value = true;
                }
            }

            // Set the chart property
            (chart as any)[key] = value;
        });

    }

    /**
     * Internal function to link two or more series together, based on the
     * `linkedTo` option. This is done from `Chart.render`, and after
     * `Chart.addSeries` and `Series.remove`.
     *
     * @private
     * @function Highcharts.Chart#linkSeries
     * @fires Highcharts.Chart#event:afterLinkSeries
     */
    public linkSeries(): void {
        var chart = this,
            chartSeries = chart.series;

        // Reset links
        chartSeries.forEach(function (series): void {
            series.linkedSeries.length = 0;
        });

        // Apply new links
        chartSeries.forEach(function (series): void {
            var linkedTo = series.options.linkedTo;

            if (isString(linkedTo)) {
                if (linkedTo === ':previous') {
                    linkedTo = chart.series[(series.index as any) - 1] as any;
                } else {
                    linkedTo = chart.get(linkedTo as any) as any;
                }
                // #3341 avoid mutual linking
                if (linkedTo && (linkedTo as any).linkedParent !== series) {
                    (linkedTo as any).linkedSeries.push(series);
                    series.linkedParent = linkedTo as any;

                    if ((linkedTo as any).enabledDataSorting) {
                        series.setDataSortingOptions();
                    }

                    series.visible = pick(
                        series.options.visible,
                        (linkedTo as any).options.visible,
                        series.visible
                    ); // #3879
                }
            }
        });

        fireEvent(this, 'afterLinkSeries');
    }

    /**
     * Render series for the chart.
     *
     * @private
     * @function Highcharts.Chart#renderSeries
     */
    public renderSeries(): void {
        this.series.forEach(function (serie): void {
            serie.translate();
            serie.render();
        });
    }

    /**
     * Render labels for the chart.
     *
     * @private
     * @function Highcharts.Chart#renderLabels
     */
    public renderLabels(): void {
        var chart = this,
            labels = chart.options.labels as Highcharts.LabelsOptions;

        if (labels.items) {
            labels.items.forEach(function (
                label: Highcharts.LabelsItemsOptions
            ): void {
                var style = extend(labels.style as any, label.style as any),
                    x = pInt(style.left) + chart.plotLeft,
                    y = pInt(style.top) + chart.plotTop + 12;

                // delete to prevent rewriting in IE
                delete style.left;
                delete style.top;

                chart.renderer.text(
                    label.html as any,
                    x,
                    y
                )
                    .attr({ zIndex: 2 })
                    .css(style)
                    .add();

            });
        }
    }

    /**
     * Render all graphics for the chart. Runs internally on initialization.
     *
     * @private
     * @function Highcharts.Chart#render
     */
    public render(): void {
        var chart = this,
            axes = chart.axes,
            colorAxis = chart.colorAxis,
            renderer = chart.renderer,
            options = chart.options,
            correction = 0, // correction for X axis labels
            tempWidth,
            tempHeight,
            redoHorizontal: boolean,
            redoVertical: boolean,
            renderAxes = function (axes: Array<Highcharts.Axis>): void {
                axes.forEach(function (axis: Highcharts.Axis): void {
                    if (axis.visible) {
                        axis.render();
                    }
                });
            };

        // Title
        chart.setTitle();

        /**
         * The overview of the chart's series.
         *
         * @name Highcharts.Chart#legend
         * @type {Highcharts.Legend}
         */
        chart.legend = new Legend(chart, options.legend as any);

        // Get stacks
        if (chart.getStacks) {
            chart.getStacks();
        }

        // Get chart margins
        chart.getMargins(true);
        chart.setChartSize();

        // Record preliminary dimensions for later comparison
        tempWidth = chart.plotWidth;

        axes.some(function (axis: Highcharts.Axis): (boolean|undefined) {
            if (
                axis.horiz &&
                axis.visible &&
                (axis.options.labels as any).enabled &&
                axis.series.length
            ) {
                // 21 is the most common correction for X axis labels
                correction = 21;
                return true;
            }
        } as any);

        // use Math.max to prevent negative plotHeight
        chart.plotHeight = Math.max(chart.plotHeight - correction, 0);
        tempHeight = chart.plotHeight;

        // Get margins by pre-rendering axes
        axes.forEach(function (axis: Highcharts.Axis): void {
            axis.setScale();
        });
        chart.getAxisMargins();

        // If the plot area size has changed significantly, calculate tick
        // positions again
        redoHorizontal = tempWidth / chart.plotWidth > 1.1;
        // Height is more sensitive, use lower threshold
        redoVertical = tempHeight / chart.plotHeight > 1.05;

        if (redoHorizontal || redoVertical) {

            axes.forEach(function (axis: Highcharts.Axis): void {
                if (
                    (axis.horiz && redoHorizontal) ||
                    (!axis.horiz && redoVertical)
                ) {
                    // update to reflect the new margins
                    axis.setTickInterval(true);
                }
            });
            chart.getMargins(); // second pass to check for new labels
        }

        // Draw the borders and backgrounds
        chart.drawChartBox();


        // Axes
        if (chart.hasCartesianSeries) {
            renderAxes(axes);

        } else if (colorAxis && colorAxis.length) {
            renderAxes(colorAxis);
        }

        // The series
        if (!chart.seriesGroup) {
            chart.seriesGroup = renderer.g('series-group')
                .attr({ zIndex: 3 })
                .add();
        }
        chart.renderSeries();

        // Labels
        chart.renderLabels();

        // Credits
        chart.addCredits();

        // Handle scaling
        chart.updateContainerScaling();

        // Set flag
        chart.hasRendered = true;

    }

    /**
     * Set a new credits label for the chart.
     *
     * @sample highcharts/credits/credits-update/
     *         Add and update credits
     *
     * @function Highcharts.Chart#addCredits
     *
     * @param {Highcharts.CreditsOptions} [credits]
     * A configuration object for the new credits.
     */
    public addCredits(credits?: Highcharts.CreditsOptions): void {
        const chart = this,
            creds = merge(
                true, this.options.credits as Highcharts.CreditsOptions, credits
            );
        if (creds.enabled && !this.credits) {

            /**
             * The chart's credits label. The label has an `update` method that
             * allows setting new options as per the
             * [credits options set](https://api.highcharts.com/highcharts/credits).
             *
             * @name Highcharts.Chart#credits
             * @type {Highcharts.SVGElement}
             */
            this.credits = this.renderer.text(
                creds.text + (this.mapCredits || ''),
                0,
                0
            )
                .addClass('highcharts-credits')
                .on('click', function (): void {
                    if (creds.href) {
                        win.location.href = creds.href;
                    }
                })
                .attr({
                    align: (creds.position as any).align,
                    zIndex: 8
                });


            if (!chart.styledMode) {
                this.credits.css(creds.style as any);
            }

            this.credits
                .add()
                .align(creds.position);

            // Dynamically update
            this.credits.update = function (
                options: Highcharts.CreditsOptions
            ): void {
                chart.credits = (chart.credits as any).destroy();
                chart.addCredits(options);
            };
        }
    }

    /**
     * Handle scaling, #11329 - when there is scaling/transform on the container
     * or on a parent element, we need to take this into account. We calculate
     * the scaling once here and it is picked up where we need to use it
     * (Pointer, Tooltip).
     *
     * @private
     * @function Highcharts.Chart#updateContainerScaling
     */
    public updateContainerScaling(): void {
        const container = this.container;
        // #13342 - tooltip was not visible in Chrome, when chart
        // updates height.
        if (
            container.offsetWidth > 2 && // #13342
            container.offsetHeight > 2 && // #13342
            container.getBoundingClientRect
        ) {
            const bb = container.getBoundingClientRect(),
                scaleX = bb.width / container.offsetWidth,
                scaleY = bb.height / container.offsetHeight;
            if (scaleX !== 1 || scaleY !== 1) {
                this.containerScaling = { scaleX, scaleY };
            } else {
                delete this.containerScaling;
            }
        }
    }

    /**
     * Remove the chart and purge memory. This method is called internally
     * before adding a second chart into the same container, as well as on
     * window unload to prevent leaks.
     *
     * @sample highcharts/members/chart-destroy/
     *         Destroy the chart from a button
     * @sample stock/members/chart-destroy/
     *         Destroy with Highstock
     *
     * @function Highcharts.Chart#destroy
     *
     * @fires Highcharts.Chart#event:destroy
     */
    public destroy(): void {
        var chart = this,
            axes = chart.axes,
            series = chart.series,
            container = chart.container,
            i,
            parentNode = container && container.parentNode;

        // fire the chart.destoy event
        fireEvent(chart, 'destroy');

        // Delete the chart from charts lookup array
        if (chart.renderer.forExport) {
            erase(charts, chart); // #6569
        } else {
            charts[chart.index] = void 0;
        }
        H.chartCount--;
        chart.renderTo.removeAttribute('data-highcharts-chart');

        // remove events
        removeEvent(chart);

        // ==== Destroy collections:
        // Destroy axes
        i = axes.length;
        while (i--) {
            axes[i] = axes[i].destroy() as any;
        }

        // Destroy scroller & scroller series before destroying base series
        if (this.scroller && this.scroller.destroy) {
            this.scroller.destroy();
        }

        // Destroy each series
        i = series.length;
        while (i--) {
            series[i] = series[i].destroy() as any;
        }

        // ==== Destroy chart properties:
        [
            'title', 'subtitle', 'chartBackground', 'plotBackground',
            'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits',
            'pointer', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip',
            'renderer'
        ].forEach(function (name: string): void {
            var prop = (chart as any)[name];

            if (prop && prop.destroy) {
                (chart as any)[name] = prop.destroy();
            }
        });

        // Remove container and all SVG, check container as it can break in IE
        // when destroyed before finished loading
        if (container) {
            container.innerHTML = '';
            removeEvent(container);
            if (parentNode) {
                discardElement(container);
            }

        }

        // clean it all up
        objectEach(chart, function (val: any, key: string): void {
            delete (chart as any)[key];
        });

    }

    /**
     * Prepare for first rendering after all data are loaded.
     *
     * @private
     * @function Highcharts.Chart#firstRender
     * @fires Highcharts.Chart#event:beforeRender
     */
    public firstRender(): void {
        var chart = this,
            options = chart.options;

        // Hook for oldIE to check whether the chart is ready to render
        if (chart.isReadyToRender && !chart.isReadyToRender()) {
            return;
        }

        // Create the container
        chart.getContainer();

        chart.resetMargins();
        chart.setChartSize();

        // Set the common chart properties (mainly invert) from the given series
        chart.propFromSeries();

        // get axes
        chart.getAxes();

        // Initialize the series
        (isArray(options.series) ? options.series : []).forEach(
            // #9680
            function (serieOptions): void {
                chart.initSeries(serieOptions);
            }
        );

        chart.linkSeries();
        chart.setSeriesData();

        // Run an event after axes and series are initialized, but before
        // render. At this stage, the series data is indexed and cached in the
        // xData and yData arrays, so we can access those before rendering. Used
        // in Highstock.
        fireEvent(chart, 'beforeRender');

        // depends on inverted and on margins being set
        if (Pointer) {
            if (!H.hasTouch && (win.PointerEvent || win.MSPointerEvent)) {
                chart.pointer = new MSPointer(chart, options);
            } else {
                /**
                 * The Pointer that keeps track of mouse and touch interaction.
                 *
                 * @memberof Highcharts.Chart
                 * @name pointer
                 * @type {Highcharts.Pointer}
                 * @instance
                 */
                chart.pointer = new Pointer(chart, options);
            }
        }

        // Handle responsiveness. Has to fire after extensions are loaded
        addEvent(chart, 'load', function (): void {
            if (chart.setResponsive) {
                chart.setResponsive(true);
            }
        });

        chart.render();

        // Fire the load event if there are no external images
        if (!chart.renderer.imgCount && !chart.hasLoaded) {
            chart.onload();
        }

        // If the chart was rendered outside the top container, put it back in
        // (#3679)
        chart.temporaryDisplay(true);

    }

    /**
     * Internal function that runs on chart load, async if any images are loaded
     * in the chart. Runs the callbacks and triggers the `load` and `render`
     * events.
     *
     * @private
     * @function Highcharts.Chart#onload
     * @fires Highcharts.Chart#event:load
     * @fires Highcharts.Chart#event:render
     */
    public onload(): void {

        // Run callbacks, first the ones registered by modules, then user's one
        this.callbacks.concat([this.callback as any]).forEach(function (
            this: Chart,
            fn: (Chart.CallbackFunction|undefined)
        ): void {
            // Chart destroyed in its own callback (#3600)
            if (fn && typeof this.index !== 'undefined') {
                fn.apply(this, [this]);
            }
        }, this);

        fireEvent(this, 'load');
        fireEvent(this, 'render');


        // Set up auto resize, check for not destroyed (#6068)
        if (defined(this.index)) {
            this.setReflow((this.options.chart as any).reflow);
        }

        // Don't run again
        this.hasLoaded = true;
    }

    /**
     * Add a series to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the series as a configuration
     * option instead. With multiple axes, the `offset` is dynamically adjusted.
     *
     * @sample highcharts/members/chart-addseries/
     *         Add a series from a button
     * @sample stock/members/chart-addseries/
     *         Add a series in Highstock
     *
     * @function Highcharts.Chart#addSeries
     *
     * @param {Highcharts.SeriesOptionsType} options
     *        The config options for the series.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @return {Highcharts.Series}
     *         The newly created series object.
     *
     * @fires Highcharts.Chart#event:addSeries
     * @fires Highcharts.Chart#event:afterAddSeries
     */
    public addSeries(
        options: SeriesTypeOptions,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): LineSeries {
        var series: (LineSeries|undefined),
            chart = this;

        if (options) { // <- not necessary
            redraw = pick(redraw, true); // defaults to true

            fireEvent(
                chart,
                'addSeries',
                { options: options },
                function (): void {
                    series = chart.initSeries(options);

                    chart.isDirtyLegend = true;
                    chart.linkSeries();

                    if (series.enabledDataSorting) {
                        // We need to call `setData` after `linkSeries`
                        series.setData(options.data as any, false);
                    }

                    fireEvent(chart, 'afterAddSeries', { series: series });

                    if (redraw) {
                        chart.redraw(animation);
                    }
                }
            );
        }

        return series as any;
    }

    /**
     * Add an axis to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the axis as a configuration
     * option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addAxis
     *
     * @param {Highcharts.AxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [isX=false]
     *        Whether it is an X axis or a value axis.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether and how to apply animation in the redraw.
     *
     * @return {Highcharts.Axis}
     *         The newly generated Axis object.
     */
    public addAxis(
        options: Highcharts.AxisOptions,
        isX?: boolean,
        redraw?: boolean,
        animation?: boolean
    ): Highcharts.Axis {
        return this.createAxis(
            isX ? 'xAxis' : 'yAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    }

    /**
     * Add a color axis to the chart after render time. Note that this method
     * should never be used when adding data synchronously at chart render time,
     * as it adds expense to the calculations and rendering. When adding data at
     * the same time as the chart is initialized, add the axis as a
     * configuration option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addColorAxis
     *
     * @param {Highcharts.ColorAxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether and how to apply animation in the redraw.
     *
     * @return {Highcharts.ColorAxis}
     *         The newly generated Axis object.
     */
    public addColorAxis(
        options: ColorAxis.Options,
        redraw?: boolean,
        animation?: boolean
    ): Highcharts.Axis {
        return this.createAxis(
            'colorAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    }

    /**
     * Factory for creating different axis types.
     *
     * @private
     * @function Highcharts.Chart#createAxis
     *
     * @param {string} type
     *        An axis type.
     *
     * @param {...Array<*>} arguments
     *        All arguments for the constructor.
     *
     * @return {Highcharts.Axis | Highcharts.ColorAxis}
     *         The newly generated Axis object.
     */
    public createAxis(
        type: string,
        options: Chart.CreateAxisOptionsObject
    ): Highcharts.Axis {
        var chartOptions = this.options,
            isColorAxis = type === 'colorAxis',
            axisOptions = options.axis,
            redraw = options.redraw,
            animation = options.animation,
            userOptions = merge(axisOptions, {
                index: (this as any)[type].length,
                isX: type === 'xAxis'
            }),
            axis;

        if (isColorAxis) {
            axis = new H.ColorAxis(this, userOptions);

        } else {
            axis = new Axis(this, userOptions);
        }

        // Push the new axis options to the chart options
        (chartOptions as any)[type] = splat((chartOptions as any)[type] || {});
        (chartOptions as any)[type].push(userOptions);

        if (isColorAxis) {
            this.isDirtyLegend = true;

            // Clear before 'bindAxes' (#11924)
            this.axes.forEach(function (axis): void {
                axis.series = [];
            });

            this.series.forEach(function (series): void {
                series.bindAxes();
                series.isDirtyData = true;
            });
        }

        if (pick(redraw, true)) {
            this.redraw(animation);
        }

        return axis;
    }

    /**
     * Dim the chart and show a loading text or symbol. Options for the loading
     * screen are defined in {@link
     * https://api.highcharts.com/highcharts/loading|the loading options}.
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample highcharts/members/chart-showloading/
     *         Apply different text labels
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highstock
     *
     * @function Highcharts.Chart#showLoading
     *
     * @param {string} [str]
     *        An optional text to show in the loading label instead of the
     *        default one. The default text is set in
     *        [lang.loading](https://api.highcharts.com/highcharts/lang.loading).
     */
    public showLoading(str?: string): void {
        var chart = this,
            options = chart.options,
            loadingDiv = chart.loadingDiv,
            loadingOptions = options.loading,
            setLoadingSize = function (): void {
                if (loadingDiv) {
                    css(loadingDiv, {
                        left: chart.plotLeft + 'px',
                        top: chart.plotTop + 'px',
                        width: chart.plotWidth + 'px',
                        height: chart.plotHeight + 'px'
                    });
                }
            };

        // create the layer at the first call
        if (!loadingDiv) {
            chart.loadingDiv = loadingDiv = createElement('div', {
                className: 'highcharts-loading highcharts-loading-hidden'
            }, null as any, chart.container);

            chart.loadingSpan = createElement(
                'span',
                { className: 'highcharts-loading-inner' },
                null as any,
                loadingDiv
            );
            addEvent(chart, 'redraw', setLoadingSize); // #1080
        }

        loadingDiv.className = 'highcharts-loading';

        // Update text
        (chart.loadingSpan as any).innerHTML =
            pick(str, (options.lang as any).loading, '');

        if (!chart.styledMode) {
            // Update visuals
            css(loadingDiv, extend((loadingOptions as any).style, {
                zIndex: 10
            }));
            css((chart.loadingSpan as any), (loadingOptions as any).labelStyle);

            // Show it
            if (!chart.loadingShown) {
                css(loadingDiv, {
                    opacity: 0,
                    display: ''
                });
                animate(loadingDiv, {
                    opacity: (loadingOptions as any).style.opacity || 0.5
                }, {
                    duration: (loadingOptions as any).showDuration || 0
                });
            }
        }

        chart.loadingShown = true;
        setLoadingSize();
    }

    /**
     * Hide the loading layer.
     *
     * @see Highcharts.Chart#showLoading
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highstock
     *
     * @function Highcharts.Chart#hideLoading
     */
    public hideLoading(): void {

        var options = this.options,
            loadingDiv = this.loadingDiv;

        if (loadingDiv) {
            loadingDiv.className =
                'highcharts-loading highcharts-loading-hidden';

            if (!this.styledMode) {
                animate(loadingDiv, {
                    opacity: 0
                }, {
                    duration: (options.loading as any).hideDuration || 100,
                    complete: function (): void {
                        css(loadingDiv as any, { display: 'none' });
                    }
                });
            }
        }

        this.loadingShown = false;
    }

    /**
     * A generic function to update any element of the chart. Elements can be
     * enabled and disabled, moved, re-styled, re-formatted etc.
     *
     * A special case is configuration objects that take arrays, for example
     * [xAxis](https://api.highcharts.com/highcharts/xAxis),
     * [yAxis](https://api.highcharts.com/highcharts/yAxis) or
     * [series](https://api.highcharts.com/highcharts/series). For these
     * collections, an `id` option is used to map the new option set to an
     * existing object. If an existing object of the same id is not found, the
     * corresponding item is updated. So for example, running `chart.update`
     * with a series item without an id, will cause the existing chart's series
     * with the same index in the series array to be updated. When the
     * `oneToOne` parameter is true, `chart.update` will also take care of
     * adding and removing items from the collection. Read more under the
     * parameter description below.
     *
     * Note that when changing series data, `chart.update` may mutate the passed
     * data options.
     *
     * See also the
     * [responsive option set](https://api.highcharts.com/highcharts/responsive).
     * Switching between `responsive.rules` basically runs `chart.update` under
     * the hood.
     *
     * @sample highcharts/members/chart-update/
     *         Update chart geometry
     *
     * @function Highcharts.Chart#update
     *
     * @param {Highcharts.Options} options
     *        A configuration object for the new chart options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart.
     *
     * @param {boolean} [oneToOne=false]
     *        When `true`, the `series`, `xAxis`, `yAxis` and `annotations`
     *        collections will be updated one to one, and items will be either
     *        added or removed to match the new updated options. For example,
     *        if the chart has two series and we call `chart.update` with a
     *        configuration containing three series, one will be added. If we
     *        call `chart.update` with one series, one will be removed. Setting
     *        an empty `series` array will remove all series, but leaving out
     *        the`series` property will leave all series untouched. If the
     *        series have id's, the new series options will be matched by id,
     *        and the remaining ones removed.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation=true]
     *        Whether to apply animation, and optionally animation
     *        configuration.
     *
     * @fires Highcharts.Chart#event:update
     * @fires Highcharts.Chart#event:afterUpdate
     */
    public update(
        options: Highcharts.Options,
        redraw?: boolean,
        oneToOne?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        var chart = this,
            adders = {
                credits: 'addCredits',
                title: 'setTitle',
                subtitle: 'setSubtitle',
                caption: 'setCaption'
            } as Record<string, string>,
            optionsChart,
            updateAllAxes,
            updateAllSeries,
            newWidth,
            newHeight,
            runSetSize,
            isResponsiveOptions = options.isResponsiveOptions,
            itemsForRemoval = [] as Array<string>;

        fireEvent(chart, 'update', { options: options });

        // If there are responsive rules in action, undo the responsive rules
        // before we apply the updated options and replay the responsive rules
        // on top from the chart.redraw function (#9617).
        if (!isResponsiveOptions) {
            chart.setResponsive(false, true);
        }

        options = cleanRecursively(options, chart.options);

        merge(true, chart.userOptions, options);

        // If the top-level chart option is present, some special updates are
        // required
        optionsChart = options.chart;

        if (optionsChart) {

            merge(true, chart.options.chart, optionsChart);

            // Setter function
            if ('className' in optionsChart) {
                chart.setClassName(optionsChart.className);
            }

            if ('reflow' in optionsChart) {
                chart.setReflow(optionsChart.reflow);
            }

            if (
                'inverted' in optionsChart ||
                'polar' in optionsChart ||
                'type' in optionsChart
            ) {
                // Parse options.chart.inverted and options.chart.polar together
                // with the available series.
                chart.propFromSeries();
                updateAllAxes = true;
            }

            if ('alignTicks' in optionsChart) { // #6452
                updateAllAxes = true;
            }

            objectEach(optionsChart, function (val: any, key: string): void {
                if (
                    chart.propsRequireUpdateSeries.indexOf('chart.' + key) !==
                    -1
                ) {
                    updateAllSeries = true;
                }
                // Only dirty box
                if (chart.propsRequireDirtyBox.indexOf(key) !== -1) {
                    chart.isDirtyBox = true;
                }
                // Chart setSize
                if (
                    chart.propsRequireReflow.indexOf(key) !== -1
                ) {
                    if (isResponsiveOptions) {
                        chart.isDirtyBox = true;
                    } else {
                        runSetSize = true;
                    }
                }
            });

            if (!chart.styledMode && 'style' in optionsChart) {
                chart.renderer.setStyle(optionsChart.style as any);
            }
        }

        // Moved up, because tooltip needs updated plotOptions (#6218)
        if (!chart.styledMode && options.colors) {
            this.options.colors = options.colors;
        }

        if (options.time) {
            // Maintaining legacy global time. If the chart is instanciated
            // first with global time, then updated with time options, we need
            // to create a new Time instance to avoid mutating the global time
            // (#10536).
            if (this.time === time) {
                this.time = new Time(options.time);
            }

            // If we're updating, the time class is different from other chart
            // classes (chart.legend, chart.tooltip etc) in that it doesn't know
            // about the chart. The other chart[something].update functions also
            // set the chart.options[something]. For the time class however we
            // need to update the chart options separately. #14230.
            merge(true, chart.options.time, options.time);
        }

        // Some option stuctures correspond one-to-one to chart objects that
        // have update methods, for example
        // options.credits => chart.credits
        // options.legend => chart.legend
        // options.title => chart.title
        // options.tooltip => chart.tooltip
        // options.subtitle => chart.subtitle
        // options.mapNavigation => chart.mapNavigation
        // options.navigator => chart.navigator
        // options.scrollbar => chart.scrollbar
        objectEach(options, function (
            val: Record<string, any>,
            key: string
        ): void {
            if ((chart as any)[key] &&
                typeof (chart as any)[key].update === 'function'
            ) {
                (chart as any)[key].update(val, false);

            // If a one-to-one object does not exist, look for an adder function
            } else if (typeof (chart as any)[adders[key]] === 'function') {
                (chart as any)[adders[key]](val);

            // Else, just merge the options. For nodes like loading, noData,
            // plotOptions
            } else if (
                key !== 'color' &&
                chart.collectionsWithUpdate.indexOf(key) === -1
            ) {
                merge(true, (chart.options as any)[key], (options as any)[key]);
            }

            if (
                key !== 'chart' &&
                chart.propsRequireUpdateSeries.indexOf(key) !== -1
            ) {
                updateAllSeries = true;
            }
        });

        // Setters for collections. For axes and series, each item is referred
        // by an id. If the id is not found, it defaults to the corresponding
        // item in the collection, so setting one series without an id, will
        // update the first series in the chart. Setting two series without
        // an id will update the first and the second respectively (#6019)
        // chart.update and responsive.
        this.collectionsWithUpdate.forEach(function (coll: string): void {
            var indexMap: Array<number>;

            if ((options as any)[coll]) {

                // In stock charts, the navigator series are also part of the
                // chart.series array, but those series should not be handled
                // here (#8196).
                if (coll === 'series') {
                    indexMap = [];
                    chart[coll].forEach(function (s, i): void {
                        if (!s.options.isInternal) {
                            indexMap.push(pick(s.options.index, i));
                        }
                    });
                }

                splat((options as any)[coll]).forEach(function (newOptions, i): void {
                    const hasId = defined(newOptions.id);
                    let item: (Axis|LineSeries|Point|undefined);

                    // Match by id
                    if (hasId) {
                        item = chart.get(newOptions.id);
                    }

                    // No match by id found, match by index instead
                    if (!item) {
                        item = (chart as any)[coll][indexMap ? indexMap[i] : i];

                        // Check if we grabbed an item with an exising but
                        // different id (#13541)
                        if (item && hasId && defined(item.options.id)) {
                            item = void 0;
                        }
                    }

                    if (item && (item as any).coll === coll) {
                        item.update(newOptions, false);

                        if (oneToOne) {
                            item.touched = true;
                        }
                    }

                    // If oneToOne and no matching item is found, add one
                    if (!item && oneToOne && chart.collectionsWithInit[coll]) {
                        chart.collectionsWithInit[coll][0].apply(
                            chart,
                            // [newOptions, ...extraArguments, redraw=false]
                            [
                                newOptions
                            ].concat(
                                // Not all initializers require extra args
                                chart.collectionsWithInit[coll][1] || []
                            ).concat([
                                false
                            ])
                        ).touched = true;
                    }

                });

                // Add items for removal
                if (oneToOne) {
                    (chart as any)[coll].forEach(function (item: any): void {
                        if (!item.touched && !item.options.isInternal) {
                            itemsForRemoval.push(item);
                        } else {
                            delete item.touched;
                        }
                    });
                }


            }
        });

        itemsForRemoval.forEach(function (item: any): void {
            if (item.chart) { // #9097, avoid removing twice
                item.remove(false);
            }
        });

        if (updateAllAxes) {
            chart.axes.forEach(function (axis: Highcharts.Axis): void {
                axis.update({}, false);
            });
        }

        // Certain options require the whole series structure to be thrown away
        // and rebuilt
        if (updateAllSeries) {
            chart.getSeriesOrderByLinks().forEach(function (series): void {
                // Avoid removed navigator series
                if (series.chart) {
                    series.update({}, false);
                }
            }, this);
        }

        // Update size. Redraw is forced.
        newWidth = optionsChart && optionsChart.width;
        newHeight = optionsChart && optionsChart.height;
        if (isString(newHeight)) {
            newHeight = relativeLength(
                newHeight as string,
                (newWidth as string) || (chart.chartWidth as any)
            );
        }

        if (
            // In this case, run chart.setSize with newWidth and newHeight which
            // are undefined, only for reflowing chart elements because margin
            // or spacing has been set (#8190)
            runSetSize ||

            // In this case, the size is actually set
            (isNumber(newWidth) && newWidth !== chart.chartWidth) ||
            (isNumber(newHeight) && newHeight !== chart.chartHeight)
        ) {
            chart.setSize(newWidth as number, newHeight as number, animation);
        } else if (pick(redraw, true)) {
            chart.redraw(animation);
        }

        fireEvent(chart, 'afterUpdate', {
            options: options,
            redraw: redraw,
            animation: animation
        });

    }

    /**
     * Shortcut to set the subtitle options. This can also be done from {@link
     * Chart#update} or {@link Chart#setTitle}.
     *
     * @function Highcharts.Chart#setSubtitle
     *
     * @param {Highcharts.SubtitleOptions} options
     *        New subtitle options. The subtitle text itself is set by the
     *        `options.text` property.
     */
    public setSubtitle(
        options: Highcharts.SubtitleOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('subtitle', options);
        this.layOutTitles(redraw);
    }

    /**
     * Set the caption options. This can also be done from {@link
     * Chart#update}.
     *
     * @function Highcharts.Chart#setCaption
     *
     * @param {Highcharts.CaptionOptions} options
     *        New caption options. The caption text itself is set by the
     *        `options.text` property.
     */
    public setCaption(
        options: Highcharts.CaptionOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('caption', options);
        this.layOutTitles(redraw);
    }

}

/* *
 *
 *  Class Prototype Properties
 *
 * */

interface Chart extends ChartLike {
    callbacks: Array<Chart.CallbackFunction>;
    collectionsWithInit: Record<string, [Function, Array<any>?]>;
    collectionsWithUpdate: Array<string>;
    propsRequireDirtyBox: Array<string>;
    propsRequireReflow: Array<string>;
    propsRequireUpdateSeries: Array<string>;
}
extend(Chart.prototype, {
    // Hook for adding callbacks in modules
    callbacks: [],

    /**
     * These collections (arrays) implement `Chart.addSomethig` method used in
     * chart.update() to create new object in the collection. Equivalent for
     * deleting is resolved by simple `Somethig.remove()`.
     *
     * Note: We need to define these references after initializers are bound to
     * chart's prototype.
     */
    collectionsWithInit: {
        // collectionName: [ initializingMethod, [extraArguments] ]
        xAxis: [Chart.prototype.addAxis, [true]],
        yAxis: [Chart.prototype.addAxis, [false]],
        series: [Chart.prototype.addSeries]
    },

    /**
     * These collections (arrays) implement update() methods with support for
     * one-to-one option.
     */
    collectionsWithUpdate: [
        'xAxis',
        'yAxis',
        'zAxis',
        'series'
    ],

    /**
     * These properties cause isDirtyBox to be set to true when updating. Can be
     * extended from plugins.
     */
    propsRequireDirtyBox: [
        'backgroundColor',
        'borderColor',
        'borderWidth',
        'borderRadius',
        'plotBackgroundColor',
        'plotBackgroundImage',
        'plotBorderColor',
        'plotBorderWidth',
        'plotShadow',
        'shadow'
    ],

    /**
     * These properties require a full reflow of chart elements, best
     * implemented through running `Chart.setSize` internally (#8190).
     * @type {Array}
     */
    propsRequireReflow: [
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'spacing',
        'spacingTop',
        'spacingRight',
        'spacingBottom',
        'spacingLeft'
    ],

    /**
     * These properties cause all series to be updated when updating. Can be
     * extended from plugins.
     */
    propsRequireUpdateSeries: [
        'chart.inverted',
        'chart.polar',
        'chart.ignoreHiddenSeries',
        'chart.type',
        'colors',
        'plotOptions',
        'time',
        'tooltip'
    ]
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace Chart {

    export interface AfterUpdateEventObject {
        animation: (boolean|Partial<AnimationOptions>);
        options: Highcharts.Options;
        redraw: boolean;
    }

    export interface CallbackFunction {
        (this: Chart, chart: Chart): void;
    }

    export interface CreateAxisOptionsObject {
        animation: undefined | boolean | Partial<AnimationOptions>;
        axis: Highcharts.AxisOptions | ColorAxis.Options;
        redraw: undefined | boolean;
    }

    export interface LabelCollectorFunction {
        (): (Array<(SVGElement|undefined)>|undefined);
    }

    export interface Renderer extends SVGRenderer {
        plotBox: BBoxObject;
        spacingBox: BBoxObject;
    }

}

/* *
 *
 *  Compatibility
 *
 * */

function chart(
    options: Partial<Highcharts.Options>,
    callback?: Chart.CallbackFunction
): Chart;
function chart(
    renderTo: (string|globalThis.HTMLElement),
    options: Partial<Highcharts.Options>,
    callback?: Chart.CallbackFunction
): Chart;
/**
 * Factory function for basic charts.
 *
 * @example
 * // Render a chart in to div#container
 * var chart = Highcharts.chart('container', {
 *     title: {
 *         text: 'My chart'
 *     },
 *     series: [{
 *         data: [1, 3, 2, 4]
 *     }]
 * });
 *
 * @function Highcharts.chart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure.
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        Function to run when the chart has loaded and and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 *
 * @return {Highcharts.Chart}
 *         Returns the Chart object.
 */
function chart(
    a: (string|globalThis.HTMLElement|Partial<Highcharts.Options>),
    b?: (Chart.CallbackFunction|Partial<Highcharts.Options>),
    c?: Chart.CallbackFunction
): Chart {
    return new Chart(a as any, b as any, c);
}
H.chart = chart;
H.Chart = Chart;

/* *
 *
 *  Export
 *
 * */

export default Chart;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Callback for chart constructors.
 *
 * @callback Highcharts.ChartCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        Created chart.
 */

/**
 * Format a number and return a string based on input settings.
 *
 * @callback Highcharts.NumberFormatterCallbackFunction
 *
 * @param {number} number
 *        The input number to format.
 *
 * @param {number} decimals
 *        The amount of decimals. A value of -1 preserves the amount in the
 *        input number.
 *
 * @param {string} [decimalPoint]
 *        The decimal point, defaults to the one given in the lang options, or
 *        a dot.
 *
 * @param {string} [thousandsSep]
 *        The thousands separator, defaults to the one given in the lang
 *        options, or a space character.
 *
 * @return {string} The formatted number.
 */

/**
 * The chart title. The title has an `update` method that allows modifying the
 * options directly or indirectly via `chart.update`.
 *
 * @interface Highcharts.TitleObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the title.
 *
 * @function Highcharts.TitleObject#update
 *
 * @param {Highcharts.TitleOptions} titleOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the title is altered. If doing more
 *        operations on the chart, it is a good idea to set redraw to false and
 *        call {@link Chart#redraw} after.
 */

/**
 * The chart subtitle. The subtitle has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.SubtitleObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the subtitle.
 *
 * @function Highcharts.SubtitleObject#update
 *
 * @param {Highcharts.SubtitleOptions} subtitleOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the subtitle is altered. If doing
 *        more operations on the chart, it is a good idea to set redraw to false
 *        and call {@link Chart#redraw} after.
 */

/**
 * The chart caption. The caption has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.CaptionObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the caption.
 *
 * @function Highcharts.CaptionObject#update
 *
 * @param {Highcharts.CaptionOptions} captionOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the caption is altered. If doing
 *        more operations on the chart, it is a good idea to set redraw to false
 *        and call {@link Chart#redraw} after.
 */

''; // include doclets above in transpilat
