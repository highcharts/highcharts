/**
 * Streamgraph module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/*
@todo
 * - Check series labels module for labels directly on the graph
 * - It shares most of the code with percent stacks, consider adding it to the
 *   core directly.
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';

var each = H.each,
	Series = H.Series;

H.seriesType('streamgraph', 'areaspline', {
	fillOpacity: 1,
	lineWidth: 0,
	marker: {
		enabled: false
	},
	stacking: 'stream'
// Prototype functions
}, {
	negStacks: false,

	setStackedPoints: function () {
		Series.prototype.setStackedPoints.call(this);
		if (this.options.stacking === 'stream') {
			this.yAxis.useStream = true;
		}
	},

	/**
	 * A modified version of percent stacks.
	 */
	setStreamStacks: function () {
		var processedXData = this.processedXData,
			i = processedXData.length,
			stackIndicator,
			stacks = this.yAxis.stacks,
			x,
			stack,
			pointExtremes,
			key = this.stackKey;

		while (i--) {
			x = processedXData[i];
			stackIndicator = this.getStackIndicator(
				stackIndicator,
				x,
				this.index,
				key
			);
			stack = stacks[key] && stacks[key][x];
			pointExtremes = stack && stack.points[stackIndicator.key];
			if (pointExtremes) {
				// Y bottom value
				pointExtremes[0] -= stack.total / 2;
				// Y value
				pointExtremes[1] -= stack.total / 2;
				this.stackedYData[i] = this.index === 0 ?
					pointExtremes[1] :
					pointExtremes[0];
			}
		}
	}
});

H.wrap(H.Axis.prototype, 'buildStacks', function (proceed) {
	proceed.call(this);

	// Set stream stacks similar to percent stacks.
	if (this.useStream) {
		each(this.series, function (series) {
			series.setStreamStacks();
		});
	}
});

