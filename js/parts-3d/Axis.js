/**
 * (c) 2010-2017 Torstein Honsi
 *
 * Extenstion for 3d axes
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Chart.js';
import '../parts/Tick.js';
var ZAxis,

	Axis = H.Axis,
	Chart = H.Chart,
	deg2rad = H.deg2rad,
	each = H.each,
	extend = H.extend,
	merge = H.merge,
	perspective = H.perspective,
	pick = H.pick,
	shapeArea = H.shapeArea,
	splat = H.splat,
	Tick = H.Tick,
	wrap = H.wrap;

/**
 * Options to render axis in 3 dimensions. 
 * @optionparent xAxis
 */
var extendedOptions = {
	labels: {
		/**
		 * Defines how the labels are be repositioned according to the 3D chart
		 * orientation.
		 * - `'offset'`: Maintain a fixed horizontal/vertical distance from the
		 * 	 tick marks, despite the chart orientation. This is the backwards
		 * 	 compatible behavior, and causes skewing of X and Z axes.
		 * - `'chart'`: Preserve 3D position relative to the chart.
		 *   This looks nice, but hard to read if the text isn't
		 *   forward-facing.
		 * - `'flap'`: Rotated text along the axis to compensate for the chart
		 * 	 orientation. This tries to maintain text as legible as possible on
		 * 	 all orientations.
		 * - `'ortho'`: Rotated text along the axis direction so that the labels
		 * 	 are orthogonal to the axis. This is very similar to `'flap'`, but
		 * 	 prevents skewing the labels (X and Y scaling are still present).
		 * 
		 * @validvalue ['offset', 'chart', 'flap', 'ortho']
		 * @sample highcharts/3d/skewed-labels/ Skewed labels
		 * @since 5.0.15
		 * @product highcharts
		 */
		position3d: 'offset',
		
		/**
		 * If enabled, the axis labels will skewed to follow the perspective. 
		 * 
		 * This will fix overlapping labels and titles, but texts become less
		 * legible due to the distortion.
		 * 
		 * The final appearance depends heavily on `labels.position3d`.
		 * 
		 * @since 5.0.15
		 * @sample highcharts/3d/skewed-labels/ Skewed labels
		 * @product highcharts
		 */
		skew3d: false
	},
	title: {	
		/**
		 * Defines how the title is repositioned according to the 3D chart
		 * orientation.
		 * - `'offset'`: Maintain a fixed horizontal/vertical distance from the
		 *   tick marks, despite the chart orientation. This is the backwards
		 *   compatible behavior, and causes skewing of X and Z axes.
		 * - `'chart'`: Preserve 3D position relative to the chart.
		 *   This looks nice, but hard to read if the text isn't
		 *   forward-facing.
		 * - `'flap'`: Rotated text along the axis to compensate for the chart
		 *   orientation. This tries to maintain text as legible as possible on
		 *   all orientations.
		 * - `'ortho'`: Rotated text along the axis direction so that the labels
		 *   are orthogonal to the axis. This is very similar to `'flap'`, but
		 *   prevents skewing the labels (X and Y scaling are still present).
		 * - `null`: Will use the config from `labels.position3d`
		 * 
		 * @validvalue ['offset', 'chart', 'flap', 'ortho', null]
		 * @type {String}
		 * @since 5.0.15
		 * @sample highcharts/3d/skewed-labels/ Skewed labels
		 * @product highcharts
		 */
		position3d: null,
		
		/**
		 * If enabled, the axis title will skewed to follow the perspective.
		 * 
 		 * This will fix overlapping labels and titles, but texts become less
 		 * legible due to the distortion.
		 * 
		 * The final appearance depends heavily on `title.position3d`.
		 * 
		 * A `null` value will use the config from `labels.skew3d`.
		 * 
		 * @validvalue [false, true, null]
		 * @type {Boolean}
		 * @sample highcharts/3d/skewed-labels/ Skewed labels
		 * @since 5.0.15
		 * @product highcharts
		 */
		skew3d: null
	}
};

merge(true, Axis.prototype.defaultOptions, extendedOptions);


wrap(Axis.prototype, 'setOptions', function (proceed, userOptions) {
	var options;
	proceed.call(this, userOptions);
	if (this.chart.is3d() && this.coll !== 'colorAxis') {
		options = this.options;
		options.tickWidth = pick(options.tickWidth, 0);
		options.gridLineWidth = pick(options.gridLineWidth, 1);
	}
});

