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
import type PiePointType from '../Pie/PiePoint';
import type PointType from '../../Core/Series/Point';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const PiePoint: typeof PiePointType =
        SeriesRegistry.seriesTypes.pie.prototype.pointClass,
    pointProto: PointType =
        SeriesRegistry.series.prototype.pointClass.prototype;
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

    public graphics: Record<string, SVGElement> = void 0 as any;

    public options: ItemPointOptions = void 0 as any;

    public series: ItemSeries = void 0 as any;

}

/* *
 *
 *  Class Prototype
 *
 * */

interface ItemPoint {
    haloPath: typeof pointProto.haloPath;
}
extend(ItemPoint.prototype, {
    haloPath: pointProto.haloPath
});

/* *
 *
 *  Default Export
 *
 * */

export default ItemPoint;
