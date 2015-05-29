/**
 * Set the default options for areaspline
 */
Highcharts.defaultPlotOptions.areaspline = Highcharts.merge(Highcharts.defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
var areaProto = AreaSeries.prototype,
	AreaSplineSeries = Highcharts.extendClass(SplineSeries, {
		type: 'areaspline',
		closedStacks: true, // instead of following the previous graph back, follow the threshold back
		
		// Mix in methods from the area series
		getSegmentPath: areaProto.getSegmentPath,
		closeSegment: areaProto.closeSegment,
		drawGraph: areaProto.drawGraph,
		drawLegendSymbol: Highcharts.LegendSymbolMixin.drawRectangle
	});

Highcharts.seriesTypes.areaspline = AreaSplineSeries;

