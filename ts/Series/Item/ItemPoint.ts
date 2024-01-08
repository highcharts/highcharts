/* *
 *
 *  (c) 2019-2024 Torstein Honsi
 *
 *  Item series type for Highcharts
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

import type ItemPointOptions from './ItemPointOptions';
import type ItemSeries from './ItemSeries';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: { prototype: { pointClass: Point } },
    seriesTypes: {
        pie: { prototype: { pointClass: PiePoint } }
    }
} = SeriesRegistry;
import U from '../../Core/Utilities.js';
const { extend } = U;

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
