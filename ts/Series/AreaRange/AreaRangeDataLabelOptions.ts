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

import type DataLabelOptions from '../../Core/Series/DataLabelOptions';

/* *
 *
 *  Declarations
 *
 * */
export interface AreaRangeDataLabelOptions extends DataLabelOptions {
    xHigh?: number;
    xLow?: number;
    yHigh?: number;
    yLow?: number;
}

/* *
 *
 *  Default export
 *
 * */

export default AreaRangeDataLabelOptions;
