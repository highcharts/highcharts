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

import type { BorderRadiusOptionsObject } from '../../Extensions/BorderRadius';
import type ColorType from '../../Core/Color/ColorType';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type PieDataLabelOptions from './PieDataLabelOptions';
import type {
    PieSeriesPointOptions,
    PiePointOptions
} from './PiePointOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type {
    SeriesEventsOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

interface PieSeriesEventsOptions extends SeriesEventsOptions {

    /**
     * Fires when the checkbox next to the point name in the legend is
     * clicked. One parameter, event, is passed to the function. The state
     * of the checkbox is found by event.checked. The checked item is found
     * by event.item. Return false to prevent the default action which is to
     * toggle the select state of the series.
     *
     * @sample {highcharts} highcharts/plotoptions/series-events-checkboxclick/
     *         Alert checkbox status
     *
     * @type {Function}
     *
     * @since 1.2.0
     *
     * @product highcharts highmaps
     *
     * @context Highcharts.Point
     *
     * @apioption plotOptions.pie.events.checkboxClick
     */

}


/**
 * A pie chart is a circular graphic which is divided into slices to
 * illustrate numerical proportion.
 *
 * A `pie` series. If the [type](#series.pie.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/pie-chart/
 *         Pie chart
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.pie
 *
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataSorting, dragDrop,
 *            findNearestPointBy, getExtremesFromAll, label, lineWidth,
 *            linkedTo, marker, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart,
 *            softThreshold, stacking, step, threshold, turboThreshold,
 *            zoneAxis, zones, dataSorting, boostBlending
 *
 * @excluding cropThreshold, dataParser, dataURL, linkedTo, stack, xAxis, yAxis,
 *            dataSorting, step, boostThreshold, boostBlending
 *
 * @product highcharts highmaps
 */
export interface PieSeriesOptions extends LineSeriesOptions {

    /**
     * The color of the border surrounding each slice. When `null`, the
     * border takes the same color as the slice fill. This can be used
     * together with a `borderWidth` to fill drawing gaps created by
     * antialiazing artefacts in borderless pies.
     *
     * In styled mode, the border stroke is given in the `.highcharts-point`
     * class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-bordercolor-black/
     *         Black border
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @default #ffffff
     *
     * @product highcharts highmaps
     */
    borderColor?: ColorType;

    /**
     * The corner radius of the border surrounding each slice. A number
     * signifies pixels. A percentage string, like for example `50%`, signifies
     * a size relative to the radius and the inner radius.
     *
     * @sample highcharts/plotoptions/series-border-radius
     *         Column and pie with rounded border
     *
     * @since 11.0.0
     *
     * @type {number|string|Highcharts.BorderRadiusOptionsObject}
     */
    borderRadius?: (number|string|BorderRadiusOptionsObject);

    /**
     * The width of the border surrounding each slice.
     *
     * When setting the border width to 0, there may be small gaps between
     * the slices due to SVG antialiasing artefacts. To work around this,
     * keep the border width at 0.5 or 1, but set the `borderColor` to
     * `null` instead.
     *
     * In styled mode, the border stroke width is given in the
     * `.highcharts-point` class.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-borderwidth/
     *         3px border
     *
     * @product highcharts highmaps
     */
    borderWidth?: number;

    /**
     * The center of the pie chart relative to the plot area. Can be
     * percentages or pixel values. The default behaviour (as of 3.0) is to
     * center the pie so that all slices and data labels are within the plot
     * area. As a consequence, the pie may actually jump around in a chart
     * with dynamic values, as the data labels move. In that case, the
     * center should be explicitly set, for example to `["50%", "50%"]`.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-center/
     *         Centered at 100, 100
     *
     * @type {Array<(number|string|null),(number|string|null)>}
     *
     * @default [null, null]
     *
     * @product highcharts highmaps
     */
    center?: [(number|string|null), (number|string|null)];

    /**
     * @product highcharts
     */
    clip?: boolean;

    /**
     * The color of the pie series. A pie series is represented as an empty
     * circle if the total sum of its values is 0. Use this property to
     * define the color of its border.
     *
     * In styled mode, the color can be defined by the
     * [colorIndex](#plotOptions.series.colorIndex) option. Also, the series
     * color can be set with the `.highcharts-series`,
     * `.highcharts-color-{n}`, `.highcharts-{type}-series` or
     * `.highcharts-series-{n}` class, or individual classes given by the
     * `className` option.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
     *         Empty pie series
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @default ${palette.neutralColor20}
     */
    color?: ColorType;

    /** @ignore-option */
    colorByPoint?: boolean;

    /**
     * A series specific or series type specific color set to use instead
     * of the global [colors](#colors).
     *
     * @sample {highcharts} highcharts/demo/pie-monochrome/
     *         Set default colors for all pies
     *
     * @type {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
     *
     * @since 3.0
     *
     * @product highcharts highmaps
     */
    colors?: Array<ColorType>;

    /**
     * An array of data points for the series. For the `pie` series type,
     * points can be given in the following ways:
     *
     * 1. An array of numerical values. In this case, the numerical values will
     *  be
     *    interpreted as `y` options. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.pie.turboThreshold),
     *    this option is not available.
     *    ```js
     *    data: [{
     *        y: 1,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        y: 7,
     *        name: "Point1",
     *        color: "#FF00FF"
     *    }]
     *    ```
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays/
     *         Arrays of numeric x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
     *         Arrays of datetime x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-name-value/
     *         Arrays of point.name and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @type {Array<number|Array<string,(number|null)>|null|*>}
     *
     * @extends series.line.data
     *
     * @excluding marker, x
     *
     * @product highcharts highmaps
     */
    data?: Array<(PiePointOptions|PointShortOptions)>;

