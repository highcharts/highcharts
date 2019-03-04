/* *
 * Tilemaps module
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';

import H from '../parts/Globals.js';
import '../parts-map/HeatmapSeries.js';

var seriesType = H.seriesType,
    pick = H.pick,
    // Utility func to get the middle number of 3
    between = function (x, a, b) {
        return Math.min(Math.max(a, x), b);
    },
    // Utility func to get padding definition from tile size division
    tilePaddingFromTileSize = function (series, xDiv, yDiv) {
        var options = series.options;

        return {
            xPad: (options.colsize || 1) / -xDiv,
            yPad: (options.rowsize || 1) / -yDiv
        };
    };

// Map of shape types.
H.tileShapeTypes = {

    // Hexagon shape type.
    hexagon: {
        alignDataLabel: H.seriesTypes.scatter.prototype.alignDataLabel,
        getSeriesPadding: function (series) {
            return tilePaddingFromTileSize(series, 3, 2);
        },
        haloPath: function (size) {
            if (!size) {
                return [];
            }
            var hexagon = this.tileEdges;

            return [
                'M', hexagon.x2 - size, hexagon.y1 + size,
                'L', hexagon.x3 + size, hexagon.y1 + size,
                hexagon.x4 + size * 1.5, hexagon.y2,
                hexagon.x3 + size, hexagon.y3 - size,
                hexagon.x2 - size, hexagon.y3 - size,
                hexagon.x1 - size * 1.5, hexagon.y2,
                'Z'
            ];
        },
        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                seriesPointPadding = options.pointPadding || 0,
                xPad = (options.colsize || 1) / 3,
                yPad = (options.rowsize || 1) / 2,
                yShift;

            series.generatePoints();

            series.points.forEach(function (point) {
                var x1 = between(
                        Math.floor(
                            xAxis.len -
                            xAxis.translate(point.x - xPad * 2, 0, 1, 0, 1)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    x2 = between(
                        Math.floor(
                            xAxis.len -
                            xAxis.translate(point.x - xPad, 0, 1, 0, 1)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    x3 = between(
                        Math.floor(
                            xAxis.len -
                            xAxis.translate(point.x + xPad, 0, 1, 0, 1)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    x4 = between(
                        Math.floor(
                            xAxis.len -
                            xAxis.translate(point.x + xPad * 2, 0, 1, 0, 1)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    y1 = between(
                        Math.floor(yAxis.translate(point.y - yPad, 0, 1, 0, 1)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    y2 = between(
                        Math.floor(yAxis.translate(point.y, 0, 1, 0, 1)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    y3 = between(
                        Math.floor(yAxis.translate(point.y + yPad, 0, 1, 0, 1)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    pointPadding = pick(point.pointPadding, seriesPointPadding),
                    // We calculate the point padding of the midpoints to
                    // preserve the angles of the shape.
                    midPointPadding = pointPadding *
                        Math.abs(x2 - x1) / Math.abs(y3 - y2),
                    xMidPadding = xAxis.reversed ?
                        -midPointPadding : midPointPadding,
                    xPointPadding = xAxis.reversed ?
                        -pointPadding : pointPadding,
                    yPointPadding = yAxis.reversed ?
                        -pointPadding : pointPadding;

                // Shift y-values for every second grid column
                if (point.x % 2) {
                    yShift = yShift || Math.round(Math.abs(y3 - y1) / 2) *
                        // We have to reverse the shift for reversed y-axes
                        (yAxis.reversed ? -1 : 1);
                    y1 += yShift;
                    y2 += yShift;
                    y3 += yShift;
                }

                // Set plotX and plotY for use in K-D-Tree and more
                point.plotX = point.clientX = (x2 + x3) / 2;
                point.plotY = y2;

                // Apply point padding to translated coordinates
                x1 += xMidPadding + xPointPadding;
                x2 += xPointPadding;
                x3 -= xPointPadding;
                x4 -= xMidPadding + xPointPadding;
                y1 -= yPointPadding;
                y3 += yPointPadding;

                // Store points for halo creation
                point.tileEdges = {
                    x1: x1, x2: x2, x3: x3, x4: x4, y1: y1, y2: y2, y3: y3
                };

                // Finally set the shape for this point
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        'M', x2, y1,
                        'L', x3, y1,
                        x4, y2,
                        x3, y3,
                        x2, y3,
                        x1, y2,
                        'Z'
                    ]
                };
            });

            series.translateColors();
        }
    },


    // Diamond shape type.
    diamond: {
        alignDataLabel: H.seriesTypes.scatter.prototype.alignDataLabel,
        getSeriesPadding: function (series) {
            return tilePaddingFromTileSize(series, 2, 2);
        },
        haloPath: function (size) {
            if (!size) {
                return [];
            }
            var diamond = this.tileEdges;

            return [
                'M', diamond.x2, diamond.y1 + size,
                'L', diamond.x3 + size, diamond.y2,
                diamond.x2, diamond.y3 - size,
                diamond.x1 - size, diamond.y2,
                'Z'
            ];
        },
        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                seriesPointPadding = options.pointPadding || 0,
                xPad = (options.colsize || 1),
                yPad = (options.rowsize || 1) / 2,
                yShift;

            series.generatePoints();

            series.points.forEach(function (point) {
                var x1 = between(
                        Math.round(
                            xAxis.len -
                            xAxis.translate(point.x - xPad, 0, 1, 0, 0)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    x2 = between(
                        Math.round(
                            xAxis.len -
                            xAxis.translate(point.x, 0, 1, 0, 0)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    x3 = between(
                        Math.round(
                            xAxis.len -
                            xAxis.translate(point.x + xPad, 0, 1, 0, 0)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    y1 = between(
                        Math.round(yAxis.translate(point.y - yPad, 0, 1, 0, 0)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    y2 = between(
                        Math.round(yAxis.translate(point.y, 0, 1, 0, 0)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    y3 = between(
                        Math.round(yAxis.translate(point.y + yPad, 0, 1, 0, 0)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    pointPadding = pick(point.pointPadding, seriesPointPadding),
                    // We calculate the point padding of the midpoints to
                    // preserve the angles of the shape.
                    midPointPadding = pointPadding *
                        Math.abs(x2 - x1) / Math.abs(y3 - y2),
                    xPointPadding = xAxis.reversed ?
                        -midPointPadding : midPointPadding,
                    yPointPadding = yAxis.reversed ?
                        -pointPadding : pointPadding;

                // Shift y-values for every second grid column
                // We have to reverse the shift for reversed y-axes
                if (point.x % 2) {
                    yShift = Math.abs(y3 - y1) / 2 * (yAxis.reversed ? -1 : 1);
                    y1 += yShift;
                    y2 += yShift;
                    y3 += yShift;
                }

                // Set plotX and plotY for use in K-D-Tree and more
                point.plotX = point.clientX = x2;
                point.plotY = y2;

                // Apply point padding to translated coordinates
                x1 += xPointPadding;
                x3 -= xPointPadding;
                y1 -= yPointPadding;
                y3 += yPointPadding;

                // Store points for halo creation
                point.tileEdges = {
                    x1: x1, x2: x2, x3: x3, y1: y1, y2: y2, y3: y3
                };

                // Set this point's shape parameters
                point.shapeType = 'path';
                point.shapeArgs = {
                    d: [
                        'M', x2, y1,
                        'L', x3, y2,
                        x2, y3,
                        x1, y2,
                        'Z'
                    ]
                };
            });

            series.translateColors();
        }
    },


    // Circle shape type.
    circle: {
        alignDataLabel: H.seriesTypes.scatter.prototype.alignDataLabel,
        getSeriesPadding: function (series) {
            return tilePaddingFromTileSize(series, 2, 2);
        },
        haloPath: function (size) {
            return H.seriesTypes.scatter.prototype.pointClass.prototype.haloPath
                .call(
                    this,
                    size + (size && this.radius)
                );
        },
        translate: function () {
            var series = this,
                options = series.options,
                xAxis = series.xAxis,
                yAxis = series.yAxis,
                seriesPointPadding = options.pointPadding || 0,
                yRadius = (options.rowsize || 1) / 2,
                colsize = (options.colsize || 1),
                colsizePx,
                yRadiusPx,
                xRadiusPx,
                radius,
                forceNextRadiusCompute = false;

            series.generatePoints();

            series.points.forEach(function (point) {
                var x = between(
                        Math.round(
                            xAxis.len -
                            xAxis.translate(point.x, 0, 1, 0, 0)
                        ), -xAxis.len, 2 * xAxis.len
                    ),
                    y = between(
                        Math.round(yAxis.translate(point.y, 0, 1, 0, 0)),
                        -yAxis.len,
                        2 * yAxis.len
                    ),
                    pointPadding = seriesPointPadding,
                    hasPerPointPadding = false;

                // If there is point padding defined on a single point, add it
                if (point.pointPadding !== undefined) {
                    pointPadding = point.pointPadding;
                    hasPerPointPadding = true;
                    forceNextRadiusCompute = true;
                }

                // Find radius if not found already.
                // Use the smallest one (x vs y) to avoid overlap.
                // Note that the radius will be recomputed for each series.
                // Ideal (max) x radius is dependent on y radius:
                /*
                                * (circle 2)

                                        * (circle 3)
                                        |    yRadiusPx
                    (circle 1)    *-------|
                                 colsizePx

                    The distance between circle 1 and 3 (and circle 2 and 3) is
                    2r, which is the hypotenuse of the triangle created by
                    colsizePx and yRadiusPx. If the distance between circle 2
                    and circle 1 is less than 2r, we use half of that distance
                    instead (yRadiusPx).
                */
                if (!radius || forceNextRadiusCompute) {
                    colsizePx = Math.abs(
                        between(
                            Math.floor(
                                xAxis.len -
                                xAxis.translate(point.x + colsize, 0, 1, 0, 0)
                            ), -xAxis.len, 2 * xAxis.len
                        ) - x
                    );
                    yRadiusPx = Math.abs(
                        between(
                            Math.floor(
                                yAxis.translate(point.y + yRadius, 0, 1, 0, 0)
                            ), -yAxis.len, 2 * yAxis.len
                        ) - y
                    );
                    xRadiusPx = Math.floor(
                        Math.sqrt(
                            (colsizePx * colsizePx + yRadiusPx * yRadiusPx)
                        ) / 2
                    );
                    radius = Math.min(
                        colsizePx, xRadiusPx, yRadiusPx
                    ) - pointPadding;

                    // If we have per point padding we need to always compute
                    // the radius for this point and the next. If we used to
                    // have per point padding but don't anymore, don't force
                    // compute next radius.
                    if (forceNextRadiusCompute && !hasPerPointPadding) {
                        forceNextRadiusCompute = false;
                    }
                }

                // Shift y-values for every second grid column.
                // Note that we always use the optimal y axis radius for this.
                // Also note: We have to reverse the shift for reversed y-axes.
                if (point.x % 2) {
                    y += yRadiusPx * (yAxis.reversed ? -1 : 1);
                }

                // Set plotX and plotY for use in K-D-Tree and more
                point.plotX = point.clientX = x;
                point.plotY = y;

                // Save radius for halo
                point.radius = radius;

                // Set this point's shape parameters
                point.shapeType = 'circle';
                point.shapeArgs = {
                    x: x,
                    y: y,
                    r: radius
                };
            });

            series.translateColors();
        }
    },


    // Square shape type.
    square: {
        alignDataLabel: H.seriesTypes.heatmap.prototype.alignDataLabel,
        translate: H.seriesTypes.heatmap.prototype.translate,
        getSeriesPadding: function () {

        },
        haloPath: H.seriesTypes.heatmap.prototype.pointClass.prototype.haloPath
    }
};


