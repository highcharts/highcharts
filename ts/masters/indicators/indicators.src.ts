// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/indicators/indicators
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Indicator series type for Highcharts Stock
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Pawel Fus, Sebastian Bochan
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
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
