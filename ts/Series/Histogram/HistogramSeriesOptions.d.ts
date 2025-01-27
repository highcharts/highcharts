/* *
 *
 *  (c) 2010-2024 Highsoft AS
 *  Author: Sebastian Domas
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type HistogramSeries from './HistogramSeries';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

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
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
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

    data?: undefined;

    grouping?: boolean;

    groupPadding?: number;

    pointPadding?: number;

    pointPlacement?: string;

    states?: SeriesStatesOptions<HistogramSeries>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default HistogramSeriesOptions;
