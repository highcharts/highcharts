// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/no-data-to-display
 * @requires highcharts
 *
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Oystein Moseng
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import NoDataToDisplay from '../../Extensions/NoDataToDisplay/NoDataToDisplay.js';
const G: AnyRecord = Highcharts;
NoDataToDisplay.compose(G.Chart, G.defaultOptions);
export default Highcharts;
