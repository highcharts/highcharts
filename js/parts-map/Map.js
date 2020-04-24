/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var extend = U.extend, merge = U.merge, pick = U.pick;
import '../parts/Options.js';
import '../parts/Chart.js';
import '../parts/SvgRenderer.js';
var Chart = H.Chart, defaultOptions = H.defaultOptions, Renderer = H.Renderer, SVGRenderer = H.SVGRenderer, VMLRenderer = H.VMLRenderer;
// Add language
extend(defaultOptions.lang, {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out'
});
// Set the default map navigation options
/**
 * @product      highmaps
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
     */
    buttonOptions: {
        /**
         * What box to align the buttons to. Possible values are `plotBox`
         * and `spacingBox`.
         *
         * @type {Highcharts.ButtonRelativeToValue}
         */
        alignTo: 'plotBox',
        /**
         * The alignment of the navigation buttons.
         *
         * @type {Highcharts.AlignValue}
         */
        align: 'left',
        /**
         * The vertical alignment of the buttons. Individual alignment can
         * be adjusted by each button's `y` offset.
         *
         * @type {Highcharts.VerticalAlignValue}
         */
        verticalAlign: 'top',
        /**
         * The X offset of the buttons relative to its `align` setting.
         */
        x: 0,
        /**
         * The width of the map navigation buttons.
         */
        width: 18,
        /**
         * The pixel height of the map navigation buttons.
         */
        height: 18,
        /**
         * Padding for the navigation buttons.
         *
         * @since 5.0.0
         */
        padding: 5,
        /**
         * Text styles for the map navigation buttons.
         *
         * @type    {Highcharts.CSSObject}
         * @default {"fontSize": "15px", "fontWeight": "bold"}
         */
        style: {
            /** @ignore */
            fontSize: '15px',
            /** @ignore */
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
         * @type    {Highcharts.SVGAttributes}
         * @default {"stroke-width": 1, "text-align": "center"}
         */
        theme: {
            /** @ignore */
            'stroke-width': 1,
            /** @ignore */
            'text-align': 'center'
        }
    },
    /**
     * The individual buttons for the map navigation. This usually includes
     * the zoom in and zoom out buttons. Properties for each button is
     * inherited from
     * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
     * individual options can be overridden. But default, the `onclick`, `text`
     * and `y` options are individual.
     */
    buttons: {
        /**
         * Options for the zoom in button. Properties for the zoom in and zoom
         * out buttons are inherited from
         * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
         * individual options can be overridden. By default, the `onclick`,
         * `text` and `y` options are individual.
         *
         * @extends mapNavigation.buttonOptions
         */
        zoomIn: {
            // eslint-disable-next-line valid-jsdoc
            /**
             * Click handler for the button.
             *
             * @type    {Function}
             * @default function () { this.mapZoom(0.5); }
             */
            onclick: function () {
                this.mapZoom(0.5);
            },
            /**
             * The text for the button. The tooltip (title) is a language option
             * given by [lang.zoomIn](#lang.zoomIn).
             */
            text: '+',
            /**
             * The position of the zoomIn button relative to the vertical
             * alignment.
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
         * @extends mapNavigation.buttonOptions
         */
        zoomOut: {
            // eslint-disable-next-line valid-jsdoc
            /**
             * Click handler for the button.
             *
             * @type    {Function}
             * @default function () { this.mapZoom(2); }
             */
            onclick: function () {
                this.mapZoom(2);
            },
            /**
             * The text for the button. The tooltip (title) is a language option
             * given by [lang.zoomOut](#lang.zoomIn).
             */
            text: '-',
            /**
             * The position of the zoomOut button relative to the vertical
             * alignment.
             */
            y: 28
        }
    },
    /**
     * Whether to enable navigation buttons. By default it inherits the
     * [enabled](#mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableButtons
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
     * @type      {boolean}
     * @default   false
     * @apioption mapNavigation.enabled
     */
    /**
     * Enables zooming in on an area on double clicking in the map. By default
     * it inherits the [enabled](#mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableDoubleClickZoom
     */
    /**
     * Whether to zoom in on an area when that area is double clicked.
     *
     * @sample {highmaps} maps/mapnavigation/doubleclickzoomto/
     *         Enable double click zoom to
     *
     * @type      {boolean}
     * @default   false
     * @apioption mapNavigation.enableDoubleClickZoomTo
     */
    /**
     * Enables zooming by mouse wheel. By default it inherits the [enabled](
     * #mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableMouseWheelZoom
     */
    /**
     * Whether to enable multitouch zooming. Note that if the chart covers the
     * viewport, this prevents the user from using multitouch and touchdrag on
     * the web page, so you should make sure the user is not trapped inside the
     * chart. By default it inherits the [enabled](#mapNavigation.enabled)
     * setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableTouchZoom
     */
    /**
     * Sensitivity of mouse wheel or trackpad scrolling. 1 is no sensitivity,
     * while with 2, one mousewheel delta will zoom in 50%.
     *
     * @since 4.2.4
     */
    mouseWheelSensitivity: 1.1
    // enabled: false,
    // enableButtons: null, // inherit from enabled
    // enableTouchZoom: null, // inherit from enabled
    // enableDoubleClickZoom: null, // inherit from enabled
    // enableDoubleClickZoomTo: false
    // enableMouseWheelZoom: null, // inherit from enabled
};
/* eslint-disable valid-jsdoc */
/**
 * Utility for reading SVG paths directly.
 *
 * @requires modules/map
 *
 * @function Highcharts.splitPath
 *
 * @param {string|Array<string|number>} path
 *
 * @return {Highcharts.SVGPathArray}
 */
H.splitPath = function (path) {
    var arr;
    if (typeof path === 'string') {
        path = path
            // Move letters apart
            .replace(/([A-Za-z])/g, ' $1 ')
            // Trim
            .replace(/^\s*/, '').replace(/\s*$/, '');
        // Split on spaces and commas. The semicolon is bogus, designed to
        // circumvent string replacement in the pre-v7 assembler that built
        // specific styled mode files.
        var split = path.split(/[ ,;]+/);
        arr = split.map(function (item) {
            if (!/[A-za-z]/.test(item)) {
                return parseFloat(item);
            }
            return item;
        });
    }
    else {
        arr = path;
    }
    return SVGRenderer.prototype.pathToSegments(arr);
};
/**
 * Contains all loaded map data for Highmaps.
 *
 * @requires modules/map
 *
 * @name Highcharts.maps
 * @type {Highcharts.Dictionary<*>}
 */
H.maps = {};
/**
 * Create symbols for the zoom buttons
 * @private
 */
function selectiveRoundedRect(x, y, w, h, rTopLeft, rTopRight, rBottomRight, rBottomLeft) {
    return [
        ['M', x + rTopLeft, y],
        // top side
        ['L', x + w - rTopRight, y],
        // top right corner
        ['C', x + w - rTopRight / 2, y, x + w, y + rTopRight / 2, x + w, y + rTopRight],
        // right side
        ['L', x + w, y + h - rBottomRight],
        // bottom right corner
        ['C', x + w, y + h - rBottomRight / 2, x + w - rBottomRight / 2, y + h, x + w - rBottomRight, y + h],
        // bottom side
        ['L', x + rBottomLeft, y + h],
        // bottom left corner
        ['C', x + rBottomLeft / 2, y + h, x, y + h - rBottomLeft / 2, x, y + h - rBottomLeft],
        // left side
        ['L', x, y + rTopLeft],
        // top left corner
        ['C', x, y + rTopLeft / 2, x + rTopLeft / 2, y, x + rTopLeft, y],
        ['Z']
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
    ['topbutton', 'bottombutton'].forEach(function (shape) {
        VMLRenderer.prototype.symbols[shape] =
            SVGRenderer.prototype.symbols[shape];
    });
}
/**
 * The factory function for creating new map charts. Creates a new {@link
 * Highcharts.Chart|Chart} object with different default options than the basic
 * Chart.
 *
 * @requires modules/map
 *
 * @function Highcharts.mapChart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure as described in the
 *        [options reference](https://api.highcharts.com/highstock).
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        A function to execute when the chart object is finished loading and
 *        rendering. In most cases the chart is built in one thread, but in
 *        Internet Explorer version 8 or less the chart is sometimes
 *        initialized before the document is ready, and in these cases the
 *        chart object will not be finished synchronously. As a consequence,
 *        code that relies on the newly built Chart object should always run in
 *        the callback. Defining a
 *        [chart.events.load](https://api.highcharts.com/highstock/chart.events.load)
 *        handler is equivalent.
 *
 * @return {Highcharts.Chart}
 *         The chart object.
 */
H.Map = H.mapChart = function (a, b, c) {
    var hasRenderToArg = typeof a === 'string' || a.nodeName, options = arguments[hasRenderToArg ? 1 : 0], userOptions = options, hiddenAxis = {
        endOnTick: false,
        visible: false,
        minPadding: 0,
        maxPadding: 0,
        startOnTick: false
    }, seriesOptions, defaultCreditsOptions = H.getOptions().credits;
    /* For visual testing
    hiddenAxis.gridLineWidth = 1;
    hiddenAxis.gridZIndex = 10;
    hiddenAxis.tickPositions = undefined;
    // */
    // Don't merge the data
    seriesOptions = options.series;
    options.series = null;
    options = merge({
        chart: {
            panning: {
                enabled: true,
                type: 'xy'
            },
            type: 'map'
        },
        credits: {
            mapText: pick(defaultCreditsOptions.mapText, ' \u00a9 <a href="{geojson.copyrightUrl}">' +
                '{geojson.copyrightShort}</a>'),
            mapTextFull: pick(defaultCreditsOptions.mapTextFull, '{geojson.copyright}')
        },
        tooltip: {
            followTouchMove: false
        },
        xAxis: hiddenAxis,
        yAxis: merge(hiddenAxis, { reversed: true })
    }, options, // user's options
    {
        chart: {
            inverted: false,
            alignTicks: false
        }
    });
    options.series = userOptions.series = seriesOptions;
    return hasRenderToArg ?
        new Chart(a, options, c) :
        new Chart(options, b);
};
