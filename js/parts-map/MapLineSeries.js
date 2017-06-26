/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
var seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;

// The mapline series type
// 
/**
 * @extends {plotOptions.map}
 * @optionparent plotOptions.mapline
 */
seriesType('mapline', 'map', {
	/*= if (build.classic) { =*/

	/**
	 * The width of the map line.
	 * 
	 * @type {Number}
	 * @default 1
	 * @product highmaps
	 */
	lineWidth: 1,

	/**
	 * Fill color for the map line shapes
	 * 
	 * @type {Color}
	 * @default none
	 * @product highmaps
	 */
	fillColor: 'none'
	/*= } =*/
}, {
	type: 'mapline',
	colorProp: 'stroke',
	/*= if (build.classic) { =*/
	pointAttrToOptions: {
		'stroke': 'color',
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
