'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    seriesType = H.seriesType;

function populateAverage(points, xVal, yVal, i, period) {
    var mmY = yVal[i - 1][3] - yVal[i - period - 1][3],
        mmX = xVal[i - 1];

    points.shift(); // remove point until range < period

    return [mmX, mmY];
}

/**
 * The Momentum series type.
 *
 * @constructor seriesTypes.momentum
 * @augments seriesTypes.sma
 */
seriesType('momentum', 'sma',
    /**
     * Momentum. This series requires `linkedTo` option to be set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/momentum Momentum indicator
     * @since 6.0.0
     * @optionparent plotOptions.momentum
     */
    {
        params: {
            period: 14
        }
    }, {
        nameBase: 'Momentum',
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                xValue = xVal[0],
                yValue = yVal[0],
                MM = [],
                xData = [],
                yData = [],
                index,
                i,
                points,
                MMPoint;

            if (xVal.length <= period) {
                return false;
            }

            // Switch index for OHLC / Candlestick / Arearange
            if (isArray(yVal[0])) {
                yValue = yVal[0][3];
            } else {
                return false;
            }
            // Starting point
            points = [
                [xValue, yValue]
            ];


            // Calculate value one-by-one for each perdio in visible data
            for (i = (period + 1); i < yValLen; i++) {
                MMPoint = populateAverage(points, xVal, yVal, i, period, index);
                MM.push(MMPoint);
                xData.push(MMPoint[0]);
                yData.push(MMPoint[1]);
            }

            MMPoint = populateAverage(points, xVal, yVal, i, period, index);
            MM.push(MMPoint);
            xData.push(MMPoint[0]);
            yData.push(MMPoint[1]);

            return {
                values: MM,
                xData: xData,
                yData: yData
            };
        }
    });

/**
 * A `Momentum` series. If the [type](#series.momentum.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.momentum
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.momentum
 */

/**
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.sma.data
 * @product highstock
 * @apioption series.momentum.data
 */
