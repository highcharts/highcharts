'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    CrookedLine = Annotation.types.crookedLine,
    ControlPoint = Annotation.ControlPoint,
    MockPoint = Annotation.MockPoint;

function getSecondCoordinate(p1, p2, x) {
    return (p2.y - p1.y) / (p2.x - p1.x) * (x - p1.x) + p1.y;
}

/**
 * @class
 * @extends Annotation.CrookedLine
 * @memberOf Annotation
 **/
function Tunnel() {
    CrookedLine.apply(this, arguments);
}

H.extendAnnotation(Tunnel, CrookedLine, /** @lends Annotation.Tunnel# */ {
    getPointsOptions: function () {
        var pointsOptions =
            CrookedLine.prototype.getPointsOptions.call(this);

        pointsOptions[2] = this.heightPointOptions(pointsOptions[1]);
        pointsOptions[3] = this.heightPointOptions(pointsOptions[0]);

        return pointsOptions;
    },

    getControlPointsOptions: function () {
        return this.getPointsOptions().slice(0, 2);
    },

    heightPointOptions: function (pointOptions) {
        var heightPointOptions = H.merge(pointOptions);

        heightPointOptions.y += this.options.typeOptions.height;

        return heightPointOptions;
    },

    addControlPoints: function () {
        CrookedLine.prototype.addControlPoints.call(this);

        var options = this.options,
            controlPoint = new ControlPoint(
                this.chart,
                this,
                H.merge(
                    options.controlPointOptions,
                    options.typeOptions.heightControlPoint
                ),
                2
            );

        this.controlPoints.push(controlPoint);

        options.typeOptions.heightControlPoint = controlPoint.options;
    },

    addShapes: function () {
        this.addLine();
        this.addBackground();
    },

    addLine: function () {
        var line = this.initShape(
            H.merge(this.options.typeOptions.line, {
                type: 'path',
                points: [
                    this.points[0],
                    this.points[1],
                    function (target) {
                        var pointOptions = MockPoint.pointToOptions(
                            target.annotation.points[2]
                        );

                        pointOptions.command = 'M';

                        return pointOptions;
                    },
                    this.points[3]
                ]
            }),
            false
        );

        this.options.typeOptions.line = line.options;
    },

    addBackground: function () {
        var background = this.initShape(H.merge(
            this.options.typeOptions.background,
            {
                type: 'path',
                points: this.points.slice()
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
    translateSide: function (dx, dy, end) {
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
    translateHeight: function (dh) {
        this.translatePoint(0, dh, 2);
        this.translatePoint(0, dh, 3);

        this.options.typeOptions.height =
            this.points[3].y - this.points[0].y;
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
             * @extends annotations.base.shapes
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
             * @extends annotations.base.controlPointOptions
             * @excluding positioner, events
             */
            heightControlPoint: {
                positioner: function (target) {
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
                    drag: function (e, target) {
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
         * @extends annotations.base.controlPointOptions
         * @excluding positioner, events
         */
        controlPointOptions: {
            events: {
                drag: function (e, target) {
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
                            this.index
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
