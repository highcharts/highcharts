/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ColorString from '../../../Core/Color/ColorString';
import type MockPointOptions from '../MockPointOptions';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import Annotation from '../Annotations.js';
import CrookedLine from './CrookedLine';
import MockPoint from '../MockPoint.js';
import Tunnel from './Tunnel.js';
import U from '../../../Core/Utilities.js';
import { Palette } from '../../../Core/Color/Palettes.js';
const { merge } = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

const createPathDGenerator = function (
    retracementIndex: number,
    isBackground?: boolean
): Function {
    return function (this: Highcharts.AnnotationControllable): SVGPath {
        const annotation = this.annotation as Fibonacci;
        if (!annotation.startRetracements || !annotation.endRetracements) {
            return [];
        }
        let leftTop = this.anchor(
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

    public constructor(
        chart: Highcharts.AnnotationChart,
        options: Fibonacci.Options
    ) {
        super(chart, options);
    }

    /* *
     *
     *  Properties
     *
     * */

    public endRetracements?: Array<MockPoint>;
    public startRetracements?: Array<MockPoint>;

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
        const points = this.points,
            startDiff = (points[0].y as any) - (points[3].y as any),
            endDiff = (points[1].y as any) - (points[2].y as any),
            startX: number = points[0].x as any,
            endX: number = points[1].x as any;

        Fibonacci.levels.forEach(function (level: number, i: number): void {
            const startRetracement = (points[0].y as any) - startDiff * level,
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
        retracements: Array<MockPoint>
    ): void {
        const point = retracements[pointIndex],
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
        Fibonacci.levels.forEach(
            function (this: Fibonacci, _level: number, i: number): void {
                const {
                    backgroundColors,
                    lineColor,
                    lineColors
                } = this.options.typeOptions;

                this.initShape({
                    type: 'path',
                    d: createPathDGenerator(i),
                    stroke: lineColors[i] || lineColor
                }, i);

                if (i > 0) {
                    (this.initShape as any)({
                        type: 'path',
                        fill: backgroundColors[i - 1],
                        strokeWidth: 0,
                        d: createPathDGenerator(i, true)
                    });
                }
            },
            this
        );
    }

    public addLabels(): void {
        Fibonacci.levels.forEach(
            function (this: Fibonacci, level: number, i: number): void {
                const options = this.options.typeOptions,
                    label = (this.initLabel as any)(
                        merge(options.labels[i], {
                            point: function (target: any): MockPointOptions {
                                const point = MockPoint.pointToOptions(
                                    target.annotation.startRetracements[i]
                                );

                                return point;
                            },
                            text: level.toString()
                        })
                    );

                options.labels[i] = label.options;
            },
            this
        );
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
            lineColor: Palette.neutralColor40,

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

interface Fibonacci {
    options: Fibonacci.Options;
}

namespace Fibonacci {
    export interface Options extends Tunnel.Options {
        typeOptions: TypeOptions;
    }
    export interface TypeOptions extends Tunnel.TypeOptions {
        backgroundColors: Array<ColorString>;
        labels: Array<CrookedLine.Options['labelOptions']>;
        lineColor: ColorString;
        lineColors: Array<ColorString>;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default Fibonacci;
