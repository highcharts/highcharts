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
import XRangeSeries from '../../Series/XRange/XRangeSeries.js';
import '../../Series/Gantt/GanttSeries.js';
import GanttChart from '../../Core/Chart/GanttChart.js';
import Scrollbar from '../../Stock/Scrollbar/Scrollbar.js';
import '../../Extensions/RangeSelector.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
const G: AnyRecord = Highcharts;
// Classes
G.Scrollbar = Scrollbar;
G.Navigator = Navigator;
G.GanttChart = GanttChart;
G.ganttChart = GanttChart.ganttChart;
// Compositions
Scrollbar.compose(G.Axis);
XRangeSeries.compose(G.Axis);
