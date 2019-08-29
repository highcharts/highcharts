/* *
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../parts/Globals.js';
import './accumulation-distribution.src.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMA = H.seriesTypes.ema,
    AD = H.seriesTypes.ad,
    error = H.error,
    correctFloat = H.correctFloat,
    requiredIndicator = requiredIndicatorMixin;

/**
 * The Chaikin series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.chaikin
 *
 * @augments Highcharts.Series
 */
H.seriesType(
    'chaikin',
    'ema',
    /**
     * Chaikin Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/ema.js`.
     *
     * @sample {highstock} stock/indicators/chaikin
     *         Chaikin Oscillator
     *
     * @extends      plotOptions.ema
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
     *               pointInterval, pointIntervalUnit, pointPlacement,
     *               pointRange, pointStart, showInNavigator, stacking
     * @optionparent plotOptions.chaikin
     */
    {
        /**
         * Paramters used in calculation of Chaikin Oscillator
         * series points.
         *
         * @excluding index, period
         */
        params: {
            /**
             * The id of volume series which is mandatory.
             * For example using OHLC data, volumeSeriesID='volume' means
             * the indicator will be calculated using OHLC and volume values.
             */
            volumeSeriesID: 'volume',
            /**
             * Periods for Chaikin Oscillator calculations.
             *
             * @type    {Array<number>}
             * @default [3, 10]
             */
            periods: [3, 10]
        }
    },
    /**
     * @lends Highcharts.Series#
     */
    {
        nameBase: 'Chaikin Osc',
        nameComponents: ['periods'],
        init: function () {
            var args = arguments,
                ctx = this;

            requiredIndicator.isParentLoaded(
                EMA,
                'ema',
                ctx.type,
                function (indicator) {
                    indicator.prototype.init.apply(ctx, args);
                }
            );
        },
        getValues: function (series, params) {
            var periods = params.periods,
                period = params.period,
                ADL, // Accumulation Distribution Line data
                CHA = [], // 0- date, 1- Chaikin Oscillator
                xData = [],
                yData = [],
                periodsOffset,
                SPE, // Shorter Period EMA
                LPE, // Longer Period EMA
                oscillator,
                i;

            // Check if periods are correct
            if (periods.length !== 2 || periods[1] <= periods[0]) {
                error(
                    'Error: "Chaikin requires two periods. Notice, first ' +
                    'period should be lower than the second one."'
                );
                return false;
            }

            ADL = AD.prototype.getValues.call(this, series, {
                volumeSeriesID: params.volumeSeriesID,
                period: period
            });

            // Check if adl is calculated properly, if not skip
            if (!ADL) {
                return false;
            }

            SPE = EMA.prototype.getValues.call(this, ADL, {
                period: periods[0]
            });

            LPE = EMA.prototype.getValues.call(this, ADL, {
                period: periods[1]
            });

            // Check if ema is calculated properly, if not skip
            if (!SPE || !LPE) {
                return false;
            }

            periodsOffset = periods[1] - periods[0];

            for (i = 0; i < LPE.yData.length; i++) {
                oscillator = correctFloat(
                    SPE.yData[i + periodsOffset] - LPE.yData[i]
                );

                CHA.push([LPE.xData[i], oscillator]);
                xData.push(LPE.xData[i]);
                yData.push(oscillator);
            }

            return {
                values: CHA,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A `Chaikin Oscillator` series. If the [type](#series.chaikin.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.chaikin
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, stacking, showInNavigator
 * @apioption series.chaikin
 */
