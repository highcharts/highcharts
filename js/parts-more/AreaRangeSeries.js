/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 * */

/**
 * Extended data labels for range series types. Range series data labels use no
 * `x` and `y` options. Instead, they have `xLow`, `xHigh`, `yLow` and `yHigh`
 * options to allow the higher and lower data label sets individually.
 *
 * @interface Highcharts.SeriesAreaRangeDataLabelsOptionsObject
 * @extends Highcharts.DataLabelsOptionsObject
 * @since 2.3.0
 * @product highcharts highstock
 *//**
 * X offset of the lower data labels relative to the point value.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/arearange-datalabels/|Highcharts-Demo:}
 *      Data labels on range series
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/arearange-datalabels/|Highcharts-Demo:}
 *      Data labels on range series
 *
 * @name Highcharts.SeriesAreaRangeDataLabelsOptionsObject#xLow
 * @type {number|undefined}
 * @default 0
 * @since 2.3.0
 * @product highcharts highstock
 *//**
 * X offset of the higher data labels relative to the point value.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/arearange-datalabels/|Highcharts-Demo:}
 *      Data labels on range series
 *
 * @name Highcharts.SeriesAreaRangeDataLabelsOptionsObject#xHigh
 * @type {number|undefined}
 * @default 0
 * @since 2.3.0
 * @product highcharts highstock
 *//**
 * Y offset of the lower data labels relative to the point value.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/arearange-datalabels/|Highcharts-Demo:}
 *      Data labels on range series
 *
 * @name Highcharts.SeriesAreaRangeDataLabelsOptionsObject#yLow
 * @type {number|undefined}
 * @default 0
 * @since 2.3.0
 * @product highcharts highstock
 *//**
 * Y offset of the higher data labels relative to the point value.
 *
 * @see {@link https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/arearange-datalabels/|Highcharts-Demo:}
 *      Data labels on range series
 *
 * @name Highcharts.SeriesAreaRangeDataLabelsOptionsObject#yHigh
 * @type {number|undefined}
 * @default 0
 * @since 2.3.0
 * @product highcharts highstock
 */


'use strict';

import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';

var noop = H.noop,
    pick = H.pick,
    extend = H.extend,
    isArray = H.isArray,
    defined = H.defined,
    Series = H.Series,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    seriesProto = Series.prototype,
    pointProto = H.Point.prototype;

/**
 * The area range series is a carteseian series with higher and lower values for
 * each point along an X axis, where the area between the values is shaded.
 * Requires `highcharts-more.js`.
 *
 * @sample {highcharts} highcharts/demo/arearange/
 *         Area range chart
 * @sample {highstock} stock/demo/arearange/
 *         Area range chart
 *
 * @extends      plotOptions.area
 * @product      highcharts highstock
 * @excluding    stack, stacking
 * @optionparent plotOptions.arearange
 */
