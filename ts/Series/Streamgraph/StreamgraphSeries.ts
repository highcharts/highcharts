/* *
 *
 *  Streamgraph module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type StreamgraphPoint from './StreamgraphPoint';
import type StreamgraphSeriesOptions from './StreamgraphSeriesOptions';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    areaspline: AreaSplineSeries
} = SeriesRegistry.seriesTypes;
import StreamgraphSeriesDefaults from './StreamgraphSeriesDefaults.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
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

    public data!: Array<StreamgraphPoint>;

    public points!: Array<StreamgraphPoint>;

    public options!: StreamgraphSeriesOptions;

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

        // Record the Y data for use when getting axis extremes. Register only
        // the max. This is picked up in the `afterGetExtremes` event, and the
        // dataMin property is reflected.
        if (this.stackedYData) {
            this.stackedYData[i] = Math.max.apply(0, pointExtremes);
        }
    }
}

// Reflect the dataMin property, as only dataMax is registered above
addEvent(StreamgraphSeries, 'afterGetExtremes', (e): void => {
    (e as any).dataExtremes.dataMin = -(e as any).dataExtremes.dataMax;
});
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
