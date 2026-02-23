// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/high-contrast-light
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import HighContrastTheme from '../../Extensions/Themes/HighContrast.js';
H.theme = HighContrastTheme.options;
HighContrastTheme.apply();
export default H;
