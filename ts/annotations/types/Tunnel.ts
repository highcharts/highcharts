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
        class AnnotationTunnel extends AnnotationCrookedLine {
            public options: AnnotationTunnelOptionsObject;
            public addBackground(): void;
            public addControlPoints: () => void;
            public addLine(): void;
            public addShapes(): void;
            public getControlPointsOptions(): Array<AnnotationMockPointOptionsObject>;
            public heightPointOptions(pointOptions: AnnotationMockPointOptionsObject): AnnotationMockPointOptionsObject;
            public translateHeight(dh: number): void;
            public translateSide(dx: number, dy: number, end?: boolean): void;
        }
        interface AnnotationTunnelOptionsObject extends AnnotationCrookedLineOptionsObject {
            typeOptions: AnnotationTunnelTypeOptionsObject;
        }
        interface AnnotationTunnelTypeOptionsObject extends AnnotationCrookedLineTypeOptionsObject {
            height: number;
            heightControlPoint: AnnotationControlPointOptionsObject;
        }
        interface AnnotationTypesDictionary {
            tunnel: typeof AnnotationTunnel;
        }
    }
}
import U from '../../parts/Utilities.js';
const {
    merge
} = U;

var Annotation = H.Annotation,
    CrookedLine = Annotation.types.crookedLine,
    ControlPoint = Annotation.ControlPoint,
    MockPoint = Annotation.MockPoint;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
function getSecondCoordinate(
    p1: Highcharts.PositionObject,
    p2: Highcharts.PositionObject,
    x: number
): number {
    return (p2.y - p1.y) / (p2.x - p1.x) * (x - p1.x) + p1.y;
}

const Tunnel: typeof Highcharts.AnnotationTunnel = function (
    this: Highcharts.AnnotationCrookedLine
): void {
    CrookedLine.apply(this, arguments as any);
} as any;

H.extendAnnotation(
    Tunnel,
    CrookedLine,
    {
        getPointsOptions: function (
            this: Highcharts.AnnotationTunnel
        ): Array<Highcharts.AnnotationMockPointOptionsObject> {
            var pointsOptions = CrookedLine.prototype.getPointsOptions.call(this);

            pointsOptions[2] = this.heightPointOptions(pointsOptions[1]);
            pointsOptions[3] = this.heightPointOptions(pointsOptions[0]);

            return pointsOptions;
        },

        getControlPointsOptions: function (
            this: Highcharts.AnnotationTunnel
        ): Array<Highcharts.AnnotationMockPointOptionsObject> {
            return this.getPointsOptions().slice(0, 2);
        },

        heightPointOptions: function (
            this: Highcharts.AnnotationTunnel,
            pointOptions: Highcharts.AnnotationMockPointOptionsObject
        ): Highcharts.AnnotationMockPointOptionsObject {
            var heightPointOptions = merge(pointOptions);

            heightPointOptions.y += this.options.typeOptions.height;

            return heightPointOptions;
        },

        addControlPoints: function (this: Highcharts.AnnotationTunnel): void {
            CrookedLine.prototype.addControlPoints.call(this);

            var options = this.options,
                controlPoint = new ControlPoint(
                    this.chart,
                    this,
                    merge(
                        options.controlPointOptions,
                        options.typeOptions.heightControlPoint
                    ),
                    2
                );

            this.controlPoints.push(controlPoint);

            options.typeOptions.heightControlPoint = controlPoint.options;
        },

        addShapes: function (this: Highcharts.AnnotationTunnel): void {
            this.addLine();
            this.addBackground();
        },

        addLine: function (this: Highcharts.AnnotationTunnel): void {
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
        },

        addBackground: function (this: Highcharts.AnnotationTunnel): void {
            var background = (this.initShape as any)(merge(
                this.options.typeOptions.background,
                {
                    type: 'path',
                    points: this.points.slice() as any
                }
            ));

            this.options.typeOptions.background = background.options;
        },

        /**
         * Translate start or end ("left" or "right") side of the tunnel.
         *
         * @param {number} dx - the amount of x translation
         * @param {number} dy - the amount of y translation
         * @param {boolean} [end] - whether to translate start or end side
         */
        translateSide: function (this: Highcharts.AnnotationTunnel, dx: number, dy: number, end?: boolean): void {
            var topIndex = Number(end),
                bottomIndex = topIndex === 0 ? 3 : 2;

            this.translatePoint(dx, dy, topIndex);
            this.translatePoint(dx, dy, bottomIndex);
        },

        /**
         * Translate height of the tunnel.
         *
         * @param {number} dh - the amount of height translation
         */
        translateHeight: function (this: Highcharts.AnnotationTunnel, dh: number): void {
            this.translatePoint(0, dh, 2);
            this.translatePoint(0, dh, 3);

            this.options.typeOptions.height = (this.points[3].y as any) - (this.points[0].y as any);
        }
    },

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
                ): Highcharts.PositionObject {
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
                        this: Highcharts.AnnotationTunnel,
                        e: Highcharts.AnnotationEventObject,
                        target: Highcharts.AnnotationTunnel
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
                    this: Highcharts.AnnotationTunnel,
                    e: Highcharts.AnnotationEventObject,
                    target: Highcharts.AnnotationTunnel
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
