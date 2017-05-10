/**
 * (c) 2016 Highsoft AS
 * Authors: Øystein Moseng, Lars A. V. Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Point.js';
import '../parts/Utilities.js';
import pathfinderAlgorithms from 'PathfinderAlgorithms.js';
import 'ArrowSymbols.js';

var defined = H.defined,
	deg2rad = H.deg2rad,
	extend = H.extend,
	each = H.each,
	addEvent = H.addEvent,
	merge = H.merge,
	pick = H.pick,
	max = Math.max,
	min = Math.min;

// TODO:
// Check dynamics, including hiding/adding/removing/updating series/points etc.

// Set default Pathfinder options
extend(H.defaultOptions, {
	pathfinder: {
		// enabled: true,
		// dashStyle: 'solid',
		// color: point.color,
		// algorithmMargin: null, // Autocomputed
		type: 'straight',
		marker: {
			// radius: null, // Autocomputed
			enabled: false,
			align: 'center',
			verticalAlign: 'middle',
			inside: false
		},
		startMarker: {
			symbol: 'diamond'
		},
		endMarker: {
			symbol: 'arrow-filled'
		},
		lineWidth: 1
	}
});


/**
 * Calculate margin to place around obstacles for the pathfinder in pixels.
 * Returns a minimum of 1 pixel margin.
 *
 * @param {Array} obstacles Obstacles to calculate margin from.
 *
 * @return {Number} result The calculated margin in pixels.
 */
