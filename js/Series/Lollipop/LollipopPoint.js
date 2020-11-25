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
import AreaSeries from '../Area/AreaSeries.js';
var areaProto = AreaSeries.prototype;
import DumbbellPoint from '../Dumbbell/DumbbellPoint.js';
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
var isObject = U.isObject, extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var LollipopPoint = /** @class */ (function (_super) {
    __extends(LollipopPoint, _super);
    function LollipopPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.series = void 0;
        _this.options = void 0;
        return _this;
    }
    return LollipopPoint;
}(DumbbellPoint));
/* *
 *
 *  Prototype properties
 *
 * */
extend(LollipopPoint.prototype, {
    pointSetState: areaProto.pointClass.prototype.setState,
    setState: DumbbellPoint.prototype.setState,
    // Does not work with the inherited `isvalid`
    isValid: Point.prototype.isValid,
    init: function (series, options, x) {
        if (isObject(options) && 'low' in options) {
            options.y = options.low;
            delete options.low;
        }
        return Point.prototype.init.apply(this, arguments);
    }
});
/* *
 *
 *  Default export
 *
 * */
export default LollipopPoint;
