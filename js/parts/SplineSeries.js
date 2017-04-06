/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Options.js';
import './Series.js';
var pick = H.pick,
	seriesType = H.seriesType;

/**
 * Spline series type.
 * @constructor seriesTypes.spline
 * @extends {Series}
 */
seriesType('spline', 'line', {}, /** @lends seriesTypes.spline.prototype */ {
	/**
	 * Get the spline segment from a given point's previous neighbour to the given point
	 */
	getPointSpline: function (points, point, i) {
		var smoothing = 1.5, // 1 means control points midway between points, 2 means 1/3 from the point, 3 is 1/4 etc
			denom = smoothing + 1,
			plotX = point.plotX,
			plotY = point.plotY,
			lastPoint = points[i - 1],
			nextPoint = points[i + 1],
			leftContX,
			leftContY,
			rightContX,
			rightContY,
			ret;

		function doCurve(otherPoint) {
			return otherPoint &&
				!otherPoint.isNull &&
				otherPoint.doCurve !== false &&
				!point.isCliff; // #6387, area splines next to null
		}

		// Find control points
		if (doCurve(lastPoint) && doCurve(nextPoint)) {
			var lastX = lastPoint.plotX,
				lastY = lastPoint.plotY,
				nextX = nextPoint.plotX,
				nextY = nextPoint.plotY,
				correction = 0;

			leftContX = (smoothing * plotX + lastX) / denom;
			leftContY = (smoothing * plotY + lastY) / denom;
			rightContX = (smoothing * plotX + nextX) / denom;
			rightContY = (smoothing * plotY + nextY) / denom;

			// Have the two control points make a straight line through main point
			if (rightContX !== leftContX) { // #5016, division by zero
				correction = ((rightContY - leftContY) * (rightContX - plotX)) /
					(rightContX - leftContX) + plotY - rightContY;
			}

			leftContY += correction;
			rightContY += correction;

			// to prevent false extremes, check that control points are between
			// neighbouring points' y values
			if (leftContY > lastY && leftContY > plotY) {
				leftContY = Math.max(lastY, plotY);
				rightContY = 2 * plotY - leftContY; // mirror of left control point
			} else if (leftContY < lastY && leftContY < plotY) {
				leftContY = Math.min(lastY, plotY);
				rightContY = 2 * plotY - leftContY;
			}
			if (rightContY > nextY && rightContY > plotY) {
				rightContY = Math.max(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			} else if (rightContY < nextY && rightContY < plotY) {
				rightContY = Math.min(nextY, plotY);
				leftContY = 2 * plotY - rightContY;
			}

			// record for drawing in next point
			point.rightContX = rightContX;
			point.rightContY = rightContY;

			
		}

		// Visualize control points for debugging
		/*
		if (leftContX) {
			this.chart.renderer.circle(leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'red',
					'stroke-width': 2,
					fill: 'none',
					zIndex: 9
				})
				.add();
			this.chart.renderer.path(['M', leftContX + this.chart.plotLeft, leftContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'red',
					'stroke-width': 2,
					zIndex: 9
				})
				.add();
		}
		if (rightContX) {
			this.chart.renderer.circle(rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop, 2)
				.attr({
					stroke: 'green',
					'stroke-width': 2,
					fill: 'none',
					zIndex: 9
				})
				.add();
			this.chart.renderer.path(['M', rightContX + this.chart.plotLeft, rightContY + this.chart.plotTop,
				'L', plotX + this.chart.plotLeft, plotY + this.chart.plotTop])
				.attr({
					stroke: 'green',
					'stroke-width': 2,
					zIndex: 9
				})
				.add();
		}
		// */
		ret = [
			'C',
			pick(lastPoint.rightContX, lastPoint.plotX),
			pick(lastPoint.rightContY, lastPoint.plotY),
			pick(leftContX, plotX),
			pick(leftContY, plotY),
			plotX,
			plotY
		];
		lastPoint.rightContX = lastPoint.rightContY = null; // reset for updating series later
		return ret;
	}
});
