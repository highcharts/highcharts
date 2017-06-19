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
var Series = H.Series,
	seriesType = H.seriesType;
/**
 * The scatter series type
 */
seriesType('scatter', 'line', 
/**
 * @extends {plotOptions.line}
 * @optionparent plotOptions.scatter
 */
{

	/**
	 * The width of the line connecting the data points.
	 * 
	 * @type {Number}
	 * @sample {highcharts} highcharts/plotoptions/scatter-linewidth-none/ 0 by default
	 * @sample {highcharts} highcharts/plotoptions/scatter-linewidth-1/ 1px
	 * @default {all} 0
	 * @product highcharts highstock
	 */
	lineWidth: 0,

	/**
	 */
	findNearestPointBy: 'xy',

	/**
	 */
	marker: {

		/**
		 */
		enabled: true // Overrides auto-enabling in line series (#3647)
	},

	/**
	 * A configuration object for the tooltip rendering of each single
	 * series. Properties are inherited from <a class="internal">#tooltip</a>.
	 * Overridable properties are `headerFormat`, `pointFormat`, `yDecimals`,
	 * `xDateFormat`, `yPrefix` and `ySuffix`. Unlike other series, in
	 * a scatter plot the series.name by default shows in the headerFormat
	 * and poin.x and point.y in the pointFormat.
	 * 
	 * @type {Object}
	 * @default {all} {}
	 * @product highstock
	 */
	tooltip: {
		/*= if (build.classic) { =*/
		headerFormat:
			'<span style="color:{point.color}">\u25CF</span> ' +
			'<span style="font-size: 0.85em"> {series.name}</span><br/>',
		/*= } else { =*/

		/**
		 */
		headerFormat: 
			'<span class="highcharts-color-{point.colorIndex}">\u25CF</span> ' +
			'<span class="highcharts-header"> {series.name}</span><br/>',
		/*= } =*/

		/**
		 */
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}

// Prototype members
}, {
	sorted: false,
	requireSorting: false,
	noSharedTooltip: true,
	trackerGroups: ['group', 'markerGroup', 'dataLabelsGroup'],
	takeOrdinalPosition: false, // #2342
	drawGraph: function () {
		if (this.options.lineWidth) {
			Series.prototype.drawGraph.call(this);
		}
	}
});
