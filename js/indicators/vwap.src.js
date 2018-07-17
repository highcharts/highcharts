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
 * @constructor seriesTypes.vwap
 * @augments seriesTypes.sma
 */
seriesType('vwap', 'sma',
    /**
     * Volume Weighted Average Price indicator.
     *
     * This series requires `linkedTo` option to be set.
     *
     * @extends plotOptions.sma
     * @product highstock
     * @sample {highstock} stock/indicators/vwap
     *                     Volume Weighted Average Price indicator
     * @since 6.0.0
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
             * @type {String}
             * @since 6.0.0
             * @product highstock
             */
            volumeSeriesID: 'volume'
        }
    }, {
        /**
         * Returns the final values of the indicator ready to be presented on a
         * chart
         * @returns {Object} Object containing computed VWAP
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
         * @param {Boolean} isOHLC says if data has OHLC format
         * @param {Array} xValues array of timestamps
         * @param {Array} yValues
         *        array of yValues, can be an array of a four arrays (OHLC) or
         *        array of values (line)
         * @param {Array} volumeSeries volume series
         * @param {Number} period number of points to be calculated
         * @returns {Object} Object contains computed VWAP
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
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.vwap
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.vwap
 */

/**
 * @extends series.sma.data
 * @product highstock
 * @apioption series.vwap.data
 */
