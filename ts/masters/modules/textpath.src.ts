/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/textpath-support
 * @requires highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import TextPath from '../../Extensions/TextPath.js';
const G: AnyRecord = Highcharts;
G.TextPath = TextPath;
G.TextPath.compose(G.SVGElement);
export default Highcharts;
