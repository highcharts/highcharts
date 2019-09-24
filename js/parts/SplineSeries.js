/* *
 *
 *  (c) 2010-2019 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import U from './Utilities.js';
var pick = U.pick;
import './Options.js';
import './Series.js';
var seriesType = H.seriesType;
/**
 * Spline series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.spline
 *
 * @augments Highcarts.Series
 */
seriesType('spline', 'line', 
/**
 * A spline series is a special type of line series, where the segments
 * between the data points are smoothed.
 *
 * @sample {highcharts} highcharts/demo/spline-irregular-time/
 *         Spline chart
 * @sample {highstock} stock/demo/spline/
 *         Spline chart
 *
 * @extends      plotOptions.series
 * @excluding    step
 * @product      highcharts highstock
 * @optionparent plotOptions.spline
 */
{}, 
/**
 * @lends seriesTypes.spline.prototype
 */
{
    /* eslint-disable valid-jsdoc */
    /**
     * Get the spline segment from a given point's previous neighbour to the
     * given point.
     *
     * @private
     * @function Highcharts.seriesTypes.spline#getPointSpline
     *
     * @param {Array<Highcharts.Point>}
     *
     * @param {Highcharts.Point} point
     *
     * @param {number} i
     *
     * @return {Highcharts.SVGPathArray}
     */
    getPointSpline: function (points, point, i) {
        var 
        // 1 means control points midway between points, 2 means 1/3
        // from the point, 3 is 1/4 etc
        smoothing = 1.5, denom = smoothing + 1, plotX = point.plotX, plotY = point.plotY, lastPoint = points[i - 1], nextPoint = points[i + 1], leftContX, leftContY, rightContX, rightContY, ret;
        /**
         * @private
         */
        function doCurve(otherPoint) {
            return otherPoint &&
                !otherPoint.isNull &&
                otherPoint.doCurve !== false &&
                // #6387, area splines next to null:
                !point.isCliff;
        }
        // Find control points
        if (doCurve(lastPoint) && doCurve(nextPoint)) {
            var lastX = lastPoint.plotX, lastY = lastPoint.plotY, nextX = nextPoint.plotX, nextY = nextPoint.plotY, correction = 0;
            leftContX =
                (smoothing * plotX + lastX) / denom;
            leftContY =
                (smoothing * plotY + lastY) / denom;
            rightContX =
                (smoothing * plotX + nextX) / denom;
            rightContY =
                (smoothing * plotY + nextY) / denom;
            // Have the two control points make a straight line through main
            // point
            if (rightContX !== leftContX) { // #5016, division by zero
                correction = (((rightContY - leftContY) *
                    (rightContX - plotX)) /
                    (rightContX - leftContX) + plotY - rightContY);
            }
            leftContY += correction;
            rightContY += correction;
            // to prevent false extremes, check that control points are
            // between neighbouring points' y values
            if (leftContY > lastY && leftContY > plotY) {
                leftContY = Math.max(lastY, plotY);
                // mirror of left control point
                rightContY = 2 * plotY - leftContY;
            }
            else if (leftContY < lastY &&
                leftContY < plotY) {
                leftContY = Math.min(lastY, plotY);
                rightContY = 2 * plotY - leftContY;
            }
            if (rightContY > nextY &&
                rightContY > plotY) {
                rightContY = Math.max(nextY, plotY);
                leftContY = 2 * plotY - rightContY;
            }
            else if (rightContY < nextY &&
                rightContY < plotY) {
                rightContY = Math.min(nextY, plotY);
                leftContY = 2 * plotY - rightContY;
            }
            // record for drawing in next point
            point.rightContX = rightContX;
            point.rightContY = rightContY;
        }
        // Visualize control points for debugging
        /*
    if (leftContX) {
        this.chart.renderer.circle(
                leftContX + this.chart.plotLeft,
                leftContY + this.chart.plotTop,
                2
            )
            .attr({
                stroke: 'red',
                'stroke-width': 2,
                fill: 'none',
                zIndex: 9
            })
            .add();
        this.chart.renderer.path(['M', leftContX + this.chart.plotLeft,
            leftContY + this.chart.plotTop,
            'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
            .attr({
                stroke: 'red',
                'stroke-width': 2,
                zIndex: 9
            })
            .add();
    }
    if (rightContX) {
        this.chart.renderer.circle(
                rightContX + this.chart.plotLeft,
                rightContY + this.chart.plotTop,
                2
            )
            .attr({
                stroke: 'green',
                'stroke-width': 2,
                fill: 'none',
                zIndex: 9
            })
            .add();
        this.chart.renderer.path(['M', rightContX + this.chart.plotLeft,
            rightContY + this.chart.plotTop,
            'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
            .attr({
                stroke: 'green',
                'stroke-width': 2,
                zIndex: 9
            })
            .add();
    }
        // */
        ret = [
            'C',
            pick(lastPoint.rightContX, lastPoint.plotX),
            pick(lastPoint.rightContY, lastPoint.plotY),
            pick(leftContX, plotX),
            pick(leftContY, plotY),
            plotX,
            plotY
        ];
        // reset for updating series later
        lastPoint.rightContX = lastPoint.rightContY = null;
        return ret;
    }
    /* eslint-enable valid-jsdoc */
});
/**
 * A `spline` series. If the [type](#series.spline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.spline
 * @excluding dataParser, dataURL, step
 * @product   highcharts highstock
 * @apioption series.spline
 */
/**
 * An array of data points for the series. For the `spline` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 9],
 *        [1, 2],
 *        [2, 8]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.spline.turboThreshold),
 *    this option is not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 0,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @product   highcharts highstock
 * @apioption series.spline.data
 */
''; // adds doclets above intro transpilat
