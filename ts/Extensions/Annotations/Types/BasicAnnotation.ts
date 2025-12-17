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
import type Controllable from '../Controllables/Controllable';
import type ControllableCircle from '../Controllables/ControllableCircle';
import type ControllableEllipse from '../Controllables/ControllableEllipse';
import type ControllableRect from '../Controllables/ControllableRect';
import type ControlPoint from '../ControlPoint';
import type ControlPointOptions from '../ControlPointOptions';
import type { DeepPartial } from '../../../Shared/Types';
import type MockPointOptions from '../AnnotationMockPointOptionsObject';
import type PointerEvent from '../../../Core/PointerEvent';
import type PositionObject from '../../../Core/Renderer/PositionObject';

import Annotation from '../Annotation.js';
import MockPoint from '../MockPoint.js';

/* *
 *
 *  Class
 *
 * */

/** @internal */
class BasicAnnotation extends Annotation {

    /* *
     *
     *  Static Properties
     *
     * */

    public static basicControlPoints: BasicAnnotation.ControlPoints = {
        label: [{
            symbol: 'triangle-down',
            positioner: function (
                this: ControlPoint,
                target: Controllable
            ): PositionObject {
                if (!target.graphic.placed) {
                    return {
                        x: 0,
                        y: -9e7
                    };
                }
                const xy = MockPoint
                    .pointToPixels(target.points[0]);
                return {
                    x: xy.x - (this.graphic.width || 0) / 2,
                    y: xy.y - (this.graphic.height || 0) / 2
                };
            },
            // TRANSLATE POINT/ANCHOR
            events: {
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: Controllable
                ): void {
                    const xy = this.mouseMoveToTranslation(e);

                    (target.translatePoint as any)(xy.x, xy.y);

                    (target.annotation.userOptions.labels as any)[0].point =
                        target.options.point;
                    target.redraw(false);
                }
            }
        }, {
            symbol: 'square',
            positioner: function (
                this: ControlPoint,
                target: Controllable
            ): PositionObject {
                if (!target.graphic.placed) {
                    return {
                        x: 0,
                        y: -9e7
                    };
                }
                return {
                    x: target.graphic.alignAttr.x -
                        (this.graphic.width || 0) / 2,
                    y: target.graphic.alignAttr.y -
                        (this.graphic.height || 0) / 2
                };
            },
            // TRANSLATE POSITION WITHOUT CHANGING THE
            // ANCHOR
            events: {
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: Controllable
                ): void {
                    const xy = this.mouseMoveToTranslation(e);
                    target.translate(xy.x, xy.y);

                    (target.annotation.userOptions.labels as any)[0].point =
                        target.options.point;

                    target.redraw(false);
                }
            }
        }],

        rectangle: [{
            positioner: function (annotation: Annotation): PositionObject {
                const xy = MockPoint
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
                    const annotation = target.annotation,
                        coords = this.chart.pointer?.getCoordinates(e),
                        points: Array<MockPointOptions> =
                            target.options.points as any,
                        shapes = annotation.userOptions.shapes,
                        xAxisIndex = annotation.clipXAxis?.index || 0,
                        yAxisIndex = annotation.clipYAxis?.index || 0;

                    if (coords) {
                        const x = coords.xAxis[xAxisIndex].value,
                            y = coords.yAxis[yAxisIndex].value;

                        // Top right point
                        points[1].x = x;
                        // Bottom right point (cursor position)
                        points[2].x = x;
                        points[2].y = y;
                        // Bottom left
                        points[3].y = y;

                        if (shapes?.[0]) {
                            shapes[0].points = target.options.points as any;
                        }
                    }

                    annotation.redraw(false);
                }
            }
        }],

        circle: [{
            positioner: function (
                this: ControlPoint,
                target: Controllable
            ): PositionObject {
                const xy = MockPoint.pointToPixels(target.points[0]),
                    r: number = target.options.r as any;
                return {
                    x: xy.x + r * Math.cos(Math.PI / 4) -
                    (this.graphic.width || 0) / 2,
                    y: xy.y + r * Math.sin(Math.PI / 4) -
                    (this.graphic.height || 0) / 2
                };
            },
            events: {
            // TRANSFORM RADIUS ACCORDING TO Y
            // TRANSLATION
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: ControllableCircle
                ): void {
                    const annotation = target.annotation,
                        position = this.mouseMoveToTranslation(e),
                        shapes = annotation.userOptions.shapes;

                    target.setRadius(
                        Math.max(
                            (target.options.r || 0) +
                                position.y / Math.sin(Math.PI / 4),
                            5
                        )
                    );

                    if (shapes && shapes[0]) {
                        shapes[0].r = target.options.r;
                        shapes[0].point = target.options.point as any;
                    }

                    target.redraw(false);
                }
            }
        }],
        ellipse: [{
            positioner: function (
                this: ControlPoint,
                target: ControllableEllipse
            ): PositionObject {
                const position = target.getAbsolutePosition(target.points[0]);

                return {
                    x: position.x - (this.graphic.width || 0) / 2,
                    y: position.y - (this.graphic.height || 0) / 2
                };
            },
            events: {
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: ControllableEllipse
                ): void {
                    const position =
                        target.getAbsolutePosition(target.points[0]);

                    target.translatePoint(
                        e.chartX - position.x,
                        e.chartY - position.y,
                        0
                    );

                    target.redraw(false);
                }
            }
        }, {
            positioner: function (
                this: ControlPoint,
                target: ControllableEllipse
            ): PositionObject {
                const position = target.getAbsolutePosition(target.points[1]);

                return {
                    x: position.x - (this.graphic.width || 0) / 2,
                    y: position.y - (this.graphic.height || 0) / 2
                };
            },
            events: {
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: ControllableEllipse
                ): void {
                    const position = target.getAbsolutePosition(
                        target.points[1]
                    );

                    target.translatePoint(
                        e.chartX - position.x,
                        e.chartY - position.y,
                        1
                    );

                    target.redraw(false);
                }
            }
        }, {
            positioner: function (
                this: ControlPoint,
                target: ControllableEllipse
            ): PositionObject {
                const position = target.getAbsolutePosition(target.points[0]),
                    position2 = target.getAbsolutePosition(target.points[1]),
                    attrs = target.getAttrs(position, position2);

                return {
                    x: attrs.cx - (this.graphic.width || 0) / 2 +
                        attrs.ry * Math.sin((attrs.angle * Math.PI) / 180),
                    y: attrs.cy - (this.graphic.height || 0) / 2 -
                        attrs.ry * Math.cos((attrs.angle * Math.PI) / 180)
                };
            },
            events: {
                drag: function (
                    this: Annotation,
                    e: AnnotationEventObject,
                    target: ControllableEllipse
                ): void {
                    const position = target.getAbsolutePosition(
                            target.points[0]
                        ),
                        position2 = target.getAbsolutePosition(
                            target.points[1]
                        ),
                        newR = target.getDistanceFromLine(
                            position,
                            position2,
                            e.chartX,
                            e.chartY
                        ),
                        yAxis = target.getYAxis(),
                        newRY = Math.abs(
                            yAxis.toValue(0) - yAxis.toValue(newR)
                        );

                    target.setYRadius(newRY);

                    target.redraw(false);
                }
            }
        }]
    };

    /* *
     *
     *  Functions
     *
     * */

    public addControlPoints(): void {
        const options = this.options,
            controlPoints = BasicAnnotation.basicControlPoints,
            annotationType = this.basicType,
            optionsGroup = options.labels || options.shapes || [];

        optionsGroup.forEach((group): void => {
            group.controlPoints = controlPoints[annotationType] as any;
        });
    }

    public init(): void {
        const options = this.options;

        if (options.shapes) {
            delete options.labelOptions;
            const type = options.shapes[0].type;

            // TODO: Casting to be dropped by implementing this className
            // option in both code and types. Currently neither work nor is
            // documented properly.
            (options.shapes[0] as any).className =
                ((options.shapes[0] as any).className || '') +
                ' highcharts-basic-shape';
            // The rectangle is rendered as a path, whereas other basic shapes
            // are rendered as their respective SVG shapes.
            if (type && type !== 'path') {
                this.basicType = type as keyof BasicAnnotation.ControlPoints;
            } else {
                this.basicType = 'rectangle';
            }
        } else {
            delete options.shapes;
            this.basicType = 'label';
        }
        super.init.apply(this, arguments);
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface BasicAnnotation {
    basicType: keyof BasicAnnotation.ControlPoints;
    defaultOptions: Annotation['defaultOptions'];
}

/* *
 *
 *  Class Namespace
 *
 * */

/** @internal */
namespace BasicAnnotation {
    export interface ControlPoints {
        label: DeepPartial<ControlPointOptions>[];
        rectangle: DeepPartial<ControlPointOptions>[];
        ellipse: DeepPartial<ControlPointOptions>[];
        circle: DeepPartial<ControlPointOptions>[];
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
        basicAnnotation: typeof BasicAnnotation;
    }
}

Annotation.types.basicAnnotation = BasicAnnotation;

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default BasicAnnotation;
