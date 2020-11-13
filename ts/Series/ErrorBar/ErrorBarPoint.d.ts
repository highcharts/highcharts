/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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

import type BoxPlotPoint from '../BoxPlot/BoxPlotPoint';
import type BoxPlotPointOptions from '../BoxPlot/BoxPlotPointOptions';
import type ErrorBarSeries from '../ErrorBar/ErrorBarSeries';


/* *
 *
 *  Declarations
 *
 * */

declare class ErrorBarPoint extends BoxPlotPoint {
    public options: ErrorBarPointOptions;
    public series: ErrorBarSeries;
}

export interface ErrorBarPointOptions extends BoxPlotPointOptions {
}

/* *
 *
 *  Export
 *
 * */

export default ErrorBarPoint;
