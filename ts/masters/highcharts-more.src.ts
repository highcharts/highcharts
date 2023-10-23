/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts-more
 * @requires highcharts
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import '../Extensions/Pane.js';
import '../Series/AreaRange/AreaRangeSeries.js';
import '../Series/AreaSplineRange/AreaSplineRangeSeries.js';
import '../Series/BoxPlot/BoxPlotSeries.js';
import BubbleSeries from '../Series/Bubble/BubbleSeries.js';
import '../Series/ColumnRange/ColumnRangeSeries.js';
import '../Series/ColumnPyramid/ColumnPyramidSeries.js';
import '../Series/ErrorBar/ErrorBarSeries.js';
import '../Series/Gauge/GaugeSeries.js';
import PackedBubbleSeries from '../Series/PackedBubble/PackedBubbleSeries.js';
import '../Series/Polygon/PolygonSeries.js';
import PolarAdditions from '../Series/PolarComposition.js';
import WaterfallSeries from '../Series/Waterfall/WaterfallSeries.js';
const G: AnyRecord = Highcharts;
BubbleSeries.compose(G.Axis, G.Chart, G.Legend, G.Series);
PackedBubbleSeries.compose(G.Axis, G.Chart, G.Legend, G.Series);
PolarAdditions.compose(
    G.Axis,
    G.Chart,
    G.Pointer,
    G.Series,
    G.Tick,
    SeriesRegistry.seriesTypes.areasplinerange,
    SeriesRegistry.seriesTypes.column,
    SeriesRegistry.seriesTypes.line,
    SeriesRegistry.seriesTypes.spline
);
WaterfallSeries.compose(G.Axis, G.Chart);
