'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    MockPoint = Annotation.MockPoint,
    ControlPoint = Annotation.ControlPoint;

/**
 * @class
 * @extends Annotation
 * @memberOf Annotation
 */
function CrookedLine() {
    Annotation.apply(this, arguments);
}

H.extendAnnotation(
    CrookedLine,
    null,
    /** @lends Annotation.CrookedLine# */
    {
        /**
         * Overrides default setter to get axes from typeOptions.
         */
        setClipAxes: function () {
            this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
            this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis];
        },
        getPointsOptions: function () {
            var typeOptions = this.options.typeOptions;

            return typeOptions.points.map(function (pointOptions) {
                pointOptions.xAxis = typeOptions.xAxis;
                pointOptions.yAxis = typeOptions.yAxis;

                return pointOptions;
            });
        },

        getControlPointsOptions: function () {
            return this.getPointsOptions();
        },

        addControlPoints: function () {
            this.getControlPointsOptions().forEach(
                function (pointOptions, i) {
                    var controlPoint = new ControlPoint(
                        this.chart,
                        this,
                        H.merge(
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
        },

        addShapes: function () {
            var typeOptions = this.options.typeOptions,
                shape = this.initShape(
                    H.merge(typeOptions.line, {
                        type: 'path',
                        points: this.points.map(function (point, i) {
                            return function (target) {
                                return target.annotation.points[i];
                            };
                        })
                    }),
                    false
                );

            typeOptions.line = shape.options;
        }
    },

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
            positioner: function (target) {
                var graphic = this.graphic,
                    xy = MockPoint.pointToPixels(target.points[this.index]);

                return {
                    x: xy.x - graphic.width / 2,
                    y: xy.y - graphic.height / 2
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
                        var translation = this.mouseMoveToTranslation(e);

                        target.translatePoint(
                            translation.x,
                            translation.y,
                            this.index
                        );

                        // Update options:
                        target.options.typeOptions.points[this.index].x =
                            target.points[this.index].x;
                        target.options.typeOptions.points[this.index].y =
                            target.points[this.index].y;

                        target.redraw(false);
                    }
                }
            }
        }
    }
);

Annotation.types.crookedLine = CrookedLine;

export default CrookedLine;
