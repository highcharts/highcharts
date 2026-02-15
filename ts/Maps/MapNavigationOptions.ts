/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../Core/Renderer/AlignObject';
import type CSSObject from '../Core/Renderer/CSSObject';
import type ButtonThemeObject from '../Core/Renderer/SVG/ButtonThemeObject';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options' {
    interface Options {
        /**
         * The `mapNavigation` option handles buttons for navigation in addition to
         * `mousewheel` and `doubleclick` handlers for map zooming.
         *
         * @product      highmaps
         * @optionparent mapNavigation
         */
        mapNavigation?: MapNavigationOptions;
    }
}

/**
 * @typedef {"plotBox"|"spacingBox"} Highcharts.ButtonRelativeToValue
 */
export type ButtonRelativeToValue = ('chart'|'plotBox'|'spacingBox');

export interface MapNavigationButtonOptions {
    /**
     * The alignment of the navigation buttons.
     *
     * @type {Highcharts.AlignValue}
     */
    align?: AlignValue;

    /**
     * What box to align the buttons to. Possible values are `plotBox`
     * and `spacingBox`.
     *
     * @type {Highcharts.ButtonRelativeToValue}
     */
    alignTo?: ButtonRelativeToValue;

    /**
     * The pixel height of the map navigation buttons.
     */
    height?: number;

    /** @internal */
    onclick?: Function;

    /**
     * Padding for the navigation buttons.
     *
     * @since 5.0.0
     */
    padding?: number;

    /**
     * Text styles for the map navigation buttons.
     *
     * @type    {Highcharts.CSSObject}
     * @default {"fontSize": "1em", "fontWeight": "bold"}
     */
    style?: CSSObject;

    /** @internal */
    text?: string;

    /**
     * A configuration object for the button theme. The object accepts
     * SVG properties like `stroke-width`, `stroke` and `fill`. Tri-state
     * button styles are supported by the `states.hover` and `states.select`
     * objects.
     *
     * @type    {Highcharts.ButtonThemeObject}
     * @default {"stroke-width": 1, "text-align": "center"}
     */
    theme?: ButtonThemeObject;

    /**
     * The vertical alignment of the buttons. Individual alignment can
     * be adjusted by each button's `y` offset.
     *
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The width of the map navigation buttons.
     */
    width?: number;

    /**
     * The X offset of the buttons relative to its `align` setting.
     */
    x?: number;

    /** @internal */
    y?: number;
}

/**
 * Options for the zoom in button. Properties for the zoom in and zoom
 * out buttons are inherited from
 * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
 * individual options can be overridden. By default, the `onclick`,
 * `text` and `y` options are individual.
 *
 * @extends mapNavigation.buttonOptions
 */
export interface MapNavigationButtonZoomInOptions extends MapNavigationButtonOptions {
    /**
     * Click handler for the button.
     *
     * @type    {Function}
     * @default function () { this.mapZoom(0.5); }
     */
    onclick?: Function;

    /**
     * The text for the button. The tooltip (title) is a language option given
     * by [lang.zoomIn](#lang.zoomIn).
     *
     * @default '+'
     */
    text?: string;

    /**
     * The position of the zoomIn button relative to the vertical alignment.
     *
     * @default 0
     */
    y?: number;
}

/**
 * Options for the zoom out button. Properties for the zoom in and
 * zoom out buttons are inherited from
 * [mapNavigation.buttonOptions](#mapNavigation.buttonOptions), while
 * individual options can be overridden. By default, the `onclick`,
 * `text` and `y` options are individual.
 *
 * @extends mapNavigation.buttonOptions
 */
export interface MapNavigationButtonZoomOutOptions extends MapNavigationButtonOptions {
    // eslint-disable-next-line valid-jsdoc
    /**
     * Click handler for the button.
     *
     * @type    {Function}
     * @default function () { this.mapZoom(2); }
     */
    onclick?: Function;

    /**
     * The text for the button. The tooltip (title) is a language option given
     * by [lang.zoomOut](#lang.zoomIn).
     *
     * @default '-'
     */
    text?: string;

    /**
     * The position of the zoomOut button relative to the vertical alignment.
     *
     * @default 28
     */
    y?: number;
}

export interface MapNavigationOptions {
    /**
     * General options for the map navigation buttons. Individual options
     * can be given from the [mapNavigation.buttons](#mapNavigation.buttons)
     * option set.
     *
     * @sample {highmaps} maps/mapnavigation/button-theme/
     *         Theming the navigation buttons
     */
    buttonOptions?: MapNavigationButtonOptions;

    /**
     * The individual buttons for the map navigation. This usually includes
     * the zoom in and zoom out buttons. Properties for each button is
     * inherited from [mapNavigation.buttonOptions](#mapNavigation.buttonOptions),
     * while individual options can be overridden. But default, the `onclick`,
     * `text` and `y` options are individual.
     */
    buttons?: Record<string, (
        MapNavigationButtonOptions |
        MapNavigationButtonZoomInOptions |
        MapNavigationButtonZoomOutOptions
    )>;

    /**
     * Whether to enable navigation buttons. By default it inherits the
     * [enabled](#mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableButtons
     */
    enableButtons?: boolean;

    /**
     * Whether to enable map navigation. The default is not to enable
     * navigation, as many choropleth maps are simple and don't need it.
     * Additionally, when touch zoom and mouse wheel zoom is enabled, it breaks
     * the default behaviour of these interactions in the website, and the
     * implementer should be aware of this.
     *
     * Individual interactions can be enabled separately, namely buttons,
     * multitouch zoom, double click zoom, double click zoom to element and
     * mouse wheel zoom.
     *
     * @type      {boolean}
     * @default   false
     * @apioption mapNavigation.enabled
     */
    enabled?: boolean;

    /**
     * Enables zooming in on an area on double clicking in the map. By default
     * it inherits the [enabled](#mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableDoubleClickZoom
     */
    enableDoubleClickZoom?: boolean;

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
    enableDoubleClickZoomTo?: boolean;

    /**
     * Enables zooming by mouse wheel. By default it inherits the [enabled](
     * #mapNavigation.enabled) setting.
     *
     * @type      {boolean}
     * @apioption mapNavigation.enableMouseWheelZoom
     */
    enableMouseWheelZoom?: boolean;

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
    enableTouchZoom?: boolean;

    /**
     * Sensitivity of mouse wheel or trackpad scrolling. 1 is no sensitivity,
     * while with 2, one mouse wheel delta will zoom in 50%.
     *
     * @since 4.2.4
     */
    mouseWheelSensitivity?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default MapNavigationOptions;
