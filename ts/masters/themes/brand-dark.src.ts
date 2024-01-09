/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/brand-dark
 * @requires highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import BrandDark from '../../Extensions/Themes/BrandDark.js';
H.theme = BrandDark.options;
BrandDark.apply();
export default H;
