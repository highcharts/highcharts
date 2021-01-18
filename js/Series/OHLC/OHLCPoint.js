/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
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
    /**
     * Save upColor as point color (#14826).
     * @private
     * @function Highcharts.seriesTypes.ohlc#resolveUpColor
     */
    OHLCPoint.prototype.resolveUpColor = function () {
        if (this.open < this.close &&
            !this.options.color &&
            this.series.options.upColor) {
            this.color = this.series.options.upColor;
        }
    };
    /**
     * Extend the parent method by saving upColor.
     * @private
     * @function Highcharts.seriesTypes.ohlc#resolveColor
     */
    OHLCPoint.prototype.resolveColor = function () {
        _super.prototype.resolveColor.call(this);
        this.resolveUpColor();
    };
    /**
     * Extend the parent method by saving upColor.
     * @private
     * @function Highcharts.seriesTypes.ohlc#getZone
     *
     * @return {Highcharts.SeriesZonesOptionsObject}
     *         The zone item.
     */
    OHLCPoint.prototype.getZone = function () {
        var zone = _super.prototype.getZone.call(this);
        this.resolveUpColor();
        return zone;
    };
    return OHLCPoint;
}(ColumnSeries.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default OHLCPoint;
