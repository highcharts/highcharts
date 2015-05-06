/**
 * The AreaSplineRangeSeries class
 */

Highcharts.defaultPlotOptions.areasplinerange = Highcharts.merge(Highcharts.defaultPlotOptions.arearange);

/**
 * AreaSplineRangeSeries object
 */
Highcharts.seriesTypes.areasplinerange = Highcharts.extendClass(Highcharts.seriesTypes.arearange, {
	type: 'areasplinerange',
	getPointSpline: Highcharts.seriesTypes.spline.prototype.getPointSpline
});

