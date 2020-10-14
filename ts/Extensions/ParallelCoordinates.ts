/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2020 Pawel Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AxisType } from '../Core/Axis/Types';
import type Point from '../Core/Series/Point';
import type RadialAxis from '../Core/Axis/RadialAxis';
import Axis from '../Core/Axis/Axis.js';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    arrayMax,
    arrayMin,
    defined,
    erase,
    extend,
    format,
    merge,
    pick,
    setOptions,
    splat,
    wrap
} = U;

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        hasParallelCoordinates?: Highcharts.ParallelChart['hasParallelCoordinates'];
        parallelInfo?: Highcharts.ParallelChart['parallelInfo'];
        /** @requires modules/parallel-coordinates */
        setParallelInfo(options: Highcharts.Options): void;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {

        interface ChartOptions {
            parallelAxes?: XAxisOptions;
            parallelCoordinates?: boolean;
        }
        interface ParallelChart extends Chart {
            hasParallelCoordinates?: boolean;
            parallelInfo: ParallelInfoObject;
        }
        interface ParallelInfoObject {
            counter: number;
        }
        interface XAxisOptions {
            angle?: number;
            tooltipValueFormat?: string;
        }
    }
}

/**
 * @private
 */
declare module '../Core/Axis/Types' {
    interface AxisComposition {
        parallelCoordinates?: ParallelAxis['parallelCoordinates'];
    }
    interface AxisTypeRegistry {
        ParallelAxis: ParallelAxis;
    }
}

import '../Series/LineSeries.js';

// Extensions for parallel coordinates plot.
var ChartProto = Chart.prototype;

var defaultXAxisOptions = {
    lineWidth: 0,
    tickLength: 0,
    opposite: true,
    type: 'category'
};

/* eslint-disable valid-jsdoc */

/**
 * @optionparent chart
 */
var defaultParallelOptions: Highcharts.ChartOptions = {
    /**
     * Flag to render charts as a parallel coordinates plot. In a parallel
     * coordinates plot (||-coords) by default all required yAxes are generated
     * and the legend is disabled. This feature requires
     * `modules/parallel-coordinates.js`.
     *
     * @sample {highcharts} /highcharts/demo/parallel-coordinates/
     *         Parallel coordinates demo
     * @sample {highcharts} highcharts/parallel-coordinates/polar/
     *         Star plot, multivariate data in a polar chart
     *
     * @since    6.0.0
     * @product  highcharts
     * @requires modules/parallel-coordinates
     */
    parallelCoordinates: false,
    /**
     * Common options for all yAxes rendered in a parallel coordinates plot.
     * This feature requires `modules/parallel-coordinates.js`.
     *
     * The default options are:
     * ```js
     * parallelAxes: {
     *    lineWidth: 1,       // classic mode only
     *    gridlinesWidth: 0,  // classic mode only
     *    title: {
     *        text: '',
     *        reserveSpace: false
     *    },
     *    labels: {
     *        x: 0,
     *        y: 0,
     *        align: 'center',
     *        reserveSpace: false
     *    },
     *    offset: 0
     * }
     * ```
     *
     * @sample {highcharts} highcharts/parallel-coordinates/parallelaxes/
     *         Set the same tickAmount for all yAxes
     *
     * @extends   yAxis
     * @since     6.0.0
     * @product   highcharts
     * @excluding alternateGridColor, breaks, id, gridLineColor,
     *            gridLineDashStyle, gridLineWidth, minorGridLineColor,
     *            minorGridLineDashStyle, minorGridLineWidth, plotBands,
     *            plotLines, angle, gridLineInterpolation, maxColor, maxZoom,
     *            minColor, scrollbar, stackLabels, stops
     * @requires  modules/parallel-coordinates
     */
    parallelAxes: {
        lineWidth: 1,
        /**
         * Titles for yAxes are taken from
         * [xAxis.categories](#xAxis.categories). All options for `xAxis.labels`
         * applies to parallel coordinates titles. For example, to style
         * categories, use [xAxis.labels.style](#xAxis.labels.style).
         *
         * @excluding align, enabled, margin, offset, position3d, reserveSpace,
         *            rotation, skew3d, style, text, useHTML, x, y
         */
        title: {
            text: '',
            reserveSpace: false
        },
        labels: {
            x: 0,
            y: 4,
            align: 'center',
            reserveSpace: false
        },
        offset: 0
    }
};