wrap(Axis.prototype, 'getPlotLinePath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));

	// Do not do this if the chart is not 3D
	if (!this.chart.is3d() || this.coll === 'colorAxis') {
		return path;
	}

	if (path === null) {
		return path;
	}

	var chart = this.chart,
		options3d = chart.options.chart.options3d,
		d = this.isZAxis ? chart.plotWidth : options3d.depth,
		frame = chart.frame3d;

	var pArr = [
		this.swapZ({ x: path[1], y: path[2], z: 0 }),
		this.swapZ({ x: path[1], y: path[2], z: d }),
		this.swapZ({ x: path[4], y: path[5], z: 0 }),
		this.swapZ({ x: path[4], y: path[5], z: d })
	];

	var pathSegments = [];
	if (!this.horiz) {  // Y-Axis
		if (frame.front.visible) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.back.visible) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.left.visible) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.right.visible) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	} else if (this.isZAxis) {  // Z-Axis
		if (frame.left.visible) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.right.visible) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.top.visible) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.bottom.visible) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	} else {  // X-Axis
		if (frame.front.visible) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.back.visible) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.top.visible) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.bottom.visible) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	}

	pathSegments = perspective(pathSegments, this.chart, false);

	return this.chart.renderer.toLineSegments(pathSegments);
});

// Do not draw axislines in 3D
wrap(Axis.prototype, 'getLinePath', function (proceed) {
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d() || this.coll === 'colorAxis') {
		return proceed.apply(this, [].slice.call(arguments, 1));
	}

	return [];
});

wrap(Axis.prototype, 'getPlotBandPath', function (proceed) {
	// Do not do this if the chart is not 3D
	if (!this.chart.is3d() || this.coll === 'colorAxis') {
		return proceed.apply(this, [].slice.call(arguments, 1));
	}

	var args = arguments,
		from = args[1],
		to = args[2],
		path = [],
		fromPath = this.getPlotLinePath(from),
		toPath = this.getPlotLinePath(to);

	if (fromPath && toPath) {
		for (var i = 0; i < fromPath.length; i += 6) {
			path.push(
				'M', fromPath[i + 1], fromPath[i + 2],
				'L', fromPath[i + 4], fromPath[i + 5],
				'L',   toPath[i + 4],   toPath[i + 5],
				'L',   toPath[i + 1],   toPath[i + 2],
				'Z');
		}
	}

	return path;
});


