// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts-more
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use,
 * see www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import Pane from '../Extensions/Pane/Pane.js';
import '../Series/AreaRange/AreaRangeSeries.js';
import AreaSplineRangeSeries from '../Series/AreaSplineRange/AreaSplineRangeSeries.js';
import '../Series/BoxPlot/BoxPlotSeries.js';
import BubbleSeries from '../Series/Bubble/BubbleSeries.js';
import '../Series/ColumnRange/ColumnRangeSeries.js';
import ColumnSeries from '../Series/Column/ColumnSeries.js';
import '../Series/ColumnPyramid/ColumnPyramidSeries.js';
import '../Series/ErrorBar/ErrorBarSeries.js';
import '../Series/Gauge/GaugeSeries.js';
import LineSeries from '../Series/Line/LineSeries.js';
import PackedBubbleSeries from '../Series/PackedBubble/PackedBubbleSeries.js';
import '../Series/Polygon/PolygonSeries.js';
import PolarAdditions from '../Series/PolarComposition.js';
import RadialAxis from '../Core/Axis/RadialAxis.js';
import SplineSeries from '../Series/Spline/SplineSeries.js';
import WaterfallSeries from '../Series/Waterfall/WaterfallSeries.js';
const G: AnyRecord = Highcharts;
G.RadialAxis = RadialAxis;
BubbleSeries.compose(G.Axis, G.Chart, G.Legend);
PackedBubbleSeries.compose(G.Axis, G.Chart, G.Legend);
Pane.compose(G.Chart, G.Pointer);
PolarAdditions.compose(
    G.Axis,
    G.Chart,
    G.Pointer,
    G.Series,
    G.Tick,
    G.Point,
    AreaSplineRangeSeries,
    ColumnSeries,
    LineSeries,
    SplineSeries
);
WaterfallSeries.compose(G.Axis, G.Chart);
export default G;
