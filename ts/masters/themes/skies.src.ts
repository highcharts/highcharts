/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/skies
 * @requires highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import SkiesTheme from '../../Extensions/Themes/Skies.js';
H.theme = SkiesTheme.options;
SkiesTheme.apply();
export default H;
