/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/arrow-symbols
 * @requires highcharts
 *
 * Arrow Symbols
 *
 * (c) 2017-2021 Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ArrowSymbols from '../../Extensions/ArrowSymbols.js';
const G: AnyRecord = Highcharts;
ArrowSymbols.compose(G.SVGRenderer);
