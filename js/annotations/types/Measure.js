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
        var selectType = this.options.typeOptions.selectType,
            controlPoint;

        controlPoint = new ControlPoint(
            this.chart,
            this,
            this.options.controlPointOptions,
            0
        );

        this.controlPoints.push(controlPoint);

        // add extra controlPoint for horizontal and vertical range
        if (selectType !== 'xy') {
            controlPoint = new ControlPoint(
                this.chart,
                this,
                this.options.controlPointOptions,
                1
            );

            this.controlPoints.push(controlPoint);
        }
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
            var translation = this.mouseMoveToTranslation(e),
                selectType = this.options.typeOptions.selectType,
                x = selectType === 'y' ? 0 : translation.x,
                y = selectType === 'x' ? 0 : translation.y;

            this.translate(x, y);

            this.offsetX += x;
            this.offsetY += y;

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
    resize: function (dx, dy, index, selectType) {

        // background shape
        if (selectType === 'x') {
            if (index === 0) {
                this.shapes[2].translatePoint(dx, 0, 0);
                this.shapes[2].translatePoint(dx, dy, 3);
            } else {
                this.shapes[2].translatePoint(dx, 0, 1);
                this.shapes[2].translatePoint(dx, dy, 2);
            }
        } else if (selectType === 'y') {
            if (index === 0) {
                this.shapes[2].translatePoint(0, dy, 0);
                this.shapes[2].translatePoint(0, dy, 1);
            } else {
                this.shapes[2].translatePoint(0, dy, 2);
                this.shapes[2].translatePoint(0, dy, 3);
            }
        } else {
            this.shapes[2].translatePoint(dx, 0, 1);
            this.shapes[2].translatePoint(dx, dy, 2);
            this.shapes[2].translatePoint(0, dy, 3);
        }

        this.calculations.updateStartPoints
            .call(this, false, true, index, dx, dy);

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
        each(this.controlPoints, function (controlPoint) {
            controlPoint.redraw();
        });
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
                height = inverted ? bck.width : bck.height,
                selectType = options.selectType,
                top = chart.plotTop,
                left = chart.plotLeft;

            this.startxMin = options.point.x;
            this.startxMax = getPointPos(xAxis, this.startxMin, width);
            this.startyMin = options.point.y;
            this.startyMax = getPointPos(yAxis, this.startyMin, height);

            // x / y selection type
            if (selectType === 'x') {
                this.startyMin = yAxis.toValue(top);
                this.startyMax = yAxis.toValue(top + chart.plotHeight);
            } else if (selectType === 'y') {
                this.startxMin = xAxis.toValue(left);
                this.startxMax = xAxis.toValue(left + chart.plotWidth);
            }

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
        updateStartPoints: function (redraw, resize, index, dx, dy) {
            var options = this.options.typeOptions,
                selectType = options.selectType,
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
                if (selectType === 'x') {
                    if (index === 0) {
                        this.startxMin = getPointPos(xAxis, startxMin, dx);
                        this.startxMax = getPointPos(xAxis, startxMax, -dx);
                    } else {
                        this.startxMax = getPointPos(xAxis, startxMax, resizeX);
                    }
                } else if (selectType === 'y') {
                    if (index === 0) {
                        this.startyMin = getPointPos(yAxis, startyMin, dy);
                        this.startyMax = getPointPos(yAxis, startyMax, -dy);
                    } else {
                        this.startyMax = getPointPos(yAxis, startyMax, resizeY);
                    }
                } else {
                    this.startxMax = getPointPos(xAxis, startxMax, resizeX);
                    this.startyMax = getPointPos(yAxis, startyMax, resizeY);
                }

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
        selectType: 'xy',
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
            var index = this.index,
                chart = target.chart,
                options = target.options,
                typeOptions = options.typeOptions,
                selectType = typeOptions.selectType,
                controlPointOptions = options.controlPointOptions,
                inverted = chart.options.chart.inverted,
                xAxis = chart.xAxis[typeOptions.xAxis],
                yAxis = chart.yAxis[typeOptions.yAxis],
                targetX = target.xAxisMax,
                targetY = target.yAxisMax,
                ext = target.calculations.getExtremes(
                    target.xAxisMin,
                    target.xAxisMax,
                    target.yAxisMin,
                    target.yAxisMax
                ),
                x, y;

            if (selectType === 'x') {
                targetY = (ext.yAxisMax - ext.yAxisMin) / 2;
                if (index === 0) {
                    targetX = target.xAxisMin;
                }
            }

            if (selectType === 'y') {
                targetX = ext.xAxisMin + ((ext.xAxisMax - ext.xAxisMin) / 2);
                if (index === 0) {
                    targetY = target.yAxisMin;
                }
            }

            if (inverted) {
                x = yAxis.toPixels(targetY);
                y = xAxis.toPixels(targetX);
            } else {
                x = xAxis.toPixels(targetX);
                y = yAxis.toPixels(targetY);
            }

            return {
                x: x - (controlPointOptions.width / 2),
                y: y - (controlPointOptions.height / 2)
            };
        },
        events: {
            drag: function (e, target) {
                var translation = this.mouseMoveToTranslation(e),
                    selectType = target.options.typeOptions.selectType,
                    index = this.index,
                    x = selectType === 'y' ? 0 : translation.x,
                    y = selectType === 'x' ? 0 : translation.y;

                target.resize(
                    x,
                    y,
                    index,
                    selectType
                );

                target.resizeX += x;
                target.resizeY += y;
                target.redraw(false, true);
            }
        }
    }
});

Annotation.types.measure = Measure;

export default Measure;
