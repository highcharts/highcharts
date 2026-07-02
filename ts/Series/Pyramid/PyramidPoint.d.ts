/* *
 *
 *  Highcharts funnel module
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

import type FunnelPoint from '../Funnel/FunnelPoint';
import type PyramidPointOptions from './PyramidPointOptions';
import type PyramidSeries from './PyramidSeries';

/* *
 *
 *  Class
 *
 * */

declare class PyramidPoint extends FunnelPoint {
    public options: PyramidPointOptions;
    public series: PyramidSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default PyramidPoint;
