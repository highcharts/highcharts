/**
 * (c) 2010-2017 Paweł Dalek
 *
 * Volume Weighted Average Price (VWAP) indicator for Highstock
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var isArray = H.isArray,
    seriesType = H.seriesType;

/**
 * The Volume Weighted Average Price (VWAP) series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.vwap
 *
 * @augments Highcharts.Series
 */
seriesType('vwap', 'sma',
    /**
     * Volume Weighted Average Price indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/vwap
     *         Volume Weighted Average Price indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @optionparent plotOptions.vwap
     */
    {
        /**
         * @excluding index
         */
        params: {
            period: 30,
            /**
             * The id of volume series which is mandatory. For example using
             * OHLC data, volumeSeriesID='volume' means the indicator will be
             * calculated using OHLC and volume values.
             *
             * @since 6.0.0
             */
            volumeSeriesID: 'volume'
        }
    }, {
        /**
         * Returns the final values of the indicator ready to be presented on a
         * chart
         *
         * @function Highcharts.seriesTypes.vwap#getValues
         *
         * @return {object}
         *         Object containing computed VWAP
         **/
        getValues: function (series, params) {
            var indicator = this,
                chart = series.chart,
                xValues = series.xData,
                yValues = series.yData,
                period = params.period,
                isOHLC = true,
                volumeSeries;

            // Checks if volume series exists
            if (!(volumeSeries = chart.get(params.volumeSeriesID))) {
                return H.error(
                    'Series ' +
                    params.volumeSeriesID +
                    ' not found! Check `volumeSeriesID`.',
                    true
                );
            }

            // Checks if series data fits the OHLC format
            if (!(isArray(yValues[0]))) {
                isOHLC = false;
            }

            return indicator.calculateVWAPValues(
                isOHLC,
                xValues,
                yValues,
                volumeSeries,
                period
            );
        },
        /**
         * Main algorithm used to calculate Volume Weighted Average Price (VWAP)
         * values
         *
         * @function Highcharts.seriesTypes.vwap#calculateVWAPValues
         *
         * @param {boolean} isOHLC
         *        says if data has OHLC format
         *
         * @param {Array<number>} xValues
         *        array of timestamps
         *
         * @param {Array<number|Array<number,number,number,number>>} yValues
         *        array of yValues, can be an array of a four arrays (OHLC) or
         *        array of values (line)
         *
         * @param {Array<*>} volumeSeries
         *        volume series
         *
         * @param {number} period
         *        number of points to be calculated
         *
         * @return {object}
         *         Object contains computed VWAP
         **/
        calculateVWAPValues: function (
            isOHLC,
            xValues,
            yValues,
            volumeSeries,
            period
        ) {
            var volumeValues = volumeSeries.yData,
                volumeLength = volumeSeries.xData.length,
                pointsLength = xValues.length,
                cumulativePrice = [],
                cumulativeVolume = [],
                xData = [],
                yData = [],
                VWAP = [],
                commonLength,
                typicalPrice,
                cPrice,
                cVolume,
                i,
                j;

            if (pointsLength <= volumeLength) {
                commonLength = pointsLength;
            } else {
                commonLength = volumeLength;
            }

            for (i = 0, j = 0; i < commonLength; i++) {
                // Depending on whether series is OHLC or line type, price is
                // average of the high, low and close or a simple value
                typicalPrice = isOHLC ?
                    ((yValues[i][1] + yValues[i][2] + yValues[i][3]) / 3) :
                    yValues[i];
                typicalPrice *= volumeValues[i];

                cPrice = j ?
                    (cumulativePrice[i - 1] + typicalPrice) :
                    typicalPrice;
                cVolume = j ?
                    (cumulativeVolume[i - 1] + volumeValues[i]) :
                    volumeValues[i];

                cumulativePrice.push(cPrice);
                cumulativeVolume.push(cVolume);

                VWAP.push([xValues[i], (cPrice / cVolume)]);
                xData.push(VWAP[i][0]);
                yData.push(VWAP[i][1]);

                j++;

                if (j === period) {
                    j = 0;
                }
            }

            return {
                values: VWAP,
                xData: xData,
                yData: yData
            };
        }
    });

/**
 * A `Volume Weighted Average Price (VWAP)` series. If the
 * [type](#series.vwap.type) option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.vwap
 * @since     6.0.0
 * @excluding data, dataParser, dataURL
 * @product   highstock
 * @apioption series.vwap
 */

/**
 * @extends   series.sma.data
 * @product   highstock
 * @apioption series.vwap.data
 */
