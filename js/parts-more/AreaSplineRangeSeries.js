(function (H) {
/**
 * The AreaSplineRangeSeries class
 */

H.defaultPlotOptions.areasplinerange = H.merge(H.defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
H.seriesTypes.areasplinerange = H.extendClass(H.seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: H.seriesTypes.spline.prototype.getPointSpline
});

	return H;
}(Highcharts));
