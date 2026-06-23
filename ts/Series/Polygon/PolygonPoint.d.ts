/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
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