function fix3dPosition(axis, pos, isTitle) {
	// Do not do this if the chart is not 3D
	if (!axis.chart.is3d() || axis.coll === 'colorAxis') {
		return pos;
	}

	var chart = axis.chart,
		alpha = deg2rad * chart.options.chart.options3d.alpha,
		beta = deg2rad * chart.options.chart.options3d.beta,
		positionMode = pick(
			isTitle && axis.options.title.position3d,
			axis.options.labels.position3d
		),
		skew = pick(
			isTitle && axis.options.title.skew3d,
			axis.options.labels.skew3d
		),
		frame = chart.frame3d,
		plotLeft = chart.plotLeft,
		plotRight = chart.plotWidth + plotLeft,
		plotTop = chart.plotTop,
		plotBottom = chart.plotHeight + plotTop,
		// Indicates we are labelling an X or Z axis on the "back" of the chart
		reverseFlap = false,
		offsetX = 0,
		offsetY = 0,
		vecX,
		vecY = { x: 0, y: 1, z: 0 };

	pos = axis.swapZ({ x: pos.x, y: pos.y, z: 0 });


	if (axis.isZAxis) {  // Z Axis
		if (axis.opposite) {
			if (frame.axes.z.top === null) {
				return {};
			}
			offsetY = pos.y - plotTop;
			pos.x = frame.axes.z.top.x;
			pos.y = frame.axes.z.top.y;
			vecX = frame.axes.z.top.xDir;
			reverseFlap = !frame.top.frontFacing;
		} else {
			if (frame.axes.z.bottom === null) {
				return {};
			}
			offsetY = pos.y - plotBottom;
			pos.x = frame.axes.z.bottom.x;
			pos.y = frame.axes.z.bottom.y;
			vecX = frame.axes.z.bottom.xDir;
			reverseFlap = !frame.bottom.frontFacing;
		}
	} else if (axis.horiz) {  // X Axis
		if (axis.opposite) {
			if (frame.axes.x.top === null) {
				return {};
			}
			offsetY = pos.y - plotTop;
			pos.y = frame.axes.x.top.y;
			pos.z = frame.axes.x.top.z;
			vecX = frame.axes.x.top.xDir;
			reverseFlap = !frame.top.frontFacing;
		} else {
			if (frame.axes.x.bottom === null) {
				return {};
			}
			offsetY = pos.y - plotBottom;
			pos.y = frame.axes.x.bottom.y;
			pos.z = frame.axes.x.bottom.z;
			vecX = frame.axes.x.bottom.xDir;
			reverseFlap = !frame.bottom.frontFacing;
		}
	} else {  // Y Axis
		if (axis.opposite) {
			if (frame.axes.y.right === null) {
				return {};
			}
			offsetX = pos.x - plotRight;
			pos.x = frame.axes.y.right.x;
			pos.z = frame.axes.y.right.z;
			vecX = frame.axes.y.right.xDir;
			// Rotate 90º on opposite edge
			vecX = { x: vecX.z, y: vecX.y, z: -vecX.x };
		} else {
			if (frame.axes.y.left === null) {
				return {};
			}
			offsetX = pos.x - plotLeft;
			pos.x = frame.axes.y.left.x;
			pos.z = frame.axes.y.left.z;
			vecX = frame.axes.y.left.xDir;
		}
	}

	if (positionMode === 'chart') {
		// Labels preserve their direction relative to the chart
		// nothing to do

	} else if (positionMode === 'flap') {
		// Labels are be rotated around the axis direction to face the screen
		if (!axis.horiz) {  // Y Axis
			vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
		} else {  // X and Z Axis
			var sin = Math.sin(alpha);
			var cos = Math.cos(alpha);
			if (axis.opposite) {
				sin = -sin;
			}
			if (reverseFlap) {
				sin = -sin;
			}
			vecY = { x: vecX.z * sin, y: cos, z: -vecX.x * sin };
		}
	} else if (positionMode === 'ortho') {
		// Labels will be rotated to be ortogonal to the axis
		if (!axis.horiz) {  // Y Axis
			vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
		} else {  // X and Z Axis
			var sina = Math.sin(alpha);
			var cosa = Math.cos(alpha);
			var sinb = Math.sin(beta);
			var cosb = Math.cos(beta);
			var vecZ = { x: sinb * cosa, y: -sina, z: -cosa * cosb };
			vecY = {
				x: vecX.y * vecZ.z - vecX.z * vecZ.y,
				y: vecX.z * vecZ.x - vecX.x * vecZ.z,
				z: vecX.x * vecZ.y - vecX.y * vecZ.x
			};
			var scale = 1 / Math.sqrt(
				vecY.x * vecY.x + vecY.y * vecY.y + vecY.z * vecY.z
			);
			if (reverseFlap) {
				scale = -scale;
			}
			vecY = { x: scale * vecY.x, y: scale * vecY.y, z: scale * vecY.z };
		}
	} else {  // positionMode  == 'offset'
		// Labels will be skewd to maintain vertical / horizontal offsets from
		// axis
		if (!axis.horiz) {  // Y Axis
			vecX = { x: Math.cos(beta), y: 0, z: Math.sin(beta) };
		} else {  // X and Z Axis
			vecY = {
				x: Math.sin(beta) * Math.sin(alpha),
				y: Math.cos(alpha),
				z: -Math.cos(beta) * Math.sin(alpha)
			};
		}
	}
	pos.x += offsetX * vecX.x + offsetY * vecY.x;
	pos.y += offsetX * vecX.y + offsetY * vecY.y;
	pos.z += offsetX * vecX.z + offsetY * vecY.z;
	
	var projected = perspective([pos], axis.chart)[0];

	if (skew) {
		// Check if the label text would be mirrored
		var isMirrored = shapeArea(perspective([
			pos, 
			{ x: pos.x + vecX.x, y: pos.y + vecX.y, z: pos.z + vecX.z },
			{ x: pos.x + vecY.x, y: pos.y + vecY.y, z: pos.z + vecY.z }
		], axis.chart)) < 0;
		if (isMirrored) {
			vecX = { x: -vecX.x, y: -vecX.y, z: -vecX.z };
		}

		var pointsProjected = perspective([
			{ x: pos.x, y: pos.y, z: pos.z },
			{ x: pos.x + vecX.x, y: pos.y + vecX.y, z: pos.z + vecX.z },
			{ x: pos.x + vecY.x, y: pos.y + vecY.y, z: pos.z + vecY.z }
		], axis.chart);

		projected.matrix = [ 
			pointsProjected[1].x - pointsProjected[0].x, 
			pointsProjected[1].y - pointsProjected[0].y, 
			pointsProjected[2].x - pointsProjected[0].x, 
			pointsProjected[2].y - pointsProjected[0].y, 
			projected.x,
			projected.y
		];
		projected.matrix[4] -= projected.x * projected.matrix[0] +
			projected.y * projected.matrix[2];
		projected.matrix[5] -= projected.x * projected.matrix[1] +
			projected.y * projected.matrix[3];
	} else {
		projected.matrix = null;
	}

	return projected;
}

