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
var _a = BaseSeries.seriesTypes, ColumnPoint = _a.column.prototype.pointClass, AreaRangePoint = _a.arearange.prototype.pointClass;
var ColumnRangePoint = /** @class */ (function (_super) {
    __extends(ColumnRangePoint, _super);
    function ColumnRangePoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.series = void 0;
        _this.options = void 0;
        _this.setState = ColumnPoint.prototype.setState;
        return _this;
    }
    return ColumnRangePoint;
}(AreaRangePoint));
/* *
 *
 *  Default export
 *
 * */
export default ColumnRangePoint;
