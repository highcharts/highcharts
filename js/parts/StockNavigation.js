


Chart.prototype.callbacks.push(function (chart) {
	var extremes,
		scroller = chart.scroller,
		rangeSelector = chart.rangeSelector;

	function renderRangeSelector() {
		extremes = chart.xAxis[0].getExtremes();
		if (isNumber(extremes.min)) {
			rangeSelector.render(extremes.min, extremes.max);
		}
	}

	function afterSetExtremesHandlerRangeSelector(e) {
		rangeSelector.render(e.min, e.max);
	}

	function destroyEvents() {
		if (rangeSelector) {
			removeEvent(chart, 'resize', renderRangeSelector);
			removeEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerRangeSelector);
		}
	}

	// initiate the scroller
	if (scroller) {
		extremes = chart.xAxis[0].getExtremes();
		scroller.render(extremes.min, extremes.max);
	}
	if (rangeSelector) {
		// redraw the scroller on setExtremes
		addEvent(chart.xAxis[0], 'afterSetExtremes', afterSetExtremesHandlerRangeSelector);

		// redraw the scroller chart resize
		addEvent(chart, 'resize', renderRangeSelector);

		// do it now
		renderRangeSelector();
	}

	// Remove resize/afterSetExtremes at chart destroy
	addEvent(chart, 'destroy', destroyEvents);
});
