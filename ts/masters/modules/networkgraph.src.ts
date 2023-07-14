/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/networkgraph
 * @requires highcharts
 *
 * Force directed graph module
 *
 * (c) 2010-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import NetworkgraphSeries from '../../Series/Networkgraph/NetworkgraphSeries.js';
const G: AnyRecord = Highcharts;
NetworkgraphSeries.compose(G.Chart);
