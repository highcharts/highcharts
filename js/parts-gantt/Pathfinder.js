/**
 * (c) 2016 Highsoft AS
 * Authors: Øystein Moseng, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Point.js';
import '../parts/Utilities.js';
import pathfinderAlgorithms from 'PathfinderAlgorithms.js';
import 'ArrowSymbols.js';

var defined = H.defined,
    deg2rad = H.deg2rad,
    extend = H.extend,
    each = H.each,
    addEvent = H.addEvent,
    merge = H.merge,
    pick = H.pick,
    max = Math.max,
    min = Math.min;

// TODO:
// Check dynamics, including hiding/adding/removing/updating series/points etc.
// Test connecting to multiple points

// Set default Pathfinder options
extend(H.defaultOptions, {
    pathfinder: {
        // enabled: true,
        // dashStyle: 'solid',
        // color: point.color,
        // algorithmMargin: null, // Autocomputed
        type: 'straight',
        marker: {
            // radius: null, // Autocomputed
            enabled: false,
            align: 'center',
            verticalAlign: 'middle',
            inside: false
        },
        startMarker: {
            symbol: 'diamond'
        },
        endMarker: {
            symbol: 'arrow-filled'
        },
        lineWidth: 1
    }
});


/**
 * Get point bounding box using plotX/plotY and shapeArgs. If using
 * graphic.getBBox() directly, the bbox will be affected by animation.
 *
 * @param {Object} point The point to get BB of.
 *
 * @return {Object} result xMax, xMin, yMax, yMin
 */
function getPointBB(point) {
    var shapeArgs = point.shapeArgs,
        bb = point.graphic.getBBox();

    // Prefer using shapeArgs (columns)
    if (shapeArgs) {
        return {
            xMin: shapeArgs.x,
            xMax: shapeArgs.x + shapeArgs.width,
            yMin: shapeArgs.y,
            yMax: shapeArgs.y + shapeArgs.height
        };
    }

    // Otherwise use plotX/plotY and bb
    return {
        xMin: point.plotX - bb.width / 2,
        xMax: point.plotX + bb.width / 2,
        yMin: point.plotY - bb.height / 2,
        yMax: point.plotY + bb.height / 2
    };
}


/**
 * Calculate margin to place around obstacles for the pathfinder in pixels.
 * Returns a minimum of 1 pixel margin.
 *
 * @param {Array} obstacles Obstacles to calculate margin from.
 *
 * @return {Number} result The calculated margin in pixels.
 */
function calculateObstacleMargin(obstacles) {
    var len = obstacles.length,
        i = 0,
        j,
        obstacleDistance,
        distances = [],
        // Compute smallest distance between two rectangles
        distance = function (a, b, bbMargin) {
            // Count the distance even if we are slightly off
            var margin = pick(bbMargin, 10),
                yOverlap = a.yMax + margin > b.yMin - margin &&
                            a.yMin - margin < b.yMax + margin,
                xOverlap = a.xMax + margin > b.xMin - margin &&
                            a.xMin - margin < b.xMax + margin,
                xDistance = yOverlap ? (
                    a.xMin > b.xMax ? a.xMin - b.xMax : b.xMin - a.xMax
                ) : Infinity,
                yDistance = xOverlap ? (
                    a.yMin > b.yMax ? a.yMin - b.yMax : b.yMin - a.yMax
                ) : Infinity;

            // If the rectangles collide, try recomputing with smaller margin.
            // If they collide anyway, discard the obstacle.
            if (xOverlap && yOverlap) {
                return (
                    margin ?
                    distance(a, b, Math.floor(margin / 2)) :
                    Infinity
                );
            }

            return min(xDistance, yDistance);
        };

    // Go over all obstacles and compare them to the others.
    for (; i < len; ++i) {
        // Compare to all obstacles ahead. We will already have compared this
        // obstacle to the ones before.
        for (j = i + 1; j < len; ++j) {
            obstacleDistance = distance(obstacles[i], obstacles[j]);
            if (obstacleDistance < 80) { // Ignore large distances
                distances.push(obstacleDistance);
            }
        }
    }
    // Ensure we always have at least one value, even in very spaceous charts
    distances.push(80);

    return max(
        Math.floor(
            distances.sort(function (a, b) {
                return a - b;
            })[
                // Discard first 10% of the relevant distances, and then grab
                // the smallest one.
                Math.floor(distances.length / 10)
            ] / 2 - 1 // Divide the distance by 2 and subtract 1.
        ),
        1 // 1 is the minimum margin
    );
}


