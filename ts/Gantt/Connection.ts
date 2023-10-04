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
import type Pathfinder from './Pathfinder';
import type { PathfinderAlgorithmResultObject } from './PathfinderAlgorithms';
import type PositionObject from '../Core/Renderer/PositionObject';
import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';
import type SVGPath from '../Core/Renderer/SVG/SVGPath';

import Chart from '../Core/Chart/Chart.js';
import H from '../Core/Globals.js';
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    defined,
    error,
    merge,
    objectEach
} = U;

/* *
 *
 *  Constants
 *
 * */

const deg2rad = H.deg2rad,
    max = Math.max,
    min = Math.min;

/* *
 *
 *  Class
 *
 * */

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
    public pathfinder: Pathfinder = void 0 as any;
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
        const connection = this,
            chart = this.chart,
            styledMode = chart.styledMode,
            pathfinder = chart.pathfinder,
            animate = !chart.options.chart.forExport && animation !== false,
            anim: SVGAttributes = {};

        let pathGraphic = connection.graphics && connection.graphics.path;

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
        anim.d = path;
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
        const connection = this,
            chart = connection.fromPoint.series.chart,
            pathfinder = chart.pathfinder,
            renderer = chart.renderer,
            point = (
                type === 'start' ?
                    connection.fromPoint :
                    connection.toPoint
            ),
            anchor = point.getPathfinderAnchorPoint(options);
        let markerVector,
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
    ): (PathfinderAlgorithmResultObject) {
        const pathfinder = this.pathfinder,
            chart = this.chart,
            algorithm = pathfinder.algorithms[options.type as any];

        let chartObstacles = pathfinder.chartObstacles;

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
        const connection = this,
            fromPoint = connection.fromPoint,
            series = fromPoint.series,
            chart = series.chart,
            pathfinder = chart.pathfinder,
            attribs: SVGAttributes = {};

        let options = merge(
            chart.options.connectors, series.options.connectors,
            fromPoint.options.connectors, connection.options
        );

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
        const pathResult: PathfinderAlgorithmResultObject =
                connection.getPath(options),
            path: SVGPath = pathResult.path;

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

/* *
 *
 *  Default Export
 *
 * */

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

''; // Keeps doclets above in JS file
