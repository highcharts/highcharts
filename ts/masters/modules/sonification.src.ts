/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/sonification
 * @requires highcharts
 *
 * Sonification module
 *
 * (c) 2012-2021 Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import ChartSonify from '../../Extensions/Sonification/ChartSonify.js';
import SeriesSonify from '../../Extensions/Sonification/SeriesSonify.js';
import Sonification from '../../Extensions/Sonification/Sonification.js';
const G: AnyRecord = Highcharts;
G.sonification = Sonification;
ChartSonify.compose(G.Chart);
SeriesSonify.compose(G.Series);
