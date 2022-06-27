/* *
 *
 *  Copyright (c) 2019-2021 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
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

import type { BoostChartComposition } from './BoostChart';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import type Point from '../../Core/Series/Point';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type Series from '../../Core/Series/Series';
import type SeriesRegistry from '../../Core/Series/SeriesRegistry';
import type { SeriesTypePlotOptions } from '../../Core/Series/SeriesType';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type WGLRenderer from './WGLRenderer';

import createAndAttachRenderer from './BoostAttach.js';
import BoostableMap from './BoostableMap.js';
import Boostables from './Boostables.js';
import BU from './BoostUtils.js';
const {
    allocateIfNotSeriesBoosting,
    boostEnabled,
    eachAsync,
    renderIfNotSeriesBoosting
} = BU;
import DefaultOptions from '../../Core/DefaultOptions.js';
const { getOptions } = DefaultOptions;
import H from '../../Core/Globals.js';
const { noop } = H;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    error,
    extend,
    fireEvent,
    isArray,
    isNumber,
    pick,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare interface BoostAlteredObject {
    own: boolean;
    prop: ('allowDG'|'directTouch'|'stickyTracking');
    val: unknown;
    value?: unknown;
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        boosted?: boolean;
        fill?: boolean;
        fillOpacity?: boolean;
        sampling?: boolean;
        /** @requires modules/boost */
        destroyGraphics(): void;
        /** @requires modules/boost */
        getPoint(
            boostPoint?: (Point|Record<string, number>)
        ): (BoostPointComposition|undefined);
        /** @requires modules/boost */
        hasExtremes(checkX?: boolean): boolean;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        boostData?: Array<unknown>;
        xData?: Array<number>;
    }
}

export declare class BoostPointComposition extends Point {
    series: BoostSeriesComposition;
    init(
        series: Series,
        options: (PointOptions|PointShortOptions),
        x?: number
    ): BoostPointComposition;
}

export declare class BoostSeriesComposition extends Series {
    alteredByBoost?: Array<BoostAlteredObject>;
    boosted?: boolean;
    chart: BoostChartComposition;
    pointClass: typeof BoostPointComposition;
    destroyGraphics(): void;
    enterBoost(): void;
    exitBoost(): void;
    getPoint(
        boostPoint?: (Point|Record<string, number>)
    ): (BoostPointComposition|undefined);
    hasExtremes(checkX?: boolean): boolean;
}

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Variables
 *
 * */

let index: (number|string);

/* *
 *
 *  Functions
 *
 * */

/**
 * @private
 */
