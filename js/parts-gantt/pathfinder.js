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
	addEvent = H.addEvent,
	merge = H.merge;


// TODO:
// Check dynamics, including hiding/adding/removing/updating series/points etc.
// Symbols for markers


// Set default Pathfinder options
extend(H.defaultOptions, {
	pathfinder: {
		// enabled: true
		type: 'straight',
		startMarker: {
			align: 'center',
			verticalAlign: 'middle'
		},
		endMarker: {
			align: 'center',
			verticalAlign: 'middle'
		},
		lineWidth: 1
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
	 * Get chart obstacles from points. Does not include paths from Pathfinder.
	 *
	 * @return {Object} result The calculated obstacles.
	 */
	getChartObstacles: function () {		
		return [];
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
	 * Get coordinates of anchor point for pathfinder connection.
	 *
	 * @param {Object} options Connection options for position on point
	 * @param {Boolean} endPoint Use options for end point instead of start
	 *
	 * @return {Object} result An object with x/y properties for the position.
	 * 	Coordinates are in plot values, not relative to point.
	 */
	getPathfinderAnchorPoint: function (options, endPoint) {
		var bb = this.graphic.getBBox(),
			chart = this.series.chart,
			marker = endPoint ? 'endMarker' : 'startMarker',
			markerOptions = options[marker] || chart.options.pathfinder[marker],
			xFactor, // Make Simon Cowell proud
			yFactor;

		switch (markerOptions.align) {
		case 'right':
			xFactor = 2;
			break;
		case 'left':
			xFactor = 0;
			break;
		default:
			xFactor = 1;
		}

		switch (markerOptions.verticalAlign) {
		case 'top':
			yFactor = 0;
			break;
		case 'bottom':
			yFactor = 2;
			break;
		default:
			yFactor = 1;
		}

		// Note: Should we cache this?
		return {
			x: bb.x + bb.width / 2 * xFactor,
			y: bb.y + bb.height / 2 * yFactor
		};
	},

	/**
	 * Draw a path from this point to another, avoiding collisions.
	 *
	 * @param {Object} toPoint The destination point
	 * @param {Object} options Path options, including position on point, style
	 */
	pathTo: function (toPoint, opts) {
		var chart = this.series.chart,
			pathfinder = chart.pathfinder,
			defaultOptions = chart.options.pathfinder,
			obstacles = pathfinder.obstacles,
			renderer = chart.renderer,
			pathResult,
			attribs,
			options = merge(defaultOptions, opts),
			algorithm = pathfinder.algorithms[options.type];

		// This function calculates obstacles on demand if they don't exist
		if (algorithm.requiresObstacles && !obstacles) {
			obstacles = pathfinder.obstacles = pathfinder.getChartObstacles();
		}

		// Get the SVG path
		pathResult = algorithm(
			this.getPathfinderAnchorPoint(options),
			toPoint.getPathfinderAnchorPoint(options, true),
			obstacles,
			chart
		); // Pass in obstacles/chart always, doesn't matter

		// Always update obstacle storage with obstacles from this path.
		// We don't know if future pathTo calls will need this for their 
		// algorithm.
		if (pathResult.obstacles) {
			pathfinder.obstacles = obstacles || [];
			pathfinder.obstacles.push(pathResult.obstacles);
		}

		// Add the SVG element of the path
		if (!pathfinder.group) {
			pathfinder.group = renderer.g()
				.addClass('highcharts-pathfinder')
				.add(this.series.group);
		}
		attribs = {
			stroke: options.color || this.color,
			'stroke-width': options.lineWidth
		};
		if (options.dashStyle) {
			attribs.dashstyle = options.dashStyle;
		}
		this.connectingPathGraphic = renderer.path(pathResult.path)
			.addClass('highcharts-point-connecting-path')
			.attr(attribs)
			.add(pathfinder.group);

		// Add to internal list of paths for later destroying/referencing
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
