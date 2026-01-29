// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts-more
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import Pane from '../Extensions/Pane/Pane.js';
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
import RadialAxis from '../Core/Axis/RadialAxis.js';
import WaterfallSeries from '../Series/Waterfall/WaterfallSeries.js';
const G: AnyRecord = Highcharts;
G.RadialAxis = RadialAxis;
BubbleSeries.compose(G.Axis, G.Chart, G.Legend);
PackedBubbleSeries.compose(G.Axis, G.Chart, G.Legend);
Pane.compose(G.Chart, G.Pointer, G.Series);
PolarAdditions.compose(
    G.Axis,
    G.Chart,
    G.Pointer,
    G.Series,
    G.Tick,
    G.Point,
    SeriesRegistry.seriesTypes.areasplinerange,
    SeriesRegistry.seriesTypes.column,
    SeriesRegistry.seriesTypes.line,
    SeriesRegistry.seriesTypes.spline
);
WaterfallSeries.compose(G.Axis, G.Chart);
export default G;
