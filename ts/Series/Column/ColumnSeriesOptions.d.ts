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

import type ColorType from '../../Core/Color/ColorType';
import type ColumnPointOptions from './ColumnPointOptions';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { BorderRadiusOptionsObject } from '../../Extensions/BorderRadius';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        borderColor?: ColorType;
        borderDashStyle?: DashStyleValue;
        borderRadius?: (number|string|BorderRadiusOptionsObject);
        borderWidth?: number;
        centerInCategory?: boolean;
        fillColor?: ColorType;
        grouping?: boolean;
        groupPadding?: number;
        negativeFillColor?: ColorType;
        pointRange?: (number|null);
    }
    interface SeriesStateHoverOptions {
        borderColor?: ColorType;
        borderDashStyle?: DashStyleValue;
        borderRadius?: number;
        borderWidth?: number;
        brightness?: number;
        color?: ColorType;
        dashStyle?: DashStyleValue;
    }
    interface SeriesZonesOptions {
        borderColor?: ColorType;
        borderWidth?: number;
        color?: ColorType;
    }
}

/**
 * Column series display one column per value along an X axis.
 *
 * A `column` series. If the [type](#series.column.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/column-basic/
 *         Column chart
 *
 * @sample {highstock} stock/demo/column/
 *         Column chart
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.column
 *
 * @excluding connectEnds, connectNulls, gapSize, gapUnit, linecap,
 *            lineWidth, marker, step, useOhlcData
 *
 * @excluding connectNulls, dataParser, dataURL, gapSize, gapUnit, linecap,
 *            lineWidth, marker, connectEnds, step
 *
 * @product highcharts highstock
 */
export interface ColumnSeriesOptions extends LineSeriesOptions {

    /**
     * The color of the border surrounding each column or bar.
     *
     * In styled mode, the border stroke can be set with the
     * `.highcharts-point` rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
     *         Dark gray border
     *
     * @default #ffffff
     *
     * @product highcharts highstock gantt
     */
    borderColor?: ColorType;

    /**
     * The corner radius of the border surrounding each column or bar. A number
     * signifies pixels. A percentage string, like for example `50%`, signifies
     * a relative size. For columns this is relative to the column width, for
     * pies it is relative to the radius and the inner radius.
     *
     * @sample {highcharts} highcharts/plotoptions/column-borderradius/
     *         Rounded columns
     *
     * @sample highcharts/plotoptions/series-border-radius
     *         Column and pie with rounded border
     *
     * @product highcharts highstock gantt
     */
    borderRadius?: (number|string|BorderRadiusOptionsObject);

    /**
     * The width of the border surrounding each column or bar. Defaults to
     * `1` when there is room for a border, but to `0` when the columns are
     * so dense that a border would cover the next column.
     *
     * In styled mode, the stroke width can be set with the
     * `.highcharts-point` rule.
     *
     * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
     *         2px black border
     *
     * @product highcharts highstock gantt
     */
    borderWidth?: number;

    /**
     * When `true`, the columns will center in the category, ignoring null
     * or missing points. When `false`, space will be reserved for null or
     * missing points.
     *
     * @sample {highcharts} highcharts/series-column/centerincategory/
     *         Center in category
     *
     * @since 8.0.1
     *
     * @product highcharts highstock gantt
     */
    centerInCategory?: boolean;

    /**
     * When using automatic point colors pulled from the global
     * [colors](colors) or series-specific
     * [plotOptions.column.colors](series.colors) collections, this option
     * determines whether the chart should receive one color per series or
     * one color per point.
     *
     * In styled mode, the `colors` or `series.colors` arrays are not
     * supported, and instead this option gives the points individual color
     * class names on the form `highcharts-color-{n}`.
     *
     * @see [series colors](#plotOptions.column.colors)
     *
     * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-false/
     *         False by default
     *
     * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-true/
     *         True
     *
     * @default false
     *
     * @since 2.0
     *
     * @product highcharts highstock gantt
     */
    colorByPoint?: boolean;

    /**
     * A series specific or series type specific color set to apply instead
     * of the global [colors](#colors) when [colorByPoint](
     * #plotOptions.column.colorByPoint) is true.
     *
     * @since 3.0
     *
     * @product highcharts highstock gantt
     */
    colors?: Array<ColorType>;

    /**
     * When the series contains less points than the crop threshold, all
     * points are drawn, event if the points fall outside the visible plot
     * area at the current zoom. The advantage of drawing all points
     * (including markers and columns), is that animation is performed on
     * updates. On the other hand, when the series contains more points than
     * the crop threshold, the series data is cropped to only contain points
     * that fall within the plot area. The advantage of cropping away
     * invisible points is to increase performance on large series.
     *
     * @product highcharts highstock gantt
     */
    cropThreshold?: number;

