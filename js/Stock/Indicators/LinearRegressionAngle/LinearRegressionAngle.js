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
var extend = U.extend, merge = U.merge;
/* *
 *
 * Class
 *
 * */
/**
 * The Linear Regression Angle series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.linearRegressionAngle
 *
 * @augments Highcharts.Series
 */
var LinearRegressionAngleIndicator = /** @class */ (function (_super) {
    __extends(LinearRegressionAngleIndicator, _super);
    function LinearRegressionAngleIndicator() {
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
    /**
    * Convert a slope of a line to angle (in degrees) between
    * the line and x axis
    * @private
    * @param {number} slope of the straight line function
    * @return {number} angle in degrees
    */
    LinearRegressionAngleIndicator.prototype.slopeToAngle = function (slope) {
        return Math.atan(slope) * (180 / Math.PI); // rad to deg
    };
    LinearRegressionAngleIndicator.prototype.getEndPointY = function (lineParameters) {
        return this.slopeToAngle(lineParameters.slope);
    };
    /**
     * Linear regression angle indicator. This series requires `linkedTo`
     * option to be set.
     *
     * @sample {highstock} stock/indicators/linear-regression-angle
     *         Linear intercept angle indicator
     *
     * @extends      plotOptions.linearregression
     * @since        7.0.0
     * @product      highstock
     * @requires     stock/indicators/indicators
     * @requires     stock/indicators/linearregressionangle
     * @optionparent plotOptions.linearregressionangle
     */
    LinearRegressionAngleIndicator.defaultOptions = merge(SMAIndicator.defaultOptions, {
        tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span>' +
                '{series.name}: <b>{point.y}°</b><br/>'
        }
    });
    return LinearRegressionAngleIndicator;
}(LinearRegressionIndicator));
extend(LinearRegressionAngleIndicator.prototype, {
    nameBase: 'Linear Regression Angle Indicator'
});
SeriesRegistry.registerSeriesType('linearRegressionAngle', LinearRegressionAngleIndicator);
/* *
 *
 *  Default Export
 *
 * */
export default LinearRegressionAngleIndicator;
/**
 * A linear regression intercept series. If the
 * [type](#series.linearregressionangle.type) option is not specified, it is
 * inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.linearregressionangle
 * @since     7.0.0
 * @product   highstock
 * @excluding dataParser,dataURL
 * @requires  stock/indicators/indicators
 * @requires  stock/indicators/linearregressionangle
 * @apioption series.linearregressionangle
 */
''; // to include the above in the js output
