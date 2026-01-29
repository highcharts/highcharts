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

import type ParetoPointOptions from './ParetoPointOptions';
import type ParetoSeries from './ParetoSeries';
import type Point from '../../Core/Series/Point';

/* *
 *
 *  Declarations
 *
 * */

declare class ParetoPoint extends Point {
    public options: ParetoPointOptions;
    public series: ParetoSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default ParetoPoint;
