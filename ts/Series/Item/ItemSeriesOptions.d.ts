/* *
 *
 *  (c) 2019-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  Item series type for Highcharts
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
    ItemPointOptions,
    ItemPointMarkerOptions
} from './ItemPointOptions';
import type PieSeriesOptions from '../Pie/PieSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type {
    SeriesEventsOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @optionparent series.item.events
 */
interface ItemSeriesEventsOptions extends SeriesEventsOptions {
    legendItem?: undefined;
}

/**
 * An item chart is an infographic chart where a number of items are laid
 * out in either a rectangular or circular pattern. It can be used to
 * visualize counts within a group, or for the circular pattern, typically
 * a parliament.
 *
 * The circular layout has much in common with a pie chart. Many of the item
 * series options, like `center`, `size` and data label positioning, are
 * inherited from the pie series and don't apply for rectangular layouts.
 *
 * An `item` series. If the [type](#series.item.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/parliament-chart
 *         Parliament chart (circular item chart)
 *
 * @sample highcharts/series-item/rectangular
 *         Rectangular item chart
 *
 * @sample highcharts/series-item/symbols
 *         Infographic with symbols
 *
 * @extends plotOptions.pie
 *
 * @extends series,plotOptions.item
 *
 * @since 7.1.0
 *
 * @product highcharts
 *
 * @excluding borderColor, borderWidth, depth, linecap, shadow,
 *            slicedOffset
 *
 * @excluding dataParser, dataURL, stack, xAxis, yAxis, dataSorting,
 *            boostThreshold, boostBlending
 *
 * @requires modules/item-series
 */
export interface ItemSeriesOptions extends PieSeriesOptions {

    crisp?: boolean;

    /**
     * An array of data points for the series. For the `item` series type,
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
     *    [turboThreshold](#series.item.turboThreshold),
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
     * @extends series.pie.data
     *
     * @exclude sliced
     *
     * @product highcharts
     */
    data?: Array<(ItemPointOptions|PointShortOptions)>;

    /**
     * In circular view, the end angle of the item layout, in degrees where
     * 0 is up.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     */
    endAngle?: number;

    /**
     * @excluding legendItemClick
     */
    events?: ItemSeriesEventsOptions;

    /**
     * In circular view, the size of the inner diameter of the circle. Can
     * be a percentage or pixel value. Percentages are relative to the outer
     * perimeter. Pixel values are given as integers.
     *
     * If the `rows` option is set, it overrides the `innerSize` setting.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     */
    innerSize?: (number|string);

    /**
     * The padding between the items, given in relative size where the size
     * of the item is 1.
     *
     * @type {number}
     */
    itemPadding?: number;

    /**
     * The layout of the items in rectangular view. Can be either
     * `horizontal` or `vertical`.
     *
     * @sample highcharts/series-item/symbols
     *         Horizontal layout
     *
     * @type {string}
     */
    layout?: 'horizontal'|'vertical';

    /**
     * @extends plotOptions.series.marker
     */
    marker?: ItemPointMarkerOptions;

    /**
     * The number of rows to display in the rectangular or circular view. If
     * the `innerSize` is set, it will be overridden by the `rows` setting.
     *
     * @sample highcharts/series-item/rows-columns
     *         Fixed row count
     */
    rows?: number;

    showInLegend?: boolean;

    /**
     * In circular view, the start angle of the item layout, in degrees
     * where 0 is up.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     */
    startAngle?: number;

    states?: SeriesStatesOptions<ItemSeriesOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default ItemSeriesOptions;
