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

/** 
 * @products highmaps
 * @optionparent mapNavigation 
 */
defaultOptions.mapNavigation = {

	/**
	 * General options for the map navigation buttons. Individual options
	 * can be given from the [mapNavigation.buttons](#mapNavigation.buttons)
	 * option set.
	 * 
	 * @type {Object}
	 * @sample {highmaps} maps/mapnavigation/button-theme/ Theming the navigation buttons
	 * @product highmaps
	 */
	buttonOptions: {

		/**
		 * What box to align the buttons to. Possible values are `plotBox`
		 * and `spacingBox`.
		 * 
		 * @validvalue ["plotBox", "spacingBox"]
		 * @type {String}
		 * @default plotBox
		 * @product highmaps
		 */
		alignTo: 'plotBox',

		/**
		 * The alignment of the navigation buttons.
		 * 
		 * @validvalue ["left", "center", "right"]
		 * @type {String}
		 * @default left
		 * @product highmaps
		 */
		align: 'left',

		/**
		 * The vertical alignment of the buttons. Individual alignment can
		 * be adjusted by each button's `y` offset.
		 * 
		 * @validvalue ["top", "middle", "bottom"]
		 * @type {String}
		 * @default bottom
		 * @product highmaps
		 */
		verticalAlign: 'top',

		/**
		 * The X offset of the buttons relative to its `align` setting.
		 * 
		 * @type {Number}
		 * @default 0
		 * @product highmaps
		 */
		x: 0,

		/**
		 * The width of the map navigation buttons.
		 * 
		 * @type {Number}
		 * @default 18
		 * @product highmaps
		 */
		width: 18,

		/**
		 * The pixel height of the map navigation buttons.
		 * 
		 * @type {Number}
		 * @default 18
		 * @product highmaps
		 */
		height: 18,

		/**
		 * Padding for the navigation buttons.
		 * 
		 * @type {Number}
		 * @default 5
		 * @since 5.0.0
		 * @product highmaps
		 */
		padding: 5,
		/*= if (build.classic) { =*/

		/**
		 * Text styles for the map navigation buttons. Defaults to
		 * 
		 * <pre>{
		 * fontSize: '15px',
		 * fontWeight: 'bold',
		 * textAlign: 'center'
		 * }</pre>
		 * 
		 * @type {CSSObject}
		 * @product highmaps
		 */
		style: {

			/**
			 */
			fontSize: '15px',

			/**
			 */
			fontWeight: 'bold'
		},

		/**
		 * A configuration object for the button theme. The object accepts
		 * SVG properties like `stroke-width`, `stroke` and `fill`. Tri-state
		 * button styles are supported by the `states.hover` and `states.select`
		 * objects.
		 * 
		 * @type {Object}
		 * @sample {highmaps} maps/mapnavigation/button-theme/ Themed navigation buttons
		 * @product highmaps
		 */
		theme: {
			'stroke-width': 1,

			/**
			 */
			'text-align': 'center'
		}
		/*= } =*/
	},

	/**
	 * The individual buttons for the map navigation. This usually includes
	 * the zoom in and zoom out buttons. Properties for each button is
	 * inherited from [mapNavigation.buttonOptions](#mapNavigation.buttonOptions),
	 * while individual options can be overridden. But default, the `onclick`,
	 *  `text` and `y` options are individual.
	 * 
	 * @type {Object}
	 * @product highmaps
	 */
	buttons: {

		/**
		 * Options for the zoom in button. Properties for the zoom in and
		 * zoom out buttons are inherited from [mapNavigation.buttonOptions](#mapNavigation.
		 * buttonOptions), while individual options can be overridden. By
		 * default, the `onclick`, `text` and `y` options are individual.
		 * 
		 * @type {Object}
		 * @extends mapNavigation.buttonOptions
		 * @product highmaps
		 */
		zoomIn: {

			/**
			 * Click handler for the button. Defaults to:
			 * 
			 * <pre>function () {
			 * this.mapZoom(0.5);
			 * }</pre>
			 * 
			 * @type {Function}
			 * @product highmaps
			 */
			onclick: function () {
				this.mapZoom(0.5);
			},

			/**
			 * The text for the button. The tooltip (title) is a language option
			 * given by [lang.zoomIn](#lang.zoomIn).
			 * 
			 * @type {String}
			 * @default +
			 * @product highmaps
			 */
			text: '+',

			/**
			 * The position of the zoomIn button relative to the vertical alignment.
			 * 
			 * @type {Number}
			 * @default 0
			 * @product highmaps
			 */
			y: 0
		},

		/**
		 * Options for the zoom out button. Properties for the zoom in and
		 * zoom out buttons are inherited from [mapNavigation.buttonOptions](#mapNavigation.
		 * buttonOptions), while individual options can be overridden. By
		 * default, the `onclick`, `text` and `y` options are individual.
		 * 
		 * @type {Object}
		 * @extends mapNavigation.buttonOptions
		 * @product highmaps
		 */
		zoomOut: {

			/**
			 * Click handler for the button. Defaults to:
			 * 
			 * <pre>function () {
			 * this.mapZoom(2);
			 * }</pre>
			 * 
			 * @type {Function}
			 * @product highmaps
			 */
			onclick: function () {
				this.mapZoom(2);
			},

			/**
			 * The text for the button. The tooltip (title) is a language option
			 * given by [lang.zoomOut](#lang.zoomIn).
			 * 
			 * @type {String}
			 * @default -
			 * @product highmaps
			 */
			text: '-',

			/**
			 * The position of the zoomOut button relative to the vertical alignment.
			 * 
			 * @type {Number}
			 * @default 28
			 * @product highmaps
			 */
			y: 28
		}
	},

	/**
	 * Sensitivity of mouse wheel or trackpad scrolling. 1 is no sensitivity,
	 *  while with 2, one mousewheel delta will zoom in 50%.
	 * 
	 * @type {Number}
	 * @default 1.1
	 * @since 4.2.4
	 * @product highmaps
	 */
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
 *         Internet Explorer version 8 or less the chart is sometimes initialized
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
