/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import '../parts/ScatterSeries.js';
var LegendSymbolMixin = H.LegendSymbolMixin,
	noop = H.noop,
	Series = H.Series,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;
/**
 * The polygon series prototype
 */

/**
 * @extends {plotOptions.scatter}
 * @optionsparent plotOptions.polygon
 */
seriesType('polygon', 'scatter', {
	marker: {
		enabled: false,
		states: {
			hover: {
				enabled: false
			}
		}
	},
	stickyTracking: false,
	tooltip: {
		followPointer: true,
		pointFormat: ''
	},
	trackByArea: true

// Prototype members
}, {
	type: 'polygon',
	getGraphPath: function () {

		var graphPath = Series.prototype.getGraphPath.call(this),
			i = graphPath.length + 1;

		// Close all segments
		while (i--) {
			if ((i === graphPath.length || graphPath[i] === 'M') && i > 0) {
				graphPath.splice(i, 0, 'z');
			}
		}
		this.areaPath = graphPath;
		return graphPath;
	},
	drawGraph: function () {
		/*= if (build.classic) { =*/
		this.options.fillColor = this.color; // Hack into the fill logic in area.drawGraph
		/*= } =*/
		seriesTypes.area.prototype.drawGraph.call(this);
	},
	drawLegendSymbol: LegendSymbolMixin.drawRectangle,
	drawTracker: Series.prototype.drawTracker,
	setStackedPoints: noop // No stacking points on polygons (#5310)
});