/**
 * The Connection class.
 *
 * @class
 * @param {Object} from Connection runs from this Point
 * @param {Object} to Connection runs to this Point
 * @param {Object} options Connection options
 */
function Connection(from, to, options) {
    this.init(from, to, options);
}
Connection.prototype = {
    /**
     * Initialize the Connection object.
     *
     * @param {Object} from Connection runs from this Point
     * @param {Object} to Connection runs to this Point
     * @param {Object} options Connection options
     */
    init: function (from, to, options) {
        this.fromPoint = from;
        this.toPoint = to;
        this.options = options;
        this.chart = from.series.chart;
        this.pathfinder = this.chart.pathfinder;
    },

    /**
     * Add or update connection path with attributes. Stores reference to the
     * created element on connection.graphics.path.
     *
     * @param {Object} path Path to render, in array format.
     * @param {Object} attribs SVG attributes for the path.
     * @param {Function} complete Callback function when the path has been
     *  rendered and animation is complete.
     */
    renderPath: function (path, attribs, complete) {
        var connection = this,
            chart = this.chart,
            pathfinder = chart.pathfinder,
            animate = !(
                chart.options.pathfinder &&
                chart.options.pathfinder.animation === false
            ),
            pathGraphic = connection.graphics && connection.graphics.path;

        // Add the SVG element of the pathfinder group if it doesn't exist
        if (!pathfinder.group) {
            pathfinder.group = chart.renderer.g()
                .addClass('highcharts-pathfinder')
                .attr({ zIndex: -1 })
                .add(chart.seriesGroup);
        }

        // Shift the group to compensate for plot area.
        // Note: Do this always (even when redrawing a path) to avoid issues
        // when updating chart in a way that changes plot metrics.
        pathfinder.group.translate(chart.plotLeft, chart.plotTop);

        // Create path if does not exist
        if (!(pathGraphic && pathGraphic.renderer)) {
            pathGraphic = chart.renderer.path()
                .addClass('highcharts-point-connecting-path')
                .attr({
                    opacity: chart.options.chart.forExport ? 1 : 0
                })
                .add(pathfinder.group);
        }

        // Set path attribs and animate to the new path
        if (animate) {
            pathGraphic.attr(attribs);
            pathGraphic.animate({
                d: path,
                opacity: 1
            }, null, complete);
        } else {
            pathGraphic.attr(extend(attribs, {
                d: path,
                opacity: 1
            }), null, complete);
        }

        // Store reference on connection
        this.graphics = this.graphics || {};
        this.graphics.path = pathGraphic;
    },

    /**
     * Calculate and add marker graphics for connection.
     *
     * @param {String} type Marker type, either 'start' or 'end'.
     * @param {Object} options Options for this marker.
     * @param {Array} path Connection path in array format.
     */
    addMarker: function (type, options, path) {
        var connection = this,
            chart = connection.fromPoint.series.chart,
            pathfinder = chart.pathfinder,
            renderer = chart.renderer,
            point = (
                type === 'start' ?
                connection.fromPoint :
                connection.toPoint
            ),
            anchor = point.getPathfinderAnchorPoint(options),
            markerVector,
            radians,
            rotation,
            marker,
            width,
            height,
            pathVector;

        if (!options.enabled) {
            return;
        }

        // Last vector before start/end of path, used to get angle
        if (type === 'start') {
            pathVector = {
                x: path[4],
                y: path[5]
            };
        } else { // 'end'
            pathVector = {
                x: path[path.length - 5],
                y: path[path.length - 4]
            };
        }

        // Get angle between pathVector and anchor point and use it to create
        // marker position.
        radians = point.getRadiansToVector(pathVector, anchor);
        markerVector = point.getMarkerVector(
            radians,
            options.radius,
            anchor
        );

        // Rotation of marker is calculated from angle between pathVector and
        // markerVector.
        // (Note:
        //  Used to recalculate radians between markerVector and pathVector,
        //  but this should be the same as between pathVector and anchor.)
        rotation = radians / deg2rad;

        if (options.width && options.height) {
            width = options.width;
            height = options.height;
        } else {
            width = height = options.radius * 2;
        }

        // Add graphics object if it does not exist
        connection.graphics = connection.graphics || {};

        // Remove old marker
        if (connection.graphics[type]) {
            connection.graphics[type].destroy();
        }

        // Create new marker element
        marker = renderer.symbol(
                options.symbol,
                markerVector.x - (width / 2),
                markerVector.y - (height / 2),
                width,
                height
            )
            .addClass('highcharts-point-connecting-path-' + type + '-marker')
            .attr({
                fill: options.color || connection.fromPoint.color,
                stroke: options.stroke,
                'stroke-width': options['stroke-width']
            })
            .add(pathfinder.group);

        // Rotate marker according to degrees
        marker.attr(
            'transform',
            'rotate(' +
            -rotation + ',' + markerVector.x + ',' + markerVector.y +
            ')'
        );

        // Store reference to element
        connection.graphics[type] = marker;
    },

    /**
     * Calculate and return connection path.
     * Note: Recalculates chart obstacles on demand.
     *
     * @param {Object} options Pathfinder options.
     *
     * @return {Array} result Calculated SVG path data in array format.
     */
    getPath: function (options) {
        var pathfinder = this.pathfinder,
            chart = this.chart,
            algorithm = pathfinder.algorithms[options.type],
            chartObstacles = pathfinder.chartObstacles;

        if (typeof algorithm !== 'function') {
            H.error(
                '"' + options.type + '" is not a Pathfinder algorithm.'
            );
            return;
        }

        // This function calculates obstacles on demand if they don't exist
        if (algorithm.requiresObstacles && !chartObstacles) {
            chartObstacles =
                pathfinder.chartObstacles =
                pathfinder.getChartObstacles(options);

            // If the algorithmMargin was computed, store the result in default
            // options.
            chart.options.pathfinder.algorithmMargin = options.algorithmMargin;

            // Cache some metrics too
            pathfinder.chartObstacleMetrics =
                pathfinder.getObstacleMetrics(chartObstacles);
        }

        // Get the SVG path
        return algorithm(
            // From
            this.fromPoint.getPathfinderAnchorPoint(options.startMarker),
            // To
            this.toPoint.getPathfinderAnchorPoint(options.endMarker),
            merge({
                chartObstacles: chartObstacles,
                lineObstacles: pathfinder.lineObstacles || [],
                obstacleMetrics: pathfinder.chartObstacleMetrics,
                hardBounds: {
                    xMin: 0,
                    xMax: chart.plotWidth,
                    yMin: 0,
                    yMax: chart.plotHeight
                },
                obstacleOptions: {
                    margin: options.algorithmMargin
                },
                startDirectionX: pathfinder.getAlgorithmStartDirection(
                                options.startMarker
                            )
            }, options)
        );
    },

    /**
     * (re)Calculate and (re)draw the connection.
     */
    render: function () {
        var connection = this,
            fromPoint = connection.fromPoint,
            series = fromPoint.series,
            chart = series.chart,
            pathfinder = chart.pathfinder,
            pathResult,
            path,
            options = merge(
                chart.options.pathfinder, series.options.pathfinder,
                fromPoint.options.pathfinder, connection.options
            ),
            attribs = {
                stroke: options.color || fromPoint.color,
                'stroke-width': options.lineWidth
            };

        // Set path attribs
        if (options.dashStyle) {
            attribs.dashstyle = options.dashStyle;
        }
        options = merge(attribs, options);

        // Set common marker options
        if (!defined(options.marker.radius)) {
            options.marker.radius = min(max(
                Math.ceil((options.algorithmMargin || 8) / 2) - 1, 1
            ), 5);
        }
        options.startMarker = merge(options.marker, options.startMarker);
        options.endMarker = merge(options.marker, options.endMarker);

        // Get the path
        pathResult = connection.getPath(options);
        path = pathResult.path;

        // Always update obstacle storage with obstacles from this path.
        // We don't know if future pathTo calls will need this for their
        // algorithm.
        if (pathResult.obstacles) {
            pathfinder.lineObstacles = pathfinder.lineObstacles || [];
            pathfinder.lineObstacles =
                pathfinder.lineObstacles.concat(pathResult.obstacles);
        }

        // Remove markers
        if (connection.graphics) {
            if (connection.graphics.start) {
                connection.graphics.start.destroy();
                delete connection.graphics.start;
            }
            if (connection.graphics.end) {
                connection.graphics.end.destroy();
                delete connection.graphics.end;
            }
        }

        // Add the calculated path to the pathfinder group
        connection.renderPath(path, attribs, function () {
            // On animation complete
            // Override common marker options
            options.startMarker = merge(options, options.startMarker);
            options.endMarker = merge(options, options.endMarker);
            delete options.startMarker.startMarker;
            delete options.startMarker.endMarker;
            delete options.endMarker.startMarker;
            delete options.endMarker.endMarker;
            // Render the markers
            connection.addMarker('start', options.startMarker, path);
            connection.addMarker('end', options.endMarker, path);
        });
    },

    /**
     * Destroy connection by destroying the added graphics elements.
     */
    destroy: function () {
        if (this.graphics) {
            H.objectEach(this.graphics, function (val) {
                val.destroy();
            });
        }
    }
};


