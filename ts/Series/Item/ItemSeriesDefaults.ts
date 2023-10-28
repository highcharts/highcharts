/* *
 *
 *  (c) 2019-2021 Torstein Honsi
 *
 *  Item series type for Highcharts
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ItemSeriesOptions from './ItemSeriesOptions';

import SeriesDefaults from '../../Core/Series/SeriesDefaults.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

/* *
 *
 *  API Options
 *
 * */

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
 * @sample       highcharts/demo/parliament-chart
 *               Parliament chart (circular item chart)
 * @sample       highcharts/series-item/rectangular
 *               Rectangular item chart
 * @sample       highcharts/series-item/symbols
 *               Infographic with symbols
 *
 * @extends      plotOptions.pie
 * @since        7.1.0
 * @product      highcharts
 * @excluding    borderColor, borderWidth, depth, linecap, shadow,
 *               slicedOffset
 * @requires     modules/item-series
 * @optionparent plotOptions.item
 */
const ItemSeriesDefaults: ItemSeriesOptions = {

    /**
     * In circular view, the end angle of the item layout, in degrees where
     * 0 is up.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     * @type {undefined|number}
     */
    endAngle: void 0,

    /**
     * In circular view, the size of the inner diameter of the circle. Can
     * be a percentage or pixel value. Percentages are relative to the outer
     * perimeter. Pixel values are given as integers.
     *
     * If the `rows` option is set, it overrides the `innerSize` setting.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     * @type {string|number}
     */
    innerSize: '40%',

    /**
     * The padding between the items, given in relative size where the size
     * of the item is 1.
     * @type {number}
     */
    itemPadding: 0.1,

    /**
     * The layout of the items in rectangular view. Can be either
     * `horizontal` or `vertical`.
     * @sample highcharts/series-item/symbols
     *         Horizontal layout
     * @type {string}
     */
    layout: 'vertical',

    /**
     * @extends plotOptions.series.marker
     */
    marker: merge(SeriesDefaults.marker, {
        radius: null
    }),

    /**
     * The number of rows to display in the rectangular or circular view. If
     * the `innerSize` is set, it will be overridden by the `rows` setting.
     *
     * @sample highcharts/series-item/rows-columns
     *         Fixed row count
     * @type {number}
     */
    rows: void 0,

    crisp: false,

    showInLegend: true,

    /**
     * In circular view, the start angle of the item layout, in degrees
     * where 0 is up.
     *
     * @sample highcharts/demo/parliament-chart
     *         Parliament chart
     * @type {undefined|number}
     */
    startAngle: void 0

};

/**
 * An `item` series. If the [type](#series.item.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.item
 * @excluding dataParser, dataURL, stack, xAxis, yAxis, dataSorting,
 *            boostThreshold, boostBlending
 * @product   highcharts
 * @requires  modules/item-series
 * @apioption series.item
 */

/**
 * An array of data points for the series. For the `item` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
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
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<string,(number|null)>|null|*>}
 * @extends   series.pie.data
 * @exclude   sliced
 * @product   highcharts
 * @apioption series.item.data
 */

/**
 * The sequential index of the data point in the legend.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.pie.data.legendIndex
 */

/**
 * @excluding legendItemClick
 * @apioption series.item.events
 */

''; // keeps the doclets above separate

/* *
 *
 *  Default Export
 *
 * */

export default ItemSeriesDefaults;
