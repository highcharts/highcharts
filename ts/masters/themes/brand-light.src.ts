/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/brand-light
 * @requires highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import BrandLight from '../../Extensions/Themes/BrandLight.js';
H.theme = BrandLight.options;
BrandLight.apply();
export default H;
