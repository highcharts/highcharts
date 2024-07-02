/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/indicators/indicators
 * @requires highcharts
 * @requires modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2024 Pawel Fus, Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import '../../Stock/Indicators/SMA/SMAIndicator.js';
import '../../Stock/Indicators/EMA/EMAIndicator.js';
import MultipleLinesComposition from '../../Stock/Indicators/MultipleLinesComposition.js';
const G: AnyRecord = Highcharts;
G.MultipleLinesComposition =
    G.MultipleLinesComposition || MultipleLinesComposition;
export default Highcharts;
