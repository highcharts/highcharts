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
 *  Default Export
 *
 * */

export default ErrorBarPoint;
