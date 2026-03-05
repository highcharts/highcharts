// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/broken-axis
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import BrokenAxis from '../../Core/Axis/BrokenAxis.js';
const G: AnyRecord = Highcharts;
G.BrokenAxis = G.BrokenAxis || BrokenAxis;
G.BrokenAxis.compose(G.Axis, G.Series);
export default Highcharts;