/**
 * The Pathfinder class.
 *
 * @class
 * @param {Object} chart
 */
function Pathfinder(chart) {
    this.init(chart);
}
Pathfinder.prototype = {

    algorithms: pathfinderAlgorithms,

    /**
     * Initialize the Pathfinder object.
     *
     * @param {Object} chart The chart context.
     */
    init: function (chart) {
        // Initialize pathfinder with chart context
        this.chart = chart;

        // Init connection reference list
        this.connections = [];

        // Recalculate paths/obstacles on chart redraw
        addEvent(chart, 'redraw', function () {
            this.pathfinder.update();
        });
    },

    /**
     * Update Pathfinder connections from scratch.
     */
    update: function () {
        var chart = this.chart,
            pathfinder = this,
            oldConnections = pathfinder.connections;

        // Rebuild pathfinder connections from options
        pathfinder.connections = [];
        each(chart.series, function (series) {
            if (series.visible) {
                each(series.points, function (point) {
                    var to,
                        connects = (
                            point.options &&
                            point.options.connect &&
                            H.splat(point.options.connect)
                        );
                    if (point.visible && connects) {
                        each(connects, function (connect) {
                            to = chart.get(typeof connect === 'string' ?
                                connect : connect.to
                            );
                            if (
                                to instanceof H.Point &&
                                to.series.visible &&
                                to.visible
                            ) {
                                // Add new connection
                                pathfinder.connections.push(new Connection(
                                    point, // from
                                    to,
                                    typeof connect === 'string' ? {} : connect
                                ));
                            }
                        });
                    }
                });
            }
        });

        // Clear connections that should not be updated, and move old info over
        // to new connections.
        for (
            var j = 0, k, found, lenOld = oldConnections.length,
                lenNew = pathfinder.connections.length;
            j < lenOld;
            ++j
        ) {
            found = false;
            for (k = 0; k < lenNew; ++k) {
                if (
                    oldConnections[j].fromPoint ===
                        pathfinder.connections[k].fromPoint &&
                    oldConnections[j].toPoint ===
                        pathfinder.connections[k].toPoint
                ) {
                    pathfinder.connections[k].graphics =
                        oldConnections[j].graphics;
                    found = true;
                    break;
                }
            }
            if (!found) {
                oldConnections[j].destroy();
            }
        }

        // Clear obstacles to force recalculation. This must be done on every
        // redraw in case positions have changed. Recalculation is handled in
        // Point.pathTo on demand.
        delete this.chartObstacles;
        delete this.lineObstacles;

        // Draw the pending connections
        pathfinder.renderConnections();
    },

    /**
     * Draw the chart's connecting paths.
     */
    renderConnections: function () {
        each(this.connections, function (connection) {
            connection.render();
        });
    },

    /**
     * Get chart obstacles from points. Does not include connecting lines from
     * Pathfinder. Applies algorithmMargin to the obstacles.
     *
     * @param {Object} options Options for the calculation.
     *
     * @return {Object} result The calculated obstacles.
     */
    getChartObstacles: function (options) {
        var obstacles = [],
            series = this.chart.series,
            margin = pick(options.algorithmMargin, 0),
            calculatedMargin;
        for (var i = 0, sLen = series.length; i < sLen; ++i) {
            if (series[i].visible) {
                for (
                    var j = 0, pLen = series[i].points.length, bb, point;
                    j < pLen;
                    ++j
                ) {
                    point = series[i].points[j];
                    if (point.visible) {
                        bb = getPointBB(point);
                        obstacles.push({
                            xMin: bb.xMin - margin,
                            xMax: bb.xMax + margin,
                            yMin: bb.yMin - margin,
                            yMax: bb.yMax + margin
                        });
                    }
                }
            }
        }

        // Sort obstacles by xMin for optimization
        obstacles = obstacles.sort(function (a, b) {
            return a.xMin - b.xMin;
        });

        // Add auto-calculated margin if the option is not defined
        if (!defined(options.algorithmMargin)) {
            calculatedMargin =
                options.algorithmMargin =
                calculateObstacleMargin(obstacles);
            each(obstacles, function (obstacle) {
                obstacle.xMin -= calculatedMargin;
                obstacle.xMax += calculatedMargin;
                obstacle.yMin -= calculatedMargin;
                obstacle.yMax += calculatedMargin;
            });
        }

        return obstacles;
    },

    /**
     * Get metrics for obstacles.
     *  - Widest obstacle width
     *  - Tallest obstacle height
     *
     * @param {Object} obstacles Options for the calculation.
     *
     * @return {Object} result The calculated metrics.
     */
    getObstacleMetrics: function (obstacles) {
        var maxWidth = 0,
            maxHeight = 0,
            width,
            height,
            i = obstacles.length;

        while (i--) {
            width = obstacles[i].xMax - obstacles[i].xMin;
            height = obstacles[i].yMax - obstacles[i].yMin;
            if (maxWidth < width) {
                maxWidth = width;
            }
            if (maxHeight < height) {
                maxHeight = height;
            }
        }

        return {
            maxHeight: maxHeight,
            maxWidth: maxWidth
        };
    },

    /**
     * Get which direction to start the pathfinding algorithm, calculated from
     * marker options.
     *
     * @param {Object} markerOptions Marker options to calculate from.
     *
     * @return {Boolean} result Returns true for X, false for Y, and undefined
     *                          for autocalculate.
     */
    getAlgorithmStartDirection: function (markerOptions) {
        var xCenter = markerOptions.align !== 'left' &&
                        markerOptions.align !== 'right',
            yCenter = markerOptions.verticalAlign !== 'top' &&
                        markerOptions.verticalAlign !== 'bottom',
            undef;

        return xCenter ?
            (yCenter ? undef : false) : // x is centered
            (yCenter ? true : undef);   // x is off-center
    }
};

