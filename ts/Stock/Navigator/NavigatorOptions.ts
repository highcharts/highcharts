/* *
 *
 *  (c) 2010-2026 Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    AxisOptions,
    YAxisOptions
} from '../../Core/Axis/AxisOptions';
import type ChartOptions from '../../Core/Chart/ChartOptions';
import type ColorType from '../../Core/Color/ColorType';
import type { DeepPartial } from '../../Shared/Types';
import type RangeSelector from '../RangeSelector/RangeSelector';
import type { SymbolTypeRegistry } from '../../Core/Renderer/SVG/SymbolType';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';
import type Utilities from '../../Core/Utilities';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        maxRange?: number;
        toFixedRange?: (
            pxMin: number,
            pxMax: number,
            fixedMin: number,
            fixedMax: number
        ) => RangeSelector.RangeObject;
    }
}

declare module '../../Core/Options'{
    interface Options {
        /**
         * The navigator is a small series below the main series, displaying
         * a view of the entire data set. It provides tools to zoom in and
         * out on parts of the data as well as panning across the dataset.
         *
         * @product      highstock gantt
         * @optionparent navigator
         */
        navigator?: NavigatorOptions;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        fillOpacity?: number;
        navigatorOptions?: SeriesOptions;
        showInNavigator?: boolean;
    }
}

/**
 * Options for the handles for dragging the zoomed area in the navigator.
 *
 * @sample {highstock} stock/navigator/handles/
 *         Colored handles
 */
export interface NavigatorHandlesOptions {

    /**
     * The fill for the handle.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    backgroundColor?: ColorType;

    /**
     * The stroke for the handle border and the stripes inside.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    borderColor?: ColorType;

    /**
     * Border radius of the handles.
     *
     * @sample {highstock} stock/navigator/handles-border-radius/
     *      Border radius on the navigator handles.
     *
     * @since 11.4.2
     */
    borderRadius?: Utilities.RelativeSize;

    /**
     * Allows to enable/disable handles.
     *
     * @since 6.0.0
     */
    enabled?: boolean;

    /**
     * Height for handles.
     *
     * @sample {highstock} stock/navigator/styled-handles/
     *         Styled handles
     *
     * @since 6.0.0
     */
    height?: number;

    /** @internal */
    inverted?: boolean;

    /**
     * The width for the handle border and the stripes inside.
     *
     * @sample {highstock} stock/navigator/styled-handles/
     *         Styled handles
     *
     * @since     6.0.0
     * @apioption navigator.handles.lineWidth
     */
    lineWidth?: number;

    /**
     * Array to define shapes of handles. 0-index for left, 1-index for
     * right.
     *
     * Additionally, the URL to a graphic can be given on this form:
     * `url(graphic.png)`. Note that for the image to be applied to
     * exported charts, its URL needs to be accessible by the export
     * server.
     *
     * Custom callbacks for symbol path generation can also be added to
     * `Highcharts.SVGRenderer.prototype.symbols`. The callback is then
     * used by its method name, as shown in the demo.
     *
     * @sample {highstock} stock/navigator/styled-handles/
     *         Styled handles
     *
     * @type    {Array<string>}
     * @default ["navigator-handle", "navigator-handle"]
     * @since   6.0.0
     */
    symbols?: Array<keyof SymbolTypeRegistry>;

    /**
     * Width for handles.
     *
     * @sample {highstock} stock/navigator/styled-handles/
     *         Styled handles
     *
     * @since 6.0.0
     */
    width?: number;
}

/**
 * Base options for the navigator component.
 */
export interface BaseNavigatorOptions {

    /**
     * The color of the mask covering the areas of the navigator series
     * that are currently not visible in the main series. The default
     * color is bluish with an opacity of 0.3 to see the series below.
     *
     * @see In styled mode, the mask is styled with the
     *      `.highcharts-navigator-mask` and
     *      `.highcharts-navigator-mask-inside` classes.
     *
     * @sample {highstock} stock/navigator/maskfill/
     *         Blue, semi transparent mask
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default rgba(102,133,194,0.3)
     */
    maskFill?: ColorType;

    /**
     * Whether the mask should be inside the range marking the zoomed
     * range, or outside. In Highcharts Stock 1.x it was always `false`.
     *
     * @sample {highstock} stock/demo/maskinside-false/
     *         False, mask outside
     *
     * @since 2.0
     */
    maskInside?: boolean;

    /**
     * Options for the handles for dragging the zoomed area.
     *
     * @sample {highstock} stock/navigator/handles/
     *         Colored handles
     */
    handles?: NavigatorHandlesOptions;

    /**
     * The height of the navigator.
     *
     * @sample {highstock} stock/navigator/height/
     *         A higher navigator
     */
    height?: number;

    /**
     * The color of the line marking the currently zoomed area in the
     * navigator.
     *
     * @sample {highstock} stock/navigator/outline/
     *         2px blue outline
     *
     * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @default #cccccc
     */
    outlineColor?: ColorType;

    /**
     * The width of the line marking the currently zoomed area in the
     * navigator.
     *
     * @see In styled mode, the outline stroke width is set with the
     *      `.highcharts-navigator-outline` class.
     *
     * @sample {highstock} stock/navigator/outline/
     *         2px blue outline
     *
     * @type {number}
     */
    outlineWidth?: number;

