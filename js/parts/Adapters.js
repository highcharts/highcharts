// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
var adapterRun,
	inArray,
	each,
	grep,
	offset,
	map,
	addEvent,
	removeEvent,
	fireEvent,
	washMouseEvent,
	animate,
	stop;

/**
 * Helper function to load and extend Highcharts with adapter functionality. 
 * @param  {object|function} adapter - HighchartsAdapter or jQuery
 */
Highcharts.loadAdapter = function (adapter) {
	var H = this;
	// If jQuery, then load our default jQueryAdapter
	if (adapter.fn && adapter.fn.jquery) {
		adapter = loadJQueryAdapter(adapter);
	}
	// Initialize the adapter.
	if (adapter.init) {
		adapter.init(pathAnim);
		delete adapter.init;
	}
	// Extend Highcharts with adapter functionality.
	H.extend(H, adapter);
	// Assign values to utility functions.
	adapterRun = H.adapterRun;
	inArray = H.inArray;
	each = H.each;
	grep = H.grep;
	offset = H.offset;
	map = H.map;
	addEvent = H.addEvent;
	removeEvent = H.removeEvent;
	fireEvent = H.fireEvent;
	washMouseEvent = H.washMouseEvent;
	animate = H.animate;
	stop = H.stop;
};

// Load adapter if HighchartsAdapter or jQuery is set on the window.
if (win.HighchartsAdapter) {
	Highcharts.loadAdapter(win.HighchartsAdapter);
} else if (win.jQuery) {
	Highcharts.loadAdapter(win.jQuery);
}
