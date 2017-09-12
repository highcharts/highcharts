/**
 * Highcharts variwide module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * To do:
 * - When X axis is not categorized, the scale should reflect how the z values
 *   increase, like a horizontal stack. But then the actual X values aren't
 *   reflected the the axis.. Should we introduce a Z axis too?
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/AreaSeries.js';

var seriesType = H.seriesType,
	seriesTypes = H.seriesTypes,
	each = H.each,
	pick = H.pick;


seriesType('variwide', 'column', {
	pointPadding: 0,
	groupPadding: 0
}, {
	pointArrayMap: ['y', 'z'],
	parallelArrays: ['x', 'y', 'z'],
	processData: function () {
		var series = this;
		this.totalZ = 0;
		this.relZ = [];
		seriesTypes.column.prototype.processData.call(this);

		each(this.zData, function (z, i) {
			series.relZ[i] = series.totalZ;
			series.totalZ += z;
		});

		if (this.xAxis.categories) {
			this.xAxis.variwide = true;
		}
	},

	/**
	 * Translate an x value inside a given category index into the distorted
	 * axis translation.
	 * @param  {Number} i The category index
	 * @param  {Number} x The X pixel position in undistorted axis pixels
	 * @return {Number}   Distorted X position
	 */
	postTranslate: function (i, x) {

		var len = this.xAxis.len,
			totalZ = this.totalZ,
			relZ = this.relZ,
			linearSlotLeft = i / relZ.length * len,
			linearSlotRight = (i + 1) / relZ.length * len,
			slotLeft = (pick(relZ[i], totalZ) / totalZ) * len,
			slotRight = (pick(relZ[i + 1], totalZ) / totalZ) * len,
			xInsideLinearSlot = x - linearSlotLeft,
			ret;

		ret = slotLeft +
			xInsideLinearSlot * (slotRight - slotLeft) /
			(linearSlotRight - linearSlotLeft);

		return ret;
	},

	/**
	 * Extend translation by distoring X position based on Z.
	 */
	translate: function () {
		var inverted = this.chart.inverted;

		seriesTypes.column.prototype.translate.call(this);

		// Distort the points to reflect z dimension
		each(this.points, function (point, i) {
			var left = this.postTranslate(i, point.shapeArgs.x),
				right = this.postTranslate(
					i,
					point.shapeArgs.x + point.shapeArgs.width
				);

			point.shapeArgs.x = left;
			point.shapeArgs.width = right - left;

			if (!inverted) {
				point.tooltipPos[0] = this.postTranslate(
					i,
					point.tooltipPos[0]
				);
			}
		}, this);
	}
});

H.wrap(H.Tick.prototype, 'getPosition', function (proceed, horiz, pos) {
	var axis = this.axis,
		xy = proceed.apply(this, Array.prototype.slice.call(arguments, 1));

	if (horiz && axis.categories && axis.variwide) {
		this.xOrig = xy.x;
		xy.x =
			axis.pos +
			axis.series[0].postTranslate(pos, xy.x - axis.pos);
	}
	return xy;
});

H.wrap(H.Tick.prototype, 'getLabelPosition', function (
	proceed,
	x,
	y,
	label,
	horiz,
	labelOptions,
	tickmarkOffset,
	index
) {
	var args = Array.prototype.slice.call(arguments, 1),
		xy;

	// Replace the x with the original x
	if (this.axis.variwide && typeof this.xOrig === 'number') {
		args[0] = this.xOrig;
	}

	xy = proceed.apply(this, args);

	// Post-translate
	if (horiz && this.axis.variwide && this.axis.categories) {
		xy.x = this.axis.pos +
			this.axis.series[0].postTranslate(index, xy.x - this.axis.pos);
	}
	return xy;
});
