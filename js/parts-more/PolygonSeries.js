import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Series.js';
import '../parts/Legend.js';
import '../parts/ScatterSeries.js';
(function () {
	var defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		LegendSymbolMixin = H.LegendSymbolMixin,
		merge = H.merge,
		Series = H.Series,
		seriesTypes = H.seriesTypes;
/**
 * Set the default options for polygon
 */
defaultPlotOptions.polygon = merge(defaultPlotOptions.scatter, {
	marker: {
		enabled: false
	}
});

/**
 * The polygon series class
 */
seriesTypes.polygon = extendClass(seriesTypes.scatter, {
	type: 'polygon',
	/*= if (build.classic) { =*/
	fillGraph: true,
	/*= } =*/
	// Close all segments
	getGraphPath: function (segment) {
		return Series.prototype.getGraphPath.call(this, segment).concat('z');
	},
	drawGraph: Series.prototype.drawGraph,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle
});

}());
