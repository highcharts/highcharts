/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ControllableCircle from '../Controllables/ControllableCircle';
import type ControllableRect from '../Controllables/ControllableRect';
import type PointerEvent from '../../../Core/PointerEvent';
import type PositionObject from '../../../Core/Renderer/PositionObject';
import Annotation from '../Annotations.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        interface AnnotationBasicControlPoints {
            label: DeepPartial<AnnotationControlPointOptionsObject>[];
            rectangle: DeepPartial<AnnotationControlPointOptionsObject>[];
            circle: DeepPartial<AnnotationControlPointOptionsObject>[];
        }
    }
}

/* eslint-disable no-invalid-this */

class BasicAnnotation extends Annotation {

    /* *
     *
     *  Static Properties
     *
     * */

    public static basicControlPoints: Highcharts.AnnotationBasicControlPoints = {
        label: [{
            symbol: 'triangle-down',
            positioner: function (
                this: Highcharts.AnnotationControlPoint,
                target: Highcharts.AnnotationControllable
            ): PositionObject {
                if (!target.graphic.placed) {
                    return {
                        x: 0,
                        y: -9e7
                    };
                }
                var xy = MockPoint
                    .pointToPixels(target.points[0]);
                return {
                    x: xy.x - this.graphic.width / 2,
                    y: xy.y - this.graphic.height / 2
                };
            },
            // TRANSLATE POINT/ANCHOR
            events: {
                drag: function (
                    this: Annotation,
                    e: Highcharts.AnnotationEventObject,
                    target: Annotation
                ): void {
                    var xy = this.mouseMoveToTranslation(e);

                    (target.translatePoint as any)(xy.x, xy.y);

                    target.annotation.userOptions.labels[0].point =
                        target.options.point;
                    target.redraw(false);
                }
            }
        }, {
            symbol: 'square',
            positioner: function (
                this: Highcharts.AnnotationControlPoint,
                target: Highcharts.AnnotationControllable
            ): PositionObject {
                if (!target.graphic.placed) {
                    return {
                        x: 0,
                        y: -9e7
                    };
                }
                return {
                    x: target.graphic.alignAttr.x -
                        this.graphic.width / 2,
                    y: target.graphic.alignAttr.y -
                        this.graphic.height / 2
                };
            },
            // TRANSLATE POSITION WITHOUT CHANGING THE
            // ANCHOR
            events: {
                drag: function (
                    this: Annotation,
                    e: Highcharts.AnnotationEventObject,
                    target: Highcharts.AnnotationControllable
                ): void {
                    var xy = this.mouseMoveToTranslation(e);
                    target.translate(xy.x, xy.y);

                    target.annotation.userOptions.labels[0].point =
                        target.options.point;

                    target.redraw(false);
                }
            }
        }],

        rectangle: [{
            positioner: function (annotation: Annotation): PositionObject {
                var xy = MockPoint
                    .pointToPixels(annotation.points[2]);
                return {
                    x: xy.x - 4,
                    y: xy.y - 4
                };
            },
            events: {
                drag: function (
                    this: Annotation,
                    e: PointerEvent,
                    target: ControllableRect
                ): void {
                    var annotation = target.annotation,
                        coords = this.chart.pointer.getCoordinates(e),
                        x = coords.xAxis[0].value,
                        y = coords.yAxis[0].value,
                        points: Array<Highcharts.AnnotationMockPointOptionsObject> = target.options.points as any;

                    // Top right point
                    points[1].x = x;
                    // Bottom right point (cursor position)
                    points[2].x = x;
                    points[2].y = y;
                    // Bottom left
                    points[3].y = y;

                    annotation.userOptions.shapes[0].points =
                        target.options.points;
                    annotation.redraw(false);
                }
            }
        }],

        circle: [{
            positioner: function (
                this: Highcharts.AnnotationControlPoint,
                target: Highcharts.AnnotationControllable
            ): PositionObject {
                var xy = MockPoint.pointToPixels(target.points[0]),
                    r: number = target.options.r as any;
                return {
                    x: xy.x + r * Math.cos(Math.PI / 4) -
                    this.graphic.width / 2,
                    y: xy.y + r * Math.sin(Math.PI / 4) -
                    this.graphic.height / 2
                };
            },
            events: {
            // TRANSFORM RADIUS ACCORDING TO Y
            // TRANSLATION
                drag: function (
                    this: Annotation,
                    e: Highcharts.AnnotationEventObject,
                    target: ControllableCircle
                ): void {
                    var annotation = target.annotation,
                        position = this.mouseMoveToTranslation(e);

                    target.setRadius(
                        Math.max(
                            target.options.r +
                                position.y /
                                Math.sin(Math.PI / 4),
                            5
                        )
                    );

                    annotation.userOptions.shapes[0].r = target.options.r;
                    annotation.userOptions.shapes[0].point =
                        target.options.point;

                    target.redraw(false);
                }
            }
        }]
    };

    /* *
     *
     *  Constructors
     *
     * */

    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationsOptions) {
        super(chart, options);
    }

    /* *
     *
     *  Functions
     *
     * */

    public addControlPoints(): void {
        const options = this.options,
            controlPoints = BasicAnnotation.basicControlPoints,
            annotationType = this.basicType,
            optionsGroup = options.labels || options.shapes;

        optionsGroup.forEach(function (
            group: Highcharts.AnnotationControllableOptionsObject
        ): void {
            group.controlPoints = (controlPoints as any)[annotationType];
        });
    }

    public init(): void {
        const options = this.options;

        if (options.shapes) {
            delete options.labelOptions;
            if (options.shapes[0].type === 'circle') {
                this.basicType = 'circle';
            } else {
                this.basicType = 'rectangle';
            }
        } else {
            delete options.shapes;
            this.basicType = 'label';
        }
        Annotation.prototype.init.apply(this, arguments);
    }

}

/**
 * @private
 */
interface BasicAnnotation {
    defaultOptions: Annotation['defaultOptions'];
    basicType: string;
}

BasicAnnotation.prototype.defaultOptions = merge(
    Annotation.prototype.defaultOptions,
    {}
);

Annotation.types.basicAnnotation = BasicAnnotation;

export default BasicAnnotation;
