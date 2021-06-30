/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/exporting
 * @requires highcharts
 *
 * Exporting module
 *
 * (c) 2010-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
const G: AnyRecord = Highcharts;
import '../../Extensions/FullScreen.js';
import Exporting from '../../Extensions/Exporting/Exporting.js';
Exporting.compose(G.Chart);
