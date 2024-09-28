/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/tiledwebmap
 * @requires highcharts
 *
 * (c) 2009-2024
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import TilesProviderRegistry from '../../Maps/TilesProviders/TilesProviderRegistry.js';
import TiledWebMapSeries from '../../Series/TiledWebMap/TiledWebMapSeries.js';
const G: AnyRecord = Highcharts;
G.TilesProviderRegistry = G.TilesProviderRegistry || TilesProviderRegistry;
TiledWebMapSeries.compose(G.MapView);
export default Highcharts;
