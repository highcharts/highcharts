/**
 * @license  @product.name@ JS v@product.version@ (@product.date@)
 *
 * Money Flow Index indicator for Highstock
 *
 * (c) 2010-2017 Grzegorz Blachliński
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    reduce = H.reduce;

    // Utils:
function sumArray(array) {

    return reduce(array, function (prev, cur) {
        return prev + cur;
    });
}

function toFixed(a, n) {
    return parseFloat(a.toFixed(n));
}

function calculateTypicalPrice(point) {
    return (point[1] + point[2] + point[3]) / 3;
}

function calculateRawMoneyFlow(typicalPrice, volume) {
    return typicalPrice * volume;
}
/**
 * The MFI series type.
 *
 * @constructor seriesTypes.mfi
 * @augments seriesTypes.sma
 */
H.seriesType('mfi', 'sma',

    /**
     * Money Flow Index. This series requires `linkedTo` option to be set and
     * should be loaded after the `stock/indicators/indicators.js` file.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/mfi
     *                     Money Flow Index Indicator
     * @since 6.0.0
     * @optionparent plotOptions.mfi
     */

    {
        /**
         * @excluding index
         */
        params: {
            period: 14,
            /**
             * The id of volume series which is mandatory.
             * For example using OHLC data, volumeSeriesID='volume' means
             * the indicator will be calculated using OHLC and volume values.
             *
             * @type {String}
             * @since 6.0.0
             * @product highstock
             */
            volumeSeriesID: 'volume',
            /**
             * Number of maximum decimals that are used in MFI calculations.
             *
             * @type {Number}
             * @since 6.0.0
             * @product highstock
             */
            decimals: 4

        }
    }, {
        nameBase: 'Money Flow Index',
        getValues: function (series, params) {
            var period = params.period,
                xVal = series.xData,
                yVal = series.yData,
                yValLen = yVal ? yVal.length : 0,
                decimals = params.decimals,
                // MFI starts calculations from the second point
                // Cause we need to calculate change between two points
                range = 1,
                volumeSeries = series.chart.get(params.volumeSeriesID),
                yValVolume = volumeSeries && volumeSeries.yData,
                MFI = [],
                isUp = false,
                xData = [],
                yData = [],
                positiveMoneyFlow = [],
                negativeMoneyFlow = [],
                newTypicalPrice,
                oldTypicalPrice,
                rawMoneyFlow,
                negativeMoneyFlowSum,
                positiveMoneyFlowSum,
                moneyFlowRatio,
                MFIPoint, i;

            if (!volumeSeries) {
                return H.error(
                    'Series ' +
                    params.volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true
                );
            }

            // MFI requires high low and close values
            if (
                (xVal.length <= period) || !isArray(yVal[0]) ||
                yVal[0].length !== 4 ||
                !yValVolume
            ) {
                return false;
            }
            // Calculate first typical price
            newTypicalPrice = calculateTypicalPrice(yVal[range]);
            // Accumulate first N-points
            while (range < period + 1) {
                // Calculate if up or down
                oldTypicalPrice = newTypicalPrice;
                newTypicalPrice = calculateTypicalPrice(yVal[range]);
                isUp = newTypicalPrice >= oldTypicalPrice ? true : false;
                // Calculate raw money flow
                rawMoneyFlow = calculateRawMoneyFlow(
                    newTypicalPrice,
                    yValVolume[range]
                );
                // Add to array
                positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
                negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
                range++;
            }
            for (i = range - 1; i < yValLen; i++) {
                if (i > range - 1) {
                    // Remove first point from array
                    positiveMoneyFlow.shift();
                    negativeMoneyFlow.shift();
                    // Calculate if up or down
                    oldTypicalPrice = newTypicalPrice;
                    newTypicalPrice = calculateTypicalPrice(yVal[i]);
                    isUp = newTypicalPrice > oldTypicalPrice ? true : false;
                    // Calculate raw money flow
                    rawMoneyFlow = calculateRawMoneyFlow(
                        newTypicalPrice,
                        yValVolume[i]
                    );
                    // Add to array
                    positiveMoneyFlow.push(isUp ? rawMoneyFlow : 0);
                    negativeMoneyFlow.push(isUp ? 0 : rawMoneyFlow);
                }

                // Calculate sum of negative and positive money flow:
                negativeMoneyFlowSum = sumArray(negativeMoneyFlow);
                positiveMoneyFlowSum = sumArray(positiveMoneyFlow);

                moneyFlowRatio = positiveMoneyFlowSum / negativeMoneyFlowSum;
                MFIPoint = toFixed(
                    100 - (100 / (1 + moneyFlowRatio)),
                    decimals
                );
                MFI.push([xVal[i], MFIPoint]);
                xData.push(xVal[i]);
                yData.push(MFIPoint);
            }

            return {
                values: MFI,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A `MFI` series. If the [type](#series.mfi.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.mfi
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.mfi
 */

/**
 * An array of data points for the series. For the `mfi` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.mfi.data
 */
