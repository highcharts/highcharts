/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ColorString from '../../../Core/Color/ColorString';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import Annotation from '../Annotations.js';
import MockPoint from '../MockPoint.js';
import Tunnel from './Tunnel.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationFibonacci extends Tunnel {
            public static levels: Array<number>;
            public options: AnnotationFibonacciOptionsObject;
            public endRetracements: Array<AnnotationMockPoint>;
            public startRetracements: Array<AnnotationMockPoint>;
            public addLabels(): void;
            public addShapes(): void;
            public linkPoints: () => undefined;
            public linkRetracementPoint(
                pointIndex: number,
                x: number,
                y: number,
                retracements: Array<AnnotationMockPoint>
            ): void;
            public linkRetracementsPoints(): void;
        }
        interface AnnotationFibonacciOptionsObject extends AnnotationTunnelOptionsObject {
            typeOptions: AnnotationFibonacciTypeOptionsObject;
        }
        interface AnnotationFibonacciTypeOptionsObject extends AnnotationTunnelTypeOptionsObject {
            backgroundColors: Array<ColorString>;
            labels: Array<AnnotationCrookedLineOptionsObject['labelOptions']>;
            lineColor: ColorString;
            lineColors: Array<ColorString>;
        }
    }
}


/* eslint-disable no-invalid-this, valid-jsdoc */

var createPathDGenerator = function (retracementIndex: number, isBackground?: boolean): Function {
    return function (this: Highcharts.AnnotationControllable): SVGPath {
        var annotation = this.annotation as Highcharts.AnnotationFibonacci,
            leftTop = this.anchor(
                annotation.startRetracements[retracementIndex]
            ).absolutePosition,
            rightTop = this.anchor(
                annotation.endRetracements[retracementIndex]
            ).absolutePosition,
            d: SVGPath = [
                ['M', Math.round(leftTop.x), Math.round(leftTop.y)],
                ['L', Math.round(rightTop.x), Math.round(rightTop.y)]
            ],
            rightBottom: PositionObject,
            leftBottom: PositionObject;

        if (isBackground) {
            rightBottom = this.anchor(
                annotation.endRetracements[retracementIndex - 1]
            ).absolutePosition;

            leftBottom = this.anchor(
                annotation.startRetracements[retracementIndex - 1]
            ).absolutePosition;

            d.push(
                ['L', Math.round(rightBottom.x), Math.round(rightBottom.y)],
                ['L', Math.round(leftBottom.x), Math.round(leftBottom.y)]
            );
        }

        return d;
    };
};

class Fibonacci extends Tunnel {

    /* *
     *
     * Static properties
     *
     * */

    public static levels = [0, 0.236, 0.382, 0.5, 0.618, 0.786, 1];

    /* *
     *
     * Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationFibonacciOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public endRetracements?: Array<Highcharts.AnnotationMockPoint>;
    public startRetracements?: Array<Highcharts.AnnotationMockPoint>;

    /* *
     *
     * Functions
     *
     * */

    public linkPoints(): undefined {
        super.linkPoints();

        this.linkRetracementsPoints();

        return;
    }

    public linkRetracementsPoints(): void {
        var points = this.points,
            startDiff = (points[0].y as any) - (points[3].y as any),
            endDiff = (points[1].y as any) - (points[2].y as any),
            startX: number = points[0].x as any,
            endX: number = points[1].x as any;

        Fibonacci.levels.forEach(function (level: number, i: number): void {
            var startRetracement = (points[0].y as any) - startDiff * level,
                endRetracement = (points[1].y as any) - endDiff * level;

            this.startRetracements = this.startRetracements || [];
            this.endRetracements = this.endRetracements || [];

            this.linkRetracementPoint(
                i,
                startX,
                startRetracement,
                this.startRetracements
            );

            this.linkRetracementPoint(
                i,
                endX,
                endRetracement,
                this.endRetracements
            );
        }, this);
    }

