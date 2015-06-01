(function (H) {
    var BarSeries;
/**
 * Set the default options for bar
 */
H.defaultPlotOptions.bar = H.merge(H.defaultPlotOptions.column);
/**
 * The Bar series class
 */
BarSeries = H.extendClass(H.seriesTypes.column, {
	type: 'bar',
	inverted: true
});
H.seriesTypes.bar = BarSeries;

    return H;
}(Highcharts));
