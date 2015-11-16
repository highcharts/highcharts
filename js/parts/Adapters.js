


// check for a custom HighchartsAdapter defined prior to this file
HighchartsAdapter = win.HighchartsAdapter || {};

// Initialize the adapter
if (HighchartsAdapter) {
	HighchartsAdapter.init(pathAnim);
	delete HighchartsAdapter.intit;
}
extend(Highcharts, HighchartsAdapter);


// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
var adapterRun = Highcharts.adapterRun,
	getScript = Highcharts.getScript,
	inArray = Highcharts.inArray,
	each = Highcharts.each,
	grep = Highcharts.grep,
	offset = Highcharts.offset,
	map = Highcharts.map,
	addEvent = Highcharts.addEvent,
	removeEvent = Highcharts.removeEvent,
	fireEvent = Highcharts.fireEvent,
	washMouseEvent = Highcharts.washMouseEvent,
	animate = Highcharts.animate,
	stop = Highcharts.stop;