function compose<T extends typeof Series>(
    SeriesClass: T,
    seriesTypes: typeof SeriesRegistry.seriesTypes,
    wglMode?: boolean
): (T&typeof BoostSeriesComposition) {
    const PointClass = SeriesClass.prototype.pointClass;

    if (composedClasses.indexOf(PointClass) === -1) {
        composedClasses.push(PointClass);

        wrap(PointClass.prototype, 'haloPath', wrapPointHaloPath);
    }

    if (composedClasses.indexOf(SeriesClass) === -1) {
        composedClasses.push(SeriesClass);

        addEvent(SeriesClass, 'destroy', onSeriesDestroy);

        const seriesProto = SeriesClass.prototype as BoostSeriesComposition;

        seriesProto.destroyGraphics = seriesDestroyGraphics;
        seriesProto.enterBoost = seriesEnterBoost;
        seriesProto.exitBoost = seriesExitBoost;
        seriesProto.getPoint = seriesGetPoint;
        seriesProto.hasExtremes = seriesHasExtremes;

        if (wglMode) {
            seriesProto.renderCanvas = seriesRenderCanvas;
        }

        wrap(seriesProto, 'getExtremes', wrapSeriesGetExtremes);
        wrap(seriesProto, 'markerAttribs', wrapSeriesMarkerAttribs);
        wrap(seriesProto, 'processData', wrapSeriesProcessData);
        wrap(seriesProto, 'searchPoint', wrapSeriesSearchPoint);

        (
            [
                'translate',
                'generatePoints',
                'drawTracker',
                'drawPoints',
                'render'
            ] as Array<(
                'translate'|
                'generatePoints'|
                'drawTracker'|
                'drawPoints'|
                'render'
            )>
        ).forEach((method): void =>
            wrapSeriesFunctions(seriesProto, seriesTypes, method)
        );
    }

    if (composedClasses.indexOf(getOptions) === -1) {
        composedClasses.push(getOptions);

        const plotOptions =
            getOptions().plotOptions as SeriesTypePlotOptions;

        // Set default options
        Boostables.forEach((type: string): void => {
            const typePlotOptions = plotOptions[type];
            if (typePlotOptions) {
                typePlotOptions.boostThreshold = 5000;
                typePlotOptions.boostData = [];
                seriesTypes[type].prototype.fillOpacity = true;
            }
        });
    }

    if (wglMode) {
        const {
            area: AreaSeries,
            areaspline: AreaSplineSeries,
            bubble: BubbleSeries,
            column: ColumnSeries,
            heatmap: HeatmapSeries,
            scatter: ScatterSeries,
            treemap: TreemapSeries
        } = seriesTypes;

        if (
            AreaSeries &&
            composedClasses.indexOf(AreaSeries) === -1
        ) {
            composedClasses.push(AreaSeries);
            extend(AreaSeries.prototype, {
                fill: true,
                fillOpacity: true,
                sampling: true
            });
        }

        if (
            AreaSplineSeries &&
            composedClasses.indexOf(AreaSplineSeries) === -1
        ) {
            composedClasses.push(AreaSplineSeries);
            extend(AreaSplineSeries.prototype, {
                fill: true,
                fillOpacity: true,
                sampling: true
            });
        }

        if (
            BubbleSeries &&
            composedClasses.indexOf(BubbleSeries) === -1
        ) {
            composedClasses.push(BubbleSeries);

            const bubbleProto = BubbleSeries.prototype as
                Partial<typeof BubbleSeries.prototype>;

            // By default, the bubble series does not use the KD-tree, so force
            // it to.
            delete bubbleProto.buildKDTree;
            // seriesTypes.bubble.prototype.directTouch = false;

            // Needed for markers to work correctly
            wrap(
                bubbleProto,
                'markerAttribs',
                function (
                    this: typeof bubbleProto,
                    proceed: Function
                ): boolean {
                    if (this.boosted) {
                        return false;
                    }
                    return proceed.apply(this, [].slice.call(arguments, 1));
                }
            );
        }

        if (
            ColumnSeries &&
            composedClasses.indexOf(ColumnSeries) === -1
        ) {
            composedClasses.push(ColumnSeries);
            extend(ColumnSeries.prototype, {
                fill: true,
                sampling: true
            });
        }

        if (
            ScatterSeries &&
            composedClasses.indexOf(ScatterSeries) === -1
        ) {
            composedClasses.push(ScatterSeries);
            ScatterSeries.prototype.fill = true;
        }

        // We need to handle heatmaps separatly, since we can't perform the
        // size/color calculations in the shader easily.
        // @todo This likely needs future optimization.
        [HeatmapSeries, TreemapSeries].forEach((SC): void => {
            if (SC && composedClasses.indexOf(SC) === -1) {
                composedClasses.push(SC);
                wrap(SC.prototype, 'drawPoints', BU.pointDrawHandler);
            }
        });
    }

    return SeriesClass as (T&typeof BoostSeriesComposition);
}

/**
 * Extend series.destroy to also remove the fake k-d-tree points (#5137).
 * Normally this is handled by Series.destroy that calls Point.destroy,
 * but the fake search points are not registered like that.
 * @private
 */
function onSeriesDestroy(
    this: Series
): void {
    const series = this,
        chart = series.chart;

    if (chart.markerGroup === series.markerGroup) {
        series.markerGroup = null as any;
    }

    if (chart.hoverPoints) {
        chart.hoverPoints = chart.hoverPoints.filter(function (
            point: Point
        ): boolean {
            return point.series === series;
        });
    }

    if (chart.hoverPoint && chart.hoverPoint.series === series) {
        chart.hoverPoint = null as any;
    }
}

/**
 * If implemented in the core, parts of this can probably be
 * shared with other similar methods in Highcharts.
 * @private
 * @function Highcharts.Series#destroyGraphics
 */
