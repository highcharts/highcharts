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

import type StackingAxis from '../parts/StackingAxis';
import type SVGPath from '../parts/SVGPath';
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Area3dPointOptions extends AreaPointOptions {
            z?: number;
        }
        interface Area3dPointLike {
            x?: number;
            y?: number;
            z?: number;
            plotX?: number;
            plotY?: number;
            plotZ?: number;
            doCurve?: boolean;
        }
        interface Area3dSeriesOptions extends AreaSeriesOptions {
        }
        interface SeriesTypesDictionary {
            area3d: typeof Area3dSeries;
        }
        class Area3dPoint extends AreaPoint {
            public options: Area3dPointOptions;
            public series: Area3dSeries;
        }
        class Area3dSeries extends AreaSeries {
            public data: Array<Area3dPoint>;
            public options: Area3dSeriesOptions;
            public pointClass: typeof Area3dPoint;
            public points: Array<Area3dPoint>;
        }
    }
}

import Point from '../parts/Point.js';
import U from '../parts/Utilities.js';
const {
    seriesType,
    pick
} = U;

var Series = H.Series;


/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.area3d
 *
 * @augments Highcharts.Series
 */
seriesType(
    'area3d',
    'area',
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
        getGraphPath: function (
            this: Highcharts.AreaSeries,
            points: Array<Highcharts.AreaPoint>
        ): SVGPath {
            var getGraphPath = Series.prototype.getGraphPath,
                graphPath: SVGPath,
                series = this,
                options = series.options,
                stacking = options.stacking,
                yAxis = series.yAxis as StackingAxis,
                topPath: Highcharts.AreaPathObject,
                bottomPath,
                bottomPoints: Array<Highcharts.Area3dPointLike> = [],
                graphPoints: Array<Highcharts.AreaPoint> = [],
                seriesIndex = series.index,
                i,
                areaPath: Highcharts.AreaPathObject,
                plotX: number|undefined,
                stacks = yAxis.stacking.stacks[series.stackKey as any],
                threshold = options.threshold,
                translatedThreshold = Math.round( // #10909
                    yAxis.getThreshold(options.threshold as any) as any
                ),
                isNull,
                yBottom,
                connectNulls = pick( // #10574
                    options.connectNulls,
                    stacking === 'percent'
                ),
                rawPoints = series.rawPoints,

                // To display null points in underlying stacked series, this
                // series graph must be broken, and the area also fall down to
                // fill the gap left by the null point. #2069
                addDummyPoints = function (
                    i: number,
                    otherI: number,
                    side: string
                ): void {
                    var point = points[i],
                        stackedValues = stacking &&
                            stacks[point.x as any].points[seriesIndex as any],
                        nullVal = (point as any)[side + 'Null'] || 0,
                        cliffVal = (point as any)[side + 'Cliff'] || 0,
                        top,
                        bottom,
                        isNull = true;

                    if (cliffVal || nullVal) {

                        top = (nullVal ?
                            (stackedValues as any)[0] :
                            (stackedValues as any)[1]
                        ) + cliffVal;
                        bottom = (stackedValues as any)[0] + cliffVal;
                        isNull = !!nullVal;

                    } else if (
                        !stacking &&
                    points[otherI] &&
                    points[otherI].isNull
                    ) {
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
                        } as any);
                        bottomPoints.push({ // @todo create real point object
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
                        } else {
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
                var options3d = (series as any).chart.options.chart.options3d,
                    zMax = Math.max(options3d.depth, series.chart.chartWidth);
                bottomPoints = H.perspective(
                    bottomPoints as any, this.chart, true
                ).map(function (point): Highcharts.PointPosition {
                    return { plotX: point.x, plotY: point.y, plotZ: point.z };
                });
                if (series.group && options3d) {
                    series.group.attr({
                        zIndex: Math.max(
                            1,
                            zMax - Math.round(series.data[0].plotZ || 0)
                        )
                    });
                }
            }

            (bottomPoints as any).reversed = true;
            bottomPath = getGraphPath.call(this, bottomPoints as any, true, true);
            const firstBottomPoint = bottomPath[0];
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
        applyOptions: function (
            this: Highcharts.Area3dPoint
        ): Highcharts.Area3dPoint {
            Point.prototype.applyOptions.apply(this, arguments as any);
            if (typeof this.z === 'undefined') {
                this.z = 0;
            }

            return this;
        }

    }
);


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
