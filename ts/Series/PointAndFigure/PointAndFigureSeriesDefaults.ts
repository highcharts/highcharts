/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musialowski
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

import type PointAndFigureSeriesOptions from './PointAndFigureSeriesOptions';

/* *
 *
 *  API Options
 *
 * */

/**
 * The Point and Figure series represents changes in stock price movements,
 * without focusing on the time and volume. Each data point is created when the
 * `boxSize` criteria is met. Opposite column of points gets created only when
 * the `reversalAmount` threshold is met.
 *
 * @sample stock/demo/pointandfigure/
 *         Point and Figure series
 *
 * @extends      plotOptions.scatter
 * @product      highstock
 * @excluding    boostBlending, boostThreshold, compare, compareBase,
 *               compareStart, cumulative, cumulativeStart, dataGrouping,
 *               dataGrouping, dragDrop
 * @requires     modules/pointandfigure
 * @optionparent plotOptions.pointandfigure
 */

const PointAndFigureSeriesDefaults: PointAndFigureSeriesOptions = {
    boxSize: '1%',
    reversalAmount: 3,
    tooltip: {
        pointFormat: '<span style="color:{point.color}">\u25CF</span> ' +
          '<b> {series.name}</b><br/>' +
          'Close: {point.y:.2f}<br/>',
        headerFormat: ''
    },
    turboThreshold: 0,
    groupPadding: 0.2,
    pointPadding: 0.1,
    pointRange: null,
    dataGrouping: {
        enabled: false
    },
    markerUp: {
        symbol: 'cross',
        lineColor: '#00FF00',
        lineWidth: 2
    },
    marker: {
        symbol: 'circle',
        fillColor: 'transparent',
        lineColor: '#FF0000',
        lineWidth: 2
    },
    legendSymbol: 'lineMarker'
};

/* *
 *
 *  API Options
 *
 * */

/**
 * A `pointandfigure` series. If the [type](#series.pointandfigure.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @type      {*}
 * @extends   series,plotOptions.pointandfigure
 * @product   highstock
 * @excluding boostBlending, boostThreshold, compare, compareBase,
 *            compareStart, cumulative, cumulativeStart, dataGrouping,
 *            dataGrouping, dragDrop
 * @requires  modules/pointandfigure
 * @apioption series.pointandfigure
 */

/**
 * An array of data points for the series. For the `pointandfigure` series
 * type, points can be given in the following way:
 *
 * 1. An array of arrays with 2 values. In this case, the values correspond
 *    to `x, y`. Y values are parsed under the hood to create
 *    point and figure format data points.
 *    ```js
 *    data: [
 *        [1665408600000, 140.42],
 *        [1665495000000, 138.98],
 *        [1665581400000, 138.34]
 *    ]
 *    ```
 * 2. An array of objects with named values `{x, y}`.
 *    ```js
 *    data: [
 *        {x: 1665408600000, y: 140.42},
 *        {x: 1665495000000, y: 138.98},
 *        {x: 1665581400000, y: 138.34}
 *    ]
 *    ```
 *
 * @type      {Array<Array<number,number>|*>}
 * @extends   series.scatter.data
 * @product   highstock
 * @apioption series.pointandfigure.data
 */

/**
 * Price increment that determines if a new point should be added to the column.
 *
 *
 * @type      {string|number}
 * @since 12.0.0
 * @product   highstock
 * @apioption plotOptions.pointandfigure.boxSize
 */

/**
 * Threshold that should be met to create a new column in opposite direction.
 *
 *
 * @type      {number}
 * @since 12.0.0
 * @product   highstock
 * @apioption plotOptions.pointandfigure.reversalAmount
 */

/**
 * Marker options for the up direction column, inherited from `series.marker`
 * options.
 *
 * @extends   plotOptions.series.marker
 * @product   highstock
 * @apioption plotOptions.pointandfigure.markerUp
 */

''; // Keeps doclets above detached

/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeriesDefaults;
