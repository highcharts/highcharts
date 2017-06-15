/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Legend.js';
import './AreaSeries.js';
import './SplineSeries.js';
var areaProto = H.seriesTypes.area.prototype,
	defaultPlotOptions = H.defaultPlotOptions,
	LegendSymbolMixin = H.LegendSymbolMixin,
	seriesType = H.seriesType;
/**
 * AreaSplineSeries object
 */
seriesType('areaspline', 'spline', defaultPlotOptions.area, {
	getStackPoints: areaProto.getStackPoints,
	getGraphPath: areaProto.getGraphPath,
	drawGraph: areaProto.drawGraph,
	drawLegendSymbol: LegendSymbolMixin.drawRectangle
});
