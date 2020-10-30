/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import BaseSeries from '../../Core/Series/Series.js';
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
import U from '../../Core/Utilities.js';
var error = U.error;
// im port './EMAIndicator.js';
var EMA = BaseSeries.seriesTypes.ema;
/**
 * The APO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.apo
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType('apo', 'ema', 
/**
 * Absolute Price Oscillator. This series requires the `linkedTo` option to
 * be set and should be loaded after the `stock/indicators/indicators.js`
 * and `stock/indicators/ema.js`.
 *
 * @sample {highstock} stock/indicators/apo
 *         Absolute Price Oscillator
 *
 * @extends      plotOptions.ema
 * @since        7.0.0
 * @product      highstock
 * @excluding    allAreas, colorAxis, joinBy, keys, navigatorOptions,
 *               pointInterval, pointIntervalUnit, pointPlacement,
 *               pointRange, pointStart, showInNavigator, stacking
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/ema
 * @requires     stock/indicators/apo
 * @optionparent plotOptions.apo
 */
{
    /**
     * Paramters used in calculation of Absolute Price Oscillator
     * series points.
     *
     * @excluding period
     */
    params: {
        /**
         * Periods for Absolute Price Oscillator calculations.
         *
         * @type    {Array<number>}
         * @default [10, 20]
         * @since   7.0.0
         */
        periods: [10, 20]
    }
}, 
/**
 * @lends Highcharts.Series.prototype
 */
{
    nameBase: 'APO',
    nameComponents: ['periods'],
    init: function () {
        var args = arguments, ctx = this;
        RequiredIndicatorMixin.isParentLoaded(EMA, 'ema', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    },
    getValues: function (series, params) {
        var periods = params.periods, index = params.index, 
        // 0- date, 1- Absolute price oscillator
        APO = [], xData = [], yData = [], periodsOffset, 
        // Shorter Period EMA
        SPE, 
        // Longer Period EMA
        LPE, oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            error('Error: "APO requires two periods. Notice, first period ' +
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
            oscillator = (SPE.yData[i + periodsOffset] -
                LPE.yData[i]);
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
});
/**
 * An `Absolute Price Oscillator` series. If the [type](#series.apo.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.apo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, dataParser, dataURL, joinBy, keys,
 *            navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/apo
 * @apioption series.apo
 */
''; // to include the above in the js output
