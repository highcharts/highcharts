/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/broken-axis
 * @requires highcharts
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import BrokenAxisAdditions from '../../Core/Axis/BrokenAxisComposition.js';
const G: AnyRecord = Highcharts;
// Compositions
BrokenAxisAdditions.compose(G.Axis, G.Series);
