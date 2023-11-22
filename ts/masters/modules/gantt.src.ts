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
import ArrowSymbols from '../../Extensions/ArrowSymbols.js';
import Connection from '../../Gantt/Connection.js';
import CurrentDateIndication from '../../Extensions/CurrentDateIndication.js';
import GanttChart from '../../Core/Chart/GanttChart.js';
import Navigator from '../../Stock/Navigator/Navigator.js';
import Pathfinder from '../../Gantt/Pathfinder.js';
import RangeSelector from '../../Stock/RangeSelector/RangeSelector.js';
import Scrollbar from '../../Stock/Scrollbar/Scrollbar.js';
import StaticScale from '../../Extensions/StaticScale.js';
// Series
import XRangeSeries from '../../Series/XRange/XRangeSeries.js';
import GanttSeries from '../../Series/Gantt/GanttSeries.js';
import ChartNavigatorComposition from '../../Stock/Navigator/ChartNavigatorComposition.js';
import NavigatorComposition from '../../Stock/Navigator/NavigatorComposition.js';
const G: AnyRecord = Highcharts;
// Classes
G.Connection = Connection;
G.GanttChart = GanttChart;
G.ganttChart = GanttChart.ganttChart;
G.Navigator = Navigator;
G.Pathfinder = Pathfinder;
G.RangeSelector = RangeSelector;
G.Scrollbar = Scrollbar;
// Compositions
ArrowSymbols.compose(G.SVGRenderer);
CurrentDateIndication.compose(G.Axis, G.PlotLineOrBand);
GanttSeries.compose(G.Axis, G.Chart, G.Series, G.Tick);
NavigatorComposition.compose(G.Axis, G.Navigator, G.Series);
ChartNavigatorComposition.compose(G.Chart, G.Navigator);
Pathfinder.compose(G.Chart, G.Point);
RangeSelector.compose(G.Axis, G.Chart);
Scrollbar.compose(G.Axis);
XRangeSeries.compose(G.Axis);
StaticScale.compose(G.Axis, G.Chart);
