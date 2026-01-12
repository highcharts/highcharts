/* *
 *
 *  (c) 2019-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Item series type for Highcharts
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

import type ItemPointOptions from './ItemPointOptions';
import type ItemSeries from './ItemSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import { extend } from '../../Shared/Utilities';
const {
    series: { prototype: { pointClass: Point } },
    seriesTypes: {
        pie: { prototype: { pointClass: PiePoint } }
    }
} = SeriesRegistry;

/* *
 *
 *  Class
 *
 * */

class ItemPoint extends PiePoint {

    /* *
     *
     *  Properties
     *
     * */

    public options!: ItemPointOptions;

    public series!: ItemSeries;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface ItemPoint {
    haloPath: typeof Point.prototype.haloPath;
}

extend(ItemPoint.prototype, {
    haloPath: Point.prototype.haloPath
});

/* *
 *
 *  Default Export
 *
 * */

export default ItemPoint;
