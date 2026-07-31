/* *
 *
 *  Flowchart series
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Tord Vikestad
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type {
    FlowchartDataOptions,
    FlowchartPointOptions
} from './FlowchartPointOptions';
import type { FlowchartNodeShape } from './FlowchartSymbols';
import type {
    NetworkgraphDataLabelsOptions,
    NetworkgraphLinkOptions,
    NetworkgraphSeriesOptions
} from '../Networkgraph/NetworkgraphSeriesOptions';
import type { PointShortOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @product highcharts
 *
 * @optionparent plotOptions.flowchart.link
 */
export interface FlowchartLinkOptions extends NetworkgraphLinkOptions {

    /**
     * Length (px) of the arrowhead drawn where a link meets its `to` node.
     */
    arrowLength?: number;

    /**
     * Width (px) of the arrowhead drawn where a link meets its `to` node.
     */
    arrowWidth?: number;

    /**
     * Data label options applied to links only, on top of the series-wide
     * [dataLabels](#plotOptions.flowchart.dataLabels). A node's label sits
     * inside its shape while a link's label sits on the background between
     * two nodes, so the two want different colors - this is where a link's
     * own styling goes, without restyling every node label too.
     *
     * @extends plotOptions.flowchart.dataLabels
     */
    dataLabels?: NetworkgraphDataLabelsOptions;

    /**
     * Style applied to a reversed link - a "back" edge that the layout
     * flipped in order to lay the graph out as a directed acyclic graph, and
     * that therefore renders against the general top-to-bottom flow. Its
     * arrowhead still points at the `to` node the data gave it.
     */
    reversed?: {

        /**
         * Color of a reversed link. Defaults to the regular
         * [link.color](#plotOptions.flowchart.link.color).
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        color?: ColorType;

        /**
         * A name for the dash style to use for a reversed link.
         *
         * @type {Highcharts.DashStyleValue}
         */
        dashStyle?: DashStyleValue;

    };

}

/**
 * Options for the markers drawn where a link bends. A link that spans more
 * than one layer is routed through internal waypoints, which are otherwise
 * invisible since they never become series points. Enabling these draws a
 * marker at each one, which - when the series is `draggable` - doubles as a
 * handle for bending the link by hand.
 *
 * @product highcharts
 *
 * @optionparent plotOptions.flowchart.waypoints
 */
export interface FlowchartWaypointsOptions {

    /**
     * The color of a waypoint marker. Defaults to the link color.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    color?: ColorType;

    /**
     * Whether to draw a marker at each of a link's internal waypoints.
     */
    enabled?: boolean;

    /**
     * The radius (px) of a waypoint marker. Sized to be grabbable rather
     * than just visible, since it doubles as a drag handle.
     */
    radius?: number;

}

/**
 * A flowchart is a diagram of a process: nodes are the steps, and links are
 * the transitions between them. Where a
 * [networkgraph](#plotOptions.networkgraph) settles its nodes with a force
 * simulation, a flowchart lays them out top-to-bottom in layers, routes long
 * links around the nodes in between, and reverses feedback loops so they can
 * still be drawn - so the same data always produces the same diagram.
 *
 * A `flowchart` series. If the [type](#series.flowchart.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends plotOptions.networkgraph
 *
 * @extends series,plotOptions.flowchart
 *
 * @product highcharts
 *
 * @sample {highcharts} highcharts/series-flowchart/order-fulfillment/
 *         Order fulfillment flowchart
 *
 * @since next
 *
 * @excluding layoutAlgorithm, boostThreshold, animation, animationLimit,
 *            connectEnds, colorAxis, colorKey, connectNulls, cropThreshold,
 *            dragDrop, getExtremesFromAll, label, linecap, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPlacement, pointStart,
 *            softThreshold, stack, stacking, step, threshold, xAxis, yAxis,
 *            zoneAxis, dataSorting, boostBlending
 *
 * @requires modules/networkgraph
 *
 * @requires modules/flowchart
 */
export interface FlowchartSeriesOptions extends NetworkgraphSeriesOptions {

    /**
     * An array of links between the nodes. For the `flowchart` series type,
     * links can be given in the following ways:
     *
     * - An array of arrays, each `[from, to]` or `[from, to, text]`:
     *
     *  ```js
     *     data: [
     *         ['Start', 'Check inventory'],
     *         ['Check inventory', 'In stock?'],
     *         ['In stock?', 'Ship item', 'Yes'],
     *         ['In stock?', 'Backorder', 'No']
     *     ]
     *  ```
     *
     * - An array of objects with named values:
     *
     *  ```js
     *     data: [{
     *         from: 'In stock?',
     *         to: 'Ship item',
     *         text: 'Yes'
     *     }]
     *  ```
     *
     * Nodes are generated from the ids the links refer to. Give a node its
     * own shape or display name through
     * [series.flowchart.nodes](#series.flowchart.nodes).
     *
     * @extends series.networkgraph.data
     *
     * @excluding drilldown, marker, x, y, dragDrop
     *
     * @product highcharts
     */
    data?: Array<(FlowchartDataOptions|PointShortOptions)>;

    /**
     * Link style options.
     */
    link?: FlowchartLinkOptions;

    /**
     * The shape used for nodes that don't set their own through
     * [nodes.shape](#series.flowchart.nodes.shape).
     *
     * @sample {highcharts} highcharts/series-flowchart/node-shapes/
     *         Every node shape
     *
     * @type {string}
     */
    nodeShape?: FlowchartNodeShape;

    /**
     * A collection of options for the individual nodes. The nodes in a
     * flowchart are auto-generated instances of `Highcharts.Point`, but
     * options can be applied here and linked by the `id`.
     *
     * @sample {highcharts} highcharts/series-flowchart/order-fulfillment/
     *         Named and shaped nodes
     *
     * @product highcharts
     */
    nodes?: Array<FlowchartPointOptions>;

    /**
     * Options for the markers drawn where a link bends.
     */
    waypoints?: FlowchartWaypointsOptions;

}

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartSeriesOptions;
