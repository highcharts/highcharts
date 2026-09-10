/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A spline series is a special type of line series, where the segments
 * between the data points are smoothed.
 *
 * A `spline` series. If the [type](#series.spline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/spline-irregular-time/
 *         Spline chart
 *
 * @sample {highstock} stock/demo/spline/
 *         Spline chart
 *
 * @extends plotOptions.series
 *
 * @extends series,plotOptions.spline
 *
 * @excluding step, boostThreshold, boostBlending
 *
 * @excluding dataParser, dataURL, step, boostThreshold, boostBlending
 *
 * @product highcharts highstock
 *
 * @optionparent plotOptions.spline
 *
 * @optionparent series.spline
 */
export interface SplineSeriesOptions extends LineSeriesOptions {
    states?: SeriesStatesOptions<SplineSeriesOptions>;

    /* *
     *
     *  Excluded
     *
     * */

    dataParser?: undefined;
    dataURL?: undefined;
}

/* *
 *
 *  Default Export
 *
 * */

export default SplineSeriesOptions;
