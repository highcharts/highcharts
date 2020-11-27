/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type ColumnRangePointOptions from './ColumnRangePointOptions.js';
import type ColumnRangeSeries from './ColumnRangeSeries.js';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import BaseSeries from '../../Core/Series/Series.js';
const {
    seriesTypes: {
        column: {
            prototype: {
                pointClass: ColumnPoint
            }
        },
        arearange: {
            prototype: {
                pointClass: AreaRangePoint
            }
        }
    }
} = BaseSeries;

/* *
 *
 *  Declarations
 *
 * */

interface ColumnRangePoint {
    barX: typeof ColumnPoint.prototype['barX'];
    pointWidth: typeof ColumnPoint.prototype['pointWidth'];
    shapeArgs: SVGAttributes;
    shapeType: typeof ColumnPoint.prototype['shapeType'];
}
class ColumnRangePoint extends AreaRangePoint {
    public series: ColumnRangeSeries = void 0 as any;
    public options: ColumnRangePointOptions = void 0 as any;
    public setState = ColumnPoint.prototype.setState;
}

/* *
 *
 *  Default export
 *
 * */
export default ColumnRangePoint;
