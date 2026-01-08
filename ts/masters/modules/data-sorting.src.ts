/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/data-sorting
 * @requires highcharts
 *
 * Data sorting module
 *
 * (c) 2025-2025 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';

import Highcharts from '../../Core/Globals.js';
import DataSorting from '../../Extensions/DataSorting/DataSortingComposition.js';

const G: AnyRecord = Highcharts;

// Compose
DataSorting.compose(G.Chart, G.Series);

export default Highcharts;
