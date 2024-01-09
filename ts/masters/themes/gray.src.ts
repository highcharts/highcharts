/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/gray
 * @requires highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import GrayTheme from '../../Extensions/Themes/Gray.js';
H.theme = GrayTheme.options;
GrayTheme.apply();
export default H;
