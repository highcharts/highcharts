/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/xrange
 * @requires highcharts
 *
 * X-range series
 *
 * (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
const oldXRange = Highcharts.seriesTypes.xrange;
import XRangeSeries from '../../Series/XRange/XRangeSeries.js';
const G: AnyRecord = Highcharts;
if (oldXRange) {
    G.seriesTypes.xrange = oldXRange;
} else {
    XRangeSeries.compose(G.Axis);
}
export default Highcharts;
