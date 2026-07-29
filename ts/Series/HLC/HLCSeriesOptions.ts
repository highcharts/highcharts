/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Lysy
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
    ColumnSeriesOptions,
    ColumnSeriesTooltipOptions
} from '../Column/ColumnSeriesOptions';
import type HLCPointOptions from './HLCPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * An HLC chart is a style of financial chart used to describe price
 * movements over time. It displays high, low and close values per
 * data point.
 *
 * A `hlc` series. If the [type](#series.hlc.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample stock/demo/hlc/
 *         HLC chart
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.hlc
 *
 * @excluding borderColor, borderRadius, borderWidth, crisp, stacking,
 *            stack
 *
 * @product highstock
 */
export interface HLCSeriesOptions extends ColumnSeriesOptions {

    /**
     * @default close
     */
    colorKey?: string;

    /**
     * An array of data points for the series. For the `hlc` series type,
     * points can be given in the following ways:
     *
     * 1. An array of arrays with 4 or 3 values. In this case, the values
     *  correspond
     *    to `x,high,low,close`. If the first value is a string, it is applied
     *    as the name of the point, and the `x` value is inferred. The `x`
     *  value can
     *    also be omitted, in which case the inner arrays should be of length
     *  of 3\.
     *    Then the `x` value is automatically calculated, either starting at 0
     *  and
     *    incremented by 1, or from `pointStart` and `pointInterval` given in
     *  the
     *    series options.
     *    ```js
     *    data: [
     *        [0, 5, 6, 7],
     *        [1, 4, 8, 2],
     *        [2, 3, 4, 10]
     *    ]
     *    ```
     *
     * 2. An array of objects with named values. The following snippet shows
     *  only a
     *    few settings, see the complete options set below. If the total number
     *  of
     *    data points exceeds the series'
     *    [turboThreshold](#series.hlc.turboThreshold), this option is not
     *    available.
     *    ```js
     *    data: [{
     *        x: 1,
     *        high: 4,
     *        low: 5,
     *        close: 2,
     *        name: "Point2",
     *        color: "#00FF00"
     *    }, {
     *        x: 1,
     *        high: 3,
     *        low: 6,
     *        close: 7,
     *        name: "Point1",
     *        color: "#FF00FF"
     *    }]
     *    ```
     *
     * @extends series.arearange.data
     *
     * @excluding y, marker
     *
     * @product highstock
     */
    data?: Array<(HLCPointOptions|PointShortOptions)>;

    /**
     * What type of legend symbol to render for this series. For HLC series,
     * the default is `hlc`, a vertical stem with a tick on the right
     * representing the closing value.
     *
     * @default hlc
     */
    legendSymbol?: string;

    /**
     * The pixel width of the line/border. Defaults to `1`.
     *
     * @sample {highstock} stock/plotoptions/hlc-linewidth/
     *         A greater line width
     *
     * @default 1
     *
     * @product highstock
     */
    lineWidth?: number;

    /**
     * Determines which one of  `high`, `low`, `close` values should
     * be represented as `point.y`, which is later used to set dataLabel
     * position and [compare](#plotOptions.series.compare).
     *
     * @sample {highstock} stock/plotoptions/hlc-pointvalkey/
     *         Possible values
     *
     * @declare Highcharts.OptionsHLCPointValKeyValue
     *
     * @default close
     *
     * @validvalue ["high","low","close"]
     *
     * @product highstock
     */
    pointValKey?: string;

    states?: SeriesStatesOptions<HLCSeriesOptions>;

    threshold?: number|null;

    tooltip?: HLCSeriesTooltipOptions;

    /* *
     *
     *  Excluded
     *
     * */

    dataParser?: undefined;
    dataURL?: undefined;

}

export interface HLCSeriesTooltipOptions extends ColumnSeriesTooltipOptions {
    /**
     * @default '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>{series.chart.options.lang.stockHigh}: {point.high}<br/>{series.chart.options.lang.stockLow}: {point.low}<br/>{series.chart.options.lang.stockClose}: {point.close}<br/>'
     */
    pointFormat?: ColumnSeriesTooltipOptions['pointFormat'];
}

/* *
 *
 *  Default Export
 *
 * */

export default HLCSeriesOptions;
