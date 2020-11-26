/* *
 *
 *  (c) 2020 Torstein Honsi
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
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        line: LineSeries,
        pie: PieSeries
    }
} = BaseSeries;
import U from '../../Core/Utilities.js';
const { extend } = U;

/* *
 *
 *  Class
 *
 * */

class ItemPoint extends PieSeries.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public graphics: Record<string, SVGElement> = void 0 as any;

    public options: ItemPointOptions = void 0 as any;

    public series: ItemSeries = void 0 as any;

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface ItemPoint {
    haloPath: typeof LineSeries.prototype.pointClass.prototype.haloPath;
}
extend(ItemPoint.prototype, {
    haloPath: LineSeries.prototype.pointClass.prototype.haloPath
});

/* *
 *
 *  Default Export
 *
 * */

export default ItemPoint;
