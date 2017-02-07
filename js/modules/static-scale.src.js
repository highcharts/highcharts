/**
 * (c) 2017 Torstein Honsi, Lars Cabrera
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

H.wrap(H.Axis.prototype, 'setAxisSize', function (proceed) {

	var axis = this,
		chart = axis.chart,
		hasRendered = !!chart.hasRendered,
		staticScale = axis.options.staticScale,
		height,
		diff;
	if (
			H.isNumber(staticScale) &&
			!axis.horiz &&
			H.defined(axis.min) &&
			!chart.settingSize
	) {
		height = (axis.max - axis.min) * staticScale;
		diff = height - chart.plotHeight;
		chart.oldPlotHeight = chart.plotHeight;
		chart.plotHeight = height;
		if (Math.abs(diff) >= 1) {

			// After the chart has rendered, set chart size immediately.
			if (hasRendered) {
				chart.settingSize = true;
				chart.setSize(null, chart.chartHeight + diff, hasRendered);
				chart.settingSize = false;
			}
		}
	}
	proceed.call(axis);

});

H.wrap(H.Chart.prototype, 'renderSeries', function (chartProceed) {
	var chart = this,
		hasRendered = !!chart.hasRendered,
		diff = chart.plotHeight - chart.oldPlotHeight;

	// Before chart has rendered, wait for series to be rendered
	// before setting chart size.
	if (!hasRendered) {
		chart.setSize(null, chart.chartHeight + diff, hasRendered);
	}
	chartProceed.call(chart);
});
