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

/* *
 *
 *  Imports
 *
 * */

import type AnimationOptions from '../Core/Animation/AnimationOptions';
import type {
    ConnectorsMarkerOptions,
    ConnectorsOptions
} from './ConnectorsOptions';
import type { GanttDependencyOptions } from '../Series/Gantt/GanttSeriesOptions';
import type PositionObject from '../Core/Renderer/PositionObject';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import Chart from '../Core/Chart/Chart.js';
import ConnectorsDefaults from './ConnectorsDefaults.js';
import D from '../Core/Defaults.js';
const { defaultOptions } = D;
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    defined,
    error,
    extend,
    merge,
    objectEach
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options'{
    interface Options {
        connectors?: ConnectorsOptions;
    }
}

declare module '../Core/Series/PointLike' {
    interface PointLike {
        getMarkerVector(
            radians: number,
            markerRadius: number,
            anchor: PositionObject
        ): PositionObject;
        getPathfinderAnchorPoint(
            markerOptions: ConnectorsMarkerOptions
        ): PositionObject;
        getRadiansToVector(v1: PositionObject, v2: PositionObject): number;
    }
}

declare module '../Core/Series/PointOptions' {
    interface PointOptions {
        connect?: (
            Highcharts.PointConnectOptionsObject|
            GanttDependencyOptions
        );
        connectors?: ConnectorsOptions;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        connectors?: ConnectorsOptions;
    }
}

/* *
 *
 *  Constants
 *
 * */

const deg2rad = H.deg2rad,
    max = Math.max,
    min = Math.min;

/*
 @todo:
     - Document how to write your own algorithms
     - Consider adding a Point.pathTo method that wraps creating a connection
       and rendering it
*/

