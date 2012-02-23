/**
 * Set the default options for bar
 */
defaultPlotOptions.bar = merge(defaultPlotOptions.column, {
	dataLabels: {
		align: 'left',
		x: 5,
		y: 0
	}
});
/**
 * The Bar series class
 */
var BarSeries = extendClass(ColumnSeries, {
	type: 'bar',
	init: function () {
		this.inverted = true;
		ColumnSeries.prototype.init.apply(this, arguments);
	}
});
seriesTypes.bar = BarSeries;

