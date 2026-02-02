/* *
 *
 *  Highcharts funnel module
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
