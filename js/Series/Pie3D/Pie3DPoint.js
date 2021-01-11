/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  3D pie series
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
var PiePoint = SeriesRegistry.seriesTypes.pie.prototype.pointClass;
/* *
 *
 *  Constants
 *
 * */
var superHaloPath = PiePoint.prototype.haloPath;
/* *
 *
 *  Class
 *
 * */
var Pie3DPoint = /** @class */ (function (_super) {
    __extends(Pie3DPoint, _super);
    function Pie3DPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
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
     * @private
     */
    Pie3DPoint.prototype.haloPath = function () {
        return this.series.chart.is3d() ? [] : superHaloPath.apply(this, arguments);
    };
    return Pie3DPoint;
}(PiePoint));
/* *
 *
 *  Default Export
 *
 * */
export default Pie3DPoint;
