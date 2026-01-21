// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/sunset
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import SunsetTheme from '../../Extensions/Themes/Sunset.js';
H.theme = SunsetTheme.options;
SunsetTheme.apply();
export default H;
