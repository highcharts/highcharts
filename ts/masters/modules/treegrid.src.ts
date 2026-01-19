// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts Gantt JS v@product.version@ (@product.date@)
 * @module highcharts/modules/treegrid
 * @requires highcharts
 *
 * Tree Grid
 *
 * (c) 2016-2026 Highsoft AS
 * Author: Jon Arild Nygard
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import TreeGridAxis from '../../Core/Axis/TreeGrid/TreeGridAxis.js';
const G: AnyRecord = Highcharts;
TreeGridAxis.compose(G.Axis, G.Chart, G.Series, G.Tick);
export default Highcharts;
