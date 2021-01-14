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

import type MapPointPointOptions from './MapPointPointOptions';
import type MapPointSeries from './MapPointSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  Class
 *
 * */

class MapPointPoint extends ScatterSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public options: MapPointPointOptions = void 0 as any;

    public series: MapPointSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public applyOptions(
        options: (Highcharts.MapLatLonObject&MapPointPointOptions),
        x?: number
    ): MapPointPoint {
        var mergedOptions = (
            typeof options.lat !== 'undefined' &&
            typeof options.lon !== 'undefined' ?
                merge(
                    options, this.series.chart.fromLatLonToPoint(options)
                ) :
                options
        );

        return (
            super.applyOptions.call(this, mergedOptions, x) as any
        );
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointPoint;
