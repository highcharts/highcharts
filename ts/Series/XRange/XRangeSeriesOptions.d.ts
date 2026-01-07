/* *
 *
 *  X-range series module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi, Lars A. V. Cabrera
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
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type XRangePointOptions from './XRangePointOptions';
import type { XRangePointPartialFillOptions } from './XRangePointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * The X-range series displays ranges on the X axis, typically time
 * intervals with a start and end date.
 *
 * An `xrange` series. If the [type](#series.xrange.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/x-range/
 *         X-range
 *
 * @sample {highcharts} highcharts/css/x-range/
 *         Styled mode X-range
 *
 * @sample {highcharts} highcharts/chart/inverted-xrange/
 *         Inverted X-range
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.xrange
 *
 * @since 6.0.0
 *
 * @product highcharts highstock gantt
 *
 * @excluding boostThreshold, crisp, cropThreshold, depth, edgeColor,
 *            edgeWidth, findNearestPointBy, getExtremesFromAll,
 *            negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointRange, pointStart, softThreshold,
 *            stacking, threshold, data, dataSorting, boostBlending
 *
 * @excluding boostThreshold, crisp, cropThreshold, depth, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointRange,
 *            pointStart, softThreshold, stacking, threshold, dataSorting,
 *            boostBlending
 *
 * @requires modules/xrange
 */
export interface XRangeSeriesOptions extends ColumnSeriesOptions {

    borderRadius?: number;

    /**
     * In an X-range series, this option makes all points of the same Y-axis
     * category the same color.
     */
    colorByPoint?: boolean;

    /**
     * An array of data points for the series. For the `xrange` series type,
     * points can be given in the following ways:
     *
     * 1. An array of objects with named values. The objects are point
     *  configuration
     *    objects as seen below.
     *    ```js
     *    data: [{
     *        x: Date.UTC(2017, 0, 1),
     *        x2: Date.UTC(2017, 0, 3),
     *        name: "Test",
     *        y: 0,
     *        color: "#00FF00"
     *    }, {
     *        x: Date.UTC(2017, 0, 4),
     *        x2: Date.UTC(2017, 0, 5),
     *        name: "Deploy",
     *        y: 1,
     *        color: "#FF0000"
     *    }]
     *    ```
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @declare Highcharts.XrangePointOptionsObject
     *
     * @type {Array<*>}
     *
     * @extends series.line.data
     *
     * @product highcharts highstock gantt
     *
     * @apioption series.xrange.data
     */
    data?: Array<XRangePointOptions>;

    dataLabels?: Partial<DataLabelOptions>;

    /**
     * A partial fill for each point, typically used to visualize how much
     * of a task is performed. The partial fill object can be set either on
     * series or point level.
     *
     * @sample {highcharts} highcharts/demo/x-range
     *         X-range with partial fill
     *
     * @product highcharts highstock gantt
     */
    partialFill?: XRangePointPartialFillOptions;

    pointRange?: number;

    states?: SeriesStatesOptions<XRangeSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default XRangeSeriesOptions;
