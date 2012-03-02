/**
 * This script allows debugging by including the raw parts files without using a server backend
 */

var files = [
	"Globals.js",
	"Utilities.js",
	"PathAnimation.js",
	"Adapters.js",
	"Options.js",
	"Color.js",
	"SvgRenderer.js",
	"VmlRenderer.js",
	"CanVGRenderer.js",
	"Chart.js",
	"Series.js",
	"LineSeries.js",
	"AreaSeries.js",
	"SplineSeries.js",
	"AreaSplineSeries.js",
	"ColumnSeries.js",
	"BarSeries.js",
	"ScatterSeries.js",
	"PieSeries.js",
	"Facade.js"
];

// Parse the path from the script tag
var $tag = $('script[src$="highcharts.debug.js"]'),
	path = $tag.attr('src').replace('highcharts.debug.js', '') + 'parts/';

// Include the individual files
$.each(files, function (i, file) {
	document.write('<script src="' + path + file + '"></script>')	
});