// Extension to add pixel padding for series. Uses getSeriesPixelPadding on each
// series and adds the largest padding required. If no series has this function
// defined, we add nothing.
H.addEvent(H.Axis, 'afterSetAxisTranslation', function () {

    if (this.recomputingForTilemap) {
        return;
    }

    var axis = this,
        // Find which series' padding to use
        seriesPadding = axis.series
            .map(function (series) {
                return series.getSeriesPixelPadding &&
                    series.getSeriesPixelPadding(axis);
            })
            .reduce(function (a, b) {
                return (a && a.padding) > (b && b.padding) ? a : b;
            }, undefined) ||
            {
                padding: 0,
                axisLengthFactor: 1
            },
        lengthPadding = Math.round(
            seriesPadding.padding * seriesPadding.axisLengthFactor
        );

    // Don't waste time on this if we're not adding extra padding
    if (seriesPadding.padding) {
        // Recompute translation with new axis length now (minus padding)
        axis.len -= lengthPadding;
        axis.recomputingForTilemap = true;
        axis.setAxisTranslation();
        delete axis.recomputingForTilemap;
        axis.minPixelPadding += seriesPadding.padding;
        axis.len += lengthPadding;
    }
});

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.tilemap
 *
 * @augments Highcharts.Series
 */
seriesType('tilemap', 'heatmap'

    /**
 * A tilemap series is a type of heatmap where the tile shapes are configurable.
 *
 * @sample highcharts/demo/honeycomb-usa/
 *         Honeycomb tilemap, USA
 * @sample maps/plotoptions/honeycomb-brazil/
 *         Honeycomb tilemap, Brazil
 * @sample maps/plotoptions/honeycomb-china/
 *         Honeycomb tilemap, China
 * @sample maps/plotoptions/honeycomb-europe/
 *         Honeycomb tilemap, Europe
 * @sample maps/demo/circlemap-africa/
 *         Circlemap tilemap, Africa
 * @sample maps/demo/diamondmap
 *         Diamondmap tilemap
 *
 * @extends      plotOptions.heatmap
 * @since        6.0.0
 * @excluding    jitter, joinBy, shadow, allAreas, mapData, data
 * @product      highcharts highmaps
 * @optionparent plotOptions.tilemap
 */
    , { // Default options

        states: {

            hover: {

                halo: {

                    enabled: true,

                    size: 2,

                    opacity: 0.5,

                    attributes: {

                        zIndex: 3
                    }
                }
            }
        },

        /**
     * The padding between points in the tilemap.
     *
     * @sample maps/plotoptions/tilemap-pointpadding
     *         Point padding on tiles
     */
        pointPadding: 2,

        /**
     * The column size - how many X axis units each column in the tilemap
     * should span. Works as in [Heatmaps](#plotOptions.heatmap.colsize).
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         One day
     * @sample {highmaps} maps/demo/heatmap/
     *         One day
     *
     * @type      {number}
     * @default   1
     * @product   highcharts highmaps
     * @apioption plotOptions.tilemap.colsize
     */

        /**
     * The row size - how many Y axis units each tilemap row should span.
     * Analogous to [colsize](#plotOptions.tilemap.colsize).
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         1 by default
     * @sample {highmaps} maps/demo/heatmap/
     *         1 by default
     *
     * @type      {number}
     * @default   1
     * @product   highcharts highmaps
     * @apioption plotOptions.tilemap.rowsize
     */

        /**
     * The shape of the tiles in the tilemap. Possible values are `hexagon`,
     * `circle`, `diamond`, and `square`.
     *
     * @sample maps/demo/circlemap-africa
     *         Circular tile shapes
     * @sample maps/demo/diamondmap
     *         Diamond tile shapes
     *
     * @validvalue ["circle", "diamond", "hexagon", "square"]
     */
        tileShape: 'hexagon'

    }, { // Prototype functions

        // Set tile shape object on series
        setOptions: function () {
        // Call original function
            var ret = H.seriesTypes.heatmap.prototype.setOptions.apply(
                this,
                Array.prototype.slice.call(arguments)
            );

            this.tileShape = H.tileShapeTypes[ret.tileShape];
            return ret;
        },

        // Use the shape's defined data label alignment function
        alignDataLabel: function () {
            return this.tileShape.alignDataLabel.apply(
                this,
                Array.prototype.slice.call(arguments)
            );
        },

        // Get metrics for padding of axis for this series
        getSeriesPixelPadding: function (axis) {
            var isX = axis.isXAxis,
                padding = this.tileShape.getSeriesPadding(this),
                coord1,
                coord2;

            // If the shape type does not require padding, return no-op padding
            if (!padding) {
                return {
                    padding: 0,
                    axisLengthFactor: 1
                };
            }

            // Use translate to compute how far outside the points we
            // draw, and use this difference as padding.
            coord1 = Math.round(
                axis.translate(
                    isX ?
                        padding.xPad * 2 :
                        padding.yPad,
                    0, 1, 0, 1
                )
            );
            coord2 = Math.round(
                axis.translate(
                    isX ? padding.xPad : 0,
                    0, 1, 0, 1
                )
            );

            return {
                padding: Math.abs(coord1 - coord2) || 0,

                // Offset the yAxis length to compensate for shift. Setting the
                // length factor to 2 would add the same margin to max as min.
                // Now we only add a slight bit of the min margin to max, as we
                // don't actually draw outside the max bounds. For the xAxis we
                // draw outside on both sides so we add the same margin to min
                // and max.
                axisLengthFactor: isX ? 2 : 1.1
            };
        },

        // Use translate from tileShape
        translate: function () {
            return this.tileShape.translate.apply(
                this,
                Array.prototype.slice.call(arguments)
            );
        }

    }, H.extend({

        /**
     * @private
     * @function Highcharts.Point#haloPath
     *
     * @return {Highcharts.SVGPathArray}
     */
        haloPath: function () {
            return this.series.tileShape.haloPath.apply(
                this,
                Array.prototype.slice.call(arguments)
            );
        }
    }, H.colorPointMixin));

