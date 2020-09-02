/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Øystein Moseng, Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Connection from './Connection.js';
import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
/**
 * The default pathfinder algorithm to use for a chart. It is possible to define
 * your own algorithms by adding them to the
 * `Highcharts.Pathfinder.prototype.algorithms`
 * object before the chart has been created.
 *
 * The default algorithms are as follows:
 *
 * `straight`:      Draws a straight line between the connecting
 *                  points. Does not avoid other points when drawing.
 *
 * `simpleConnect`: Finds a path between the points using right angles
 *                  only. Takes only starting/ending points into
 *                  account, and will not avoid other points.
 *
 * `fastAvoid`:     Finds a path between the points using right angles
 *                  only. Will attempt to avoid other points, but its
 *                  focus is performance over accuracy. Works well with
 *                  less dense datasets.
 *
 * @typedef {"fastAvoid"|"simpleConnect"|"straight"|string} Highcharts.PathfinderTypeValue
 */
''; // detach doclets above
import O from '../Core/Options.js';
var defaultOptions = O.defaultOptions;
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, error = U.error, extend = U.extend, merge = U.merge, objectEach = U.objectEach, pick = U.pick, splat = U.splat;
import pathfinderAlgorithms from './PathfinderAlgorithms.js';
import '../Extensions/ArrowSymbols.js';
var deg2rad = H.deg2rad, max = Math.max, min = Math.min;
/*
 @todo:
     - Document how to write your own algorithms
     - Consider adding a Point.pathTo method that wraps creating a connection
       and rendering it
*/
// Set default Pathfinder options
extend(defaultOptions, {
    /**
     * The Pathfinder module allows you to define connections between any two
     * points, represented as lines - optionally with markers for the start
     * and/or end points. Multiple algorithms are available for calculating how
     * the connecting lines are drawn.
     *
     * Connector functionality requires Highcharts Gantt to be loaded. In Gantt
     * charts, the connectors are used to draw dependencies between tasks.
     *
     * @see [dependency](series.gantt.data.dependency)
     *
     * @sample gantt/pathfinder/demo
     *         Pathfinder connections
     *
     * @declare      Highcharts.ConnectorsOptions
     * @product      gantt
     * @optionparent connectors
     */
    connectors: {
        /**
         * Enable connectors for this chart. Requires Highcharts Gantt.
         *
         * @type      {boolean}
         * @default   true
         * @since     6.2.0
         * @apioption connectors.enabled
         */
        /**
         * Set the default dash style for this chart's connecting lines.
         *
         * @type      {string}
         * @default   solid
         * @since     6.2.0
         * @apioption connectors.dashStyle
         */
        /**
         * Set the default color for this chart's Pathfinder connecting lines.
         * Defaults to the color of the point being connected.
         *
         * @type      {Highcharts.ColorString}
         * @since     6.2.0
         * @apioption connectors.lineColor
         */
        /**
         * Set the default pathfinder margin to use, in pixels. Some Pathfinder
         * algorithms attempt to avoid obstacles, such as other points in the
         * chart. These algorithms use this margin to determine how close lines
         * can be to an obstacle. The default is to compute this automatically
         * from the size of the obstacles in the chart.
         *
         * To draw connecting lines close to existing points, set this to a low
         * number. For more space around existing points, set this number
         * higher.
         *
         * @sample gantt/pathfinder/algorithm-margin
         *         Small algorithmMargin
         *
         * @type      {number}
         * @since     6.2.0
         * @apioption connectors.algorithmMargin
         */
        /**
         * Set the default pathfinder algorithm to use for this chart. It is
         * possible to define your own algorithms by adding them to the
         * Highcharts.Pathfinder.prototype.algorithms object before the chart
         * has been created.
         *
         * The default algorithms are as follows:
         *
         * `straight`:      Draws a straight line between the connecting
         *                  points. Does not avoid other points when drawing.
         *
         * `simpleConnect`: Finds a path between the points using right angles
         *                  only. Takes only starting/ending points into
         *                  account, and will not avoid other points.
         *
         * `fastAvoid`:     Finds a path between the points using right angles
         *                  only. Will attempt to avoid other points, but its
         *                  focus is performance over accuracy. Works well with
         *                  less dense datasets.
         *
         * Default value: `straight` is used as default for most series types,
         * while `simpleConnect` is used as default for Gantt series, to show
         * dependencies between points.
         *
         * @sample gantt/pathfinder/demo
         *         Different types used
         *
         * @type    {Highcharts.PathfinderTypeValue}
         * @default undefined
         * @since   6.2.0
         */
        type: 'straight',
        /**
         * Set the default pixel width for this chart's Pathfinder connecting
         * lines.
         *
         * @since 6.2.0
         */
        lineWidth: 1,
        /**
         * Marker options for this chart's Pathfinder connectors. Note that
         * this option is overridden by the `startMarker` and `endMarker`
         * options.
         *
         * @declare Highcharts.ConnectorsMarkerOptions
         * @since   6.2.0
         */
        marker: {
            /**
             * Set the radius of the connector markers. The default is
             * automatically computed based on the algorithmMargin setting.
             *
             * Setting marker.width and marker.height will override this
             * setting.
             *
             * @type      {number}
             * @since     6.2.0
             * @apioption connectors.marker.radius
             */
            /**
             * Set the width of the connector markers. If not supplied, this
             * is inferred from the marker radius.
             *
             * @type      {number}
             * @since     6.2.0
             * @apioption connectors.marker.width
             */
            /**
             * Set the height of the connector markers. If not supplied, this
             * is inferred from the marker radius.
             *
             * @type      {number}
             * @since     6.2.0
             * @apioption connectors.marker.height
             */
            /**
             * Set the color of the connector markers. By default this is the
             * same as the connector color.
             *
             * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
             * @since     6.2.0
             * @apioption connectors.marker.color
             */
            /**
             * Set the line/border color of the connector markers. By default
             * this is the same as the marker color.
             *
             * @type      {Highcharts.ColorString}
             * @since     6.2.0
             * @apioption connectors.marker.lineColor
             */
            /**
             * Enable markers for the connectors.
             */
            enabled: false,
            /**
             * Horizontal alignment of the markers relative to the points.
             *
             * @type {Highcharts.AlignValue}
             */
            align: 'center',
            /**
             * Vertical alignment of the markers relative to the points.
             *
             * @type {Highcharts.VerticalAlignValue}
             */
            verticalAlign: 'middle',
            /**
             * Whether or not to draw the markers inside the points.
             */
            inside: false,
            /**
             * Set the line/border width of the pathfinder markers.
             */
            lineWidth: 1
        },
        /**
         * Marker options specific to the start markers for this chart's
         * Pathfinder connectors. Overrides the generic marker options.
         *
         * @declare Highcharts.ConnectorsStartMarkerOptions
         * @extends connectors.marker
         * @since   6.2.0
         */
        startMarker: {
            /**
             * Set the symbol of the connector start markers.
             */
            symbol: 'diamond'
        },
        /**
         * Marker options specific to the end markers for this chart's
         * Pathfinder connectors. Overrides the generic marker options.
         *
         * @declare Highcharts.ConnectorsEndMarkerOptions
         * @extends connectors.marker
         * @since   6.2.0
         */
        endMarker: {
            /**
             * Set the symbol of the connector end markers.
             */
            symbol: 'arrow-filled'
        }
    }
});
/**
 * Override Pathfinder connector options for a series. Requires Highcharts Gantt
 * to be loaded.
 *
 * @declare   Highcharts.SeriesConnectorsOptionsObject
 * @extends   connectors
 * @since     6.2.0
 * @excluding enabled, algorithmMargin
 * @product   gantt
 * @apioption plotOptions.series.connectors
 */