// Set default Pathfinder options
extend(defaultOptions, ConnectorsDefaults);

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
function getPointBB(point: Point): (Record<string, number>|null) {
    let shapeArgs = point.shapeArgs,
        bb;

    // Prefer using shapeArgs (columns)
    if (shapeArgs) {
        return {
            xMin: shapeArgs.x || 0,
            xMax: (shapeArgs.x || 0) + (shapeArgs.width || 0),
            yMin: shapeArgs.y || 0,
            yMax: (shapeArgs.y || 0) + (shapeArgs.height || 0)
        };
    }

    // Otherwise use plotX/plotY and bb
    bb = point.graphic && point.graphic.getBBox();
    return bb ? {
        xMin: (point.plotX as any) - bb.width / 2,
        xMax: (point.plotX as any) + bb.width / 2,
        yMin: (point.plotY as any) - bb.height / 2,
        yMax: (point.plotY as any) + bb.height / 2
    } : null;
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
class Connection {
    public constructor(
        from: Point,
        to: Point,
        options?: ConnectorsOptions
    ) {
        this.init(from, to, options);
    }

    /* *
    *
    * Properties
    *
    * */
    public chart: Chart = void 0 as any;
    public fromPoint: Point = void 0 as any;
    public graphics: Record<string, SVGElement> = void 0 as any;
    public options?: ConnectorsOptions;
    public pathfinder: Highcharts.Pathfinder = void 0 as any;
    public toPoint: Point = void 0 as any;

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
    public init(
        from: Point,
        to: Point,
        options?: ConnectorsOptions
    ): void {
        this.fromPoint = from;
        this.toPoint = to;
        this.options = options;
        this.chart = from.series.chart;
        this.pathfinder = this.chart.pathfinder as any;
    }

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
    public renderPath(
        path: SVGPath,
        attribs?: SVGAttributes,
        animation?: (boolean|DeepPartial<AnimationOptions>)
    ): void {
        let connection = this,
            chart = this.chart,
            styledMode = chart.styledMode,
            pathfinder = chart.pathfinder,
            animate = !chart.options.chart.forExport && animation !== false,
            pathGraphic = connection.graphics && connection.graphics.path,
            anim: SVGAttributes;

        // Add the SVG element of the pathfinder group if it doesn't exist
        if (!(pathfinder as any).group) {
            (pathfinder as any).group = chart.renderer.g()
                .addClass('highcharts-pathfinder-group')
                .attr({ zIndex: -1 })
                .add(chart.seriesGroup);
        }

        // Shift the group to compensate for plot area.
        // Note: Do this always (even when redrawing a path) to avoid issues
        // when updating chart in a way that changes plot metrics.
        (pathfinder as any).group.translate(chart.plotLeft, chart.plotTop);

        // Create path if does not exist
        if (!(pathGraphic && pathGraphic.renderer)) {
            pathGraphic = chart.renderer.path()
                .add((pathfinder as any).group);
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
        pathGraphic[animate ? 'animate' : 'attr'](anim, animation as any);

        // Store reference on connection
        this.graphics = this.graphics || {};
        this.graphics.path = pathGraphic;
    }

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
    public addMarker(
        type: string,
        options: ConnectorsMarkerOptions,
        path: SVGPath
    ): void {
        let connection = this,
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
            box,
            width,
            height,
            pathVector: PositionObject,
            segment: SVGPath.Segment;


        if (!options.enabled) {
            return;
        }

        // Last vector before start/end of path, used to get angle
        if (type === 'start') {
            segment = path[1];
        } else { // 'end'
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
            markerVector = point.getMarkerVector(
                radians,
                options.radius as any,
                anchor
            );

            // Rotation of marker is calculated from angle between pathVector
            // and markerVector.
            // (Note:
            //  Used to recalculate radians between markerVector and pathVector,
            //  but this should be the same as between pathVector and anchor.)
            rotation = -radians / deg2rad;

            if (options.width && options.height) {
                width = options.width;
                height = options.height;
            } else {
                width = height = (options.radius as any) * 2;
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
                    .symbol(options.symbol as any)
                    .addClass(
                        'highcharts-point-connecting-path-' + type + '-marker' +
                        ' highcharts-color-' + this.fromPoint.colorIndex
                    )
                    .attr(box)
                    .add((pathfinder as any).group);

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

            } else {
                connection.graphics[type].animate(box);
            }
        }
    }

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
    public getPath(
        options: ConnectorsOptions
    ): (Highcharts.PathfinderAlgorithmResultObject) {
        let pathfinder = this.pathfinder,
            chart = this.chart,
            algorithm = pathfinder.algorithms[options.type as any],
            chartObstacles = pathfinder.chartObstacles;

        if (typeof algorithm !== 'function') {
            error(
                '"' + options.type + '" is not a Pathfinder algorithm.'
            );
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
            (chart.options.connectors as any).algorithmMargin =
                options.algorithmMargin;

            // Cache some metrics too
            pathfinder.chartObstacleMetrics =
                pathfinder.getObstacleMetrics(chartObstacles);
        }

        // Get the SVG path
        return algorithm(
            // From
            this.fromPoint.getPathfinderAnchorPoint(options.startMarker as any),
            // To
            this.toPoint.getPathfinderAnchorPoint(options.endMarker as any),
            merge({
                chartObstacles: chartObstacles,
                lineObstacles: pathfinder.lineObstacles || [],
                obstacleMetrics: pathfinder.chartObstacleMetrics as any,
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
                    options.startMarker as any
                )
            }, options)
        );
    }

    /**
     * (re)Calculate and (re)draw the connection.
     *
     * @function Highcharts.Connection#render
     */
    public render(): void {
        let connection = this,
            fromPoint = connection.fromPoint,
            series = fromPoint.series,
            chart = series.chart,
            pathfinder = chart.pathfinder,
            pathResult: Highcharts.PathfinderAlgorithmResultObject,
            path: SVGPath,
            options = merge(
                chart.options.connectors, series.options.connectors,
                fromPoint.options.connectors, connection.options
            ),
            attribs: SVGAttributes = {};

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
        if (!defined((options.marker as any).radius)) {
            (options.marker as any).radius = min(max(
                Math.ceil((options.algorithmMargin || 8) / 2) - 1, 1
            ), 5);
        }
        // Get the path
        pathResult = connection.getPath(options);
        path = pathResult.path;

        // Always update obstacle storage with obstacles from this path.
        // We don't know if future calls will need this for their algorithm.
        if (pathResult.obstacles) {
            (pathfinder as any).lineObstacles =
                (pathfinder as any).lineObstacles || [];
            (pathfinder as any).lineObstacles =
                (pathfinder as any).lineObstacles.concat(pathResult.obstacles);
        }

        // Add the calculated path to the pathfinder group
        connection.renderPath(path, attribs, series.options.animation);

        // Render the markers
        connection.addMarker(
            'start',
            merge(options.marker, options.startMarker),
            path
        );
        connection.addMarker(
            'end',
            merge(options.marker, options.endMarker),
            path
        );
    }

    /**
     * Destroy connection by destroying the added graphics elements.
     *
     * @function Highcharts.Connection#destroy
     */
    public destroy(): void {
        if (this.graphics) {
            objectEach(this.graphics, function (
                val: SVGElement
            ): void {
                val.destroy();
            });
            delete (this as Partial<this>).graphics;
        }
    }
}


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
    getPathfinderAnchorPoint: function (
        this: Point,
        markerOptions: ConnectorsMarkerOptions
    ): PositionObject {
        let bb = getPointBB(this),
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
            x: x ? (bb as any)[x] : ((bb as any).xMin + (bb as any).xMax) / 2,
            y: y ? (bb as any)[y] : ((bb as any).yMin + (bb as any).yMax) / 2
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
    getRadiansToVector: function (
        this: Point,
        v1: PositionObject,
        v2: PositionObject
    ): number {
        let box: (Record<string, number>|null);

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
     * @param {Object} anchor
     *        The anchor point of the path and marker as an object with x/y
     *        properties.
     *
     * @return {Object}
     *         The marker vector as an object with x/y properties.
     */
    getMarkerVector: function (
        this: Point,
        radians: number,
        markerRadius: number,
        anchor: PositionObject
    ): PositionObject {
        let twoPI = Math.PI * 2.0,
            theta = radians,
            bb = getPointBB(this),
            rectWidth = (bb as any).xMax - (bb as any).xMin,
            rectHeight = (bb as any).yMax - (bb as any).yMin,
            rAtan = Math.atan2(rectHeight, rectWidth),
            tanTheta = 1,
            leftOrRightRegion = false,
            rectHalfWidth = rectWidth / 2.0,
            rectHalfHeight = rectHeight / 2.0,
            rectHorizontalCenter = (bb as any).xMin + rectHalfWidth,
            rectVerticalCenter = (bb as any).yMin + rectHalfHeight,
            edgePoint = {
                x: rectHorizontalCenter,
                y: rectVerticalCenter
            },
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

        return {
            x: edgePoint.x + (markerRadius * Math.cos(theta)),
            y: edgePoint.y - (markerRadius * Math.sin(theta))
        };
    }
});


export default Connection;

/* *
 *
 *  API Declarations
 *
 * */

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
