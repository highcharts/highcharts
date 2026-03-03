/* *
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

import type MapPointPointOptions from './MapPointPointOptions';
import type MapPointSeries from './MapPointSeries';
import type { MapBounds } from '../../Maps/MapViewOptions';
import type ScatterPoint from './../Scatter/ScatterPoint';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { isNumber } from '../../Shared/Utilities.js';
const { scatter: ScatterSeries } = SeriesRegistry.seriesTypes;

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

    public options!: MapPointPointOptions;

    public properties?: AnyRecord;

    public series!: MapPointSeries;

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