function seriesDestroyGraphics(
    this: BoostSeriesComposition
): void {
    const series = this,
        points = series.points;

    if (points) {
        let point: Point,
            i: number;

        for (i = 0; i < points.length; i = i + 1) {
            point = points[i];
            if (point && point.destroyElements) {
                point.destroyElements(); // #7557
            }
        }
    }

    (
        ['graph', 'area', 'tracker'] as
        Array<('graph'|'area'|'tracker')>
    ).forEach((prop): void => {
        const seriesProp = series[prop];
        if (seriesProp) {
            series[prop] = seriesProp.destroy();
        }
    });

    const zonesSeries = series as (BoostSeriesComposition&LineSeries);

    if (zonesSeries.getZonesGraphs) {
        const props = zonesSeries.getZonesGraphs(
            [['graph', 'highcharts-graph']]
        ) as Array<[keyof LineSeries]>;
        props.forEach((prop): void => {
            const zoneGraph: SVGElement = zonesSeries[prop[0]];
            if (zoneGraph) {
                (zonesSeries as any)[prop[0]] = zoneGraph.destroy();
            }
        });
    }
}

/**
 * Enter boost mode and apply boost-specific properties.
 * @private
 * @function Highcharts.Series#enterBoost
 */
function seriesEnterBoost(
    this: BoostSeriesComposition
): void {
    const alteredByBoost = this.alteredByBoost =
        [] as Array<BoostAlteredObject>;

    // Save the original values, including whether it was an own
    // property or inherited from the prototype.
    (
        ['allowDG', 'directTouch', 'stickyTracking'] as
        Array<('allowDG'|'directTouch'|'stickyTracking')>
    ).forEach((prop): void => {
        alteredByBoost.push({
            prop: prop,
            val: this[prop],
            own: Object.hasOwnProperty.call(this, prop)
        });
    });

    this.allowDG = false;
    this.directTouch = false;
    this.stickyTracking = true;

    // Prevent animation when zooming in on boosted series(#13421).
    this.finishedAnimating = true;

    // Hide series label if any
    if (this.labelBySeries) {
        this.labelBySeries = this.labelBySeries.destroy();
    }
}

/**
 * Exit from boost mode and restore non-boost properties.
 * @private
 * @function Highcharts.Series#exitBoost
 */
function seriesExitBoost(
    this: BoostSeriesComposition
): void {

    // Reset instance properties and/or delete instance properties and
    // go back to prototype
    (this.alteredByBoost || []).forEach((setting): void => {
        if (setting.own) {
            this[setting.prop] = setting.val as any;
        } else {
            // Revert to prototype
            delete this[setting.prop];
        }
    });

    // Clear previous run
    if (this.boostClear) {
        this.boostClear();
    }

}

/**
 * Return a full Point object based on the index.
 * The boost module uses stripped point objects for performance reasons.
 * @private
 * @function Highcharts.Series#getPoint
 *
 * @param {object|Highcharts.Point} boostPoint
 *        A stripped-down point object
 *
 * @return {Highcharts.Point}
 *         A Point object as per https://api.highcharts.com/highcharts#Point
 */
function seriesGetPoint(
    this: BoostSeriesComposition,
    boostPoint?: (Point&Record<string, number>)
): (BoostPointComposition|undefined) {
    const seriesOptions = this.options,
        xAxis = this.xAxis,
        PointClass = this.pointClass;

    if (!boostPoint || boostPoint instanceof PointClass) {
        return boostPoint;
    }

    const xData = (
            this.xData ||
            seriesOptions.xData ||
            this.processedXData ||
            false
        ),
        point = (new PointClass()).init(
            this,
            (this.options.data as any)[boostPoint.i as any],
            xData ? xData[boostPoint.i as any] : void 0
        );

    point.category = pick(
        xAxis.categories ?
            xAxis.categories[point.x] :
            point.x, // @todo simplify
        point.x
    );

    point.dist = boostPoint.dist;
    point.distX = boostPoint.distX;
    point.plotX = boostPoint.plotX;
    point.plotY = boostPoint.plotY;
    point.index = boostPoint.i;
    point.isInside = this.isPointInside(boostPoint);

    return point;
}

/**
 * @private
 * @function Highcharts.Series#hasExtremes
 */
function seriesHasExtremes(
    this: BoostSeriesComposition,
    checkX?: boolean
): boolean {
    const series = this,
        options = series.options,
        data: Array<(PointOptions|PointShortOptions)> = options.data as any,
        xAxis = series.xAxis && series.xAxis.options,
        yAxis = series.yAxis && series.yAxis.options,
        colorAxis = series.colorAxis && series.colorAxis.options;

    return data.length > (options.boostThreshold || Number.MAX_VALUE) &&
            // Defined yAxis extremes
            isNumber(yAxis.min) &&
            isNumber(yAxis.max) &&
            // Defined (and required) xAxis extremes
            (!checkX ||
                (isNumber(xAxis.min) && isNumber(xAxis.max))
            ) &&
            // Defined (e.g. heatmap) colorAxis extremes
            (!colorAxis ||
                (isNumber(colorAxis.min) && isNumber(colorAxis.max))
            );
}

