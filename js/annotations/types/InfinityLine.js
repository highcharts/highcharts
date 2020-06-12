/* *
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
import Annotation from '../annotations.src.js';
import CrookedLine from './CrookedLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var InfinityLine = /** @class */ (function (_super) {
    __extends(InfinityLine, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function InfinityLine(chart, options) {
        return _super.call(this, chart, options) || this;
    }
    /* *
     *
     * Static Functions
     *
     * */
    InfinityLine.edgePoint = function (startIndex, endIndex) {
        return function (target) {
            var annotation = target.annotation, points = annotation.points, type = annotation.options.typeOptions.type;
            if (type === 'horizontalLine') {
                // Horizontal line has only one point,
                // make a copy of it:
                points = [
                    points[0],
                    new MockPoint(annotation.chart, points[0].target, {
                        x: points[0].x + 1,
                        y: points[0].y,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    })
                ];
            }
            else if (type === 'verticalLine') {
                // The same for verticalLine type:
                points = [
                    points[0],
                    new MockPoint(annotation.chart, points[0].target, {
                        x: points[0].x,
                        y: points[0].y + 1,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    })
                ];
            }
            return InfinityLine.findEdgePoint(points[startIndex], points[endIndex]);
        };
    };
    InfinityLine.findEdgeCoordinate = function (firstPoint, secondPoint, xOrY, edgePointFirstCoordinate) {
        var xOrYOpposite = xOrY === 'x' ? 'y' : 'x';
        // solves equation for x or y
        // y - y1 = (y2 - y1) / (x2 - x1) * (x - x1)
        return ((secondPoint[xOrY] - firstPoint[xOrY]) *
            (edgePointFirstCoordinate - firstPoint[xOrYOpposite]) /
            (secondPoint[xOrYOpposite] - firstPoint[xOrYOpposite]) +
            firstPoint[xOrY]);
    };
    InfinityLine.findEdgePoint = function (firstPoint, secondPoint) {
        var xAxis = firstPoint.series.xAxis, yAxis = secondPoint.series.yAxis, firstPointPixels = MockPoint.pointToPixels(firstPoint), secondPointPixels = MockPoint.pointToPixels(secondPoint), deltaX = secondPointPixels.x - firstPointPixels.x, deltaY = secondPointPixels.y - firstPointPixels.y, xAxisMin = xAxis.left, xAxisMax = xAxisMin + xAxis.width, yAxisMin = yAxis.top, yAxisMax = yAxisMin + yAxis.height, xLimit = deltaX < 0 ? xAxisMin : xAxisMax, yLimit = deltaY < 0 ? yAxisMin : yAxisMax, edgePoint = {
            x: deltaX === 0 ? firstPointPixels.x : xLimit,
            y: deltaY === 0 ? firstPointPixels.y : yLimit
        }, edgePointX, edgePointY, swap;
        if (deltaX !== 0 && deltaY !== 0) {
            edgePointY = InfinityLine.findEdgeCoordinate(firstPointPixels, secondPointPixels, 'y', xLimit);
            edgePointX = InfinityLine.findEdgeCoordinate(firstPointPixels, secondPointPixels, 'x', yLimit);
            if (edgePointY >= yAxisMin && edgePointY <= yAxisMax) {
                edgePoint.x = xLimit;
                edgePoint.y = edgePointY;
            }
            else {
                edgePoint.x = edgePointX;
                edgePoint.y = yLimit;
            }
        }
        edgePoint.x -= xAxisMin;
        edgePoint.y -= yAxisMin;
        if (firstPoint.series.chart.inverted) {
            swap = edgePoint.x;
            edgePoint.x = edgePoint.y;
            edgePoint.y = swap;
        }
        return edgePoint;
    };
    /* *
     *
     *  Functions
     *
     * */
    InfinityLine.prototype.addShapes = function () {
        var typeOptions = this.options.typeOptions, points = [
            this.points[0],
            InfinityLine.endEdgePoint
        ];
        if (typeOptions.type.match(/Line/g)) {
            points[0] = InfinityLine.startEdgePoint;
        }
        var line = this.initShape(merge(typeOptions.line, {
            type: 'path',
            points: points
        }), false);
        typeOptions.line = line.options;
    };
    /**
     *
     * Static Properties
     *
     */
    InfinityLine.endEdgePoint = InfinityLine.edgePoint(0, 1);
    InfinityLine.startEdgePoint = InfinityLine.edgePoint(1, 0);
    return InfinityLine;
}(CrookedLine));
InfinityLine.prototype.defaultOptions = merge(CrookedLine.prototype.defaultOptions, {});
/**
 * An infinity line annotation.
 *
 * @sample highcharts/annotations-advanced/infinity-line/
 *         Infinity Line
 *
 * @extends   annotations.crookedLine
 * @product   highstock
 * @apioption annotations.infinityLine
 */
Annotation.types.infinityLine = InfinityLine;
export default InfinityLine;
