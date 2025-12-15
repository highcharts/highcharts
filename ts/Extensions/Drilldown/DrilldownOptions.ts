/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type { ButtonRelativeToValue } from '../../Maps/MapNavigationOptions';
import type Chart from '../../Core/Chart/Chart';
import type { CSSObject } from '../../Core/Renderer/CSSObject';
import type Drilldown from './Drilldown';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Chart/ChartOptions' {
    interface ChartEventsOptions {
        /**
         * Fires when a drilldown point is clicked, before the new series is
         * added. This event is also utilized for async drilldown, where the
         * seriesOptions are not added by option, but rather loaded async. Note
         * that when clicking a category label to trigger multiple series
         * drilldown, one `drilldown` event is triggered per point in the
         * category.
         *
         * Event arguments:
         *
         * - `category`: If a category label was clicked, which index.
         *
         * - `originalEvent`: The original browser event (usually click) that
         *   triggered the drilldown.
         *
         * - `point`: The originating point.
         *
         * - `points`: If a category label was clicked, this array holds all
         *   points corresponding to the category.
         *
         * - `seriesOptions`: Options for the new series.
         *
         * @sample {highcharts} highcharts/drilldown/async/
         *         Async drilldown
         *
         * @type      {Highcharts.DrilldownCallbackFunction}
         * @since     3.0.8
         * @product   highcharts highmaps
         * @context   Highcharts.Chart
         * @requires  modules/drilldown
         * @apioption chart.events.drilldown
         */
        drilldown?: DrilldownCallbackFunction;

        /**
         * Fires when drilling up from a drilldown series.
         *
         * @type      {Highcharts.DrillupCallbackFunction}
         * @since     3.0.8
         * @product   highcharts highmaps
         * @context   Highcharts.Chart
         * @requires  modules/drilldown
         * @apioption chart.events.drillup
         */
        drillup?: DrillupCallbackFunction;

        /**
         * In a chart with multiple drilldown series, this event fires after all
         * the series have been drilled up.
         *
         * @type      {Highcharts.DrillupAllCallbackFunction}
         * @since     4.2.4
         * @product   highcharts highmaps
         * @context   Highcharts.Chart
         * @requires  modules/drilldown
         * @apioption chart.events.drillupall
         */
        drillupall?: DrillupAllCallbackFunction;
    }
}

/**
 * Gets fired when a drilldown point is clicked, before the new series is added.
 * Note that when clicking a category label to trigger multiple series
 * drilldown, one `drilldown` event is triggered per point in the category.
 *
 * @callback Highcharts.DrilldownCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrilldownEventObject} e
 *        The drilldown event.
 */
export interface DrilldownCallbackFunction {
    (this: Chart, event: Drilldown.DrilldownEventObject): void;
}

/**
 * This gets fired after all the series have been drilled up. This is especially
 * useful in a chart with multiple drilldown series.
 *
 * @callback Highcharts.DrillupAllCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupAllEventObject} e
 *        The final drillup event.
 */
export interface DrillupAllCallbackFunction {
    (this: Chart, event: Drilldown.DrillupAllEventObject): void;
}

/**
 * Gets fired when drilling up from a drilldown series.
 *
 * @callback Highcharts.DrillupCallbackFunction
 *
 * @param {Highcharts.Chart} this
 *        The chart where the event occurs.
 *
 * @param {Highcharts.DrillupEventObject} e
 *        The drillup event.
 */
export interface DrillupCallbackFunction {
    (this: Chart, event: Drilldown.DrillupEventObject): void;
}

export interface DrilldownActiveDataLabelStyleOptions {
    color?: string;
    cursor?: string;
    fontWeight?: string;
    textDecoration?: string;
}

export interface DrilldownOptions {
    /**
     * Additional styles to apply to the X axis label for a point that
     * has drilldown data. By default it is underlined and blue to invite
     * to interaction.
     *
     * In styled mode, active label styles can be set with the
     * `.highcharts-drilldown-axis-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeAxisLabelStyle?: CSSObject;

    /**
     * Additional styles to apply to the data label of a point that has
     * drilldown data. By default it is underlined and blue to invite to
     * interaction.
     *
     * In styled mode, active data label styles can be applied with the
     * `.highcharts-drilldown-data-label` class.
     *
     * @sample {highcharts} highcharts/drilldown/labels/
     *         Label styles
     *
     * @type    {Highcharts.CSSObject}
     * @default { "cursor": "pointer", "color": "#003399", "fontWeight": "bold", "textDecoration": "underline" }
     * @since   3.0.8
     * @product highcharts highmaps
     */
    activeDataLabelStyle?: (CSSObject|DrilldownActiveDataLabelStyleOptions);

    /**
     * When this option is false, clicking a single point will drill down
     * all points in the same category, equivalent to clicking the X axis
     * label.
     *
     * @sample {highcharts} highcharts/drilldown/allowpointdrilldown-false/
     *         Don't allow point drilldown
     *
     * @type      {boolean}
     * @default   true
     * @since     4.1.7
     * @product   highcharts
     * @apioption drilldown.allowPointDrilldown
     */
    allowPointDrilldown?: boolean;

