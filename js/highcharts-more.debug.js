/**
 * This script allows debugging by including the raw parts files without using a server backend
 */

var files = [
    "Globals.js",
    "AreaRangeSeries.js",
	"GaugeSeries.js"
];

// Parse the path from the script tag
var $tag = $('script[src$="highcharts.debug.js"]'),
	path = $tag.attr('src').replace('highcharts.debug.js', '') + 'parts/';

// Include the individual files
$.each(files, function (i, file) {
	document.write('<script src="' + path + file + '"></script>')	
});
