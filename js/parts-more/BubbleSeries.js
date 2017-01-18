/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Axis.js';
import '../parts/Color.js';
import '../parts/Point.js';
import '../parts/Series.js';
import '../parts/ScatterSeries.js';
var arrayMax = H.arrayMax,
	arrayMin = H.arrayMin,
	Axis = H.Axis,
	color = H.color,
	each = H.each,
	isNumber = H.isNumber,
	noop = H.noop,
	pick = H.pick,
	pInt = H.pInt,
	Point = H.Point,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

/* ****************************************************************************
 * Start Bubble series code											          *
 *****************************************************************************/

seriesType('bubble', 'scatter', {
	dataLabels: {
		formatter: function () { // #2945
			return this.point.z;
		},
		inside: true,
		verticalAlign: 'middle'
	},
	// displayNegative: true,
	marker: {
		/*= if (build.classic) { =*/
		// fillOpacity: 0.5,
		lineColor: null, // inherit from series.color
		lineWidth: 1,
		/*= } =*/
		// Avoid offset in Point.setState
		radius: null,
		states: {
			hover: {
				radiusPlus: 0
			}
		},
		symbol: 'circle'
	},
	minSize: 8,
	maxSize: '20%',
	// negativeColor: null,
	// sizeBy: 'area'
	softThreshold: false,
	states: {
		hover: {
			halo: {
				size: 5
			}
		}
	},
	tooltip: {
		pointFormat: '({point.x}, {point.y}), Size: {point.z}'
	},
	turboThreshold: 0,
	zThreshold: 0,
	zoneAxis: 'z'

// Prototype members
}, {
	pointArrayMap: ['y', 'z'],
	parallelArrays: ['x', 'y', 'z'],
	trackerGroups: ['markerGroup', 'dataLabelsGroup'],
	bubblePadding: true,
	zoneAxis: 'z',

	/*= if (build.classic) { =*/
	pointAttribs: function (point, state) {
		var markerOptions = this.options.marker,
			fillOpacity = pick(markerOptions.fillOpacity, 0.5),
			attr = Series.prototype.pointAttribs.call(this, point, state);

		if (fillOpacity !== 1) {
			attr.fill = color(attr.fill).setOpacity(fillOpacity).get('rgba');
		}

		return attr;
	},
	/*= } =*/

	/**
	 * Get the radius for each point based on the minSize, maxSize and each point's Z value. This
	 * must be done prior to Series.translate because the axis needs to add padding in
	 * accordance with the point sizes.
	 */
	getRadii: function (zMin, zMax, minSize, maxSize) {
		var len,
			i,
			pos,
			zData = this.zData,
			radii = [],
			options = this.options,
			sizeByArea = options.sizeBy !== 'width',
			zThreshold = options.zThreshold,
			zRange = zMax - zMin,
			value,
			radius;

		// Set the shape type and arguments to be picked up in drawPoints
		for (i = 0, len = zData.length; i < len; i++) {

			value = zData[i];

			// When sizing by threshold, the absolute value of z determines the size
			// of the bubble.
			if (options.sizeByAbsoluteValue && value !== null) {
				value = Math.abs(value - zThreshold);
				zMax = Math.max(zMax - zThreshold, Math.abs(zMin - zThreshold));
				zMin = 0;
			}

			if (value === null) {
				radius = null;
			// Issue #4419 - if value is less than zMin, push a radius that's always smaller than the minimum size
			} else if (value < zMin) {
				radius = minSize / 2 - 1;
			} else {
				// Relative size, a number between 0 and 1
				pos = zRange > 0 ? (value - zMin) / zRange : 0.5;

				if (sizeByArea && pos >= 0) {
					pos = Math.sqrt(pos);
				}
				radius = Math.ceil(minSize + pos * (maxSize - minSize)) / 2;
			}
			radii.push(radius);
		}
		this.radii = radii;
	},

	/**
	 * Perform animation on the bubbles
	 */
	animate: function (init) {
		var animation = this.options.animation;

		if (!init) { // run the animation
			each(this.points, function (point) {
				var graphic = point.graphic,
					animationTarget;

				if (graphic && graphic.width) { // URL symbols don't have width
					animationTarget = {
						x: graphic.x,
						y: graphic.y,
						width: graphic.width,
						height: graphic.height
					};

					// Start values
					graphic.attr({
						x: point.plotX,
						y: point.plotY,
						width: 1,
						height: 1
					});

					// Run animation
					graphic.animate(animationTarget, animation);
				}
			});

			// delete this function to allow it only once
			this.animate = null;
		}
	},

	/**
	 * Extend the base translate method to handle bubble size
	 */
	translate: function () {

		var i,
			data = this.data,
			point,
			radius,
			radii = this.radii;

		// Run the parent method
		seriesTypes.scatter.prototype.translate.call(this);

		// Set the shape type and arguments to be picked up in drawPoints
		i = data.length;

		while (i--) {
			point = data[i];
			radius = radii ? radii[i] : 0; // #1737

			if (isNumber(radius) && radius >= this.minPxSize / 2) {
				// Shape arguments
				point.marker = {
					radius: radius,
					width: 2 * radius,
					height: 2 * radius
				};

				// Alignment box for the data label
				point.dlBox = {
					x: point.plotX - radius,
					y: point.plotY - radius,
					width: 2 * radius,
					height: 2 * radius
				};
			} else { // below zThreshold
				point.shapeArgs = point.plotY = point.dlBox = undefined; // #1691
			}
		}
	},

	alignDataLabel: seriesTypes.column.prototype.alignDataLabel,
	buildKDTree: noop,
	applyZones: noop

// Point class
}, {
	haloPath: function (size) {
		return Point.prototype.haloPath.call(
			this, 
			size === 0 ? 0 : this.marker.radius + size // #6067
		);
	},
	ttBelow: false
});

