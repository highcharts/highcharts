/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/stock-tools
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Advanced Highcharts Stock tools
 *
 * (c) 2010-2021 Highsoft AS
 * Author: Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';
import StockTools from '../../Stock/StockTools.js';
import StockToolsGui from '../../Stock/StockToolsGui.js';
import Toolbar from '../../Stock/StockToolbar.js';
const G: AnyRecord = Highcharts;
G.Toolbar = Toolbar;
StockTools.compose(NavigationBindings);
StockToolsGui.compose(G.Chart, NavigationBindings);
