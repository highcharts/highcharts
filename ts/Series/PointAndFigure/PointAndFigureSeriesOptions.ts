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

import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
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
 * @excluding boostBlending, boostThreshold, compare, compareBase,
 *            compareStart, cumulative, cumulativeStart, dataGrouping,
 *            dragDrop
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

    /**
     * Padding between each column or bar, in x axis units.
     *
     * @default 0.1
     *
     * @product highstock
     */
    pointPadding: number;

    /**
     * Marker options for the down direction column.
     *
     * @extends plotOptions.series.marker
     *
     * @default {"symbol": "circle", "fillColor": "transparent", "lineColor": "#FF0000", "lineWidth": 2}
     *
     * @product highstock
     */
    marker: PointMarkerOptions;

    /**
     * Marker options for the up direction column, inherited from
     * `series.marker` options.
     *
     * @extends plotOptions.series.marker
     *
     * @default {"symbol": "cross", "lineColor": "#00FF00", "lineWidth": 2}
     *
     * @product highstock
     */
    markerUp: PointMarkerOptions;

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
