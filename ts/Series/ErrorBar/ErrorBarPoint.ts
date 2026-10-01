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

import type ErrorBarPointOptions from './ErrorBarPointOptions.js';
import type ErrorBarSeries from '../ErrorBar/ErrorBarSeries.js';
import type BoxPlotPoint from '../BoxPlot/BoxPlotPoint.js';

/* *
 *
 *  Declarations
 *
 * */

declare class ErrorBarPoint extends BoxPlotPoint {
    public options: ErrorBarPointOptions;
    /** @internal */
    public series: ErrorBarSeries;
}


/* *
 *
 *  Default Export
 *
 * */

export default ErrorBarPoint;
