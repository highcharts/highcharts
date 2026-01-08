// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/series-on-point
 * @requires highcharts
 *
 * Series on point module
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Rafal Sebestjanski and Piotr Madej
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */

'use strict';
import Highcharts from '../../Core/Globals.js';
import SeriesOnPointComposition from '../../Series/SeriesOnPointComposition.js';
const G: AnyRecord = Highcharts;
SeriesOnPointComposition.compose(G.Series, G.Chart);
export default Highcharts;
