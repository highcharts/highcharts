(function (H) {

// The mapline series type
H.defaultPlotOptions.mapline = H.merge(H.defaultPlotOptions.map, {
	lineWidth: 1,
	fillColor: 'none'
});
H.seriesTypes.mapline = H.extendClass(H.seriesTypes.map, {
	type: 'mapline',
	pointAttrToOptions: { // mapping between SVG attributes and the corresponding options
		stroke: 'color',
		'stroke-width': 'lineWidth',
		fill: 'fillColor',
		dashstyle: 'dashStyle'
	},
	drawLegendSymbol: H.seriesTypes.line.prototype.drawLegendSymbol
});
	return H;
}(Highcharts));
