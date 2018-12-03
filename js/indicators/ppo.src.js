'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMA = H.seriesTypes.ema,
    error = H.error,
    correctFloat = H.correctFloat,
    requiredIndicator = requiredIndicatorMixin;

H.seriesType('ppo', 'ema',
    /**
     * Percentage Price Oscillator. This series requires the
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
     *
     * @extends plotOptions.ema
     * @product highstock
     * @sample {highstock} stock/indicators/ppo
     *                     Percentage Price Oscillator
     * @since 7.0.0
     * @excluding
     *             allAreas,colorAxis,joinBy,keys,stacking,
     *             showInNavigator,navigatorOptions,pointInterval,
     *             pointIntervalUnit,pointPlacement,pointRange,pointStart
     * @optionparent plotOptions.ppo
     */
    {
        /**
         * Paramters used in calculation of Percentage Price Oscillator
         * series points.
         * @excluding period
         */
        params: {
            /**
             * Periods for Percentage Price Oscillator calculations.
             * @default [12, 26]
             * @type {Array}
             * @since 7.0.0
             */
            periods: [12, 26]
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameBase: 'PPO',
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
                index = params.index,
                PPO = [], // 0- date, 1- Percentage Price Oscillator
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
                    'Error: "PPO requires two periods. Notice, first period ' +
                    'should be lower than the second one."'
                );
                return false;
            }

            SPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[0]
            });

            LPE = EMA.prototype.getValues.call(this, series, {
                index: index,
                period: periods[1]
            });

            // Check if ema is calculated properly, if not skip
            if (!SPE || !LPE) {
                return false;
            }

            periodsOffset = periods[1] - periods[0];

            for (i = 0; i < LPE.yData.length; i++) {
                oscillator = correctFloat(
                    (SPE.yData[i + periodsOffset] - LPE.yData[i]) /
                    LPE.yData[i] *
                    100
                );

                PPO.push([LPE.xData[i], oscillator]);
                xData.push(LPE.xData[i]);
                yData.push(oscillator);
            }

            return {
                values: PPO,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * A `Percentage Price Oscillator` series. If the [type](#series.ppo.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.ppo
 * @excluding   data,dataParser,dataURL
 *              allAreas,colorAxis,joinBy,
 *              keys,stacking,showInNavigator,navigatorOptions,pointInterval,
 *              pointIntervalUnit,pointPlacement,pointRange,pointStart
 * @product highstock
 * @apioption series.ppo
 */

/**
 * An array of data points for the series. For the `ppo` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.ppo.data
 */
