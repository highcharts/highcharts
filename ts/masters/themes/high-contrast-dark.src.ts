// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/high-contrast-dark
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import HighContrastDarkTheme from '../../Extensions/Themes/HighContrastDark.js';
H.theme = HighContrastDarkTheme.options;
HighContrastDarkTheme.apply();
export default H;
