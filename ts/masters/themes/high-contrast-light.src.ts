/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/high-contrast-light
 * @requires highcharts
 *
 * (c) 2009-2024 Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import HighContrastLightTheme from '../../Extensions/Themes/HighContrastLight.js';
H.theme = HighContrastLightTheme.options;
HighContrastLightTheme.apply();
export default H;
