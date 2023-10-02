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
import type ScatterPoint from './../Scatter/ScatterPoint';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const { scatter: ScatterSeries } = SeriesRegistry.seriesTypes;
import U from '../../Core/Utilities.js';
const { isNumber } = U;

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

    public insetIndex?: number;

    public options: MapPointPointOptions = void 0 as any;

    public properties?: AnyRecord;

    public series: MapPointSeries = void 0 as any;

    /* *
     *
     *  Functions
     *
     * */

    public isValid(): boolean {
        return Boolean(
            this.options.geometry ||
            (isNumber(this.x) && isNumber(this.y)) ||
            (isNumber(this.options.lon) && isNumber(this.options.lat))
        );
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface MapPointPoint extends ScatterPoint {
    bounds?: MapBounds;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointPoint;
