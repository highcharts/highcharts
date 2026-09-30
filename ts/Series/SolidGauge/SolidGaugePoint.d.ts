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

import type SolidGaugePointOptions from './SolidGaugePointOptions.js';
import type SolidGaugeSeries from './SolidGaugeSeries.js';
import type GaugePoint from '../Gauge/GaugePoint.js';

/* *
 *
 *  Declarations
 *
 * */

declare class SolidGaugePoint extends GaugePoint {
    options: SolidGaugePointOptions;
    series: SolidGaugeSeries;
    startR?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default SolidGaugePoint;
