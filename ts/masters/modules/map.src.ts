// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highmaps JS v@product.version@ (@product.date@)
 * @module highcharts/modules/map
 * @requires highcharts
 *
 * Highmaps as a plugin for Highcharts or Highcharts Stock.
 *
 * (c) 2011-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
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
// Classes
G.ColorMapComposition = ColorMapComposition;
G.MapChart = G.MapChart || MapChart;
G.MapNavigation = G.MapNavigation || MapNavigation;
G.MapView = G.MapView || MapView;
G.Projection = G.Projection || Projection;
// Functions
G.mapChart = G.Map = G.MapChart.mapChart;
G.maps = G.MapChart.maps;
G.geojson = GeoJSONComposition.geojson;
G.topo2geo = GeoJSONComposition.topo2geo;
// Compositions
GeoJSONComposition.compose(G.Chart);
MapBubbleSeries.compose(G.Axis, G.Chart, G.Legend);
MapNavigation.compose(MapChart, G.Pointer, G.SVGRenderer);
MapView.compose(MapChart);
// Default Export
export default Highcharts;
