/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * Treegraph chart series type
 * @module highcharts/modules/treegraph
 * @requires highcharts
 * @requires highcharts/modules/treemap
 *
 *  (c) 2010-2024 Pawel Lysy Grzegorz Blachlinski
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import TreegraphSeries from '../../Series/Treegraph/TreegraphSeries.js';
const G: AnyRecord = Highcharts;
TreegraphSeries.compose(G.Series);
export default Highcharts;
