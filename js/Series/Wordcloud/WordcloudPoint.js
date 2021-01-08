/* *
 *
 *  Experimental Highcharts module which enables visualization of a word cloud.
 *
 *  (c) 2016-2021 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 * */
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
import DrawPointMixin from '../../Mixins/DrawPoint.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
import U from '../../Core/Utilities.js';
var extend = U.extend;
var WordcloudPoint = /** @class */ (function (_super) {
    __extends(WordcloudPoint, _super);
    function WordcloudPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.dimensions = void 0;
        _this.options = void 0;
        _this.polygon = void 0;
        _this.rect = void 0;
        _this.series = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    WordcloudPoint.prototype.shouldDraw = function () {
        var point = this;
        return !point.isNull;
    };
    WordcloudPoint.prototype.isValid = function () {
        return true;
    };
    return WordcloudPoint;
}(ColumnSeries.prototype.pointClass));
extend(WordcloudPoint.prototype, {
    draw: DrawPointMixin.drawPoint,
    weight: 1
});
export default WordcloudPoint;
