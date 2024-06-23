/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/heikinashi
 * @requires highcharts
 * @requires modules/stock
 *
 * HeikinAshi series type for Highcharts Stock
 *
 * (c) 2010-2024 Karol Kolodziej
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import HeikinAshiSeries from '../../Series/HeikinAshi/HeikinAshiSeries.js';
const G: AnyRecord = Highcharts;
HeikinAshiSeries.compose(G.Series, G.Axis);
export default Highcharts;
