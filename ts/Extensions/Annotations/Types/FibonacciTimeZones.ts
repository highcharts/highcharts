/* *
 *
 *  Author: Rafal Sebestjanski
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type PositionObject from '../../../Core/Renderer/PositionObject';

import Annotation from '../Annotations.js';
import ControlPoint from '../ControlPoint.js';
import CrookedLine from './CrookedLine.js';
import InfinityLine from './InfinityLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationControllable {
            secondLineEdgePoints: [Function, Function];
        }
    }
}

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

class FibonacciTimeZones extends CrookedLine {

    /* *
     *
     * Static Functions
     *
     * */

    /*
    Method taken (and slightly changed) from the InfinityLine annotation.

    It uses x coordinate to create two mock points on the same x. Then,
    it uses some logic from InfinityLine to find equation of the line passing
    through our two points and, using that equation, if finds and returns
    the coordinates of where the line intersects the plot area edges.

    This is being done for each fibonacci time zone line.

            this point here is found
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
            and this point here is found

    */
    private edgePoint(
        startIndex: number,
        endIndex: number,
        fibonacciIndex: number
    ): Function {
        return function (target: any): PositionObject {
            const annotation = target.annotation;
            let points = annotation.points;
            // Offset between the first and the second line
            const deltaX = points.length > 1 ? points[1].x - points[0].x : 0,
                // firstLine.x + fibb * offset
                x = points[0].x + fibonacciIndex * deltaX;

            // We need 2 mock points with the same x coordinate, different y
            points = [
                new MockPoint(
                    annotation.chart,
                    points[0].target,
                    {
                        x: x,
                        y: 0,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    }
                ),
                new MockPoint(
                    annotation.chart,
                    points[0].target,
                    {
                        x: x,
                        y: 1,
                        xAxis: points[0].options.xAxis,
                        yAxis: points[0].options.yAxis
                    }
                )
            ];

            return InfinityLine.findEdgePoint(
                points[startIndex],
                points[endIndex]
            );
        };
    }

    /* *
     *
     *  Functions
     *
     * */

    public addShapes(): void {
        const numberOfLines = 11;
        let fibb = 1,
            nextFibb = 1;

        for (let i = 0; i < numberOfLines; i++) {
            // The fibb variable equals to 1 twice - correct it in the first
            // iteration so the lines don't overlap
            const correctedFibb = !i ? 0 : fibb,
                points = [
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

            this.initShape(
                merge(
                    this.options.typeOptions.line,
                    {
                        type: 'path',
                        points: points
                    }
                ),
                i // shape's index. Can be found in annotation.shapes[i].index
            );
        }
    }

    public addControlPoints(): void {
        const options = this.options,
            typeOptions = options.typeOptions as FibonacciTimeZones.TypeOptions,
            controlPoint = new ControlPoint(
                this.chart,
                this,
                merge(
                    options.controlPointOptions,
                    typeOptions.controlPointOptions
                ),
                0
            );

        this.controlPoints.push(controlPoint);

        typeOptions.controlPointOptions = controlPoint.options;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface FibonacciTimeZones {
    defaultOptions: CrookedLine['defaultOptions'];
}
FibonacciTimeZones.prototype.defaultOptions = merge(
    CrookedLine.prototype.defaultOptions,
    {
        typeOptions: {
            controlPointOptions: {
                positioner: function (
                    this: Highcharts.AnnotationControlPoint
                ): PositionObject {
                    // The control point is in the middle of the second line
                    const target = this.target,
                        graphic = this.graphic,
                        edgePoints = target.secondLineEdgePoints,
                        args = { annotation: target },
                        firstEdgePointY: number = edgePoints[0](args).y,
                        secondEdgePointY: number = edgePoints[1](args).y,
                        x: number = edgePoints[0](args).x,
                        y: number = (firstEdgePointY + secondEdgePointY) / 2,
                        plotLeft = this.chart.plotLeft,
                        plotTop = this.chart.plotTop;

                    return {
                        x: plotLeft + x - graphic.width / 2,
                        y: plotTop + y - graphic.height / 2
                    };
                },
                events: {
                    drag: function (
                        this: FibonacciTimeZones,
                        e: Highcharts.AnnotationEventObject,
                        target: FibonacciTimeZones
                    ): void {
                        const isInsidePlot = target.chart.isInsidePlot(
                            e.chartX - target.chart.plotLeft,
                            e.chartY - target.chart.plotTop,
                            {
                                visiblePlotOnly: true
                            }
                        );

                        if (isInsidePlot) {
                            const translation = this.mouseMoveToTranslation(e);

                            target.translatePoint(translation.x, 0, 1);

                            target.redraw(false);
                        }
                    }
                }
            }
        }
    }
);

/* *
 *
 *  Class Namespace
 *
 * */

namespace FibonacciTimeZones {
    export interface Options extends CrookedLine.Options{
        typeOptions: TypeOptions;
    }
    export interface TypeOptions extends CrookedLine.TypeOptions {
        type: string;
        controlPointOptions: Highcharts.AnnotationControlPointOptionsObject;
    }
}

/* *
 *
 *  Registry
 *
 * */

Annotation.types.fibonacciTimeZones = FibonacciTimeZones;
declare module './AnnotationType'{
    interface AnnotationTypeRegistry {
        fibonacciTimeZones: typeof FibonacciTimeZones;
    }
}

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
 * @product   highstock
 * @apioption annotations.fibonacciTimeZones
 */

/**
 * @exclude   y
 * @product   highstock
 * @apioption annotations.fibonacciTimeZones.typeOptions.points
 */

(''); // keeps doclets above in transpiled file
