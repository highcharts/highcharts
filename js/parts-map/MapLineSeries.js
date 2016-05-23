import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
(function () {
	var defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		merge = H.merge,
		seriesTypes = H.seriesTypes;

// The mapline series type
defaultPlotOptions.mapline = merge(defaultPlotOptions.map, {
	/*= if (build.classic) { =*/
	lineWidth: 1,
	fillColor: 'none'
	/*= } =*/
});
seriesTypes.mapline = extendClass(seriesTypes.map, {
	type: 'mapline',
	colorProp: 'stroke',
	/*= if (build.classic) { =*/
	pointAttrToOptions: {
		'stroke-width': 'lineWidth'
	},
	/**
	 * Get presentational attributes
	 */
	pointAttribs: function (point, state) {
		var attr = seriesTypes.map.prototype.pointAttribs.call(this, point, state);

		// The difference from a map series is that the stroke takes the point color
		attr.fill = this.options.fillColor;

		return attr;
	},
	/*= } =*/
	drawLegendSymbol: seriesTypes.line.prototype.drawLegendSymbol
});
}());
