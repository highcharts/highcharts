/**
 * X-range series module
 *
 * (c) 2010-2017 Torstein Honsi, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    defined = H.defined,
    color = H.Color,
    columnType = H.seriesTypes.column,
    each = H.each,
    isNumber = H.isNumber,
    isObject = H.isObject,
    merge = H.merge,
    pick = H.pick,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    Axis = H.Axis,
    Point = H.Point,
    Series = H.Series;

/**
 * The X-range series displays ranges on the X axis, typically time intervals
 * with a start and end date.
 *
 * @extends      {plotOptions.column}
 * @excluding    boostThreshold,crisp,cropThreshold,depth,edgeColor,edgeWidth,
 *               findNearestPointBy,getExtremesFromAll,grouping,groupPadding,
 *               negativeColor,pointInterval,pointIntervalUnit,pointPlacement,
 *               pointRange,pointStart,softThreshold,stacking,threshold,data
 * @product      highcharts highstock
 * @sample       {highcharts} highcharts/demo/x-range/
 *               X-range
 * @sample       {highcharts} highcharts/css/x-range/
 *               Styled mode X-range
 * @sample       {highcharts} highcharts/chart/inverted-xrange/
 *               Inverted X-range
 * @since        6.0.0
 * @optionparent plotOptions.xrange
 */
