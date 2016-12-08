/**
* (c) 2016 Highsoft AS
* Author: Øystein Moseng
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import '../parts/Point.js';
import '../parts/Utilities.js';

var pick = H.pick,
	extend = H.extend;


/**
 * Find a path from a starting coordinate to an ending coordinate, taking
 * obstacles into consideration.
 *
 * @param {Object} start Starting coordinate, object with x/y props.
 * @param {Object} end Ending coordinate, object with x/y props.
 * @param {Array} obstacles Array of obstacle objects.
 *
 * @return {Object} result An object with the SVG path in Array form as accepted 
 * 	by the SVG renderer, as well as an array of new obstacles making up this 
 *  path.
 */
function calculatePath(start, end, obstacles) {
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
}

// Add pathfinding capabilities to Points
extend(H.Point.prototype, /** @lends Point.prototype */ {

	/**
	 * Draw a path from this point to another, avoiding collisions.
	 *
	 * @param {Object} toPoint The destination point
	 * @param {Object} options Path options, including position on point, style
	 * @param {Boolean} redraw Whether to redraw the chart after adding.
	 *   Defaults to true.
	 * @param {Boolean|Object} animation Whether to apply animation, and 
	 *	 optionally animation configuration	 
	 */
	pathTo: function (toPoint, options, redraw, animation) {
		var chart = this.series.chart,
			graphic = this.graphic,
			renderer = chart.renderer,
			oldGraphic = graphic,
			pathResult;

		options = options || {};

		if (!chart.obstacles) {
			chart.calculatePointObstacles();
		}

		// Get the actual path
		pathResult = calculatePath({
			x: this.plotX,
			y: this.plotY
		}, {
			x: toPoint.plotX,
			y: toPoint.plotY
		}, chart.obstacles);

		// Update obstacle storage with obstacles from this path
		chart.obstacles.push(pathResult.obstacles);

		// Add the actual SVG element of the path
		// First, if the point graphic is not a group, make it into one
		if (graphic.element.tagName.toLowerCase() !== 'g') {
			graphic = renderer.g('point').add(oldGraphic.parentGroup);
			oldGraphic.add(graphic);
		}
		this.connectingPathGraphic = renderer.path(pathResult.path)
			// TODO
			// Make sure this is a good class name
			.addClass('highcharts-point-connecting-path')
			// TODO
			// Figure out options-structure
			.attr({
				'stroke': options.color || '#050505',
				'stroke-width': options.strokeWidth || 1
			})
			.add(graphic);

		// Redraw (defaults to true)
		if (pick(redraw, true)) {
			chart.redraw(animation);
		}
	}
});

extend(H.Chart.prototype, /** @lends Chart.prototype */ {

	// TODO
	/**
	 * Set chart obstacles from points. Will wipe all existing obstacles.
	 */
	calculatePointObstacles: function () {
		this.obstacles = [];
	}

});


// TODO
// Wrap reflow somehow to re-update obstacles and then re-add all the lines
// NOTE: Optimize to only update obstacles when we have to??
//wrap();


// TODO
// Pick up options and add lines automatically on init
//wrap();

