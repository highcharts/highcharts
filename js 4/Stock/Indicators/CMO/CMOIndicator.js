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
var isNumber = U.isNumber, merge = U.merge;
/* eslint-enable require-jsdoc */
/**
 * The CMO series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.cmo
 *
 * @augments Highcharts.Series
 */
var CMOIndicator = /** @class */ (function (_super) {
    __extends(CMOIndicator, _super);
    function CMOIndicator() {
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
    CMOIndicator.prototype.getValues = function (series, params) {
        var period = params.period, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, CMO = [], xData = [], yData = [];
        var i, index = params.index, values;
        if (xVal.length < period) {
            return;
        }
        if (isNumber(yVal[0])) {
            values = yVal;
        }
        else {
            // In case of the situation, where the series type has data length
            // shorter then 4 (HLC, range), this ensures that we are not trying
            // to reach the index out of bounds
            index = Math.min(index, yVal[0].length - 1);
            values = yVal.map(function (value) { return value[index]; });
        }
        var firstAddedSum = 0, sumOfHigherValues = 0, sumOfLowerValues = 0, y;
        // Calculate first point, check if the first value
        // was added to sum of higher/lower values, and what was the value.
        for (var j = period; j > 0; j--) {
            if (values[j] > values[j - 1]) {
                sumOfHigherValues += values[j] - values[j - 1];
            }
            else if (values[j] < values[j - 1]) {
                sumOfLowerValues += values[j - 1] - values[j];
            }
        }
        // You might devide by 0 if all values are equal,
        // so return 0 in this case.
        y =
            sumOfHigherValues + sumOfLowerValues > 0 ?
                (100 * (sumOfHigherValues - sumOfLowerValues)) /
                    (sumOfHigherValues + sumOfLowerValues) :
                0;
        xData.push(xVal[period]);
        yData.push(y);
        CMO.push([xVal[period], y]);
        for (i = period + 1; i < yValLen; i++) {
            firstAddedSum = Math.abs(values[i - period - 1] - values[i - period]);
            if (values[i] > values[i - 1]) {
                sumOfHigherValues += values[i] - values[i - 1];
            }
            else if (values[i] < values[i - 1]) {
                sumOfLowerValues += values[i - 1] - values[i];
            }
            // Check, to which sum was the first value added to,
            // and substract this value from given sum.
            if (values[i - period] > values[i - period - 1]) {
                sumOfHigherValues -= firstAddedSum;
            }
            else {
                sumOfLowerValues -= firstAddedSum;
            }
            // Same as above.
            y =
                sumOfHigherValues + sumOfLowerValues > 0 ?
                    (100 * (sumOfHigherValues - sumOfLowerValues)) /
                        (sumOfHigherValues + sumOfLowerValues) :
                    0;
            xData.push(xVal[i]);
            yData.push(y);
            CMO.push([xVal[i], y]);
        }
        return {
            values: CMO,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Chande Momentum Oscilator (CMO) technical indicator. This series
     * requires the `linkedTo` option to be set and should be loaded after
     * the `stock/indicators/indicators.js` file.
     *
     * @sample stock/indicators/cmo
     *         CMO indicator
     *
     * @extends      plotOptions.sma
     * @since 9.1.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/cmo
     * @optionparent plotOptions.cmo
     */
    CMOIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            period: 20,
            index: 3
        }
    });
    return CMOIndicator;
}(SMAIndicator));
SeriesRegistry.registerSeriesType('cmo', CMOIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default CMOIndicator;
/**
 * A `CMO` series. If the [type](#series.cmo.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.cmo
 * @since 9.1.0
 * @product   highstock
 * @excluding dataParser, dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/cmo
 * @apioption series.cmo
 */
(''); // to include the above in the js output
