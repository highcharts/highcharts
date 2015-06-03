(function (H) {
	var LegendSymbolMixin = H.LegendSymbolMixin,
		Series = H.Series;
/**
 * Set the default options for polygon
 */
H.defaultPlotOptions.polygon = H.merge(H.defaultPlotOptions.scatter, {
	marker: {
		enabled: false
	}
});

/**
 * The polygon series class
 */
H.seriesTypes.polygon = H.extendClass(H.seriesTypes.scatter, {
	type: 'polygon',
	fillGraph: true,
	// Close all segments
	getSegmentPath: function (segment) {
		return Series.prototype.getSegmentPath.call(this, segment).concat('z');
	},
	drawGraph: Series.prototype.drawGraph,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle
});

	return H;
}(Highcharts));