/**
 * For inverted series, we need to swap X-Y values before running base
 * methods.
 * @private
 */
function wrapPointHaloPath(
    this: Point,
    proceed: Function
): SVGPath {
    const point = this,
        series = point.series,
        chart = series.chart,
        plotX: number = point.plotX || 0,
        plotY: number = point.plotY || 0,
        inverted = chart.inverted;

    if (series.boosted && inverted) {
        point.plotX = series.yAxis.len - plotY;
        point.plotY = series.xAxis.len - plotX;
    }

    const halo: SVGPath =
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    if (series.boosted && inverted) {
        point.plotX = plotX;
        point.plotY = plotY;
    }

    return halo;
}

/**
 * @private
 * @function Highcharts.Series#renderCanvas
 */
function seriesRenderCanvas(this: Series): void {
    let series = this,
        options = series.options || {},
        renderer: WGLRenderer = false as any,
        chart = series.chart,
        xAxis = this.xAxis,
        yAxis = this.yAxis,
        xData = (options as any).xData || series.processedXData,
        yData = (options as any).yData || series.processedYData,
        rawData = options.data,
        xExtremes = xAxis.getExtremes(),
        xMin = xExtremes.min,
        xMax = xExtremes.max,
        yExtremes = yAxis.getExtremes(),
        yMin = yExtremes.min,
        yMax = yExtremes.max,
        pointTaken: Record<string, boolean> = {},
        lastClientX: (number|undefined),
        sampling = !!series.sampling,
        points: Array<Record<string, number>>,
        enableMouseTracking = options.enableMouseTracking !== false,
        threshold: number = options.threshold as any,
        yBottom = yAxis.getThreshold(threshold),
        isRange = series.pointArrayMap &&
            series.pointArrayMap.join(',') === 'low,high',
        isStacked = !!options.stacking,
        cropStart = series.cropStart || 0,
        requireSorting = series.requireSorting,
        useRaw = !xData,
        minVal: (number|undefined),
        maxVal: (number|undefined),
        minI: (number|undefined),
        maxI: (number|undefined),
        compareX = options.findNearestPointBy === 'x',

        xDataFull = (
            this.xData ||
            (this.options as any).xData ||
            this.processedXData ||
            false
        ),

        addKDPoint = function (
            clientX: number,
            plotY: number,
            i: number
        ): void {

            // We need to do ceil on the clientX to make things
            // snap to pixel values. The renderer will frequently
            // draw stuff on "sub-pixels".
            clientX = Math.ceil(clientX);

            // Shaves off about 60ms compared to repeated concatenation
            index = compareX ? clientX : clientX + ',' + plotY;

            // The k-d tree requires series points.
            // Reduce the amount of points, since the time to build the
            // tree increases exponentially.
            if (enableMouseTracking && !pointTaken[index]) {
                pointTaken[index] = true;

                if (chart.inverted) {
                    clientX = xAxis.len - clientX;
                    plotY = yAxis.len - plotY;
                }

                points.push({
                    x: xDataFull ? xDataFull[cropStart + i] : false,
                    clientX: clientX,
                    plotX: clientX,
                    plotY: plotY,
                    i: cropStart + i
                });
            }
        };

    // Get or create the renderer
    renderer = createAndAttachRenderer(chart, series);

    chart.boosted = true;

    const boostOptions = renderer.settings;

    if (!this.visible) {
        return;
    }

    // If we are zooming out from SVG mode, destroy the graphics
    if (this.points || this.graph) {
        this.destroyGraphics();
    }

    // If we're rendering per. series we should create the marker groups
    // as usual.
    if (!chart.isChartSeriesBoosting()) {
        // If all series were boosting, but are not anymore
        // restore private markerGroup
        if (this.markerGroup === chart.markerGroup) {
            this.markerGroup = void 0;
        }

        this.markerGroup = series.plotGroup(
            'markerGroup',
            'markers',
            true as any,
            1,
            chart.seriesGroup
        );
    } else {
        // If series has a private markeGroup, remove that
        // and use common markerGroup
        if (
            this.markerGroup &&
            this.markerGroup !== chart.markerGroup
        ) {
            this.markerGroup.destroy();
        }
        // Use a single group for the markers
        this.markerGroup = chart.markerGroup;

        // When switching from chart boosting mode, destroy redundant
        // series boosting targets
        if (this.renderTarget) {
            this.renderTarget = this.renderTarget.destroy();
        }
    }

    points = this.points = [];

    // Do not start building while drawing
    series.buildKDTree = noop;

    if (renderer) {
        allocateIfNotSeriesBoosting(renderer, this);
        renderer.pushSeries(series);
        // Perform the actual renderer if we're on series level
        renderIfNotSeriesBoosting(renderer, this, chart);
    }

    /**
     * This builds the KD-tree
     * @private
     */
    function processPoint(
        d: (number|Array<number>|Record<string, number>),
        i: number
    ): boolean {
        let x: number,
            y: number,
            clientX,
            plotY,
            isNull,
            low: number = false as any,
            chartDestroyed = typeof chart.index === 'undefined',
            isYInside = true;

        if (typeof d === 'undefined') {
            return true;
        }

        if (!chartDestroyed) {
            if (useRaw) {
                x = (d as any)[0];
                y = (d as any)[1];
            } else {
                x = d as any;
                y = yData[i];
            }

            // Resolve low and high for range series
            if (isRange) {
                if (useRaw) {
                    y = (d as any).slice(1, 3);
                }
                low = (y as any)[0];
                y = (y as any)[1];
            } else if (isStacked) {
                x = (d as any).x;
                y = (d as any).stackY;
                low = y - (d as any).y;
            }

            isNull = y === null;

            // Optimize for scatter zooming
            if (!requireSorting) {
                isYInside = y >= yMin && y <= yMax;
            }

            if (!isNull && x >= xMin && x <= xMax && isYInside) {

                clientX = xAxis.toPixels(x, true);

                if (sampling) {
                    if (
                        typeof minI === 'undefined' ||
                        clientX === lastClientX
                    ) {
                        if (!isRange) {
                            low = y;
                        }
                        if (
                            typeof maxI === 'undefined' ||
                            y > (maxVal as any)
                        ) {
                            maxVal = y;
                            maxI = i;
                        }
                        if (
                            typeof minI === 'undefined' ||
                            low < (minVal as any)
                        ) {
                            minVal = low;
                            minI = i;
                        }

                    }
                    // Add points and reset
                    if (!compareX || clientX !== lastClientX) {
                        // maxI is number too:
                        if (typeof minI !== 'undefined') {
                            plotY =
                                yAxis.toPixels(maxVal as any, true);
                            yBottom =
                                yAxis.toPixels(minVal as any, true);

                            addKDPoint(clientX, plotY, maxI as any);
                            if (yBottom !== plotY) {
                                addKDPoint(clientX, yBottom, minI);
                            }
                        }

                        minI = maxI = void 0;
                        lastClientX = clientX;
                    }
                } else {
                    plotY = Math.ceil(yAxis.toPixels(y, true));
                    addKDPoint(clientX, plotY, i);
                }
            }
        }

        return !chartDestroyed;
    }

    /**
     * @private
     */
    function doneProcessing(): void {
        fireEvent(series, 'renderedCanvas');

        // Go back to prototype, ready to build
        delete (series as Partial<typeof series>).buildKDTree;
        series.buildKDTree();

        if (boostOptions.debug.timeKDTree) {
            console.timeEnd('kd tree building'); // eslint-disable-line no-console
        }
    }

    // Loop over the points to build the k-d tree - skip this if
    // exporting
    if (!chart.renderer.forExport) {
        if (boostOptions.debug.timeKDTree) {
            console.time('kd tree building'); // eslint-disable-line no-console
        }

        eachAsync(
            isStacked ? series.data : (xData || rawData),
            processPoint,
            doneProcessing
        );
    }
}

