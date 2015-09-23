(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		defaultSeriesOptions = H.defaultSeriesOptions,
		extendClass = H.extendClass,
		merge = H.merge,
		Series = H.Series,
		seriesTypes = H.seriesTypes;
/**
 * Set the default options for scatter
 */
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	marker: {
		enabled: true // Overrides auto-enabling in line series (#3647)
	},
	tooltip: {
		headerFormat: '<span style="color:{point.color}">\u25CF</span> <span style="font-size: 0.85em"> {series.name}</span><br/>',
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>'
	}
});

/**
 * The scatter series class
 */
seriesTypes.scatter = extendClass(Series, {
	type: 'scatter',
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

	return H;
}(Highcharts));
