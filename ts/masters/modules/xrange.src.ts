/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/xrange
 * @requires highcharts
 *
 * X-range series
 *
 * (c) 2010-2024 Torstein Honsi, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import XRangeSeries from '../../Series/XRange/XRangeSeries.js';
const G: AnyRecord = Highcharts;
XRangeSeries.compose(G.Axis);
export default Highcharts;
