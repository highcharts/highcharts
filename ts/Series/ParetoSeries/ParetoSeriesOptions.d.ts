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

import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type ParetoPointOptions from './ParetoPointOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * A pareto diagram is a type of chart that contains both bars and a line
 * graph, where individual values are represented in descending order by
 * bars, and the cumulative total is represented by the line.
 *
 * A `pareto` series. If the [type](#series.pareto.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample {highcharts} highcharts/demo/pareto/
 *         Pareto diagram
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.pareto
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @excluding allAreas, boostThreshold, borderColor, borderRadius,
 *            borderWidth, crisp, colorAxis, depth, data, dragDrop,
 *            edgeColor, edgeWidth, findNearestPointBy, gapSize, gapUnit,
 *            grouping, groupPadding, groupZPadding, maxPointWidth, keys,
 *            negativeColor, pointInterval, pointIntervalUnit,
 *            pointPadding, pointPlacement, pointRange, pointStart,
 *            pointWidth, shadow, step, softThreshold, stacking,
 *            threshold, zoneAxis, zones, boostBlending
 *
 * @excluding data, dataParser, dataURL, boostThreshold, boostBlending
 *
 * @requires modules/pareto
 */
interface ParetoSeriesOptions extends LineSeriesOptions {

    /**
     * An array of data points for the series. For the `pareto` series type,
     * points are calculated dynamically.
     *
     * @type {Array<Array<number|string>|*>}
     *
     * @extends series.column.data
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    data?: Array<(ParetoPointOptions|PointShortOptions)>;

    /**
     * An integer identifying the index to use for the base series, or a string
     * representing the id of the series.
     */
    baseSeries?: number|string;

    states?: SeriesStatesOptions<ParetoSeriesOptions>;

    /**
     * Higher zIndex than column series to draw line above shapes.
     */
    zIndex?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default ParetoSeriesOptions;
