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

import type Axis from '../Core/Axis/Axis';
import type { ConnectorsMarkerOptions } from './ConnectorsOptions';
import type GanttPointOptions from '../Series/Gantt/GanttPointOptions';
import type PositionObject from '../Core/Renderer/PositionObject';
import type Series from '../Core/Series/Series';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import Connection from './Connection.js';
import Chart from '../Core/Chart/Chart.js';
import D from '../Core/Defaults.js';
const { defaultOptions } = D;
import H from '../Core/Globals.js';
import PathfinderComposition from './PathfinderComposition.js';
import Point from '../Core/Series/Point.js';
import U from '../Core/Utilities.js';
const {
    addEvent,
    defined,
    error,
    extend,
    merge,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Chart/ChartLike'{
    interface ChartLike {
        pathfinder?: Pathfinder;
    }
}

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        pathfinderRemoveRenderEvent?: Function;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type PathfinderTypeValue = (
            'straight'|
            'fastAvoid'|
            'simpleConnect'|
            string
        );

        interface PointConnectOptionsObject {
            to?: string;
        }
        class Pathfinder {
            public constructor(chart: Chart);
            public algorithms: Record<string, PathfinderAlgorithmFunction>;
            public chart: Chart;
            public chartObstacles: Array<any>;
            public chartObstacleMetrics: Record<string, number>;
            public connections: Array<Connection>;
            public group: SVGElement;
            public lineObstacles: Array<any>;
            public getAlgorithmStartDirection(
                markerOptions: ConnectorsMarkerOptions
            ): (boolean|undefined);
            public getChartObstacles(
                options: { algorithmMargin?: number }
            ): Array<any>;
            public getObstacleMetrics(
                obstacles: Array<any>
            ): Record<string, number>;
            public init(chart: Chart): void;
            public renderConnections(deferRender?: boolean): void;
            public update(deferRender?: boolean): void;
        }
    }
}

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

import pathfinderAlgorithms from './PathfinderAlgorithms.js';

