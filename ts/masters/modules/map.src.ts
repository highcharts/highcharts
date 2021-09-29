/**
 * @license Highmaps JS v@product.version@ (@product.date@)
 * @module highcharts/modules/map
 * @requires highcharts
 *
 * Highmaps as a plugin for Highcharts or Highcharts Stock.
 *
 * (c) 2011-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import '../../Core/Axis/MapAxis.js';
import ColorAxis from '../../Core/Axis/Color/ColorAxis.js';
import '../../Maps/MapNavigation.js';
import '../../Maps/MapPointer.js';
import '../../Series/Map/MapSeries.js';
import '../../Series/MapLine/MapLineSeries.js';
import '../../Series/MapPoint/MapPointSeries.js';
import MapBubbleSeries from '../../Series/MapBubble/MapBubbleSeries.js';
import '../../Series/Heatmap/HeatmapSeries.js';
import '../../Extensions/GeoJSON.js';
import MapChart from '../../Core/Chart/MapChart.js';
const G: AnyRecord = Highcharts;
G.ColorAxis = ColorAxis;
G.MapChart = MapChart;
G.mapChart = G.Map = MapChart.mapChart;
G.maps = MapChart.maps;
ColorAxis.compose(G.Chart, G.Fx, G.Legend, G.Series);
MapBubbleSeries.compose(G.Chart, G.Legend, G.Series);
