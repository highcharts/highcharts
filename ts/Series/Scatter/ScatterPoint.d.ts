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

import type LinePoint from '../Line/LinePoint';
import type ScatterPointOptions from './ScatterPointOptions';
import type ScatterSeries from './ScatterSeries';

/* *
 *
 *  Class
 *
 * */

declare class ScatterPoint extends LinePoint {
    public options: ScatterPointOptions;
    public series: ScatterSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ScatterPoint;
