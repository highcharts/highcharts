/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/renko
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Renko series type for Highcharts Stock
 *
 * (c) 2010-2024 Pawel Lysy
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import RenkoSeries from '../../Series/Renko/RenkoSeries.js';
const G: AnyRecord = Highcharts;

RenkoSeries.compose(G.Axis);
export default Highcharts;
