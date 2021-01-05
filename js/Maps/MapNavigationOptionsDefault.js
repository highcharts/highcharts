/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import O from '../Core/Options.js';
import U from '../Core/Utilities.js';
var extend = U.extend;
/* *
 *
 *  Constants
 *
 * */
/**
 * @product      highmaps
 * @optionparent mapNavigation
 */
var defaultOptions = {
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
/* *
 *
 *  Composition
 *
 * */
// Add language
extend(O.defaultOptions.lang, {
    zoomIn: 'Zoom in',
    zoomOut: 'Zoom out'
});
// Set the default map navigation options
O.defaultOptions.mapNavigation = defaultOptions;
/* *
 *
 *  Default Export
 *
 * */
export default defaultOptions;