seriesType('xrange', 'column', {
    /**
     * A partial fill for each point, typically used to visualize how much of
     * a task is performed. The partial fill object can be set either on series
     * or point level.
     *
     * @sample    {highcharts} highcharts/demo/x-range
     *            X-range with partial fill
     * @type      {Object}
     * @product   highcharts highstock
     * @apioption plotOptions.xrange.partialFill
     */

    /**
     * The fill color to be used for partial fills. Defaults to a darker shade
     * of the point color.
     *
     * @type      {Color}
     * @product   highcharts highstock
     * @apioption plotOptions.xrange.partialFill.fill
     */

    /**
     * In an X-range series, this option makes all points of the same Y-axis
     * category the same color.
     */
    colorByPoint: true,
    dataLabels: {
        verticalAlign: 'middle',
        inside: true,
        /**
         * The default formatter for X-range data labels displays the percentage
         * of the partial fill amount.
         */
        formatter: function () {
            var point = this.point,
                amount = point.partialFill;
            if (isObject(amount)) {
                amount = amount.amount;
            }
            if (!defined(amount)) {
                amount = 0;
            }
            return (amount * 100) + '%';
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size: 0.85em">{point.x} - {point.x2}</span><br/>',
        pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.yCategory}</b><br/>'
    },
    borderRadius: 3,
    pointRange: 0

}, {
    type: 'xrange',
    parallelArrays: ['x', 'x2', 'y'],
    requireSorting: false,
    animate: seriesTypes.line.prototype.animate,
    cropShoulder: 1,
    getExtremesFromAll: true,

    /**
     * Borrow the column series metrics, but with swapped axes. This gives free
     * access to features like groupPadding, grouping, pointWidth etc.
     */
    getColumnMetrics: function () {
        var metrics,
            chart = this.chart;

        function swapAxes() {
            each(chart.series, function (s) {
                var xAxis = s.xAxis;
                s.xAxis = s.yAxis;
                s.yAxis = xAxis;
            });
        }

        swapAxes();

        metrics = columnType.prototype.getColumnMetrics.call(this);

        swapAxes();

        return metrics;
    },

    /**
     * Override cropData to show a point where x or x2 is outside visible range,
     * but one of them is inside.
     */
    cropData: function (xData, yData, min, max) {

        // Replace xData with x2Data to find the appropriate cropStart
        var cropData = Series.prototype.cropData,
            crop = cropData.call(this, this.x2Data, yData, min, max);

        // Re-insert the cropped xData
        crop.xData = xData.slice(crop.start, crop.end);

        return crop;
    },

    translatePoint: function (point) {
        var series = this,
            xAxis = series.xAxis,
            metrics = series.columnMetrics,
            minPointLength = series.options.minPointLength || 0,
            plotX = point.plotX,
            posX = pick(point.x2, point.x + (point.len || 0)),
            plotX2 = xAxis.translate(posX, 0, 0, 0, 1),
            length = Math.abs(plotX2 - plotX),
            widthDifference,
            shapeArgs,
            partialFill,
            inverted = this.chart.inverted,
            borderWidth = pick(series.options.borderWidth, 1),
            crisper = borderWidth % 2 / 2,
            dlLeft,
            dlRight,
            dlWidth;

        if (minPointLength) {
            widthDifference = minPointLength - length;
            if (widthDifference < 0) {
                widthDifference = 0;
            }
            plotX -= widthDifference / 2;
            plotX2 += widthDifference / 2;
        }

        plotX = Math.max(plotX, -10);
        plotX2 = Math.min(Math.max(plotX2, -10), xAxis.len + 10);

        point.shapeArgs = {
            x: Math.floor(Math.min(plotX, plotX2)) + crisper,
            y: Math.floor(point.plotY + metrics.offset) + crisper,
            width: Math.round(Math.abs(plotX2 - plotX)),
            height: Math.round(metrics.width),
            r: series.options.borderRadius
        };

        // Align data labels inside the shape and inside the plot area
        dlLeft = point.shapeArgs.x;
        dlRight = dlLeft + point.shapeArgs.width;
        if (dlLeft < 0 || dlRight > xAxis.len) {
            dlLeft = Math.min(xAxis.len, Math.max(0, dlLeft));
            dlRight = Math.max(0, Math.min(dlRight, xAxis.len));
            dlWidth = dlRight - dlLeft;
            point.dlBox = merge(point.shapeArgs, {
                x: dlLeft,
                width: dlRight - dlLeft,
                centerX: dlWidth ? dlWidth / 2 : null
            });

        } else {
            point.dlBox = null;
        }

        // Tooltip position
        point.tooltipPos[0] += inverted ? 0 : length / 2;
        point.tooltipPos[1] -= inverted ? length / 2 : metrics.width / 2;

        // Add a partShapeArgs to the point, based on the shapeArgs property
        partialFill = point.partialFill;
        if (partialFill) {
            // Get the partial fill amount
            if (isObject(partialFill)) {
                partialFill = partialFill.amount;
            }
            // If it was not a number, assume 0
            if (!isNumber(partialFill)) {
                partialFill = 0;
            }
            shapeArgs = point.shapeArgs;
            point.partShapeArgs = {
                x: shapeArgs.x,
                y: shapeArgs.y,
                width: shapeArgs.width,
                height: shapeArgs.height,
                r: series.options.borderRadius
            };
            point.clipRectArgs = {
                x: shapeArgs.x,
                y: shapeArgs.y,
                width: Math.max(
                    Math.round(
                        length * partialFill +
                        (point.plotX - plotX)
                    ),
                    0
                ),
                height: shapeArgs.height
            };
        }
    },

    translate: function () {
        columnType.prototype.translate.apply(this, arguments);
        each(this.points, function (point) {
            this.translatePoint(point);
        }, this);
    },

    /**
     * Draws a single point in the series. Needed for partial fill.
     *
     * This override turns point.graphic into a group containing the original
     * graphic and an overlay displaying the partial fill.
     *
     * @param   {Object} point an instance of Point in the series
     * @param   {string} verb 'animate' (animates changes) or 'attr' (sets
     *                   options)
     * @returns {void}
     */
    drawPoint: function (point, verb) {
        var series = this,
            seriesOpts = series.options,
            renderer = series.chart.renderer,
            graphic = point.graphic,
            type = point.shapeType,
            shapeArgs = point.shapeArgs,
            partShapeArgs = point.partShapeArgs,
            clipRectArgs = point.clipRectArgs,
            pfOptions = point.partialFill,
            fill,
            state = point.selected && 'select',
            cutOff = seriesOpts.stacking && !seriesOpts.borderRadius;

        if (!point.isNull) {

            // Original graphic
            if (graphic) { // update
                point.graphicOriginal[verb](
                    merge(shapeArgs)
                );

            } else {
                point.graphic = graphic = renderer.g('point')
                    .addClass(point.getClassName())
                    .add(point.group || series.group);

                point.graphicOriginal = renderer[type](shapeArgs)
                    .addClass(point.getClassName())
                    .addClass('highcharts-partfill-original')
                    .add(graphic);
            }

            // Partial fill graphic
            if (partShapeArgs) {
                if (point.graphicOverlay) {
                    point.graphicOverlay[verb](
                        merge(partShapeArgs)
                    );
                    point.clipRect.animate(
                        merge(clipRectArgs)
                    );

                } else {

                    point.clipRect = renderer.clipRect(
                        clipRectArgs.x,
                        clipRectArgs.y,
                        clipRectArgs.width,
                        clipRectArgs.height
                    );

                    point.graphicOverlay = renderer[type](partShapeArgs)
                        .addClass('highcharts-partfill-overlay')
                        .add(graphic)
                        .clip(point.clipRect);
                }
            }


            /*= if (build.classic) { =*/
            // Presentational
            point.graphicOriginal
                .attr(series.pointAttribs(point, state))
                .shadow(seriesOpts.shadow, null, cutOff);
            if (partShapeArgs) {
                // Ensure pfOptions is an object
                if (!isObject(pfOptions)) {
                    pfOptions = {};
                }
                if (isObject(seriesOpts.partialFill)) {
                    pfOptions = merge(pfOptions, seriesOpts.partialFill);
                }

                fill = (
                    pfOptions.fill ||
                    color(point.color || series.color).brighten(-0.3).get()
                );

                point.graphicOverlay
                    .attr(series.pointAttribs(point, state))
                    .attr({
                        'fill': fill
                    })
                    .shadow(seriesOpts.shadow, null, cutOff);
            }
            /*= } =*/

        } else if (graphic) {
            point.graphic = graphic.destroy(); // #1269
        }
    },

    drawPoints: function () {
        var series = this,
            verb = series.getAnimationVerb();

        // Draw the columns
        each(series.points, function (point) {
            series.drawPoint(point, verb);
        });
    },


    /**
     * Returns "animate", or "attr" if the number of points is above the
     * animation limit.
     *
     * @returns {String}
     */
    getAnimationVerb: function () {
        return this.chart.pointCount < (this.options.animationLimit || 250) ?
             'animate' : 'attr';
    }

    /**
     * Override to remove stroke from points.
     * For partial fill.
     * /
    pointAttribs: function () {
        var series = this,
            retVal = columnType.prototype.pointAttribs.apply(series, arguments);

        //retVal['stroke-width'] = 0;
        return retVal;
    }
    //*/

// Point class properties
}, {

    /**
     * Extend init so that `colorByPoint` for x-range means that one color is
     * applied per Y axis category.
     */
    init: function () {

        Point.prototype.init.apply(this, arguments);

        var colors,
            series = this.series,
            colorCount = series.chart.options.chart.colorCount;

        if (!this.y) {
            this.y = 0;
        }

        /*= if (build.classic) { =*/
        if (series.options.colorByPoint) {
            colors = series.options.colors || series.chart.options.colors;
            colorCount = colors.length;

            if (!this.options.color && colors[this.y % colorCount]) {
                this.color = colors[this.y % colorCount];
            }
        }
        /*= } =*/
        this.colorIndex = pick(this.options.colorIndex, this.y % colorCount);

        return this;
    },

    setState: function () {
        Point.prototype.setState.apply(this, arguments);

        this.series.drawPoint(this, this.series.getAnimationVerb());
    },

    // Add x2 and yCategory to the available properties for tooltip formats
    getLabelConfig: function () {
        var point = this,
            cfg = Point.prototype.getLabelConfig.call(point),
            yCats = point.series.yAxis.categories;

        cfg.x2 = point.x2;
        cfg.yCategory = point.yCategory = yCats && yCats[point.y];
        return cfg;
    },
    tooltipDateKeys: ['x', 'x2'],

    isValid: function () {
        return typeof this.x === 'number' &&
            typeof this.x2 === 'number';
    }
});

