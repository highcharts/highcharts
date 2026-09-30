/* *
 *
 *  Vector plot series module
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

import type ScatterPoint from '../Scatter/ScatterPoint.js';
import type VectorPointOptions from './VectorPointOptions.js';
import type VectorSeries from './VectorSeries.js';

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
