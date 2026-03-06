/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Grzegorz Blachliński
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

import type PiePoint from '../Pie/PiePoint';
import type VariablePiePointOptions from './VariablePiePointOptions';
import type VariablePieSeries from './VariablePieSeries';

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
