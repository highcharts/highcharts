/**
 * The AreaSplineRangeSeries class
 */

defaultPlotOptions.areasplinerange = merge(defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
Highcharts.seriesTypes.areasplinerange = extendClass(Highcharts.seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: Highcharts.seriesTypes.spline.prototype.getPointSpline
});

