(function (H) {
	var areaProto = H.seriesTypes.area.prototype,
		defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		LegendSymbolMixin = H.LegendSymbolMixin,
		merge = H.merge,
		seriesTypes = H.seriesTypes;
/**
 * Set the default options for areaspline
 */
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
seriesTypes.areaspline = extendClass(seriesTypes.spline, {
		type: 'areaspline',
		closedStacks: true, // instead of following the previous graph back, follow the threshold back
		
		// Mix in methods from the area series
		getSegmentPath: areaProto.getSegmentPath,
		closeSegment: areaProto.closeSegment,
		drawGraph: areaProto.drawGraph,
		drawLegendSymbol: LegendSymbolMixin.drawRectangle
	});

	return H;
}(Highcharts));
