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
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type {
    HeatmapPointMarkerOptions,
    HeatmapPointOptions
} from './HeatmapPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type {
    SeriesStatesOptions,
    LegendSymbolType
} from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/StatesOptions' {
    interface StateHoverOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
    interface StateInactiveOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
    interface StateSelectOptions {
        height?: number;
        heightPlus?: number;
        width?: number;
        widthPlus?: number;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateHoverOptions {
        brightness?: number;
    }
    interface SeriesStateInactiveOptions {
        brightness?: number;
    }
    interface SeriesStateSelectOptions {
        brightness?: number;
    }
}

/**
 * A heatmap is a graphical representation of data where the individual
 * values contained in a matrix are represented as colors.
 *
 * A `heatmap` series. If the [type](#series.heatmap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @productdesc {highcharts}
 *              Requires `modules/heatmap`.
 *
 * @sample highcharts/demo/heatmap/
 *         Simple heatmap
 *
 * @sample highcharts/demo/heatmap-canvas/
 *         Heavy heatmap
 *
 * @extends plotOptions.scatter
 *
 * @extends series,plotOptions.heatmap
 *
 * @excluding animationLimit, connectEnds, connectNulls, cropThreshold,
 *            dashStyle, findNearestPointBy, getExtremesFromAll, jitter,
 *            linecap, lineWidth, pointInterval, pointIntervalUnit,
 *            pointRange, pointStart, shadow, softThreshold, stacking,
 *            step, threshold, cluster, dragDrop
 *
 * @excluding cropThreshold, dataParser, dataURL, dragDrop ,pointRange, stack,
 *
 * @product highcharts highmaps
 */
export interface HeatmapSeriesOptions extends ScatterSeriesOptions {

    /**
     * Animation is disabled by default on the heatmap series.
     */
    animation?: boolean;

    /**
     * The border radius for each heatmap item. The border's color and width can
     * be set in marker options.
     *
     * @see [lineColor](#plotOptions.heatmap.marker.lineColor)
     *
     * @see [lineWidth](#plotOptions.heatmap.marker.lineWidth)
     */
    borderRadius?: number;

    /**
     * The border width for each heatmap item.
     */
    borderWidth?: number;

    clip?: boolean;

    /**
     * The main color of the series. In heat maps this color is rarely used, as
     * we mostly use the color to denote the value of each point. Unless options
     * are set in the [colorAxis](#colorAxis), the default value is pulled from
     * the [options.colors](#colors) array.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @since 4.0
     *
     * @product highcharts
     */
    color?: ColorType;

    /**
     * @default value
     */
    colorKey?: string;

    /**
     * The column size - how many X axis units each column in the heatmap
     * should span.
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         One day
     *
     * @sample {highmaps} maps/demo/heatmap/
     *         One day
     *
     * @default 1
     *
     * @since 4.0
     *
     * @product highcharts highmaps
     */
    colsize?: number;

    /**
     * An array of data points for the series. For the `heatmap` series
     * type, points can be given in the following ways:
     *
     * 1.  An array of arrays with 3 or 2 values. In this case, the values
     * correspond to `x,y,value`. If the first value is a string, it is
     * applied as the name of the point, and the `x` value is inferred.
     * The `x` value can also be omitted, in which case the inner arrays
     * should be of length 2\. Then the `x` value is automatically calculated,
     * either starting at 0 and incremented by 1, or from `pointStart`
     * and `pointInterval` given in the series options.
     *
     *  ```js
     *     data: [
     *         [0, 9, 7],
     *         [1, 10, 4],
     *         [2, 6, 3]
     *     ]
     *  ```
     *
     * 2.  An array of objects with named values. The following snippet shows
     *  only a
     * few settings, see the complete options set below. If the total number of
     *  data
     * points exceeds the series' [turboThreshold](#series.heatmap.turboThreshold),
     * this option is not available.
     *
     *  ```js
     *     data: [{
     *         x: 1,
     *         y: 3,
     *         value: 10,
     *         name: "Point2",
     *         color: "#00FF00"
     *     }, {
     *         x: 1,
     *         y: 7,
     *         value: 10,
     *         name: "Point1",
     *         color: "#FF00FF"
     *     }]
     *  ```
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
     * @type {Array<Array<number>|*>}
     *
     * @extends series.line.data
     *
     * @product highcharts highmaps
     */
    data?: Array<(HeatmapPointOptions|PointShortOptions)>;

    dataLabels?: Partial<DataLabelOptions>;

    /**
     * Make the heatmap render its data points as an interpolated image.
     *
     * @sample highcharts/demo/heatmap-interpolation
     *         Interpolated heatmap image displaying user activity on a website
     *
     * @sample highcharts/series-heatmap/interpolation
     *         Interpolated heatmap toggle
     */
    interpolation?: boolean;

    legendSymbol?: LegendSymbolType;

    /**
     * @excluding radius, enabledThreshold
     *
     * @since 8.1
     *
     * @product highcharts highmaps
     */
    marker?: HeatmapPointMarkerOptions;

    /**
     * The color applied to null points. In styled mode, a general CSS class
     * is applied instead.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    nullColor?: ColorType;

    /**
     * Padding between the points in the heatmap.
     *
     * @default 0
     *
     * @since 6.0
     */
    pointPadding?: number;

    pointRange?: (number|null);

    /**
     * The row size - how many Y axis units each heatmap row should span.
     *
     * @sample {highcharts} maps/demo/heatmap/
     *         1 by default
     *
     * @sample {highmaps} maps/demo/heatmap/
     *         1 by default
     *
     * @default 1
     *
     * @since 4.0
     *
     * @product highcharts highmaps
     */
    rowsize?: number;

    states?: SeriesStatesOptions<HeatmapSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default HeatmapSeriesOptions;
