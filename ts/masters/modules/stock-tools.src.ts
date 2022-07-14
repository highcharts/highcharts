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
import NavigationBindings from '../../Extensions/Annotations/NavigationBindings.js';
import StockToolsBindings from '../../Stock/StockToolsBindings.js';
import '../../Stock/StockToolsGui.js';
StockToolsBindings.compose(NavigationBindings);
