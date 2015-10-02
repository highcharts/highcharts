(function (H) {
	var defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		merge = H.merge,
		seriesTypes = H.seriesTypes;

// The mapline series type
defaultPlotOptions.mapline = merge(defaultPlotOptions.map, {
	lineWidth: 1,
	fillColor: 'none'
});
seriesTypes.mapline = extendClass(seriesTypes.map, {
	type: 'mapline',
	/**
	 * Get presentational attributes
	 */
	strokeWidthOption: 'lineWidth',
	pointAttribs: function (point, state) {
		var attr = seriesTypes.map.prototype.pointAttribs.call(this, point, state);

		// The difference from a map series is that the stroke takes the point color
		attr.stroke = attr.fill;
		attr.fill = this.options.fillColor;

		return attr;
	},
	drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
});
	return H;
}(Highcharts));