/**
 * A `tilemap` series. If the [type](#series.tilemap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.tilemap
 * @excluding allAreas, dataParser, dataURL, joinBy, mapData, marker,
 *            pointRange, shadow, stack
 * @product   highcharts highmaps
 * @apioption series.tilemap
 */

/**
 * An array of data points for the series. For the `tilemap` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 3 or 2 values. In this case, the values correspond
 *    to `x,y,value`. If the first value is a string, it is applied as the name
 *    of the point, and the `x` value is inferred. The `x` value can also be
 *    omitted, in which case the inner arrays should be of length 2\. Then the
 *    `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 9, 7],
 *        [1, 10, 4],
 *        [2, 6, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The objects are point configuration
 *    objects as seen below. If the total number of data points exceeds the
 *    series' [turboThreshold](#series.tilemap.turboThreshold), this option is
 *    not available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 3,
 *        value: 10,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 7,
 *        value: 10,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
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
 * @extends   series.heatmap.data
 * @excluding marker
 * @product   highcharts highmaps
 * @apioption series.tilemap.data
 */

/**
 * The color of the point. In tilemaps the point color is rarely set
 * explicitly, as we use the color to denote the `value`. Options for
 * this are set in the [colorAxis](#colorAxis) configuration.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.color
 */

/**
 * The x coordinate of the point.
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.x
 */

/**
 * The y coordinate of the point.
 *
 * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
 * coordinates are offset.
 *
 * @sample maps/series/tilemap-gridoffset
 *         Offset grid coordinates
 *
 * @type      {number}
 * @product   highcharts highmaps
 * @apioption series.tilemap.data.y
 */