/**
 * Override a bunch of methods the same way. If the number of points is
 * below the threshold, run the original method. If not, check for a
 * canvas version or do nothing.
 *
 * Note that we're not overriding any of these for heatmaps.
 */
function wrapSeriesFunctions(
    seriesProto: Series,
    seriesTypes: typeof SeriesRegistry.seriesTypes,
    method: (
        'translate'|
        'generatePoints'|
        'drawTracker'|
        'drawPoints'|
        'render'
    )
): void {
    /**
     * @private
     */
    function branch(
        this: Series,
        proceed: Function
    ): void {
        const letItPass = this.options.stacking &&
            (method === 'translate' || method === 'generatePoints');

        if (
            !this.boosted ||
            letItPass ||
            !boostEnabled(this.chart) ||
            this.type === 'heatmap' ||
            this.type === 'treemap' ||
            !BoostableMap[this.type] ||
            this.options.boostThreshold === 0
        ) {

            proceed.call(this);

        // Run canvas version of method, like renderCanvas(), if it exists
        } else if (method === 'render' && this.renderCanvas) {
            this.renderCanvas();
        }
    }

    wrap(seriesProto, method, branch);

    // Special case for some types, when translate method is already wrapped
    if (method === 'translate') {
        [
            'column',
            'bar',
            'arearange',
            'columnrange',
            'heatmap',
            'treemap'
        ].forEach(function (type: string): void {
            if (seriesTypes[type]) {
                wrap(seriesTypes[type].prototype, method, branch);
            }
        });
    }
}

