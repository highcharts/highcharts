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

/* *
 *
 *  Imports
 *
 * */

import type PolygonPointOptions from './PolygonPointOptions';
import type PolygonSeries from './PolygonSeries';
import type ScatterPoint from '../Scatter/ScatterPoint';

/* *
 *
 *  Class
 *
 * */

declare class PolygonPoint extends ScatterPoint {
    public options: PolygonPointOptions;
    public series: PolygonSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default PolygonPoint;
