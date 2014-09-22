/**
 * Set the default options for areaspline
 */
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
var areaProto = AreaSeries.prototype,
	AreaSplineSeries = extendClass(SplineSeries, {
		type: 'areaspline',
//		closedStacks: true, // instead of following the previous graph back, follow the threshold back
		getGraphPath: areaProto.getGraphPath,
		setStackCliffs: areaProto.setStackCliffs,
		drawGraph: areaProto.drawGraph,
		drawLegendSymbol: LegendSymbolMixin.drawRectangle
	});

seriesTypes.areaspline = AreaSplineSeries;

