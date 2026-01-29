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

import type MapLinePointOptions from './MapLinePointOptions';
import type MapLineSeries from './MapLineSeries';
import type MapPoint from '../Map/MapPoint';

/* *
 *
 *  Class
 *
 * */

declare class MapLinePoint extends MapPoint {
    public options: MapLinePointOptions;
    public series: MapLineSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapLinePoint;
