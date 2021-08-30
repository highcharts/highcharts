/* *
 *
 *  Authors: Rafal Sebestjanski and Pawel Lysy
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
import CrookedLine from './CrookedLine.js';
import ControlPoint from '../ControlPoint.js';
import U from '../../../Core/Utilities.js';
const { merge, isNumber } = U;

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
 * @param {number} pixelInterval diameter of the circle in pixels
 * @param {number} numberOfCircles number of cricles
 * @return {string} path
 */
function getCirclePath(pixelInterval: number, numberOfCircles: number): string {
    const strToRepeat = `a 1 1 0 1 1 ${pixelInterval} 0 `;
    let path = strToRepeat;
    for (let i = 1; i < numberOfCircles; i++) {
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

    public getPath(): string {

        return `${getStartingPath(this.startX, this.y)} ${getCirclePath(
            this.pixelInterval,
            this.numberOfCircles
        )}`;
    }

    public setControlPointsVisibility(): void {

        super.setControlPointsVisibility.apply(this, arguments);
    }

    public addShapes(): void {
        const typeOptions = this.options.typeOptions;
        const shape = this.initShape(
            merge(typeOptions.line, {
                type: 'path',

                d: this.getPath(),
                points: this.options.typeOptions.points
            }),
            false as any
        );

        typeOptions.line = shape.options;
    }

    public addControlPoints(): void {
        const options = this.options,
            typeOptions = options.typeOptions as TimeCycles.TypeOptions,
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

    public setPathProperties(): void {
        const point = (this.options.typeOptions.points as any)[0],
            // If point.x and point.y are undefined,
            // the dragging in given direction is disabled.
            xValue = point.x,
            yValue = point.y,
            xAxisNumber = (point.xAxis as number) || 0,
            yAxisNumber = (point.yAxis as number) || 0,
            xAxis = this.chart.xAxis[xAxisNumber],
            yAxis = this.chart.yAxis[yAxisNumber],
            y = isNumber(yValue) && !isNaN(yValue) ? yAxis.toPixels(yValue) : yAxis.top + yAxis.height,
            x = isNumber(xValue) && !isNaN(xValue) ? xAxis.toPixels(xValue) : xAxis.left,
            r = this.options.r,
            xAxisLength = xAxis.len,
            pixelInterval = r ? r * 2 :
                (xAxisLength * (this.options.typeOptions as any).period) /
                ((xAxis.max as number) - (xAxis.min as number)),
            numberOfCircles = Math.floor(xAxisLength / pixelInterval) + 2,
            pixelShift =
                (Math.floor((x - xAxis.left) / pixelInterval) + 1) *
                pixelInterval;
        this.startX = (x - pixelShift);
        this.y = y;
        this.pixelInterval = pixelInterval;
        this.numberOfCircles = numberOfCircles;
    }

    public redraw(animation: boolean): void {
        super.redraw(animation);
        // this.setPosition();
        if (this.shapes[0]) {
            this.shapes[0].attr({ d: this.getPath() });
        }
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface TimeCycles {
    defaultOptions: CrookedLine['defaultOptions'];
    startX: number;
    pixelInterval: number;
    numberOfCircles: number;
    y: number;
}
TimeCycles.prototype.defaultOptions = merge(
    CrookedLine.prototype.defaultOptions,
    {
        typeOptions: {
            controlPointOptions: {
                positioner: function (
                    this: Highcharts.AnnotationControlPoint,
                    target: TimeCycles
                ): PositionObject {
                    const postion = {
                        x:
                            target.startX +
                            target.pixelInterval * 1.5 -
                            this.graphic.width / 2,
                        y:
                            target.y -
                            target.pixelInterval / 2 -
                            this.graphic.height / 2
                    };
                    return postion;
                },
                events: {
                    drag: function (
                        this: ControlPoint,
                        e: Highcharts.AnnotationEventObject,
                        target: TimeCycles
                    ): void {
                        const y = target.y,
                            dy = Math.abs(e.chartY - y);
                        target.options.r = Math.max(dy, 5);
                        target.redraw(false);
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
    export interface Options extends CrookedLine.Options {
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
declare module './AnnotationType' {
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
