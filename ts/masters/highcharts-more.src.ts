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
const G: AnyRecord = Highcharts;
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import '../Extensions/Pane.js';
import '../Series/AreaRange/AreaRangeSeries.js';
import '../Series/AreaSplineRange/AreaSplineRangeSeries.js';
import '../Series/BoxPlot/BoxPlotSeries.js';
import BubbleSeries from '../Series/Bubble/BubbleSeries.js';
BubbleSeries.compose(G.Chart, G.Legend, G.Series);
import '../Series/ColumnRange/ColumnRangeSeries.js';
import '../Series/ColumnPyramid/ColumnPyramidSeries.js';
import '../Series/ErrorBar/ErrorBarSeries.js';
import '../Series/Gauge/GaugeSeries.js';
import '../Series/PackedBubble/PackedBubbleSeries.js';
import '../Series/Polygon/PolygonSeries.js';
import '../Series/Waterfall/WaterfallSeries.js';
import PolarAdditions from '../Series/PolarComposition.js';
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
