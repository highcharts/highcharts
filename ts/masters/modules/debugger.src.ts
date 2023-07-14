/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/debugger
 * @requires highcharts
 *
 * Debugger module
 *
 * (c) 2012-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

'use strict';

import Highcharts from '../../Core/Globals.js';
import Debugger from '../../Extensions/Debugger/Debugger.js';
import ErrorMessages from '../../Extensions/Debugger/ErrorMessages.js';
const G: AnyRecord = Highcharts;
G.errorMessages = ErrorMessages;
Debugger.compose(G.Chart);
