/* *
 *
 *  (c) 2019-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Item series type for Highcharts
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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

import PieSeries from '../Pie/PieSeries.js';
import Series from '../../Core/Series/Series.js';
import { extend } from '../../Shared/Utilities.js';
const { prototype: { pointClass: Point } } = Series;
const { prototype: { pointClass: PiePoint } } = PieSeries;

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

    /** @internal */
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
