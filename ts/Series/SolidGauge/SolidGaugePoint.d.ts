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

import type SolidGaugePointOptions from './SolidGaugePointOptions';
import type SolidGaugeSeries from './SolidGaugeSeries';
import type GaugePoint from '../Gauge/GaugePoint';

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
