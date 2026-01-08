/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Sebastian Domas
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

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import HistogramPointOptions from './HistogramPointOptions';
import { PointShortOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A histogram is a column series which represents the distribution of the
 * data set in the base series. Histogram splits data into bins and shows
 * their frequencies.
 *
 * A `histogram` series. If the [type](#series.histogram.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/histogram/
 *         Histogram
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.histogram
 *
 * @excluding boostThreshold, dragDrop, pointInterval, pointIntervalUnit,
 *            stacking, boostBlending
 *
 * @excluding dataParser, dataURL, boostThreshold, boostBlending
 *
 * @product highcharts
 *
 * @since 6.0.0
 *
 * @requires modules/histogram-bellcurve
 */
export interface HistogramSeriesOptions extends ColumnSeriesOptions {

    /**
     * An integer identifying the index to use for the base series, or a string
     * representing the id of the series.
     */
    baseSeries?: (number|string);

    /**
     * A preferable number of bins. It is a suggestion, so a histogram may
     * have a different number of bins. By default it is set to the square
     * root of the base series' data length. Available options are:
     * `square-root`, `sturges`, `rice`. You can also define a function
     * which takes a `baseSeries` as a parameter and should return a
     * positive integer.
     *
     * @type {"square-root"|"sturges"|"rice"|number|Function}
     */
    binsNumber?: (number|string|Function);

    /**
     * Width of each bin. By default the bin's width is calculated as
     * `(max - min) / number of bins`. This option takes precedence over
     * [binsNumber](#plotOptions.histogram.binsNumber).
     */
    binWidth?: number;

    /**
     * An array of data points for the series. For the `histogram` series type,
     * points can be given in the following way:
     *
     * An array of numerical values. In this case, the numerical values will
     *  be
     *    used to calculate the `x` and `y` values.
     * Example:
     *    ```js
     *    data: [0, 5, 3, 5]
     *    ```
     *
     * Data can also be passed in the form of a derived series.
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @extends series.line.data
     *
     * @type {Array<number|null>|null|*}
     *
     * @product highcharts
     */
    data?: Array<(HistogramPointOptions|PointShortOptions)>;

    grouping?: boolean;

    groupPadding?: number;

    pointPadding?: number;

    pointPlacement?: string;

    states?: SeriesStatesOptions<HistogramSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default HistogramSeriesOptions;