    /**
     *
     * @declare Highcharts.SeriesPieDataLabelsOptionsObject
     *
     * @extends plotOptions.series.dataLabels
     *
     * @extends plotOptions.pie.dataLabels
     *
     * @excluding align, allowOverlap, inside, staggerLines, step
     *
     * @product highcharts highmaps
     */
    dataLabels?: (PieDataLabelOptions|Array<PieDataLabelOptions>);

    /**
     * The end angle of the pie in degrees where 0 is top and 90 is right.
     * Defaults to `startAngle` plus 360.
     *
     * @sample {highcharts} highcharts/demo/pie-semi-circle/
     *         Semi-circle donut
     *
     * @type {number}
     *
     * @since 1.3.6
     *
     * @product highcharts highmaps
     */
    endAngle?: number;

    /**
     * @excluding legendItemClick
     *
     * @product highcharts highmaps
     */
    events?: PieSeriesEventsOptions;

    /**
     * If the total sum of the pie's values is 0, the series is represented
     * as an empty circle . The `fillColor` option defines the color of that
     * circle. Use [pie.borderWidth](#plotOptions.pie.borderWidth) to set
     * the border thickness.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-emptyseries/
     *         Empty pie series
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    fillColor?: ColorType;

    /**
     * Equivalent to [chart.ignoreHiddenSeries](#chart.ignoreHiddenSeries),
     * this option tells whether the series shall be redrawn as if the
     * hidden point were `null`.
     *
     * The default value changed from `false` to `true` with Highcharts
     * 3.0.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-ignorehiddenpoint/
     *         True, the hiddden point is ignored
     *
     * @since 2.3.0
     *
     * @product highcharts highmaps
     */
    ignoreHiddenPoint?: boolean;

    /**
     *
     * @default true
     *
     * @extends plotOptions.series.inactiveOtherPoints
     */
    inactiveOtherPoints?: boolean;

    /**
     * The size of the inner diameter for the pie. A size greater than 0
     * renders a donut chart. Can be a percentage or pixel value.
     * Percentages are relative to the pie size. Pixel values are given as
     * integers. Setting overridden by thickness.
     *
     *
     * Note: in Highcharts < 4.1.2, the percentage was relative to the plot
     * area, not the pie size.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-innersize-80px/
     *         80px inner size
     *
     * @sample {highcharts} highcharts/plotoptions/pie-innersize-50percent/
     *         50% of the plot area
     *
     * @sample {highcharts} highcharts/demo/3d-pie-donut/
     *         3D donut
     *
     * @type {number|string}
     *
     * @default 0
     *
     * @since 2.0
     *
     * @product highcharts highmaps
     */
    innerSize?: (number|string);

    /** @ignore-option */
    legendType?: ('point'|'series');

    /** @ignore-option */
    lineWidth?: number;

    /** @ignore-option */
    marker?: PointMarkerOptions;

    /**
     * The minimum size for a pie in response to auto margins. The pie will
     * try to shrink to make room for data labels in side the plot area,
     *  but only to this size.
     *
     * @type {number|string}
     *
     * @default 80
     *
     * @since 3.0
     *
     * @product highcharts highmaps
     */
    minSize?: (number|string);

    point?: PieSeriesPointOptions;

    /**
     * Whether to display this particular series or series type in the
     * legend. Since 2.1, pies are not shown in the legend by default.
     *
     * @sample {highcharts} highcharts/plotoptions/series-showinlegend/
     *         One series in the legend, one hidden
     *
     * @product highcharts highmaps
     */
    showInLegend?: boolean;

    /**
     * The diameter of the pie relative to the plot area. Can be a
     * percentage or pixel value. Pixel values are given as integers. The
     * default behaviour (as of 3.0) is to scale to the plot area and give
     * room for data labels within the plot area.
     * [slicedOffset](#plotOptions.pie.slicedOffset) is also included in the
     * default size calculation. As a consequence, the size of the pie may
     * vary when points are updated and data labels more around. In that
     * case it is best to set a fixed value, for example `"75%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-size/
     *         Smaller pie
     *
     * @type {number|string|null}
     *
     * @product highcharts highmaps
     */
    size?: (number|string);

    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-slicedoffset-20/
     *         20px offset
     *
     * @product highcharts highmaps
     */
    slicedOffset?: number;

    /**
     * The start angle of the pie slices in degrees where 0 is top and 90
     * right.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-startangle-90/
     *         Start from right
     *
     * @type {number}
     *
     * @default 0
     *
     * @since 2.3.4
     *
     * @product highcharts highmaps
     */
    startAngle?: number;

    states?: SeriesStatesOptions<PieSeriesOptions>;

    /**
     *
     * @extends plotOptions.series.states.hover
     *
     * @excluding marker, lineWidth, lineWidthPlus
     *
     * @product highcharts highmaps
     *
     * @apioption series.pie.states.hover
     */

    /**
     * Sticky tracking of mouse events. When true, the `mouseOut` event
     * on a series isn't triggered until the mouse moves over another
     * series, or out of the plot area. When false, the `mouseOut` event on
     * a series is triggered when the mouse leaves the area around the
     * series'  graph or markers. This also implies the tooltip. When
     * `stickyTracking` is false and `tooltip.shared` is false, the tooltip
     * will be hidden when moving the mouse between series.
     *
     * @product highcharts highmaps
     */
    stickyTracking?: boolean;

    /**
     * Thickness describing the ring size for a donut type chart,
     * overriding [innerSize](#plotOptions.pie.innerSize).
     *
     * @type {number}
     *
     * @default undefined
     *
     * @product highcharts
     *
     * @since 10.1.0
     */
    thickness?: number;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default PieSeriesOptions;