/**
 * Connect to a point. This option can be either a string, referring to the ID
 * of another point, or an object, or an array of either. If the option is an
 * array, each element defines a connection.
 *
 * @sample gantt/pathfinder/demo
 *         Different connection types
 *
 * @declare   Highcharts.XrangePointConnectorsOptionsObject
 * @type      {string|Array<string|*>|*}
 * @extends   plotOptions.series.connectors
 * @since     6.2.0
 * @excluding enabled
 * @product   gantt
 * @requires  highcharts-gantt
 * @apioption series.xrange.data.connect
 */
/**
 * The ID of the point to connect to.
 *
 * @type      {string}
 * @since     6.2.0
 * @product   gantt
 * @apioption series.xrange.data.connect.to
 */
/**
 * Get point bounding box using plotX/plotY and shapeArgs. If using
 * graphic.getBBox() directly, the bbox will be affected by animation.
 *
 * @private
 * @function
 *
 * @param {Highcharts.Point} point
 *        The point to get BB of.
 *
 * @return {Highcharts.Dictionary<number>|null}
 *         Result xMax, xMin, yMax, yMin.
 */
function getPointBB(point) {
    var shapeArgs = point.shapeArgs, bb;
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
    bb = point.graphic && point.graphic.getBBox();
    return bb ? {
        xMin: point.plotX - bb.width / 2,
        xMax: point.plotX + bb.width / 2,
        yMin: point.plotY - bb.height / 2,
        yMax: point.plotY + bb.height / 2
    } : null;
}
/**
 * Calculate margin to place around obstacles for the pathfinder in pixels.
 * Returns a minimum of 1 pixel margin.
 *
 * @private
 * @function
 *
 * @param {Array<object>} obstacles
 *        Obstacles to calculate margin from.
 *
 * @return {number}
 *         The calculated margin in pixels. At least 1.
 */
