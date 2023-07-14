/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @requires highcharts
 *
 * Themes module
 *
 * (c) 2010-2021 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Themes from '../../Extensions/Themes.js';
const G: AnyRecord = Highcharts,
    themes = new Themes();
G.switchTheme = themes.switchTheme;
