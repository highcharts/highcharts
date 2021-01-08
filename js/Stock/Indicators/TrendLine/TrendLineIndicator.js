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
var extend = U.extend, merge = U.merge, isArray = U.isArray;
/* *
 *
 *  Class
 *
 * */
/**
 * The Trend line series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.trendline
 *
 * @augments Highcharts.Series
 */
var TrendLineIndicator = /** @class */ (function (_super) {
    __extends(TrendLineIndicator, _super);
    function TrendLineIndicator() {
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
    TrendLineIndicator.prototype.getValues = function (series, params) {
        var xVal = series.xData, yVal = series.yData, LR = [], xData = [], yData = [], sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, xValLength = xVal.length, index = params.index, alpha, beta, i, x, y;
        // Get sums:
        for (i = 0; i < xValLength; i++) {
            x = xVal[i];
            y = isArray(yVal[i]) ? yVal[i][index] : yVal[i];
            sumX += x;
            sumY += y;
            sumXY += x * y;
            sumX2 += x * x;
        }
        // Get slope and offset:
        alpha = (xValLength * sumXY - sumX * sumY) /
            (xValLength * sumX2 - sumX * sumX);
        if (isNaN(alpha)) {
            alpha = 0;
        }
        beta = (sumY - alpha * sumX) / xValLength;
        // Calculate linear regression:
        for (i = 0; i < xValLength; i++) {
            x = xVal[i];
            y = alpha * x + beta;
            // Prepare arrays required for getValues() method
            LR[i] = [x, y];
            xData[i] = x;
            yData[i] = y;
        }
        return {
            xData: xData,
            yData: yData,
            values: LR
        };
    };
    /**
     * Trendline (linear regression) fits a straight line to the selected data
     * using a method called the Sum Of Least Squares. This series requires the
     * `linkedTo` option to be set.
     *
     * @sample stock/indicators/trendline
     *         Trendline indicator
     *
     * @extends      plotOptions.sma
     * @since        7.1.3
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/trendline
     * @optionparent plotOptions.trendline
     */
    TrendLineIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        /**
         * @excluding period
         */
        params: {
            /**
             * The point index which indicator calculations will base. For
             * example using OHLC data, index=2 means the indicator will be
             * calculated using Low values.
             *
             * @default 3
             */
            index: 3
        }
    });
    return TrendLineIndicator;
}(SMAIndicator));
extend(TrendLineIndicator.prototype, {
    nameBase: 'Trendline',
    nameComponents: false
});
SeriesRegistry.registerSeriesType('trendline', TrendLineIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default TrendLineIndicator;
/**
 * A `TrendLine` series. If the [type](#series.trendline.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.trendline
 * @since     7.1.3
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/trendline
 * @apioption series.trendline
 */
''; // to include the above in the js output
