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
 * The Connection class. Used internally to represent a connection between two
 * points.
 *
 * @private
 * @class
 * @name Highcharts.Connection
 *
 * @param {Highcharts.Point} from
 *        Connection runs from this Point.
 *
 * @param {Highcharts.Point} to
 *        Connection runs to this Point.
 *
 * @param {Highcharts.ConnectorsOptions} [options]
 *        Connection options.
 */
var Connection = /** @class */ (function () {
    function Connection(from, to, options) {
        /* *
        *
        * Properties
        *
        * */
        this.chart = void 0;
        this.fromPoint = void 0;
        this.graphics = void 0;
        this.pathfinder = void 0;
        this.toPoint = void 0;
        this.init(from, to, options);
    }
    /**
     * Initialize the Connection object. Used as constructor only.
     *
     * @function Highcharts.Connection#init
     *
     * @param {Highcharts.Point} from
     *        Connection runs from this Point.
     *
     * @param {Highcharts.Point} to
     *        Connection runs to this Point.
     *
     * @param {Highcharts.ConnectorsOptions} [options]
     *        Connection options.
     */
    Connection.prototype.init = function (from, to, options) {
        this.fromPoint = from;
        this.toPoint = to;
        this.options = options;
        this.chart = from.series.chart;
        this.pathfinder = this.chart.pathfinder;
    };
    /**
     * Add (or update) this connection's path on chart. Stores reference to the
     * created element on this.graphics.path.
     *
     * @function Highcharts.Connection#renderPath
     *
     * @param {Highcharts.SVGPathArray} path
     *        Path to render, in array format. E.g. ['M', 0, 0, 'L', 10, 10]
     *
     * @param {Highcharts.SVGAttributes} [attribs]
     *        SVG attributes for the path.
     *
     * @param {Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Animation options for the rendering.
     */
    Connection.prototype.renderPath = function (path, attribs, animation) {
        var connection = this, chart = this.chart, styledMode = chart.styledMode, pathfinder = chart.pathfinder, animate = !chart.options.chart.forExport && animation !== false, pathGraphic = connection.graphics && connection.graphics.path, anim;
        // Add the SVG element of the pathfinder group if it doesn't exist
        if (!pathfinder.group) {
            pathfinder.group = chart.renderer.g()
                .addClass('highcharts-pathfinder-group')
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
                .add(pathfinder.group);
            if (!styledMode) {
                pathGraphic.attr({
                    opacity: 0
                });
            }
        }
        // Set path attribs and animate to the new path
        pathGraphic.attr(attribs);
        anim = { d: path };
        if (!styledMode) {
            anim.opacity = 1;
        }
        pathGraphic[animate ? 'animate' : 'attr'](anim, animation);
        // Store reference on connection
        this.graphics = this.graphics || {};
        this.graphics.path = pathGraphic;
    };
    /**
     * Calculate and add marker graphics for connection to the chart. The
     * created/updated elements are stored on this.graphics.start and
     * this.graphics.end.
     *
     * @function Highcharts.Connection#addMarker
     *
     * @param {string} type
     *        Marker type, either 'start' or 'end'.
     *
     * @param {Highcharts.ConnectorsMarkerOptions} options
     *        All options for this marker. Not calculated or merged with other
     *        options.
     *
     * @param {Highcharts.SVGPathArray} path
     *        Connection path in array format. This is used to calculate the
     *        rotation angle of the markers.
     */
    Connection.prototype.addMarker = function (type, options, path) {
        var connection = this, chart = connection.fromPoint.series.chart, pathfinder = chart.pathfinder, renderer = chart.renderer, point = (type === 'start' ?
            connection.fromPoint :
            connection.toPoint), anchor = point.getPathfinderAnchorPoint(options), markerVector, radians, rotation, box, width, height, pathVector, segment;
        if (!options.enabled) {
            return;
        }
        // Last vector before start/end of path, used to get angle
        if (type === 'start') {
            segment = path[1];
        }
        else { // 'end'
            segment = path[path.length - 2];
        }
        if (segment && segment[0] === 'M' || segment[0] === 'L') {
            pathVector = {
                x: segment[1],
                y: segment[2]
            };
            // Get angle between pathVector and anchor point and use it to
            // create marker position.
            radians = point.getRadiansToVector(pathVector, anchor);
            markerVector = point.getMarkerVector(radians, options.radius, anchor);
            // Rotation of marker is calculated from angle between pathVector
            // and markerVector.
            // (Note:
            //  Used to recalculate radians between markerVector and pathVector,
            //  but this should be the same as between pathVector and anchor.)
            rotation = -radians / deg2rad;
            if (options.width && options.height) {
                width = options.width;
                height = options.height;
            }
            else {
                width = height = options.radius * 2;
            }
            // Add graphics object if it does not exist
            connection.graphics = connection.graphics || {};
            box = {
                x: markerVector.x - (width / 2),
                y: markerVector.y - (height / 2),
                width: width,
                height: height,
                rotation: rotation,
                rotationOriginX: markerVector.x,
                rotationOriginY: markerVector.y
            };
            if (!connection.graphics[type]) {
                // Create new marker element
                connection.graphics[type] = renderer
                    .symbol(options.symbol)
                    .addClass('highcharts-point-connecting-path-' + type + '-marker')
                    .attr(box)
                    .add(pathfinder.group);
                if (!renderer.styledMode) {
                    connection.graphics[type].attr({
                        fill: options.color || connection.fromPoint.color,
                        stroke: options.lineColor,
                        'stroke-width': options.lineWidth,
                        opacity: 0
                    })
                        .animate({
                        opacity: 1
                    }, point.series.options.animation);
                }
            }
            else {
                connection.graphics[type].animate(box);
            }
        }
    };
    /**
     * Calculate and return connection path.
     * Note: Recalculates chart obstacles on demand if they aren't calculated.
     *
     * @function Highcharts.Connection#getPath
     *
     * @param {Highcharts.ConnectorsOptions} options
     *        Connector options. Not calculated or merged with other options.
     *
     * @return {object|undefined}
     *         Calculated SVG path data in array format.
     */
    Connection.prototype.getPath = function (options) {
        var pathfinder = this.pathfinder, chart = this.chart, algorithm = pathfinder.algorithms[options.type], chartObstacles = pathfinder.chartObstacles;
        if (typeof algorithm !== 'function') {
            error('"' + options.type + '" is not a Pathfinder algorithm.');
            return {
                path: [],
                obstacles: []
            };
        }
        // This function calculates obstacles on demand if they don't exist
        if (algorithm.requiresObstacles && !chartObstacles) {
            chartObstacles =
                pathfinder.chartObstacles =
                    pathfinder.getChartObstacles(options);
            // If the algorithmMargin was computed, store the result in default
            // options.
            chart.options.connectors.algorithmMargin =
                options.algorithmMargin;
            // Cache some metrics too
            pathfinder.chartObstacleMetrics =
                pathfinder.getObstacleMetrics(chartObstacles);
        }
        // Get the SVG path
        return algorithm(
        // From
        this.fromPoint.getPathfinderAnchorPoint(options.startMarker), 
        // To
        this.toPoint.getPathfinderAnchorPoint(options.endMarker), merge({
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
            startDirectionX: pathfinder.getAlgorithmStartDirection(options.startMarker)
        }, options));
    };
    /**
     * (re)Calculate and (re)draw the connection.
     *
     * @function Highcharts.Connection#render
     */
    Connection.prototype.render = function () {
        var connection = this, fromPoint = connection.fromPoint, series = fromPoint.series, chart = series.chart, pathfinder = chart.pathfinder, pathResult, path, options = merge(chart.options.connectors, series.options.connectors, fromPoint.options.connectors, connection.options), attribs = {};
        // Set path attribs
        if (!chart.styledMode) {
            attribs.stroke = options.lineColor || fromPoint.color;
            attribs['stroke-width'] = options.lineWidth;
            if (options.dashStyle) {
                attribs.dashstyle = options.dashStyle;
            }
        }
        attribs['class'] = // eslint-disable-line dot-notation
            'highcharts-point-connecting-path ' +
                'highcharts-color-' + fromPoint.colorIndex;
        options = merge(attribs, options);
        // Set common marker options
        if (!defined(options.marker.radius)) {
            options.marker.radius = min(max(Math.ceil((options.algorithmMargin || 8) / 2) - 1, 1), 5);
        }
        // Get the path
        pathResult = connection.getPath(options);
        path = pathResult.path;
        // Always update obstacle storage with obstacles from this path.
        // We don't know if future calls will need this for their algorithm.
        if (pathResult.obstacles) {
            pathfinder.lineObstacles =
                pathfinder.lineObstacles || [];
            pathfinder.lineObstacles =
                pathfinder.lineObstacles.concat(pathResult.obstacles);
        }
        // Add the calculated path to the pathfinder group
        connection.renderPath(path, attribs, series.options.animation);
        // Render the markers
        connection.addMarker('start', merge(options.marker, options.startMarker), path);
        connection.addMarker('end', merge(options.marker, options.endMarker), path);
    };
    /**
     * Destroy connection by destroying the added graphics elements.
     *
     * @function Highcharts.Connection#destroy
     */
    Connection.prototype.destroy = function () {
        if (this.graphics) {
            objectEach(this.graphics, function (val) {
                val.destroy();
            });
            delete this.graphics;
        }
    };
    return Connection;
}());
// Add to Highcharts namespace
H.Connection = Connection;
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
        }, xFactor = 1, yFactor = 1;
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
        return {
            x: edgePoint.x + (markerRadius * Math.cos(theta)),
            y: edgePoint.y - (markerRadius * Math.sin(theta))
        };
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
export default Connection;
