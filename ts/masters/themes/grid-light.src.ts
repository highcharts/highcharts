// SPDX-License-Identifier: LicenseRef-Highcharts
/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/themes/grid-light
 * @requires highcharts
 *
 * (c) 2009-2026 Highsoft AS
 * Author: Torstein Honsi
 *
 * A commercial license may be required depending on use.
 * See www.highcharts.com/license
 */
'use strict';
import H from '../../Core/Globals.js';
import GridLightTheme from '../../Extensions/Themes/GridLight.js';
H.theme = GridLightTheme.options;
GridLightTheme.apply();
export default H;
