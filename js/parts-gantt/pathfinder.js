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
import pathfinderAlgorithms from 'pathfinderAlgorithms.js';

var defined = H.defined,
	deg2rad = H.deg2rad,
	extend = H.extend,
	each = H.each,
	addEvent = H.addEvent,
	merge = H.merge;

// TODO:
// Check dynamics, including hiding/adding/removing/updating series/points etc.

// Set default Pathfinder options
extend(H.defaultOptions, {
	pathfinder: {
		// enabled: true,
		// dashStyle: 'solid',
		// color: point.color,
		type: 'straight',
		markers: {
			enabled: false,
			align: 'center',
			verticalAlign: 'middle',
			radius: 4,
			inside: false
		},
		startMarker: {
			symbol: 'diamond'
		},
		endMarker: {
			symbol: 'arrow-filled'
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
			options = merge(defaultOptions, seriesOptions, opts),
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

		attribs = {
			stroke: options.color || this.color,
			'stroke-width': options.lineWidth
		};
		if (options.dashStyle) {
			attribs.dashstyle = options.dashStyle;
		}
		// Set common marker options
		options = merge(attribs, options);
		options.startMarker = merge(options.markers, options.startMarker);
		options.endMarker = merge(options.markers, options.endMarker);

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
				.add(series.group);
		}

		path = pathResult.path;

		// Add path
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

/**
 * Creates an arrow symbol. Like a triangle, except not filled.
 *                   o
 *             o
 *       o
 * o
 *       o
 *             o
 *                   o
 * @param  {number} x x position of the arrow
 * @param  {number} y y position of the arrow
 * @param  {number} w width of the arrow
 * @param  {number} h height of the arrow
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols.arrow = function (x, y, w, h) {
	return [
		'M', x, y + h / 2,
		'L', x + w, y,
		'L', x, y + h / 2,
		'L', x + w, y + h
	];
};

/**
 * Creates a half-width arrow symbol. Like a triangle, except not filled.
 *       o
 *    o
 * o
 *    o
 *       o
 * @param  {number} x x position of the arrow
 * @param  {number} y y position of the arrow
 * @param  {number} w width of the arrow
 * @param  {number} h height of the arrow
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols['arrow-half'] = function (x, y, w, h) {
	return H.SVGRenderer.prototype.symbols.arrow(x, y, w / 2, h);
};

/**
 * Creates a left-oriented triangle.
 *             o
 *       ooooooo
 * ooooooooooooo
 *       ooooooo
 *             o
 * @param  {number} x x position of the triangle
 * @param  {number} y y position of the triangle
 * @param  {number} w width of the triangle
 * @param  {number} h height of the triangle
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols['triangle-left'] = function (x, y, w, h) {
	return [
		'M', x + w, y,
		'L', x, y + h / 2,
		'L', x + w, y + h,
		'Z'
	];
};

/**
 * Alias function for triangle-left.
 * @param  {number} x x position of the arrow
 * @param  {number} y y position of the arrow
 * @param  {number} w width of the arrow
 * @param  {number} h height of the arrow
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols['arrow-filled'] =
		H.SVGRenderer.prototype.symbols['triangle-left'];

/**
 * Creates a half-width, left-oriented triangle.
 *       o
 *    oooo
 * ooooooo
 *    oooo
 *       o
 * @param  {number} x x position of the triangle
 * @param  {number} y y position of the triangle
 * @param  {number} w width of the triangle
 * @param  {number} h height of the triangle
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols['triangle-left-half'] = function (x, y, w, h) {
	return H.SVGRenderer.prototype.symbols['triangle-left'](x, y, w / 2, h);
};

/**
 * Alias function for triangle-left-half.
 * @param  {number} x x position of the arrow
 * @param  {number} y y position of the arrow
 * @param  {number} w width of the arrow
 * @param  {number} h height of the arrow
 * @return {Array}   Path array
 */
H.SVGRenderer.prototype.symbols['arrow-filled-half'] =
		H.SVGRenderer.prototype.symbols['triangle-left-half'];


// Initialize Pathfinder for charts
H.Chart.prototype.callbacks.push(function (chart) {
	var options = chart.options;
	if (options.pathfinder.enabled !== false) {
		this.pathfinder = new Pathfinder(this);
		this.pathfinder.update(); // First draw
	}
});
