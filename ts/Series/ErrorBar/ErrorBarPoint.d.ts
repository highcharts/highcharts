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
