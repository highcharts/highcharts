(function (H) {
// check for a custom HighchartsAdapter defined prior to this file
var globalAdapter = window.HighchartsAdapter,
	adapter = globalAdapter || {};
	
// Initialize the adapter
if (globalAdapter) {
	globalAdapter.init.call(globalAdapter, H.pathAnim);
}


// Utility functions. If the HighchartsAdapter is not defined, adapter is an empty object
// and all the utility functions will be null. In that case they are populated by the
// default adapters below.
H.adapterRun = adapter.adapterRun;
H.addAnimSetter = adapter.addAnimSetter;
H.addEvent = adapter.addEvent;
H.animate = adapter.animate;
H.each = adapter.each;
H.getScript = adapter.getScript;
H.grep = adapter.grep;
H.map = adapter.map;
H.inArray = adapter.inArray;
H.fireEvent = adapter.fireEvent;
H.removeEvent = adapter.removeEvent;
H.stop = adapter.stop;

    return H;
}(Highcharts));
