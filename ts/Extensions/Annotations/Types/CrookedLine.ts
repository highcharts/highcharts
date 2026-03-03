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

import type { AnnotationEventObject } from '../EventEmitter';
import type {
    AnnotationMockPointFunction,
    AnnotationOptions,
    AnnotationTypeOptions
} from '../AnnotationOptions';
import type { AnnotationPointType } from '../AnnotationSeries';
import type Controllable from '../Controllables/Controllable';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import type {
    AnnotationMockPointOptionsObject
} from '../AnnotationMockPointOptionsObject';

import Annotation from '../Annotation.js';
import ControlPoint from '../ControlPoint.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import MockPoint from '../MockPoint.js';
import { merge } from '../../../Shared/Utilities.js';

if (defaultOptions.annotations?.types) {
    /**
    * Options for the crooked line annotation type.
    *
    * @sample highcharts/annotations-advanced/crooked-line/
    *         Crooked line
    *
    * @product      highstock
    * @optionparent annotations.types.crookedLine
    */
    defaultOptions.annotations.types.crookedLine = {
        /**
         * @extends   annotations.labelOptions
         * @apioption annotations.types.crookedLine.labelOptions
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
             * @apioption annotations.types.crookedLine.typeOptions.points
             */

            /**
             * The x position of the point.
             *
             * @type      {number}
             * @apioption annotations.types.crookedLine.typeOptions.points.x
             */

            /**
             * The y position of the point.
             *
             * @type      {number}
             * @apioption annotations.types.crookedLine.typeOptions.points.y
             */

            /**
             * @type      {number}
             * @excluding positioner, events
             * @apioption annotations.types.crookedLine.typeOptions.points.controlPoint
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
         * @extends annotations.controlPointOptions
         */
        controlPointOptions: {
            positioner: function (
                this: ControlPoint,
                target: Controllable
            ): PositionObject {
                const graphic = this.graphic,
                    xy = MockPoint.pointToPixels(target.points[this.index]);

                return {
                    x: xy.x - (graphic.width || 0) / 2,
                    y: xy.y - (graphic.height || 0) / 2
                };
            },

            events: {
                drag: function (
                    this: CrookedLine,
                    e: AnnotationEventObject,
                    target: CrookedLine
                ): void {
                    if (
                        target.chart.isInsidePlot(
                            e.chartX - target.chart.plotLeft,
                            e.chartY - target.chart.plotTop,
                            {
                                visiblePlotOnly: true
                            }
                        )
                    ) {
                        const translation = this.mouseMoveToTranslation(e),
                            typeOptions = target.options.typeOptions as any;

                        target.translatePoint(
                            translation.x,
                            translation.y,
                            this.index
                        );

                        // Update options:
                        typeOptions.points[this.index].x =
                        target.points[this.index].x;
                        typeOptions.points[this.index].y =
                        target.points[this.index].y;

                        target.redraw(false);
                    }
                }
            }
        }
    };
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class CrookedLine extends Annotation {

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Overrides default setter to get axes from typeOptions.
     */
    public setClipAxes(): void {
        this.clipXAxis = this.chart.xAxis[
            this.options.typeOptions?.xAxis as any
        ];
        this.clipYAxis = this.chart.yAxis[
            this.options.typeOptions?.yAxis as any
        ];
    }

    public getPointsOptions(): Array<AnnotationMockPointOptionsObject> {
        const typeOptions = this.options.typeOptions ||= {};

        return (typeOptions.points || []).map((
            pointOptions
        ): AnnotationMockPointOptionsObject => {
            if (typeof pointOptions !== 'string') {
                pointOptions.xAxis = typeOptions.xAxis;
                pointOptions.yAxis = typeOptions.yAxis;
            }

            return pointOptions as any;
        });
    }

    public getControlPointsOptions(): Array<AnnotationMockPointOptionsObject> {
        return this.getPointsOptions();
    }

    public addControlPoints(): void {
        this.getControlPointsOptions().forEach(
            function (
                pointOptions: AnnotationMockPointOptionsObject,
                i: number
            ): void {
                const controlPoint = new ControlPoint(
                    this.chart,
                    this as any,
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
        const typeOptions = this.options.typeOptions ||= {},
            shape = this.initShape(
                merge(typeOptions.line, {
                    type: 'path',
                    className: 'highcharts-crooked-lines',
                    points: this.points.map(
                        (_point, i): AnnotationMockPointFunction => (
                            function (
                                target: Controllable
                            ): AnnotationPointType {
                                return target.annotation.points[i];
                            }
                        ) as AnnotationMockPointFunction
                    )
                }),
                0
            );

        typeOptions.line = shape.options;
    }
}


/* *
 *
 *  Class Namespace
 *
 * */

namespace CrookedLine {
    /**
     * Options for the crooked line annotation type.
     *
     * @sample highcharts/annotations-advanced/crooked-line/
     *         Crooked line
     *
     * @product      highstock
     * @optionparent annotations.types.crookedLine
     */
    export interface Options extends AnnotationOptions {
        /**
         * Additional options for an annotation with the type.
         */
        typeOptions: AnnotationTypeOptions;
    }
    export interface TypeOptions extends AnnotationTypeOptions {
        points?: Array<AnnotationMockPointOptionsObject>;
    }
}

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module './AnnotationType' {
    interface AnnotationTypeRegistry {
        crookedLine: typeof CrookedLine;
    }
}

Annotation.types.crookedLine = CrookedLine;

/* *
 *
 *  Default Export
 *
 * */

export default CrookedLine;
