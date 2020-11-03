/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../../../Core/Renderer/PositionObject';
import Annotation from '../Annotations.js';
import ControlPoint from '../ControlPoint.js';
import CrookedLine from './CrookedLine.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationTunnelOptionsObject extends AnnotationCrookedLineOptionsObject {
            typeOptions: AnnotationTunnelTypeOptionsObject;
        }
        interface AnnotationTunnelTypeOptionsObject extends AnnotationCrookedLineTypeOptionsObject {
            height: number;
            heightControlPoint: AnnotationControlPointOptionsObject;
        }
        interface AnnotationTypesRegistry {
            tunnel: typeof Tunnel;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function getSecondCoordinate(
    p1: PositionObject,
    p2: PositionObject,
    x: number
): number {
    return (p2.y - p1.y) / (p2.x - p1.x) * (x - p1.x) + p1.y;
}

class Tunnel extends CrookedLine {

    /* *
     *
     * Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationTunnelOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     * Functions
     *
     * */

    public getPointsOptions(): Array<Highcharts.AnnotationMockPointOptionsObject> {
        var pointsOptions = CrookedLine.prototype.getPointsOptions.call(this);

        pointsOptions[2] = this.heightPointOptions(pointsOptions[1]);
        pointsOptions[3] = this.heightPointOptions(pointsOptions[0]);

        return pointsOptions;
    }

    public getControlPointsOptions(): Array<Highcharts.AnnotationMockPointOptionsObject> {
        return this.getPointsOptions().slice(0, 2);
    }

    public heightPointOptions(
        pointOptions: Highcharts.AnnotationMockPointOptionsObject
    ): Highcharts.AnnotationMockPointOptionsObject {
        var heightPointOptions = merge(pointOptions),
            typeOptions = this.options.typeOptions as Highcharts.AnnotationTunnelTypeOptionsObject;

        heightPointOptions.y += typeOptions.height;

        return heightPointOptions;
    }

    public addControlPoints(): void {
        CrookedLine.prototype.addControlPoints.call(this);

        var options = this.options,
            typeOptions = options.typeOptions as Highcharts.AnnotationTunnelTypeOptionsObject,
            controlPoint = new ControlPoint(
                this.chart,
                this,
                merge(
                    options.controlPointOptions,
                    typeOptions.heightControlPoint
                ),
                2
            );

        this.controlPoints.push(controlPoint);

        typeOptions.heightControlPoint = controlPoint.options;
    }

    public addShapes(): void {
        this.addLine();
        this.addBackground();
    }

    public addLine(): void {
        var line = this.initShape(
            merge(this.options.typeOptions.line, {
                type: 'path',
                points: [
                    this.points[0],
                    this.points[1],
                    function (target: any): Highcharts.AnnotationMockPointOptionsObject {
                        var pointOptions = MockPoint.pointToOptions(
                            target.annotation.points[2]
                        );

                        pointOptions.command = 'M';

                        return pointOptions;
                    },
                    this.points[3]
                ] as any
            }),
            false as any
        );

        this.options.typeOptions.line = line.options;
    }

    public addBackground(): void {
        var background = (this.initShape as any)(merge(
            this.options.typeOptions.background,
            {
                type: 'path',
                points: this.points.slice() as any
            }
        ));

        this.options.typeOptions.background = background.options;
    }

    /**
     * Translate start or end ("left" or "right") side of the tunnel.
     * @private
     * @param {number} dx - the amount of x translation
     * @param {number} dy - the amount of y translation
     * @param {boolean} [end] - whether to translate start or end side
     */
    public translateSide(dx: number, dy: number, end?: boolean): void {
        var topIndex = Number(end),
            bottomIndex = topIndex === 0 ? 3 : 2;

        this.translatePoint(dx, dy, topIndex);
        this.translatePoint(dx, dy, bottomIndex);
    }

    /**
     * Translate height of the tunnel.
     * @private
     * @param {number} dh - the amount of height translation
     */
    public translateHeight(dh: number): void {
        this.translatePoint(0, dh, 2);
        this.translatePoint(0, dh, 3);

        this.options.typeOptions.height = (this.points[3].y as any) - (this.points[0].y as any);
    }

}

/**
 * @private
 */
interface Tunnel {
    defaultOptions: CrookedLine['defaultOptions'];
}

Tunnel.prototype.defaultOptions = merge(
    CrookedLine.prototype.defaultOptions,
    /**
     * A tunnel annotation.
     *
     * @extends annotations.crookedLine
     * @sample highcharts/annotations-advanced/tunnel/
     *         Tunnel
     * @product highstock
     * @optionparent annotations.tunnel
     */
    {
        typeOptions: {
            xAxis: 0,
            yAxis: 0,
            /**
             * Background options.
             *
             * @type {Object}
             * @excluding height, point, points, r, type, width, markerEnd,
             *            markerStart
             */
            background: {
                fill: 'rgba(130, 170, 255, 0.4)',
                strokeWidth: 0
            },
            line: {
                strokeWidth: 1
            },
            /**
             * The height of the annotation in terms of yAxis.
             */
            height: -2,


            /**
             * Options for the control point which controls
             * the annotation's height.
             *
             * @extends annotations.crookedLine.controlPointOptions
             * @excluding positioner, events
             */
            heightControlPoint: {
                positioner: function (
                    this: Highcharts.AnnotationControlPoint,
                    target: Highcharts.AnnotationControllable
                ): PositionObject {
                    var startXY = MockPoint.pointToPixels(target.points[2]),
                        endXY = MockPoint.pointToPixels(target.points[3]),
                        x = (startXY.x + endXY.x) / 2;

                    return {
                        x: x - this.graphic.width / 2,
                        y: getSecondCoordinate(startXY, endXY, x) -
                        this.graphic.height / 2
                    };
                },
                events: {
                    drag: function (
                        this: Tunnel,
                        e: Highcharts.AnnotationEventObject,
                        target: Tunnel
                    ): void {
                        if (
                            target.chart.isInsidePlot(
                                e.chartX - target.chart.plotLeft,
                                e.chartY - target.chart.plotTop
                            )
                        ) {
                            target.translateHeight(
                                this.mouseMoveToTranslation(e).y
                            );

                            target.redraw(false);
                        }
                    }
                }
            }
        },

        /**
         * @extends annotations.crookedLine.controlPointOptions
         * @excluding positioner, events
         */
        controlPointOptions: {
            events: {
                drag: function (
                    this: Tunnel,
                    e: Highcharts.AnnotationEventObject,
                    target: Tunnel
                ): void {
                    if (
                        target.chart.isInsidePlot(
                            e.chartX - target.chart.plotLeft,
                            e.chartY - target.chart.plotTop
                        )
                    ) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translateSide(
                            translation.x,
                            translation.y,
                            this.index as any
                        );

                        target.redraw(false);
                    }
                }
            }
        }
    }
);

Annotation.types.tunnel = Tunnel;

export default Tunnel;
