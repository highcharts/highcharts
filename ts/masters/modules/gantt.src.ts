/**
 * @license Highcharts Gantt JS v@product.version@ (@product.date@)
 * @module highcharts/modules/gantt
 * @requires highcharts
 *
 * Gantt series
 *
 * (c) 2016-2021 Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import '../../Series/XRange/XRangeSeries.js';
import '../../Series/Gantt/GanttSeries.js';
import GanttChart from '../../Core/Chart/GanttChart.js';
import Scrollbar from '../../Core/Scrollbar.js';
import '../../Extensions/RangeSelector.js';
import '../../Core/Navigator.js';
const G: AnyRecord = Highcharts;
// Compositions
if (!G.Scrollbar) {
    Scrollbar.compose(G.Axis);
}
// Classes
G.Scrollbar = Scrollbar;
G.GanttChart = GanttChart;
G.ganttChart = GanttChart.ganttChart;
