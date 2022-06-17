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

import type {
    BoostChartComposition
} from './BoostChart';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';
import type LineSeries from '../../Series/Line/LineSeries';
import type Point from '../../Core/Series/Point';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type Series from '../../Core/Series/Series';
import type {
    SeriesTypePlotOptions
} from '../../Core/Series/SeriesType';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';

import BoostableMap from './BoostableMap.js';
import Boostables from './Boostables.js';
import BU from './BoostUtils.js';
const {
    boostEnabled
} = BU;
import DefaultOptions from '../../Core/DefaultOptions.js';
const {
    getOptions
} = DefaultOptions;
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    error,
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

export declare class BoostSeriesComposition extends Series {
    boost: BoostSeriesAdditions;
    boosted?: boolean;
    chart: BoostChartComposition;
}

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        boost?: BoostSeriesAdditions;
        boosted?: boolean;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        boostData?: Array<unknown>;
        xData?: Array<number>;
    }
}

/* *
 *
 *  Constants
 *
 * */

const composedClasses: Array<Function> = [];

/* *
 *
 *  Functions
 *
 * */

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
 * @private
 */
function onSeriesInit(
    this: Series
): void {
    // @todo limit compose to supported series classes
    if (!this.boost && Boostables.indexOf(this.type) >= 0) {
        this.boost = new BoostSeriesAdditions(this as BoostSeriesComposition);
    }
}

/**
 * Override a bunch of methods the same way. If the number of points is
 * below the threshold, run the original method. If not, check for a
 * canvas version or do nothing.
 *
 * Note that we're not overriding any of these for heatmaps.
 */
function seriesFunctionsWrapper(
    this: Series, // = prototype
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

    wrap(this, method, branch);

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
 * Do not compute extremes when min and max are set. If we use this in the
 * core, we can add the hook to hasExtremes to the methods directly.
 * @private
 */
function wrapSeriesGetExtremes(
    this: Series,
    proceed: Function
): DataExtremesObject {
    if (
        this.boost &&
        this.boosted &&
        this.boost.hasExtremes()
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
            series.chart.boost.isChartSeriesBoosting() ||
            (
                (data ? data.length : 0) >=
                (series.options.boostThreshold || Number.MAX_VALUE)
            )
        );
    };

    if (boostEnabled(this.chart) && BoostableMap[this.type] && this.boost) {
        const series = this as BoostSeriesComposition,
            boost = series.boost;

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
            !series.boost.hasExtremes(true)
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
            boost.enterBoost();
        } else {
            boost.exitBoost();
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

    if (this.boost) {
        return this.boost.getPoint(result);
    }

    return result;
}

/* *
 *
 *  Class
 *
 * */

class BoostSeriesAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /**
     * @private
     */
    public static compose<T extends typeof Series>(
        SeriesClass: T
    ): (T&typeof BoostSeriesComposition) {
        const PointClass = SeriesClass.prototype.pointClass;

        if (composedClasses.indexOf(PointClass) === -1) {
            composedClasses.push(PointClass);

            wrap(PointClass.prototype, 'haloPath', wrapPointHaloPath);
        }

        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            addEvent(SeriesClass, 'destroy', onSeriesDestroy);
            addEvent(SeriesClass, 'init', onSeriesInit);

            const seriesProto = SeriesClass.prototype;

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
            ).forEach(seriesFunctionsWrapper, seriesProto);
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

        return SeriesClass as (T&typeof BoostSeriesComposition);
    }

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        series: BoostSeriesComposition
    ) {
        this.series = series;
    }

    /* *
     *
     *  Properties
     *
     * */

    public alteredByBoost?: Array<BoostAlteredObject>;

    private series: BoostSeriesComposition;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * If implemented in the core, parts of this can probably be
     * shared with other similar methods in Highcharts.
     * @private
     * @function Highcharts.Series#destroyGraphics
     */
    public destroyGraphics(): void {
        const series = this.series,
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

        const zonesSeries = series as LineSeries;

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
    public enterBoost(): void {
        const alteredByBoost = this.alteredByBoost =
                [] as Array<BoostAlteredObject>,
            series = this.series;

        // Save the original values, including whether it was an own
        // property or inherited from the prototype.
        (
            ['allowDG', 'directTouch', 'stickyTracking'] as
            Array<('allowDG'|'directTouch'|'stickyTracking')>
        ).forEach((prop): void => {
            alteredByBoost.push({
                prop: prop,
                val: series[prop],
                own: Object.hasOwnProperty.call(series, prop)
            });
        });

        series.allowDG = false;
        series.directTouch = false;
        series.stickyTracking = true;

        // Prevent animation when zooming in on boosted series(#13421).
        series.finishedAnimating = true;

        // Hide series label if any
        if (series.labelBySeries) {
            series.labelBySeries = series.labelBySeries.destroy();
        }
    }

    /**
     * Exit from boost mode and restore non-boost properties.
     * @private
     * @function Highcharts.Series#exitBoost
     */
    public exitBoost(): void {
        const series = this.series;

        // Reset instance properties and/or delete instance properties and
        // go back to prototype
        (this.alteredByBoost || []).forEach((setting): void => {
            if (setting.own) {
                series[setting.prop] = setting.val as any;
            } else {
                // Revert to prototype
                delete series[setting.prop];
            }
        });

        // Clear previous run
        if (series.boostClear) {
            series.boostClear();
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
    public getPoint(
        boostPoint?: (Record<string, number>|Point)
    ): (Point|undefined) {
        const series = this.series,
            seriesOptions = series.options,
            xAxis = series.xAxis,
            PointClass = series.pointClass;

        if (!boostPoint || boostPoint instanceof PointClass) {
            return boostPoint;
        }

        const xData = (
                series.xData ||
                seriesOptions.xData ||
                series.processedXData ||
                false
            ),
            point = (new PointClass()).init(
                series,
                (series.options.data as any)[boostPoint.i as any],
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
        point.isInside = series.isPointInside(boostPoint);

        return point;
    }

    /**
     * @private
     * @function Highcharts.Series#hasExtremes
     */
    public hasExtremes(checkX?: boolean): boolean {
        const series = this.series,
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

}

/* *
 *
 *  Default Export
 *
 * */

export default BoostSeriesAdditions;
