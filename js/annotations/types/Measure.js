'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    CrookedLine = Annotation.types['crooked-line'],
    MockPoint = Annotation.MockPoint;

/**
 * @class
 * @extends Annotation.CrookedLine
 * @memberOf Annotation
 */
function Measure() {
    CrookedLine.apply(this, arguments);
}

var backgroundBoundaryPointOptions = function (bottom, right) {
    return function (target) {
        var point = target.annotation.points[0],
            typeOptions = target.annotation.options.typeOptions.background;

        return {
            x: point.plotX + (right ? typeOptions.width : 0),
            y: point.plotY + (bottom ? typeOptions.height : 0)
        };
    };
};

Measure.topRightPointOptions = backgroundBoundaryPointOptions(false, true);
Measure.bottomRightPointOptions = backgroundBoundaryPointOptions(true, true);
Measure.bottomLeftPointOptions = backgroundBoundaryPointOptions(true, false);

H.extendAnnotation(Measure, CrookedLine, /** @lends Annotation.Measure# */ {
    getPointsOptions: function () {
        var options = this.options.typeOptions,
            pointOptions = options.point;

        pointOptions.xAxis = options.xAxis;
        pointOptions.yAxis = options.yAxis;

        return [ pointOptions ];
    },

    linkPoints: function () {
        CrookedLine.prototype.linkPoints.call(this);

        this.calculateMeasures();
    },

    /**
     * Get points configuration objects for shapes.
     *
     * @return {Array<Highcharts.MockPointOptions>}
     */
    shapePointsOptions: function () {
        return [
            this.points[0], // left top point
            Measure.topRightPointOptions,
            Measure.bottomRightPointOptions,
            Measure.bottomLeftPointOptions
        ];
    },

    addLabels: function () {
        var typeOptions = this.options.typeOptions,
            label = this.initLabel(
                H.merge(typeOptions.label, {
                    point: function (target) {
                        var point = target.annotation.points[0];

                        return {
                            x: point.plotX + 5,
                            y: point.plotY + 5
                        };
                    }
                })
            );

        typeOptions.label = label.options;
    },

    /**
     * add shapes - crosshair, background (rect)
     *
     */
    addShapes: function () {
        this.addCrosshairs();
        this.addBackground();
    },

    /**
     * Add background shape.
     */
    addBackground: function () {
        var shape = this.initShape(
            H.merge(this.options.typeOptions.background, {
                type: 'path',
                points: this.shapePointsOptions()
            })
        );

        this.options.typeOptions.background = shape.options;
    },

    /**
     * Add internal crosshair shapes (on top and bottom)
     */
    addCrosshairs: function () {
        var typeOptions = this.options.typeOptions;

        this.initShape(
            H.merge(typeOptions.crosshair, {
                type: 'path',
                points: [
                    function (target) {
                        var topLeftPoint = target.annotation.points[0],
                            bottomLeftOptions =
                            Measure.bottomLeftPointOptions(target);

                        return {
                            x: topLeftPoint.plotX,
                            y: (
                                topLeftPoint.plotY + bottomLeftOptions.y
                            ) / 2
                        };
                    },
                    function (target) {
                        var middleRightPoint = target.points[0],
                            topRightOptions =
                            Measure.topRightPointOptions(target);

                        return {
                            x: topRightOptions.x,
                            y: middleRightPoint.plotY
                        };
                    }
                ]
            })
        );

        this.initShape(
            H.merge(typeOptions.crosshair, {
                type: 'path',
                points: [
                    function (target) {
                        var topLeftPoint = target.annotation.points[0],
                            topRightOptions =
                            Measure.topRightPointOptions(target);

                        return {
                            x: (topLeftPoint.plotX + topRightOptions.x) / 2,
                            y: topLeftPoint.plotY
                        };
                    },
                    function (target) {
                        var middleTopPoint = target.points[0],
                            bottomRightOptions =
                            Measure.bottomRightPointOptions(target);

                        return {
                            x: middleTopPoint.plotX,
                            y: bottomRightOptions.y
                        };
                    }
                ]
            })
        );
    },

    getExtremes: function () {
        var backgroundOptions = this.options.typeOptions.background,
            point = this.points[0],
            xAxis = point.series.xAxis,
            yAxis = point.series.yAxis,
            x1 = point.x,
            x2 = xAxis.toValue(
                point.plotX + backgroundOptions.width,
                true
            ),
            y1 = point.y,
            y2 = yAxis.toValue(
                point.plotY + backgroundOptions.height,
                true
            );

        return {
            xMin: Math.min(x1, x2),
            xMax: Math.max(x1, x2),
            yMin: Math.min(y1, y2),
            yMax: Math.max(y1, y2)
        };
    },

    calculateMeasures: function () {
        var min = Infinity,
            max = -Infinity,
            bins = 0,
            extremes = this.getExtremes(),
            xMin = extremes.xMin,
            xMax = extremes.xMax,
            yMin = extremes.yMin,
            yMax = extremes.yMax;

        H.each(this.chart.series, function (series) {
            if (series.visible) {
                H.each(series.data, function (point) {
                    if (
                        !point.isNull &&
                        point.x > xMin &&
                        point.x <= xMax &&
                        point.y > yMin &&
                        point.y <= yMax
                    ) {
                        bins++;

                        if (point.y < min) {
                            min = point.y;
                        }

                        if (point.y > max) {
                            max = point.y;
                        }
                    }
                });
            }
        });

        this.bins = bins;
        this.min = min !== Infinity ? min : null;
        this.max = max !== -Infinity ? max : null;
        this.average = this.min !== null && this.max !== null ?
            (this.min + this.max) / 2 :
            null;
    },

    /**
     * Translate start or end ("left" or "right") side of the measure.
     * Update start points (startxMin, startxMax, startyMin, startyMax)
     *
     * @param {number} dx - the amount of x translation
     * @param {number} dy - the amount of y translation
     */
    resize: function (dx, dy) {
        var backgroundOptions = this.options.typeOptions.background;

        backgroundOptions.width += dx;
        backgroundOptions.height += dy;
    }
},
    /**
     * A measure annotation.
     *
     * @extends annotations.crooked-line
     * @sample highcharts/annotations-advanced/measure/
     *         Measure
     * @optionparent annotations.measure
     */
    {
        /**
         * @extends annotations.crooked-line.typeOptions
         * @excluding points
         */
        typeOptions: {
            xAxis: 0,
            yAxis: 0,

            /**
             * @extends annotations.crooked-line.typeOptions.points
             * @apioption annotations.measure.typeOptions.point
             */

            /**
             * The x position of the point.
             *
             * @type {number}
             * @apioption annotations.measure.typeOptions.point.x
             */

            /**
             * The y position of the point.
             *
             * @extends annotations.crooked-line.typeOptions.points.y
             * @apioption annotations.measure.typeOptions.point.y
             */

            /**
             * @type {number}
             * @extends annotations.base.controlPointOptions
             * @excluding events
             * @apioption annotations.measure.typeOptions.point.controlPoint
             */

            /**
             * Crosshair options.
             *
             * @extends annotations.base.shapeOptions
             * @excluding height, r, type, width
             */
            crosshair: {
                zIndex: 6,
                dashStyle: 'dash',
                markerEnd: 'arrow'
            },

            /**
             * Background options.
             *
             * @extends annotations.base.shapeOptions
             * @excluding r, type
             */
            background: {
                fill: 'rgba(130, 170, 255, 0.4)',
                strokeWidth: 0
            }
        },

        labelOptions: {
            shape: 'rect',
            backgroundColor: 'none',
            color: 'black',
            borderWidth: 0,
            dashStyle: 'dash',
            overflow: 'none',
            align: 'left',
            verticalAlign: 'top',
            crop: true,
            x: 0,
            y: 0,
            formatter: function (target) {
                var annotation = target.annotation;

                return 'Min: ' + annotation.min +
                    '<br>Max: ' + annotation.max +
                    '<br>Average: ' + annotation.average +
                    '<br>Bins: ' + annotation.bins;
            }
        },

        controlPointOptions: {
            positioner: function (target) {
                var xy = MockPoint.pointToPixels(target.points[0]),
                    backgroundOptions = target.options.typeOptions.background,
                    width = backgroundOptions.width,
                    height = backgroundOptions.height,
                    graphic = this.graphic;

                if (target.chart.inverted) {
                    width = height;
                    height = backgroundOptions.width;
                }

                return {
                    x: xy.x + width - graphic.width / 2,
                    y: xy.y + height - graphic.height / 2
                };
            },
            events: {
                drag: function (e, target) {
                    var translation = this.mouseMoveToTranslation(e);

                    target.resize(
                        translation.x,
                        translation.y
                    );

                    target.redraw(false);
                }
            }
        }
    });

Annotation.types.measure = Measure;

export default Measure;
