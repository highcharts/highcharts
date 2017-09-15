/**
 * (c) 2010-2017 Torstein Honsi
 *
 * Scatter 3D series.
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var Point = H.Point,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;


seriesType('scatter3d', 'scatter', {
	tooltip: {
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>z: <b>{point.z}</b><br/>'
	}

// Series class
}, {
	pointAttribs: function (point) {
		var attribs = seriesTypes.scatter.prototype.pointAttribs
			.apply(this, arguments);

		if (this.chart.is3d() && point) {
			attribs.zIndex = H.pointCameraDistance(point, this.chart);
		}

		return attribs;
	},
	axisTypes: ['xAxis', 'yAxis', 'zAxis'],
	pointArrayMap: ['x', 'y', 'z'],
	parallelArrays: ['x', 'y', 'z'],

	// Require direct touch rather than using the k-d-tree, because the k-d-tree
	// currently doesn't take the xyz coordinate system into account (#4552)
	directTouch: true

// Point class
}, {
	applyOptions: function () {
		Point.prototype.applyOptions.apply(this, arguments);
		if (this.z === undefined) {
			this.z = 0;
		}

		return this;
	}

});
