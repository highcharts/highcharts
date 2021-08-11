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

class FibonacciTimezones extends CrookedLine {

    /* *
     *
     * Static Functions
     *
     * */

    private static edgePoint(
        startIndex: number,
        endIndex: number,
        fibonacciIndex: number
    ): Function {
        return function (target: any): PositionObject {
            let annotation = target.annotation,
                points = annotation.points,
                // Offset between the first and the second line
                deltaX = points.length > 1 ? points[1].x - points[0].x : 0,
                // firstLine.x + fibb * offset
                x = points[0].x + fibonacciIndex * deltaX;

            // Horizontal and vertical lines have only one point,
            // make a copy of it:
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
     *  Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: FibonacciTimezones.Options) {
        super(chart, options);
    }

    /* *
     *
     *  Functions
     *
     * */

    public addShapes(): void {
        let fibb = 1,
            nextFibb = 1,
            temp: number;

        for (let i = 0; i < 11; i++) {
            const points = [
                // Correct the first line position (we cannot correct the fibb
                // variable because it's needed for further iterations)
                FibonacciTimezones.edgePoint(1, 0, !i ? 0 : fibb),
                FibonacciTimezones.edgePoint(0, 1, !i ? 0 : fibb)
            ];

            temp = nextFibb;
            nextFibb = fibb + nextFibb;
            fibb = temp;

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
                false as any
            );
        }
    }

    public addControlPoints(): void {
        const options = this.options,
            typeOptions = options.typeOptions as FibonacciTimezones.TypeOptions,
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

interface FibonacciTimezones {
    defaultOptions: CrookedLine['defaultOptions'];
}
FibonacciTimezones.prototype.defaultOptions = merge(
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
                        this: FibonacciTimezones,
                        e: Highcharts.AnnotationEventObject,
                        target: FibonacciTimezones
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

namespace FibonacciTimezones {
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

Annotation.types.fibonacciTimezones = FibonacciTimezones;
declare module './AnnotationType'{
    interface AnnotationTypeRegistry {
        fibonacciTimezones: typeof FibonacciTimezones;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default FibonacciTimezones;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * The Fibonacci Timezones annotation.
 *
 * @sample highcharts/annotations-advanced/infinity-line/
 *         Infinity Line
 *
 * @extends   annotations.crookedLine
 * @product   highstock
 * @apioption annotations.fibonacciTimezones
 */

(''); // keeps doclets above in transpiled file
