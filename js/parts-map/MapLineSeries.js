


// The mapline series type
Highcharts.defaultPlotOptions.mapline = Highcharts.merge(Highcharts.defaultPlotOptions.map, {
	lineWidth: 1,
	fillColor: 'none'
});
Highcharts.seriesTypes.mapline = Highcharts.extendClass(Highcharts.seriesTypes.map, {
	type: 'mapline',
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'color',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		dashstyle: 'dashStyle'
	},
	drawLegendSymbol: Highcharts.seriesTypes.line.prototype.drawLegendSymbol
});