/**
 * Max x2 should be considered in xAxis extremes
 */
addEvent(Axis, 'afterGetSeriesExtremes', function () {
    var axis = this,
        axisSeries = axis.series,
        dataMax,
        modMax;

    if (axis.isXAxis) {
        dataMax = pick(axis.dataMax, -Number.MAX_VALUE);
        each(axisSeries, function (series) {
            if (series.x2Data) {
                each(series.x2Data, function (val) {
                    if (val > dataMax) {
                        dataMax = val;
                        modMax = true;
                    }
                });
            }
        });
        if (modMax) {
            axis.dataMax = dataMax;
        }
    }
});


/**
 * An `xrange` series. If the [type](#series.xrange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.xrange
 * @excluding boostThreshold,crisp,cropThreshold,depth,edgeColor,edgeWidth,
 *            findNearestPointBy,getExtremesFromAll,grouping,groupPadding,
 *            negativeColor,pointInterval,pointIntervalUnit,pointPlacement,
 *            pointRange,pointStart,softThreshold,stacking,threshold
 * @product   highcharts highstock
 * @apioption series.xrange
 */

/**
 * An array of data points for the series. For the `xrange` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of objects with named values. The objects are point
 * configuration objects as seen below.
 *
 *  ```js
 *     data: [{
 *         x: Date.UTC(2017, 0, 1),
 *         x2: Date.UTC(2017, 0, 3),
 *         name: "Test",
 *         y: 0,
 *         color: "#00FF00"
 *     }, {
 *         x: Date.UTC(2017, 0, 4),
 *         x2: Date.UTC(2017, 0, 5),
 *         name: "Deploy",
 *         y: 1,
 *         color: "#FF0000"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array|Number>}
 * @extends   series.line.data
 * @sample    {highcharts} highcharts/chart/reflow-true/
 *            Numerical values
 * @sample    {highcharts} highcharts/series/data-array-of-arrays/
 *            Arrays of numeric x and y
 * @sample    {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *            Arrays of datetime x and y
 * @sample    {highcharts} highcharts/series/data-array-of-name-value/
 *            Arrays of point.name and y
 * @sample    {highcharts} highcharts/series/data-array-of-objects/
 *            Config objects
 * @product   highcharts highstock
 * @apioption series.xrange.data
 */

/**
 * The ending X value of the range point.
 *
 * @sample    {highcharts} highcharts/demo/x-range
 *            X-range
 * @type      {Number}
 * @product   highcharts highstock
 * @apioption plotOptions.xrange.data.x2
 */

/**
 * A partial fill for each point, typically used to visualize how much of
 * a task is performed. The partial fill object can be set either on series
 * or point level.
 *
 * @sample    {highcharts} highcharts/demo/x-range
 *            X-range with partial fill
 * @type      {Object|Number}
 * @product   highcharts highstock
 * @apioption plotOptions.xrange.data.partialFill
 */

/**
 * The amount of the X-range point to be filled. Values can be 0-1 and are
 * converted to percentages in the default data label formatter.
 *
 * @type      {Number}
 * @product   highcharts highstock
 * @apioption plotOptions.xrange.data.partialFill.amount
 */

/**
 * The fill color to be used for partial fills. Defaults to a darker shade
 * of the point color.
 *
 * @type      {Color}
 * @product   highcharts highstock
 * @apioption plotOptions.xrange.data.partialFill.fill
 */
