/**
 * Set the default options for bar
 */
Highcharts.defaultPlotOptions.bar = Highcharts.merge(Highcharts.defaultPlotOptions.column);
/**
 * The Bar series class
 */
var BarSeries = Highcharts.extendClass(ColumnSeries, {
	type: 'bar',
	inverted: true
});
Highcharts.seriesTypes.bar = BarSeries;

