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
import type { MapBounds } from '../../Maps/MapViewOptions';
import type ScatterPointType from './../Scatter/ScatterPoint';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const ScatterPoint: typeof ScatterPointType =
    SeriesRegistry.seriesTypes.scatter.prototype.pointClass;
import U from '../../Core/Utilities.js';
const { isNumber } = U;

/* *
 *
 *  Class
 *
 * */

class MapPointPoint extends ScatterPoint {

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

    public isValid(): boolean {
        return Boolean(
            this.options.geometry ||
            (isNumber(this.x) && isNumber(this.y)) ||
            (isNumber(this.options.lon) && isNumber(this.options.lat))
        );
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapPointPoint {
    bounds?: MapBounds;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointPoint;
