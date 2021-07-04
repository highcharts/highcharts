/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/data
 * @requires highcharts
 *
 * Data module
 *
 * (c) 2012-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Data from '../../Extensions/Data/Data.js';
const G: AnyRecord = Highcharts;
G.Data = Data;
G.data = Data.data;
Data.compose(G.Chart);
