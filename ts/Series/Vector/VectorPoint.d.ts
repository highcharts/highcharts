/* *
 *
 *  Vector plot series module
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

import type ScatterPoint from '../Scatter/ScatterPoint';
import type VectorPointOptions from './VectorPointOptions';
import type VectorSeries from './VectorSeries';

/* *
 *
 *  Class
 *
 * */

declare class VectorPoint extends ScatterPoint {
    public direction: VectorPointOptions['direction'];
    public length: VectorPointOptions['length'];
    public options: VectorPointOptions;
    public series: VectorSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default VectorPoint;
