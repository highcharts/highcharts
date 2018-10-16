/**
 * (c) 2010-2018 Torstein Honsi
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
 * @product highmaps
 * @optionparent mapNavigation
 */
defaultOptions.mapNavigation = {

    /**
     * General options for the map navigation buttons. Individual options
     * can be given from the [mapNavigation.buttons](#mapNavigation.buttons)
     * option set.
     *
     * @sample {highmaps} maps/mapnavigation/button-theme/
     *         Theming the navigation buttons
     *
     * @type       {*}
     * @product    highmaps
     * @apioption  mapNavigation.buttonOptions
     */
    buttonOptions: {

        /**
         * What box to align the buttons to. Possible values are `plotBox`
         * and `spacingBox`.
         *
         * @type       {string}
         * @default    plotBox
         * @product    highmaps
         * @validvalue ["plotBox", "spacingBox"]
         * @apioption  mapNavigation.buttonOptions.alignTo
         */
        alignTo: 'plotBox',

        /**
         * The alignment of the navigation buttons.
         *
         * @type       {string}
         * @default    left
         * @product    highmaps
         * @validvalue ["left", "center", "right"]
         * @apioption  mapNavigation.buttonOptions.align
         */
        align: 'left',

        /**
         * The vertical alignment of the buttons. Individual alignment can
         * be adjusted by each button's `y` offset.
         *
         * @type       {string}
         * @default    bottom
         * @product    highmaps
         * @validvalue ["top", "middle", "bottom"]
         * @apioption  mapNavigation.buttonOptions.verticalAlign
         */
        verticalAlign: 'top',

        /**
         * The X offset of the buttons relative to its `align` setting.
         *
         * @type       {number}
         * @default    0
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.x
         */
        x: 0,

        /**
         * The width of the map navigation buttons.
         *
         * @type       {number}
         * @default    18
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.width
         */
        width: 18,

        /**
         * The pixel height of the map navigation buttons.
         *
         * @type       {number}
         * @default    18
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.height
         */
        height: 18,

        /**
         * Padding for the navigation buttons.
         *
         * @type       {number}
         * @default    5
         * @since      5.0.0
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.padding
         */
        padding: 5,

        /*= if (build.classic) { =*/

        /**
         * Text styles for the map navigation buttons. Defaults to
         *
         * <pre>{
         *     fontSize: '15px',
         *     fontWeight: 'bold',
         *     textAlign: 'center'
         * }</pre>
         *
         * @type       {Highcharts.CSSObject}
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.style
         */
        style: {
            fontSize: '15px',
            fontWeight: 'bold'
        },

        /**
         * A configuration object for the button theme. The object accepts
         * SVG properties like `stroke-width`, `stroke` and `fill`. Tri-state
         * button styles are supported by the `states.hover` and `states.select`
         * objects.
         *
         * @sample {highmaps} maps/mapnavigation/button-theme/
         *         Themed navigation buttons
         *
         * @type       {*}
         * @product    highmaps
         * @apioption  mapNavigation.buttonOptions.theme
         */
        theme: {
            'stroke-width': 1,
            'text-align': 'center'
        }

        /*= } =*/
    },

    /**
     * The individual buttons for the map navigation. This usually includes
     * the zoom in and zoom out buttons. Properties for each button is
     * inherited from
     * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
     * individual options can be overridden. But default, the `onclick`, `text`
     * and `y` options are individual.
     *
     * @type        {*}
     * @product     highmaps
     * @apioptions  mapNavigation.buttons
     */
    buttons: {

        /**
         * Options for the zoom in button. Properties for the zoom in and zoom
         * out buttons are inherited from
         * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
         * individual options can be overridden. By default, the `onclick`,
         * `text` and `y` options are individual.
         *
         * @type        {*}
         * @extends     mapNavigation.buttonOptions
         * @product     highmaps
         * @apioptions  mapNavigation.buttons.zoomIn
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
             * The position of the zoomIn button relative to the vertical
             * alignment.
             *
             * @type {Number}
             * @default 0
             * @product highmaps
             */
            y: 0
        },

        /**
         * Options for the zoom out button. Properties for the zoom in and
         * zoom out buttons are inherited from
         * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
         * individual options can be overridden. By default, the `onclick`,
         * `text` and `y` options are individual.
         *
         * @type        {*}
         * @extends     mapNavigation.buttonOptions
         * @product     highmaps
         * @apioptions  mapNavigation.buttons.zoomOut
         */
        zoomOut: {

            /**
             * Click handler for the button. Defaults to:
             *
             * <pre>function () {
             *     this.mapZoom(2);
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
             * The position of the zoomOut button relative to the vertical
             * alignment.
             *
             * @type {Number}
             * @default 28
             * @product highmaps
             */
            y: 28
        }
    },

    /**
     * Whether to enable navigation buttons. By default it inherits the
     * [enabled](#mapNavigation.enabled) setting.
     *
     * @type       {boolean}
     * @product    highmaps
     * @apioption  mapNavigation.enableButtons
     */

    /**
     * Whether to enable map navigation. The default is not to enable
     * navigation, as many choropleth maps are simple and don't need it.
     * Additionally, when touch zoom and mousewheel zoom is enabled, it breaks
     * the default behaviour of these interactions in the website, and the
     * implementer should be aware of this.
     *
     * Individual interactions can be enabled separately, namely buttons,
     * multitouch zoom, double click zoom, double click zoom to element and
     * mousewheel zoom.
     *
     * @type       {boolean}
     * @default    false
     * @product    highmaps
     * @apioption  mapNavigation.enabled
     */

    /**
     * Enables zooming in on an area on double clicking in the map. By default
     * it inherits the [enabled](#mapNavigation.enabled) setting.
     *
     * @type       {boolean}
     * @product    highmaps
     * @apioption  mapNavigation.enableDoubleClickZoom
     */

    /**
     * Whether to zoom in on an area when that area is double clicked.
     *
     * @sample {highmaps} maps/mapnavigation/doubleclickzoomto/
     *         Enable double click zoom to
     *
     * @type       {boolean}
     * @default    false
     * @product    highmaps
     * @apioption  mapNavigation.enableDoubleClickZoomTo
     */

    /**
     * Enables zooming by mouse wheel. By default it inherits the [enabled](
     * #mapNavigation.enabled) setting.
     *
     * @type       {boolean}
     * @product    highmaps
     * @apioption  mapNavigation.enableMouseWheelZoom
     */

    /**
     * Whether to enable multitouch zooming. Note that if the chart covers the
     * viewport, this prevents the user from using multitouch and touchdrag on
     * the web page, so you should make sure the user is not trapped inside the
     * chart. By default it inherits the [enabled](#mapNavigation.enabled)
     * setting.
     *
     * @type       {boolean}
     * @product    highmaps
     * @apioption  mapNavigation.enableTouchZoom
     */

    /**
     * Sensitivity of mouse wheel or trackpad scrolling. 1 is no sensitivity,
     * while with 2, one mousewheel delta will zoom in 50%.
     *
     * @type       {number}
     * @default    1.1
     * @since      4.2.4
     * @product    highmaps
     * @apioption  mapNavigation.mouseWheelSensitivity
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
 *
 * @function Highcharts.splitPath
 *
 * @param  {string} path
 *
 * @return {Array<number|string>}
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
function selectiveRoundedRect(
    x,
    y,
    w,
    h,
    rTopLeft,
    rTopRight,
    rBottomRight,
    rBottomLeft
) {
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
// The symbol callbacks are generated on the SVGRenderer object in all browsers.
// Even VML browsers need this in order to generate shapes in export. Now share
// them with the VMLRenderer.
if (Renderer === VMLRenderer) {
    each(['topbutton', 'bottombutton'], function (shape) {
        VMLRenderer.prototype.symbols[shape] =
            SVGRenderer.prototype.symbols[shape];
    });
}


/**
 * The factory function for creating new map charts. Creates a new {@link Chart|
 * Chart} object with different default options than the basic Chart.
 *
 * @function Highcharts.mapChart
 *
 * @param  {string|Highcharts.HTMLDOMElement} [renderTo]
 *         The DOM element to render to, or its id.
 *
 * @param  {Highcharts.Options} options
 *         The chart options structure as described in the {@link
 *         https://api.highcharts.com/highstock|options reference}.
 *
 * @param  {Function} callback
 *         A function to execute when the chart object is finished loading and
 *         rendering. In most cases the chart is built in one thread, but in
 *         Internet Explorer version 8 or less the chart is sometimes
 *         initialized before the document is ready, and in these cases the
 *         chart object will not be finished synchronously. As a consequence,
 *         code that relies on the newly built Chart object should always run in
 *         the callback. Defining a
 *         {@link https://api.highcharts.com/highstock/chart.events.load|
 *         chart.event.load} handler is equivalent.
 *
 * @return {Highcharts.Chart}
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
                mapText: pick(
                    defaultCreditsOptions.mapText,
                    ' \u00a9 <a href="{geojson.copyrightUrl}">' +
                        '{geojson.copyrightShort}</a>'
                ),
                mapTextFull: pick(
                    defaultCreditsOptions.mapTextFull,
                    '{geojson.copyright}'
                )
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
