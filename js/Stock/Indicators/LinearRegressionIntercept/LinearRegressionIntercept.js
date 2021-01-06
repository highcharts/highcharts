/**
 *
 *  (c) 2010-2021 Kamil Kulig
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
var _a = SeriesRegistry.seriesTypes, SMAIndicator = _a.sma, LinearRegressionIndicator = _a.linearRegression;
import U from '../../../Core/Utilities.js';
var isArray = U.isArray, extend = U.extend, merge = U.merge;
/* *
 *
 * Class
 *
 * */
/**
 * The Linear Regression Intercept series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionIntercept
 *
 * @augments Highcharts.Series
 */
var LinearRegressionInterceptIndicator = /** @class */ (function (_super) {
    __extends(LinearRegressionInterceptIndicator, _super);
    function LinearRegressionInterceptIndicator() {
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
    LinearRegressionInterceptIndicator.prototype.getEndPointY = function (lineParameters) {
        return lineParameters.intercept;
    };
    /**
     * Linear regression intercept indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-intercept
     *         Linear intercept slope indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/linearregressionintercept
     * @optionparent plotOptions.linearregressionintercept
     */
    LinearRegressionInterceptIndicator.defaultOptions = merge(LinearRegressionIndicator.defaultOptions);
    return LinearRegressionInterceptIndicator;
}(LinearRegressionIndicator));
extend(LinearRegressionInterceptIndicator.prototype, {
    nameBase: 'Linear Regression Intercept Indicator'
});
SeriesRegistry.registerSeriesType('linearRegressionIntercept', LinearRegressionInterceptIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default LinearRegressionInterceptIndicator;
/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionintercept.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionintercept
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/linearregressionintercept
 * @apioption series.linearregressionintercept
 */
''; // to include the above in the js output
