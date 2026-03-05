// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/stock-tools
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Advanced Highcharts Stock tools
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';
import StockTools from '../../Stock/StockTools/StockTools.js';
import StockToolsGui from '../../Stock/StockTools/StockToolsGui.js';
import Toolbar from '../../Stock/StockTools/StockToolbar.js';
const G: AnyRecord = Highcharts;
G.NavigationBindings = G.NavigationBindings || NavigationBindings;
G.Toolbar = Toolbar;
StockTools.compose(G.NavigationBindings);
StockToolsGui.compose(G.Chart, G.NavigationBindings);
export default Highcharts;
