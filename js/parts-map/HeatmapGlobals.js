
var UNDEFINED,
	Axis = Highcharts.Axis,
	Chart = Highcharts.Chart,
	Color = Highcharts.Color,
	Legend = Highcharts.Legend,
	LegendSymbolMixin = Highcharts.LegendSymbolMixin,
	Series = Highcharts.Series,
	
	defaultOptions = Highcharts.getOptions(),
	each = Highcharts.each,
	extend = Highcharts.extend,
	extendClass = Highcharts.extendClass,
	merge = Highcharts.merge,
	pick = Highcharts.pick,
	numberFormat = Highcharts.numberFormat,
	seriesTypes = Highcharts.seriesTypes,
	wrap = Highcharts.wrap,
	noop = function () {};

	