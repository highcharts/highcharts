/**
 * Set the default options for bar
 */
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: null,
		verticalAlign: 'middle'
	}
});
/**
 * The Bar series class
 */
var BarSeries = extendClass(ColumnSeries, {
	type: 'bar',
	inverted: true
});
seriesTypes.bar = BarSeries;

