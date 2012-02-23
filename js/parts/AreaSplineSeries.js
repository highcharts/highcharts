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
		
		// Mix in methods from the area series
		getSegmentPath: areaProto.getSegmentPath,
		drawGraph: areaProto.drawGraph
	});
seriesTypes.areaspline = AreaSplineSeries;

