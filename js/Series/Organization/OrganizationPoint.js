/* *
 *
 *  Organization chart module
 *
 *  (c) 2018-2021 Torstein Honsi
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
var SankeyPoint = SeriesRegistry.seriesTypes.sankey.prototype.pointClass;
/* *
 *
 *  Class
 *
 * */
var OrganizationPoint = /** @class */ (function (_super) {
    __extends(OrganizationPoint, _super);
    function OrganizationPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.fromNode = void 0;
        _this.linksFrom = void 0;
        _this.linksTo = void 0;
        _this.options = void 0;
        _this.series = void 0;
        _this.toNode = void 0;
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
     * All nodes in an org chart are equal width.
     * @private
     */
    OrganizationPoint.prototype.getSum = function () {
        return 1;
    };
    return OrganizationPoint;
}(SankeyPoint));
/* *
 *
 *  Default Export
 *
 * */
export default OrganizationPoint;
