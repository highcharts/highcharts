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
import Scrollbar from '../../Core/Scrollbar.js';
import RangeSelector from '../../Stock/RangeSelector/RangeSelector.js';
import '../../Core/Navigator.js';
const G: AnyRecord = Highcharts;
// Classes
G.GanttChart = GanttChart;
G.ganttChart = GanttChart.ganttChart;
G.RangeSelector = RangeSelector;
G.Scrollbar = Scrollbar;
// Compositions
Scrollbar.compose(G.Axis);
RangeSelector.compose(G.Axis, G.Chart);
XRangeSeries.compose(G.Axis);
