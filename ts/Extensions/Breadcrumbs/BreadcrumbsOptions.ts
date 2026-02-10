/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors:
 *  - Grzegorz Blachliński
 *  - Karol Kołodziej
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
} from '../../Core/Renderer/AlignObject';
import type { ButtonRelativeToValue } from '../../Maps/MapNavigationOptions';
import type ButtonThemeObject from '../../Core/Renderer/SVG/ButtonThemeObject';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type SeriesOptions from '../../Core/Series/SeriesOptions';
import type Breadcrumbs from './Breadcrumbs';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Drilldown/DrilldownOptions' {
    interface DrilldownOptions {
        /**
         * Options for the breadcrumbs, the navigation at the top leading the
         * way up through the drilldown levels.
         *
         * @since 10.0.0
         * @product   highcharts highmaps
         * @extends   navigation.breadcrumbs
         * @optionparent drilldown.breadcrumbs
         */
        breadcrumbs?: BreadcrumbsOptions;
    }
}

declare module '../../Series/Treemap/TreemapSeriesOptions' {
    interface TreemapSeriesOptions {
        /**
         * Options for the breadcrumbs, the navigation at the top leading the
         * way up through the traversed levels.
         *
         * @since 10.0.0
         *
         * @product highcharts
         *
         * @extends navigation.breadcrumbs
         */
        breadcrumbs?: BreadcrumbsOptions;
    }
}

declare module '../../Extensions/Exporting/NavigationOptions' {
    interface NavigationOptions {
        /**
         * Options for breadcrumbs. Breadcrumbs general options are defined in
         * `navigation.breadcrumbs`. Specific options for drilldown are set in
         * `drilldown.breadcrumbs` and for tree-like series traversing, in
         * `plotOptions[series].breadcrumbs`.
         *
         * @since        10.0.0
         * @product      highcharts
         * @optionparent navigation.breadcrumbs
         */
        breadcrumbs?: BreadcrumbsOptions;
    }
}

/* *
 *
 *  API Options
 *
 * */

/**
 * Options for the one breadcrumb.
 *
 * @interface Highcharts.BreadcrumbOptions
 */
export type BreadcrumbOptions = {
    /**
     * Level connected to a specific breadcrumb.
     *
     * @name Highcharts.BreadcrumbOptions#level
     * @type {number}
     */
    level: number,

    /**
     * Options for series or point connected to a specific breadcrumb.
     *
     * @name Highcharts.BreadcrumbOptions#levelOptions
     * @type {SeriesOptions|PointOptionsObject}
     */
    levelOptions: (SeriesOptions|PointOptions|PointShortOptions)
};

export interface BreadcrumbsAlignOptions {
    /**
     * Horizontal alignment of the breadcrumbs buttons.
     *
     * @type {Highcharts.AlignValue}
     */
    align: AlignValue;

    /**
     * Vertical alignment of the breadcrumbs buttons.
     *
     * @type {Highcharts.VerticalAlignValue}
     */
    verticalAlign: VerticalAlignValue;

    /**
     * The X offset of the breadcrumbs button group.
     */
    x: number;

    /**
     * The Y offset of the breadcrumbs button group. When `undefined`,
     * and `floating` is `false`, the `y` position is adapted so that
     * the breadcrumbs are rendered outside the target area.
     *
     * @type {number|undefined}
     */
    y?: number;

    /** @internal */
    width?: number;

    /** @internal */
    height?: number;
}

export interface BreadcrumbsButtonsEventsOptions {
    /**
     * Fires when clicking on a breadcrumb button. Two arguments are passed
     * to the function. First is the click event. Second is the breadcrumb
     * options for the clicked button.
     *
     * ```js
     * click: function (e, breadcrumb) {
     *   console.log(breadcrumb.level);
     * }
     * ```
     *
     * Return false to stop default buttons click action.
     *
     * @type      {Highcharts.BreadcrumbsClickCallbackFunction}
     * @since     10.0.0
     * @apioption navigation.breadcrumbs.events.click
     */
    click?: BreadcrumbsClickCallbackFunction;
}

/**
 * Callback function to format the breadcrumb text from scratch.
 *
 * @callback Highcharts.BreadcrumbsFormatterCallbackFunction
 *
 * @param {Highcharts.BreadcrumbOptions} options
 * Breadcrumb options.
 *
 * @return {string}
 * Formatted text or false
 */
export interface BreadcrumbsButtonsFormatter {
    (breadcrumb: BreadcrumbOptions): string;
}

/**
 * Callback function to react on button clicks.
 *
 * @callback Highcharts.BreadcrumbsClickCallbackFunction
 *
 * @param {Highcharts.Event} e
 * Event.
 *
 * @param {Highcharts.BreadcrumbOptions} breadcrumb
 * Breadcrumb options.
 */
