/* *
 *
 *  Sankey diagram module
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
import NodesMixin from '../../Mixins/Nodes.js';
import Point from '../../Core/Series/Point.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var ColumnSeries = SeriesRegistry.seriesTypes.column;
import U from '../../Core/Utilities.js';
var defined = U.defined, extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var SankeyPoint = /** @class */ (function (_super) {
    __extends(SankeyPoint, _super);
    function SankeyPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.className = void 0;
        _this.fromNode = void 0;
        _this.level = void 0;
        _this.linkBase = void 0;
        _this.linksFrom = void 0;
        _this.linksTo = void 0;
        _this.mass = void 0;
        _this.nodeX = void 0;
        _this.nodeY = void 0;
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
     * @private
     */
    SankeyPoint.prototype.applyOptions = function (options, x) {
        Point.prototype.applyOptions.call(this, options, x);
        // Treat point.level as a synonym of point.column
        if (defined(this.options.level)) {
            this.options.column = this.column = this.options.level;
        }
        return this;
    };
    /**
     * @private
     */
    SankeyPoint.prototype.getClassName = function () {
        return (this.isNode ? 'highcharts-node ' : 'highcharts-link ') +
            Point.prototype.getClassName.call(this);
    };
    /**
     * @private
     */
    SankeyPoint.prototype.isValid = function () {
        return this.isNode || typeof this.weight === 'number';
    };
    return SankeyPoint;
}(ColumnSeries.prototype.pointClass));
extend(SankeyPoint.prototype, {
    setState: NodesMixin.setNodeState
});
/* *
 *
 *  Default Export
 *
 * */
export default SankeyPoint;
