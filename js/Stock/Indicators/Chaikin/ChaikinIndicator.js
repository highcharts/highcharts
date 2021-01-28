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
import RequiredIndicatorMixin from '../../../Mixins/IndicatorRequired.js';
import SeriesRegistry from '../../../Core/Series/SeriesRegistry.js';
import '../AD/ADIndicator.js'; // For historic reasons, AD i built into Chaikin
var _a = SeriesRegistry.seriesTypes, AD = _a.ad, EMAIndicator = _a.ema;
import U from '../../../Core/Utilities.js';
var correctFloat = U.correctFloat, extend = U.extend, merge = U.merge, error = U.error;
/* *
 *
 *  Class
 *
 * */
/**
 * The Chaikin series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.chaikin
 *
 * @augments Highcharts.Series
 */
var ChaikinIndicator = /** @class */ (function (_super) {
    __extends(ChaikinIndicator, _super);
    function ChaikinIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         *  Properties
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
    ChaikinIndicator.prototype.init = function () {
        var args = arguments, ctx = this;
        RequiredIndicatorMixin.isParentLoaded(EMAIndicator, 'ema', ctx.type, function (indicator) {
            indicator.prototype.init.apply(ctx, args);
            return;
        });
    };
    ChaikinIndicator.prototype.getValues = function (series, params) {
        var periods = params.periods, period = params.period, 
        // Accumulation Distribution Line data
        ADL, 
        // 0- date, 1- Chaikin Oscillator
        CHA = [], xData = [], yData = [], periodsOffset, 
        // Shorter Period EMA
        SPE, 
        // Longer Period EMA
        LPE, oscillator, i;
        // Check if periods are correct
        if (periods.length !== 2 || periods[1] <= periods[0]) {
            error('Error: "Chaikin requires two periods. Notice, first ' +
                'period should be lower than the second one."');
            return;
        }
        ADL = AD.prototype.getValues.call(this, series, {
            volumeSeriesID: params.volumeSeriesID,
            period: period
        });
        // Check if adl is calculated properly, if not skip
        if (!ADL) {
            return;
        }
        SPE = EMAIndicator.prototype.getValues.call(this, ADL, {
            period: periods[0]
        });
        LPE = EMAIndicator.prototype.getValues.call(this, ADL, {
            period: periods[1]
        });
        // Check if ema is calculated properly, if not skip
        if (!SPE || !LPE) {
            return;
        }
        periodsOffset = periods[1] - periods[0];
        for (i = 0; i < LPE.yData.length; i++) {
            oscillator = correctFloat(SPE.yData[i + periodsOffset] -
                LPE.yData[i]);
            CHA.push([LPE.xData[i], oscillator]);
            xData.push(LPE.xData[i]);
            yData.push(oscillator);
        }
        return {
            values: CHA,
            xData: xData,
            yData: yData
        };
    };
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
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/ema
     * @requires     stock/indicators/chaikin
     * @optionparent plotOptions.chaikin
     */
    ChaikinIndicator.defaultOptions = merge(EMAIndicator.defaultOptions, {
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
    });
    return ChaikinIndicator;
}(EMAIndicator));
extend(ChaikinIndicator.prototype, {
    nameBase: 'Chaikin Osc',
    nameComponents: ['periods']
});
SeriesRegistry.registerSeriesType('chaikin', ChaikinIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default ChaikinIndicator;
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
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/ema
 * @requires  stock/indicators/chaikin
 * @apioption series.chaikin
 */
''; // to include the above in the js output
