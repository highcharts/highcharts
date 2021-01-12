/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type ErrorBarPointOptions from './ErrorBarPointOptions';
import type ErrorBarSeries from '../ErrorBar/ErrorBarSeries';
import type BoxPlotPoint from '../BoxPlot/BoxPlotPoint';

/* *
 *
 *  Declarations
 *
 * */

declare class ErrorBarPoint extends BoxPlotPoint {
    public options: ErrorBarPointOptions;
    public series: ErrorBarSeries;
}


/* *
 *
 *  Export
 *
 * */

export default ErrorBarPoint;