    /**
     * Set the animation for all drilldown animations. Animation of a drilldown
     * occurs when drilling between a column point and a column series,
     * or a pie slice and a full pie series. Drilldown can still be used
     * between series and points of different types, but animation will
     * not occur.
     *
     * The animation can either be set as a boolean or a configuration
     * object. If `true`, it will use the 'swing' jQuery easing and a duration
     * of 500 ms. If used as a configuration object, the following properties
     * are supported:
     *
     * - `duration`: The duration of the animation in milliseconds.
     *
     * - `easing`: A string reference to an easing function set on the `Math`
     *   object. See
     *   [the easing demo](https://jsfiddle.net/gh/get/library/pure/highcharts/highcharts/tree/master/samples/highcharts/plotoptions/series-animation-easing/).
     *
     * @type    {boolean|Highcharts.AnimationOptionsObject}
     * @since   3.0.8
     * @product highcharts highmaps
     */
    animation?: (boolean|Partial<AnimationOptions>);

    /**
     * Drill up button is deprecated since Highcharts v9.3.2. Use
     * [drilldown.breadcrumbs](#drilldown.breadcrumbs) instead.
     *
     * Options for the drill up button that appears when drilling down on a
     * series. The text for the button is defined in
     * [lang.drillUpText](#lang.drillUpText).
     *
     * @sample highcharts/breadcrumbs/single-button
     *         Breadcrumbs set up like a legacy button
     * @sample {highcharts} highcharts/drilldown/drillupbutton/ Drill up button
     * @sample {highmaps} highcharts/drilldown/drillupbutton/ Drill up button
     *
     * @since   3.0.8
     * @product highcharts highmaps
     *
     * @deprecated 9.3.2
     */
    drillUpButton?: DrilldownDrillUpButtonOptions;

    /**
     * An array of series configurations for the drill down. Each series
     * configuration uses the same syntax as the [series](#series) option set.
     * These drilldown series are hidden by default. The drilldown series is
     * linked to the parent series' point by its `id`.
     *
     * @type      {Array<Highcharts.SeriesOptionsType>}
     * @since     3.0.8
     * @product   highcharts highmaps
     * @apioption drilldown.series
     */
    series?: Array<SeriesTypeOptions>;

    /**
     * Enable or disable zooming into a region of clicked map point you want to
     * drill into. If mapZooming is set to false the drilldown/drillup
     * animations only fade in/fade out without zooming to a specific map point.
     *
     * @sample    maps/demo/map-drilldown-preloaded/
     *            Map drilldown without async maps loading
     *
     * @type      {boolean}
     * @default   true
     * @since 11.0.0
     * @product   highmaps
     * @apioption drilldown.mapZooming
     */
    mapZooming?: boolean;
}

export interface DrilldownDrillUpButtonOptions {
    /**
     * Positioning options for the button within the `relativeTo` box.
     * Available properties are `x`, `y`, `align` and `verticalAlign`.
     *
     * @type    {Highcharts.AlignObject}
     * @since   3.0.8
     * @deprecated 9.3.2
     * @product highcharts highmaps
     */
    position: (AlignObject|DrilldownDrillUpButtonPositionOptions);

    /**
     * What box to align the button to. Can be either `plotBox` or
     * `spacingBox`.
     *
     * @type       {Highcharts.ButtonRelativeToValue}
     * @default    plotBox
     * @since      3.0.8
     * @deprecated 9.3.2
     * @product    highcharts highmaps
     * @apioption  drilldown.drillUpButton.relativeTo
     */
    relativeTo?: ButtonRelativeToValue;

    /**
     * A collection of attributes for the button. The object takes SVG
     * attributes like `fill`, `stroke`, `stroke-width` or `r`, the border
     * radius. The theme also supports `style`, a collection of CSS
     * properties for the text. Equivalent attributes for the hover state
     * are given in `theme.states.hover`.
     *
     * In styled mode, drill-up button styles can be applied with the
     * `.highcharts-drillup-button` class.
     *
     * @sample {highcharts} highcharts/drilldown/drillupbutton/
     *         Button theming
     * @sample {highmaps} highcharts/drilldown/drillupbutton/
     *         Button theming
     *
     * @type      {Object}
     * @since     3.0.8
     * @deprecated 9.3.2
     * @product   highcharts highmaps
     * @apioption drilldown.drillUpButton.theme
     */
    theme?: object;
}

export interface DrilldownDrillUpButtonPositionOptions {
    /**
     * Horizontal alignment.
     *
     * @type {Highcharts.AlignValue}
     * @deprecated 9.3.2
     */
    align?: AlignValue;

    /**
     * Vertical alignment of the button.
     *
     * @type      {Highcharts.VerticalAlignValue}
     * @deprecated 9.3.2
     * @default   top
     * @product   highcharts highmaps
     * @apioption drilldown.drillUpButton.position.verticalAlign
     */
    verticalAlign?: VerticalAlignValue;

    /**
     * The X offset of the button.
     *
     * @deprecated 9.3.2
     */
    x?: number;

    /**
     * The Y offset of the button.
     *
     * @deprecated 9.3.2
     */
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DrilldownOptions;
