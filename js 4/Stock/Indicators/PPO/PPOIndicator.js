/* *
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
var EMAIndicator = SeriesRegistry.seriesTypes.ema;
import U from '../../../Core/Utilities.js';
var correctFloat = U.correctFloat, extend = U.extend, merge = U.merge, error = U.error;
/* *
 *
 *  Class
 *
 * */
/**
 * The PPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.ppo
 *
 * @augments Highcharts.Series
 */
var PPOIndicator = /** @class */ (function (_super) {
    __extends(PPOIndicator, _super);
    function PPOIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
        *
        *   Properties
        *
        * */
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    PPOIndicator.prototype.getValues = function (series, params) {
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
        SPE = EMAIndicator.prototype.getValues.call(this, series, {
            index: index,
            period: periods[0]
        });
        LPE = EMAIndicator.prototype.getValues.call(this, series, {
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
    };
    /**
     * Percentage Price Oscillator. This series requires the
     * `linkedTo` option to be set and should be loaded after the
     * `stock/indicators/indicators.js`.
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
     * @requires     stock/indicators/ppo
     * @optionparent plotOptions.ppo
     */
    PPOIndicator.defaultOptions = merge(EMAIndicator.defaultOptions, {
        /**
         * Paramters used in calculation of Percentage Price Oscillator series
         * points.
         *
         * @excluding period
         */
        params: {
            period: void 0,
            /**
             * Periods for Percentage Price Oscillator calculations.
             *
             * @type    {Array<number>}
             * @default [12, 26]
             */
            periods: [12, 26]
        }
    });
    return PPOIndicator;
}(EMAIndicator));
extend(PPOIndicator.prototype, {
    nameBase: 'PPO',
    nameComponents: ['periods']
});
SeriesRegistry.registerSeriesType('ppo', PPOIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default PPOIndicator;
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
 * @requires  stock/indicators/ppo
 * @apioption series.ppo
 */
''; // to include the above in the js output
