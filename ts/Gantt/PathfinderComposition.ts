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

import type Chart from '../Core/Chart/Chart';
import type {
    ConnectorsMarkerOptions,
    ConnectorsOptions
} from './ConnectorsOptions';
import type { GanttDependencyOptions } from '../Series/Gantt/GanttSeriesOptions';
import type Pathfinder from './Pathfinder';
import type Point from '../Core/Series/Point';
import type PositionObject from '../Core/Renderer/PositionObject';

import ConnectorsDefaults from './ConnectorsDefaults.js';
import D from '../Core/Defaults.js';
const { setOptions } = D;
import U from '../Core/Utilities.js';
const {
    defined,
    error,
    merge,
    pushUnique
} = U;

/* *
 *
 *  Declarations
 *
 * */

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
            PointConnectOptionsObject|
            GanttDependencyOptions
        );
        connectors?: ConnectorsOptions;
    }
}

export interface PointConnectOptionsObject {
    to?: string;
}

/* *
 *
 *  Functions
 *
 * */

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
    const shapeArgs = point.shapeArgs;

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
    const bb = point.graphic && point.graphic.getBBox();
    return bb ? {
        xMin: (point.plotX as any) - bb.width / 2,
        xMax: (point.plotX as any) + bb.width / 2,
        yMin: (point.plotY as any) - bb.height / 2,
        yMax: (point.plotY as any) + bb.height / 2
    } : null;
}

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

/* *
 *
 *  Composition
 *
 * */

namespace ConnectionComposition {

    /* *
     *
     *  Constants
     *
     * */

    const composedMembers: Array<unknown> = [];

    /* *
     *
     *  Functions
     *
     * */

    /** @private */
    export function compose(
        ChartClass: typeof Chart,
        PathfinderClass: typeof Pathfinder,
        PointClass: typeof Point
    ): void {

        if (pushUnique(composedMembers, ChartClass)) {
            // Initialize Pathfinder for charts
            ChartClass.prototype.callbacks.push(function (
                chart: Chart
            ): void {
                const options = chart.options;

                if ((options.connectors as any).enabled !== false) {
                    warnLegacy(chart);
                    this.pathfinder = new PathfinderClass(this);
                    this.pathfinder.update(true); // First draw, defer render
                }
            });
        }

        if (pushUnique(composedMembers, PointClass)) {
            const pointProto = PointClass.prototype;

            pointProto.getMarkerVector = pointGetMarkerVector;
            pointProto.getPathfinderAnchorPoint = pointGetPathfinderAnchorPoint;
            pointProto.getRadiansToVector = pointGetRadiansToVector;
        }

        if (pushUnique(composedMembers, setOptions)) {
            // Set default Pathfinder options
            setOptions(ConnectorsDefaults);
        }

    }

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
    function pointGetPathfinderAnchorPoint(
        this: Point,
        markerOptions: ConnectorsMarkerOptions
    ): PositionObject {
        const bb = getPointBB(this);

        let x,
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
    }

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
    function pointGetRadiansToVector(
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
    }

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
    function pointGetMarkerVector(
        this: Point,
        radians: number,
        markerRadius: number,
        anchor: PositionObject
    ): PositionObject {
        const twoPI = Math.PI * 2.0,
            bb = getPointBB(this),
            rectWidth = (bb as any).xMax - (bb as any).xMin,
            rectHeight = (bb as any).yMax - (bb as any).yMin,
            rAtan = Math.atan2(rectHeight, rectWidth),
            rectHalfWidth = rectWidth / 2.0,
            rectHalfHeight = rectHeight / 2.0,
            rectHorizontalCenter = (bb as any).xMin + rectHalfWidth,
            rectVerticalCenter = (bb as any).yMin + rectHalfHeight,
            edgePoint = {
                x: rectHorizontalCenter,
                y: rectVerticalCenter
            };
        let theta = radians,
            tanTheta = 1,
            leftOrRightRegion = false,
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

}

/* *
 *
 *  Default Export
 *
 * */

export default ConnectionComposition;
