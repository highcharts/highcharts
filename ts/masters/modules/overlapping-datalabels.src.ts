/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/modules/overlapping-datalabels
 * @requires highcharts
 *
 * (c) 2009-2021 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../../Core/Globals.js';
import OverlappingDataLabels from '../../Extensions/OverlappingDataLabels.js';
const G: AnyRecord = Highcharts;
OverlappingDataLabels.compose(G.Chart);
