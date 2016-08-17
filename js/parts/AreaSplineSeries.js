import H from './Globals.js';
import './Utilities.js';
import './Legend.js';
import './AreaSeries.js';
import './SplineSeries.js';
	var areaProto = H.seriesTypes.area.prototype,
		defaultPlotOptions = H.defaultPlotOptions,
		extendClass = H.extendClass,
		LegendSymbolMixin = H.LegendSymbolMixin,
		merge = H.merge,
		seriesTypes = H.seriesTypes;
/**
 * Set the default options for areaspline
 */
defaultPlotOptions.areaspline = merge(defaultPlotOptions.area);

/**
 * AreaSplineSeries object
 */
seriesTypes.areaspline = extendClass(seriesTypes.spline, {
		type: 'areaspline',
		getStackPoints: areaProto.getStackPoints,
		getGraphPath: areaProto.getGraphPath,
		setStackCliffs: areaProto.setStackCliffs,
		drawGraph: areaProto.drawGraph,
		drawLegendSymbol: LegendSymbolMixin.drawRectangle
	});
