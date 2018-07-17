'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    seriesType = H.seriesType;

// Utils:
function sumArray(array) {
    return H.reduce(array, function (prev, cur) {
        return prev + cur;
    }, 0);
}

function meanDeviation(arr, sma) {
    var len = arr.length,
        sum = 0,
        i;

    for (i = 0; i < len; i++) {
        sum += Math.abs(sma - (arr[i]));
    }

    return sum;
}

/**
 * The CCI series type.
 *
 * @constructor seriesTypes.cci
 * @augments seriesTypes.sma
 */
seriesType('cci', 'sma',
    /**
     * Commodity Channel Index (CCI). This series requires `linkedTo` option to
     * be set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/cci CCI indicator
     * @since 6.0.0
     * @optionparent plotOptions.cci
     */
    {
        params: {
            period: 14
        }
    }, {
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                TP = [],
                periodTP = [],
                range = 1,
                CCI = [],
                xData = [],
                yData = [],
                CCIPoint, p, len, smaTP, TPtemp, meanDev, i;

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

            for (i = period; i <= yValLen; i++) {

                p = yVal[i - 1];
                TPtemp = (p[1] + p[2] + p[3]) / 3;
                len = TP.push(TPtemp);
                periodTP = TP.slice(len - period);

                smaTP = sumArray(periodTP) / period;
                meanDev = meanDeviation(periodTP, smaTP) / period;

                CCIPoint = ((TPtemp - smaTP) / (0.015 * meanDev));

                CCI.push([xVal[i - 1], CCIPoint]);
                xData.push(xVal[i - 1]);
                yData.push(CCIPoint);
            }

            return {
                values: CCI,
                xData: xData,
                yData: yData
            };
        }
    });

/**
 * A `CCI` series. If the [type](#series.cci.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.cci
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.cci
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.cci.data
 */
