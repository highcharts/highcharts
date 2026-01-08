/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type AxisOptions from '../AxisOptions';
import type ColorType from '../../Color/ColorType';
import type GradientColor from '../../Color/GradientColor';
import type LegendOptions from '../../Legend/LegendOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ColorAxisDataClassOptions {

    /**
     * The color of each data class. If not set, the color is pulled
     * from the global or chart-specific [colors](#colors) array. In
     * styled mode, this option is ignored. Instead, use colors defined
     * in CSS.
     *
     * @sample {highmaps} maps/demo/data-class-two-ranges/
     *         Explicit colors
     *
     * @product highcharts highstock highmaps
     */
    color?: ColorType;

    /** @internal */
    colorIndex?: number;

    /**
     * The start of the value range that the data class represents,
     * relating to the point value.
     *
     * The range of each `dataClass` is closed in both ends, but can be
     * overridden by the next `dataClass`.
     *
     * @product highcharts highstock highmaps
     */
    from?: number;

    /**
     * The name of the data class as it appears in the legend.
     * If no name is given, it is automatically created based on the
     * `from` and `to` values. For full programmatic control,
     * [legend.labelFormatter](#legend.labelFormatter) can be used.
     * In the formatter, `this.from` and `this.to` can be accessed.
     *
     * @sample {highmaps} maps/coloraxis/dataclasses-name/
     *         Named data classes
     *
     * @sample {highmaps} maps/coloraxis/dataclasses-labelformatter/
     *         Formatted data classes
     *
     * @product highcharts highstock highmaps
     */
    name?: string;

    /**
     * The end of the value range that the data class represents,
     * relating to the point value.
     *
     * The range of each `dataClass` is closed in both ends, but can be
     * overridden by the next `dataClass`.
     *
     * @product highcharts highstock highmaps
     */
    to?: number;

}

export interface ColorAxisMarkerOptions {

    /**
     * Animation for the marker as it moves between values. Set to
     * `false` to disable animation. Defaults to `{ duration: 50 }`.
     *
     * @product highcharts highstock highmaps
     */
    animation?: (boolean|Partial<AnimationOptions>);

    /**
     * The color of the marker.
     *
     * @product highcharts highstock highmaps
     */
    color?: ColorType;

    /**
     * The width of the marker.
     *
     * @default 0.01
     * @product highcharts highstock highmaps
     */
    width?: number;

}

/**
 * A color axis for series. Visually, the color
 * axis will appear as a gradient or as separate items inside the
 * legend, depending on whether the axis is scalar or based on data
 * classes.
 *
 * For supported color formats, see the
 * [docs article about colors](https://www.highcharts.com/docs/chart-design-and-style/colors).
 *
 * A scalar color axis is represented by a gradient. The colors either
 * range between the [minColor](#colorAxis.minColor) and the
 * [maxColor](#colorAxis.maxColor), or for more fine grained control the
 * colors can be defined in [stops](#colorAxis.stops). Often times, the
 * color axis needs to be adjusted to get the right color spread for the
 * data. In addition to stops, consider using a logarithmic
 * [axis type](#colorAxis.type), or setting [min](#colorAxis.min) and
 * [max](#colorAxis.max) to avoid the colors being determined by
 * outliers.
 *
 * When [dataClasses](#colorAxis.dataClasses) are used, the ranges are
 * subdivided into separate classes like categories based on their
 * values. This can be used for ranges between two values, but also for
 * a true category. However, when your data is categorized, it may be as
 * convenient to add each category to a separate series.
 *
 * Color axis does not work with: `sankey`, `sunburst`, `dependencywheel`,
 * `networkgraph`, `wordcloud`, `venn`, `gauge` and `solidgauge` series
 * types.
 *
 * Since v7.2.0 `colorAxis` can also be an array of options objects.
 *
 * See [the Axis object](/class-reference/Highcharts.Axis) for
 * programmatic access to the axis.
 *
 * @sample {highcharts} highcharts/coloraxis/custom-color-key
 *         Column chart with color axis
 * @sample {highcharts} highcharts/coloraxis/horizontal-layout
 *         Horizontal layout
 * @sample {highmaps} maps/coloraxis/dataclasscolor
 *         With data classes
 * @sample {highmaps} maps/coloraxis/mincolor-maxcolor
 *         Min color and max color
 *
 * @product highcharts highstock highmaps
 */
export interface ColorAxisOptions extends AxisOptions {

    // TODO alignTicks?: undefined;
    allowDecimals?: undefined;
    alternateGridColor?: undefined;
    breaks?: undefined;
    categories?: undefined;
    // TODO crosshair?: undefined;
    dateTimeLabelFormats?: undefined;
    left?: undefined;
    // TODO lineWidth?: undefined;
    linkedTo?: undefined;
    maxZoom?: undefined;
    minRange?: undefined;
    minTickInterval?: undefined;
    offset?: 0;
    opposite?: undefined;
    pane?: undefined;
    plotBands?: undefined;
    plotLines?: undefined;
    // TODO reversedStacks?: undefined;
    scrollbar?: undefined;
    // TODO showEmpty?: undefined;
    // TODO title?: undefined;
    top?: undefined;
    // TODO zoomEnabled?: undefined;