/**
 * Do not compute extremes when min and max are set. If we use this in the
 * core, we can add the hook to hasExtremes to the methods directly.
 * @private
 */
function wrapSeriesGetExtremes(
    this: Series,
    proceed: Function
): DataExtremesObject {
    if (
        this.boosted &&
        this.hasExtremes()
    ) {
        return {};
    }
    return proceed.apply(this, Array.prototype.slice.call(arguments, 1));
}

/**
 * @private
 */
function wrapSeriesMarkerAttribs(
    this: Series,
    proceed: Function,
    point: Point
): SVGAttributes {
    const series = this,
        chart = series.chart,
        plotX: number = point.plotX || 0,
        plotY: number = point.plotY || 0,
        inverted = chart.inverted;

    if (series.boosted && inverted) {
        point.plotX = series.yAxis.len - plotY;
        point.plotY = series.xAxis.len - plotX;
    }

    const attribs: SVGAttributes =
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));

    if (series.boosted && inverted) {
        point.plotX = plotX;
        point.plotY = plotY;
    }

    return attribs;
}

/**
 * If the series is a heatmap or treemap, or if the series is not boosting
 * do the default behaviour. Otherwise, process if the series has no
 * extremes.
 * @private
 */
function wrapSeriesProcessData(
    this: Series,
    proceed: Function
): void {
    let dataToMeasure = this.options.data;

    /**
     * Used twice in this function, first on this.options.data, the second
     * time it runs the check again after processedXData is built.
     * If the data is going to be grouped, the series shouldn't be boosted.
     * @private
     */
    const getSeriesBoosting = (
        data?: Array<(PointOptions|PointShortOptions)>
    ): boolean => {
        const series = this as BoostSeriesComposition;

        // Check if will be grouped.
        if (series.forceCrop) {
            return false;
        }
        return (
            series.chart.isChartSeriesBoosting() ||
            (
                (data ? data.length : 0) >=
                (series.options.boostThreshold || Number.MAX_VALUE)
            )
        );
    };

    if (boostEnabled(this.chart) && BoostableMap[this.type]) {
        const series = this as BoostSeriesComposition;

        // If there are no extremes given in the options, we also need to
        // process the data to read the data extremes. If this is a heatmap,
        // do default behaviour.
        if (
            // First pass with options.data:
            !getSeriesBoosting(dataToMeasure) ||
            series.type === 'heatmap' ||
            series.type === 'treemap' ||
            // processedYData for the stack (#7481):
            series.options.stacking ||
            !series.hasExtremes(true)
        ) {
            proceed.apply(series, Array.prototype.slice.call(arguments, 1));
            dataToMeasure = series.processedXData;
        }

        // Set the isBoosting flag, second pass with processedXData to
        // see if we have zoomed.
        series.boosted = getSeriesBoosting(dataToMeasure);

        // Enter or exit boost mode
        if (series.boosted) {
            // Force turbo-mode:
            let firstPoint;
            if (
                series.options.data &&
                series.options.data.length
            ) {
                firstPoint = series.getFirstValidPoint(
                    series.options.data
                );
                if (!isNumber(firstPoint) && !isArray(firstPoint)) {
                    error(12, false, series.chart);
                }
            }
            series.enterBoost();
        } else {
            series.exitBoost();
        }
    // The series type is not boostable
    } else {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
}

/**
 * Return a point instance from the k-d-tree
 * @private
 */
function wrapSeriesSearchPoint(
    this: Series,
    proceed: Function
): (Point|undefined) {
    const result = proceed.apply(this, [].slice.call(arguments, 1));

    if (this) {
        return this.getPoint(result);
    }

    return result;
}

/* *
 *
 *  Default Export
 *
 * */

const BoostSeries = {
    compose
};

export default BoostSeries;
