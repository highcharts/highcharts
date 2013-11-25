/**
 *	Shorthand notations of often used functions and variables
 */

var SVG_NS = 'http://www.w3.org/2000/svg';

var H = Highcharts,
	HC = H.Chart,
	HC3 = H.Chart3D,
	HR = H.SVGRenderer,
	HA = H.Axis;

// To get the length of an associative array.
function arraySize(array) {
	var size = 0, 
	key;

	for (key in array) {
		if (array.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
}
