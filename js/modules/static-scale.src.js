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
	if (H.isNumber(staticScale) && !axis.horiz && H.defined(axis.min)) {
		height = (axis.max - axis.min) * staticScale;
		diff = height - chart.plotHeight;
		chart.plotHeight = height;
		if (Math.abs(diff) >= 1) {

			// Before chart has rendered, wait for series to be rendered
			// before setting chart size.
			H.wrap(chart, 'renderSeries', function (chartProceed) {
				chartProceed.call(chart);
				if (!hasRendered) {
					chart.setSize(null, chart.chartHeight + diff, hasRendered);
				}
			});

			// After the chart has rendered, set chart size immediately.
			if (hasRendered) {
				chart.setSize(null, chart.chartHeight + diff, hasRendered);
			}

		}
	}
	proceed.call(axis);

});
