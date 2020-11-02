/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import BaseSeries from '../../Core/Series/Series.js';
var seriesTypes = BaseSeries.seriesTypes;
import RequiredIndicatorMixin from '../../Mixins/IndicatorRequired.js';
// im port './StochasticIndicator.js';
/**
 * The Slow Stochastic series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.slowstochastic
 *
 * @augments Highcharts.Series
 */
BaseSeries.seriesType('slowstochastic', 'stochastic', 
/**
 * Slow Stochastic oscillator. This series requires the `linkedTo` option
 * to be set and should be loaded after `stock/indicators/indicators.js`
 * and `stock/indicators/stochastic.js` files.
 *
 * @sample stock/indicators/slow-stochastic
 *         Slow Stochastic oscillator
 *
 * @extends      plotOptions.stochastic
 * @since        8.0.0
 * @product      highstock
 * @requires     stock/indicators/indicators
 * @requires     stock/indicators/stochastic
 * @requires     stock/indicators/slowstochastic
 * @optionparent plotOptions.slowstochastic
 */
{
    params: {
        /**
         * Periods for Slow Stochastic oscillator: [%K, %D, SMA(%D)].
         *
         * @type    {Array<number,number,number>}
         * @default [14, 3, 3]
         */
        periods: [14, 3, 3]
    }
}, 
/**
 * @lends Highcharts.Series#
 */
{
    nameBase: 'Slow Stochastic',
    init: function () {
        var args = arguments, ctx = this;
        RequiredIndicatorMixin.isParentLoaded(seriesTypes.stochastic, 'stochastic', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    },
    getValues: function (series, params) {
        var periods = params.periods, fastValues = seriesTypes.stochastic.prototype.getValues.call(this, series, params), slowValues = {
            values: [],
            xData: [],
            yData: []
        };
        var i = 0;
        if (!fastValues) {
            return;
        }
        slowValues.xData = fastValues.xData.slice(periods[1] - 1);
        var fastYData = fastValues.yData.slice(periods[1] - 1);
        // Get SMA(%D)
        var smoothedValues = seriesTypes.sma.prototype.getValues.call(this, {
            xData: slowValues.xData,
            yData: fastYData
        }, {
            index: 1,
            period: periods[2]
        });
        if (!smoothedValues) {
            return;
        }
        var xDataLen = slowValues.xData.length;
        // Format data
        for (; i < xDataLen; i++) {
            slowValues.yData[i] = [
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];
            slowValues.values[i] = [
                slowValues.xData[i],
                fastYData[i][1],
                smoothedValues.yData[i - periods[2] + 1] || null
            ];
        }
        return slowValues;
    }
});
/**
 * A Slow Stochastic indicator. If the [type](#series.slowstochastic.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.slowstochastic
 * @since     8.0.0
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/stochastic
 * @requires  stock/indicators/slowstochastic
 * @apioption series.slowstochastic
 */
''; // to include the above in the js output
