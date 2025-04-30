/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/dynamic-default
 * @requires highcharts
 *
 * (c) 2009-2025 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import DynamicDefault from '../../Extensions/Themes/DynamicDefault.js';
H.theme = DynamicDefault.options;
DynamicDefault.apply();
export default H;
