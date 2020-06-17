/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  Area 3D series.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import Point from '../parts/Point.js';
import U from '../parts/Utilities.js';
var seriesType = U.seriesType, pick = U.pick;
var Series = H.Series;
/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.area3d
 *
 * @augments Highcharts.Series
 */
seriesType('area3d', 'area', 
/**
 * A 3D area plot uses x, y and z coordinates to display values for three
 * variables for a set of data.
 *
 * @sample {highcharts} highcharts/3d/area/
 *         Simple 3D area
 *
 * @extends      plotOptions.area
 * @excluding    dragDrop, cluster
 * @product      highcharts
 * @requires     highcharts-3d
 * @optionparent plotOptions.area3d
 */
{
    tooltip: {
        pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>'
    }
    // Series class
}, {
    getGraphPath: function (points) {
        var getGraphPath = Series.prototype.getGraphPath, graphPath, series = this, options = series.options, stacking = options.stacking, yAxis = series.yAxis, topPath, bottomPath, bottomPoints = [], graphPoints = [], seriesIndex = series.index, i, areaPath, plotX, stacks = yAxis.stacking.stacks[series.stackKey], threshold = options.threshold, translatedThreshold = Math.round(// #10909
        yAxis.getThreshold(options.threshold)), isNull, yBottom, connectNulls = pick(// #10574
        options.connectNulls, stacking === 'percent'), rawPoints = series.rawPoints, 
        // To display null points in underlying stacked series, this
        // series graph must be broken, and the area also fall down to
        // fill the gap left by the null point. #2069
        addDummyPoints = function (i, otherI, side) {
            var point = points[i], stackedValues = stacking &&
                stacks[point.x].points[seriesIndex], nullVal = point[side + 'Null'] || 0, cliffVal = point[side + 'Cliff'] || 0, top, bottom, isNull = true;
            if (cliffVal || nullVal) {
                top = (nullVal ?
                    stackedValues[0] :
                    stackedValues[1]) + cliffVal;
                bottom = stackedValues[0] + cliffVal;
                isNull = !!nullVal;
            }
            else if (!stacking &&
                points[otherI] &&
                points[otherI].isNull) {
                top = bottom = threshold;
            }
            // Add to the top and bottom line of the area
            if (typeof top !== 'undefined') {
                graphPoints.push({
                    plotX: plotX,
                    plotY: top === null ?
                        translatedThreshold :
                        yAxis.getThreshold(top),
                    isNull: isNull,
                    isCliff: true
                });
                bottomPoints.push({
                    plotX: plotX,
                    plotY: bottom === null ?
                        translatedThreshold :
                        yAxis.getThreshold(bottom),
                    doCurve: false // #1041, gaps in areaspline areas
                });
            }
        };
        // Find what points to use
        points = points || this.points;
        // Fill in missing points
        if (stacking) {
            points = series.getStackPoints(points);
        }
        for (i = 0; i < points.length; i++) {
            // Reset after series.update of stacking property (#12033)
            if (!stacking) {
                points[i].leftCliff = points[i].rightCliff =
                    points[i].leftNull = points[i].rightNull = void 0;
            }
            isNull = points[i].isNull;
            plotX = pick(points[i].rectPlotX, points[i].plotX);
            yBottom = pick(points[i].yBottom, translatedThreshold);
            if (!isNull || connectNulls) {
                if (!connectNulls) {
                    addDummyPoints(i, i - 1, 'left');
                }
                // Skip null point when stacking is false and connectNulls
                // true
                if (!(isNull && !stacking && connectNulls)) {
                    graphPoints.push(points[i]);
                    if (this.chart.is3d() && rawPoints) {
                        bottomPoints.push({
                            x: rawPoints[i].x,
                            y: yBottom,
                            z: series.zPadding
                        });
                    }
                    else {
                        bottomPoints.push({
                            x: i,
                            plotX: plotX,
                            plotY: yBottom
                        });
                    }
                }
                if (!connectNulls) {
                    addDummyPoints(i, i + 1, 'right');
                }
            }
        }
        topPath = getGraphPath.call(this, graphPoints, true, true);
        if (series.chart.is3d()) {
            var options3d = series.chart.options.chart.options3d, zMax = Math.max(options3d.depth, series.chart.chartWidth);
            bottomPoints = H.perspective(bottomPoints, this.chart, true).map(function (point) {
                return { plotX: point.x, plotY: point.y, plotZ: point.z };
            });
            if (series.group && options3d) {
                series.group.attr({
                    zIndex: Math.max(1, zMax - Math.round(series.data[0].plotZ || 0))
                });
            }
        }
        bottomPoints.reversed = true;
        bottomPath = getGraphPath.call(this, bottomPoints, true, true);
        var firstBottomPoint = bottomPath[0];
        if (firstBottomPoint && firstBottomPoint[0] === 'M') {
            bottomPath[0] = ['L', firstBottomPoint[1], firstBottomPoint[2]];
        }
        areaPath = topPath.concat(bottomPath);
        // TODO: don't set leftCliff and rightCliff when connectNulls?
        graphPath = getGraphPath
            .call(this, graphPoints, false, connectNulls);
        areaPath.xMap = topPath.xMap;
        this.areaPath = areaPath;
        return graphPath;
    },
    // Require direct touch rather than using the k-d-tree, because the
    // k-d-tree currently doesn't take the xyz coordinate system into
    // account (#4552)
    directTouch: true
    // Point class
}, {
    applyOptions: function () {
        Point.prototype.applyOptions.apply(this, arguments);
        if (typeof this.z === 'undefined') {
            this.z = 0;
        }
        return this;
    }
});
/**
 * A `area3d` series. If the [type](#series.area3d.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * [area3d](#plotOptions.area3d).
 *
 * @extends   series,plotOptions.area3d
 * @product   highcharts
 * @requires  highcharts-3d
 * @apioption series.area3d
 */
/**
 * An array of data points for the series. For the `area3d` series
 * type, points can be given in the following ways:
 *
 * 1.  An array of arrays with 3 values. In this case, the values correspond
 * to `x,y,z`. If the first value is a string, it is applied as the name
 * of the point, and the `x` value is inferred.
 *
 *  ```js
 *     data: [
 *         [0, 0, 1],
 *         [1, 8, 7],
 *         [2, 9, 2]
 *     ]
 *  ```
 *
 * 3.  An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series'
 * [turboThreshold](#series.area3d.turboThreshold), this option is not
 * available.
 *
 *  ```js
 *     data: [{
 *         x: 1,
 *         y: 2,
 *         z: 24,
 *         name: "Point2",
 *         color: "#00FF00"
 *     }, {
 *         x: 1,
 *         y: 4,
 *         z: 12,
 *         name: "Point1",
 *         color: "#FF00FF"
 *     }]
 *  ```
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
 * @type      {Array<Array<number>|*>}
 * @extends   series.area.data
 * @product   highcharts
 * @apioption series.area3d.data
 */
/**
 * The z value for each data point.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.area3d.data.z
 */
''; // adds doclets above to transpiled file
