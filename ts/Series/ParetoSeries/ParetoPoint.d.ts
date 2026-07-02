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
