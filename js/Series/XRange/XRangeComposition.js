/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2021 Torstein Honsi, Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
/* *
 *
 * Imports
 *
 * */
'use strict';
/* *
 *
 *  Imports
 *
 * */
import Axis from '../../Core/Axis/Axis.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, pick = U.pick;
/**
 * Max x2 should be considered in xAxis extremes
 */
addEvent(Axis, 'afterGetSeriesExtremes', function () {
    var axis = this, // eslint-disable-line no-invalid-this
    axisSeries = axis.series, dataMax, modMax;
    if (axis.isXAxis) {
        dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
        axisSeries.forEach(function (series) {
            if (series.x2Data) {
                series.x2Data
                    .forEach(function (val) {
                    if (val > dataMax) {
                        dataMax = val;
                        modMax = true;
                    }
                });
            }
        });
        if (modMax) {
            axis.dataMax = dataMax;
        }
    }
});
