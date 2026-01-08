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
import type ColorType from '../../Core/Color/ColorType';
import type {
    ConnectorsOptions,
    ConnectorsStartMarkerOptions
} from '../../Gantt/ConnectorsOptions';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type GanttPointOptions from './GanttPointOptions';
import type {
    SeriesEventsOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';
import type XRangeSeriesOptions from '../XRange/XRangeSeriesOptions';

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
    startMarker?: GanttConnectorStartMarkerOptions;
}

export interface GanttConnectorStartMarkerOptions extends ConnectorsStartMarkerOptions {
    fill: ColorType;
}

export type GanttDependencyOptions = (
    | string
    | GanttConnectorOptions
    | Array<GanttConnectorOptions>
    | Array<string>
);

export interface GanttSeriesEventsOptions extends SeriesEventsOptions {
    afterAnimate?: undefined;
}

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
     *
     * @excluding afterAnimate
     *
     * @apioption series.gantt.events
     */
    events?: GanttSeriesEventsOptions;

    /**
     * Data for a Gantt series.
     *
     * @declare Highcharts.GanttPointOptionsObject
     *
     * @type {Array<*>}
     *
     * @extends series.xrange.data
     *
     * @excluding className, connect, dataLabels, events,
     *            partialFill, selected, x, x2
     *
     * @product gantt
     */
    data?: Array<GanttPointOptions>;

    dataLabels?: Partial<DataLabelOptions>;

    grouping?: boolean;

    states?: SeriesStatesOptions<GanttSeriesOptions>;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default GanttSeriesOptions;