/*
Tick extensions
 */
wrap(Tick.prototype, 'getMarkPath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));

	var pArr = [
		fix3dPosition(this.axis, { x: path[1], y: path[2], z: 0 }),
		fix3dPosition(this.axis, { x: path[4], y: path[5], z: 0 })
	];

	return this.axis.chart.renderer.toLineSegments(pArr);
});

wrap(Tick.prototype, 'fixLabelPosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	return fix3dPosition(this.axis, pos);
});

wrap(Axis.prototype, 'getTitlePosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	return fix3dPosition(this, pos, true);
});

wrap(Axis.prototype, 'drawCrosshair', function (proceed) {
	var args = arguments;
	if (this.chart.is3d() && this.coll !== 'colorAxis') {
		if (args[2]) {
			args[2] = {
				plotX: args[2].plotXold || args[2].plotX,
				plotY: args[2].plotYold || args[2].plotY
			};
		}
	}
	proceed.apply(this, [].slice.call(args, 1));
});

wrap(Axis.prototype, 'destroy', function (proceed) {
	each(['backFrame', 'bottomFrame', 'sideFrame'], function (prop) {
		if (this[prop]) {
			this[prop] = this[prop].destroy();
		}
	}, this);
	proceed.apply(this, [].slice.call(arguments, 1));
});

/*
Z-AXIS
*/

Axis.prototype.swapZ = function (p, insidePlotArea) {
	if (this.isZAxis) {
		var plotLeft = insidePlotArea ? 0 : this.chart.plotLeft;
		return {
			x: plotLeft + p.z,
			y: p.y,
			z: p.x - plotLeft
		};
	}
	return p;
};

ZAxis = H.ZAxis = function () {
	this.init.apply(this, arguments);
};
extend(ZAxis.prototype, Axis.prototype);
extend(ZAxis.prototype, {
	isZAxis: true,
	setOptions: function (userOptions) {
		userOptions = merge({
			offset: 0,
			lineWidth: 0
		}, userOptions);
		Axis.prototype.setOptions.call(this, userOptions);
		this.coll = 'zAxis';
	},
	setAxisSize: function () {
		Axis.prototype.setAxisSize.call(this);
		this.width = this.len = this.chart.options.chart.options3d.depth;
		this.right = this.chart.chartWidth - this.width - this.left;
	},
	getSeriesExtremes: function () {
		var axis = this,
			chart = axis.chart;

		axis.hasVisibleSeries = false;

		// Reset properties in case we're redrawing (#3353)
		axis.dataMin =
			axis.dataMax =
			axis.ignoreMinPadding =
			axis.ignoreMaxPadding = null;

		if (axis.buildStacks) {
			axis.buildStacks();
		}

		// loop through this axis' series
		each(axis.series, function (series) {

			if (series.visible || !chart.options.chart.ignoreHiddenSeries) {

				var seriesOptions = series.options,
					zData,
					threshold = seriesOptions.threshold;

				axis.hasVisibleSeries = true;

				// Validate threshold in logarithmic axes
				if (axis.positiveValuesOnly && threshold <= 0) {
					threshold = null;
				}

				zData = series.zData;
				if (zData.length) {
					axis.dataMin = Math.min(
						pick(axis.dataMin, zData[0]),
						Math.min.apply(null, zData)
					);
					axis.dataMax = Math.max(
						pick(axis.dataMax, zData[0]),
						Math.max.apply(null, zData)
					);
				}
			}
		});
	}
});


/**
* Extend the chart getAxes method to also get the color axis
*/
wrap(Chart.prototype, 'getAxes', function (proceed) {
	var chart = this,
		options = this.options,
		zAxisOptions = options.zAxis = splat(options.zAxis || {});

	proceed.call(this);

	if (!chart.is3d()) {
		return;
	}
	this.zAxis = [];
	each(zAxisOptions, function (axisOptions, i) {
		axisOptions.index = i;
		// Z-Axis is shown horizontally, so it's kind of a X-Axis
		axisOptions.isX = true;
		var zAxis = new ZAxis(chart, axisOptions);
		zAxis.setScale();
	});
});