    /**
     * An array of data points for the series. For the `column` series type,
     * points can be given in the following ways:
     *
     * 1. An array of numerical values. In this case, the numerical values will
     *  be
     *    interpreted as `y` options. The `x` values will be automatically
     *    calculated, either starting at 0 and incremented by 1, or from
     *    `pointStart` and `pointInterval` given in the series options. If the
     *  axis
     *    has categories, these will be used. Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * 2. An array of arrays with 2 values. In this case, the values correspond
     *  to
     *    `x,y`. If the first value is a string, it is applied as the name of
     *  the
     *    point, and the `x` value is inferred.
     *    ```js
     *    data: [
     *        [0, 6],
     *        [1, 2],
     *        [2, 6]
     *    ]
     *    ```
     *
     * 3. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.column.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        y: 9,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        y: 6,
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
     * @extends series.line.data
     *
     * @excluding marker
     *
     * @type {Array<number|Array<(number|string),(number|null)>|null|*>}
     *
     * @product highcharts highstock
     *
     * @apioption series.column.data
     */
    data?: Array<(ColumnPointOptions|PointShortOptions)>;

    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);

    /**
     * Whether to group non-stacked columns or to let them render
     * independent of each other. Non-grouped columns will be laid out
     * individually and overlap each other.
     *
     * @sample {highcharts} highcharts/plotoptions/column-grouping-false/
     *         Grouping disabled
     *
     * @sample {highstock} highcharts/plotoptions/column-grouping-false/
     *         Grouping disabled
     *
     * @default true
     *
     * @since 2.3.0
     *
     * @product highcharts highstock gantt
     */
    grouping?: boolean;

    /**
     * Padding between each value groups, in x axis units.
     *
     * @sample {highcharts} highcharts/plotoptions/column-grouppadding-default/
     *         0.2 by default
     *
     * @sample {highcharts} highcharts/plotoptions/column-grouppadding-none/
     *         No group padding - all columns are evenly spaced
     *
     * @product highcharts highstock gantt
     */
    groupPadding?: number;

    marker?: PointMarkerOptions;

    /**
     * The maximum allowed pixel width for a column, translated to the
     * height of a bar in a bar chart. This prevents the columns from
     * becoming too wide when there is a small number of points in the
     * chart.
     *
     * @see [pointWidth](#plotOptions.column.pointWidth)
     *
     * @sample {highcharts} highcharts/plotoptions/column-maxpointwidth-20/
     *         Limited to 50
     *
     * @sample {highstock} highcharts/plotoptions/column-maxpointwidth-20/
     *         Limited to 50
     *
     * @since 4.1.8
     *
     * @product highcharts highstock gantt
     */
    maxPointWidth?: number;

    /**
     * The minimal height for a column or width for a bar. By default,
     * 0 values are not shown. To visualize a 0 (or close to zero) point,
     * set the minimal point length to a pixel value like 3\. In stacked
     * column charts, minPointLength might not be respected for tightly
     * packed values.
     *
     * @sample {highcharts} highcharts/plotoptions/column-minpointlength/
     *         Zero base value
     *
     * @sample {highcharts} highcharts/plotoptions/column-minpointlength-pos-and-neg/
     *         Positive and negative close to zero values
     *
     * @product highcharts highstock gantt
     */
    minPointLength?: number;

    /**
     * Padding between each column or bar, in x axis units.
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-default/
     *         0.1 by default
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-025/
     *         0.25
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointpadding-none/
     *         0 for tightly packed columns
     *
     * @product highcharts highstock gantt
     */
    pointPadding?: number;

    /**
     * The X axis range that each point is valid for. This determines the
     * width of the column. On a categorized axis, the range will be 1
     * by default (one category unit). On linear and datetime axes, the
     * range will be computed as the distance between the two closest data
     * points.
     *
     * The default `null` means it is computed automatically, but this
     * option can be used to override the automatic value.
     *
     * This option is set by default to 1 if data sorting is enabled.
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointrange/
     *         Set the point range to one day on a data set with one week
     *         between the points
     *
     * @since 2.3
     *
     * @product highcharts highstock gantt
     */
    pointRange?: (number|null);

    /**
     * A pixel value specifying a fixed width for each column or bar point.
     * When set to `undefined`, the width is calculated from the
     * `pointPadding` and `groupPadding`. The width effects the dimension
     * that is not based on the point value. For column series it is the
     * horizontal length and for bar series it is the vertical length.
     *
     * @see [maxPointWidth](#plotOptions.column.maxPointWidth)
     *
     * @sample {highcharts} highcharts/plotoptions/column-pointwidth-20/
     *         20px wide columns regardless of chart width or the amount of
     *         data points
     *
     * @since 1.2.5
     *
     * @product highcharts highstock gantt
     */
    pointWidth?: number;

    stickyTracking?: boolean;

    startFromThreshold?: boolean;

    states?: SeriesStatesOptions<ColumnSeriesOptions>;

    /**
     * Options for the hovered point. These settings override the normal
     * state options when a point is moused over or touched.
     *
     * @extends plotOptions.series.states.hover
     *
     * @excluding halo, lineWidth, lineWidthPlus, marker
     *
     * @product highcharts highstock gantt
     *
     * @product highcharts highstock
     *
     * @apioption series.column.states.hover
     */

    /**
     * Options for the selected point. These settings override the
     * normal state options when a point is selected.
     *
     * @extends plotOptions.series.states.select
     *
     * @excluding halo, lineWidth, lineWidthPlus, marker
     *
     * @product highcharts highstock gantt
     *
     * @product highcharts highstock
     *
     * @apioption series.column.states.select
     */

    /**
     * The Y axis value to serve as the base for the columns, for
     * distinguishing between values above and below a threshold. If `null`,
     * the columns extend from the padding Y axis minimum.
     *
     * @since 2.0
     *
     * @product highcharts
     */
    threshold?: (number|null);

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default ColumnSeriesOptions;
