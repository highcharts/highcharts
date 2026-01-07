// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/drag-panes
 * @requires highcharts
 * @requires highcharts/modules/stock
 *
 * Drag-panes module
 *
 * (c) 2010-2026 Highsoft AS
 * Author: Kacper Madej
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import AxisResizer from '../../Extensions/DragPanes/AxisResizer.js';
import DragPanes from '../../Extensions/DragPanes/DragPanes.js';
const G: AnyRecord = Highcharts;
G.AxisResizer = AxisResizer;
DragPanes.compose(G.Axis, G.Pointer);
export default Highcharts;