const max = Math.max,
    min = Math.min;

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
function calculateObstacleMargin(obstacles: Array<any>): number {
    let len = obstacles.length,
        i = 0,
        j,
        obstacleDistance,
        distances = [],
        // Compute smallest distance between two rectangles
        distance = function (
            a: Record<string, number>,
            b: Record<string, number>,
            bbMargin?: number
        ): number {
            // Count the distance even if we are slightly off
            const margin = pick(bbMargin, 10),
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
            // TODO: Magic number 80
            if (obstacleDistance < 80) { // Ignore large distances
                distances.push(obstacleDistance);
            }
        }
    }
    // Ensure we always have at least one value, even in very spaceous charts
    distances.push(80);

    return max(
        Math.floor(
            distances.sort(function (a: number, b: number): number {
                return (a - b);
            })[
                // Discard first 10% of the relevant distances, and then grab
                // the smallest one.
                Math.floor(distances.length / 10)
            ] / 2 - 1 // Divide the distance by 2 and subtract 1.
        ),
        1 // 1 is the minimum margin
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
class Pathfinder {

    /* *
     *
     *  Static Functions
     *
     * */

    public static compose(
        PointClass: typeof Point
    ): void {
        PathfinderComposition.compose(
            PointClass
        );
    }

    public constructor(
        chart: Chart
    ) {
        this.init(chart);
    }

    /* *
     *
     * Properties
     *
     * */

    public chart: Chart = void 0 as any;
    public chartObstacles: Array<any> = void 0 as any;
    public chartObstacleMetrics: Record<string, number> = void 0 as any;
    public connections: Array<Connection> = void 0 as any;
    public group: SVGElement = void 0 as any;
    public lineObstacles: Array<any> = void 0 as any;

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
    public init(chart: Chart): void {
        // Initialize pathfinder with chart context
        this.chart = chart;

        // Init connection reference list
        this.connections = [];

        // Recalculate paths/obstacles on chart redraw
        addEvent(chart, 'redraw', function (): void {
            (this.pathfinder as any).update();
        });
    }

    /**
     * Update Pathfinder connections from scratch.
     *
     * @function Highcharts.Pathfinder#update
     *
     * @param {boolean} [deferRender]
     *        Whether or not to defer rendering of connections until
     *        series.afterAnimate event has fired. Used on first render.
     */
    public update(deferRender?: boolean): void {
        const chart = this.chart,
            pathfinder = this,
            oldConnections = pathfinder.connections;

        // Rebuild pathfinder connections from options
        pathfinder.connections = [];
        chart.series.forEach(function (series): void {
            if (series.visible && !series.options.isInternal) {
                series.points.forEach(function (point: Point): void {
                    const ganttPointOptions: GanttPointOptions = point.options;
                    // For Gantt series the connect could be
                    // defined as a dependency
                    if (ganttPointOptions && ganttPointOptions.dependency) {
                        ganttPointOptions.connect = ganttPointOptions
                            .dependency;
                    }
                    let to: (
                            Axis|
                            Series|
                            Point|
                            undefined
                        ),
                        connects = (
                            point.options &&
                            point.options.connect &&
                            splat(point.options.connect)
                        );

                    if (point.visible && point.isInside !== false && connects) {
                        connects.forEach(function (
                            connect: (string|Record<string, string>)
                        ): void {
                            to = chart.get(
                                typeof connect === 'string' ?
                                    connect : connect.to
                            );
                            if (
                                to instanceof Point &&
                                to.series.visible &&
                                to.visible &&
                                to.isInside !== false
                            ) {
                                // Add new connection
                                pathfinder.connections.push(
                                    new (Connection as any)(
                                        point, // from
                                        to,
                                        typeof connect === 'string' ?
                                            {} :
                                            connect
                                    )
                                );
                            }
                        });
                    }
                });
            }
        });

        // Clear connections that should not be updated, and move old info over
        // to new connections.
        for (
            let j = 0, k, found, lenOld = oldConnections.length,
                lenNew = pathfinder.connections.length;
            j < lenOld;
            ++j
        ) {
            found = false;
            const oldCon = oldConnections[j];

            for (k = 0; k < lenNew; ++k) {
                const newCon = pathfinder.connections[k];

                if (
                    (oldCon.options && oldCon.options.type) ===
                    (newCon.options && newCon.options.type) &&
                    oldCon.fromPoint === newCon.fromPoint &&
                    oldCon.toPoint === newCon.toPoint
                ) {
                    newCon.graphics = oldCon.graphics;
                    found = true;
                    break;
                }
            }
            if (!found) {
                oldCon.destroy();
            }
        }

        // Clear obstacles to force recalculation. This must be done on every
        // redraw in case positions have changed. Recalculation is handled in
        // Connection.getPath on demand.
        delete (this as Partial<this>).chartObstacles;
        delete (this as Partial<this>).lineObstacles;

        // Draw the pending connections
        pathfinder.renderConnections(deferRender);
    }

    /**
     * Draw the chart's connecting paths.
     *
     * @function Highcharts.Pathfinder#renderConnections
     *
     * @param {boolean} [deferRender]
     *        Whether or not to defer render until series animation is finished.
     *        Used on first render.
     */
    public renderConnections(
        deferRender?: boolean
    ): void {
        if (deferRender) {
            // Render after series are done animating
            this.chart.series.forEach(function (series): void {
                const render = function (): void {
                    // Find pathfinder connections belonging to this series
                    // that haven't rendered, and render them now.
                    const pathfinder = series.chart.pathfinder,
                        conns = pathfinder && pathfinder.connections || [];

                    conns.forEach(function (connection): void {
                        if (
                            connection.fromPoint &&
                            connection.fromPoint.series === series
                        ) {
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
                } else {
                    series.pathfinderRemoveRenderEvent = addEvent(
                        series, 'afterAnimate', render
                    );
                }
            });
        } else {
            // Go through connections and render them
            this.connections.forEach(function (connection): void {
                connection.render();
            });
        }
    }

    /**
     * Get obstacles for the points in the chart. Does not include connecting
     * lines from Pathfinder. Applies algorithmMargin to the obstacles.
     *
     * @function Highcharts.Pathfinder#getChartObstacles
     *
     * @param {Object} options
     *        Options for the calculation. Currenlty only
     *        options.algorithmMargin.
     *
     * @return {Array<object>}
     *         An array of calculated obstacles. Each obstacle is defined as an
     *         object with xMin, xMax, yMin and yMax properties.
     */
    public getChartObstacles(options: { algorithmMargin?: number }): Array<any> {
        let obstacles = [],
            series = this.chart.series,
            margin = pick(options.algorithmMargin, 0),
            calculatedMargin: number;

        for (let i = 0, sLen = series.length; i < sLen; ++i) {
            if (series[i].visible && !series[i].options.isInternal) {
                for (
                    let j = 0, pLen = series[i].points.length, bb, point;
                    j < pLen;
                    ++j
                ) {
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
        obstacles = obstacles.sort(function (a, b): number {
            return a.xMin - b.xMin;
        });

        // Add auto-calculated margin if the option is not defined
        if (!defined(options.algorithmMargin)) {
            calculatedMargin =
                options.algorithmMargin =
                calculateObstacleMargin(obstacles);
            obstacles.forEach(function (obstacle): void {
                obstacle.xMin -= calculatedMargin;
                obstacle.xMax += calculatedMargin;
                obstacle.yMin -= calculatedMargin;
                obstacle.yMax += calculatedMargin;
            });
        }

        return obstacles;
    }

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
     * @return {Object}
     *         The calculated metrics, as an object with maxHeight and maxWidth
     *         properties.
     */
    public getObstacleMetrics(obstacles: Array<any>): Record<string, number> {
        let maxWidth = 0,
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
    }

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
    public getAlgorithmStartDirection(
        markerOptions: ConnectorsMarkerOptions
    ): (boolean|undefined) {
        let xCenter = markerOptions.align !== 'left' &&
                        markerOptions.align !== 'right',
            yCenter = markerOptions.verticalAlign !== 'top' &&
                        markerOptions.verticalAlign !== 'bottom',
            undef;

        return xCenter ?
            (yCenter ? undef : false) : // x is centered
            (yCenter ? true : undef); // x is off-center
    }
}

interface Pathfinder {
    algorithms: Record<string, Highcharts.PathfinderAlgorithmFunction>;
}
Pathfinder.prototype.algorithms = pathfinderAlgorithms;

// Add to Highcharts namespace
H.Pathfinder = Pathfinder as any;


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


/**
 * Warn if using legacy options. Copy the options over. Note that this will
 * still break if using the legacy options in chart.update, addSeries etc.
 * @private
 */
function warnLegacy(chart: Chart): void {
    if (
        (chart.options as any).pathfinder ||
        chart.series.reduce(function (acc, series): boolean {
            if (series.options) {
                merge(
                    true,
                    (
                        series.options.connectors = series.options.connectors ||
                        {}
                    ), (series.options as any).pathfinder
                );
            }
            return acc || series.options && (series.options as any).pathfinder;
        }, false)
    ) {
        merge(
            true,
            (chart.options.connectors = chart.options.connectors || {}),
            (chart.options as any).pathfinder
        );
        error('WARNING: Pathfinder options have been renamed. ' +
            'Use "chart.connectors" or "series.connectors" instead.');
    }
}


// Initialize Pathfinder for charts
Chart.prototype.callbacks.push(function (
    chart: Chart
): void {
    const options = chart.options;

    if ((options.connectors as any).enabled !== false) {
        warnLegacy(chart);
        this.pathfinder = new Pathfinder(this);
        this.pathfinder.update(true); // First draw, defer render
    }
});

export default Pathfinder;
