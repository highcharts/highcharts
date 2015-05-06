/**
 * Set the default options for polygon
 */
Highcharts.defaultPlotOptions.polygon = Highcharts.merge(Highcharts.defaultPlotOptions.scatter, {
	marker: {
		enabled: false
	}
});

/**
 * The polygon series class
 */
Highcharts.seriesTypes.polygon = Highcharts.extendClass(Highcharts.seriesTypes.scatter, {
	type: 'polygon',
	fillGraph: true,
	// Close all segments
	getSegmentPath: function (segment) {
		return Series.prototype.getSegmentPath.call(this, segment).concat('z');
	},
	drawGraph: Series.prototype.drawGraph,
	drawLegendSymbol: Highcharts.LegendSymbolMixin.drawRectangle
});