    /**
     * Options for the navigator series. Available options are the same
     * as any series, documented at [plotOptions](#plotOptions.series)
     * and [series](#series).
     *
     * Unless data is explicitly defined on navigator.series, the data
     * is borrowed from the first series in the chart.
     *
     * Default series options for the navigator series are:
     * ```js
     * series: {
     *     type: 'areaspline',
     *     fillOpacity: 0.05,
     *     dataGrouping: {
     *         smoothed: true
     *     },
     *     lineWidth: 1,
     *     marker: {
     *         enabled: false
     *     }
     * }
     * ```
     *
     * @see In styled mode, the navigator series is styled with the
     *      `.highcharts-navigator-series` class.
     *
     * @sample {highstock} stock/navigator/series-data/
     *         Using a separate data set for the navigator
     * @sample {highstock} stock/navigator/series/
     *         A green navigator series
     *
     * @type {*|Array<*>|Highcharts.SeriesOptionsType|Array<Highcharts.SeriesOptionsType>}
     */
    series?: SeriesTypeOptions;

    /**
     * Options for the navigator X axis. Default series options for the
     * navigator xAxis are:
     * ```js
     * xAxis: {
     *     tickWidth: 0,
     *     lineWidth: 0,
     *     gridLineWidth: 1,
     *     tickPixelInterval: 200,
     *     labels: {
     *            align: 'left',
     *         style: {
     *             color: '#888'
     *         },
     *         x: 3,
     *         y: -4
     *     }
     * }
     * ```
     *
     * @extends   xAxis
     * @excluding linkedTo, maxZoom, minRange, opposite, range, scrollbar,
     *            showEmpty, maxRange
     */
    xAxis?: DeepPartial<AxisOptions>;

    /**
     * Options for the navigator Y axis. Default series options for the
     * navigator yAxis are:
     * ```js
     * yAxis: {
     *     gridLineWidth: 0,
     *     startOnTick: false,
     *     endOnTick: false,
     *     minPadding: 0.1,
     *     maxPadding: 0.1,
     *     labels: {
     *         enabled: false
     *     },
     *     title: {
     *         text: null
     *     },
     *     tickWidth: 0
     * }
     * ```
     *
     * @extends   yAxis
     * @excluding height, linkedTo, maxZoom, minRange, ordinal, range,
     *            showEmpty, scrollbar, top, units, maxRange, minLength,
     *            maxLength, resize
     */
    yAxis?: DeepPartial<YAxisOptions>;
}

export interface NavigatorOptions extends BaseNavigatorOptions {

    /**
     * Whether the navigator and scrollbar should adapt to updated data
     * in the base X axis. When loading data async, as in the demo below,
     * this should be `false`. Otherwise new data will trigger navigator
     * redraw, which will cause unwanted looping. In the demo below, the
     * data in the navigator is set only once. On navigating, only the main
     * chart content is updated.
     *
     * @sample {highstock} stock/demo/lazy-loading/
     *         Set to false with async data loading
     *
     * @type      {boolean}
     * @default   true
     * @apioption navigator.adaptToUpdatedData
     */
    adaptToUpdatedData?: boolean;

    /**
     * An integer identifying the index to use for the base series, or a
     * string representing the id of the series.
     *
     * **Note**: As of Highcharts 5.0, this is now a deprecated option.
     * Prefer [series.showInNavigator](#plotOptions.series.showInNavigator).
     *
     * @see [series.showInNavigator](#plotOptions.series.showInNavigator)
     *
     * @deprecated
     * @type      {number|string}
     * @default   0
     * @apioption navigator.baseSeries
     */
    baseSeries?: (number|string);

    /**
     * Enable or disable the navigator.
     *
     * @sample {highstock} stock/navigator/enabled/
     *         Disable the navigator
     *
     * @type      {boolean}
     * @default   true
     * @apioption navigator.enabled
     */
    enabled?: boolean;

    /** @internal */
    isInternal?: boolean;

    /**
     * The distance from the nearest element, the X axis or X axis labels.
     *
     * @sample {highstock} stock/navigator/margin/
     *         A margin of 2 draws the navigator closer to the X axis labels
     */
    margin?: number;

    /**
     * When the chart is inverted, whether to draw the navigator on the
     * opposite side.
     *
     * @type      {boolean}
     * @default   false
     * @since     5.0.8
     * @apioption navigator.opposite
     */
    opposite?: boolean;

    /**
     * Enable or disable navigator sticking to right, while adding new
     * points. If `undefined`, the navigator sticks to the axis maximum only
     * if it was already at the maximum prior to adding points.
     *
     * @type      {boolean}
     * @default   undefined
     * @since 10.2.1
     * @sample {highstock} stock/navigator/sticktomax-false/
     * stickToMax set to false
     * @apioption navigator.stickToMax
     */
    stickToMax?: boolean;

    /** @internal */
    top?: number;
}

/**
 * Standalone Navigator options with chart configuration.
 *
 * @interface Highcharts.StandaloneNavigatorOptions
 */
export interface StandaloneNavigatorOptions extends BaseNavigatorOptions {

    /**
     * Chart configuration for the standalone navigator.
     */
    chart: ChartOptions;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigatorOptions;
