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

var extend = H.extend,
	each = H.each,
	addEvent = H.addEvent;


// TODO:
// Check dynamics, including hiding/adding/removing/updating series/points etc.


// Set default Pathfinder options
extend(H.defaultOptions, {
	pathfinder: {
		// enabled: true
		type: 'straight'
	}
});

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

	// Define the available pathfinding algorithms.
	// Algorithms take up to 4 arguments: starting point, ending point, an 
	// array of obstacle objects, and a reference to the chart.
	algorithms: {

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

		/**
		 * Find a path from a starting coordinate to an ending coordinate,
		 * taking obstacles into consideration.
		 *
		 * @param {Object} start Starting coordinate, object with x/y props.
		 * @param {Object} end Ending coordinate, object with x/y props.
		 * @param {Array} obstacles Array of obstacle objects.
		 *
		 * @return {Object} result An object with the SVG path in Array form as
		 * 	accepted by the SVG renderer, as well as an array of new obstacles 
		 *  making up this path.
		 */
		avoid: extend(function (start, end, obstacles) {
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

	},

	// TODO
	/**
	 * Set chart obstacles from points. Will wipe all existing obstacles.
	 */
	calculatePointObstacles: function () {
		this.obstacles = [];
	},

	/**
	 * Initialize the Pathfinder object.	 
	 *
	 * @param {Object} chart The chart context.
	 */
	init: function (chart) {	
		// Initialize pathfinder with chart context
		this.chart = chart;

		// Init path reference list
		this.paths = [];

		// Recalculate paths/obstacles on chart redraw
		addEvent(chart, 'redraw', function () {
			if (this.pathfinder.isDirty) {
				this.pathfinder.update(); // Go through options structure
			} else {
				this.pathfinder.renderConnections(); // Just render
			}
		});

		// Set pathfinder to dirty for dynamic events
		each([
			'update',
			'addSeries',
			'removeSeries'
		], function (e) {
			addEvent(chart, e, function () {
				this.pathfinder.isDirty = true;
			});
		});
		each(chart.series, function (series) {
			each([
				'update',
				'updatedData'
			], function (e) {
				addEvent(series, e, function () {
					this.chart.pathfinder.isDirty = true;
				});
			});
		});
	},

	/**
	 * Update Pathfinder connections from scratch.
	 */
	update: function () {
		var chart = this.chart,
			i = chart.series.length,
			pathfinder = this;

		// Find the points and their mate and cache this information
		pathfinder.connections = [];
		while (i--) {
			each(chart.series[i].points, function (point) {
				var connect = point.options.connect,
					to;
				if (connect) {
					to = chart.get(typeof connect === 'string' ? 
						connect : 
						connect.to
					);
					// We store start/end/options for each connection to be
					// picked up in drawConnections
					pathfinder.connections.push([
						point, 
						to,
						typeof connect === 'string' ? {} : connect
					]);
				}
			});
		}
		pathfinder.isDirty = false;

		// Draw the pending connections
		pathfinder.renderConnections();		
	},

	/**
	 * Draw the chart's connecting paths.
	 */
	renderConnections: function () {
		// Clear obstacles to force recalculation. This must be done on every
		// redraw in case positions have changed.
		// This is handled in Point.pathTo on demand.
		delete this.obstacles;

		// Clear existing connections
		each(this.paths, function (path) {
			path.destroy();
		});
		this.paths = [];

		// Draw connections. Arrays are faster than objects, thus the clumsy
		// syntax. Mapping is [startPoint, endPoint, options].
		each(this.connections, function (connection) {
			connection[0].pathTo(connection[1], connection[2]);
		});
	}
};


// Add pathfinding capabilities to Points
extend(H.Point.prototype, /** @lends Point.prototype */ {
	/**
	 * Draw a path from this point to another, avoiding collisions.
	 *
	 * @param {Object} toPoint The destination point
	 * @param {Object} options Path options, including position on point, style
	 */
	pathTo: function (toPoint, options) {
		var chart = this.series.chart,
			pathfinder = chart.pathfinder,
			obstacles = pathfinder.obstacles,
			graphic = this.graphic,
			renderer = chart.renderer,
			oldGraphic = graphic,
			pathResult,
			algorithm;

		options = options || {};
		algorithm = pathfinder.algorithms[
			options.type || chart.options.pathfinder.type
		];

		if (algorithm.requiresObstacles && !obstacles) {
			pathfinder.calculatePointObstacles();
		}

		// Get the actual path
		pathResult = algorithm({
			x: this.plotX,
			y: this.plotY
		}, {
			x: toPoint.plotX,
			y: toPoint.plotY
		}, obstacles, chart); // Pass in obstacles/chart always, doesn't matter

		// Always update obstacle storage with obstacles from this path.
		// We don't know if future pathTo calls will need this for their 
		// algorithm.
		if (pathResult.obstacles) {
			pathfinder.obstacles = obstacles || [];
			pathfinder.obstacles.push(pathResult.obstacles);
		}

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
		pathfinder.paths.push(this.connectingPathGraphic);
	}
});


// Initialize Pathfinder for charts
H.Chart.prototype.callbacks.push(function (chart) {
	var options = chart.options;
	if (options.pathfinder.enabled !== false) {
		this.pathfinder = new Pathfinder(this);
		this.pathfinder.update(); // First draw
	}
});
