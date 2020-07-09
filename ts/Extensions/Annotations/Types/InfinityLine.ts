/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import Annotation from '../Annotations.js';
import CrookedLine from './CrookedLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationInfinityLineOptionsObject extends AnnotationCrookedLineOptionsObject {
            typeOptions: AnnotationInfinityLineTypeOptionsObject;
        }
        interface AnnotationInfinityLineTypeOptionsObject extends AnnotationCrookedLineTypeOptionsObject {
            type: string;
        }
        interface AnnotationTypesRegistry {
            infinityLine: typeof InfinityLine;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */
class InfinityLine extends CrookedLine {

    /**
     *
     * Static Properties
     *
     */

    public static endEdgePoint = InfinityLine.edgePoint(0, 1);
    public static startEdgePoint = InfinityLine.edgePoint(1, 0);

    /* *
     *
     * Static Functions
     *
     * */

    private static edgePoint(startIndex: number, endIndex: number): Function {
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
    }

    public static findEdgeCoordinate(
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
    }

    public static findEdgePoint(
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
    }

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationInfinityLineOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     *  Functions
     *
     * */

    public addShapes(): void {
        var typeOptions = this.options.typeOptions as Highcharts.AnnotationInfinityLineTypeOptionsObject,
            points = [
                this.points[0],
                InfinityLine.endEdgePoint
            ];

        if (typeOptions.type.match(/Line/g)) {
            points[0] = InfinityLine.startEdgePoint;
        }

        var line = this.initShape(
            merge(typeOptions.line, {
                type: 'path',
                points: points
            }),
            false as any
        );

        typeOptions.line = line.options;
    }

}

/**
 * @private
 */
interface InfinityLine {
    defaultOptions: CrookedLine['defaultOptions'];
}

InfinityLine.prototype.defaultOptions = merge(
    CrookedLine.prototype.defaultOptions,
    {}
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
