/* *
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
import A from '../../Core/Animation/AnimationUtilities.js';
var setAnimation = A.setAnimation;
import Point from '../../Core/Series/Point.js';
import U from '../../Core/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, extend = U.extend, isNumber = U.isNumber, pick = U.pick, relativeLength = U.relativeLength;
/* *
 *
 *  Class
 *
 * */
var PiePoint = /** @class */ (function (_super) {
    __extends(PiePoint, _super);
    function PiePoint() {
        /* *
         *
         *  Properties
         *
         * */
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.labelDistance = void 0;
        _this.options = void 0;
        _this.series = void 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Extendable method for getting the path of the connector between the
     * data label and the pie slice.
     * @private
     */
    PiePoint.prototype.getConnectorPath = function () {
        var labelPosition = this.labelPosition, options = this.series.options.dataLabels, connectorShape = options.connectorShape, predefinedShapes = this.connectorShapes;
        // find out whether to use the predefined shape
        if (predefinedShapes[connectorShape]) {
            connectorShape = predefinedShapes[connectorShape];
        }
        return connectorShape.call(this, {
            // pass simplified label position object for user's convenience
            x: labelPosition.final.x,
            y: labelPosition.final.y,
            alignment: labelPosition.alignment
        }, labelPosition.connectorPosition, options);
    };
    /**
     * @private
     */
    PiePoint.prototype.getTranslate = function () {
        return this.sliced ? this.slicedTranslation : {
            translateX: 0,
            translateY: 0
        };
    };
    /**
     * @private
     */
    PiePoint.prototype.haloPath = function (size) {
        var shapeArgs = this.shapeArgs;
        return this.sliced || !this.visible ?
            [] :
            this.series.chart.renderer.symbols.arc(shapeArgs.x, shapeArgs.y, shapeArgs.r + size, shapeArgs.r + size, {
                // Substract 1px to ensure the background is not bleeding
                // through between the halo and the slice (#7495).
                innerR: shapeArgs.r - 1,
                start: shapeArgs.start,
                end: shapeArgs.end
            });
    };
    /**
     * Initialize the pie slice.
     * @private
     */
    PiePoint.prototype.init = function () {
        Point.prototype.init.apply(this, arguments);
        var point = this, toggleSlice;
        point.name = pick(point.name, 'Slice');
        // add event listener for select
        toggleSlice = function (e) {
            point.slice(e.type === 'select');
        };
        addEvent(point, 'select', toggleSlice);
        addEvent(point, 'unselect', toggleSlice);
        return point;
    };
    /**
     * Negative points are not valid (#1530, #3623, #5322)
     * @private
     */
    PiePoint.prototype.isValid = function () {
        return isNumber(this.y) && this.y >= 0;
    };
    /**
     * Toggle the visibility of the pie slice.
     * @private
     *
     * @param {boolean} vis
     * Whether to show the slice or not. If undefined, the visibility is
     * toggled.
     */
    PiePoint.prototype.setVisible = function (vis, redraw) {
        var point = this, series = point.series, chart = series.chart, ignoreHiddenPoint = series.options.ignoreHiddenPoint;
        redraw = pick(redraw, ignoreHiddenPoint);
        if (vis !== point.visible) {
            // If called without an argument, toggle visibility
            point.visible = point.options.visible = vis =
                typeof vis === 'undefined' ? !point.visible : vis;
            // update userOptions.data
            series.options.data[series.data.indexOf(point)] =
                point.options;
            // Show and hide associated elements. This is performed
            // regardless of redraw or not, because chart.redraw only
            // handles full series.
            ['graphic', 'dataLabel', 'connector', 'shadowGroup'].forEach(function (key) {
                if (point[key]) {
                    point[key][vis ? 'show' : 'hide'](vis);
                }
            });
            if (point.legendItem) {
                chart.legend.colorizeItem(point, vis);
            }
            // #4170, hide halo after hiding point
            if (!vis && point.state === 'hover') {
                point.setState('');
            }
            // Handle ignore hidden slices
            if (ignoreHiddenPoint) {
                series.isDirty = true;
            }
            if (redraw) {
                chart.redraw();
            }
        }
    };
    /**
     * Set or toggle whether the slice is cut out from the pie.
     * @private
     *
     * @param {boolean} sliced
     * When undefined, the slice state is toggled.
     *
     * @param {boolean} redraw
     * Whether to redraw the chart. True by default.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>}
     * Animation options.
     */
    PiePoint.prototype.slice = function (sliced, redraw, animation) {
        var point = this, series = point.series, chart = series.chart;
        setAnimation(animation, chart);
        // redraw is true by default
        redraw = pick(redraw, true);
        /**
         * Pie series only. Whether to display a slice offset from the
         * center.
         * @name Highcharts.Point#sliced
         * @type {boolean|undefined}
         */
        // if called without an argument, toggle
        point.sliced = point.options.sliced = sliced =
            defined(sliced) ? sliced : !point.sliced;
        // update userOptions.data
        series.options.data[series.data.indexOf(point)] =
            point.options;
        if (point.graphic) {
            point.graphic.animate(this.getTranslate());
        }
        if (point.shadowGroup) {
            point.shadowGroup.animate(this.getTranslate());
        }
    };
    return PiePoint;
}(Point));
extend(PiePoint.prototype, {
    connectorShapes: {
        // only one available before v7.0.0
        fixedOffset: function (labelPosition, connectorPosition, options) {
            var breakAt = connectorPosition.breakAt, touchingSliceAt = connectorPosition.touchingSliceAt, lineSegment = options.softConnector ? [
                'C',
                // 1st control point (of the curve)
                labelPosition.x +
                    // 5 gives the connector a little horizontal bend
                    (labelPosition.alignment === 'left' ? -5 : 5),
                labelPosition.y,
                2 * breakAt.x - touchingSliceAt.x,
                2 * breakAt.y - touchingSliceAt.y,
                breakAt.x,
                breakAt.y //
            ] : [
                'L',
                breakAt.x,
                breakAt.y
            ];
            // assemble the path
            return ([
                ['M', labelPosition.x, labelPosition.y],
                lineSegment,
                ['L', touchingSliceAt.x, touchingSliceAt.y]
            ]);
        },
        straight: function (labelPosition, connectorPosition) {
            var touchingSliceAt = connectorPosition.touchingSliceAt;
            // direct line to the slice
            return [
                ['M', labelPosition.x, labelPosition.y],
                ['L', touchingSliceAt.x, touchingSliceAt.y]
            ];
        },
        crookedLine: function (labelPosition, connectorPosition, options) {
            var touchingSliceAt = connectorPosition.touchingSliceAt, series = this.series, pieCenterX = series.center[0], plotWidth = series.chart.plotWidth, plotLeft = series.chart.plotLeft, alignment = labelPosition.alignment, radius = this.shapeArgs.r, crookDistance = relativeLength(// % to fraction
            options.crookDistance, 1), crookX = alignment === 'left' ?
                pieCenterX + radius + (plotWidth + plotLeft -
                    pieCenterX - radius) * (1 - crookDistance) :
                plotLeft + (pieCenterX - radius) * crookDistance, segmentWithCrook = [
                'L',
                crookX,
                labelPosition.y
            ], useCrook = true;
            // crookedLine formula doesn't make sense if the path overlaps
            // the label - use straight line instead in that case
            if (alignment === 'left' ?
                (crookX > labelPosition.x || crookX < touchingSliceAt.x) :
                (crookX < labelPosition.x || crookX > touchingSliceAt.x)) {
                useCrook = false;
            }
            // assemble the path
            var path = [
                ['M', labelPosition.x, labelPosition.y]
            ];
            if (useCrook) {
                path.push(segmentWithCrook);
            }
            path.push(['L', touchingSliceAt.x, touchingSliceAt.y]);
            return path;
        }
    }
});
/* *
 *
 *  Default Export
 *
 * */
export default PiePoint;