export interface BreadcrumbsClickCallbackFunction {
    (
        e: Event,
        breadcrumb: BreadcrumbOptions,
        ctx: Breadcrumbs
    ): (boolean|undefined);
}

export interface BreadcrumbsOptions {
    /**
     * The default padding for each button and separator in each direction.
     *
     * @type  {number}
     * @since 10.0.0
     */
    buttonSpacing: number;

    /**
     * A collection of attributes for the buttons. The object takes SVG
     * attributes like `fill`, `stroke`, `stroke-width`, as well as `style`,
     * a collection of CSS properties for the text.
     *
     * The object can also be extended with states, so you can set
     * presentational options for `hover`, `select` or `disabled` button
     * states.
     *
     * @sample {highcharts} highcharts/breadcrumbs/single-button
     *         Themed, single button
     *
     * @type    {Highcharts.SVGAttributes}
     * @since   10.0.0
     * @product highcharts
     */
    buttonTheme: ButtonThemeObject;

    events?: BreadcrumbsButtonsEventsOptions;

    /**
     * When the breadcrumbs are floating, the plot area will not move to
     * make space for it. By default, the chart will not make space for the
     * buttons. This property won't work when positioned in the middle.
     *
     * @sample highcharts/breadcrumbs/single-button
     *         Floating button
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    floating: boolean;

    /**
     * A format string for the breadcrumbs button. Variables are enclosed by
     * curly brackets. Available values are passed in the declared point
     * options.
     *
     * @type      {string|undefined}
     * @since 10.0.0
     * @default   undefined
     * @sample {highcharts} highcharts/breadcrumbs/format Display custom
     *          values in breadcrumb button.
     */
    format?: string;

    /**
     * Callback function to format the breadcrumb text from scratch.
     *
     * @type      {Highcharts.BreadcrumbsFormatterCallbackFunction}
     * @since     10.0.0
     * @default   undefined
     * @apioption navigation.breadcrumbs.formatter
     */
    formatter?: BreadcrumbsButtonsFormatter;

    /**
     * Positioning for the button row. The breadcrumbs buttons will be
     * aligned properly for the default chart layout (title,  subtitle,
     * legend, range selector) for the custom chart layout set the position
     * properties.
     *
     * @sample  {highcharts} highcharts/breadcrumbs/single-button
     *          Single, right aligned button
     *
     * @type    {Highcharts.BreadcrumbsAlignOptions}
     * @since   10.0.0
     * @product highcharts highmaps
     */
    position: BreadcrumbsAlignOptions;

    /**
     * What box to align the button to. Can be either `plotBox` or
     * `spacingBox`.
     *
     * @type    {Highcharts.ButtonRelativeToValue}
     * @default plotBox
     * @since   10.0.0
     * @product highcharts highmaps
     */
    relativeTo?: ButtonRelativeToValue;

    /**
     * Whether to reverse the order of buttons. This is common in Arabic
     * and Hebrew.
     *
     * @sample {highcharts} highcharts/breadcrumbs/rtl
     *         Breadcrumbs in RTL
     *
     * @type  {boolean}
     * @since 10.2.0
     */
    rtl: boolean;

    /**
     * Options object for Breadcrumbs separator.
     *
     * @since 10.0.0
     */
    separator: BreadcrumbsSeparatorOptions;

    /**
     * Show full path or only a single button.
     *
     * @sample {highcharts} highcharts/breadcrumbs/single-button
     *         Single, styled button
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    showFullPath: boolean;

    /**
     * CSS styles for all breadcrumbs.
     *
     * In styled mode, the breadcrumbs buttons are styled by the
     * `.highcharts-breadcrumbs-buttons .highcharts-button` rule with its
     * different states.
     *
     * @type  {Highcharts.SVGAttributes}
     * @since 10.0.0
     */
    style: CSSObject;

    /**
     * Whether to use HTML to render the breadcrumbs items texts.
     *
     * @type  {boolean}
     * @since 10.0.0
     */
    useHTML: boolean;

    /**
     * The z index of the breadcrumbs group.
     *
     * @type  {number}
     * @since 10.0.0
     */
    zIndex: number;
}

export interface BreadcrumbsSeparatorOptions {
    /**
     * @type    {string}
     * @since   10.0.0
     * @product highcharts
     */
    text: string;

    /**
     * CSS styles for the breadcrumbs separator.
     *
     * In styled mode, the breadcrumbs separators are styled by the
     * `.highcharts-separator` rule with its different states.
     *
     *  @type  {Highcharts.CSSObject}
     *  @since 10.0.0
     */
    style: CSSObject
}

/* *
 *
 *  Default Export
 *
 * */

export default BreadcrumbsOptions;
