/* *
 *
 *  Parallel coordinates module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Fus
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../../Core/Axis/Axis';
import type Chart from '../../Core/Chart/Chart';
import type { DeepPartial } from '../../Shared/Types';
import type Options from '../../Core/Options';
import type Series from '../../Core/Series/Series';
import type SeriesOptions from '../../Core/Series/SeriesOptions';

import ParallelAxis from './ParallelAxis.js';
import ParallelCoordinatesDefaults from './ParallelCoordinatesDefaults.js';
import ParallelSeries from './ParallelSeries.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    defined,
    merge,
    splat
} = U;

/* *
 *
 * Declarations
 *
 * */

declare module '../../Core/Chart/ChartBase'{
    interface ChartBase {
        hasParallelCoordinates?: boolean;
        parallelInfo?: ParallelCoordinates.InfoObject;
        /** @requires modules/parallel-coordinates */
        setParallelInfo(options: DeepPartial<Options>): void;
    }
}

/* *
 *
 *  Class
 *
 * */

class ChartAdditions {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        chart: ParallelCoordinates.ChartComposition
    ) {
        this.chart = chart;
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart: ParallelCoordinates.ChartComposition;

    /* *
     *
     *  Functions
     *
     * */

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
    public setParallelInfo(
        this: (this|ParallelCoordinates.ChartComposition),
        options: DeepPartial<Options>
    ): void {
        const chart = (
                (this as this).chart ||
                (this as ParallelCoordinates.ChartComposition)
            ),
            seriesOptions: Array<SeriesOptions> =
                options.series as any;

        chart.parallelInfo = {
            counter: 0
        };

        for (const series of seriesOptions) {
            if (series.data) {
                chart.parallelInfo.counter = Math.max(
                    chart.parallelInfo.counter,
                    series.data.length - 1
                );
            }
        }
    }

}

/* *
 *
 *  Composition
 *
 * */

namespace ParallelCoordinates {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class ChartComposition extends Chart {
        hasParallelCoordinates?: boolean;
        parallelInfo: InfoObject;
    }

    export interface InfoObject {
        counter: number;
    }

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        AxisClass: typeof Axis,
        ChartClass: typeof Chart,
        highchartsDefaultOptions: Options,
        SeriesClass: typeof Series
    ): void {

        ParallelAxis.compose(AxisClass);
        ParallelSeries.compose(SeriesClass);

        const ChartCompo = ChartClass as typeof ChartComposition,
            addsProto = ChartAdditions.prototype,
            chartProto = ChartCompo.prototype;

        if (!chartProto.setParallelInfo) {
            chartProto.setParallelInfo = addsProto.setParallelInfo;

            addEvent(ChartCompo, 'init', onChartInit);
            addEvent(ChartCompo, 'update', onChartUpdate);

            merge(
                true,
                highchartsDefaultOptions.chart,
                ParallelCoordinatesDefaults.chart
            );
        }

    }

    /**
     * Initialize parallelCoordinates
     * @private
     */
    function onChartInit(
        this: ChartComposition,
        e: { args: [Partial<Options>] }
    ): void {
        const chart = this,
            options = e.args[0],
            defaultYAxis = splat(options.yAxis || {}),
            newYAxes = [];

        let yAxisLength = defaultYAxis.length;

        /**
         * Flag used in parallel coordinates plot to check if chart has
         * ||-coords (parallel coords).
         *
         * @requires modules/parallel-coordinates
         *
         * @name Highcharts.Chart#hasParallelCoordinates
         * @type {boolean}
         */
        chart.hasParallelCoordinates = options.chart &&
            options.chart.parallelCoordinates;

        if (chart.hasParallelCoordinates) {

            chart.setParallelInfo(options);

            // Push empty yAxes in case user did not define them:
            for (;
                yAxisLength <= (chart.parallelInfo as any).counter;
                yAxisLength++
            ) {
                newYAxes.push({});
            }

            if (!options.legend) {
                options.legend = {} as typeof options['legend'];
            }
            if (
                options.legend &&
                typeof options.legend.enabled === 'undefined'
            ) {
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
                ParallelCoordinatesDefaults.xAxis, // Docs
                splat(options.xAxis || {})[0]
            );
        }
    }

    /**
     * Initialize parallelCoordinates
     * @private
     */
    function onChartUpdate(
        this: ChartComposition,
        e: { options: Partial<Options> }
    ): void {
        const chart = this,
            options = e.options;

        if (options.chart) {
            if (defined(options.chart.parallelCoordinates)) {
                chart.hasParallelCoordinates =
                    options.chart.parallelCoordinates;
            }

            chart.options.chart.parallelAxes = merge(
                chart.options.chart.parallelAxes,
                options.chart.parallelAxes
            );
        }

        if (chart.hasParallelCoordinates) {
            // (#10081)
            if (options.series) {
                chart.setParallelInfo(options);
            }

            for (const axis of chart.yAxis) {
                axis.update({}, false);
            }
        }
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default ParallelCoordinates;
