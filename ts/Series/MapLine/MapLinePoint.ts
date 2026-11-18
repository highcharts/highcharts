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
