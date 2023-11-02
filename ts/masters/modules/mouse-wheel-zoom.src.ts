/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/mouse-wheel-zoom
 * @requires highcharts
 *
 * Mousewheel zoom module
 *
 * (c) 2023 Askel Eirik Johansson
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import MouseWheelZoom from '../../Extensions/MouseWheelZoom/MouseWheelZoom.js';
const G: AnyRecord = Highcharts;
MouseWheelZoom.compose(G.Chart);
