/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type HeikinAshiSeriesOptions from './HeikinAshiSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * An HeikinAshi series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * @sample stock/demo/heikinashi/
 *         Heikin Ashi series
 *
 * @extends      plotOptions.candlestick
 * @product      highstock
 * @requires     modules/heikinashi
 * @optionparent plotOptions.heikinashi
 */
const HeikinAshiDefaults: HeikinAshiSeriesOptions = {
    dataGrouping: {
        groupAll: true
    }
};

/**
 * A `heikinashi` series. If the [type](#series.heikinashi.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.heikinashi
 * @excluding dataParser, dataURL, marker
 * @product   highstock
 * @requires  modules/heikinashi
 * @apioption series.heikinashi
 */

/**
 * An array of data points for the series. For the `heikinashi` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 5 or 4 values. In this case, the values correspond
 *    to `x,open,high,low,close`. If the first value is a string, it is applied
 *    as the name of the point, and the `x` value is inferred. The `x` value can
 *    also be omitted, in which case the inner arrays should be of length 4.
 *    Then the `x` value is automatically calculated, either starting at 0 and
 *    incremented by 1, or from `pointStart` and `pointInterval` given in the
 *    series options.
 *    ```js
 *    data: [
 *        [0, 7, 2, 0, 4],
 *        [1, 1, 4, 2, 8],
 *        [2, 3, 3, 9, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.heikinashi.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        open: 9,
 *        high: 2,
 *        low: 4,
 *        close: 6,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        open: 1,
 *        high: 4,
 *        low: 7,
 *        close: 7,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @type      {Array<Array<(number|string),number,number,number>|Array<(number|string),number,number,number,number>|*>}
 * @extends   series.candlestick.data
 * @excluding y
 * @product   highstock
 * @apioption series.heikinashi.data
 */

''; // adds doclets above to transpilat

/* *
 *
 *  Default Export
 *
 * */

export default HeikinAshiDefaults;
