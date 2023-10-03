/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/drilldown
 * @requires highcharts
 *
 * Highcharts Drilldown module
 *
 * Author: Torstein Honsi
 * License: www.highcharts.com/license
 *
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import Drilldown from '../../Extensions/Drilldown.js';
import Breadcrumbs from '../../Extensions/Breadcrumbs/Breadcrumbs.js';
const G: AnyRecord = Highcharts;
G.Breadcrumbs = Breadcrumbs;
Drilldown.compose(G.Chart, G.defaultOptions);