seriesType('arearange', 'area', {

    /**
     * Whether to apply a drop shadow to the graph line. Since 2.3 the shadow
     * can be an object configuration containing `color`, `offsetX`, `offsetY`,
     * `opacity` and `width`.
     *
     * @type      {boolean|Highcharts.ShadowOptionsObject}
     * @product   highcharts
     * @apioption plotOptions.arearange.shadow
     */

    /**
     * Pixel width of the arearange graph line.
     *
     * @since 2.3.0
     *
     * @private
     */
    lineWidth: 1,

    threshold: null,

    tooltip: {
        pointFormat: '<span style="color:{series.color}">\u25CF</span> ' +
            '{series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
    },

    /**
     * Whether the whole area or just the line should respond to mouseover
     * tooltips and other mouse or touch events.
     *
     * @since 2.3.0
     *
     * @private
     */
    trackByArea: true,

    /**
     * @type    {Highcharts.SeriesAreaRangeDataLabelsOptionsObject|Array<Highcharts.SeriesAreaRangeDataLabelsOptionsObject>}
     * @default {"xLow": 0, "xHigh": 0, "yLow": 0, "yHigh": 0}
     *
     * @private
     */
    dataLabels: {
        /** @ignore-option */
        align: null,
        /** @ignore-option */
        verticalAlign: null,
        /** @ignore-option */
        xLow: 0,
        /** @ignore-option */
        xHigh: 0,
        /** @ignore-option */
        yLow: 0,
        /** @ignore-option */
        yHigh: 0
    }

// Prototype members
}, {
    pointArrayMap: ['low', 'high'],
    toYData: function (point) {
        return [point.low, point.high];
    },
    pointValKey: 'low',
    deferTranslatePolar: true,

    // Translate a point's plotHigh from the internal angle and radius measures
    // to true plotHigh coordinates. This is an addition of the toXY method
    // found in Polar.js, because it runs too early for arearanges to be
    // considered (#3419).
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

    // Translate data points from raw values x and y to plotX and plotY.
    translate: function () {
        var series = this,
            yAxis = series.yAxis,
            hasModifyValue = !!series.modifyValue;

        seriesTypes.area.prototype.translate.apply(series);

        // Set plotLow and plotHigh
        series.points.forEach(function (point) {

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
            this.points.forEach(function (point) {
                series.highToXY(point);
                point.tooltipPos = [
                    (point.plotHighX + point.plotLowX) / 2,
                    (point.plotHigh + point.plotLow) / 2
                ];
            });
        }
    },

    // Extend the line series' getSegmentPath method by applying the segment
    // path to both lower and higher values of the range.
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

        // Create the top line and the top part of the area fill. The area fill
        // compensates for null points by drawing down to the lower graph,
        // moving across the null gap and starting again at the lower graph.
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

    // Extend the basic drawDataLabels method by running it for both lower and
    // higher values.
    drawDataLabels: function () {

        var data = this.points,
            length = data.length,
            i,
            originalDataLabels = [],
            dataLabelOptions = this.options.dataLabels,
            point,
            up,
            inverted = this.chart.inverted,
            upperDataLabelOptions,
            lowerDataLabelOptions;

        // Split into upper and lower options. If data labels is an array, the
        // first element is the upper label, the second is the lower.
        //
        // TODO: We want to change this and allow multiple labels for both upper
        // and lower values in the future - introducing some options for which
        // point value to use as Y for the dataLabel, so that this could be
        // handled in Series.drawDataLabels. This would also improve performance
        // since we now have to loop over all the points multiple times to work
        // around the data label logic.
        if (isArray(dataLabelOptions)) {
            if (dataLabelOptions.length > 1) {
                upperDataLabelOptions = dataLabelOptions[0];
                lowerDataLabelOptions = dataLabelOptions[1];
            } else {
                upperDataLabelOptions = dataLabelOptions[0];
                lowerDataLabelOptions = { enabled: false };
            }
        } else {
            upperDataLabelOptions = extend({}, dataLabelOptions); // Make copy;
            upperDataLabelOptions.x = dataLabelOptions.xHigh;
            upperDataLabelOptions.y = dataLabelOptions.yHigh;
            lowerDataLabelOptions = extend({}, dataLabelOptions); // Make copy
            lowerDataLabelOptions.x = dataLabelOptions.xLow;
            lowerDataLabelOptions.y = dataLabelOptions.yLow;
        }

        // Draw upper labels
        if (upperDataLabelOptions.enabled || this._hasPointLabels) {
            // Set preliminary values for plotY and dataLabel
            // and draw the upper labels
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = upperDataLabelOptions.inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

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
                        if (!upperDataLabelOptions.align) {
                            upperDataLabelOptions.align = up ? 'right' : 'left';
                        }
                    } else {
                        if (!upperDataLabelOptions.verticalAlign) {
                            upperDataLabelOptions.verticalAlign = up ?
                                'top' :
                                'bottom';
                        }
                    }
                }
            }

            this.options.dataLabels = upperDataLabelOptions;

            if (seriesProto.drawDataLabels) {
                seriesProto.drawDataLabels.apply(this, arguments); // #1209
            }

            // Reset state after the upper labels were created. Move
            // it to point.dataLabelUpper and reassign the originals.
            // We do this here to support not drawing a lower label.
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    point.dataLabelUpper = point.dataLabel;
                    point.dataLabel = originalDataLabels[i];
                    delete point.dataLabels;
                    point.y = point.low;
                    point.plotY = point._plotY;
                }
            }
        }

        // Draw lower labels
        if (lowerDataLabelOptions.enabled || this._hasPointLabels) {
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    up = lowerDataLabelOptions.inside ?
                        point.plotHigh < point.plotLow :
                        point.plotHigh > point.plotLow;

                    // Set the default offset
                    point.below = !up;
                    if (inverted) {
                        if (!lowerDataLabelOptions.align) {
                            lowerDataLabelOptions.align = up ? 'left' : 'right';
                        }
                    } else {
                        if (!lowerDataLabelOptions.verticalAlign) {
                            lowerDataLabelOptions.verticalAlign = up ?
                                'bottom' :
                                'top';
                        }
                    }
                }
            }

            this.options.dataLabels = lowerDataLabelOptions;

            if (seriesProto.drawDataLabels) {
                seriesProto.drawDataLabels.apply(this, arguments);
            }
        }

        // Merge upper and lower into point.dataLabels for later destroying
        if (upperDataLabelOptions.enabled) {
            i = length;
            while (i--) {
                point = data[i];
                if (point) {
                    point.dataLabels = [point.dataLabelUpper, point.dataLabel]
                        .filter(function (label) {
                            return !!label;
                        });
                }
            }
        }

        // Reset options
        this.options.dataLabels = dataLabelOptions;
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

        graphics.forEach(function (graphicName) {
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
 * A `arearange` series. If the [type](#series.arearange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 *
 * @extends   series,plotOptions.arearange
 * @excluding dataParser, dataURL, stack, stacking
 * @product   highcharts highstock
 * @apioption series.arearange
 */

/**
 * An array of data points for the series. For the `arearange` series type,
 * points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 or 2 values. In this case, the values
 *     correspond to `x,low,high`. If the first value is a string, it is
 *     applied as the name of the point, and the `x` value is inferred.
 *     The `x` value can also be omitted, in which case the inner arrays
 *     should be of length 2\. Then the `x` value is automatically calculated,
 *     either starting at 0 and incremented by 1, or from `pointStart`
 *     and `pointInterval` given in the series options.
 *     ```js
 *     data: [
 *         [0, 8, 3],
 *         [1, 1, 1],
 *         [2, 6, 8]
 *     ]
 *     ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 *     few settings, see the complete options set below. If the total number of
 *     data points exceeds the series'
 *     [turboThreshold](#series.arearange.turboThreshold),
 *     this option is not available.
 *     ```js
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
 *     ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<Array<(number|string),number>|Array<(number|string),number,number>|*>}
 * @extends   series.line.data
 * @excluding marker, y
 * @product   highcharts highstock
 * @apioption series.arearange.data
 */

/**
 * @type      {Highcharts.SeriesAreaRangeDataLabelsOptionsObject|Array<Highcharts.SeriesAreaRangeDataLabelsOptionsObject>}
 * @product   highcharts highstock
 * @apioption series.arearange.data.dataLabels
 */

/**
 * The high or maximum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.high
 */

/**
 * The low or minimum value for each data point.
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.arearange.data.low
 */
