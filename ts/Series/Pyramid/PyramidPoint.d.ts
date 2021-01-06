/* *
 *
 *  Highcharts funnel module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
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
