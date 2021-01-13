/* *
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

import type MapBubblePointOptions from './MapBubblePointOptions';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        bubble: BubbleSeries,
        map: MapSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const {
    extend,
    merge
} = U;

/* *
 *
 *  Class
 *
 * */

class MapBubblePoint extends BubbleSeries.prototype.pointClass {

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * @private
     */
    public applyOptions(
        options: MapBubblePointOptions,
        x?: number
    ): MapBubblePoint {
        var point: MapBubblePoint;

        if (
            options &&
            typeof (options as any).lat !== 'undefined' &&
            typeof (options as any).lon !== 'undefined'
        ) {
            point = super.applyOptions.call(
                this,
                merge(
                    options,
                    this.series.chart.fromLatLonToPoint(options as any)
                ),
                x
            ) as MapBubblePoint;
        } else {
            point = MapSeries.prototype.pointClass.prototype
                .applyOptions.call(
                    this, options as any, x as any
                ) as any;
        }
        return point;
    }

    /**
     * @private
     */
    public isValid(): boolean {
        return typeof this.z === 'number';
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface MapBubblePoint {
    ttBelow: boolean;
}
extend(MapBubblePoint.prototype, {
    ttBelow: false
});

/* *
 *
 *  Default Export
 *
 * */

export default MapBubblePoint;
