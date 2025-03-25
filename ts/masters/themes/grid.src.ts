/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/grid
 * @requires highcharts
 *
 * (c) 2009-@product.year@ Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import GridTheme from '../../Extensions/Themes/Grid.js';
H.theme = GridTheme.options;
GridTheme.apply();
export default H;
