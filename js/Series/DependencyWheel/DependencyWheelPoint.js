/* *
 *
 *  Dependency wheel module
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
import NodesMixin from '../../Mixins/Nodes.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
var SankeySeries = SeriesRegistry.seriesTypes.sankey;
import U from '../../Core/Utilities.js';
var extend = U.extend;
/* *
 *
 *  Class
 *
 * */
var DependencyWheelPoint = /** @class */ (function (_super) {
    __extends(DependencyWheelPoint, _super);
    function DependencyWheelPoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.angle = void 0;
        _this.fromNode = void 0;
        _this.index = void 0;
        _this.linksFrom = void 0;
        _this.linksTo = void 0;
        _this.options = void 0;
        _this.series = void 0;
        _this.shapeArgs = void 0;
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
     * Return a text path that the data label uses.
     * @private
     */
    DependencyWheelPoint.prototype.getDataLabelPath = function (label) {
        var renderer = this.series.chart.renderer, shapeArgs = this.shapeArgs, upperHalf = this.angle < 0 || this.angle > Math.PI, start = shapeArgs.start, end = shapeArgs.end;
        if (!this.dataLabelPath) {
            this.dataLabelPath = renderer
                .arc({
                open: true,
                longArc: Math.abs(Math.abs(start) - Math.abs(end)) < Math.PI ? 0 : 1
            })
                // Add it inside the data label group so it gets destroyed
                // with the label
                .add(label);
        }
        this.dataLabelPath.attr({
            x: shapeArgs.x,
            y: shapeArgs.y,
            r: (shapeArgs.r +
                (this.dataLabel.options.distance || 0)),
            start: (upperHalf ? start : end),
            end: (upperHalf ? end : start),
            clockwise: +upperHalf
        });
        return this.dataLabelPath;
    };
    DependencyWheelPoint.prototype.isValid = function () {
        // No null points here
        return true;
    };
    return DependencyWheelPoint;
}(SankeySeries.prototype.pointClass));
extend(DependencyWheelPoint.prototype, {
    setState: NodesMixin.setNodeState
});
/* *
 *
 *  Default Export
 *
 * */
export default DependencyWheelPoint;
