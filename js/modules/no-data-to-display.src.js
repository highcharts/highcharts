/**
 * Plugin for displaying a message when there is no data visible in chart.
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Series.js';
import '../parts/Options.js';
	
var seriesTypes = H.seriesTypes,
	chartPrototype = H.Chart.prototype,
	defaultOptions = H.getOptions(),
	extend = H.extend,
	each = H.each;

// Add language option
extend(defaultOptions.lang, {
	noData: 'No data to display'
});

// Add default display options for message
/**
 * Options for displaying a message like "No data to display". 
 * This feature requires the file no-data-to-display.js to be loaded in the page. 
 * The actual text to display is set in the lang.noData option.
 * @type {Object}
 * @optionparent noData
 */
defaultOptions.noData = {

	/**
	 * The position of the no-data label, relative to the plot area.
	 * 
	 * @type {Object}
	 * @default { "x": 0, "y": 0, "align": "center", "verticalAlign": "middle" }
	 * @since 3.0.8
	 * @product highcharts highstock highmaps
	 */
	position: {

		/**
		 * Horizontal offset of the label, in pixels.
		 * 
		 * @type {Number}
		 * @default 0
		 * @product highcharts highstock
		 */
		x: 0,

		/**
		 * Vertical offset of the label, in pixels.
		 * 
		 * @type {Number}
		 * @default 0
		 * @product highcharts highstock
		 */
		y: 0,			

		/**
		 * Horizontal alignment of the label.
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @default center
		 * @product highcharts highstock highmaps
		 */
		align: 'center',

		/**
		 * Vertical alignment of the label.
		 * 
		 * @validvalue ["top", "middle", "bottom"]
		 * @type {String}
		 * @default middle
		 * @product highcharts highstock
		 */
		verticalAlign: 'middle'
	}
	// useHTML: false
};

/*= if (build.classic) { =*/
// Presentational
/**
 * CSS styles for the no-data label.
 * @optionparent noData.style
 */
defaultOptions.noData.style = {

	/**
	 */
	fontWeight: 'bold',

	/**
	 */
	fontSize: '12px',

	/**
	 */
	color: '${palette.neutralColor60}'
};
/*= } =*/


// Define hasData function for non-cartesian seris. Returns true if the series
// has points at all.
each([
	'bubble',
	'gauge',
	'heatmap',
	'pie',
	'treemap',
	'waterfall'
], function (type) {
	if (seriesTypes[type]) {
		seriesTypes[type].prototype.hasData = function () {
			return !!this.points.length; /* != 0 */
		};
	}
});

/**
 * Define hasData functions for series. These return true if there are data
 * points on this series within the plot area.
 */
H.Series.prototype.hasData = function () {
	return this.visible && this.dataMax !== undefined && this.dataMin !== undefined; // #3703
};

/**
 * Display a no-data message.
 *
 * @param {String} str An optional message to show in place of the default one 
 */
chartPrototype.showNoData = function (str) {
	var chart = this,
		options = chart.options,
		text = str || options.lang.noData,
		noDataOptions = options.noData;

	if (!chart.noDataLabel) {
		chart.noDataLabel = chart.renderer
			.label(
				text, 
				0, 
				0, 
				null, 
				null, 
				null, 
				noDataOptions.useHTML, 
				null, 
				'no-data'
			);

		/*= if (build.classic) { =*/
		chart.noDataLabel
			.attr(noDataOptions.attr)
			.css(noDataOptions.style);
		/*= } =*/

		chart.noDataLabel.add();

		chart.noDataLabel.align(extend(chart.noDataLabel.getBBox(), noDataOptions.position), false, 'plotBox');
	}
};

/**
 * Hide no-data message	
 */	
chartPrototype.hideNoData = function () {
	var chart = this;
	if (chart.noDataLabel) {
		chart.noDataLabel = chart.noDataLabel.destroy();
	}
};

/**
 * Returns true if there are data points within the plot area now
 */	
chartPrototype.hasData = function () {
	var chart = this,
		series = chart.series,
		i = series.length;

	while (i--) {
		if (series[i].hasData() && !series[i].options.isInternal) { 
			return true;
		}	
	}

	return chart.loadingShown; // #4588
};

/**
 * Show no-data message if there is no data in sight. Otherwise, hide it.
 */
function handleNoData() {
	var chart = this;
	if (chart.hasData()) {
		chart.hideNoData();
	} else {
		chart.showNoData();
	}
}

/**
 * Add event listener to handle automatic display of no-data message
 */
chartPrototype.callbacks.push(function (chart) {
	H.addEvent(chart, 'load', handleNoData);
	H.addEvent(chart, 'redraw', handleNoData);
});
