/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Lysy
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { BorderRadiusOptionsObject } from '../../Extensions/BorderRadius';
import type RenkoSeriesOptions from './RenkoSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * A Renko series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * @sample stock/demo/renko/
 *         Renko series
 *
 *
 * @sample stock/series-renko/renko-vs-heikinashi-vs-candlestick
 *         Renko series
 *
 * @extends      plotOptions.column
 * @excluding boost, boostBlending, boostThreshold, centerInCategory,
 * cumulative, cumulativeStart, dashStyle, dragDrop, dataSorting, edgeColor,
 * stacking, getExtremesFromAll, clip, colorByPoint, compare, compareBase,
 * compareStart, compareTo, dataGrouping, edgeWidth, lineColor, linkedTo,
 * pointPadding, pointPlacement, pointRange, pointStart, pointWidth
 * @product      highstock
 * @requires     modules/renko
 * @optionparent plotOptions.renko
 */
const RenkoDefaults: RenkoSeriesOptions = {
    /**
     * The size of the individual box, representing a point. Can be set in yAxis
     * value, or percent value of the first point e.g. if first point's value is
     * 200, and box size is set to `20%`, the box will be 40, so the new point
     * will be drawn when the next value changes for more than 40.
     */
    boxSize: 4,
    groupPadding: 0,
    pointPadding: 0,
    downColor: '#ff0000',
    navigatorOptions: {
        type: 'renko'
    },
    fillColor: 'transparent',
    borderWidth: 2,
    lineWidth: 0,
    stickyTracking: true,
    borderRadius: {
        where: 'all'
    } as BorderRadiusOptionsObject,
    tooltip: {
        pointFormat:
            '<span style="color:{point.color}">\u25CF</span> {series.name}: <b>{point.low:.2f} - {point.y:.2f}</b><br/>'
    }
};

/* *
 *
 *  API Options
 *
 * */

/**
 * A `renko` series. If the [type](#series.renko.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.renko
 * @product   highstock
 * @excluding boost, compare, compareStart, connectNulls, cumulative,
 * cumulativeStart, dataGrouping, dataParser, dataSorting, dataURL,
 * dragDrop, marker, step
 * @requires  modules/renko
 * @apioption series.renko
 */

/**
 * An array of data points for the series. For the `renko` series
 * type, points can be given in the following ways:
 *
 * 1. An array of arrays with 1 or 2 values correspond to `x,close`. If the
 * first value is a string, it is applied as the name of the point, and the
 * `x` value is inferred. The `x` value can also be omitted, in which case
 * the inner arrays should be of length 4. Then the `x` value is
 * automatically calculated, either starting at 0 and incremented by 1, or
 * from `pointStart` and `pointInterval` given in the series options.
 *    ```js
 *    data: [
 *        [0, 7],
 *        [1, 1],
 *        [2, 3]
 *    ]
 *    ```
 *
 * 2. An array of objects with named values. With renko series, the data
 * does not directly correspond to the points in the series. the reason
 * is that the points are calculated based on the trends and boxSize.
 * Setting options for individual point is impossible.
 *
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 6
 *    }, {
 *        x: 1,
 *        y: 7,
 *    }]
 *    ```
 *
 * @type      {Array<Array<number,number>|*>}
 * @extends series.column.data
 * @product highstock
 * @apioption series.renko.data
 */
(''); // Adds doclets above to transpiled

/* *
 *
 *  Default Export
 *
 * */

export default RenkoDefaults;
