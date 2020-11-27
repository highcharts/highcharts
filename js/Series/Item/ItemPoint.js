/* *
 *
 *  (c) 2020 Torstein Honsi
 *
 *  Item series type for Highcharts
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
var _a = BaseSeries.seriesTypes, LineSeries = _a.line, PieSeries = _a.pie;
import U from '../../Core/Utilities.js';
var extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var ItemPoint = /** @class */ (function (_super) {
    __extends(ItemPoint, _super);
    function ItemPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.graphics = void 0;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
    }
    return ItemPoint;
}(PieSeries.prototype.pointClass));
extend(ItemPoint.prototype, {
    haloPath: LineSeries.prototype.pointClass.prototype.haloPath
});
/* *
 *
 *  Default Export
 *
 * */
export default ItemPoint;
