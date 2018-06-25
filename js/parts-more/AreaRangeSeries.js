/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
var each = H.each,
    noop = H.noop,
    pick = H.pick,
    defined = H.defined,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    seriesProto = Series.prototype,
    pointProto = H.Point.prototype;

/**
 * The area range series is a carteseian series with higher and lower values
 * for each point along an X axis, where the area between the values is shaded.
 * Requires `highcharts-more.js`.
 *
 * @extends      plotOptions.area
 * @product      highcharts highstock
 * @sample       {highcharts} highcharts/demo/arearange/
 *               Area range chart
 * @sample       {highstock} stock/demo/arearange/
 *               Area range chart
 * @excluding    stack,stacking
 * @optionparent plotOptions.arearange
 */
seriesType('arearange', 'area', {
    /*= if (build.classic) { =*/

    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
     * can be an object configuration containing `color`, `offsetX`, `offsetY`,
     * `opacity` and `width`.
     *
     * @type      {Boolean|Object}
     * @product   highcharts
     * @apioption plotOptions.arearange.shadow
     */

    /**
     * Pixel width of the arearange graph line.
     *
     * @since   2.3.0
     * @product highcharts highstock
     */
    lineWidth: 1,
    /*= } =*/

    threshold: null,

    tooltip: {
        /*= if (!build.classic) { =*/
        pointFormat: '<span class="highcharts-color-{series.colorIndex}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>',
        /*= } else { =*/

        pointFormat: '<span style="color:{series.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>' // eslint-disable-line no-dupe-keys
        /*= } =*/
    },

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @since   2.3.0
     * @product highcharts highstock
     */
    trackByArea: true,

    /**
     * Extended data labels for range series types. Range series data labels
     * have no `x` and `y` options. Instead, they have `xLow`, `xHigh`,
     * `yLow` and `yHigh` options to allow the higher and lower data label
     * sets individually.
     *
     * @type      {Object}
     * @extends   plotOptions.series.dataLabels
     * @excluding x,y
     * @since     2.3.0
     * @product   highcharts highstock
     */
    dataLabels: {

        align: null,
        verticalAlign: null,

        /**
         * X offset of the lower data labels relative to the point value.
         *
         * @sample  {highcharts} highcharts/plotoptions/arearange-datalabels/
         *          Data labels on range series
         * @sample  {highstock} highcharts/plotoptions/arearange-datalabels/
         *          Data labels on range series
         * @since   2.3.0
         * @product highcharts highstock
         */
        xLow: 0,

        /**
         * X offset of the higher data labels relative to the point value.
         *
         * @sample  {highcharts|highstock}
         *          highcharts/plotoptions/arearange-datalabels/
         *          Data labels on range series
         * @since   2.3.0
         * @product highcharts highstock
         */
        xHigh: 0,

        /**
         * Y offset of the lower data labels relative to the point value.
         *
         * @sample  {highcharts|highstock}
         *          highcharts/plotoptions/arearange-datalabels/
         *          Data labels on range series
         * @default 16
         * @since   2.3.0
         * @product highcharts highstock
         */
        yLow: 0,

        /**
         * Y offset of the higher data labels relative to the point value.
         *
         * @sample  {highcharts|highstock}
         *          highcharts/plotoptions/arearange-datalabels/
         *          Data labels on range series
         * @default -6
         * @since   2.3.0
         * @product highcharts highstock
         */
        yHigh: 0
    }

// Prototype members
}, {
    pointArrayMap: ['low', 'high'],
    dataLabelCollections: ['dataLabel', 'dataLabelUpper'],
    toYData: function (point) {
        return [point.low, point.high];
    },
    pointValKey: 'low',
    deferTranslatePolar: true,

    /**
     * Translate a point's plotHigh from the internal angle and radius
     * measures to true plotHigh coordinates. This is an addition of the
     * toXY method found in Polar.js, because it runs too early for
     * arearanges to be considered (#3419).
     */
    highToXY: function (point) {
        // Find the polar plotX and plotY
        var chart = this.chart,
            xy = this.xAxis.postTranslate(
                point.rectPlotX,
                this.yAxis.len - point.plotHigh
            );
        point.plotHighX = xy.x - chart.plotLeft;
        point.plotHigh = xy.y - chart.plotTop;
        point.plotLowX = point.plotX;
    },

    /**
     * Translate data points from raw values x and y to plotX and plotY
     */
    translate: function () {
        var series = this,
            yAxis = series.yAxis,
            hasModifyValue = !!series.modifyValue;

        seriesTypes.area.prototype.translate.apply(series);

        // Set plotLow and plotHigh
        each(series.points, function (point) {

            var low = point.low,
                high = point.high,
                plotY = point.plotY;

            if (high === null || low === null) {
                point.isNull = true;
                point.plotY = null;
            } else {
                point.plotLow = plotY;
                point.plotHigh = yAxis.translate(
                    hasModifyValue ? series.modifyValue(high, point) : high,
                    0,
                    1,
                    0,
                    1
                );
                if (hasModifyValue) {
                    point.yBottom = point.plotHigh;
                }
            }
        });

        // Postprocess plotHigh
        if (this.chart.polar) {
            each(this.points, function (point) {
                series.highToXY(point);
                point.tooltipPos = [
                    (point.plotHighX + point.plotLowX) / 2,
                    (point.plotHigh + point.plotLow) / 2
                ];
            });
        }
    },

    /**
     * Extend the line series' getSegmentPath method by applying the segment
     * path to both lower and higher values of the range
     */
    getGraphPath: function (points) {

        var highPoints = [],
            highAreaPoints = [],
            i,
            getGraphPath = seriesTypes.area.prototype.getGraphPath,
            point,
            pointShim,
            linePath,
            lowerPath,
            options = this.options,
            connectEnds = this.chart.polar && options.connectEnds !== false,
            connectNulls = options.connectNulls,
            step = options.step,
            higherPath,
            higherAreaPath;

        points = points || this.points;
        i = points.length;

        /**
         * Create the top line and the top part of the area fill. The area
         * fill compensates for null points by drawing down to the lower graph,
         * moving across the null gap and starting again at the lower graph.
         */
        i = points.length;
        while (i--) {
            point = points[i];

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i + 1] || points[i + 1].isNull)
            ) {
                highAreaPoints.push({
                    plotX: point.plotX,
                    plotY: point.plotY,
                    doCurve: false // #5186, gaps in areasplinerange fill
                });
            }

            pointShim = {
                polarPlotY: point.polarPlotY,
                rectPlotX: point.rectPlotX,
                yBottom: point.yBottom,
                // plotHighX is for polar charts
                plotX: pick(point.plotHighX, point.plotX),
                plotY: point.plotHigh,
                isNull: point.isNull
            };

            highAreaPoints.push(pointShim);

            highPoints.push(pointShim);

            if (
                !point.isNull &&
                !connectEnds &&
                !connectNulls &&
                (!points[i - 1] || points[i - 1].isNull)
            ) {
                highAreaPoints.push({
                    plotX: point.plotX,
                    plotY: point.plotY,
                    doCurve: false // #5186, gaps in areasplinerange fill
                });
            }
        }

        // Get the paths
        lowerPath = getGraphPath.call(this, points);
        if (step) {
            if (step === true) {
                step = 'left';
            }
            options.step = {
                left: 'right',
                center: 'center',
                right: 'left'
            }[step]; // swap for reading in getGraphPath
        }
        higherPath = getGraphPath.call(this, highPoints);
        higherAreaPath = getGraphPath.call(this, highAreaPoints);
        options.step = step;

        // Create a line on both top and bottom of the range
        linePath = [].concat(lowerPath, higherPath);

        // For the area path, we need to change the 'move' statement
        // into 'lineTo' or 'curveTo'
        if (!this.chart.polar && higherAreaPath[0] === 'M') {
            higherAreaPath[0] = 'L'; // this probably doesn't work for spline
        }

        this.graphPath = linePath;
        this.areaPath = lowerPath.concat(higherAreaPath);

        // Prepare for sideways animation
        linePath.isArea = true;
        linePath.xMap = lowerPath.xMap;
        this.areaPath.xMap = lowerPath.xMap;

        return linePath;
    },

    /**
     * Extend the basic drawDataLabels method by running it for both lower
     * and higher values.
     */
    drawDataLabels: function () {

        var data = this.data,
            length = data.length,
            i,
            originalDataLabels = [],
            dataLabelOptions = this.options.dataLabels,
            align = dataLabelOptions.align,
            verticalAlign = dataLabelOptions.verticalAlign,
            inside = dataLabelOptions.inside,
            point,
            up,
            inverted = this.chart.inverted;

        if (dataLabelOptions.enabled || this._hasPointLabels) {

            // Step 1: set preliminary values for plotY and dataLabel
            // and draw the upper labels
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

                    // Set preliminary values
                    point.y = point.high;
                    point._plotY = point.plotY;
                    point.plotY = point.plotHigh;

                    // Store original data labels and set preliminary label
                    // objects to be picked up in the uber method
                    originalDataLabels[i] = point.dataLabel;
                    point.dataLabel = point.dataLabelUpper;

                    // Set the default offset
                    point.below = up;
                    if (inverted) {
                        if (!align) {
                            dataLabelOptions.align = up ? 'right' : 'left';
                        }
                    } else {
                        if (!verticalAlign) {
                            dataLabelOptions.verticalAlign = up ?
                                'top' :
                                'bottom';
                        }
                    }

                    dataLabelOptions.x = dataLabelOptions.xHigh;
                    dataLabelOptions.y = dataLabelOptions.yHigh;
                }
            }

            if (seriesProto.drawDataLabels) {
                seriesProto.drawDataLabels.apply(this, arguments); // #1209
            }

            // Step 2: reorganize and handle data labels for the lower values
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

                    // Move the generated labels from step 1, and reassign
                    // the original data labels
                    point.dataLabelUpper = point.dataLabel;
                    point.dataLabel = originalDataLabels[i];

                    // Reset values
                    point.y = point.low;
                    point.plotY = point._plotY;

                    // Set the default offset
                    point.below = !up;
                    if (inverted) {
                        if (!align) {
                            dataLabelOptions.align = up ? 'left' : 'right';
                        }
                    } else {
                        if (!verticalAlign) {
                            dataLabelOptions.verticalAlign = up ?
                                'bottom' :
                                'top';
                        }

                    }

                    dataLabelOptions.x = dataLabelOptions.xLow;
                    dataLabelOptions.y = dataLabelOptions.yLow;
                }
            }
            if (seriesProto.drawDataLabels) {
                seriesProto.drawDataLabels.apply(this, arguments);
            }
        }

        dataLabelOptions.align = align;
        dataLabelOptions.verticalAlign = verticalAlign;
    },

    alignDataLabel: function () {
        seriesTypes.column.prototype.alignDataLabel.apply(this, arguments);
    },

    drawPoints: function () {
        var series = this,
            pointLength = series.points.length,
            point,
            i;

        // Draw bottom points
        seriesProto.drawPoints.apply(series, arguments);

        // Prepare drawing top points
        i = 0;
        while (i < pointLength) {
            point = series.points[i];

            // Save original props to be overridden by temporary props for top
            // points
            point.origProps = {
                plotY: point.plotY,
                plotX: point.plotX,
                isInside: point.isInside,
                negative: point.negative,
                zone: point.zone,
                y: point.y
            };

            point.lowerGraphic = point.graphic;
            point.graphic = point.upperGraphic;
            point.plotY = point.plotHigh;
            if (defined(point.plotHighX)) {
                point.plotX = point.plotHighX;
            }
            point.y = point.high;
            point.negative = point.high < (series.options.threshold || 0);
            point.zone = series.zones.length && point.getZone();

            if (!series.chart.polar) {
                point.isInside = point.isTopInside = (
                    point.plotY !== undefined &&
                    point.plotY >= 0 &&
                    point.plotY <= series.yAxis.len && // #3519
                    point.plotX >= 0 &&
                    point.plotX <= series.xAxis.len
                );
            }
            i++;
        }

        // Draw top points
        seriesProto.drawPoints.apply(series, arguments);

        // Reset top points preliminary modifications
        i = 0;
        while (i < pointLength) {
            point = series.points[i];
            point.upperGraphic = point.graphic;
            point.graphic = point.lowerGraphic;
            H.extend(point, point.origProps);
            delete point.origProps;
            i++;
        }
    },

    setStackedPoints: noop
}, {
    setState: function () {
        var prevState = this.state,
            series = this.series,
            isPolar = series.chart.polar;


        if (!defined(this.plotHigh)) {
            // Boost doesn't calculate plotHigh
            this.plotHigh = series.yAxis.toPixels(this.high, true);
        }

        if (!defined(this.plotLow)) {
            // Boost doesn't calculate plotLow
            this.plotLow = this.plotY = series.yAxis.toPixels(this.low, true);
        }

        if (series.stateMarkerGraphic) {
            series.lowerStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.upperStateMarkerGraphic;
        }

        // Change state also for the top marker
        this.graphic = this.upperGraphic;
        this.plotY = this.plotHigh;

        if (isPolar) {
            this.plotX = this.plotHighX;
        }

        // Top state:
        pointProto.setState.apply(this, arguments);

        this.state = prevState;

        // Now restore defaults
        this.plotY = this.plotLow;
        this.graphic = this.lowerGraphic;

        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (series.stateMarkerGraphic) {
            series.upperStateMarkerGraphic = series.stateMarkerGraphic;
            series.stateMarkerGraphic = series.lowerStateMarkerGraphic;
            // Lower marker is stored at stateMarkerGraphic
            // to avoid reference duplication (#7021)
            series.lowerStateMarkerGraphic = undefined;
        }

        pointProto.setState.apply(this, arguments);

    },
    haloPath: function () {
        var isPolar = this.series.chart.polar,
            path = [];

        // Bottom halo
        this.plotY = this.plotLow;
        if (isPolar) {
            this.plotX = this.plotLowX;
        }

        if (this.isInside) {
            path = pointProto.haloPath.apply(this, arguments);
        }

        // Top halo
        this.plotY = this.plotHigh;
        if (isPolar) {
            this.plotX = this.plotHighX;
        }
        if (this.isTopInside) {
            path = path.concat(
                pointProto.haloPath.apply(this, arguments)
            );
        }

        return path;
    },
    destroyElements: function () {
        var graphics = ['lowerGraphic', 'upperGraphic'];

        each(graphics, function (graphicName) {
            if (this[graphicName]) {
                this[graphicName] = this[graphicName].destroy();
            }
        }, this);

        // Clear graphic for states, removed in the above each:
        this.graphic = null;

        return pointProto.destroyElements.apply(this, arguments);
    }
});