function calculateObstacleMargin(obstacles) {
    var len = obstacles.length, i = 0, j, obstacleDistance, distances = [], 
    // Compute smallest distance between two rectangles
    distance = function (a, b, bbMargin) {
        // Count the distance even if we are slightly off
        var margin = pick(bbMargin, 10), yOverlap = a.yMax + margin > b.yMin - margin &&
            a.yMin - margin < b.yMax + margin, xOverlap = a.xMax + margin > b.xMin - margin &&
            a.xMin - margin < b.xMax + margin, xDistance = yOverlap ? (a.xMin > b.xMax ? a.xMin - b.xMax : b.xMin - a.xMax) : Infinity, yDistance = xOverlap ? (a.yMin > b.yMax ? a.yMin - b.yMax : b.yMin - a.yMax) : Infinity;
        // If the rectangles collide, try recomputing with smaller margin.
        // If they collide anyway, discard the obstacle.
        if (xOverlap && yOverlap) {
            return (margin ?
                distance(a, b, Math.floor(margin / 2)) :
                Infinity);
        }
        return min(xDistance, yDistance);
    };
    // Go over all obstacles and compare them to the others.
    for (; i < len; ++i) {
        // Compare to all obstacles ahead. We will already have compared this
        // obstacle to the ones before.
        for (j = i + 1; j < len; ++j) {
            obstacleDistance = distance(obstacles[i], obstacles[j]);
            // TODO: Magic number 80
            if (obstacleDistance < 80) { // Ignore large distances
                distances.push(obstacleDistance);
            }
        }
    }
    // Ensure we always have at least one value, even in very spaceous charts
    distances.push(80);
    return max(Math.floor(distances.sort(function (a, b) {
        return (a - b);
    })[
    // Discard first 10% of the relevant distances, and then grab
    // the smallest one.
    Math.floor(distances.length / 10)] / 2 - 1 // Divide the distance by 2 and subtract 1.
    ), 1 // 1 is the minimum margin
    );
}
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The Pathfinder class.
 *
 * @private
 * @class
 * @name Highcharts.Pathfinder
 *
 * @param {Highcharts.Chart} chart
 *        The chart to operate on.
 */
