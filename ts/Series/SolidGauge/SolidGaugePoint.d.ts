/* *
 *
 *  (c) 2010-2025 Torstein Honsi
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
