/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/stock
 * @requires highcharts
 *
 * Highcharts Stock as a plugin for Highcharts
 *
 * (c) 2010-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import '../../Core/Axis/OrdinalAxis.js';
import './broken-axis.src.js';
import '../../Extensions/DataGrouping.js';
import '../../Series/OHLC/OHLCSeries.js';
import '../../Series/Candlestick/CandlestickSeries.js';
import '../../Series/Flags/FlagsSeries.js';
import Scrollbar from '../../Core/Scrollbar.js';
import '../../Core/Navigator.js';
import '../../Extensions/RangeSelector.js';
import StockChart from '../../Core/Chart/StockChart.js';
import '../../Series/HeikinAshi/HeikinAshiSeries.js';
const G: AnyRecord = Highcharts;
// Classes
G.Scrollbar = Scrollbar;
G.StockChart = G.stockChart = StockChart.stockChart;
// Compositions
Scrollbar.compose(G.Axis);
