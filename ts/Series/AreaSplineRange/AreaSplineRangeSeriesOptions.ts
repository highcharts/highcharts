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

import type AreaRangeSeriesOptions from '../AreaRange/AreaRangeSeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * The area spline range is a cartesian series type with higher and lower
 * Y values along an X axis. The area inside the range is colored, and the
 * graph outlining the area is a smoothed spline.
 *
 * A `areasplinerange` series. If the [type](#series.areasplinerange.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highstock} stock/demo/areasplinerange/
 *         Area spline range
 *
 * @extends plotOptions.arearange
 *
 * @extends series,plotOptions.areasplinerange
 *
 * @excluding step, boostThreshold, boostBlending
 *
 * @excluding dataParser, dataURL, stack, step, boostThreshold, boostBlending
 *
 * @since 2.3.0
 *
 * @product highcharts highstock
 *
 * @requires highcharts-more
 *
 * @optionparent plotOptions.areasplinerange
 *
 * @optionparent series.areasplinerange
 */
export interface AreaSplineRangeSeriesOptions extends AreaRangeSeriesOptions {
    states?: SeriesStatesOptions<AreaSplineRangeSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default AreaSplineRangeSeriesOptions;
