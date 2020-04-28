/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../../parts/Globals.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationBasicAnnotation extends Annotation {
            public basicControlPoints: AnnotationBasicControlPoints
            addControlPoints: () => void;
        }

        interface AnnotationBasicControlPoints {
            label: DeepPartial<AnnotationControlPointOptionsObject>[];
            rectangle: DeepPartial<AnnotationControlPointOptionsObject>[];
            circle: DeepPartial<AnnotationControlPointOptionsObject>[];
        }
    }
}

var Annotation = H.Annotation;

/* eslint-disable no-invalid-this */

const BasicAnnotation: typeof Highcharts.AnnotationBasicAnnotation =
function (
    this: Highcharts.AnnotationBasicAnnotation
): void {
    Annotation.apply(this, arguments as any);
} as any;

H.extendAnnotation(
    BasicAnnotation,
    null,
    {
        basicControlPoints: {
            label: [{
                symbol: 'triangle-down',
                positioner: function (
                    this: Highcharts.AnnotationControlPoint,
                    target: Highcharts.AnnotationControllable
                ): Highcharts.PositionObject {
                    if (!target.graphic.placed) {
                        return {
                            x: 0,
                            y: -9e7
                        };
                    }
                    var xy = H.Annotation.MockPoint
                        .pointToPixels(target.points[0]);
                    return {
                        x: xy.x - this.graphic.width / 2,
                        y: xy.y - this.graphic.height / 2
                    };
                },
                // TRANSLATE POINT/ANCHOR
                events: {
                    drag: function (
                        this: Highcharts.Annotation,
                        e: Highcharts.AnnotationEventObject,
                        target: Highcharts.Annotation
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
                ): Highcharts.PositionObject {
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
                        this: Highcharts.Annotation,
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
                positioner: function (annotation: Highcharts.Annotation): Highcharts.PositionObject {
                    var xy = H.Annotation.MockPoint
                        .pointToPixels(annotation.points[2]);
                    return {
                        x: xy.x - 4,
                        y: xy.y - 4
                    };
                },
                events: {
                    drag: function (
                        this: Highcharts.Annotation,
                        e: Highcharts.PointerEventObject,
                        target: Highcharts.AnnotationControllableRect
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
                ): Highcharts.PositionObject {
                    var xy = H.Annotation.MockPoint.pointToPixels(target.points[0]),
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
                        this: Highcharts.Annotation,
                        e: Highcharts.AnnotationEventObject,
                        target: Highcharts.AnnotationControllableCircle
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
        },

        addControlPoints: function (this: Highcharts.AnnotationBasicAnnotation): void {
            const options = this.options,
                controlPoints = this.basicControlPoints,
                langKey = options.langKey,
                optionsGroup = options.labels || options.shapes;

            optionsGroup.forEach(function (
                this: Highcharts.AnnotationsLabelsOptions[] | Highcharts.AnnotationsShapesOptions[],
                group: Highcharts.AnnotationControllableOptionsObject
            ): void {
                if (langKey) {
                    group.controlPoints = (controlPoints as any)[langKey];
                }
            });
        }
    }
);

Annotation.types.basicAnnotation = BasicAnnotation;

export default BasicAnnotation;
