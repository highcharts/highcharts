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
			radius: 4,
			inside: false,
			verticalAlign: 'middle'
		},
		endMarker: {
			symbol: 'diamond',
			align: 'center',
			radius: 4,
			inside: false,
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

	addPath: function (path, attribs) {
		var chart = this.series.chart,
			pathfinder = chart.pathfinder,
			renderer = chart.renderer,
			pathGraphic = renderer.path(path)
				.addClass('highcharts-point-connecting-path')
				.attr(attribs)
				.add(pathfinder.group);

		if (!this.connectingPathGraphics) {
			this.connectingPathGraphics = [];
		}

		this.connectingPathGraphics.push(pathGraphic);
		// Add to internal list of paths for later destroying/referencing
		pathfinder.paths.push(pathGraphic);
	},

	addMarker: function (type, vector, options) {
		var chart = this.series.chart,
			pathfinder = chart.pathfinder,
			renderer = chart.renderer,
			marker,
			width,
			height;

		if (options.width && options.height) {
			width = options.width;
			height = options.height;
		} else {
			width = height = options.radius * 2;
		}

		marker = renderer.symbol(
			options.symbol,
			vector.x - (width / 2),
			vector.y - (height / 2),
			width,
			height
		)
			.addClass('highcharts-point-connecting-path-' + type + '-marker')
			.attr(merge(options, {
				fill: options.color || this.color
			}))
			.add(pathfinder.group);
		this.connectingPathGraphics.push(marker);

		// Add to internal list of paths for later destroying/referencing
		pathfinder.paths.push(marker);
	},

	/**
	 * Get the angle from one point to another.
	 * @param  {Object} v1 - the first vector
	 * @param  {Object} v1.x - the first vector x position
	 * @param  {Object} v1.y - the first vector y position
	 * @param  {Object} v2 - the second vector
	 * @param  {Object} v2.x - the second vector x position
	 * @param  {Object} v2.y - the second vector y position
	 * @return {number}    - the angle in degrees
	 */
	getRadiansToVector: function (x, y) {
		return Math.atan2(this.plotY - y, x - this.plotX);
	},

	/**
	 * Get the edge of the point graphic, based on an angle.
	 * @param  {number} deg the angle in degrees from the point center to
	 *                      another vector
	 * @return {Object}       a vector (x, y) of the point graphic edge
	 */
	getMarkerVector: function (radians, markerRadius) {
		var twoPI = Math.PI * 2,
			theta = radians,
			rect = this.graphic.getBBox(),
			rectAtan = Math.atan2(rect.height, rect.width),
			tanTheta = 1,
			leftOrRightRegion = false,
			edgePoint = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 },
			markerPoint = {},
			xFactor = 1,
			yFactor = 1;

		while (theta < -Math.PI) {
			theta += twoPI;
		}

		while (theta > Math.PI) {
			theta -= twoPI;
		}

		tanTheta = Math.tan(theta);

		if ((theta > -rectAtan) && (theta <= rectAtan)) {
			yFactor = -1;
			leftOrRightRegion = true;
		} else if ((theta > rectAtan) && (theta <= (Math.PI - rectAtan))) {
			yFactor = -1;
		} else if ((theta > (Math.PI - rectAtan)) || (theta <= -(Math.PI - rectAtan))) {
			xFactor = -1;
			leftOrRightRegion = true;
		} else {
			xFactor = -1;
		}

		if (leftOrRightRegion) {
			edgePoint.x += xFactor * (rect.width / 2.0);
			edgePoint.y += yFactor * (rect.width / 2.0) * tanTheta;
		} else {
			edgePoint.x += xFactor * (rect.height / (2.0 * tanTheta));
			edgePoint.y += yFactor * (rect.height /  2.0);
		}

		markerPoint.x = edgePoint.x + (markerRadius * Math.cos(theta));
		markerPoint.y = edgePoint.y - (markerRadius * Math.sin(theta));

		return markerPoint;
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
			pathResult,
			radians,
			path,
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
					xMin: chart.plotLeft,
					xMax: chart.plotLeft + chart.plotWidth,
					yMin: chart.plotTop,
					yMax: chart.plotTop + chart.plotHeight
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

		path = pathResult.path;

		// Add path
		this.addPath(path, attribs);

		// Set common marker options
		options = merge(this.series.options.marker, attribs, options);
		// Override common marker options
		options.startMarker = merge(options, options.startMarker);
		options.endMarker = merge(options, options.endMarker);
		delete options.startMarker.startMarker;
		delete options.startMarker.endMarker;
		delete options.endMarker.startMarker;
		delete options.endMarker.endMarker;

		// Add start marker
		radians = this.getRadiansToVector(
			path[4], // Second x in path
			path[5]  // Second y in path
		);
		this.addMarker(
			'start',
			this.getMarkerVector(radians, options.startMarker.radius),
			options.startMarker
		);

		// Add end marker
		radians = toPoint.getRadiansToVector(
			path[path.length - 5], // Second last x in path
			path[path.length - 4]  // Second last y in path
		);
		this.addMarker(
			'end',
			toPoint.getMarkerVector(radians, options.endMarker.radius),
			options.endMarker
		);
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
