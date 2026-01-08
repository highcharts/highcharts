// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/mouse-wheel-zoom
 * @requires highcharts
 *
 * Mousewheel zoom module
 *
 * (c) 2023-2026 Highsoft AS
 * Author: Askel Eirik Johansson
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import MouseWheelZoom from '../../Extensions/MouseWheelZoom/MouseWheelZoom.js';
const G: AnyRecord = Highcharts;
G.MouseWheelZoom = G.MouseWheelZoom || MouseWheelZoom;
G.MouseWheelZoom.compose(G.Chart);
export default Highcharts;