/**
 * A `arearange` series. If the [type](#series.arearange.type) option
 * is not specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @type      {Object}
 * @extends   series,plotOptions.arearange
 * @excluding dataParser,dataURL,stack,stacking
 * @product   highcharts highstock
 * @apioption series.arearange
 */

/**
 * An array of data points for the series. For the `arearange` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 * correspond to `x,low,high`. If the first value is a string, it is
 * applied as the name of the point, and the `x` value is inferred.
 * The `x` value can also be omitted, in which case the inner arrays
 * should be of length 2\. Then the `x` value is automatically calculated,
 * either starting at 0 and incremented by 1, or from `pointStart`
 * and `pointInterval` given in the series options.
 *
 *  ```js
 *     data: [
 *         [0, 8, 3],
 *         [1, 1, 1],
 *         [2, 6, 8]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The objects are point
 * configuration objects as seen below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.arearange.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         low: 9,
 *         high: 0,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         low: 3,
 *         high: 4,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array>}
 * @extends   series.line.data
 * @excluding marker,y
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
 * @apioption series.arearange.data
 */

/**
 * The high or maximum value for each data point.
 *
 * @type      {Number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.high
 */

/**
 * The low or minimum value for each data point.
 *
 * @type      {Number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.low
 */

 /**
 * @excluding x,y
 * @product   highcharts highstock
 * @apioption series.arearange.dataLabels
 */
