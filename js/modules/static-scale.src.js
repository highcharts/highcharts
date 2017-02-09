/**
 * (c) 2017 Torstein Honsi, Lars Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var Chart = H.Chart,
	each = H.each,
	pick = H.pick;

Chart.prototype.adjustHeight = function () {
	each(this.axes, function (axis) {
		var chart = axis.chart,
			animate = !!chart.initiatedScale,
			staticScale = axis.options.staticScale,
			height,
			diff;
		if (
			H.isNumber(staticScale) &&
			!axis.horiz &&
			H.defined(axis.min) &&
			!chart.settingSize // Prevent recursion
		) {
			height = pick(axis.unitLength, axis.max - axis.min) * staticScale;
			diff = height - chart.plotHeight;
			chart.oldPlotHeight = chart.plotHeight;
			chart.plotHeight = height;
			if (Math.abs(diff) >= 1) {

				chart.settingSize = true;
				chart.setSize(null, chart.chartHeight + diff, animate);
				chart.settingSize = false;
			}
		}
		
	});
	this.initiatedScale = true;
};
H.addEvent(Chart.prototype, 'render', Chart.prototype.adjustHeight);
