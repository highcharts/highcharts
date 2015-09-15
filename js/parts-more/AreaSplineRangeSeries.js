(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		merge = H.merge,
		seriesTypes = H.seriesTypes;
/**
 * The AreaSplineRangeSeries class
 */

defaultPlotOptions.areasplinerange = merge(defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
seriesTypes.areasplinerange = extendClass(seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: seriesTypes.spline.prototype.getPointSpline
});

	return H;
}(Highcharts));
