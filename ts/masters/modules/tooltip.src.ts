/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/tooltip
 * @requires highcharts
 *
 * (c) 2010-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import Highcharts from '../../Core/Globals.js';
import Tooltip from '../../Extensions/Tooltip/Tooltip.js';

/* *
 *
 *  Constants
 *
 * */

const G: AnyRecord = Highcharts;

/* *
 *
 *  Compose
 *
 * */

G.Tooltip = Tooltip;

Tooltip.compose(G.setOptions, G.Chart, G.Pointer);
