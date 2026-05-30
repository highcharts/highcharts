/* *
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { AnnotationPointType } from '../AnnotationSeries';
import type Axis from '../../../Core/Axis/Axis';
import type PositionObject from '../../../Core/Renderer/PositionObject';

import Annotation from '../Annotation.js';
import CrookedLine from './CrookedLine.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import MockPoint from '../MockPoint.js';
import { AnnotationMockPointFunction } from '../AnnotationOptions';
import { merge } from '../../../Shared/Utilities.js';

if (defaultOptions.annotations?.types) {
    /**
     * Options for the infinity line annotation type.
     *
     * @sample highcharts/annotations-advanced/infinity-line/
     *         Infinity line
     *
     * @extends      annotations.types.crookedLine
     * @product      highstock
     * @optionparent annotations.types.infinityLine
     */
    defaultOptions.annotations.types.infinityLine = merge(
        defaultOptions.annotations.types.crookedLine
    );
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class InfinityLine extends CrookedLine {

    /* *
     *
     *  Static Properties
     *
     * */

    public static endEdgePoint = InfinityLine.edgePoint(0, 1);
    public static startEdgePoint = InfinityLine.edgePoint(1, 0);

    /* *
     *
     *  Static Functions
     *
     * */

    private static edgePoint(
        startIndex: number,
        endIndex: number
    ): AnnotationMockPointFunction {
        return function (target: any): PositionObject {
            const annotation = target.annotation,
                type = annotation.options.typeOptions.type;

            let points = annotation.points;

            if (type === 'horizontalLine' || type === 'verticalLine') {
                // Horizontal and vertical lines have only one point,
                // make a copy of it:
                points = [
                    points[0],
                    new MockPoint(
                        annotation.chart,
                        points[0].target,
                        {
                            // Add 0 or 1 to x or y depending on type
                            x: points[0].x + +(type === 'horizontalLine'),
                            y: points[0].y + +(type === 'verticalLine'),
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
        firstPoint: PositionObject,
        secondPoint: PositionObject,
        xOrY: ('x'|'y'),
        edgePointFirstCoordinate: number
    ): number {
        const xOrYOpposite: ('x'|'y') = xOrY === 'x' ? 'y' : 'x';

        // Solves equation for x or y
        // y - y1 = (y2 - y1) / (x2 - x1) * (x - x1)
        return (
            (secondPoint[xOrY] - firstPoint[xOrY]) *
            (edgePointFirstCoordinate - firstPoint[xOrYOpposite]) /
            (secondPoint[xOrYOpposite] - firstPoint[xOrYOpposite]) +
            firstPoint[xOrY]
        );
    }

    public static findEdgePoint(
        firstPoint: AnnotationPointType,
        secondPoint: AnnotationPointType
    ): PositionObject {
        const chart = firstPoint.series.chart,
            xAxis: Axis = firstPoint.series.xAxis as any,
            yAxis: Axis = secondPoint.series.yAxis as any,
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
            };

        let edgePointX,
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

        edgePoint.x -= chart.plotLeft;
        edgePoint.y -= chart.plotTop;

        if (firstPoint.series.chart.inverted) {
            swap = edgePoint.x;
            edgePoint.x = edgePoint.y;
            edgePoint.y = swap;
        }

        return edgePoint;
    }

    /* *
     *
     *  Functions
     *
     * */

    public addShapes(): void {
        const typeOptions = (
                this.options.typeOptions as InfinityLine.TypeOptions
            ),
            points = [
                this.points[0],
                InfinityLine.endEdgePoint
            ];

        // Be case-insensitive (#15155) e.g.:
        // - line
        // - horizontalLine
        // - verticalLine
        if (typeOptions.type.match(/line/gi)) {
            points[0] = InfinityLine.startEdgePoint;
        }

        const line = this.initShape(
            merge(typeOptions.line, {
                type: 'path',
                className: 'highcharts-infinity-lines',
                points: points as any
            }),
            0
        );

        typeOptions.line = line.options;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface InfinityLine {
    defaultOptions: CrookedLine['defaultOptions'];
}

/* *
 *
 *  Class Namespace
 *
 * */

namespace InfinityLine {
    /**
     * Options for the infinity line annotation type.
     *
     * @sample highcharts/annotations-advanced/infinity-line/
     *         Infinity line
     *
     * @extends      annotations.types.crookedLine
     * @product      highstock
     * @optionparent annotations.types.infinityLine
     */
    export interface Options extends CrookedLine.Options{
        typeOptions: TypeOptions;
    }
    export interface TypeOptions extends CrookedLine.TypeOptions {
        type: string;
    }
}

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module './AnnotationType'{
    interface AnnotationTypeRegistry {
        infinityLine: typeof InfinityLine;
    }
}

Annotation.types.infinityLine = InfinityLine;

/* *
 *
 *  Default Export
 *
 * */

export default InfinityLine;
