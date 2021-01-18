/* *
 *
 *  (c) 2019-2021 Torstein Honsi
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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        pie: PieSeries
    }
} = SeriesRegistry;
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
    haloPath: typeof Series.prototype.pointClass.prototype.haloPath;
}
extend(ItemPoint.prototype, {
    haloPath: Series.prototype.pointClass.prototype.haloPath
});

/* *
 *
 *  Default Export
 *
 * */

export default ItemPoint;
