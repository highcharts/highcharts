'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    ControlPoint = Annotation.ControlPoint,
    merge = H.merge,
    isNumber = H.isNumber;

/**
 * @class
 * @extends Annotation
 * @memberOf Annotation
 */
function Measure() {
    Annotation.apply(this, arguments);
}

Annotation.types.measure = Measure;

H.extendAnnotation(Measure, null,
    /** @lends Annotation.Measure# */
    {
        /**
         * Init annotation object.
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
        },

        /**
         * Overrides default setter to get axes from typeOptions.
         */
        setClipAxes: function () {
            this.clipXAxis = this.chart.xAxis[this.options.typeOptions.xAxis];
            this.clipYAxis = this.chart.yAxis[this.options.typeOptions.yAxis];
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
         * @param {boolean} resize - the flag for resize shape
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
         * Crosshair, background (rect)
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

        onDrag: function (e) {
            var translation = this.mouseMoveToTranslation(e),
                selectType = this.options.typeOptions.selectType,
                x = selectType === 'y' ? 0 : translation.x,
                y = selectType === 'x' ? 0 : translation.y;

            this.translate(x, y);

            this.offsetX += x;
            this.offsetY += y;

            // animation, resize, setStartPoints
            this.redraw(false, false, true);
        },

        /**
         * Translate start or end ("left" or "right") side of the measure.
         * Update start points (startXMin, startXMax, startYMin, startYMax)
         *
         * @param {number} dx - the amount of x translation
         * @param {number} dy - the amount of y translation
         * @param {number} cpIndex - index of control point
         * @param {number} selectType - x / y / xy
         */
        resize: function (dx, dy, cpIndex, selectType) {

            // background shape
            var bckShape = this.shapes[2];

            if (selectType === 'x') {
                if (cpIndex === 0) {
                    bckShape.translatePoint(dx, 0, 0);
                    bckShape.translatePoint(dx, dy, 3);
                } else {
                    bckShape.translatePoint(dx, 0, 1);
                    bckShape.translatePoint(dx, dy, 2);
                }
            } else if (selectType === 'y') {
                if (cpIndex === 0) {
                    bckShape.translatePoint(0, dy, 0);
                    bckShape.translatePoint(0, dy, 1);
                } else {
                    bckShape.translatePoint(0, dy, 2);
                    bckShape.translatePoint(0, dy, 3);
                }
            } else {
                bckShape.translatePoint(dx, 0, 1);
                bckShape.translatePoint(dx, dy, 2);
                bckShape.translatePoint(0, dy, 3);
            }

            this.calculations.updateStartPoints
                .call(this, false, true, cpIndex, dx, dy);

            this.options.typeOptions.background.height = Math.abs(
                this.startYMax - this.startYMin
            );

            this.options.typeOptions.background.width = Math.abs(
                this.startXMax - this.startXMin
            );
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
            this.controlPoints.forEach(function (controlPoint) {
                controlPoint.redraw();
            });
        },
        translate: function (dx, dy) {
            this.shapes.forEach(function (item) {
                item.translate(dx, dy);
            });

            this.options.typeOptions.point.x = this.startXMin;
            this.options.typeOptions.point.y = this.startYMin;
        },
        calculations: {
            /**
             * Set starting points
             * @private
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

                this.startXMin = options.point.x;
                this.startYMin = options.point.y;

                if (isNumber(width)) {
                    this.startXMax = this.startXMin + width;
                } else {
                    this.startXMax = getPointPos(
                        xAxis,
                        this.startXMin,
                        parseFloat(width)
                    );
                }

                if (isNumber(height)) {
                    this.startYMax = this.startYMin - height;
                } else {
                    this.startYMax = getPointPos(
                        yAxis,
                        this.startYMin,
                        parseFloat(height)
                    );
                }

                // x / y selection type
                if (selectType === 'x') {
                    this.startYMin = yAxis.toValue(top);
                    this.startYMax = yAxis.toValue(top + chart.plotHeight);
                } else if (selectType === 'y') {
                    this.startXMin = xAxis.toValue(left);
                    this.startXMax = xAxis.toValue(left + chart.plotWidth);
                }

            },
            /**
             * Set current xAxisMin, xAxisMax, yAxisMin, yAxisMax.
             * Calculations of measure values (min, max, average, bins).
             * @private
             * @param {Boolean} resize - flag if shape is resized
             */
            recalculate: function (resize) {
                var calc = this.calculations,
                    options = this.options.typeOptions,
                    xAxis = this.chart.xAxis[options.xAxis],
                    yAxis = this.chart.yAxis[options.yAxis],
                    getPointPos = this.calculations.getPointPos,
                    offsetX = this.offsetX,
                    offsetY = this.offsetY;

                this.xAxisMin = getPointPos(xAxis, this.startXMin, offsetX);
                this.xAxisMax = getPointPos(xAxis, this.startXMax, offsetX);
                this.yAxisMin = getPointPos(yAxis, this.startYMin, offsetY);
                this.yAxisMax = getPointPos(yAxis, this.startYMax, offsetY);

                this.min = calc.min.call(this);
                this.max = calc.max.call(this);
                this.average = calc.average.call(this);
                this.bins = calc.bins.call(this);

                if (resize) {
                    this.resize(0, 0);
                }

            },
            /**
             * Set current xAxisMin, xAxisMax, yAxisMin, yAxisMax.
             * Calculations of measure values (min, max, average, bins).
             * @private
             * @param {Object} axis - x or y axis reference
             * @param {Number} value - point's value (x or y)
             * @param {Number} offset - amount of pixels
             */
            getPointPos: function (axis, value, offset) {
                return axis.toValue(
                    axis.toPixels(value) + offset
                );
            },
            /**
             * Update position of start points
             * (startXMin, startXMax, startYMin, startYMax)
             * @private
             * @param {Boolean} redraw - flag if shape is redraw
             * @param {Boolean} resize - flag if shape is resized
             * @param {Boolean} cpIndex - index of controlPoint
             */
            updateStartPoints: function (redraw, resize, cpIndex, dx, dy) {
                var options = this.options.typeOptions,
                    selectType = options.selectType,
                    xAxis = this.chart.xAxis[options.xAxis],
                    yAxis = this.chart.yAxis[options.yAxis],
                    getPointPos = this.calculations.getPointPos,
                    startXMin = this.startXMin,
                    startXMax = this.startXMax,
                    startYMin = this.startYMin,
                    startYMax = this.startYMax,
                    offsetX = this.offsetX,
                    offsetY = this.offsetY;

                if (resize) {
                    if (selectType === 'x') {
                        if (cpIndex === 0) {
                            this.startXMin = getPointPos(xAxis, startXMin, dx);
                        } else {
                            this.startXMax = getPointPos(xAxis, startXMax, dx);
                        }
                    } else if (selectType === 'y') {
                        if (cpIndex === 0) {
                            this.startYMin = getPointPos(yAxis, startYMin, dy);
                        } else {
                            this.startYMax = getPointPos(yAxis, startYMax, dy);
                        }
                    } else {
                        this.startXMax = getPointPos(xAxis, startXMax, dx);
                        this.startYMax = getPointPos(yAxis, startYMax, dy);
                    }
                }

                if (redraw) {
                    this.startXMin = getPointPos(xAxis, startXMin, offsetX);
                    this.startXMax = getPointPos(xAxis, startXMax, offsetX);
                    this.startYMin = getPointPos(yAxis, startYMin, offsetY);
                    this.startYMax = getPointPos(yAxis, startYMax, offsetY);

                    this.offsetX = 0;
                    this.offsetY = 0;
                }
            },
            /**
             * Default formatter of label's content
             * @private
             */
            defaultFormatter: function () {
                return 'Min: ' + this.min +
                    '<br>Max: ' + this.max +
                    '<br>Average: ' + this.average +
                    '<br>Bins: ' + this.bins;
            },
            /**
             * Set values for xAxisMin, xAxisMax, yAxisMin, yAxisMax, also
             * when chart is inverted
             * @private
             */
            getExtremes: function (xAxisMin, xAxisMax, yAxisMin, yAxisMax) {
                return {
                    xAxisMin: Math.min(xAxisMax, xAxisMin),
                    xAxisMax: Math.max(xAxisMax, xAxisMin),
                    yAxisMin: Math.min(yAxisMax, yAxisMin),
                    yAxisMax: Math.max(yAxisMax, yAxisMin)
                };
            },
            /**
             * Definitions of calculations (min, max, average, bins)
             * @private
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

                series.forEach(function (serie) {
                    if (
                        serie.visible &&
                        serie.options.id !== 'highcharts-navigator-series'
                    ) {
                        serie.points.forEach(function (point) {
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

                series.forEach(function (serie) {
                    if (
                        serie.visible &&
                        serie.options.id !== 'highcharts-navigator-series'
                    ) {
                        serie.points.forEach(function (point) {
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

                series.forEach(function (serie) {
                    if (
                        serie.visible &&
                        serie.options.id !== 'highcharts-navigator-series'
                    ) {
                        serie.points.forEach(function (point) {
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
    },
    /**
     * A measure annotation.
     *
     * @extends annotations.crookedLine
     * @excluding labels, labelOptions, shapes, shapeOptions
     * @sample highcharts/annotations-advanced/measure/
     *         Measure
     * @product highstock
     * @optionparent annotations.measure
     */
    {
        typeOptions: {
            /**
             * Decides in what dimensions the user can resize by dragging the
             * mouse. Can be one of x, y or xy.
             */
            selectType: 'xy',
            /**
             * This number defines which xAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the xAxis array.
             */
            xAxis: 0,
            /**
             * This number defines which yAxis the point is connected to.
             * It refers to either the axis id or the index of the axis
             * in the yAxis array.
             */
            yAxis: 0,
            background: {
                /**
                 * The color of the rectangle.
                 */
                fill: 'rgba(130, 170, 255, 0.4)',
                /**
                 * The width of border.
                 */
                strokeWidth: 0,
                /**
                 * The color of border.
                 */
                stroke: undefined
            },
            /**
             * Configure a crosshair that is horizontally placed in middle of
             * rectangle.
             *
             */
            crosshairX: {
                /**
                 * Enable or disable the horizontal crosshair.
                 *
                 */
                enabled: true,
                /**
                 * The Z index of the crosshair in annotation.
                 */
                zIndex: 6,
                /**
                 * The dash or dot style of the crosshair's line. For possible
                 * values, see
                 * [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
                 *
                 * @type    {Highcharts.DashStyleValue}
                 * @default Dash
                 */
                dashStyle: 'Dash',
                /**
                 * The marker-end defines the arrowhead that will be drawn
                 * at the final vertex of the given crosshair's path.
                 *
                 * @type       {string}
                 * @default    arrow
                 */
                markerEnd: 'arrow'
            },
            /**
             * Configure a crosshair that is vertically placed in middle of
             * rectangle.
             */
            crosshairY: {
                /**
                 * Enable or disable the vertical crosshair.
                 *
                 */
                enabled: true,
                /**
                 * The Z index of the crosshair in annotation.
                 */
                zIndex: 6,
                /**
                 * The dash or dot style of the crosshair's line. For possible
                 * values, see [this demonstration](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-dashstyle-all/).
                 *
                 * @type      {Highcharts.DashStyleValue}
                 * @default   Dash
                 * @apioption annotations.measure.typeOptions.crosshairY.dashStyle
                 *
                 */
                dashStyle: 'Dash',
                /**
                 * The marker-end defines the arrowhead that will be drawn
                 * at the final vertex of the given crosshair's path.
                 *
                 * @type       {string}
                 * @default    arrow
                 * @validvalue ["none", "arrow"]
                 *
                 */
                markerEnd: 'arrow'
            },
            label: {
                /**
                 * Enable or disable the label text (min, max, average,
                 * bins values).
                 *
                 * Defaults to true.
                 */
                enabled: true,
                /**
                 * CSS styles for the measure label.
                 *
                 * @type    {Highcharts.CSSObject}
                 * @default {"color": "#666666", "fontSize": "11px"}
                 */
                style: {
                    fontSize: '11px',
                    color: '#666666'
                },
                /**
                 * Formatter function for the label text.
                 *
                 * Available data are:
                 *
                 * <table>
                 *
                 * <tbody>
                 *
                 * <tr>
                 *
                 * <td>`this.min`</td>
                 *
                 * <td>The mininimum value of the points in the selected
                 * range.</td>
                 *
                 * </tr>
                 *
                 * <tr>
                 *
                 * <td>`this.max`</td>
                 *
                 * <td>The maximum value of the points in the selected
                 * range.</td>
                 *
                 * </tr>
                 *
                 * <tr>
                 *
                 * <td>`this.average`</td>
                 *
                 * <td>The average value of the points in the selected
                 * range.</td>
                 *
                 * </tr>
                 *
                 * <tr>
                 *
                 * <td>`this.bins`</td>
                 *
                 * <td>The amount of the points in the selected range.</td>
                 *
                 * </tr>
                 *
                 * </table>
                 *
                 * @type      {function}
                 *
                 */
                formatter: undefined
            }
        },
        controlPointOptions: {
            positioner: function (target) {
                var cpIndex = this.index,
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

                    // first control point
                    if (cpIndex === 0) {
                        targetX = target.xAxisMin;
                    }
                }

                if (selectType === 'y') {
                    targetX = ext.xAxisMin +
                                        ((ext.xAxisMax - ext.xAxisMin) / 2);

                    // first control point
                    if (cpIndex === 0) {
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
