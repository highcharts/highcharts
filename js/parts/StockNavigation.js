/**
 * (c) 2010-2016 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Chart.js';
var addEvent = H.addEvent,
	Chart = H.Chart,
	isNumber = H.isNumber;

Chart.prototype.callbacks.push(function (chart) {
	var extremes,
		scroller = chart.scroller,
		rangeSelector = chart.rangeSelector,
		unbindRender,
		unbindSetExtremes;

	function renderRangeSelector() {
		extremes = chart.xAxis[0].getExtremes();
		if (isNumber(extremes.min)) {
			rangeSelector.render(extremes.min, extremes.max);
		}
	}

	// initiate the scroller
	if (scroller) {
		extremes = chart.xAxis[0].getExtremes();
		scroller.render(extremes.min, extremes.max);
	}
	if (rangeSelector) {
		// redraw the scroller on setExtremes
		unbindSetExtremes = addEvent(
			chart.xAxis[0],
			'afterSetExtremes',
			function (e) {
				rangeSelector.render(e.min, e.max);
			}
		);

		// redraw the scroller chart resize
		unbindRender = addEvent(chart, 'redraw', renderRangeSelector);

		// do it now
		renderRangeSelector();
	}

	// Remove resize/afterSetExtremes at chart destroy
	addEvent(chart, 'destroy', function destroyEvents() {
		if (rangeSelector) {
			unbindRender();
			unbindSetExtremes();
		}
	});
});
