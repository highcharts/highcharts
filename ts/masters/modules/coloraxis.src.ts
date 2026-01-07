// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/color-axis
 * @requires highcharts
 *
 * ColorAxis module
 *
 * (c) 2012-2026 Highsoft AS
 * Author: Pawel Potaczek
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ColorAxis from '../../Core/Axis/Color/ColorAxis.js';
const G: AnyRecord = Highcharts;
G.ColorAxis = G.ColorAxis || ColorAxis;
G.ColorAxis.compose(G.Chart, G.Fx, G.Legend, G.Series);
export default Highcharts;
