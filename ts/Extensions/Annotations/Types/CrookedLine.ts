/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type PositionObject from '../../../Core/Renderer/PositionObject';
import Annotation from '../Annotations.js';
import ControlPoint from '../ControlPoint.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationCrookedLineOptionsObject extends AnnotationsOptions {
            typeOptions: AnnotationCrookedLineTypeOptionsObject;
        }
        interface AnnotationCrookedLineTypeOptionsObject extends AnnotationsTypeOptions {
            points?: Array<AnnotationsTypePointsOptions>;
        }
        interface AnnotationMockPointOptionsObject {
            controlPoint?: AnnotationControlPointOptionsObject;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

class CrookedLine extends Annotation {

    /* *
     *
     * Constructors
     *
     * */
    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationCrookedLineOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     * Functions
     *
     * */

    /**
     * Overrides default setter to get axes from typeOptions.
     * @private
     */
    public setClipAxes(): void {
        this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis as any];
        this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis as any];
    }

    public getPointsOptions(): Array<Highcharts.AnnotationMockPointOptionsObject> {
        var typeOptions = this.options.typeOptions;

        return (typeOptions.points || []).map(function (
            pointOptions: Highcharts.AnnotationsTypePointsOptions
        ): Highcharts.AnnotationMockPointOptionsObject {
            pointOptions.xAxis = typeOptions.xAxis;
            pointOptions.yAxis = typeOptions.yAxis;

            return pointOptions as any;
        });
    }

    public getControlPointsOptions(): Array<Highcharts.AnnotationMockPointOptionsObject> {
        return this.getPointsOptions();
    }

    public addControlPoints(): void {
        this.getControlPointsOptions().forEach(
            function (
                pointOptions: Highcharts.AnnotationMockPointOptionsObject,
                i: number
            ): void {
                var controlPoint = new ControlPoint(
                    this.chart,
                    this,
                    merge(
                        this.options.controlPointOptions,
                        pointOptions.controlPoint
                    ),
                    i
                );

                this.controlPoints.push(controlPoint);

                pointOptions.controlPoint = controlPoint.options;
            },
            this
        );
    }

    public addShapes(): void {
        var typeOptions = this.options.typeOptions,
            shape = this.initShape(
                merge(typeOptions.line, {
                    type: 'path',
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

/**
 * @private
 */
interface CrookedLine {
    defaultOptions: Annotation['defaultOptions'];
}

CrookedLine.prototype.defaultOptions = merge(
    Annotation.prototype.defaultOptions,
    /**
     * A crooked line annotation.
     *
     * @sample highcharts/annotations-advanced/crooked-line/
     *         Crooked line
     *
     * @product      highstock
     * @optionparent annotations.crookedLine
     */
    {
        /**
         * @extends   annotations.labelOptions
         * @apioption annotations.crookedLine.labelOptions
         */

        /**
         * @extends   annotations.shapeOptions
         * @apioption annotations.crookedLine.shapeOptions
         */

        /**
         * Additional options for an annotation with the type.
         */
        typeOptions: {
            /**
             * This number defines which xAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the xAxis array.
             */
            xAxis: 0,
            /**
             * This number defines which yAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the xAxis array.
             */
            yAxis: 0,

            /**
             * @type      {Array<*>}
             * @apioption annotations.crookedLine.typeOptions.points
             */

            /**
             * The x position of the point.
             *
             * @type      {number}
             * @apioption annotations.crookedLine.typeOptions.points.x
             */

            /**
             * The y position of the point.
             *
             * @type      {number}
             * @apioption annotations.crookedLine.typeOptions.points.y
             */

            /**
             * @type      {number}
             * @excluding positioner, events
             * @apioption annotations.crookedLine.typeOptions.points.controlPoint
             */

            /**
             * Line options.
             *
             * @excluding height, point, points, r, type, width
             */
            line: {
                fill: 'none'
            }
        },

        /**
         * @excluding positioner, events
         */
        controlPointOptions: {
            positioner: function (
                this: Highcharts.AnnotationControlPoint,
                target: Highcharts.AnnotationControllable
            ): PositionObject {
                var graphic = this.graphic,
                    xy = MockPoint.pointToPixels(target.points[this.index]);

                return {
                    x: xy.x - graphic.width / 2,
                    y: xy.y - graphic.height / 2
                };
            },

            events: {
                drag: function (
                    this: Annotation,
                    e: Highcharts.AnnotationEventObject,
                    target: Highcharts.AnnotationControllable
                ): void {
                    if (
                        target.chart.isInsidePlot(
                            e.chartX - target.chart.plotLeft,
                            e.chartY - target.chart.plotTop
                        )
                    ) {
                        var translation = this.mouseMoveToTranslation(e);

                        target.translatePoint(
                            translation.x,
                            translation.y,
                            this.index
                        );

                        // Update options:
                        (target.options as any).typeOptions.points[this.index].x = target.points[this.index].x;
                        (target.options as any).typeOptions.points[this.index].y = target.points[this.index].y;

                        target.redraw(false);
                    }
                }
            }
        }
    }
);

Annotation.types.crookedLine = CrookedLine;

export default CrookedLine;
