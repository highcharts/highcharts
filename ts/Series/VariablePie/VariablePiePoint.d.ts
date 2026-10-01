/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński
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

import type PiePoint from '../Pie/PiePoint.js';
import type VariablePiePointOptions from './VariablePiePointOptions.js';
import type VariablePieSeries from './VariablePieSeries.js';

/* *
 *
 *  Class
 *
 * */

declare class VariablePiePoint extends PiePoint {
    public options: VariablePiePointOptions;
    public series: VariablePieSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default VariablePiePoint;
