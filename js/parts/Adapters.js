


// check for a custom HighchartsAdapter defined prior to this file
var globalAdapter = window.HighchartsAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, Highcharts.pathAnim);
}


// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
Highcharts.each = adapter.each;
var adapterRun = adapter.adapterRun,
	stop = adapter.stop;



