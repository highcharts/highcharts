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

/* *
 *
 *  Imports
 *
 * */

import type CandlestickSeriesOptions from '../Candlestick/CandlestickSeriesOptions';
import type RenkoPointOptions from './RenkoPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type ColorType from '../../Core/Color/ColorType';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A Renko series is a style of financial chart used to describe price
 * movements over time. It displays open, high, low and close values per
 * data point.
 *
 * A `renko` series. If the [type](#series.renko.type)
 * option is not specified, it is inherited from [chart.type](
 * #chart.type).
 *
 * @sample stock/demo/renko/
 *         Renko Series
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.renko
 *
 * @product highstock
 *
 * @requires modules/renko
 *
 * @excluding boost, compare, compareStart, connectNulls, cumulative,
 * cumulativeStart, dataGrouping, dataParser, dataSorting, dataURL,
 * dragDrop, marker, step
 */
export interface RenkoSeriesOptions extends CandlestickSeriesOptions {
    /**
     *
     * Color of the point if there is a down trend. (color of point with up
     * trend is inferred from series.color)
     */
    downColor: ColorType;
    /**
     *
     * The size of the individual box, representing a point. Can be set in yAxis
     * value, or percent value of the first point e.g. if first point's value is
     * 200, and box size is set to `20%`, the box will be 40, so the new point
     * will be drawn when the next value changes for more than 40.
     */
    boxSize: string | number;

    data?: Array<RenkoPointOptions | PointShortOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default RenkoSeriesOptions;
