/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/a11y
 * @requires highcharts
 *
 * Accessibility module
 *
 * (c) 2010-2025 Highsoft AS
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import A11y from '../../A11y/a11y.js';
A11y.compose((Highcharts as AnyRecord).Chart);
export default Highcharts;