var Pathfinder = /** @class */ (function () {
    function Pathfinder(chart) {
        /* *
         *
         * Properties
         *
         * */
        this.chart = void 0;
        this.chartObstacles = void 0;
        this.chartObstacleMetrics = void 0;
        this.connections = void 0;
        this.group = void 0;
        this.lineObstacles = void 0;
        this.init(chart);
    }
    /**
     * @name Highcharts.Pathfinder#algorithms
     * @type {Highcharts.Dictionary<Function>}
     */
    /**
     * Initialize the Pathfinder object.
     *
     * @function Highcharts.Pathfinder#init
     *
     * @param {Highcharts.Chart} chart
     *        The chart context.
     */
    Pathfinder.prototype.init = function (chart) {
        // Initialize pathfinder with chart context
        this.chart = chart;
        // Init connection reference list
        this.connections = [];
        // Recalculate paths/obstacles on chart redraw
        addEvent(chart, 'redraw', function () {
            this.pathfinder.update();
        });
    };
    /**
     * Update Pathfinder connections from scratch.
     *
     * @function Highcharts.Pathfinder#update
     *
     * @param {boolean} [deferRender]
     *        Whether or not to defer rendering of connections until
     *        series.afterAnimate event has fired. Used on first render.
     */
    Pathfinder.prototype.update = function (deferRender) {
        var chart = this.chart, pathfinder = this, oldConnections = pathfinder.connections;
        // Rebuild pathfinder connections from options
        pathfinder.connections = [];
        chart.series.forEach(function (series) {
            if (series.visible && !series.options.isInternal) {
                series.points.forEach(function (point) {
                    var ganttPointOptions = point.options;
                    // For Gantt series the connect could be
                    // defined as a dependency
                    if (ganttPointOptions && ganttPointOptions.dependency) {
                        ganttPointOptions.connect = ganttPointOptions.dependency;
                    }
                    var to, connects = (point.options &&
                        point.options.connect &&
                        splat(point.options.connect));
                    if (point.visible && point.isInside !== false && connects) {
                        connects.forEach(function (connect) {
                            to = chart.get(typeof connect === 'string' ?
                                connect : connect.to);
                            if (to instanceof Point &&
                                to.series.visible &&
                                to.visible &&
                                to.isInside !== false) {
                                // Add new connection
                                pathfinder.connections.push(new Connection(point, // from
                                to, typeof connect === 'string' ?
                                    {} :
                                    connect));
                            }
                        });
                    }
                });
            }
        });
        // Clear connections that should not be updated, and move old info over
        // to new connections.
        for (var j = 0, k, found, lenOld = oldConnections.length, lenNew = pathfinder.connections.length; j < lenOld; ++j) {
            found = false;
            for (k = 0; k < lenNew; ++k) {
                if (oldConnections[j].fromPoint ===
                    pathfinder.connections[k].fromPoint &&
                    oldConnections[j].toPoint ===
                        pathfinder.connections[k].toPoint) {
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
        // Connection.getPath on demand.
        delete this.chartObstacles;
        delete this.lineObstacles;
        // Draw the pending connections
        pathfinder.renderConnections(deferRender);
    };
    /**
     * Draw the chart's connecting paths.
     *
     * @function Highcharts.Pathfinder#renderConnections
     *
     * @param {boolean} [deferRender]
     *        Whether or not to defer render until series animation is finished.
     *        Used on first render.
     */
    Pathfinder.prototype.renderConnections = function (deferRender) {
        if (deferRender) {
            // Render after series are done animating
            this.chart.series.forEach(function (series) {
                var render = function () {
                    // Find pathfinder connections belonging to this series
                    // that haven't rendered, and render them now.
                    var pathfinder = series.chart.pathfinder, conns = pathfinder && pathfinder.connections || [];
                    conns.forEach(function (connection) {
                        if (connection.fromPoint &&
                            connection.fromPoint.series === series) {
                            connection.render();
                        }
                    });
                    if (series.pathfinderRemoveRenderEvent) {
                        series.pathfinderRemoveRenderEvent();
                        delete series.pathfinderRemoveRenderEvent;
                    }
                };
                if (series.options.animation === false) {
                    render();
                }
                else {
                    series.pathfinderRemoveRenderEvent = addEvent(series, 'afterAnimate', render);
                }
            });
        }
        else {
            // Go through connections and render them
            this.connections.forEach(function (connection) {
                connection.render();
            });
        }
    };
    /**
     * Get obstacles for the points in the chart. Does not include connecting
     * lines from Pathfinder. Applies algorithmMargin to the obstacles.
     *
     * @function Highcharts.Pathfinder#getChartObstacles
     *
     * @param {object} options
     *        Options for the calculation. Currenlty only
     *        options.algorithmMargin.
     *
     * @return {Array<object>}
     *         An array of calculated obstacles. Each obstacle is defined as an
     *         object with xMin, xMax, yMin and yMax properties.
     */
    Pathfinder.prototype.getChartObstacles = function (options) {
        var obstacles = [], series = this.chart.series, margin = pick(options.algorithmMargin, 0), calculatedMargin;
        for (var i = 0, sLen = series.length; i < sLen; ++i) {
            if (series[i].visible && !series[i].options.isInternal) {
                for (var j = 0, pLen = series[i].points.length, bb, point; j < pLen; ++j) {
                    point = series[i].points[j];
                    if (point.visible) {
                        bb = getPointBB(point);
                        if (bb) {
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
            obstacles.forEach(function (obstacle) {
                obstacle.xMin -= calculatedMargin;
                obstacle.xMax += calculatedMargin;
                obstacle.yMin -= calculatedMargin;
                obstacle.yMax += calculatedMargin;
            });
        }
        return obstacles;
    };
    /**
     * Utility function to get metrics for obstacles:
     * - Widest obstacle width
     * - Tallest obstacle height
     *
     * @function Highcharts.Pathfinder#getObstacleMetrics
     *
     * @param {Array<object>} obstacles
     *        An array of obstacles to inspect.
     *
     * @return {object}
     *         The calculated metrics, as an object with maxHeight and maxWidth
     *         properties.
     */
    Pathfinder.prototype.getObstacleMetrics = function (obstacles) {
        var maxWidth = 0, maxHeight = 0, width, height, i = obstacles.length;
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
    };
    /**
     * Utility to get which direction to start the pathfinding algorithm
     * (X vs Y), calculated from a set of marker options.
     *
     * @function Highcharts.Pathfinder#getAlgorithmStartDirection
     *
     * @param {Highcharts.ConnectorsMarkerOptions} markerOptions
     *        Marker options to calculate from.
     *
     * @return {boolean}
     *         Returns true for X, false for Y, and undefined for autocalculate.
     */
    Pathfinder.prototype.getAlgorithmStartDirection = function (markerOptions) {
        var xCenter = markerOptions.align !== 'left' &&
            markerOptions.align !== 'right', yCenter = markerOptions.verticalAlign !== 'top' &&
            markerOptions.verticalAlign !== 'bottom', undef;
        return xCenter ?
            (yCenter ? undef : false) : // x is centered
            (yCenter ? true : undef); // x is off-center
    };
    return Pathfinder;
}());
Pathfinder.prototype.algorithms = pathfinderAlgorithms;
// Add to Highcharts namespace
H.Pathfinder = Pathfinder;
// Add pathfinding capabilities to Points
extend(Point.prototype, /** @lends Point.prototype */ {
    /**
     * Get coordinates of anchor point for pathfinder connection.
     *
     * @private
     * @function Highcharts.Point#getPathfinderAnchorPoint
     *
     * @param {Highcharts.ConnectorsMarkerOptions} markerOptions
     *        Connection options for position on point.
     *
     * @return {Highcharts.PositionObject}
     *         An object with x/y properties for the position. Coordinates are
     *         in plot values, not relative to point.
     */
    getPathfinderAnchorPoint: function (markerOptions) {
        var bb = getPointBB(this), x, y;
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
     * Utility to get the angle from one point to another.
     *
     * @private
     * @function Highcharts.Point#getRadiansToVector
     *
     * @param {Highcharts.PositionObject} v1
     *        The first vector, as an object with x/y properties.
     *
     * @param {Highcharts.PositionObject} v2
     *        The second vector, as an object with x/y properties.
     *
     * @return {number}
     *         The angle in degrees
     */
    getRadiansToVector: function (v1, v2) {
        var box;
        if (!defined(v2)) {
            box = getPointBB(this);
            if (box) {
                v2 = {
                    x: (box.xMin + box.xMax) / 2,
                    y: (box.yMin + box.yMax) / 2
                };
            }
        }
        return Math.atan2(v2.y - v1.y, v1.x - v2.x);
    },
    /**
     * Utility to get the position of the marker, based on the path angle and
     * the marker's radius.
     *
     * @private
     * @function Highcharts.Point#getMarkerVector
     *
     * @param {number} radians
     *        The angle in radians from the point center to another vector.
     *
     * @param {number} markerRadius
     *        The radius of the marker, to calculate the additional distance to
     *        the center of the marker.
     *
     * @param {object} anchor
     *        The anchor point of the path and marker as an object with x/y
     *        properties.
     *
     * @return {object}
     *         The marker vector as an object with x/y properties.
     */
    getMarkerVector: function (radians, markerRadius, anchor) {
        var twoPI = Math.PI * 2.0, theta = radians, bb = getPointBB(this), rectWidth = bb.xMax - bb.xMin, rectHeight = bb.yMax - bb.yMin, rAtan = Math.atan2(rectHeight, rectWidth), tanTheta = 1, leftOrRightRegion = false, rectHalfWidth = rectWidth / 2.0, rectHalfHeight = rectHeight / 2.0, rectHorizontalCenter = bb.xMin + rectHalfWidth, rectVerticalCenter = bb.yMin + rectHalfHeight, edgePoint = {
            x: rectHorizontalCenter,
            y: rectVerticalCenter
        }, markerPoint = {}, xFactor = 1, yFactor = 1;
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
        }
        else if (theta > rAtan && theta <= (Math.PI - rAtan)) {
            // Top side
            yFactor = -1;
        }
        else if (theta > (Math.PI - rAtan) || theta <= -(Math.PI - rAtan)) {
            // Left side
            xFactor = -1;
            leftOrRightRegion = true;
        }
        else {
            // Bottom side
            xFactor = -1;
        }
        // Correct the edgePoint according to the placement of the marker
        if (leftOrRightRegion) {
            edgePoint.x += xFactor * (rectHalfWidth);
            edgePoint.y += yFactor * (rectHalfWidth) * tanTheta;
        }
        else {
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
});
/**
 * Warn if using legacy options. Copy the options over. Note that this will
 * still break if using the legacy options in chart.update, addSeries etc.
 * @private
 */
function warnLegacy(chart) {
    if (chart.options.pathfinder ||
        chart.series.reduce(function (acc, series) {
            if (series.options) {
                merge(true, (series.options.connectors = series.options.connectors ||
                    {}), series.options.pathfinder);
            }
            return acc || series.options && series.options.pathfinder;
        }, false)) {
        merge(true, (chart.options.connectors = chart.options.connectors || {}), chart.options.pathfinder);
        error('WARNING: Pathfinder options have been renamed. ' +
            'Use "chart.connectors" or "series.connectors" instead.');
    }
}
// Initialize Pathfinder for charts
Chart.prototype.callbacks.push(function (chart) {
    var options = chart.options;
    if (options.connectors.enabled !== false) {
        warnLegacy(chart);
        this.pathfinder = new Pathfinder(this);
        this.pathfinder.update(true); // First draw, defer render
    }
});
export default Pathfinder;
