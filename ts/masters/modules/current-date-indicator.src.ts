/**
 * @license Highcharts Gantt JS v@product.version@ (@product.date@)
 * @module highcharts/modules/current-date-indicator
 * @requires highcharts
 *
 * CurrentDateIndicator
 *
 * (c) 2010-@product.year@ Highsoft AS
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import CurrentDateIndication from '../../Extensions/CurrentDateIndication.js';
const G: AnyRecord = Highcharts;
CurrentDateIndication.compose(G.Axis, G.PlotLineOrBand);
export default Highcharts;
