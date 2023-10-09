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
import './broken-axis.src.js';
import './datagrouping.src.js';
import './mouse-wheel-zoom.src.js';
import Highcharts from '../../Core/Globals.js';
import DataModifyComposition from '../../Series/DataModifyComposition.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
import RangeSelector from '../../Stock/RangeSelector/RangeSelector.js';
import Scrollbar from '../../Stock/Scrollbar/Scrollbar.js';
import OrdinalAxis from '../../Core/Axis/OrdinalAxis.js';
import '../../Series/HLC/HLCSeries.js';
import OHLCSeries from '../../Series/OHLC/OHLCSeries.js';
import '../../Series/Candlestick/CandlestickSeries.js';
import FlagsSeries from '../../Series/Flags/FlagsSeries.js';
import StockChart from '../../Core/Chart/StockChart.js';
const G: AnyRecord = Highcharts;
// Classes
G.Navigator = Navigator;
G.RangeSelector = RangeSelector;
G.Scrollbar = Scrollbar;
G.StockChart = G.stockChart = StockChart.stockChart;
// Compositions
DataModifyComposition.compose(G.Series, G.Axis, G.Point);
FlagsSeries.compose(G.Renderer);
Navigator.compose(G.Axis, G.Chart, G.Series);
OHLCSeries.compose(G.Series);
OrdinalAxis.compose(G.Axis, G.Series, G.Chart);
RangeSelector.compose(G.Axis, G.Chart);
Scrollbar.compose(G.Axis);
StockChart.compose(G.Axis, G.Series, G.SVGRenderer);
