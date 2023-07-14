/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/datagrouping
 * @requires highcharts
 *
 * Data grouping module
 *
 * (c) 2010-2021 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ApproximationDefaults from '../../Extensions/DataGrouping/ApproximationDefaults.js';
import ApproximationRegistry from '../../Extensions/DataGrouping/ApproximationRegistry.js';
import DataGrouping from '../../Extensions/DataGrouping/DataGrouping.js';
const G: AnyRecord = Highcharts;
G.dataGrouping = {
    approximationDefaults: ApproximationDefaults,
    approximations: ApproximationRegistry
};
DataGrouping.compose(G.Axis, G.Series, G.Tooltip);
