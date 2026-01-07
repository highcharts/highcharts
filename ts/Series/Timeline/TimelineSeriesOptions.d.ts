/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2026 Highsoft AS
 *
 *  Author: Daniel Studencki
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

import type {
    LegendSymbolType,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type LineSeriesOptions from '../Line/LineSeriesOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type TimelineDataLabelOptions from './TimelineDataLabelOptions';
import type TimelinePointOptions from './TimelinePointOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */


/**
 * The timeline series presents given events along a drawn line.
 *
 * The `timeline` series. If the [type](#series.timeline.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/series-timeline/alternate-labels
 *         Timeline series
 *
 * @sample highcharts/series-timeline/inverted
 *         Inverted timeline
 *
 * @sample highcharts/series-timeline/datetime-axis
 *         With true datetime axis
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.timeline
 *
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, findNearestPointBy,
 *            getExtremesFromAll, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart,
 *            softThreshold, stacking, step, threshold, turboThreshold,
 *            zoneAxis, zones, dataSorting, boostBlending
 *
 * @excluding animationLimit, boostThreshold, connectEnds, connectNulls,
 *            cropThreshold, dashStyle, dataParser, dataURL, findNearestPointBy,
 *            getExtremesFromAll, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart, softThreshold,
 *            stacking, stack, step, threshold, turboThreshold, zoneAxis, zones,
 *            dataSorting, boostBlending
 *
 * @product highcharts
 *
 * @since 7.0.0
 *
 * @requires modules/timeline
 */
export interface TimelineSeriesOptions extends LineSeriesOptions {

    colorByPoint?: boolean;

    colorKey?: string;

    /**
     * An array of data points for the series. For the `timeline` series type,
     * points can be given with three general parameters, `name`, `label`,
     * and `description`:
     *
     * Example:
     *
     * ```js
     * series: [{
     *    type: 'timeline',
     *    data: [{
     *        name: 'Jan 2018',
     *        label: 'Some event label',
     *        description: 'Description to show in tooltip'
     *    }]
     * }]
     * ```
     * If all points additionally have the `x` values, and xAxis type is set to
     * `datetime`, then events are laid out on a true time axis, where their
     * placement reflects the actual time between them.
     *
     * @sample {highcharts} highcharts/series-timeline/alternate-labels
     *         Alternate labels
     *
     * @sample {highcharts} highcharts/series-timeline/datetime-axis
     *         Real time intervals
     *
     * @extends series.line.data
     *
     * @excluding marker, y
     *
     * @product highcharts
     */
    data?: Array<TimelinePointOptions>;

    /**
     *
     * @declare Highcharts.TimelineDataLabelsOptionsObject
     */
    dataLabels?: TimelineDataLabelOptions;

    ignoreHiddenPoint?: boolean;

    legendSymbol?: LegendSymbolType;

    legendType?: ('point'|'series');

    /**
     * Pixel width of the graph line.
     */
    lineWidth?: number;

    marker?: PointMarkerOptions;

    radius?: number;

    radiusPlus?: number;

    showInLegend?: boolean;

    states?: SeriesStatesOptions<TimelineSeriesOptions>;

    stickyTracking?: boolean;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default TimelineSeriesOptions;
