/**
 * @license Highmaps JS v@product.version@ (@product.date@)
 * @module highcharts/modules/map
 * @requires highcharts
 *
 * Highmaps as a plugin for Highcharts or Highstock.
 *
 * (c) 2011-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import '../../Core/Axis/MapAxis.js';
import '../../Core/Axis/ColorAxis.js';
import '../../Mixins/ColorMapSeries.js';
import '../../Maps/MapNavigation.js';
import '../../Maps/MapPointer.js';
import '../../Series/Map/MapSeries.js';
import '../../Series/MapLine/MapLineSeries.js';
import '../../Series/MapPoint/MapPointSeries.js';
import '../../Series/MapBubble/MapBubbleSeries.js';
import '../../Series/Heatmap/HeatmapSeries.js';
import '../../Extensions/GeoJSON.js';
import M from '../../Core/Chart/MapChart.js';

(Highcharts as any).mapChart = M.mapChart;
(Highcharts as any).MapChart = (Highcharts as any).Map = M.MapChart;
(Highcharts as any).maps = M.maps;
