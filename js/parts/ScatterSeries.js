/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Options.js';
import './Series.js';
var Series = H.Series,
	seriesType = H.seriesType;
/**
 * The scatter series type
 */
seriesType('scatter', 'line', {
	lineWidth: 0,
	marker: {
		enabled: true // Overrides auto-enabling in line series (#3647)
	},
	tooltip: {
		/*= if (build.classic) { =*/
		headerFormat:
			'<span style="color:{point.color}">\u25CF</span> ' +
			'<span style="font-size: 0.85em"> {series.name}</span><br/>',
		/*= } else { =*/
		headerFormat: 
			'<span class="highcharts-color-{point.colorIndex}">\u25CF</span> ' +
			'<span class="highcharts-header"> {series.name}</span><br/>',
		/*= } =*/
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}

// Prototype members
}, {
	sorted: false,
	requireSorting: false,
	noSharedTooltip: true,
	trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
	takeOrdinalPosition: false, // #2342
	kdDimensions: 2,
	drawGraph: function () {
		if (this.options.lineWidth) {
			Series.prototype.drawGraph.call(this);
		}
	}
});
