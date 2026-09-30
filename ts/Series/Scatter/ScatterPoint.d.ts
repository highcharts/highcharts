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

import type LinePoint from '../Line/LinePoint.js';
import type ScatterPointOptions from './ScatterPointOptions.js';
import type ScatterSeries from './ScatterSeries.js';

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
