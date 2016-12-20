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
import pathfinderAlgorithms from 'pathfinderAlgorithms.js';

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
		// enabled: true,
		// dashStyle: 'solid',
		// color: point.color,
		type: 'straight',
		// TODO
		// start and end marker symbols should be disabled by default
		startMarker: {
			symbol: 'circle',
			align: 'center',
			verticalAlign: 'middle'
		},
		endMarker: {
			symbol: 'diamond',
			align: 'center',
			verticalAlign: 'middle'
		},
		lineWidth: 1,
		algorithmMargin: 10
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

	algorithms: pathfinderAlgorithms,

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
						connect : connect.to
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

		// Clear dirty flag for now
		pathfinder.isDirty = false;

		// Draw the pending connections
		pathfinder.renderConnections();
	},

	/**
	 * Draw the chart's connecting paths.
	 */
	renderConnections: function () {
		// Clear existing connections
		var i = this.paths.length;
		while (i--) {
			this.paths[i].destroy();
		}
		this.paths = [];

		// Clear obstacles to force recalculation. This must be done on every
		// redraw in case positions have changed. This is handled in 
		// Point.pathTo on demand.
		delete this.chartObstacles;
		delete this.lineObstacles;

		// Draw connections. Arrays are faster than objects, thus the clumsy
		// syntax. Mapping is [startPoint, endPoint, options].
		each(this.connections, function (connection) {
			connection[0].pathTo(connection[1], connection[2]);
		});
	},

	/**
	 * Get chart obstacles from points. Does not include connecting lines from 
	 * Pathfinder. Applies algorithmMargin to the obstacles.
	 *
	 * @param {Object} options Options for the calculation.
	 *
	 * @return {Object} result The calculated obstacles.
	 */
	getChartObstacles: function (options) {
		var obstacles = [],
			series = this.chart.series,
			margin = options.algorithmMargin,
			bb,
			i,
			j;
		i = series.length;
		while (i--) {
			j = series[i].points.length;
			while (j--) {
				bb = series[i].points[j].graphic.getBBox();
				obstacles.push({
					xMin: bb.x - margin,
					xMax: bb.x + bb.width + margin,
					yMin: bb.y - margin,
					yMax: bb.y + bb.height + margin
				});
			}
		}
		// Sort obstacles by xMin before returning, for optimization
		return obstacles.sort(function (a, b) {
			return a.xMin - b.xMin;
		});
	},

	/**
	 * Get metrics for obstacles.
	 *	- Widest obstacle width
	 *	- Tallest obstacle height
	 *
	 * @param {Object} obstacles Options for the calculation.
	 *
	 * @return {Object} result The calculated metrics.
	 */
	getObstacleMetrics: function (obstacles) {
		var maxWidth = 0,
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
};


// Add pathfinding capabilities to Points
extend(H.Point.prototype, /** @lends Point.prototype */ {

	/**
	 * Get coordinates of anchor point for pathfinder connection.
	 *
	 * @param {Object} markerOptions Connection options for position on point
	 *
	 * @return {Object} result An object with x/y properties for the position.
	 * 	Coordinates are in plot values, not relative to point.
	 */
	getPathfinderAnchorPoint: function (markerOptions) {
		var bb = this.graphic.getBBox(),
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
			chartObstacles = pathfinder.chartObstacles,
			lineObstacles = pathfinder.lineObstacles,
			renderer = chart.renderer,
			pathGraphic,
			startMarker,
			endMarker,
			pathResult,
			attribs,
			options = merge(defaultOptions, opts),
			algorithm = pathfinder.algorithms[options.type];

		// This function calculates obstacles on demand if they don't exist
		if (algorithm.requiresObstacles && !chartObstacles) {
			chartObstacles = 
				pathfinder.chartObstacles = 
				pathfinder.getChartObstacles(options);
			
			// Cache some metrics too
			pathfinder.chartObstacleMetrics = 
				pathfinder.getObstacleMetrics(chartObstacles);
		}

		// Get the SVG path
		pathResult = algorithm(
			this.getPathfinderAnchorPoint(options.startMarker),
			toPoint.getPathfinderAnchorPoint(options.endMarker),
			merge({
				chartObstacles: chartObstacles,
				lineObstacles: lineObstacles || [],
				obstacleMetrics: pathfinder.chartObstacleMetrics,
				hardBounds: {
					// TODO
				},
				obstacleOptions: {
					margin: options.algorithmMargin
				}
			}, options)
		);

		// Always update obstacle storage with obstacles from this path.
		// We don't know if future pathTo calls will need this for their
		// algorithm.
		if (pathResult.obstacles) {
			pathfinder.lineObstacles = lineObstacles || [];
			pathfinder.lineObstacles = 
				pathfinder.lineObstacles.concat(pathResult.obstacles);
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

		pathGraphic = renderer.path(pathResult.path)
			.addClass('highcharts-point-connecting-path')
			.attr(attribs)
			.add(pathfinder.group);
			//symbol, x, y, width, height, options
		startMarker = renderer.symbol(
			options.startMarker.symbol,
			pathResult.path[1] - 10,
			pathResult.path[2] - 10,
			20,
			20
		)
			.addClass('highcharts-point-connecting-path-start-marker')
			.attr(merge(options.startMarker, {
				fill: options.color || this.color
			}, attribs))
			.add(pathfinder.group);
		endMarker = renderer.symbol(
			options.endMarker.symbol,
			pathResult.path[pathResult.path.length - 2] - 10,
			pathResult.path[pathResult.path.length - 1] - 10,
			20,
			20
		)
			.addClass('highcharts-point-connecting-path-end-marker')
			.attr(merge(options.endMarker, {
				fill: options.color || this.color
			}, attribs))
			.add(pathfinder.group);

		if (!this.connectingPathGraphics) {
			this.connectingPathGraphics = [];
		}
		this.connectingPathGraphics.push(pathGraphic);
		this.connectingPathGraphics.push(startMarker);
		this.connectingPathGraphics.push(endMarker);

		// Add to internal list of paths for later destroying/referencing
		pathfinder.paths.push(pathGraphic);
		pathfinder.paths.push(startMarker);
		pathfinder.paths.push(endMarker);
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