function calculateObstacleMargin(obstacles) {
	var len = obstacles.length,
		i = 0,
		j,
		obstacleDistance,
		distances = [],
		// Compute smallest distance between two rectangles
		distance = function (a, b, bbMargin) {
			var margin = pick(bbMargin, 10), // Count the distance even if we are slightly off
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
				return margin ? distance(a, b, Math.floor(margin / 2)) : Infinity;
			}

			return min(xDistance, yDistance);
		};

	// Go over all obstacles and compare them to the others.
	for (; i < len; ++i) {
		// Compare to all obstacles ahead. We will already have compared this
		// obstacle to the ones before.
		for (j = i + 1; j < len; ++j) {
			obstacleDistance = distance(obstacles[i], obstacles[j]);
			if (obstacleDistance < 80) { // Ignore large distances
				distances.push(obstacleDistance);
			}
		}
	}
	// Ensure we always have at least one value, even in very spaceous charts
	distances.push(80);

	return max(
		Math.floor(
			distances.sort(function (a, b) {
				return a - b;
			})[
				// Discard first 10% of the relevant distances, and then grab the
				// smallest one.
				Math.floor(distances.length / 10)
			] / 2 - 1 // Divide the distance by 2 and subtract 1.
		),
		1 // 1 is the minimum margin
	);
}


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
			var pathfinder = this.pathfinder,
				animDuration = this.renderer.globalAnimation &&
					H.animObject(this.renderer.globalAnimation).duration;

			// Clear immediately
			pathfinder.clear();

			// Update after animation
			this.pathfinder.updateTimeout = H.syncTimeout(function () {
				pathfinder.update();
			}, animDuration);
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
			if (chart.series[i].visible) {
				each(chart.series[i].points, function (point) {
					var connect = point.options.connect,
						to;
					if (point.visible && connect) {
						to = chart.get(typeof connect === 'string' ?
							connect : connect.to
						);
						if (to instanceof H.Point && to.series.visible && to.visible) {
							// We store start/end/options for each connection to
							// be picked up in drawConnections
							pathfinder.connections.push([
								point,
								to,
								typeof connect === 'string' ? {} : connect
							]);
						}
					}
				});
			}
		}

		// Clear connections
		pathfinder.clear();

		// Draw the pending connections
		pathfinder.renderConnections();
	},

	/**
	 * Clear the pathfinder - destroy connecting paths and obstacles.
	 */
	clear: function () {
		// Clear existing connections
		var i = this.paths.length;
		while (i--) {
			this.paths[i].destroy();
		}
		this.paths = [];

		// Clear obstacles to force recalculation. This must be done on every
		// redraw in case positions have changed. Recalculation is handled in
		// Point.pathTo on demand.
		delete this.chartObstacles;
		delete this.lineObstacles;
	},

	/**
	 * Draw the chart's connecting paths.
	 */
	renderConnections: function () {
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
			margin = pick(options.algorithmMargin, 0),
			bb,
			calculatedMargin;
		for (var i = 0, sLen = series.length; i < sLen; ++i) {
			if (series[i].visible) {
				for (var j = 0, pLen = series[i].points.length; j < pLen; ++j) {
					bb = series[i].points[j].graphic.getBBox();
					obstacles.push({
						xMin: bb.x - margin,
						xMax: bb.x + bb.width + margin,
						yMin: bb.y - margin,
						yMax: bb.y + bb.height + margin
					});
				}
			}
		}

		// Sort obstacles by xMin for optimization
		obstacles = obstacles.sort(function (a, b) {
			return a.xMin - b.xMin;
		});

		// Add auto-calculated margin if the option is not defined
		if (!defined(options.algorithmMargin)) {
			calculatedMargin = options.algorithmMargin = calculateObstacleMargin(obstacles);
			each(obstacles, function (obstacle) {
				obstacle.xMin -= calculatedMargin;
				obstacle.xMax += calculatedMargin;
				obstacle.yMin -= calculatedMargin;
				obstacle.yMax += calculatedMargin;
			});
		}

		return obstacles;
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
	},

	/**
	 * Get which direction to start the pathfinding algorithm, calculated from
	 * marker options.
	 *
	 * @param {Object} markerOptions Marker options to calculate from.
	 *
	 * @return {Boolean} result Returns true for X, false for Y, and undefined
	 *							for autocalculate.
	 */
	getAlgorithmStartDirection: function (markerOptions) {
		var xCenter = markerOptions.align !== 'left' &&
						markerOptions.align !== 'right',
			yCenter = markerOptions.verticalAlign !== 'top' &&
						markerOptions.verticalAlign !== 'bottom',
			undef;

		return xCenter ?
			(yCenter ? undef : false) : // x is centered
			(yCenter ? true : undef); 	// x is off-center
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
		var bb = merge(this.graphic.getBBox()),
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
			this.connectingPathGraphics = {};
		}

		this.connectingPathGraphics.path = pathGraphic;
		// Add to internal list of paths for later destroying/referencing
		pathfinder.paths.push(pathGraphic);
	},

	addMarker: function (type, options, path, point, anchor) {
		var chart = this.series.chart,
			pathfinder = chart.pathfinder,
			renderer = chart.renderer,
			vector,
			radians,
			rotation,
			marker,
			width,
			height,
			pathVector;

		if (!options.enabled) {
			return;
		}

		if (type === 'start') {
			pathVector = {
				x: path[4],
				y: path[5]
			};
		} else { // 'end'
			pathVector = {
				x: path[path.length - 5],
				y: path[path.length - 4]
			};
		}

		radians = point.getRadiansToVector(pathVector, anchor);
		vector = point.getMarkerVector(
			radians,
			options.radius,
			anchor
		);
		radians = point.getRadiansToVector(pathVector, vector);
		rotation = radians / deg2rad;

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
			.attr({
				fill: options.color || this.color,
				stroke: options.stroke,
				'stroke-width': options['stroke-width']
			})
			.add(pathfinder.group);
		// Rotate marker according to degrees
		marker.attr(
			'transform',
			'rotate(' + -rotation + ',' + vector.x + ',' + vector.y + ')'
		);

		this.connectingPathGraphics[type] = marker;

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
	getRadiansToVector: function (v1, v2) {
		var box;
		if (!defined(v2)) {
			box = this.graphic.getBBox();
			v2 = {
				x: box.x + box.width / 2,
				y: box.y + box.height / 2
			};
		}
		return Math.atan2(v2.y - v1.y, v1.x - v2.x);
	},

	/**
	 * Get the position of the marker, based on the path angle and the marker's
	 * radius.
	 * @param {number} radians      the angle in radians from the point center
	 *                              to another vector
	 * @param {number} markerRadius the radius of the marker, to calculate the
	 *                              additional distance to the center of the
	 *                              marker
	 * @param {Object} anchor       the anchor point of the path and marker
	 * @param {number} anchor.x     the x position of the anchor
	 * @param {number} anchor.y     the x position of the anchor
	 * @return {Object}             a vector (x, y) of the marker position
	 */
	getMarkerVector: function (radians, markerRadius, anchor) {
		var twoPI = Math.PI * 2.0,
			theta = radians,
			rect = this.graphic.getBBox(),
			rAtan = Math.atan2(rect.height, rect.width),
			tanTheta = 1,
			leftOrRightRegion = false,
			rectHalfWidth = rect.width / 2.0,
			rectHalfHeight = rect.height / 2.0,
			rectHorizontalCenter = rect.x + rectHalfWidth,
			rectVerticalCenter = rect.y + rectHalfHeight,
			edgePoint = {
				x: rectHorizontalCenter,
				y: rectVerticalCenter
			},
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
			edgePoint.x += xFactor * (rect.height / (2.0 * tanTheta));
			edgePoint.y += yFactor * (rectHalfHeight);
		}

		if (anchor.x !== rectHorizontalCenter) {
			edgePoint.x = anchor.x;
		}
		if (anchor.y !== rectVerticalCenter) {
			edgePoint.y = anchor.y;
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
		var series = this.series,
			chart = series.chart,
			pathfinder = chart.pathfinder,
			defaultOptions = chart.options.pathfinder,
			seriesOptions = series.options.pathfinder,
			chartObstacles = pathfinder.chartObstacles,
			lineObstacles = pathfinder.lineObstacles,
			renderer = chart.renderer,
			fromAnchor,
			toAnchor,
			pathResult,
			path,
			attribs,
			options = merge(
				defaultOptions, seriesOptions, this.options.pathfinder, opts
			),
			algorithm = pathfinder.algorithms[options.type];

		if (typeof algorithm !== 'function') {
			H.error(
				'"' + options.type + '" is not a Pathfinder algorithm.'
			);
			return;
		}

		// This function calculates obstacles on demand if they don't exist
		if (algorithm.requiresObstacles && !chartObstacles) {
			chartObstacles =
				pathfinder.chartObstacles =
				pathfinder.getChartObstacles(options);

			// If the algorithmMargin was computed, store the result in default
			// options.
			defaultOptions.algorithmMargin = options.algorithmMargin;

			// Cache some metrics too
			pathfinder.chartObstacleMetrics =
				pathfinder.getObstacleMetrics(chartObstacles);
		}

		attribs = {
			stroke: options.color || this.color,
			'stroke-width': options.lineWidth
		};
		if (options.dashStyle) {
			attribs.dashstyle = options.dashStyle;
		}

		// Set common marker options
		options = merge(attribs, options);
		if (!defined(options.marker.radius)) {
			options.marker.radius = min(max(
				Math.ceil((options.algorithmMargin || 8) / 2) - 1, 1
			), 5);
		}
		options.startMarker = merge(options.marker, options.startMarker);
		options.endMarker = merge(options.marker, options.endMarker);

		fromAnchor = this.getPathfinderAnchorPoint(options.startMarker);
		toAnchor = toPoint.getPathfinderAnchorPoint(options.endMarker);

		// Get the SVG path
		pathResult = algorithm(
			fromAnchor,
			toAnchor,
			merge({
				chartObstacles: chartObstacles,
				lineObstacles: lineObstacles || [],
				obstacleMetrics: pathfinder.chartObstacleMetrics,
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
					options.startMarker
				)
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
				.attr({ zIndex: -1 })
				.add(chart.seriesGroup);
		}

		// Shift to compensate for plot area. Do this every time to avoid issues
		// when updating chart in a way that changes plot positions.
		pathfinder.group.translate(chart.plotLeft, chart.plotTop);

		path = pathResult.path;

		// Add path to pathfinder group and keep track of it
		this.addPath(path, attribs);

		// Override common marker options
		options.startMarker = merge(options, options.startMarker);
		options.endMarker = merge(options, options.endMarker);
		delete options.startMarker.startMarker;
		delete options.startMarker.endMarker;
		delete options.endMarker.startMarker;
		delete options.endMarker.endMarker;


		// TODO
		// - refactor

		// Add start marker
		this.addMarker('start', options.startMarker, path, this, fromAnchor);
		this.addMarker('end', options.endMarker, path, toPoint, toAnchor);
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
