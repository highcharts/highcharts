/* *
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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
var XRangePoint = SeriesRegistry.seriesTypes.xrange.prototype.pointClass;
import U from '../../Core/Utilities.js';
var pick = U.pick;
/* *
 *
 *  Class
 *
 * */
var GanttPoint = /** @class */ (function (_super) {
    __extends(GanttPoint, _super);
    function GanttPoint() {
        /* *
         *
         *  Static Functions
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
        /* eslint-enable valid-jsdoc */
    }
    /* eslint-disable valid-jsdoc */
    /**
     * @private
     */
    GanttPoint.setGanttPointAliases = function (options) {
        /**
         * Add a value to options if the value exists.
         * @private
         */
        function addIfExists(prop, val) {
            if (typeof val !== 'undefined') {
                options[prop] = val;
            }
        }
        addIfExists('x', pick(options.start, options.x));
        addIfExists('x2', pick(options.end, options.x2));
        addIfExists('partialFill', pick(options.completed, options.partialFill));
    };
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Applies the options containing the x and y data and possible some
     * extra properties. This is called on point init or from point.update.
     *
     * @private
     * @function Highcharts.Point#applyOptions
     *
     * @param {object} options
     *        The point options
     *
     * @param {number} x
     *        The x value
     *
     * @return {Highcharts.Point}
     *         The Point instance
     */
    GanttPoint.prototype.applyOptions = function (options, x) {
        var point = this, ganttPoint;
        ganttPoint = _super.prototype.applyOptions.call(point, options, x);
        GanttPoint.setGanttPointAliases(ganttPoint);
        return ganttPoint;
    };
    GanttPoint.prototype.isValid = function () {
        return ((typeof this.start === 'number' ||
            typeof this.x === 'number') &&
            (typeof this.end === 'number' ||
                typeof this.x2 === 'number' ||
                this.milestone));
    };
    return GanttPoint;
}(XRangePoint));
/* *
 *
 *  Default Export
 *
 * */
export default GanttPoint;
