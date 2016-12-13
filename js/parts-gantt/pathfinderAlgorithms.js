/**
* (c) 2016 Highsoft AS
* Author: Øystein Moseng
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';


/**
 * Get index of last obstacle before xMin. Employs a type of binary search, and
 * thus requires that obstacles are sorted by xMin value.
 *
 * @param {Array} obstacles Array of obstacles to search in.
 * @param {Number} xMin The xMin threshold.
 * @param {Number} startIx Starting index to search from. Must be within array
 *  range.
 *
 * @return {Number} result The index of the last obstacle element before xMin.
 */
function findLastObstacleBefore(obstacles, xMin, startIx) {
	var left = startIx || 0, // left limit
		right = obstacles.length - 1, // right limit
		min = xMin - 0.0000001, // Make sure we include all obstacles at xMin
		cursor,
		cmp;
	while (left <= right) {
		cursor = (right + left) >> 1;
		cmp = min - obstacles[cursor].xMin;
		if (cmp > 0) {
			left = cursor + left;
		} else if (cmp < 0) {
			right = cursor - 1;
		} else {
			return cursor;
		}
	}
	return left > 0 ? left - 1 : 0;
}

// Define the available pathfinding algorithms.
// Algorithms take up to 3 arguments: starting point, ending point, and an 
// options object.
var algorithms = {

	/**
	 * Get an SVG path from a starting coordinate to an ending coordinate.
	 * Draws a straight line.		 
	 *
	 * @param {Object} start Starting coordinate, object with x/y props.
	 * @param {Object} end Ending coordinate, object with x/y props.
	 *
	 * @return {Object} result An object with the SVG path in Array form as
	 * 	accepted by the SVG renderer, as well as an array of new obstacles 
	 *  making up this path.
	 */
	straight: function (start, end) {
		return {
			path: ['M', start.x, start.y, 'L', end.x, end.y],
			obstacles: [{ start, end }]
		};
	},

    // TODO: Implement this
	/**
	 * Find a path from a starting coordinate to an ending coordinate, taking 
	 * obstacles into consideration. Might not always find the shortest path, 
	 * but is fast, and usually good enough.
	 *
	 *  Options
	 *      - chartObstacles:   Array of chart obstacles to avoid
	 *      - lineObstacles:    Array of line obstacles to jump over
	 *
	 * @param {Object} start Starting coordinate, object with x/y props.
	 * @param {Object} end Ending coordinate, object with x/y props.
	 * @param {Object} options Options for the algorithm.
	 *
	 * @return {Object} result An object with the SVG path in Array form as
	 * 	accepted by the SVG renderer, as well as an array of new obstacles 
	 *  making up this path.
	 */
	fastAvoid: H.extend(function (start, end, options) {
		/*
			Algorithm rules/description
			- Find initial direction
			- Determine soft/hard max for each direction. If above soft max,
			  prefer to change direction ASAP. If at hard max, change 
			  immediately.
			- Move along initial direction until obstacle.
			- Change direction.
			- If hitting obstacle, first try to change length of previous line 
			  before changing direction again.
			- When changing directions, change them in the middle of the line.
			- Obstacles that envelop destination are the end point
		*/

		var segments = [],
			path = ['M', start.x, start.y, 'L', end.x, end.y];
		segments.push({
			start,
			end
		});
		return {
			path: path,
			obstacles: segments
		};
	}, {
		requiresObstacles: true
	})
};

export default algorithms;
