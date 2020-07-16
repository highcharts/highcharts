/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
import U from '../../Core/Utilities.js';
var correctFloat = U.correctFloat, error = U.error, seriesType = U.seriesType;
import requiredIndicator from '../../Mixins/IndicatorRequired.js';
var EMA = H.seriesTypes.ema;
/**
 * The PPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ppo
 *
 * @augments Highcharts.Series
 */
seriesType('ppo', 'ema', 
/**
 * Percentage Price Oscillator. This series requires the
 * `linkedTo` option to be set and should be loaded after the
 * `stock/indicators/indicators.js` and `stock/indicators/ema.js`.
 *
 * @sample {highstock} stock/indicators/ppo
 *         Percentage Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ema
 * @requires     stock/indicators/ppo
 * @optionparent plotOptions.ppo
 */
{
    /**
     * Paramters used in calculation of Percentage Price Oscillator series
     * points.
     *
     * @excluding period
     */
    params: {
        /**
         * Periods for Percentage Price Oscillator calculations.
         *
         * @type    {Array<number>}
         * @default [12, 26]
         */
        periods: [12, 26]
    }
}, 
/**
 * @lends Highcharts.Series.prototype
 */
{
    nameBase: 'PPO',
    nameComponents: ['periods'],
    init: function () {
        var args = arguments, ctx = this;
        requiredIndicator.isParentLoaded(EMA, 'ema', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    },
    getValues: function (series, params) {
        var periods = params.periods, index = params.index, 
        // 0- date, 1- Percentage Price Oscillator
        PPO = [], xData = [], yData = [], periodsOffset, 
        // Shorter Period EMA
        SPE, 
        // Longer Period EMA
        LPE, oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            error('Error: "PPO requires two periods. Notice, first period ' +
                'should be lower than the second one."');
            return;
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
            return;
        }
        periodsOffset = periods[1] - periods[0];
        for (i = 0; i < LPE.yData.length; i++) {
            oscillator = correctFloat((SPE.yData[i + periodsOffset] -
                LPE.yData[i]) /
                LPE.yData[i] *
                100);
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
});
/**
 * A `Percentage Price Oscillator` series. If the [type](#series.ppo.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.ppo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/ppo
 * @apioption series.ppo
 */
''; // to include the above in the js output
