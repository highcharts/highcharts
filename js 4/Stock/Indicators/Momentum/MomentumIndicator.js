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
var extend = U.extend, isArray = U.isArray, merge = U.merge;
/* eslint-disable require-jsdoc */
function populateAverage(xVal, yVal, i, period, index) {
    var mmY = yVal[i - 1][index] - yVal[i - period - 1][index], mmX = xVal[i - 1];
    return [mmX, mmY];
}
/* eslint-enable require-jsdoc */
/**
 * The Momentum series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.momentum
 *
 * @augments Highcharts.Series
 */
var MomentumIndicator = /** @class */ (function (_super) {
    __extends(MomentumIndicator, _super);
    function MomentumIndicator() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.data = void 0;
        _this.options = void 0;
        _this.points = void 0;
        return _this;
    }
    MomentumIndicator.prototype.getValues = function (series, params) {
        var period = params.period, index = params.index, xVal = series.xData, yVal = series.yData, yValLen = yVal ? yVal.length : 0, yValue = yVal[0], MM = [], xData = [], yData = [], i, MMPoint;
        if (xVal.length <= period) {
            return;
        }
        // Switch index for OHLC / Candlestick / Arearange
        if (isArray(yVal[0])) {
            yValue = yVal[0][index];
        }
        else {
            return;
        }
        // Calculate value one-by-one for each period in visible data
        for (i = (period + 1); i < yValLen; i++) {
            MMPoint = populateAverage(xVal, yVal, i, period, index);
            MM.push(MMPoint);
            xData.push(MMPoint[0]);
            yData.push(MMPoint[1]);
        }
        MMPoint = populateAverage(xVal, yVal, i, period, index);
        MM.push(MMPoint);
        xData.push(MMPoint[0]);
        yData.push(MMPoint[1]);
        return {
            values: MM,
            xData: xData,
            yData: yData
        };
    };
    /**
     * Momentum. This series requires `linkedTo` option to be set.
     *
     * @sample stock/indicators/momentum
     *         Momentum indicator
     *
     * @extends      plotOptions.sma
     * @since        6.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/momentum
     * @optionparent plotOptions.momentum
     */
    MomentumIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        params: {
            index: 3
        }
    });
    return MomentumIndicator;
}(SMAIndicator));
extend(MomentumIndicator.prototype, {
    nameBase: 'Momentum'
});
SeriesRegistry.registerSeriesType('momentum', MomentumIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default MomentumIndicator;
/**
 * A `Momentum` series. If the [type](#series.momentum.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.momentum
 * @since     6.0.0
 * @excluding dataParser, dataURL
 * @product   highstock
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/momentum
 * @apioption series.momentum
 */
''; // to include the above in the js output
