'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import requiredIndicatorMixin from '../mixins/indicator-required.js';

var EMA = H.seriesTypes.ema,
    error = H.error,
    parentLoaded = requiredIndicatorMixin.isParentIndicatorLoaded;

H.seriesType('apo', 'ema',
    /**
     * Absolute Price Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`
     * and `stock/indicators/ema.js`.
     *
     * @extends plotOptions.ema
     * @product highstock
     * @sample {highstock} stock/indicators/apo
     *                     Absolute Price Oscillator
     * @since 7.0.0
     * @excluding
     *             allAreas,colorAxis,joinBy,keys,stacking,
     *             showInNavigator,navigatorOptions,pointInterval,
     *             pointIntervalUnit,pointPlacement,pointRange,pointStart
     * @optionparent plotOptions.apo
     */
    {
        /**
         * Paramters used in calculation of Absolute Price Oscillator
         * series points.
         * @excluding period
         */
        params: {
            /**
             * Periods for Absolute Price Oscillator calculations.
             * @default [10, 20]
             * @type {Array}
             * @since 7.0.0
             */
            periods: [10, 20]
        }
    }, /** @lends Highcharts.Series.prototype */ {
        nameBase: 'APO',
        nameComponents: ['periods'],
        init: function () {
            var args = arguments,
                ctx = this;

            parentLoaded(
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
                APO = [], // 0- date, 1- Absolute price oscillator
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
                    'Error: "APO requires two periods. Notice, first period ' +
                    'should be lower then the second one."'
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
                oscillator = SPE.yData[i + periodsOffset] - LPE.yData[i];

                APO.push([LPE.xData[i], oscillator]);
                xData.push(LPE.xData[i]);
                yData.push(oscillator);
            }

            return {
                values: APO,
                xData: xData,
                yData: yData
            };
        }
    }
);

/**
 * An `Absolute Price Oscillator` series. If the [type](#series.apo.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @type {Object}
 * @since 7.0.0
 * @extends series,plotOptions.apo
 * @excluding   data,dataParser,dataURL
 *              allAreas,colorAxis,joinBy,
 *              keys,stacking,showInNavigator,navigatorOptions,pointInterval,
 *              pointIntervalUnit,pointPlacement,pointRange,pointStart
 * @product highstock
 * @apioption series.apo
 */

/**
 * An array of data points for the series. For the `apo` series type,
 * points are calculated dynamically.
 *
 * @type {Array<Object|Array>}
 * @since 7.0.0
 * @extends series.line.data
 * @product highstock
 * @apioption series.apo.data
 */
