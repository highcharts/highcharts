/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import './BoxPlotSeries.js';
var each = H.each,
	noop = H.noop,
	seriesType = H.seriesType,
	seriesTypes = H.seriesTypes;


/* ****************************************************************************
 * Start error bar series code                                                *
 *****************************************************************************/

/**  
 * @extends {plotOptions.boxplot}
 * @optionparent plotOptions.errorbar
 */
seriesType('errorbar', 'boxplot', {
	/*= if (build.classic) { =*/

	/**
	 * The main color of the bars. This can be overridden by [stemColor](#plotOptions.
	 * errorbar.stemColor) and [whiskerColor](#plotOptions.errorbar.whiskerColor)
	 * individually.
	 * 
	 * @type {Color}
	 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
	 * @default #000000
	 * @since 3.0
	 * @product highcharts
	 */
	color: '${palette.neutralColor100}',
	/*= } =*/

	/**
	 */
	grouping: false,

	/**
	 * The parent series of the error bar. The default value links it to
	 * the previous series. Otherwise, use the id of the parent series.
	 * 
	 * @type {String}
	 * @default :previous
	 * @since 3.0
	 * @product highcharts
	 */
	linkedTo: ':previous',

	/**
	 */
	tooltip: {

		/**
		 */
		pointFormat: '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low}</b> - <b>{point.high}</b><br/>'
	},

	/**
	 * The line width of the whiskers, the horizontal lines marking low
	 * and high values. When `null`, the general [lineWidth](#plotOptions.
	 * errorbar.lineWidth) applies.
	 * 
	 * @type {Number}
	 * @sample {highcharts} highcharts/plotoptions/error-bar-styling/ Error bar styling
	 * @default null
	 * @since 3.0
	 * @product highcharts
	 */
	whiskerWidth: null

// Prototype members
}, {
	type: 'errorbar',
	pointArrayMap: ['low', 'high'], // array point configs are mapped to this
	toYData: function (point) { // return a plain array for speedy calculation
		return [point.low, point.high];
	},
	pointValKey: 'high', // defines the top of the tracker
	doQuartiles: false,
	drawDataLabels: seriesTypes.arearange ? function () {
		var valKey = this.pointValKey;
		seriesTypes.arearange.prototype.drawDataLabels.call(this);
		// Arearange drawDataLabels does not reset point.y to high, but to low after drawing. #4133 
		each(this.data, function (point) {
			point.y = point[valKey];
		});
	} : noop,

	/**
	 * Get the width and X offset, either on top of the linked series column
	 * or standalone
	 */
	getColumnMetrics: function () {
		return (this.linkedParent && this.linkedParent.columnMetrics) ||
			seriesTypes.column.prototype.getColumnMetrics.call(this);
	}
});

/* ****************************************************************************
 * End error bar series code                                                  *
 *****************************************************************************/