setOptions({
    chart: defaultParallelOptions
});

/* eslint-disable no-invalid-this */

// Initialize parallelCoordinates
addEvent(Chart, 'init', function (
    e: {
        args: { 0: Highcharts.Options };
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
            defaultXAxisOptions, // docs
            splat(options.xAxis || {})[0]
        );
    }
});

// Initialize parallelCoordinates
addEvent(Chart, 'update', function (e: { options: Highcharts.Options }): void {
    const options = e.options;

    if (options.chart) {
        if (defined(options.chart.parallelCoordinates)) {
            this.hasParallelCoordinates = options.chart.parallelCoordinates;
        }

        (this.options.chart as any).parallelAxes = merge(
            (this.options.chart as any).parallelAxes,
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
     * @return {void}
     * @requires modules/parallel-coordinates
     */
    setParallelInfo: function (
        this: Highcharts.ParallelChart,
        options: Highcharts.Options
    ): void {
        var chart = this,
            seriesOptions: Array<Highcharts.SeriesOptions> =
                options.series as any;

        chart.parallelInfo = {
            counter: 0
        };

        seriesOptions.forEach(function (
            series: Highcharts.SeriesOptions
        ): void {
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
addEvent(H.Series, 'bindAxes', function (e: Event): void {
    if (this.chart.hasParallelCoordinates) {
        var series = this;

        this.chart.axes.forEach(function (axis: Highcharts.Axis): void {
            series.insert(axis.series);
            axis.isDirty = true;
        });
        series.xAxis = this.chart.xAxis[0];
        series.yAxis = this.chart.yAxis[0];

        e.preventDefault();
    }
});


// Translate each point using corresponding yAxis.
addEvent(H.Series, 'afterTranslate', function (): void {
    var series = this,
        chart = this.chart,
        points = series.points,
        dataLength = points && points.length,
        closestPointRangePx = Number.MAX_VALUE,
        lastPlotX,
        point,
        i;

    if (this.chart.hasParallelCoordinates) {
        for (i = 0; i < dataLength; i++) {
            point = points[i];
            if (defined(point.y)) {
                if (chart.polar) {
                    point.plotX = (chart.yAxis[i] as RadialAxis).angleRad || 0;
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
                    .translate(point.y, false, true, null, true);

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
                    chart.inverted
                );
            } else {
                point.isNull = true;
            }
        }
        this.closestPointRangePx = closestPointRangePx;
    }
}, { order: 1 });

// On destroy, we need to remove series from each axis.series
addEvent(H.Series, 'destroy', function (): void {
    if (this.chart.hasParallelCoordinates) {
        (this.chart.axes || []).forEach(function (axis: Highcharts.Axis): void {
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
    var chart = this.series && this.series.chart,
        config = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
        formattedValue,
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
            (yAxisOptions.labels as any).format
        );

        if (labelFormat) {
            formattedValue = format(
                labelFormat,
                extend(
                    this,
                    { value: this.y }
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

/**
 * Support for parallel axes.
 * @private
 * @class
 */
class ParallelAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(axis: ParallelAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    public axis: ParallelAxis;
    public position?: number;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set predefined left+width and top+height (inverted) for yAxes.
     * This method modifies options param.
     *
     * @private
     *
     * @param  {Array<string>} axisPosition
     * ['left', 'width', 'height', 'top'] or ['top', 'height', 'width', 'left']
     * for an inverted chart.
     *
     * @param  {Highcharts.AxisOptions} options
     * Axis options.
     */
    public setPosition(
        axisPosition: Array<('left'|'width'|'height'|'top')>,
        options: Highcharts.AxisOptions
    ): void {
        const parallel = this,
            axis = parallel.axis,
            chart = axis.chart,
            fraction = ((parallel.position || 0) + 0.5) / (chart.parallelInfo.counter + 1);

        if (chart.polar) {
            options.angle = 360 * fraction;
        } else {
            options[axisPosition[0]] = 100 * fraction + '%';
            axis[axisPosition[1]] = options[axisPosition[1]] = 0;

            // In case of chart.update(inverted), remove old options:
            axis[axisPosition[2]] = options[axisPosition[2]] = null as any;
            axis[axisPosition[3]] = options[axisPosition[3]] = null as any;
        }
    }

}

/**
 * Axis with parallel support.
 * @private
 */
namespace ParallelAxis {

    /**
     * Adds support for parallel axes.
     * @private
     */
    export function compose(AxisClass: typeof Axis): void {

        /* eslint-disable no-invalid-this */

        // On update, keep parallel additions.
        AxisClass.keepProps.push('parallel');

        addEvent(AxisClass, 'init', onInit);
        addEvent(AxisClass, 'afterSetOptions', onAfterSetOptions);
        addEvent(AxisClass, 'getSeriesExtremes', onGetSeriesExtremes);
    }

    /**
     * Update default options with predefined for a parallel coords.
     * @private
     */
    function onAfterSetOptions(
        this: Axis,
        e: { userOptions: Highcharts.XAxisOptions }
    ): void {
        const axis = this as ParallelAxis,
            chart = axis.chart,
            parallelCoordinates = axis.parallelCoordinates;

        let axisPosition: Array<('left'|'width'|'height'|'top')> = ['left', 'width', 'height', 'top'];

        if (chart.hasParallelCoordinates) {
            if (chart.inverted) {
                axisPosition = axisPosition.reverse();
            }

            if (axis.isXAxis) {
                axis.options = merge(
                    axis.options,
                    defaultXAxisOptions,
                    e.userOptions
                );
            } else {
                const axisIndex = chart.yAxis.indexOf(axis); // #13608
                axis.options = merge(
                    axis.options,
                    (axis.chart.options.chart as any).parallelAxes,
                    e.userOptions
                );
                parallelCoordinates.position = pick(
                    parallelCoordinates.position,
                    axisIndex >= 0 ? axisIndex : chart.yAxis.length
                );
                parallelCoordinates.setPosition(axisPosition, axis.options);
            }
        }
    }

    /**
     * Each axis should gather extremes from points on a particular position in
     * series.data. Not like the default one, which gathers extremes from all
     * series bind to this axis. Consider using series.points instead of
     * series.yData.
     * @private
     */
    function onGetSeriesExtremes(
        this: Axis,
        e: Event
    ): void {
        const axis = this;
        const chart = axis.chart;
        const parallelCoordinates = axis.parallelCoordinates;

        if (!parallelCoordinates) {
            return;
        }

        if (chart && chart.hasParallelCoordinates && !axis.isXAxis) {
            var index = parallelCoordinates.position,
                currentPoints: Array<Point> = [];

            axis.series.forEach(function (series: Highcharts.Series): void {
                if (
                    series.visible &&
                    defined((series.yData as any)[index as any])
                ) {
                    // We need to use push() beacause of null points
                    currentPoints.push((series.yData as any)[index as any]);
                }
            });

            axis.dataMin = arrayMin(currentPoints);
            axis.dataMax = arrayMax(currentPoints);

            e.preventDefault();
        }
    }

    /**
     * Add parallel addition
     * @private
     */
    function onInit(this: Axis): void {
        const axis = this;

        if (!axis.parallelCoordinates) {
            axis.parallelCoordinates = new ParallelAxisAdditions(axis as ParallelAxis);
        }
    }
}

interface ParallelAxis extends Axis {
    chart: Highcharts.ParallelChart;
    parallelCoordinates: ParallelAxisAdditions;
}

ParallelAxis.compose(Axis);

export default ParallelAxis;
