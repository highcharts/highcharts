/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2021 Pawel Fus
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

import type AreaRangePoint from '../../Series/AreaRange/AreaRangePoint';
import type AxisOptions from '../../Core/Axis/AxisOptions';
import type AxisType from '../../Core/Axis/AxisType';
import type Options from '../../Core/Options';
import type Point from '../../Core/Series/Point';
import type RadialAxis from '../../Core/Axis/RadialAxis';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type { SeriesTypeRegistry } from '../../Core/Series/SeriesType';

import Axis from '../../Core/Axis/Axis.js';
import Chart from '../../Core/Chart/Chart.js';
import D from '../../Core/Defaults.js';
const { setOptions } = D;
import F from '../../Core/Templating.js';
const { format } = F;
import H from '../../Core/Globals.js';
import ParallelAxis from './ParallelAxis.js';
import ParallelCoordinatesDefaults from './ParallelCoordinatesDefaults.js';
import Series from '../../Core/Series/Series.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    defined,
    erase,
    extend,
    insertItem,
    isNumber,
    merge,
    pick,
    splat,
    wrap
} = U;

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        hasParallelCoordinates?: Highcharts.ParallelChart[
            'hasParallelCoordinates'
        ];
        parallelInfo?: Highcharts.ParallelChart['parallelInfo'];
        /** @requires modules/parallel-coordinates */
        setParallelInfo(options: DeepPartial<Options>): void;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface ParallelChart extends Chart {
            hasParallelCoordinates?: boolean;
            parallelInfo: ParallelInfoObject;
        }
        interface ParallelInfoObject {
            counter: number;
        }
    }
}

/* *
 *
 *  Constants
 *
 * */

// Extensions for parallel coordinates plot.
const ChartProto = Chart.prototype;

setOptions({
    chart: ParallelCoordinatesDefaults.chart
});

/* eslint-disable no-invalid-this */

// Initialize parallelCoordinates
addEvent(Chart, 'init', function (
    e: {
        args: { 0: DeepPartial<Options> };
    }
): void {
    const options = e.args[0],
        defaultYAxis = splat(options.yAxis || {}),
        newYAxes = [];

    let yAxisLength = defaultYAxis.length;

    /**
     * Flag used in parallel coordinates plot to check if chart has ||-coords
     * (parallel coords).
     *
     * @requires module:modules/parallel-coordinates
     *
     * @name Highcharts.Chart#hasParallelCoordinates
     * @type {boolean}
     */
    this.hasParallelCoordinates = options.chart &&
        options.chart.parallelCoordinates;

    if (this.hasParallelCoordinates) {

        this.setParallelInfo(options);

        // Push empty yAxes in case user did not define them:
        for (;
            yAxisLength <= (this.parallelInfo as any).counter;
            yAxisLength++
        ) {
            newYAxes.push({});
        }

        if (!options.legend) {
            options.legend = {};
        }
        if (typeof options.legend.enabled === 'undefined') {
            options.legend.enabled = false;
        }
        merge(
            true,
            options,
            // Disable boost
            {
                boost: {
                    seriesThreshold: Number.MAX_VALUE
                },
                plotOptions: {
                    series: {
                        boostThreshold: Number.MAX_VALUE
                    }
                }
            }
        );

        options.yAxis = defaultYAxis.concat(newYAxes);
        options.xAxis = merge(
            ParallelCoordinatesDefaults.xAxis, // docs
            splat(options.xAxis || {})[0]
        );
    }
});

// Initialize parallelCoordinates
addEvent(Chart, 'update', function (e: { options: Partial<Options> }): void {
    const options = e.options;

    if (options.chart) {
        if (defined(options.chart.parallelCoordinates)) {
            this.hasParallelCoordinates = options.chart.parallelCoordinates;
        }

        this.options.chart.parallelAxes = merge(
            this.options.chart.parallelAxes,
            options.chart.parallelAxes
        );
    }

    if (this.hasParallelCoordinates) {
        // (#10081)
        if (options.series) {
            this.setParallelInfo(options);
        }

        this.yAxis.forEach(function (axis: AxisType): void {
            axis.update({}, false);
        });
    }
});

/* eslint-disable valid-jsdoc */

extend(ChartProto, /** @lends Highcharts.Chart.prototype */ {
    /**
     * Define how many parellel axes we have according to the longest dataset.
     * This is quite heavy - loop over all series and check series.data.length
     * Consider:
     *
     * - make this an option, so user needs to set this to get better
     *   performance
     *
     * - check only first series for number of points and assume the rest is the
     *   same
     *
     * @private
     * @function Highcharts.Chart#setParallelInfo
     * @param {Highcharts.Options} options
     * User options
     * @requires modules/parallel-coordinates
     */
    setParallelInfo: function (
        this: Highcharts.ParallelChart,
        options: DeepPartial<Options>
    ): void {
        const chart = this,
            seriesOptions: Array<SeriesOptions> =
                options.series as any;

        chart.parallelInfo = {
            counter: 0
        };

        seriesOptions.forEach(function (series): void {
            if (series.data) {
                chart.parallelInfo.counter = Math.max(
                    chart.parallelInfo.counter,
                    series.data.length - 1
                );
            }
        });
    }
});


