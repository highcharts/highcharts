/**
 * Set the default options for scatter
 */
defaultPlotOptions.scatter = merge(defaultSeriesOptions, {
	lineWidth: 0,
	tooltip: {
		headerFormat: '<span style="font-size: 10px; color:{series.color}">{series.name}</span><br/>',
		pointFormat: 'x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>',
		followPointer: true
	},
	stickyTracking: false
});

/**
 * The scatter series class
 */
var ScatterSeries = extendClass(Series, {
	type: 'scatter',
	sorted: false,
	requireSorting: false,
	noSharedTooltip: true,
	trackerGroups: ['markerGroup'],
	takeOrdinalPosition: false, // #2342
	singularTooltips: true,
	drawGraph: function () {
		if (this.options.lineWidth) {
			Series.prototype.drawGraph.call(this);
		}
	}
});

seriesTypes.scatter = ScatterSeries;

