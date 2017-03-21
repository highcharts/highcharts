/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var perspective = H.perspective,
	pick = H.pick,
	Point = H.Point,
	seriesTypes = H.seriesTypes,
	wrap = H.wrap;

/*** 
	EXTENSION FOR 3D SCATTER CHART
***/

wrap(seriesTypes.scatter.prototype, 'translate', function (proceed) {
//function translate3d(proceed) {
	proceed.apply(this, [].slice.call(arguments, 1));

	if (!this.chart.is3d()) {
		return;
	}

	var series = this,
		chart = series.chart,
		zAxis = pick(series.zAxis, chart.options.zAxis[0]),
		rawPoints = [],
		rawPoint,
		projectedPoints,
		projectedPoint,
		zValue,
		i;

	for (i = 0; i < series.data.length; i++) {
		rawPoint = series.data[i];
		zValue = zAxis.isLog && zAxis.val2lin ? zAxis.val2lin(rawPoint.z) : rawPoint.z; // #4562
		rawPoint.plotZ = zAxis.translate(zValue);

		rawPoint.isInside = rawPoint.isInside ? (zValue >= zAxis.min && zValue <= zAxis.max) : false;

		rawPoints.push({
			x: rawPoint.plotX,
			y: rawPoint.plotY,
			z: rawPoint.plotZ
		});
	}

	projectedPoints = perspective(rawPoints, chart, true);

	for (i = 0; i < series.data.length; i++) {
		rawPoint = series.data[i];
		projectedPoint = projectedPoints[i];

		rawPoint.plotXold = rawPoint.plotX;
		rawPoint.plotYold = rawPoint.plotY;
		rawPoint.plotZold = rawPoint.plotZ;

		rawPoint.plotX = projectedPoint.x;
		rawPoint.plotY = projectedPoint.y;
		rawPoint.plotZ = projectedPoint.z;
	
	}

});


wrap(seriesTypes.scatter.prototype, 'init', function (proceed, chart, options) {
	if (chart.is3d()) {
		// add a third coordinate
		this.axisTypes = ['xAxis', 'yAxis', 'zAxis'];
		this.pointArrayMap = ['x', 'y', 'z'];
		this.parallelArrays = ['x', 'y', 'z'];

		// Require direct touch rather than using the k-d-tree, because the k-d-tree currently doesn't
		// take the xyz coordinate system into account (#4552)
		this.directTouch = true;
	}

	var result = proceed.apply(this, [chart, options]);

	if (this.chart.is3d()) {
		// Set a new default tooltip formatter
		var default3dScatterTooltip = 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>';
		if (this.userOptions.tooltip) {
			this.tooltipOptions.pointFormat = this.userOptions.tooltip.pointFormat || default3dScatterTooltip;
		} else {
			this.tooltipOptions.pointFormat = default3dScatterTooltip;
		}
	}
	return result;
});

/**
 * Updating zIndex for every point - based on the distance from point to camera
 */
wrap(seriesTypes.scatter.prototype, 'pointAttribs', function (proceed, point) {
	var pointOptions = proceed.apply(this, [].slice.call(arguments, 1));
	if (this.chart.is3d() && point) {
		pointOptions.zIndex = H.pointCameraDistance(point, this.chart);
	}
	return pointOptions;
});


wrap(Point.prototype, 'applyOptions', function (proceed) {
	var point = proceed.apply(this, [].slice.call(arguments, 1));

	if (this.series.chart.is3d() && point.z === undefined) {
		point.z = 0;
	}
	return point;
});
