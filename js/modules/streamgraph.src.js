/**
 * Streamgraph module
 *
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';

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

	/**
	 * Modifier function for stream stacks. It simply moves the point up or down
	 * in order to center the full stack vertically.
	 */
	streamStacker: function (pointExtremes, stack, i) {
		// Y bottom value
		pointExtremes[0] -= stack.total / 2;
		// Y value
		pointExtremes[1] -= stack.total / 2;
		this.stackedYData[i] = this.index === 0 ?
			pointExtremes[1] :
			pointExtremes[0];
	}
});

