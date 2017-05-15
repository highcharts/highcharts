/**
 * (c) 2010-2017 Torstein Honsi
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
	each = H.each,
	extend = H.extend,
	merge = H.merge,
	perspective = H.perspective,
	pick = H.pick,
	splat = H.splat,
	Tick = H.Tick,
	wrap = H.wrap;
/***
	EXTENSION TO THE AXIS
***/
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
		if (frame.front.visible && frame.front.frontFacing) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.back.visible && frame.back.frontFacing) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.left.visible && frame.left.frontFacing) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.right.visible && frame.right.frontFacing) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	} else if (this.isZAxis) {  // Z-Axis
		if (frame.left.visible && frame.left.frontFacing) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.right.visible && frame.right.frontFacing) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.top.visible && frame.top.frontFacing) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.bottom.visible && frame.bottom.frontFacing) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	} else {  // X-Axis
		if (frame.front.visible && frame.front.frontFacing) {
			pathSegments.push(pArr[0], pArr[2]);
		}
		if (frame.back.visible && frame.back.frontFacing) {
			pathSegments.push(pArr[1], pArr[3]);
		}
		if (frame.top.visible && frame.top.frontFacing) {
			pathSegments.push(pArr[0], pArr[1]);
		}
		if (frame.bottom.visible && frame.bottom.frontFacing) {
			pathSegments.push(pArr[2], pArr[3]);
		}
	}

	pathSegments = perspective(pathSegments, this.chart, false);

	return this.chart.renderer.toLineSegments(pathSegments);
});

// Do not draw axislines in 3D
wrap(Axis.prototype, 'getLinePath', function (proceed) {
	return this.chart.is3d() ? [] : proceed.apply(this, [].slice.call(arguments, 1));
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


function fix3dPosition(axis, pos) {
	if (axis.chart.is3d() && axis.coll !== 'colorAxis') {
		var chart = axis.chart,
			frame = chart.frame3d,
			plotLeft = chart.plotLeft,
			plotRight = chart.plotWidth + plotLeft,
			plotTop = chart.plotTop,
			plotBottom = chart.plotHeight + plotTop,
			dx = 0,
			dy = 0;

		pos = axis.swapZ({ x: pos.x, y: pos.y, z: 0 });


		if (axis.isZAxis) {  // Z Axis
			if (axis.opposite) {
				if (frame.axes.z.top === null) {
					return {};
				}
				dy = pos.y - plotTop;
				pos.x = frame.axes.z.top.x;
				pos.y = frame.axes.z.top.y;
			} else {
				if (frame.axes.z.bottom === null) {
					return {};
				}
				dy = pos.y - plotBottom;
				pos.x = frame.axes.z.bottom.x;
				pos.y = frame.axes.z.bottom.y;
			}
		} else if (axis.horiz) {  // X Axis
			if (axis.opposite) {
				if (frame.axes.x.top === null) {
					return {};
				}
				dy = pos.y - plotTop;
				pos.y = frame.axes.x.top.y;
				pos.z = frame.axes.x.top.z;
			} else {
				if (frame.axes.x.bottom === null) {
					return {};
				}
				dy = pos.y - plotBottom;
				pos.y = frame.axes.x.bottom.y;
				pos.z = frame.axes.x.bottom.z;
			}
		} else {  //Y Axis
			if (axis.opposite) {
				if (frame.axes.y.right === null) {
					return {};
				}
				dx = pos.x - plotRight;
				pos.x = frame.axes.y.right.x;
				pos.z = frame.axes.y.right.z;
			} else {
				if (frame.axes.y.left === null) {
					return {};
				}
				dx = pos.x - plotLeft;
				pos.x = frame.axes.y.left.x;
				pos.z = frame.axes.y.left.z;
			}
		}
		pos = perspective([pos], axis.chart)[0];
		pos.x += dx;
		pos.y += dy;
	}
	return pos;
}

/***
	EXTENSION TO THE TICKS
***/

wrap(Tick.prototype, 'getMarkPath', function (proceed) {
	var path = proceed.apply(this, [].slice.call(arguments, 1));

	var pArr = [
		fix3dPosition(this.axis, { x: path[1], y: path[2], z: 0 }),
		fix3dPosition(this.axis, { x: path[4], y: path[5], z: 0 })
	];

	return this.axis.chart.renderer.toLineSegments(pArr);
});

wrap(Tick.prototype, 'getLabelPosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	return fix3dPosition(this.axis, pos);
});

H.wrap(Axis.prototype, 'getTitlePosition', function (proceed) {
	var pos = proceed.apply(this, [].slice.call(arguments, 1));
	return fix3dPosition(this, pos);
});

wrap(Axis.prototype, 'drawCrosshair', function (proceed) {
	var args = arguments;
	if (this.chart.is3d()) {
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

/***
    Z-AXIS
***/

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
		axis.dataMin = axis.dataMax = axis.ignoreMinPadding = axis.ignoreMaxPadding = null;

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
					axis.dataMin = Math.min(pick(axis.dataMin, zData[0]), Math.min.apply(null, zData));
					axis.dataMax = Math.max(pick(axis.dataMax, zData[0]), Math.max.apply(null, zData));
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
		axisOptions.isX = true; //Z-Axis is shown horizontally, so it's kind of a X-Axis
		var zAxis = new ZAxis(chart, axisOptions);
		zAxis.setScale();
	});
});
