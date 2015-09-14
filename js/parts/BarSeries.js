(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		merge = H.merge,
		seriesTypes = H.seriesTypes;
/**
 * Set the default options for bar
 */
defaultPlotOptions.bar = merge(defaultPlotOptions.column);
/**
 * The Bar series class
 */
seriesTypes.bar = extendClass(seriesTypes.column, {
	type: 'bar',
	inverted: true
});

    return H;
}(Highcharts));