// Bind each series to each yAxis. yAxis needs a reference to all series to
// calculate extremes.
addEvent(Series, 'bindAxes', function (e: Event): void {
    if (this.chart.hasParallelCoordinates) {
        const series = this;

        this.chart.axes.forEach((axis): void => {
            insertItem(series, axis.series);
            axis.isDirty = true;
        });
        series.xAxis = this.chart.xAxis[0];
        series.yAxis = this.chart.yAxis[0];

        e.preventDefault();
    }
});


// Translate each point using corresponding yAxis.
addEvent(Series, 'afterTranslate', function (): void {
    const series = this,
        chart = this.chart,
        points = series.points,
        dataLength = points && points.length;

    let closestPointRangePx = Number.MAX_VALUE,
        lastPlotX,
        point;

    if (this.chart.hasParallelCoordinates) {
        for (let i = 0; i < dataLength; i++) {
            point = points[i];
            if (defined(point.y)) {
                if (chart.polar) {
                    point.plotX = (
                        chart.yAxis[i] as RadialAxis.AxisComposition
                    ).angleRad || 0;
                } else if (chart.inverted) {
                    point.plotX = (
                        chart.plotHeight -
                        chart.yAxis[i].top +
                        chart.plotTop
                    );
                } else {
                    point.plotX = chart.yAxis[i].left - chart.plotLeft;
                }
                point.clientX = point.plotX;
                point.plotY = chart.yAxis[i]
                    .translate(point.y, false, true, void 0, true);

                // Range series (#15752)
                if (isNumber((point as AreaRangePoint).high)) {
                    point.plotHigh = chart.yAxis[i].translate(
                        (point as AreaRangePoint).high,
                        false,
                        true,
                        void 0,
                        true
                    );
                }

                if (typeof lastPlotX !== 'undefined') {
                    closestPointRangePx = Math.min(
                        closestPointRangePx,
                        Math.abs(point.plotX - lastPlotX)
                    );
                }
                lastPlotX = point.plotX;
                point.isInside = chart.isInsidePlot(
                    point.plotX,
                    point.plotY as any,
                    { inverted: chart.inverted }
                );
            } else {
                point.isNull = true;
            }
        }
        this.closestPointRangePx = closestPointRangePx;
    }
}, { order: 1 });

// On destroy, we need to remove series from each axis.series
addEvent(Series, 'destroy', function (): void {
    if (this.chart.hasParallelCoordinates) {
        (this.chart.axes || []).forEach(function (axis): void {
            if (axis && axis.series) {
                erase(axis.series, this);
                axis.isDirty = axis.forceRedraw = true;
            }
        }, this);
    }
});

/**
 * @private
 */
function addFormattedValue(
    this: Point,
    proceed: Function
): void {
    const chart = this.series && this.series.chart,
        config = proceed.apply(this, [].slice.call(arguments, 1));

    let formattedValue,
        yAxisOptions,
        labelFormat,
        yAxis;

    if (
        chart &&
        chart.hasParallelCoordinates &&
        !defined(config.formattedValue)
    ) {
        yAxis = chart.yAxis[this.x as any];
        yAxisOptions = yAxis.options;

        labelFormat = pick(
            /**
             * Parallel coordinates only. Format that will be used for point.y
             * and available in [tooltip.pointFormat](#tooltip.pointFormat) as
             * `{point.formattedValue}`. If not set, `{point.formattedValue}`
             * will use other options, in this order:
             *
             * 1. [yAxis.labels.format](#yAxis.labels.format) will be used if
             *    set
             *
             * 2. If yAxis is a category, then category name will be displayed
             *
             * 3. If yAxis is a datetime, then value will use the same format as
             *    yAxis labels
             *
             * 4. If yAxis is linear/logarithmic type, then simple value will be
             *    used
             *
             * @sample {highcharts}
             *         /highcharts/parallel-coordinates/tooltipvalueformat/
             *         Different tooltipValueFormats's
             *
             * @type      {string}
             * @default   undefined
             * @since     6.0.0
             * @product   highcharts
             * @requires  modules/parallel-coordinates
             * @apioption yAxis.tooltipValueFormat
             */
            yAxisOptions.tooltipValueFormat,
            yAxisOptions.labels.format
        );

        if (labelFormat) {
            formattedValue = format(
                labelFormat,
                extend(
                    this,
                    { value: this.y } as any
                ),
                chart
            );
        } else if (yAxis.dateTime) {
            formattedValue = chart.time.dateFormat(
                chart.time.resolveDTLFormat(
                    (yAxisOptions.dateTimeLabelFormats as any)[
                        (yAxis.tickPositions.info as any).unitName
                    ]
                ).main as any,
                this.y as any
            );
        } else if (yAxisOptions.categories) {
            formattedValue = yAxisOptions.categories[this.y as any];
        } else {
            formattedValue = this.y;
        }

        config.formattedValue = config.point.formattedValue = formattedValue;
    }

    return config;
}

['line', 'spline'].forEach(function (seriesName: string): void {
    wrap(
        H.seriesTypes[seriesName].prototype.pointClass.prototype,
        'getLabelConfig',
        addFormattedValue
    );
});

namespace ParallelCoordinates {

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        AxisClass: typeof Axis,
        ChartClass: typeof Chart,
        SeriesClass: typeof Series,
        seriesTypes: SeriesTypeRegistry
    ): void {

        ParallelAxis.compose(AxisClass);

    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelCoordinates;
