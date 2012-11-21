/* ****************************************************************************
 * Start Waterfall series code											      *
 *****************************************************************************/

// 1 - set default options
defaultPlotOptions.waterfall = merge(defaultPlotOptions.column, {
});

// 2 - Create the series object
seriesTypes.waterfall = extendClass(seriesTypes.column, {
	type: 'waterfall',

	drawGraph: Series.prototype.drawGraph
});

/* ****************************************************************************
 * End Waterfall series code												*
 *****************************************************************************/
