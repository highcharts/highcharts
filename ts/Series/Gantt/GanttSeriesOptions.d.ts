/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Author: Lars A. V. Cabrera
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type {
    ConnectorsOptions
} from '../../Gantt/ConnectorsOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type GanttPointOptions from './GanttPointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type {
    XRangeSeriesOptions,
    XRangeSeriesTooltipOptions
} from '../XRange/XRangeSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @declare Highcharts.ConnectorsAnimationOptionsObject
 *
 * @optionparent series.gantt.connectors.animation
 */
export interface GanttAnimationOptions extends Partial<AnimationOptions> {
    reversed?: boolean;
}

export interface GanttConnectorOptions extends ConnectorsOptions {
    animation?: (boolean|GanttAnimationOptions);
}

export type GanttDependencyOptions = (
    | string
    | GanttConnectorOptions
    | Array<GanttConnectorOptions>
    | Array<string>
);

/**
 * A `gantt` series. If the [type](#series.gantt.type) option is not specified,
 * it is inherited from [chart.type](#chart.type).
 *
 * A `gantt` series.
 *
 * @extends plotOptions.xrange
 *
 * @extends series,plotOptions.gantt
 *
 * @product gantt
 *
 * @requires highcharts-gantt
 *
 * @excluding boostThreshold, dashStyle, findNearestPointBy,
 *            getExtremesFromAll, marker, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart
 */
export interface GanttSeriesOptions extends XRangeSeriesOptions {

    connectors?: GanttConnectorOptions;

    /**
     * Data for a Gantt series.
     *
     * @declare Highcharts.GanttPointOptionsObject
     *
     * @type {Array<*>}
     *
     * @extends series.xrange.data
     *
     * @excluding className, connect, dataLabels, events, selected, x, x2
     *
     * @product gantt
     */
    data?: Array<GanttPointOptions>;

    dataLabels?: Partial<DataLabelOptions>;

    grouping?: boolean;

    /**
     * A partial fill for each point, typically used to visualize how much
     * of a task is performed.
     *
     * @see [completed](#series.gantt.data.completed)
     *
     * @sample gantt/demo/progress-indicator
     *         Gantt with progress indicator
     */
    partialFill?: XRangeSeriesOptions['partialFill'];

    states?: SeriesStatesOptions<GanttSeriesOptions>;

    tooltip?: GanttSeriesTooltipOptions;
}

export interface GanttSeriesTooltipOptions extends XRangeSeriesTooltipOptions {
    /**
     * @default '<span style="font-size: 0.8em">{series.name}</span><br/>'
     */
    headerFormat?: XRangeSeriesTooltipOptions['headerFormat'];

    /**
     * @default function (this): string { [internal code] }
     */
    pointFormatter?: XRangeSeriesTooltipOptions['pointFormatter'];
}

/* *
 *
 *  Default Export
 *
 * */

export default GanttSeriesOptions;
