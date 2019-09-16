/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */

'use strict';

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class CciIndicator extends SmaIndicator {
            public data: Array<CciIndicatorPoint>;
            public getValues(
                series: Series,
                params: CciIndicatorParamsOptions
            ): (boolean|IndicatorValuesObject);
            public options: CciIndicatorOptions;
            public yData: Array<Array<number>>;
        }

        interface CciIndicatorOptions extends SmaIndicatorOptions {
            params?: CciIndicatorParamsOptions;
        }

        interface CciIndicatorParamsOptions extends SmaIndicatorParamsOptions {
            // declared for inheritance
        }

        class CciIndicatorPoint extends SmaIndicatorPoint {
            public series: CciIndicator;
        }

        interface SeriesTypesDictionary {
            cci: typeof CciIndicator;
        }
    }
}

import U from '../parts/Utilities.js';
var isArray = U.isArray;

var seriesType = H.seriesType;

/* eslint-disable valid-jsdoc */
// Utils:
/**
 * @private
 */
function sumArray(array: Array<number>): number {
    return array.reduce(function (prev, cur): number {
        return prev + cur;
    }, 0);
}

/**
 * @private
 */
function meanDeviation(arr: Array<number>, sma: number): number {
    var len = arr.length,
        sum = 0,
        i: number;

    for (i = 0; i < len; i++) {
        sum += Math.abs(sma - (arr[i]));
    }

    return sum;
}
/* eslint-enable valid-jsdoc */

/**
 * The CCI series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cci
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.CciIndicator>(
    'cci',
    'sma',
    /**
     * Commodity Channel Index (CCI). This series requires `linkedTo` option to
     * be set.
     *
     * @sample stock/indicators/cci
     *         CCI indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @optionparent plotOptions.cci
     */
    {
        params: {
            period: 14
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        getValues: function (
            series: Highcharts.CciIndicator,
            params: Highcharts.CciIndicatorParamsOptions
        ): (boolean|Highcharts.IndicatorValuesObject) {
            var period = (params.period as any),
                xVal = (series.xData as any),
                yVal: Array<Array<number>> = series.yData,
                yValLen: number = yVal ? yVal.length : 0,
                TP: Array<number> = [],
                periodTP: Array<number> = [],
                range = 1,
                CCI: Array<Array<number>> = [],
                xData: Array<number> = [],
                yData: Array<number> = [],
                CCIPoint: number,
                p: Array<number>,
                len: number,
                smaTP: number,
                TPtemp: number,
                meanDev: number,
                i: (number|undefined);

            // CCI requires close value
            if (
                xVal.length <= period ||
                !isArray(yVal[0]) ||
                yVal[0].length !== 4
            ) {
                return false;
            }

            // accumulate first N-points
            while (range < period) {
                p = yVal[range - 1];
                TP.push((p[1] + p[2] + p[3]) / 3);
                range++;
            }

            for (i = period; (i as any) <= yValLen; (i as any)++) {

                p = yVal[(i as any) - 1];
                TPtemp = (p[1] + p[2] + p[3]) / 3;
                len = TP.push(TPtemp);
                periodTP = TP.slice(len - period);

                smaTP = sumArray(periodTP) / period;
                meanDev = meanDeviation(periodTP, smaTP) / period;

                CCIPoint = ((TPtemp - smaTP) / (0.015 * meanDev));

                CCI.push([xVal[(i as any) - 1], CCIPoint]);
                xData.push(xVal[(i as any) - 1]);
                yData.push(CCIPoint);
            }

            return {
                values: CCI,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A `CCI` series. If the [type](#series.cci.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cci
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @apioption series.cci
 */

''; // to include the above in the js output
