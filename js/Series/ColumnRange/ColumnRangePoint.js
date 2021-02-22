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
var _a = SeriesRegistry.seriesTypes, ColumnPoint = _a.column.prototype.pointClass, AreaRangePoint = _a.arearange.prototype.pointClass;
import U from '../../Core/Utilities.js';
var extend = U.extend, isNumber = U.isNumber;
/* *
 *
 *  Class
 *
 * */
var ColumnRangePoint = /** @class */ (function (_super) {
    __extends(ColumnRangePoint, _super);
    function ColumnRangePoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.series = void 0;
        _this.options = void 0;
        _this.barX = void 0;
        _this.pointWidth = void 0;
        _this.shapeType = void 0;
        return _this;
    }
    ColumnRangePoint.prototype.isValid = function () {
        return isNumber(this.low);
    };
    return ColumnRangePoint;
}(AreaRangePoint));
/* *
 *
 *  Prototype properties
 *
 * */
extend(ColumnRangePoint.prototype, {
    setState: ColumnPoint.prototype.setState
});
/* *
 *
 *  Default export
 *
 * */
export default ColumnRangePoint;
