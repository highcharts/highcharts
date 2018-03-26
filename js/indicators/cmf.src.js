/**
 * (c) 2010-2017 Highsoft AS
 * Author: Sebastian Domas
 *
 * Chaikin Money Flow indicator for Highstock
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

H.seriesType('cmf', 'sma',
  /**
   * Chaikin Money Flow indicator (cmf).
   *
   * @type {Object}
   * @extends {plotOptions.sma}
   * @product highstock
   * @sample {highstock} stock/indicators/cmf/
   *                     Chaikin Money Flow indicator
   * @since 6.0.0
   * @excluding animationLimit
   * @optionparent plotOptions.cmf
   */
    {
        params: {
            period: 14,

      /**
       * The id of another series to use its data as volume data for the
       * indiator calculation.
       */
            volumeSeriesID: 'volume'
        }
    }, {
        nameBase: 'Chaikin Money Flow',
        /**
         * Checks if the series and volumeSeries are accessible, number of
         * points.x is longer than period, is series has OHLC data
         * @returns {Boolean}
         *          true if series is valid and can be computed, otherwise false
         **/
        isValid: function () {
            var chart = this.chart,
                options = this.options,
                series = this.linkedParent,
                volumeSeries = (
                    this.volumeSeries ||
                    (
                        this.volumeSeries =
                        chart.get(options.params.volumeSeriesID)
                    )
                ),
                isSeriesOHLC = (
                    series &&
                    series.yData &&
                    series.yData[0].length === 4
                );

            function isLengthValid(serie) {
                return serie.xData &&
                    serie.xData.length >= options.params.period;
            }

            return !!(
                series &&
                volumeSeries &&
                isLengthValid(series) &&
                isLengthValid(volumeSeries) && isSeriesOHLC
            );
        },

        /**
         * @typedef {Object} Values
         * @property {Number[][]} values
         *           Combined xData and yData values into a tuple
         * @property {Number[]} xData
         *           Values represent x timestamp values
         * @property {Number[]} yData
         *           Values represent y values
        **/

        /**
         * Returns indicator's data
         * @returns {False | Values}
         *          Returns false if the indicator is not valid, otherwise
         *          returns Values object
        **/
        getValues: function (series, params) {
            if (!this.isValid()) {
                return false;
            }

            return this.getMoneyFlow(
                series.xData,
                series.yData,
                this.volumeSeries.yData,
                params.period
            );
        },

        /**
         * @static
         * @param {Number[]} xData x timestamp values
         * @param {Number[]} seriesYData yData of basic series
         * @param {Number[]} volumeSeriesYData yData of volume series
         * @param {Number} period indicator's param
         * @returns {Values} object containing computed money flow data
        **/
        getMoneyFlow: function (xData, seriesYData, volumeSeriesYData, period) {
            var    len = seriesYData.length,
                moneyFlowVolume = [],
                sumVolume = 0,
                sumMoneyFlowVolume = 0,
                moneyFlowXData = [],
                moneyFlowYData = [],
                values = [],
                i,
                point,
                nullIndex = -1;

            /**
             * Calculates money flow volume, changes i, nullIndex vars from
             * upper scope!
             * @private
             * @param {Number[]} ohlc OHLC point
             * @param {Number} volume Volume point's y value
             * @returns {Number} volume * moneyFlowMultiplier
             **/
            function getMoneyFlowVolume(ohlc, volume) {
                var high = ohlc[1],
                    low = ohlc[2],
                    close = ohlc[3],

                    isValid =
                        volume !== null &&
                        high !== null &&
                        low !== null &&
                        close !== null &&
                        high !== low;


                /**
                 * @private
                 * @param {Number} h High value
                 * @param {Number} l Low value
                 * @param {Number} c Close value
                 * @returns {Number} calculated multiplier for the point
                 **/
                function getMoneyFlowMultiplier(h, l, c) {
                    return ((c - l) - (h - c)) / (h - l);
                }

                return isValid ?
                    getMoneyFlowMultiplier(high, low, close) * volume :
                    ((nullIndex = i), null);
            }


            if (period > 0 && period <= len) {
                for (i = 0; i < period; i++) {
                    moneyFlowVolume[i] = getMoneyFlowVolume(
                        seriesYData[i],
                        volumeSeriesYData[i]
                    );
                    sumVolume += volumeSeriesYData[i];
                    sumMoneyFlowVolume += moneyFlowVolume[i];
                }

                moneyFlowXData.push(xData[i - 1]);
                moneyFlowYData.push(
                    i - nullIndex >= period && sumVolume !== 0 ?
                        sumMoneyFlowVolume / sumVolume :
                        null
                );
                values.push([moneyFlowXData[0], moneyFlowYData[0]]);

                for (; i < len; i++) {
                    moneyFlowVolume[i] = getMoneyFlowVolume(
                        seriesYData[i],
                        volumeSeriesYData[i]
                    );

                    sumVolume -= volumeSeriesYData[i - period];
                    sumVolume += volumeSeriesYData[i];

                    sumMoneyFlowVolume -= moneyFlowVolume[i - period];
                    sumMoneyFlowVolume += moneyFlowVolume[i];

                    point = [
                        xData[i],
                        i - nullIndex >= period ?
                            sumMoneyFlowVolume / sumVolume :
                            null
                    ];

                    moneyFlowXData.push(point[0]);
                    moneyFlowYData.push(point[1]);
                    values.push([point[0], point[1]]);
                }
            }

            return {
                values: values,
                xData: moneyFlowXData,
                yData: moneyFlowYData
            };
        }
    });

/**
 * A `CMF` series. If the [type](#series.cmf.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 6.0.0
 * @extends series,plotOptions.cmf
 * @excluding data,dataParser,dataURL
 * @product highstock
 * @apioption series.cmf
 */

/**
 * An array of data points for the series. For the `CMF` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 6.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.cmf.data
 */