// Add to Highcharts namespace
H.Connection = Connection;
H.Pathfinder = Pathfinder;


// Add pathfinding capabilities to Points
extend(H.Point.prototype, /** @lends Point.prototype */ {

    /**
     * Get coordinates of anchor point for pathfinder connection.
     *
     * @param {Object} markerOptions Connection options for position on point
     *
     * @return {Object} result An object with x/y properties for the position.
     *  Coordinates are in plot values, not relative to point.
     */
    getPathfinderAnchorPoint: function (markerOptions) {
        var bb = getPointBB(this),
            x,
            y;

        switch (markerOptions.align) { // eslint-disable-line default-case
            case 'right':
                x = 'xMax';
                break;
            case 'left':
                x = 'xMin';
        }

        switch (markerOptions.verticalAlign) { // eslint-disable-line default-case
            case 'top':
                y = 'yMin';
                break;
            case 'bottom':
                y = 'yMax';
        }

        return {
            x: x ? bb[x] : (bb.xMin + bb.xMax) / 2,
            y: y ? bb[y] : (bb.yMin + bb.yMax) / 2
        };
    },

    /**
     * Get the angle from one point to another.
     * @param  {Object} v1 - the first vector
     * @param  {Object} v1.x - the first vector x position
     * @param  {Object} v1.y - the first vector y position
     * @param  {Object} v2 - the second vector
     * @param  {Object} v2.x - the second vector x position
     * @param  {Object} v2.y - the second vector y position
     * @return {number}    - the angle in degrees
     */
    getRadiansToVector: function (v1, v2) {
        var box;
        if (!defined(v2)) {
            box = getPointBB(this);
            v2 = {
                x: (box.xMin + box.xMax) / 2,
                y: (box.yMin + box.yMax) / 2
            };
        }
        return Math.atan2(v2.y - v1.y, v1.x - v2.x);
    },

    /**
     * Get the position of the marker, based on the path angle and the marker's
     * radius.
     * @param {number} radians      the angle in radians from the point center
     *                              to another vector
     * @param {number} markerRadius the radius of the marker, to calculate the
     *                              additional distance to the center of the
     *                              marker
     * @param {Object} anchor       the anchor point of the path and marker
     * @param {number} anchor.x     the x position of the anchor
     * @param {number} anchor.y     the x position of the anchor
     * @return {Object}             a vector (x, y) of the marker position
     */
    getMarkerVector: function (radians, markerRadius, anchor) {
        var twoPI = Math.PI * 2.0,
            theta = radians,
            bb =  getPointBB(this),
            rectWidth = bb.xMax - bb.xMin,
            rectHeight = bb.yMax - bb.yMin,
            rAtan = Math.atan2(rectHeight, rectWidth),
            tanTheta = 1,
            leftOrRightRegion = false,
            rectHalfWidth = rectWidth / 2.0,
            rectHalfHeight = rectHeight / 2.0,
            rectHorizontalCenter = bb.xMin + rectHalfWidth,
            rectVerticalCenter = bb.yMin + rectHalfHeight,
            edgePoint = {
                x: rectHorizontalCenter,
                y: rectVerticalCenter
            },
            markerPoint = {},
            xFactor = 1,
            yFactor = 1;

        while (theta < -Math.PI) {
            theta += twoPI;
        }

        while (theta > Math.PI) {
            theta -= twoPI;
        }

        tanTheta = Math.tan(theta);

        if ((theta > -rAtan) && (theta <= rAtan)) {
            // Right side
            yFactor = -1;
            leftOrRightRegion = true;
        } else if (theta > rAtan && theta <= (Math.PI - rAtan)) {
            // Top side
            yFactor = -1;
        } else if (theta > (Math.PI - rAtan) || theta <= -(Math.PI - rAtan)) {
            // Left side
            xFactor = -1;
            leftOrRightRegion = true;
        } else {
            // Bottom side
            xFactor = -1;
        }

        // Correct the edgePoint according to the placement of the marker
        if (leftOrRightRegion) {
            edgePoint.x += xFactor * (rectHalfWidth);
            edgePoint.y += yFactor * (rectHalfWidth) * tanTheta;
        } else {
            edgePoint.x += xFactor * (rectHeight / (2.0 * tanTheta));
            edgePoint.y += yFactor * (rectHalfHeight);
        }

        if (anchor.x !== rectHorizontalCenter) {
            edgePoint.x = anchor.x;
        }
        if (anchor.y !== rectVerticalCenter) {
            edgePoint.y = anchor.y;
        }

        markerPoint.x = edgePoint.x + (markerRadius * Math.cos(theta));
        markerPoint.y = edgePoint.y - (markerRadius * Math.sin(theta));

        return markerPoint;
    }

    // TODO: Add pathTo method that wraps creating a connection and rendering it
});

// Initialize Pathfinder for charts
H.Chart.prototype.callbacks.push(function (chart) {
    var options = chart.options;
    if (options.pathfinder.enabled !== false) {
        this.pathfinder = new Pathfinder(this);
        this.pathfinder.update(); // First draw
    }
});
