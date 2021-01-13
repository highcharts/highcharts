/* *
 *
 *  Wind barb series module
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
import U from '../../Core/Utilities.js';
var isNumber = U.isNumber;
import ColumnSeries from '../Column/ColumnSeries.js';
/* *
 *
 * Class
 *
 * */
var WindbarbPoint = /** @class */ (function (_super) {
    __extends(WindbarbPoint, _super);
    function WindbarbPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        /* *
         *
         * Properties
         *
         * */
        _this.beaufort = void 0;
        _this.beaufortLevel = void 0;
        _this.direction = void 0;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
    }
    /* *
     *
     * Functions
     *
     * */
    WindbarbPoint.prototype.isValid = function () {
        return isNumber(this.value) && this.value >= 0;
    };
    return WindbarbPoint;
}(ColumnSeries.prototype.pointClass));
/* *
 *
 * Default export
 *
 * */
export default WindbarbPoint;