    public linkRetracementPoint(
        pointIndex: number,
        x: number,
        y: number,
        retracements: Array<Highcharts.AnnotationMockPoint>
    ): void {
        var point = retracements[pointIndex],
            typeOptions = this.options.typeOptions;

        if (!point) {
            retracements[pointIndex] = new MockPoint(
                this.chart,
                this,
                {
                    x: x,
                    y: y,
                    xAxis: typeOptions.xAxis,
                    yAxis: typeOptions.yAxis
                }
            );
        } else {
            (point.options as any).x = x;
            (point.options as any).y = y;

            point.refresh();
        }
    }

    public addShapes(): void {
        Fibonacci.levels.forEach(function (this: Highcharts.AnnotationFibonacci, _level: number, i: number): void {
            this.initShape({
                type: 'path',
                d: createPathDGenerator(i)
            }, false as any);

            if (i > 0) {
                (this.initShape as any)({
                    type: 'path',
                    fill: this.options.typeOptions.backgroundColors[i - 1],
                    strokeWidth: 0,
                    d: createPathDGenerator(i, true)
                });
            }
        }, this);
    }

    public addLabels(): void {
        Fibonacci.levels.forEach(function (this: Highcharts.AnnotationFibonacci, level: number, i: number): void {
            var options = this.options.typeOptions,
                label = (this.initLabel as any)(
                    merge(options.labels[i], {
                        point: function (target: any): Highcharts.AnnotationMockPointOptionsObject {
                            var point = MockPoint.pointToOptions(
                                target.annotation.startRetracements[i]
                            );

                            return point;
                        },
                        text: level.toString()
                    })
                );

            options.labels[i] = label.options;
        }, this);
    }
}

interface Fibonacci {
    defaultOptions: Tunnel['defaultOptions'];
}

Fibonacci.prototype.defaultOptions = merge(
    Tunnel.prototype.defaultOptions,
    /**
     * A fibonacci annotation.
     *
     * @sample highcharts/annotations-advanced/fibonacci/
     *         Fibonacci
     *
     * @extends      annotations.crookedLine
     * @product      highstock
     * @optionparent annotations.fibonacci
     */
    {
        typeOptions: {
            /**
             * The height of the fibonacci in terms of yAxis.
             */
            height: 2,

            /**
             * An array of background colors:
             * Default to:
             * ```
             * [
             * 'rgba(130, 170, 255, 0.4)',
             * 'rgba(139, 191, 216, 0.4)',
             * 'rgba(150, 216, 192, 0.4)',
             * 'rgba(156, 229, 161, 0.4)',
             * 'rgba(162, 241, 130, 0.4)',
             * 'rgba(169, 255, 101, 0.4)'
             * ]
             * ```
             */
            backgroundColors: [
                'rgba(130, 170, 255, 0.4)',
                'rgba(139, 191, 216, 0.4)',
                'rgba(150, 216, 192, 0.4)',
                'rgba(156, 229, 161, 0.4)',
                'rgba(162, 241, 130, 0.4)',
                'rgba(169, 255, 101, 0.4)'
            ],

            /**
             * The color of line.
             */
            lineColor: 'grey',

            /**
             * An array of colors for the lines.
             */
            lineColors: [],

            /**
             * An array with options for the labels.
             *
             * @type      {Array<*>}
             * @extends   annotations.crookedLine.labelOptions
             * @apioption annotations.fibonacci.typeOptions.labels
             */
            labels: []
        },

        labelOptions: {
            allowOverlap: true,
            align: 'right',
            backgroundColor: 'none',
            borderWidth: 0,
            crop: false,
            overflow: 'none' as any,
            shape: 'rect',
            style: {
                color: 'grey'
            },
            verticalAlign: 'middle',
            y: 0
        }
    }
);

Annotation.types.fibonacci = Fibonacci;

export default Fibonacci;