    /**
     * Determines how to set each data class' color if no individual
     * color is set. The default value, `tween`, computes intermediate
     * colors between `minColor` and `maxColor`. The other possible
     * value, `category`, pulls colors from the global or chart specific
     * [colors](#colors) array.
     *
     * @sample {highmaps} maps/coloraxis/dataclasscolor/
     *         Category colors
     *
     * @default    tween
     * @product    highcharts highstock highmaps
     * @validvalue ["tween", "category"]
     */
    dataClassColor?: string;

    /**
     * An array of data classes or ranges for the choropleth map. If
     * none given, the color axis is scalar and values are distributed
     * as a gradient between the minimum and maximum colors.
     *
     * @sample {highmaps} maps/demo/data-class-ranges/
     *         Multiple ranges
     *
     * @sample {highmaps} maps/demo/data-class-two-ranges/
     *         Two ranges
     *
     * @product highcharts highstock highmaps
     */
    dataClasses?: Array<ColorAxisDataClassOptions>;

    /** @internal */
    labelRight?: number;

    /**
     * The layout of the color axis. Can be `'horizontal'` or `'vertical'`.
     * If none given, the color axis has the same layout as the legend.
     *
     * @sample highcharts/coloraxis/horizontal-layout/
     *         Horizontal color axis layout with vertical legend
     *
     * @since   7.2.0
     * @product highcharts highstock highmaps
     */
    layout?: ('horizontal'|'vertical');

    /**
     * The legend options for the color axis.
     *
     * @product highcharts highstock highmaps
     */
    legend?: LegendOptions;

    /**
     * The triangular marker on a scalar color axis that points to the
     * value of the hovered area. To disable the marker, set
     * `marker: null`.
     *
     * @sample {highmaps} maps/coloraxis/marker/
     *         Black marker
     *
     * @product highcharts highstock highmaps
     */
    marker?: ColorAxisMarkerOptions;

    /**
     * The color to represent the maximum of the color axis. Unless
     * [dataClasses](#colorAxis.dataClasses) or
     * [stops](#colorAxis.stops) are set, the gradient ends at this
     * value.
     *
     * If dataClasses are set, the color is based on minColor and
     * maxColor unless a color is set for each data class, or the
     * [dataClassColor](#colorAxis.dataClassColor) is set.
     *
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
     *         Min and max colors on scalar (gradient) axis
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
     *         On data classes
     *
     * @product highcharts highstock highmaps
     */
    maxColor?: ColorType;

    /**
     * The color to represent the minimum of the color axis. Unless
     * [dataClasses](#colorAxis.dataClasses) or
     * [stops](#colorAxis.stops) are set, the gradient starts at this
     * value.
     *
     * If dataClasses are set, the color is based on minColor and
     * maxColor unless a color is set for each data class, or the
     * [dataClassColor](#colorAxis.dataClassColor) is set.
     *
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor/
     *         Min and max colors on scalar (gradient) axis
     * @sample {highmaps} maps/coloraxis/mincolor-maxcolor-dataclasses/
     *         On data classes
     *
     * @product highcharts highstock highmaps
     */
    minColor?: ColorType;

    /**
     * Whether to display the colorAxis in the legend.
     *
     * @sample highcharts/coloraxis/hidden-coloraxis-with-3d-chart/
     *         Hidden color axis with 3d chart
     *
     * @see [heatmap.showInLegend](#series.heatmap.showInLegend)
     *
     * @since   4.2.7
     * @product highcharts highstock highmaps
     */
    showInLegend?: boolean;

    /**
     * Color stops for the gradient of a scalar color axis. Use this in
     * cases where a linear gradient between a `minColor` and `maxColor`
     * is not sufficient. The stops is an array of tuples, where the
     * first item is a float between 0 and 1 assigning the relative
     * position in the gradient, and the second item is the color.
     *
     * @sample highcharts/coloraxis/coloraxis-stops/
     *         Color axis stops
     * @sample highcharts/coloraxis/color-key-with-stops/
     *         Color axis stops with custom colorKey
     * @sample {highmaps} maps/demo/heatmap/
     *         Heatmap with three color stops
     *
     * @product highcharts highstock highmaps
     */
    stops?: GradientColor['stops'];

    /**
     * The type of interpolation to use for the color axis. Can be
     * `linear` or `logarithmic`.
     *
     * @sample highcharts/coloraxis/logarithmic-with-emulate-negative-values/
     *         Logarithmic color axis with extension to emulate negative
     *         values
     *
     * @default linear
     * @product highcharts highstock highmaps
     */
    type?: AxisOptions['type'];

}

/* *
 *
 *  Default Export
 *
 * */

export default ColorAxisOptions;
