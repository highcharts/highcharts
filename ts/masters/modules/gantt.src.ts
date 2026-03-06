// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Gantt JS v@product.version@ (@product.date@)
 * @module highcharts/modules/gantt
 * @requires highcharts
 *
 * Gantt series
 *
 * (c) 2016-2026 Highsoft AS
 * Author: Lars A. V. Cabrera
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ArrowSymbols from '../../Extensions/ArrowSymbols.js';
import Connection from '../../Gantt/Connection.js';
import CurrentDateIndication from '../../Extensions/CurrentDateIndication.js';
import GanttChart from '../../Core/Chart/GanttChart.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
import RangeSelector from '../../Stock/RangeSelector/RangeSelector.js';
import Scrollbar from '../../Stock/Scrollbar/Scrollbar.js';
import './pathfinder.src.js';
import './static-scale.src.js';
// Series
import './xrange.src.js';
import GanttSeries from '../../Series/Gantt/GanttSeries.js';
const G: AnyRecord = Highcharts;
// Classes
G.Connection = G.Connection || Connection;
G.GanttChart = G.GanttChart || GanttChart;
G.Navigator = G.Navigator || Navigator;
G.RangeSelector = G.RangeSelector || RangeSelector;
G.Scrollbar = G.Scrollbar || Scrollbar;
// Functions
G.ganttChart = G.GanttChart.ganttChart;
// Compositions
ArrowSymbols.compose(G.SVGRenderer);
CurrentDateIndication.compose(G.Axis, G.PlotLineOrBand);
GanttSeries.compose(G.Axis, G.Chart, G.Series, G.Tick);
G.Navigator.compose(G.Chart, G.Axis, G.Series);
G.RangeSelector.compose(G.Axis, G.Chart);
G.Scrollbar.compose(G.Axis);
export default Highcharts;
