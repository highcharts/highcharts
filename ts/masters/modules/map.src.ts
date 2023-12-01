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
import './coloraxis.src.js';
import MapNavigation from '../../Maps/MapNavigation.js';
import ColorMapComposition from '../../Series/ColorMapComposition.js';
import '../../Series/Map/MapSeries.js';
import '../../Series/MapLine/MapLineSeries.js';
import '../../Series/MapPoint/MapPointSeries.js';
import MapBubbleSeries from '../../Series/MapBubble/MapBubbleSeries.js';
import '../../Series/Heatmap/HeatmapSeries.js';
import GeoJSONComposition from '../../Maps/GeoJSONComposition.js';
import MapChart from '../../Core/Chart/MapChart.js';
import MapView from '../../Maps/MapView.js';
import Projection from '../../Maps/Projection.js';
const G: AnyRecord = Highcharts;
G.ColorMapComposition = ColorMapComposition;
G.MapChart = MapChart;
G.mapChart = G.Map = MapChart.mapChart;
G.MapNavigation = MapNavigation;
G.MapView = MapView;
G.maps = MapChart.maps;
G.Projection = Projection;
G.geojson = GeoJSONComposition.geojson;
G.topo2geo = GeoJSONComposition.topo2geo;
GeoJSONComposition.compose(G.Chart);
MapBubbleSeries.compose(G.Axis, G.Chart, G.Legend, G.Series);
MapNavigation.compose(MapChart, G.Pointer, G.SVGRenderer);
MapView.compose(MapChart);
export default Highcharts;
