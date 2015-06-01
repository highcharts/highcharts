(function (H) {
	var areaProto = H.seriesTypes.area.prototype,
		AreaSplineSeries,
		LegendSymbolMixin = H.LegendSymbolMixin;
/**
 * Set the default options for areaspline
 */
H.defaultPlotOptions.areaspline = H.merge(H.defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
AreaSplineSeries = H.extendClass(H.seriesTypes.spline, {
		type: 'areaspline',
		closedStacks: true, // instead of following the previous graph back, follow the threshold back
		
		// Mix in methods from the area series
		getSegmentPath: areaProto.getSegmentPath,
		closeSegment: areaProto.closeSegment,
		drawGraph: areaProto.drawGraph,
		drawLegendSymbol: LegendSymbolMixin.drawRectangle
	});

H.seriesTypes.areaspline = AreaSplineSeries;

	return H;
}(Highcharts));
