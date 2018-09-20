/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var defaultPlotOptions = H.defaultPlotOptions,
    each = H.each,
    merge = H.merge,
    noop = H.noop,
    pick = H.pick,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes;

var colProto = seriesTypes.column.prototype;
/**
 * The column range is a cartesian series type with higher and lower
 * Y values along an X axis. Requires `highcharts-more.js`. To display
 * horizontal bars, set [chart.inverted](#chart.inverted) to `true`.
 *
 * @type         {Object}
 * @extends      plotOptions.column
 * @excluding    negativeColor,stacking,softThreshold,threshold
 * @sample       {highcharts|highstock} highcharts/demo/columnrange/
 *               Inverted column range
 * @since        2.3.0
 * @product      highcharts highstock
 * @optionparent plotOptions.columnrange
 */
var columnRangeOptions = {

    /**
     * Extended data labels for range series types. Range series data labels
     * have no `x` and `y` options. Instead, they have `xLow`, `xHigh`,
     * `yLow` and `yHigh` options to allow the higher and lower data label
     * sets individually.
     *
     * @type      {Object}
     * @extends   plotOptions.arearange.dataLabels
     * @excluding x,y
     * @since     2.3.0
     * @product   highcharts highstock
     * @apioption plotOptions.columnrange.dataLabels
     */

    pointRange: null,

    /** @ignore-option */
    marker: null,

    states: {
        hover: {
            /** @ignore-option */
            halo: false
        }
    }
};
/**
 * The ColumnRangeSeries class
 */
seriesType('columnrange', 'arearange', merge(
    defaultPlotOptions.column,
    defaultPlotOptions.arearange,
    columnRangeOptions

), {
    /**
     * Translate data points from raw values x and y to plotX and plotY
     */
    translate: function () {
        var series = this,
            yAxis = series.yAxis,
            xAxis = series.xAxis,
            startAngleRad = xAxis.startAngleRad,
            start,
            chart = series.chart,
            isRadial = series.xAxis.isRadial,
            safeDistance = Math.max(chart.chartWidth, chart.chartHeight) + 999,
            plotHigh;

        // Don't draw too far outside plot area (#6835)
        function safeBounds(pixelPos) {
            return Math.min(Math.max(
                -safeDistance,
                pixelPos
            ), safeDistance);
        }


        colProto.translate.apply(series);

        // Set plotLow and plotHigh
        each(series.points, function (point) {
            var shapeArgs = point.shapeArgs,
                minPointLength = series.options.minPointLength,
                heightDifference,
                height,
                y;

            point.plotHigh = plotHigh = safeBounds(
                yAxis.translate(point.high, 0, 1, 0, 1)
            );
            point.plotLow = safeBounds(point.plotY);

            // adjust shape
            y = plotHigh;
            height = pick(point.rectPlotY, point.plotY) - plotHigh;

            // Adjust for minPointLength
            if (Math.abs(height) < minPointLength) {
                heightDifference = (minPointLength - height);
                height += heightDifference;
                y -= heightDifference / 2;

            // Adjust for negative ranges or reversed Y axis (#1457)
            } else if (height < 0) {
                height *= -1;
                y -= height;
            }

            if (isRadial) {

                start = point.barX + startAngleRad;
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: series.polarArc(
                        y + height,
                        y,
                        start,
                        start + point.pointWidth
                    )
                };
            } else {

                shapeArgs.height = height;
                shapeArgs.y = y;

                point.tooltipPos = chart.inverted ?
                [
                    yAxis.len + yAxis.pos - chart.plotLeft - y - height / 2,
                    xAxis.len + xAxis.pos - chart.plotTop - shapeArgs.x -
                        shapeArgs.width / 2,
                    height
                ] : [
                    xAxis.left - chart.plotLeft + shapeArgs.x +
                        shapeArgs.width / 2,
                    yAxis.pos - chart.plotTop + y + height / 2,
                    height
                ]; // don't inherit from column tooltip position - #3372
            }
        });
    },
    directTouch: true,
    trackerGroups: ['group', 'dataLabelsGroup'],
    drawGraph: noop,
    getSymbol: noop,
    crispCol: colProto.crispCol,
    drawPoints: colProto.drawPoints,
    drawTracker: colProto.drawTracker,
    getColumnMetrics: colProto.getColumnMetrics,
    pointAttribs: colProto.pointAttribs,

    // Overrides from modules that may be loaded after this module
    animate: function () {
        return colProto.animate.apply(this, arguments);
    },
    polarArc: function () {
        return colProto.polarArc.apply(this, arguments);
    },
    translate3dPoints: function () {
        return colProto.translate3dPoints.apply(this, arguments);
    },
    translate3dShapes: function () {
        return colProto.translate3dShapes.apply(this, arguments);
    }
}, {
    setState: colProto.pointClass.prototype.setState
});


/**
 * A `columnrange` series. If the [type](#series.columnrange.type)
 * option is not specified, it is inherited from
 * [chart.type](#chart.type).
 *
 * @type      {Object}
 * @extends   series,plotOptions.columnrange
 * @excluding dataParser,dataURL,stack,stacking
 * @product   highcharts highstock
 * @apioption series.columnrange
 */

/**
 * An array of data points for the series. For the `columnrange` series
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
 *         [0, 4, 2],
 *         [1, 2, 1],
 *         [2, 9, 10]
 *     ]
 *  ```
 *
 * 2.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](
 * #series.columnrange.turboThreshold), this option is not available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         low: 0,
 *         high: 4,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         low: 5,
 *         high: 3,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
 *
 * @type      {Array<Object|Array>}
 * @extends   series.arearange.data
 * @excluding marker
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
 * @apioption series.columnrange.data
 */

/**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.columnrange.states.hover
 */

/**
 * @excluding halo,lineWidth,lineWidthPlus,marker
 * @product   highcharts highstock
 * @apioption series.columnrange.states.select
 */
