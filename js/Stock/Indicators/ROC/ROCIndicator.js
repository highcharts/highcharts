/* *
 *
 *  (c) 2010-2021 Kacper Madej
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
var isArray = U.isArray, merge = U.merge, extend = U.extend;
/* eslint-disable require-jsdoc */
// Utils:
function populateAverage(xVal, yVal, i, period, index) {
    /* Calculated as:

       (Closing Price [today] - Closing Price [n days ago]) /
        Closing Price [n days ago] * 100

       Return y as null when avoiding division by zero */
    var nDaysAgoY, rocY;
    if (index < 0) {
        // y data given as an array of values
        nDaysAgoY = yVal[i - period];
        rocY = nDaysAgoY ?
            (yVal[i] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    }
    else {
        // y data given as an array of arrays and the index should be used
        nDaysAgoY = yVal[i - period][index];
        rocY = nDaysAgoY ?
            (yVal[i][index] - nDaysAgoY) / nDaysAgoY * 100 :
            null;
    }
    return [xVal[i], rocY];
}
/* eslint-enable require-jsdoc */
/* *
 *
 *  Class
 *
 * */
/**
 * The ROC series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.roc
 *
 * @augments Highcharts.Series
 */
var ROCIndicator = /** @class */ (function (_super) {
    __extends(ROCIndicator, _super);
    function ROCIndicator() {
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
    ROCIndicator.prototype.getValues = function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, ROC = [], xData = [], yData = [], i, index = -1, ROCPoint;
        // Period is used as a number of time periods ago, so we need more
        // (at least 1 more) data than the period value
        if (xVal.length <= period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            index = params.index;
        }
        // i = period <-- skip first N-points
        // Calculate value one-by-one for each period in visible data
        for (i = period; i < yValLen; i++) {
            ROCPoint = populateAverage(xVal, yVal, i, period, index);
            ROC.push(ROCPoint);
            xData.push(ROCPoint[0]);
            yData.push(ROCPoint[1]);
        }
        return {
            values: ROC,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Rate of change indicator (ROC). The indicator value for each point
     * is defined as:
     *
     * `(C - Cn) / Cn * 100`
     *
     * where: `C` is the close value of the point of the same x in the
     * linked series and `Cn` is the close value of the point `n` periods
     * ago. `n` is set through [period](#plotOptions.roc.params.period).
     *
     * This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/roc
     *         Rate of change indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/roc
     * @optionparent plotOptions.roc
     */
    ROCIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            index: 3,
            period: 9
        }
    });
    return ROCIndicator;
}(SMAIndicator));
extend(ROCIndicator.prototype, {
    nameBase: 'Rate of Change'
});
SeriesRegistry.registerSeriesType('roc', ROCIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default ROCIndicator;
/**
 * A `ROC` series. If the [type](#series.wma.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * Rate of change indicator (ROC). The indicator value for each point
 * is defined as:
 *
 * `(C - Cn) / Cn * 100`
 *
 * where: `C` is the close value of the point of the same x in the
 * linked series and `Cn` is the close value of the point `n` periods
 * ago. `n` is set through [period](#series.roc.params.period).
 *
 * This series requires `linkedTo` option to be set.
 *
 * @extends   series,plotOptions.roc
 * @since     6.0.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/roc
 * @apioption series.roc
 */
''; // to include the above in the js output
