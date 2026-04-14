/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type AreaSeriesOptions from '../Area/AreaSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * The area spline series is an area series where the graph between the points
 * is smoothed into a spline.
 *
 * A `areaspline` series. If the [type](#series.areaspline.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/areaspline/
 *         Area spline chart
 *
 * @sample {highstock} stock/demo/areaspline/
 *         Area spline chart
 *
 * @extends plotOptions.area
 *
 * @extends series,plotOptions.areaspline
 *
 * @excluding step, boostThreshold, boostBlending
 *
 * @excluding dataParser, dataURL, step, boostThreshold, boostBlending
 *
 * @product highcharts highstock
 *
 * @optionparent plotOptions.areaspline
 *
 * @optionparent series.areaspline
 */
export interface AreaSplineSeriesOptions extends AreaSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineSeriesOptions;
