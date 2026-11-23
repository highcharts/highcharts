/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Kamil Musiałowski
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type PointAndFigurePointOptions from './PointAndFigurePointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';

/* *
 *
 *  Declarations
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
 * @extends plotOptions.scatter
 *
 * @product highstock
 *
 * @excluding dataGrouping
 *
 * @requires modules/pointandfigure
 */
export interface PointAndFigureSeriesOptions extends ScatterSeriesOptions {

    /**
     * Price increment that determines if a new point should be added to the
     * column.
     *
     * @default '1%'
     *
     * @since 12.0.0
     *
     * @product highstock
     */
    boxSize: number|string;

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
     * @extends series.scatter.data
     *
     * @product highstock
     */
    data?: Array<(PointAndFigurePointOptions|PointShortOptions)>;

    /**
     * Padding between each value groups, in x axis units.
     *
     * @default 0.2
     *
     * @product highstock
     */
    groupPadding: number;

    /**
     * Marker options for the down direction column.
     *
     * @default {"symbol": "circle", "fillColor": "transparent", "lineColor": "#FF0000", "lineWidth": 2}
     *
     * @product highstock
     */
    marker: PointMarkerOptions;

    /**
     * Marker options for the up direction column, used instead of `marker`
     * for rising columns.
     *
     * @default {"symbol": "cross", "lineColor": "#00FF00", "lineWidth": 2}
     *
     * @product highstock
     */
    markerUp: PointMarkerOptions;

    /**
     * Padding between each column or bar, in x axis units.
     *
     * @default 0.1
     *
     * @product highstock
     */
    pointPadding: number;

    /**
     * Threshold that should be met to create a new column in opposite
     * direction.
     *
     * @default 3
     *
     * @since 12.0.0
     *
     * @product highstock
     */
    reversalAmount: number;

    /* *
     *
     *  Excluded
     *
     * */

    boostBlending?: undefined;
    boostThreshold?: undefined;
    compare?: undefined;
    compareBase?: undefined;
    compareStart?: undefined;
    cumulative?: undefined;
    cumulativeStart?: undefined;
    dragDrop?: undefined;
}


/* *
 *
 *  Default Export
 *
 * */

export default PointAndFigureSeriesOptions;
