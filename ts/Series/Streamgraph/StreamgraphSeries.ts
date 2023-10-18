/* *
 *
 *  Streamgraph module
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type StreamgraphPoint from './StreamgraphPoint';
import type StreamgraphSeriesOptions from './StreamgraphSeriesOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    areaspline: AreaSplineSeries
} = SeriesRegistry.seriesTypes;
import StreamgraphSeriesDefaults from './StreamgraphSeriesDefaults.js';
import U from '../../Core/Utilities.js';
const {
    merge,
    extend
} = U;

/**
 * Streamgraph series type
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.streamgraph
 *
 * @augments Highcharts.Series
 */
class StreamgraphSeries extends AreaSplineSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    public static defaultOptions: StreamgraphSeriesOptions = merge(
        AreaSplineSeries.defaultOptions,
        StreamgraphSeriesDefaults
    );

    /* *
     *
     *  Properties
     *
     * */

    public data: Array<StreamgraphPoint> = void 0 as any;

    public points: Array<StreamgraphPoint> = void 0 as any;

    public options: StreamgraphSeriesOptions = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    // Modifier function for stream stacks. It simply moves the point up or
    // down in order to center the full stack vertically.
    public streamStacker(
        pointExtremes: Array<number>,
        stack: Record<string, number>,
        i: number
    ): void {
        // Y bottom value
        pointExtremes[0] -= stack.total / 2;
        // Y value
        pointExtremes[1] -= stack.total / 2;

        // Record the Y data for use when getting axis extremes
        (this.stackedYData as any)[i] = pointExtremes;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface StreamgraphSeries {
    negStacks: boolean;
    pointClass: typeof StreamgraphPoint;
}

extend(StreamgraphSeries.prototype, {
    negStacks: false
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        streamgraph: typeof StreamgraphSeries;
    }
}

SeriesRegistry.registerSeriesType('streamgraph', StreamgraphSeries);

/* *
 *
 *  Default Export
 *
 * */

export default StreamgraphSeries;
