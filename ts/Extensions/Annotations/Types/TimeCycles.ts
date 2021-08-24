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
import MockPointOptions from '../MockPointOptions';
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

/**
 * Function to create start of the path.
 * @param {number} x x position of the TimeCycles
 * @param {number} y y position of the TimeCycles
 * @return {string} path
 */
function getStartingPath(x: number, y: number): string {
    return `M ${x} ${y}`;
}

/**
 * function to create circle paths
 *
 * @param {number} r radius
 * @param {number} numberOfCircles number of cricles
 * @return {string} path
 */
function getCirclePath(r: number, numberOfCircles: number): string {
    const strToRepeat = `a 1 1 0 1 1 ${2 * r} 0 `;
    let path = '';
    for (let i = 0; i < numberOfCircles; i++) {
        path += strToRepeat;
    }

    return path.trim();
}

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

class TimeCycles extends CrookedLine {


    public getD(): string {
        const point = this.options.point as MockPointOptions,
            x = point.x,
            xAxisNumber = point.xAxis as number || 0,
            xAxis = this.chart.xAxis[xAxisNumber],
            y = point.y || xAxis.top + xAxis.height,
            xAxisLength = xAxis.len,
            r = this.options.r as number,
            numberOfCircles = Math.floor(xAxisLength / r) + 2,
            pixelShift = (Math.floor((x - xAxis.left) / r) + 1) * r;

        return `${getStartingPath(x - pixelShift, y)} ${getCirclePath(r, numberOfCircles)}`;
    }

    public addShapes(): void {
        const typeOptions = this.options.typeOptions,
            shape = this.initShape(
                merge(typeOptions.line, {
                    type: 'path',
                    d: this.getD(),
                    points: this.points.map(function (
                        _point: Highcharts.AnnotationPointType,
                        i: number
                    ): any {
                        return function (
                            target: Highcharts.AnnotationControllable
                        ): Highcharts.AnnotationPointType {
                            return target.annotation.points[i];
                        } as any;
                    })
                }),
                false as any
            );

        typeOptions.line = shape.options;
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface TimeCycles {
    defaultOptions: CrookedLine['defaultOptions'];
}
TimeCycles.prototype.defaultOptions = merge(
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
                        this: TimeCycles,
                        e: Highcharts.AnnotationEventObject,
                        target: TimeCycles
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

namespace TimeCycles {
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

Annotation.types.timeCycles = TimeCycles;
declare module './AnnotationType'{
    interface AnnotationTypeRegistry {
        timeCycles: typeof TimeCycles;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default TimeCycles;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * The Fibonacci Timezones annotation.
 *
 * @sample highcharts/annotations-advanced/fibonacci-timezones/
 *         Fibonacci Timezones
 *
 * @extends   annotations.crookedLine
 * @product   highstock
 * @apioption annotations.timeCycles
 */

/**
 * @exclude   y
 * @product   highstock
 * @apioption annotations.timeCycles.typeOptions.points
 */

(''); // keeps doclets above in transpiled file
