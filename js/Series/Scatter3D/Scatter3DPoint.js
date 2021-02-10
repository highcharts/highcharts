/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Scatter 3D series.
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
import ScatterSeries from '../Scatter/ScatterSeries.js';
import U from '../../Core/Utilities.js';
var defined = U.defined;
/* *
 *
 *  Class
 *
 * */
var Scatter3DPoint = /** @class */ (function (_super) {
    __extends(Scatter3DPoint, _super);
    function Scatter3DPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    Scatter3DPoint.prototype.applyOptions = function () {
        _super.prototype.applyOptions.apply(this, arguments);
        if (!defined(this.z)) {
            this.z = 0;
        }
        return this;
    };
    return Scatter3DPoint;
}(ScatterSeries.prototype.pointClass));
/* *
 *
 *  Default Export
 *
 * */
export default Scatter3DPoint;
