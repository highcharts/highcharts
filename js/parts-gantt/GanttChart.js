/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';
import 'GanttSeries.js';

var each = H.each,
	map = H.map,
	merge = H.merge,
	splat = H.splat,
	Chart = H.Chart;

/**
 * The GanttChart class.
 * @class Highcharts.GanttChart
 * @memberOf Highcharts
 * @param {String|HTMLDOMElement} renderTo The DOM element to render to, or
 *                                         its id.
 * @param {ChartOptions}          options  The chart options structure.
 * @param {Function}              callback Function to run when the chart has
 *                                         loaded.
 */
H.GanttChart = H.ganttChart = function (renderTo, options, callback) {
	var hasRenderToArg = typeof renderTo === 'string' || renderTo.nodeName,
		seriesOptions = options.series,
		defaultOptions = H.getOptions(),
		defaultTickInterval = 1000 * 60 * 60 * 24, // Day
		defaultLabelFormat = '{value:%E}',
		defaultLinkedTo;
	options = arguments[hasRenderToArg ? 1 : 0];

	// If user hasn't defined axes as array, make it into an array and add a
	// second axis by default.
	if (!H.isArray(options.xAxis)) {
		options.xAxis = [options.xAxis || {}, {}];
	}

	// apply X axis options to both single and multi x axes
	options.xAxis = map(options.xAxis, function (xAxisOptions, i) {
		if (i === 1) { // Second xAxis
			defaultTickInterval = defaultTickInterval * 7; // Week
			defaultLabelFormat = '{value:Week %W}';
			defaultLinkedTo = 0;
		}
		return merge(
			defaultOptions.xAxis,
			{ // defaults
				grid: true,
				tickInterval: defaultTickInterval,
				labels: {
					format: defaultLabelFormat
				},
				opposite: true,
				linkedTo: defaultLinkedTo
			},
			xAxisOptions, // user options
			{ // forced options
				type: 'datetime'
			}
		);
	});

	// apply Y axis options to both single and multi y axes
	options.yAxis = map(splat(options.yAxis || {}), function (yAxisOptions) {
		return merge(
			defaultOptions.yAxis, // #3802
			{ // defaults
				grid: true,

				staticScale: 50,

				// Set default type tree-grid, but only if 'categories' is
				// undefined
				type: yAxisOptions.categories ? yAxisOptions.type : 'tree-grid'
			},
			yAxisOptions // user options
		);
	});

	options.series = null;

	options = merge(
		{
			chart: {
				type: 'gantt'
			},
			title: {
				text: null
			}
		},

		options // user's options
	);

	options.series = seriesOptions;

	each(options.series, function (series) {
		each(series.data, function (point) {
			H.seriesTypes.gantt.prototype.setGanttPointAliases(point);
		});
	});

	return hasRenderToArg ?
		new Chart(renderTo, options, callback) :
		new Chart(options, options);
};
