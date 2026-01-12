/* *
 *
 *  Networkgraph series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Paweł Fus
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
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type {
    DataLabelOptions,
    DataLabelTextPathOptions
} from '../../Core/Series/DataLabelOptions';
import type { EventCallback } from '../../Core/Callback';
import type {
    NetworkgraphDataOptions,
    NetworkgraphPointOptions
} from './NetworkgraphPointOptions';
import type NetworkgraphPoint from './NetworkgraphPoint';
import type NetworkgraphSeries from './NetworkgraphSeries';
import type NodesComposition from '../NodesComposition';
import type Point from '../../Core/Series/Point';
import type {
    PointMarkerOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type ReingoldFruchtermanLayout from './ReingoldFruchtermanLayout';
import type {
    SeriesEventsOptions,
    SeriesOptions,
    SeriesStatesOptions
} from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesStateInactiveOptions
    {
        animation?: (boolean|Partial<AnimationOptions>);
        linkOpacity?: number;
    }
}

export interface NetworkgraphDataLabelsFormatterCallbackFunction {
    (
        this: Point|NetworkgraphPoint,
        options: DataLabelOptions
    ): (number|string|null|undefined);
}

export interface NetworkgraphDataLabelsOptions
    extends DataLabelOptions {

    format?: string;
    formatter?: NetworkgraphDataLabelsFormatterCallbackFunction;
    linkFormat?: string;
    linkFormatter?: NetworkgraphDataLabelsFormatterCallbackFunction;
    linkTextPath?: DataLabelTextPathOptions;
}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.events
 */
export interface NetworkgraphEventsOptions extends SeriesEventsOptions {

    /**
     * Fires after the simulation is ended and the layout is stable.
     *
     * @type {Highcharts.Function}
     */
    afterSimulation?: NetworkgraphAfterSimulationCallback;

}

/**
 * @product highcharts
 *
 * @optionparent series.networkgraph.link
 */
export interface NetworkgraphLinkOptions {

    /**
     * Color of the link between two nodes.
     */
    color?: ColorType;

    /**
     * A name for the dash style to use for links.
     */
    dashStyle?: DashStyleValue;

    /**
     * Opacity of the link between two nodes.
     *
     * @default 1
     */
    opacity?: number;

    /**
     * Width (px) of the link between two nodes.
     */
    width?: number;

}

/**
 * A networkgraph is a type of relationship chart, where connnections
 * (links) attracts nodes (points) and other nodes repulse each other.
 *
 * A `networkgraph` series. If the [type](#series.networkgraph.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends plotOptions.line
 *
 * @extends series,plotOptions.networkgraph
 *
 * @product highcharts
 *
 * @sample highcharts/demo/network-graph/
 *         Networkgraph
 *
 * @since 7.0.0
 *
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            colorAxis, colorKey, connectNulls, cropThreshold, dragDrop,
 *            getExtremesFromAll, label, linecap, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement,
 *            pointStart, softThreshold, stack, stacking, step,
 *            threshold, xAxis, yAxis, zoneAxis, dataSorting,
 *            boostBlending
 *
 * @excluding boostThreshold, animation, animationLimit, connectEnds,
 *            connectNulls, cropThreshold, dragDrop, getExtremesFromAll, label,
 *            linecap, negativeColor, pointInterval, pointIntervalUnit,
 *            pointPlacement, pointStart, softThreshold, stack, stacking,
 *            step, threshold, xAxis, yAxis, zoneAxis, dataSorting,
 *            boostBlending
 *
 * @requires modules/networkgraph
 */
export interface NetworkgraphSeriesOptions
    extends SeriesOptions, NodesComposition.SeriesCompositionOptions {

    /**
     * An array of data points for the series. For the `networkgraph` series
     *  type,
     * points can be given in the following way:
     *
     * An array of objects with named values. The following snippet shows only a
     * few settings, see the complete options set below. If the total number of
     * data points exceeds the series'
     * [turboThreshold](#series.area.turboThreshold), this option is not
     *  available.
     *
     *  ```js
     *     data: [{
     *         from: 'Category1',
     *         to: 'Category2'
     *     }, {
     *         from: 'Category1',
     *         to: 'Category3'
     *     }]
     *  ```
     *
     * @extends series.line.data
     *
     * @excluding drilldown,marker,x,y,draDrop
     *
     * @sample {highcharts} highcharts/chart/reflow-true/
     *         Numerical values
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays/
     *         Arrays of numeric x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
     *         Arrays of datetime x and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-name-value/
     *         Arrays of point.name and y
     *
     * @sample {highcharts} highcharts/series/data-array-of-objects/
     *         Config objects
     *
     * @product highcharts
     */
    data?: Array<(NetworkgraphDataOptions|PointShortOptions)>;

    /**
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Networkgraph with labels on links
     *
     * @sample highcharts/series-networkgraph/textpath-datalabels
     *         Networkgraph with labels around nodes
     *
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved into the nodes
     *
     * @sample highcharts/series-networkgraph/link-datalabels
     *         Data labels moved under the links
     */
    dataLabels?: NetworkgraphDataLabelsOptions;

    /**
     * Flag to determine if nodes are draggable or not.
     */
    draggable?: boolean;

    events?: NetworkgraphEventsOptions;

    /**
     * @extends plotOptions.series.inactiveOtherPoints
     *
     * @default true
     */
    inactiveOtherPoints?: boolean;

    layoutAlgorithm?: ReingoldFruchtermanLayout.Options;

    /**
     * Link style options
     */
    link?: NetworkgraphLinkOptions;

    marker?: PointMarkerOptions;

    /**
     * A collection of options for the individual nodes. The nodes in a
     * networkgraph diagram are auto-generated instances of `Highcharts.Point`,
     * but options can be applied here and linked by the `id`.
     *
     * @sample highcharts/series-networkgraph/data-options/
     *         Networkgraph diagram with node options
     *
     * @product highcharts
     */
    nodes?: Array<NetworkgraphPointOptions>;

    states?: SeriesStatesOptions<NetworkgraphSeriesOptions>;

    /**
     * The opposite state of a hover for a single point link. Applied
     * to all links that are not coming from the hovered node.
     *
     * @declare Highcharts.SeriesStatesInactiveOptionsObject
     *
     * @apioption series.networkgraph.states.inactive
     */

    showInLegend?: boolean;

    stickyTracking?: boolean;

}

export type NetworkgraphAfterSimulationCallback =
    EventCallback<NetworkgraphSeries, Event>;

/* *
 *
 *  Default Export
 *
 * */

export default NetworkgraphSeriesOptions;
