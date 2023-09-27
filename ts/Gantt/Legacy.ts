/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Øystein Moseng, Lars A. V. Cabrera, Jon Arild Nygard
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

import U from '../Core/Utilities.js';
const {
    error,
    merge,
    pick
} = U;

/* *
 *
 *  Constants
 *
 * */

const max = Math.max,
    min = Math.min;

/* *
 *
 *  Functions
 *
 * */

/**
 * Calculate margin to place around obstacles for the pathfinder in pixels.
 * Returns a minimum of 1 pixel margin.
 *
 * @deprecated
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
    const distances = [],
        len = obstacles.length;

    let obstacleDistance;

    // Go over all obstacles and compare them to the others.
    for (let i = 0; i < len; ++i) {
        // Compare to all obstacles ahead. We will already have compared this
        // obstacle to the ones before.
        for (let j = i + 1; j < len; ++j) {
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
            distances.sort((a: number, b: number): number => (a - b))[
                // Discard first 10% of the relevant distances, and then grab
                // the smallest one.
                Math.floor(distances.length / 10)
            ] / 2 - 1 // Divide the distance by 2 and subtract 1.
        ),
        1 // 1 is the minimum margin
    );
}

/**
 * Compute smallest distance between two rectangles
 * @deprecated
 * @private
 */
function distance(
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
}

/**
 * Warn if using legacy options. Copy the options over. Note that this will
 * still break if using the legacy options in chart.update, addSeries etc.
 * @deprecated
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
 *  Default Export
 *
 * */

/**
 * Contains detached legacy code not used anymore after tree shaking.
 * @deprecated
 */
const legacy = {
    calculateObstacleMargin,
    distance,
    warnLegacy
};

export default legacy;
