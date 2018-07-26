'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    ControlPoint = Annotation.ControlPoint,
    each = H.each,
    merge = H.merge;

/**
 * @class Measure
 * @extends Highcharts.Annotation
 * @memberOf Highcharts
 */
function Measure() {
    Annotation.apply(this, arguments);
}

Annotation.types.measure = Measure;

H.extendAnnotation(Measure, null, {
    /**
     *
     * Init annotation object.
     *
     */
    init: function () {
        Annotation.prototype.init.apply(this, arguments);

        this.offsetX = 0;
        this.offsetY = 0;
        this.resizeX = 0;
        this.resizeY = 0;

        this.calculations.init.call(this);
        this.addValues();
        this.addShapes();
        this.addControlPoints();
    },

    /**
     * Get measure points configuration objects.
     *
     * @return {Array<Highcharts.MockPointOptions>}
     */
    pointsOptions: function () {
        return this.options.options.points;
    },

    /**
     * Get points configuration objects for shapes.
     *
     * @return {Array<Highcharts.MockPointOptions>}
     */
    shapePointsOptions: function () {

        var options = this.options.typeOptions,
            xAxis = options.xAxis,
            yAxis = options.yAxis;

        return [
            {
                x: this.xAxisMin,
                y: this.yAxisMin,
                xAxis: xAxis,
                yAxis: yAxis
            },
            {
                x: this.xAxisMax,
                y: this.yAxisMin,
                xAxis: xAxis,
                yAxis: yAxis
            },
            {
                x: this.xAxisMax,
                y: this.yAxisMax,
                xAxis: xAxis,
                yAxis: yAxis
            },
            {
                x: this.xAxisMin,
                y: this.yAxisMax,
                xAxis: xAxis,
                yAxis: yAxis
            }
        ];
    },

    addControlPoints: function () {
        var controlPoint = new ControlPoint(
            this.chart,
            this,
            this.options.controlPointOptions,
            0
        );

        this.controlPoints.push(controlPoint);
    },
    /**
     * Add label with calculated values (min, max, average, bins).
     *
     * @param {Boolean} resize - the flag for resize shape
     *
     */
    addValues: function (resize) {
        var options = this.options.typeOptions,
            formatter = options.label.formatter,
            typeOptions = this.options.typeOptions,
            chart = this.chart,
            inverted = chart.options.chart.inverted,
            xAxis = chart.xAxis[typeOptions.xAxis],
            yAxis = chart.yAxis[typeOptions.yAxis];

        // set xAxisMin, xAxisMax, yAxisMin, yAxisMax
        this.calculations.recalculate.call(this, resize);

        if (!options.label.enabled) {
            return;
        }

        if (this.labels.length > 0) {
            this.labels[0].text = (formatter && formatter.call(this)) ||
                        this.calculations.defaultFormatter.call(this);

        } else {
            this.initLabel(H.extend({
                shape: 'rect',
                backgroundColor: 'none',
                color: 'black',
                borderWidth: 0,
                dashStyle: 'dash',
                overflow: 'none',
                align: 'left',
                vertical: 'top',
                crop: true,
                point: function (target) {
                    var annotation = target.annotation,
                        top = chart.plotTop,
                        left = chart.plotLeft;

                    return {
                        x: (inverted ? top : 10) +
                            xAxis.toPixels(annotation.xAxisMin, !inverted),
                        y: (inverted ? -left + 10 : top) +
                            yAxis.toPixels(annotation.yAxisMin)
                    };
                },
                text: (formatter && formatter.call(this)) ||
                    this.calculations.defaultFormatter.call(this)
            }, options.label));
        }
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
        var shapePoints = this.shapePointsOptions();

        if (shapePoints[0].x === undefined) {
            return;
        }

        this.initShape(H.extend({
            type: 'path',
            points: this.shapePointsOptions()
        }, this.options.typeOptions.background), false);
    },

    /**
     * Add internal crosshair shapes (on top and bottom)
     */
    addCrosshairs: function () {
        var chart = this.chart,
            options = this.options.typeOptions,
            point = this.options.typeOptions.point,
            xAxis = chart.xAxis[options.xAxis],
            yAxis = chart.yAxis[options.yAxis],
            inverted = chart.options.chart.inverted,
            xAxisMin = xAxis.toPixels(this.xAxisMin),
            xAxisMax = xAxis.toPixels(this.xAxisMax),
            yAxisMin = yAxis.toPixels(this.yAxisMin),
            yAxisMax = yAxis.toPixels(this.yAxisMax),
            defaultOptions = {
                point: point,
                type: 'path'
            },
            pathH = [],
            pathV = [],
            crosshairOptionsX, crosshairOptionsY;

        if (inverted) {
            xAxisMin = yAxis.toPixels(this.yAxisMin);
            xAxisMax = yAxis.toPixels(this.yAxisMax);
            yAxisMin = xAxis.toPixels(this.xAxisMin);
            yAxisMax = xAxis.toPixels(this.xAxisMax);
        }
        // horizontal line
        if (options.crosshairX.enabled) {
            pathH = [
                'M',
                xAxisMin,
                yAxisMin + ((yAxisMax - yAxisMin) / 2),
                'L',
                xAxisMax,
                yAxisMin + ((yAxisMax - yAxisMin) / 2)
            ];
        }

        // vertical line
        if (options.crosshairY.enabled) {
            pathV = [
                'M',
                xAxisMin + ((xAxisMax - xAxisMin) / 2),
                yAxisMin,
                'L',
                xAxisMin + ((xAxisMax - xAxisMin) / 2),
                yAxisMax
            ];
        }

        // Update existed crosshair
        if (this.shapes.length > 0) {

            this.shapes[0].options.d = pathH;
            this.shapes[1].options.d = pathV;

        } else {

            // Add new crosshairs
            crosshairOptionsX = merge(defaultOptions, options.crosshairX);
            crosshairOptionsY = merge(defaultOptions, options.crosshairY);

            this.initShape(H.extend({
                d: pathH
            }, crosshairOptionsX), false);

            this.initShape(H.extend({
                d: pathV
            }, crosshairOptionsY), false);

        }
    },

    addEvents: function () {
        H.Annotation.prototype.addEvents.call(this);

        H.addEvent(this, 'drag', function (e) {
            var translation = this.mouseMoveToTranslation(e);

            this.translate(translation.x, translation.y);

            this.offsetX += translation.x;
            this.offsetY += translation.y;

            // animation, resize, setStartPoints
            this.redraw(false, false, true);
        });
    },

    /**
     * Translate start or end ("left" or "right") side of the measure.
     * Update start points (startxMin, startxMax, startyMin, startyMax)
     *
     * @param {number} dx - the amount of x translation
     * @param {number} dy - the amount of y translation
     */
    resize: function (dx, dy) {

        // background shape
        this.shapes[2].translatePoint(dx, 0, 1);
        this.shapes[2].translatePoint(dx, dy, 2);
        this.shapes[2].translatePoint(0, dy, 3);

        this.calculations.updateStartPoints.call(this, false, true);

    },
    /**
     * Redraw event which render elements and update start points
     * if needed
     *
     * @param {Boolean} animation
     * @param {Boolean} resize - flag if resized
     * @param {Boolean} setStartPoints - update position of start points
     */
    redraw: function (animation, resize, setStartPoints) {

        this.linkPoints();

        if (!this.graphic) {
            this.render();
        }

        if (setStartPoints) {
            this.calculations.updateStartPoints.call(this, true, false);
        }

        this.addValues(resize);
        this.addCrosshairs();
        this.redrawItems(this.shapes, animation);
        this.redrawItems(this.labels, animation);

        // redraw control point to run positioner
        this.controlPoints[0].redraw();
    },
    translate: function (dx, dy) {
        H.each(this.shapes, function (item) {
            item.translate(dx, dy);
        });
    },
    calculations: {
        /*
         * Set starting points
         */
        init: function () {
            var options = this.options.typeOptions,
                chart = this.chart,
                getPointPos = this.calculations.getPointPos,
                inverted = chart.options.chart.inverted,
                xAxis = chart.xAxis[options.xAxis],
                yAxis = chart.yAxis[options.yAxis],
                bck = options.background,
                width = inverted ? bck.height : bck.width,
                height = inverted ? bck.width : bck.height;

            this.startxMin = options.point.x;
            this.startxMax = getPointPos(xAxis, this.startxMin, width);
            this.startyMin = options.point.y;
            this.startyMax = getPointPos(yAxis, this.startyMin, height);

        },
        /*
         * Set current xAxisMin, xAxisMax, yAxisMin, yAxisMax.
         * Calculations of measure values (min, max, average, bins).
         *
         * @param {Boolean} resize - flag if shape is resized
         */
        recalculate: function (resize) {
            var calc = this.calculations,
                options = this.options.typeOptions,
                xAxis = this.chart.xAxis[options.xAxis],
                yAxis = this.chart.yAxis[options.yAxis],
                getPointPos = this.calculations.getPointPos,
                offsetX = this.offsetX,
                offsetY = this.offsetY,
                resizeX = offsetX + this.resizeX,
                resizeY = offsetY + this.resizeY;

            this.xAxisMin = getPointPos(xAxis, this.startxMin, offsetX);
            this.xAxisMax = getPointPos(xAxis, this.startxMax, resizeX);
            this.yAxisMin = getPointPos(yAxis, this.startyMin, offsetY);
            this.yAxisMax = getPointPos(yAxis, this.startyMax, resizeY);

            this.min = calc.min.call(this);
            this.max = calc.max.call(this);
            this.average = calc.average.call(this);
            this.bins = calc.bins.call(this);

            if (resize) {
                this.resize.call(this, 0, 0);
            }

        },
        /*
         * Set current xAxisMin, xAxisMax, yAxisMin, yAxisMax.
         * Calculations of measure values (min, max, average, bins).
         *
         * @param {Object} axis - x or y axis reference
         * @param {Number} value - point's value (x or y)
         * @param {Number} offset - amount of pixels
         */
        getPointPos: function (axis, value, offset) {
            return axis.toValue(
                        axis.toPixels(value) + offset
                    );
        },
        /*
         * Update position of start points
         * (startxMin, startxMax, startyMin, startyMax)
         *
         * @param {Boolean} redraw - flag if shape is redraw
         * @param {Boolean} resize- flag if shape is resized
         */
        updateStartPoints: function (redraw, resize) {
            var options = this.options.typeOptions,
                xAxis = this.chart.xAxis[options.xAxis],
                yAxis = this.chart.yAxis[options.yAxis],
                getPointPos = this.calculations.getPointPos,
                startxMin = this.startxMin,
                startxMax = this.startxMax,
                startyMin = this.startyMin,
                startyMax = this.startyMax,
                offsetX = this.offsetX,
                offsetY = this.offsetY,
                resizeX = this.resizeX,
                resizeY = this.resizeY;

            if (resize) {
                this.startxMax = getPointPos(xAxis, startxMax, resizeX);
                this.startyMax = getPointPos(yAxis, startyMax, resizeY);

                this.resizeX = 0;
                this.resizeY = 0;
            }

            if (redraw) {
                this.startxMin = getPointPos(xAxis, startxMin, offsetX);
                this.startxMax = getPointPos(xAxis, startxMax, offsetX);
                this.startyMin = getPointPos(yAxis, startyMin, offsetY);
                this.startyMax = getPointPos(yAxis, startyMax, offsetY);

                this.offsetX = 0;
                this.offsetY = 0;
            }
        },
        /*
         * Default formatter of label's content
         */
        defaultFormatter: function () {
            return 'Min: ' + this.min +
                '<br>Max: ' + this.max +
                '<br>Average: ' + this.average +
                '<br>Bins: ' + this.bins;
        },
        /*
         * Set values for xAxisMin, xAxisMax, yAxisMin, yAxisMax, also
         * when chart is inverted
         */
        getExtremes: function (xAxisMin, xAxisMax, yAxisMin, yAxisMax) {
            return {
                xAxisMin: Math.min(xAxisMax, xAxisMin),
                xAxisMax: Math.max(xAxisMax, xAxisMin),
                yAxisMin: Math.min(yAxisMax, yAxisMin),
                yAxisMax: Math.max(yAxisMax, yAxisMin)
            };
        },
        /*
         * Definitions of calculations (min, max, average, bins)
         */
        min: function () {
            var min = Infinity,
                series = this.chart.series,
                ext = this.calculations.getExtremes(
                    this.xAxisMin,
                    this.xAxisMax,
                    this.yAxisMin,
                    this.yAxisMax
                ),
                isCalculated = false; // to avoid Infinity in formatter

            each(series, function (serie) {
                if (
                    serie.visible &&
                    serie.options.id !== 'highcharts-navigator-series'
                    ) {
                    each(serie.points, function (point) {
                        if (
                            !point.isNull &&
                            point.y < min &&
                            point.x > ext.xAxisMin &&
                            point.x <= ext.xAxisMax &&
                            point.y > ext.yAxisMin &&
                            point.y <= ext.yAxisMax
                        ) {
                            min = point.y;
                            isCalculated = true;
                        }
                    });
                }
            });

            if (!isCalculated) {
                min = '';
            }

            return min;
        },
        max: function () {
            var max = -Infinity,
                series = this.chart.series,
                ext = this.calculations.getExtremes(
                    this.xAxisMin,
                    this.xAxisMax,
                    this.yAxisMin,
                    this.yAxisMax
                ),
                isCalculated = false; // to avoid Infinity in formatter

            each(series, function (serie) {
                if (
                    serie.visible &&
                    serie.options.id !== 'highcharts-navigator-series'
                    ) {
                    each(serie.points, function (point) {
                        if (
                            !point.isNull &&
                            point.y > max &&
                            point.x > ext.xAxisMin &&
                            point.x <= ext.xAxisMax &&
                            point.y > ext.yAxisMin &&
                            point.y <= ext.yAxisMax
                        ) {
                            max = point.y;
                            isCalculated = true;
                        }
                    });
                }
            });

            if (!isCalculated) {
                max = '';
            }

            return max;
        },
        average: function () {
            var average = '';

            if (this.max !== '' && this.min !== '') {
                average = (this.max + this.min) / 2;
            }

            return average;
        },
        bins: function () {
            var bins = 0,
                series = this.chart.series,
                ext = this.calculations.getExtremes(
                    this.xAxisMin,
                    this.xAxisMax,
                    this.yAxisMin,
                    this.yAxisMax
                ),
                isCalculated = false; // to avoid Infinity in formatter

            each(series, function (serie) {
                if (
                    serie.visible &&
                    serie.options.id !== 'highcharts-navigator-series'
                    ) {
                    each(serie.points, function (point) {
                        if (
                            !point.isNull &&
                            point.x > ext.xAxisMin &&
                            point.x <= ext.xAxisMax &&
                            point.y > ext.yAxisMin &&
                            point.y <= ext.yAxisMax
                        ) {
                            bins++;
                            isCalculated = true;
                        }
                    });
                }
            });

            if (!isCalculated) {
                bins = '';
            }

            return bins;
        }
    }
}, {
    typeOptions: {
        xAxis: 0,
        yAxis: 0,
        background: {
            fill: 'rgba(130, 170, 255, 0.4)',
            strokeWidth: 0
        },
        height: -2,
        crosshairX: {
            enabled: true,
            zIndex: 6,
            dashStyle: 'dash',
            markerEnd: 'arrow'
        },
        crosshairY: {
            enabled: true,
            zIndex: 6,
            dashStyle: 'dash',
            markerEnd: 'arrow'
        },
        label: {
            enabled: true
            // formatter: function () { }
        }
    },

    controlPointOptions: {
        positioner: function (target) {
            var options = target.options,
                typeOptions = options.typeOptions,
                controlPointOptions = options.controlPointOptions,
                chart = target.chart,
                inverted = chart.options.chart.inverted,
                xAxis = chart.xAxis[typeOptions.xAxis],
                yAxis = chart.yAxis[typeOptions.yAxis],
                x = inverted ?
                        yAxis.toPixels(target.yAxisMax) :
                        xAxis.toPixels(target.xAxisMax),
                y = inverted ?
                        xAxis.toPixels(target.xAxisMax) :
                        yAxis.toPixels(target.yAxisMax);
            return {
                x: x - (controlPointOptions.width / 2),
                y: y - (controlPointOptions.height / 2)
            };
        },
        events: {
            drag: function (e, target) {
                var translation = this.mouseMoveToTranslation(e);

                target.resize(
                    translation.x,
                    translation.y
                );

                target.resizeX += translation.x;
                target.resizeY += translation.y;

                target.redraw(false, true);
            }
        }
    }
});

Annotation.types.measure = Measure;

export default Measure;
