/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Options.js';
import '../parts/Chart.js';
import '../parts/SvgRenderer.js';
var Chart = H.Chart,
	defaultOptions = H.defaultOptions,
	each = H.each,
	extend = H.extend,
	merge = H.merge,
	pick = H.pick,
	Renderer = H.Renderer,
	SVGRenderer = H.SVGRenderer,
	VMLRenderer = H.VMLRenderer;


// Add language
extend(defaultOptions.lang, {
	zoomIn: 'Zoom in',
	zoomOut: 'Zoom out'
});


// Set the default map navigation options
defaultOptions.mapNavigation = {
	buttonOptions: {
		alignTo: 'plotBox',
		align: 'left',
		verticalAlign: 'top',
		x: 0,
		width: 18,
		height: 18,
		padding: 5,
		/*= if (build.classic) { =*/
		style: {
			fontSize: '15px',
			fontWeight: 'bold'
		},
		theme: {
			'stroke-width': 1,
			'text-align': 'center'
		}
		/*= } =*/
	},
	buttons: {
		zoomIn: {
			onclick: function () {
				this.mapZoom(0.5);
			},
			text: '+',
			y: 0
		},
		zoomOut: {
			onclick: function () {
				this.mapZoom(2);
			},
			text: '-',
			y: 28
		}
	},
	mouseWheelSensitivity: 1.1
	// enabled: false,
	// enableButtons: null, // inherit from enabled
	// enableTouchZoom: null, // inherit from enabled
	// enableDoubleClickZoom: null, // inherit from enabled
	// enableDoubleClickZoomTo: false
	// enableMouseWheelZoom: null, // inherit from enabled
};

/**
 * Utility for reading SVG paths directly.
 */
H.splitPath = function (path) {
	var i;

	// Move letters apart
	path = path.replace(/([A-Za-z])/g, ' $1 ');
	// Trim
	path = path.replace(/^\s*/, '').replace(/\s*$/, '');

	// Split on spaces and commas
	path = path.split(/[ ,,]+/); // Extra comma to escape gulp.scripts task
	
	// Parse numbers
	for (i = 0; i < path.length; i++) {
		if (!/[a-zA-Z]/.test(path[i])) {
			path[i] = parseFloat(path[i]);
		}
	}
	return path;
};

// A placeholder for map definitions
H.maps = {};





// Create symbols for the zoom buttons
function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
	return [
		'M', x + rTopLeft, y,
		// top side
		'L', x + w - rTopRight, y,
		// top right corner
		'C', x + w - rTopRight / 2,
		y, x + w,
		y + rTopRight / 2, x + w, y + rTopRight,
		// right side
		'L', x + w, y + h - rBottomRight,
		// bottom right corner
		'C', x + w, y + h - rBottomRight / 2,
		x + w - rBottomRight / 2, y + h,
		x + w - rBottomRight, y + h,
		// bottom side
		'L', x + rBottomLeft, y + h,
		// bottom left corner
		'C', x + rBottomLeft / 2, y + h, 
		x, y + h - rBottomLeft / 2,
		x, y + h - rBottomLeft,
		// left side
		'L', x, y + rTopLeft,
		// top left corner
		'C', x, y + rTopLeft / 2,
		x + rTopLeft / 2, y,
		x + rTopLeft, y,
		'Z'
	];
}
SVGRenderer.prototype.symbols.topbutton = function (x, y, w, h, attr) {
	return selectiveRoundedRect(x - 1, y - 1, w, h, attr.r, attr.r, 0, 0);
};
SVGRenderer.prototype.symbols.bottombutton = function (x, y, w, h, attr) {
	return selectiveRoundedRect(x - 1, y - 1, w, h, 0, 0, attr.r, attr.r);
};
// The symbol callbacks are generated on the SVGRenderer object in all browsers. Even
// VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer === VMLRenderer) {
	each(['topbutton', 'bottombutton'], function (shape) {
		VMLRenderer.prototype.symbols[shape] = SVGRenderer.prototype.symbols[shape];
	});
}


/**
 * The factory function for creating new map charts. Creates a new {@link
 * Chart|Chart} object with different default options than the basic Chart.
 * 
 * @function #mapChart
 * @memberOf Highcharts
 *
 * @param  {String|HTMLDOMElement} renderTo
 *         The DOM element to render to, or its id.
 * @param  {Options} options
 *         The chart options structure as described in the {@link
 *         https://api.highcharts.com/highstock|options reference}.
 * @param  {Function} callback
 *         A function to execute when the chart object is finished loading and
 *         rendering. In most cases the chart is built in one thread, but in
 *         Internet Explorer version 8 or less the chart is sometimes initiated
 *         before the document is ready, and in these cases the chart object
 *         will not be finished synchronously. As a consequence, code that
 *         relies on the newly built Chart object should always run in the
 *         callback. Defining a {@link https://api.highcharts.com/highstock/chart.events.load|
 *         chart.event.load} handler is equivalent.
 *
 * @return {Chart}
 *         The chart object.
 */
H.Map = H.mapChart = function (a, b, c) {

	var hasRenderToArg = typeof a === 'string' || a.nodeName,
		options = arguments[hasRenderToArg ? 1 : 0],
		hiddenAxis = {
			endOnTick: false,
			visible: false,
			minPadding: 0,
			maxPadding: 0,
			startOnTick: false
		},
		seriesOptions,
		defaultCreditsOptions = H.getOptions().credits;

	/* For visual testing
	hiddenAxis.gridLineWidth = 1;
	hiddenAxis.gridZIndex = 10;
	hiddenAxis.tickPositions = undefined;
	// */

	// Don't merge the data
	seriesOptions = options.series;
	options.series = null;

	options = merge(
		{
			chart: {
				panning: 'xy',
				type: 'map'
			},
			credits: {
				mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">{geojson.copyrightShort}</a>'),
				mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
			},
			tooltip: {
				followTouchMove: false
			},
			xAxis: hiddenAxis,
			yAxis: merge(hiddenAxis, { reversed: true })
		},
		options, // user's options

		{ // forced options
			chart: {
				inverted: false,
				alignTicks: false
			}
		}
	);

	options.series = seriesOptions;


	return hasRenderToArg ? 
		new Chart(a, options, c) :
		new Chart(options, b);
};
