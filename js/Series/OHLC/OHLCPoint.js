/* *
 *
 *  (c) 2010-2020 Torstein Honsi
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
import BaseSeries from '../../Core/Series/Series.js';
var ColumnSeries = BaseSeries.seriesTypes.column;
/* *
 *
 *  Class
 *
 * */
var OHLCPoint = /** @class */ (function (_super) {
    __extends(OHLCPoint, _super);
    function OHLCPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.close = void 0;
        _this.high = void 0;
        _this.low = void 0;
        _this.open = void 0;
        _this.options = void 0;
        _this.plotClose = void 0;
        _this.plotOpen = void 0;
        _this.series = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Extend the parent method by adding up or down to the class name.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getClassName
     * @return {string}
     */
    OHLCPoint.prototype.getClassName = function () {
        return _super.prototype.getClassName.call(this) +
            (this.open < this.close ?
                ' highcharts-point-up' :
                ' highcharts-point-down');
    };
    return OHLCPoint;
}(ColumnSeries.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default OHLCPoint;
