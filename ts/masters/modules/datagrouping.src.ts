/**
 * @license Highstock JS v@product.version@ (@product.date@)
 * @module highcharts/modules/datagrouping
 * @requires highcharts
 *
 * Data grouping module
 *
 * (c) 2010-2024 Torstein Hønsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import ApproximationDefaults from '../../Extensions/DataGrouping/ApproximationDefaults.js';
import ApproximationRegistry from '../../Extensions/DataGrouping/ApproximationRegistry.js';
import DataGrouping from '../../Extensions/DataGrouping/DataGrouping.js';
const G: AnyRecord = Highcharts;
G.dataGrouping = G.dataGrouping || {};
G.dataGrouping.approximationDefaults = (
    G.dataGrouping.approximationDefaults ||
    ApproximationDefaults
);
G.dataGrouping.approximations = (
    G.dataGrouping.approximations ||
    ApproximationRegistry
);
DataGrouping.compose(G.Axis, G.Series, G.Tooltip);
export default Highcharts;
