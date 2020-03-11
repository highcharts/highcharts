/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
var Annotation = H.Annotation, MockPoint = Annotation.MockPoint, CrookedLine = Annotation.types.crookedLine;
/* eslint-disable no-invalid-this, valid-jsdoc */
var InfinityLine = function () {
    CrookedLine.apply(this, arguments);
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
var edgePoint = function (startIndex, endIndex) {
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
InfinityLine.endEdgePoint = edgePoint(0, 1);
InfinityLine.startEdgePoint = edgePoint(1, 0);
H.extendAnnotation(InfinityLine, CrookedLine, {
    addShapes: function () {
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
    }
});
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
