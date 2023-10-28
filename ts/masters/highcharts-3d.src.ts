/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts-3d
 * @requires highcharts
 *
 * 3D features for Highcharts JS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../Core/Globals.js';
import Chart3D from '../Core/Chart/Chart3D.js';
import Area3DSeries from '../Series/Area3D/Area3DSeries.js';
import Axis3DComposition from '../Core/Axis/Axis3DComposition.js';
import RendererRegistry from '../Core/Renderer/RendererRegistry.js';
import Series3D from '../Core/Series/Series3D.js';
import StackItem from '../Core/Axis/Stacking/StackItem.js';
import SVGRenderer3D from '../Core/Renderer/SVG/SVGRenderer3D.js';
import ZAxis from '../Core/Axis/ZAxis.js';
import Column3DComposition from '../Series/Column3D/Column3DComposition.js';
import Pie3DSeries from '../Series/Pie3D/Pie3DSeries.js';
import '../Series/Scatter3D/Scatter3DSeries.js';
const G: AnyRecord = Highcharts;
// Compositions
Area3DSeries.compose(G.seriesTypes.area);
Axis3DComposition.compose(G.Axis, G.Tick);
Chart3D.compose(G.Chart, G.Fx);
Column3DComposition.compose(G.Series, StackItem);
Pie3DSeries.compose(G.Series);
Series3D.compose(G.Series);
SVGRenderer3D.compose(RendererRegistry.getRendererType());
ZAxis.compose(G.Chart);
