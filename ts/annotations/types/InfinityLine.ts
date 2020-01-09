/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationInfinityLine extends AnnotationCrookedLine {
            public static endEdgePoint: Function;
            public static startEdgePoint: Function;
            public static findEdgeCoordinate(
                firstPoint: PositionObject,
                secondPoint: PositionObject,
                xOrY: ('x'|'y'),
                edgePointFirstCoordinate: number
            ): number;
            public static findEdgePoint(
                firstPoint: AnnotationPointType,
                secondPoint: AnnotationPointType
            ): PositionObject;
            public options: AnnotationInfinityLineOptionsObject;
            public addShapes(): void;
        }
        interface AnnotationInfinityLineOptionsObject extends AnnotationCrookedLineOptionsObject {
            typeOptions: AnnotationInfinityLineTypeOptionsObject;
        }
        interface AnnotationInfinityLineTypeOptionsObject extends AnnotationCrookedLineTypeOptionsObject {
            type: string;
        }
        interface AnnotationTypesDictionary {
            infinityLine: typeof AnnotationInfinityLine;
        }
    }
}


import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    MockPoint = Annotation.MockPoint,
    CrookedLine = Annotation.types.crookedLine;

/* eslint-disable no-invalid-this, valid-jsdoc */

const InfinityLine: typeof Highcharts.AnnotationInfinityLine = function (
    this: Highcharts.AnnotationInfinityLine
): void {
    CrookedLine.apply(this, arguments as any);
} as any;

InfinityLine.findEdgeCoordinate = function (
    firstPoint: Highcharts.PositionObject,
    secondPoint: Highcharts.PositionObject,
    xOrY: ('x'|'y'),
    edgePointFirstCoordinate: number
): number {
    var xOrYOpposite: ('x'|'y') = xOrY === 'x' ? 'y' : 'x';

    // solves equation for x or y
    // y - y1 = (y2 - y1) / (x2 - x1) * (x - x1)
    return (
        (secondPoint[xOrY] - firstPoint[xOrY]) *
        (edgePointFirstCoordinate - firstPoint[xOrYOpposite]) /
        (secondPoint[xOrYOpposite] - firstPoint[xOrYOpposite]) +
        firstPoint[xOrY]
    );
};

InfinityLine.findEdgePoint = function (
    firstPoint: Highcharts.AnnotationPointType,
    secondPoint: Highcharts.AnnotationPointType
): Highcharts.PositionObject {
    var xAxis: Highcharts.Axis = firstPoint.series.xAxis as any,
        yAxis: Highcharts.Axis = secondPoint.series.yAxis as any,
        firstPointPixels = MockPoint.pointToPixels(firstPoint),
        secondPointPixels = MockPoint.pointToPixels(secondPoint),
        deltaX = secondPointPixels.x - firstPointPixels.x,
        deltaY = secondPointPixels.y - firstPointPixels.y,
        xAxisMin = xAxis.left,
        xAxisMax = xAxisMin + xAxis.width,
        yAxisMin = yAxis.top,
        yAxisMax = yAxisMin + yAxis.height,
        xLimit = deltaX < 0 ? xAxisMin : xAxisMax,
        yLimit = deltaY < 0 ? yAxisMin : yAxisMax,
        edgePoint = {
            x: deltaX === 0 ? firstPointPixels.x : xLimit,
            y: deltaY === 0 ? firstPointPixels.y : yLimit
        },
        edgePointX,
        edgePointY,
        swap;

    if (deltaX !== 0 && deltaY !== 0) {
        edgePointY = InfinityLine.findEdgeCoordinate(
            firstPointPixels,
            secondPointPixels,
            'y',
            xLimit
        );

        edgePointX = InfinityLine.findEdgeCoordinate(
            firstPointPixels,
            secondPointPixels,
            'x',
            yLimit
        );

        if (edgePointY >= yAxisMin && edgePointY <= yAxisMax) {
            edgePoint.x = xLimit;
            edgePoint.y = edgePointY;
        } else {
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

var edgePoint = function (startIndex: number, endIndex: number): Function {
    return function (target: any): Highcharts.PositionObject {
        var annotation = target.annotation,
            points = annotation.points,
            type = annotation.options.typeOptions.type;

        if (type === 'horizontalLine') {
            // Horizontal line has only one point,
            // make a copy of it:
            points = [
                points[0],
                new MockPoint(
                    annotation.chart,
                    points[0].target,
                    {
                        x: points[0].x + 1,
                        y: points[0].y,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    }
                )
            ];
        } else if (type === 'verticalLine') {
            // The same for verticalLine type:
            points = [
                points[0],
                new MockPoint(
                    annotation.chart,
                    points[0].target,
                    {
                        x: points[0].x,
                        y: points[0].y + 1,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    }
                )
            ];
        }

        return InfinityLine.findEdgePoint(
            points[startIndex],
            points[endIndex]
        );
    };
};

InfinityLine.endEdgePoint = edgePoint(0, 1);
InfinityLine.startEdgePoint = edgePoint(1, 0);

H.extendAnnotation(
    InfinityLine,
    CrookedLine,
    {
        addShapes: function (this: Highcharts.AnnotationInfinityLine): void {
            var typeOptions = this.options.typeOptions,
                points = [
                    this.points[0],
                    InfinityLine.endEdgePoint
                ];

            if (typeOptions.type.match(/Line/g)) {
                points[0] = InfinityLine.startEdgePoint;
            }

            var line = this.initShape(
                H.merge(typeOptions.line, {
                    type: 'path',
                    points: points
                }),
                false as any
            );

            typeOptions.line = line.options;
        }

    }
);

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
