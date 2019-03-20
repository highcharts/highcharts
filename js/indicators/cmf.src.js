/* *
 *
 *  (c) 2010-2019 Highsoft AS
 *
 *  Author: Sebastian Domas
 *
 *  Chaikin Money Flow indicator for Highstock
 *
 *  License: www.highcharts.com/license
 *
 * */

/**
 * @private
 * @interface Highcharts.CmfValuesObject
 *//**
 * Combined xData and yData values into a tuple.
 * @name Highcharts.CmfValuesObject#values
 * @type {Array<Array<number,number>>}
 *//**
 * Values represent x timestamp values
 * @name Highcharts.CmfValuesObject#xData
 * @type {Array<number>}
 *//**
 * Values represent y values
 * @name Highcharts.CmfValuesObject#yData
 * @type {Array<number>}
 */

'use strict';

import H from '../parts/Globals.js';

/**
 * The CMF series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmf
 *
 * @augments Highcharts.Series
 */
H.seriesType('cmf', 'sma',
    /**
     * Chaikin Money Flow indicator (cmf).
     *
     * @sample stock/indicators/cmf/
     *         Chaikin Money Flow indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @excluding    animationLimit
     * @product      highstock
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
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Chaikin Money Flow',
        /**
         * Checks if the series and volumeSeries are accessible, number of
         * points.x is longer than period, is series has OHLC data
         * @private
         * @return {boolean} True if series is valid and can be computed,
         * otherwise false.
         */
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
         * Returns indicator's data.
         * @private
         * @return {boolean|Highcharts.CmfValuesObject} Returns false if the
         * indicator is not valid, otherwise returns Values object.
         */
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
         * @private
         * @param {Array<number>} xData - x timestamp values
         * @param {Array<number>} seriesYData - yData of basic series
         * @param {Array<number>} volumeSeriesYData - yData of volume series
         * @param {number} period - indicator's param
         * @return {Highcharts.CmfValuesObject} object containing computed money
         * flow data
         */
        getMoneyFlow: function (xData, seriesYData, volumeSeriesYData, period) {
            var len = seriesYData.length,
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
             * @param {Array<number>} ohlc - OHLC point
             * @param {number} volume - Volume point's y value
             * @return {number} - volume * moneyFlowMultiplier
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
                 * @param {number} h - High value
                 * @param {number} l - Low value
                 * @param {number} c - Close value
                 * @return {number} calculated multiplier for the point
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
 * @extends   series,plotOptions.cmf
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @apioption series.cmf
 */