/**
 * Add logic to pad each axis with the amount of pixels
 * necessary to avoid the bubbles to overflow.
 */
Axis.prototype.beforePadding = function () {
	var axis = this,
		axisLength = this.len,
		chart = this.chart,
		pxMin = 0,
		pxMax = axisLength,
		isXAxis = this.isXAxis,
		dataKey = isXAxis ? 'xData' : 'yData',
		min = this.min,
		extremes = {},
		smallestSize = Math.min(chart.plotWidth, chart.plotHeight),
		zMin = Number.MAX_VALUE,
		zMax = -Number.MAX_VALUE,
		range = this.max - min,
		transA = axisLength / range,
		activeSeries = [];

	// Handle padding on the second pass, or on redraw
	each(this.series, function (series) {

		var seriesOptions = series.options,
			zData;

		if (series.bubblePadding && (series.visible || !chart.options.chart.ignoreHiddenSeries)) {

			// Correction for #1673
			axis.allowZoomOutside = true;

			// Cache it
			activeSeries.push(series);

			if (isXAxis) { // because X axis is evaluated first

				// For each series, translate the size extremes to pixel values
				each(['minSize', 'maxSize'], function (prop) {
					var length = seriesOptions[prop],
						isPercent = /%$/.test(length);

					length = pInt(length);
					extremes[prop] = isPercent ?
						smallestSize * length / 100 :
						length;

				});
				series.minPxSize = extremes.minSize;
				// Prioritize min size if conflict to make sure bubbles are
				// always visible. #5873
				series.maxPxSize = Math.max(extremes.maxSize, extremes.minSize);

				// Find the min and max Z
				zData = series.zData;
				if (zData.length) { // #1735
					zMin = pick(seriesOptions.zMin, Math.min(
						zMin,
						Math.max(
							arrayMin(zData), 
							seriesOptions.displayNegative === false ? seriesOptions.zThreshold : -Number.MAX_VALUE
						)
					));
					zMax = pick(seriesOptions.zMax, Math.max(zMax, arrayMax(zData)));
				}
			}
		}
	});

	each(activeSeries, function (series) {

		var data = series[dataKey],
			i = data.length,
			radius;

		if (isXAxis) {
			series.getRadii(zMin, zMax, series.minPxSize, series.maxPxSize);
		}

		if (range > 0) {
			while (i--) {
				if (isNumber(data[i]) && axis.dataMin <= data[i] && data[i] <= axis.dataMax) {
					radius = series.radii[i];
					pxMin = Math.min(((data[i] - min) * transA) - radius, pxMin);
					pxMax = Math.max(((data[i] - min) * transA) + radius, pxMax);
				}
			}
		}
	});

	if (activeSeries.length && range > 0 && !this.isLog) {
		pxMax -= axisLength;
		transA *= (axisLength + pxMin - pxMax) / axisLength;
		each([['min', 'userMin', pxMin], ['max', 'userMax', pxMax]], function (keys) {
			if (pick(axis.options[keys[0]], axis[keys[1]]) === undefined) {
				axis[keys[0]] += keys[2] / transA; 
			}
		});
	}
};

/* ****************************************************************************
 * End Bubble series code                                                     *
 *****************************************************************************/
