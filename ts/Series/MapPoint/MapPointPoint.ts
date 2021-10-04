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
import type ScatterPoint from './../Scatter/ScatterPoint';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    seriesTypes: {
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { isNumber, merge } = U;

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
        const mergedOptions = (
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

    public isValid(): boolean {
        return Boolean(
            this.options.coordinates ||
            (isNumber(this.x) && isNumber(this.y))
        );
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapPointPoint extends ScatterPoint {
    bounds?: Highcharts.MapBounds;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointPoint;
