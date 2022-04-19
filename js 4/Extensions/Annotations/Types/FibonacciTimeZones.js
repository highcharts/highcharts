/* *
 *
 *  Author: Rafal Sebestjanski
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
import Annotation from '../Annotations.js';
import ControlPoint from '../ControlPoint.js';
import CrookedLine from './CrookedLine.js';
import InfinityLine from './InfinityLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable no-invalid-this, valid-jsdoc */
var FibonacciTimeZones = /** @class */ (function (_super) {
    __extends(FibonacciTimeZones, _super);
    function FibonacciTimeZones() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Functions
     *
     * */
    /*
    Method taken (and slightly changed) from the InfinityLine annotation.

    It uses x coordinate to create two mock points on the same x. Then,
    it uses some logic from InfinityLine to find equation of the line passing
    through our two points and, using that equation, it finds and returns
    the coordinates of where the line intersects the plot area edges.

    This is being done for each fibonacci time zone line.


            this point here is found
               |
               v
     |---------*--------------------------------------------------------|
     |                                                                  |
     |                                                                  |
     |                                                                  |
     |                                                                  |
     |         *   copy of the primary point                            |
     |                                                                  |
     |         *   primary point (e.g. the one given in options)        |
     |                                                                  |
     |---------*--------------------------------------------------------|
            and this point here is found (intersection with the plot area edge)

    */
    FibonacciTimeZones.prototype.edgePoint = function (startIndex, endIndex, fibonacciIndex) {
        return function (target) {
            var chart = target.annotation.chart, plotLeftOrTop = chart.inverted ? chart.plotTop : chart.plotLeft;
            var points = target.annotation.points;
            var xAxis = points[0].series.xAxis, 
            // Distance between the two first lines in pixels
            deltaX = points.length > 1 ?
                points[1].plotX - points[0].plotX : 0, 
            // firstLine.x + fibb * offset
            x = xAxis.toValue(points[0].plotX + plotLeftOrTop + fibonacciIndex * deltaX);
            // We need 2 mock points with the same x coordinate, different y
            points = [
                new MockPoint(chart, points[0].target, {
                    x: x,
                    y: 0,
                    xAxis: points[0].options.xAxis,
                    yAxis: points[0].options.yAxis
                }),
                new MockPoint(chart, points[0].target, {
                    x: x,
                    y: 1,
                    xAxis: points[0].options.xAxis,
                    yAxis: points[0].options.yAxis
                })
            ];
            return InfinityLine.findEdgePoint(points[startIndex], points[endIndex]);
        };
    };
    FibonacciTimeZones.prototype.addShapes = function () {
        var numberOfLines = 11;
        var fibb = 1, nextFibb = 1;
        for (var i = 0; i < numberOfLines; i++) {
            // The fibb variable equals to 1 twice - correct it in the first
            // iteration so the lines don't overlap
            var correctedFibb = !i ? 0 : fibb, points = [
                this.edgePoint(1, 0, correctedFibb),
                this.edgePoint(0, 1, correctedFibb)
            ];
            // Calculate fibbonacci
            nextFibb = fibb + nextFibb;
            fibb = nextFibb - fibb;
            // Save the second line for the control point
            if (i === 1) {
                this.secondLineEdgePoints = [points[0], points[1]];
            }
            this.initShape(merge(this.options.typeOptions.line, {
                type: 'path',
                points: points
            }), i // shape's index. Can be found in annotation.shapes[i].index
            );
        }
    };
    FibonacciTimeZones.prototype.addControlPoints = function () {
        var options = this.options, typeOptions = options.typeOptions, controlPoint = new ControlPoint(this.chart, this, merge(options.controlPointOptions, typeOptions.controlPointOptions), 0);
        this.controlPoints.push(controlPoint);
        typeOptions.controlPointOptions = controlPoint.options;
    };
    return FibonacciTimeZones;
}(CrookedLine));
FibonacciTimeZones.prototype.defaultOptions = merge(CrookedLine.prototype.defaultOptions, {
    typeOptions: {
        // Options for showing in popup edit
        line: {
            /**
             * The color of the lines.
             *
             * @type      {string}
             * @since 9.3.0
             * @default   'rgba(0, 0, 0, 0.75)'
             * @apioption annotations.fibonacciTimeZones.typeOptions.line.stroke
             */
            stroke: 'rgba(0, 0, 0, 0.75)',
            /**
             * The width of the lines.
             *
             * @type      {number}
             * @since 9.3.0
             * @default   1
             * @apioption annotations.fibonacciTimeZones.typeOptions.line.strokeWidth
             */
            strokeWidth: 1,
            // Don't inherit fill (don't display in popup edit)
            fill: void 0
        },
        controlPointOptions: {
            positioner: function () {
                var _a;
                // The control point is in the middle of the second line
                var target = this.target, graphic = this.graphic, edgePoints = target.secondLineEdgePoints, args = { annotation: target }, firstEdgePointY = edgePoints[0](args).y, secondEdgePointY = edgePoints[1](args).y, plotLeft = this.chart.plotLeft, plotTop = this.chart.plotTop;
                var x = edgePoints[0](args).x, y = (firstEdgePointY + secondEdgePointY) / 2;
                if (this.chart.inverted) {
                    _a = [y, x], x = _a[0], y = _a[1];
                }
                return {
                    x: plotLeft + x - graphic.width / 2,
                    y: plotTop + y - graphic.height / 2
                };
            },
            events: {
                drag: function (e, target) {
                    var isInsidePlot = target.chart.isInsidePlot(e.chartX - target.chart.plotLeft, e.chartY - target.chart.plotTop, {
                        visiblePlotOnly: true
                    });
                    if (isInsidePlot) {
                        var translation = this.mouseMoveToTranslation(e);
                        target.translatePoint(translation.x, 0, 1);
                        target.redraw(false);
                    }
                }
            }
        }
    }
});
/* *
 *
 *  Registry
 *
 * */
Annotation.types.fibonacciTimeZones = FibonacciTimeZones;
/* *
 *
 *  Default Export
 *
 * */
export default FibonacciTimeZones;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * The Fibonacci Time Zones annotation.
 *
 * @sample highcharts/annotations-advanced/fibonacci-time-zones/
 *         Fibonacci Time Zones
 *
 * @extends   annotations.crookedLine
 * @since 9.3.0
 * @product   highstock
 * @apioption annotations.fibonacciTimeZones
 */
/**
 * @exclude   y
 * @since 9.3.0
 * @product   highstock
 * @apioption annotations.fibonacciTimeZones.typeOptions.points
 */
(''); // keeps doclets above in transpiled file
