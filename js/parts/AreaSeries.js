/**
 * AreaSeries object
 */
var AreaSeries = extendClass(Series, {
	type: 'area',
	useThreshold: true
});
seriesTypes.area = AreaSeries;

