/* *
 *
 *  (c) 2019-2024 Highsoft AS
 *
 *  Boost module: stripped-down renderer for higher performance
 *
 *  License: highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from "../../Core/Chart/Chart";
import type Series from "../../Core/Series/Series";

import GPULineSeries from "./Series/GPULineSeries.js";

/**
 * @private
 */
function compose(
    ChartClass: typeof Chart,
    SeriesClass: typeof Series
): void {
    console.log(GPULineSeries);
}

export default { compose };
