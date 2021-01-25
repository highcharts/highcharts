/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
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
import ColumnSeries from '../Column/ColumnSeries.js';
import Point from '../../Core/Series/Point.js';
var isNumber = U.isNumber;
import U from '../../Core/Utilities.js';
/* *
 *
 * Class
 *
 * */
var WaterfallPoint = /** @class */ (function (_super) {
    __extends(WaterfallPoint, _super);
    function WaterfallPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    WaterfallPoint.prototype.getClassName = function () {
        var className = Point.prototype.getClassName.call(this);
        if (this.isSum) {
            className += ' highcharts-sum';
        }
        else if (this.isIntermediateSum) {
            className += ' highcharts-intermediate-sum';
        }
        return className;
    };
    // Pass the null test in ColumnSeries.translate.
    WaterfallPoint.prototype.isValid = function () {
        return (isNumber(this.y) ||
            this.isSum ||
            Boolean(this.isIntermediateSum));
    };
    return WaterfallPoint;
}(ColumnSeries.prototype.pointClass));
/* *
 *
 * Export
 *
 * */
export default WaterfallPoint;
