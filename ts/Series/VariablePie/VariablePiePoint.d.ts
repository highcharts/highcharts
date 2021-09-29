/* *
 *
 *  Variable Pie module for Highcharts
 *
 *  (c) 2010-2021 Grzegorz Blachliński
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

import type PiePoint from '../Pie/PiePoint';
import type VariablePiePointOptions from './VariablePiePointOptions';
import type VariablePieSeries from './VariablePieSeries';

/* *
 *
 *  Class
 *
 * */

declare class VariablePiePoint extends PiePoint {
    public labelDistance: number;
    public options: VariablePiePointOptions;
    public series: VariablePieSeries;
}

/* *
 *
 *  Default Export
 *
 * */

export default VariablePiePoint;
