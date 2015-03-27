


// check for a custom HighchartsAdapter defined prior to this file
var globalAdapter = win.HighchartsAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, pathAnim);
}


// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
var adapterRun = adapter.adapterRun,
	getScript = adapter.getScript,
	inArray = adapter.inArray,
	each = Highcharts.each = adapter.each,
	grep = adapter.grep,
	offset = adapter.offset,
	map = adapter.map,
	addEvent = adapter.addEvent,
	removeEvent = adapter.removeEvent,
	fireEvent = adapter.fireEvent,
	washMouseEvent = adapter.washMouseEvent,
	animate = adapter.animate,
	stop = adapter.stop;



