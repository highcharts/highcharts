/**
 * The AreaSplineRangeSeries class
 */

defaultPlotOptions.areasplinerange = Highcharts.merge(defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
Highcharts.seriesTypes.areasplinerange = Highcharts.extendClass(Highcharts.seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: Highcharts.seriesTypes.spline.prototype.getPointSpline
});

