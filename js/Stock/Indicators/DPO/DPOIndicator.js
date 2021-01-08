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
var SMAIndicator = SeriesRegistry.seriesTypes.sma;
import U from '../../../Core/Utilities.js';
var extend = U.extend, merge = U.merge, correctFloat = U.correctFloat, pick = U.pick;
/* eslint-disable valid-jsdoc */
// Utils:
/**
 * @private
 */
function accumulatePoints(sum, yVal, i, index, subtract) {
    var price = pick(yVal[i][index], yVal[i]);
    if (subtract) {
        return correctFloat(sum - price);
    }
    return correctFloat(sum + price);
}
/* *
 *
 *  Class
 *
 * */
/**
 * The DPO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.dpo
 *
 * @augments Highcharts.Series
 */
var DPOIndicator = /** @class */ (function (_super) {
    __extends(DPOIndicator, _super);
    function DPOIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
        *
        *   Properties
        *
        * */
        _this.options = void 0;
        _this.data = void 0;
        _this.points = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @lends Highcharts.Series#
     */
    DPOIndicator.prototype.getValues = function (series, params) {
        var period = params.period, index = params.index, offset = Math.floor(period / 2 + 1), range = period + offset, xVal = series.xData || [], yVal = series.yData || [], yValLen = yVal.length, 
        // 0- date, 1- Detrended Price Oscillator
        DPO = [], xData = [], yData = [], sum = 0, oscillator, periodIndex, rangeIndex, price, i, j;
        if (xVal.length <= range) {
            return;
        }
        // Accumulate first N-points for SMA
        for (i = 0; i < period - 1; i++) {
            sum = accumulatePoints(sum, yVal, i, index);
        }
        // Detrended Price Oscillator formula:
        // DPO = Price - Simple moving average [from (n / 2 + 1) days ago]
        for (j = 0; j <= yValLen - range; j++) {
            periodIndex = j + period - 1;
            rangeIndex = j + range - 1;
            // adding the last period point
            sum = accumulatePoints(sum, yVal, periodIndex, index);
            price = pick(yVal[rangeIndex][index], yVal[rangeIndex]);
            oscillator = price - sum / period;
            // substracting the first period point
            sum = accumulatePoints(sum, yVal, j, index, true);
            DPO.push([xVal[rangeIndex], oscillator]);
            xData.push(xVal[rangeIndex]);
            yData.push(oscillator);
        }
        return {
            values: DPO,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Detrended Price Oscillator. This series requires the `linkedTo` option to
     * be set and should be loaded after the `stock/indicators/indicators.js`.
     *
     * @sample {highstock} stock/indicators/dpo
     *         Detrended Price Oscillator
     *
     * @extends      plotOptions.sma
     * @since        7.0.0
     * @product      highstock
     * @excluding    allAreas, colorAxis, compare, compareBase, joinBy, keys,
     *               navigatorOptions, pointInterval, pointIntervalUnit,
     *               pointPlacement, pointRange, pointStart, showInNavigator,
     *               stacking
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/dpo
     * @optionparent plotOptions.dpo
     */
    DPOIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * Parameters used in calculation of Detrended Price Oscillator series
         * points.
         */
        params: {
            /**
             * Period for Detrended Price Oscillator
             */
            period: 21
        }
    });
    return DPOIndicator;
}(SMAIndicator));
extend(DPOIndicator.prototype, {
    nameBase: 'DPO'
});
SeriesRegistry.registerSeriesType('dpo', DPOIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default DPOIndicator;
/**
 * A Detrended Price Oscillator. If the [type](#series.dpo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.dpo
 * @since     7.0.0
 * @product   highstock
 * @excluding allAreas, colorAxis, compare, compareBase, dataParser, dataURL,
 *            joinBy, keys, navigatorOptions, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, showInNavigator, stacking
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/dpo
 * @apioption series.dpo
 */
''; // to include the above in the js output'
