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
const {
    addEvent,
    pick
} = U;
import XRangeSeries from './XRangeSeries.js';


/**
 * Max x2 should be considered in xAxis extremes
 */
addEvent(Axis, 'afterGetSeriesExtremes', function (): void {
    var axis = this, // eslint-disable-line no-invalid-this
        axisSeries = axis.series,
        dataMax: (number|undefined),
        modMax: (boolean|undefined);

    if (axis.isXAxis) {
        dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
        axisSeries.forEach(function (series): void {
            if ((series as XRangeSeries).x2Data) {
                (series as XRangeSeries).x2Data
                    .forEach(function (val: (number|undefined)): void {
                        if ((val as any) > (dataMax as any)) {
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
