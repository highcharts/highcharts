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
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { FlowchartDataOptions } from './FlowchartPointOptions';
import type FlowchartSeriesOptions from './FlowchartSeriesOptions';
import type Point from '../../Core/Series/Point';

/* *
 *
 *  API Options
 *
 * */

/**
 * A flowchart is a diagram of a process: nodes are the steps, and links are
 * the transitions between them. Where a networkgraph settles its nodes with a
 * force simulation, a flowchart lays them out top-to-bottom in layers, routes
 * long links around the nodes in between, and reverses feedback loops so they
 * can still be drawn - so the same data always produces the same diagram.
 *
 * @sample       {highcharts} highcharts/series-flowchart/order-fulfillment/
 *               Order fulfillment flowchart
 * @sample       {highcharts} highcharts/series-flowchart/node-shapes/
 *               Every node shape
 *
 * @extends      plotOptions.networkgraph
 * @since        next
 * @product      highcharts
 * @excluding    layoutAlgorithm, boostThreshold, animation, animationLimit,
 *               connectEnds, colorAxis, colorKey, connectNulls, cropThreshold,
 *               dragDrop, getExtremesFromAll, label, linecap, negativeColor,
 *               pointInterval, pointIntervalUnit, pointPlacement, pointStart,
 *               softThreshold, stack, stacking, step, threshold, xAxis, yAxis,
 *               zoneAxis, dataSorting, boostBlending
 * @requires     modules/networkgraph
 * @requires     modules/flowchart
 * @optionparent plotOptions.flowchart
 *
 * @private
 */
const FlowchartSeriesDefaults: FlowchartSeriesOptions = {

    /**
     * Nodes can be nudged after the layout has run. This reuses the
     * networkgraph drag plumbing, minus the force-simulation steps a
     * flowchart has none of; a dragged node stays where it was dropped, and
     * the rest of the diagram keeps the layout the solver computed.
     *
     * @private
     */
    draggable: true,

    /**
     * The shape used for nodes that don't set their own through
     * [nodes.shape](#series.flowchart.nodes.shape). One of `rectangle`,
     * `oval`, `diamond`, `parallelogram`, `hexagon`, `subroutine`,
     * `cylinder` or `document`.
     *
     * @type    {string}
     * @default rectangle
     * @private
     */
    nodeShape: 'rectangle',

    marker: {
        /**
         * A node's box is sized to its own shape and label, so this only
         * sets the reach of the hover halo.
         */
        radius: 16
    },

    /**
     * Text inside the shape is a node's whole point, so data labels are on by
     * default here rather than left for chart configs to opt into.
     *
     * @declare Highcharts.SeriesFlowchartDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {

        enabled: true,

        // eslint-disable-next-line valid-jsdoc
        /**
         * A link's label is whatever `text` came in on that link's data, for
         * example `Yes`/`No` out of a decision.
         *
         * Note that
         * [linkFormat](#plotOptions.flowchart.dataLabels.linkFormat) - even
         * as an empty string - takes precedence over this, so the link's own
         * `text`, absent from a plain `[from, to]` pair, has to be read here
         * rather than through a format string.
         */
        linkFormatter: function (this: Point): string {
            return (this.options as FlowchartDataOptions).text || '';
        },

        /**
         * The networkgraph default has this on, which draws a link's label
         * following the curve it is attached to (rotated with it) rather than
         * as plain horizontal text - and, per its own documentation, disables
         * the label's background and border while it is on. Neither suits a
         * flowchart's short branch labels.
         */
        linkTextPath: {
            enabled: false
        },

        // A node label goes dead center in its shape. The networkgraph
        // default (`verticalAlign: 'bottom'`) was tuned to roughly center a
        // label over a small circular marker, which no longer holds now that
        // node boxes are sized to the label itself and vary a lot in height
        // (a short oval vs. a tall diamond).
        align: 'center',

        verticalAlign: 'middle',

        x: 0,

        y: 0,

        /**
         * Color and outline are set explicitly, rather than left at the
         * inherited `contrast`/`{point.color}` defaults, because those
         * resolve through a CSS relative-color expression that some browsers
         * compute correctly for `getComputedStyle()` but fail to actually
         * paint with, silently leaving the label invisible.
         *
         * @type {Highcharts.CSSObject}
         */
        style: {
            /** @internal */
            color: '#FFFFFF',
            /** @internal */
            fontSize: '12px',
            /** @internal */
            fontWeight: 'bold',
            /** @internal */
            textOutline: '1.5px rgba(0, 0, 0, 0.6)',
            // The networkgraph default is 2000ms - tuned for labels gradually
            // fading in as a force simulation settles, which this series
            // never runs. Left as is, a hovered node's own opacity change
            // (`states.inactive`, 50ms) finishes 40x faster than its label's,
            // so the label visibly lags behind the shape it belongs to.
            /** @internal */
            transition: 'opacity 50ms'
        },

        // There is no simulation to wait for, so labels are drawn with the
        // rest of the series rather than deferred.
        defer: false,

        animation: {
            /** @internal */
            defer: 0
        }

    },

    /**
     * Link style options.
     *
     * @private
     */
    link: {

        /**
         * The networkgraph default (`rgba(100, 100, 100, 0.5)`) reads fine on
         * a light background and disappears into a dark one, so this follows
         * the neutral color the rest of the chart's furniture uses and stays
         * readable either way. The arrowhead follows the link's resolved
         * stroke, so it adapts along with the line.
         *
         * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         */
        color: 'var(--highcharts-neutral-color-60)',

        width: 1.5,

        /**
         * Length (px) of the arrowhead drawn where a link meets its `to`
         * node.
         */
        arrowLength: 10,

        /**
         * Width (px) of the arrowhead drawn where a link meets its `to` node.
         */
        arrowWidth: 8,

        /**
         * Data label options applied to links only, on top of the series-wide
         * [dataLabels](#plotOptions.flowchart.dataLabels).
         *
         * @extends plotOptions.flowchart.dataLabels
         */
        dataLabels: {
            /**
             * @type {Highcharts.CSSObject}
             */
            style: {
                /** @internal */
                color: 'var(--highcharts-neutral-color-100)',
                /** @internal */
                fontSize: '11px',
                /** @internal */
                fontWeight: 'normal',
                /** @internal */
                textOutline: 'none'
            }
        },

        /**
         * Style applied to a reversed link - a "back" edge that the layout
         * flipped in order to lay the graph out as a directed acyclic graph,
         * and that therefore renders against the general top-to-bottom flow.
         * Its arrowhead still points at the `to` node the data gave it.
         */
        reversed: {

            /**
             * @type {Highcharts.DashStyleValue}
             */
            dashStyle: 'Dash'

        }

    },

    /**
     * Options for the markers drawn where a link bends. A link that spans
     * more than one layer is routed through internal waypoints, which are
     * otherwise invisible since they never become series points. Enabling
     * these draws a marker at each one, which - while the series is
     * [draggable](#plotOptions.flowchart.draggable) - doubles as a handle for
     * bending the link by hand.
     *
     * @sample {highcharts} highcharts/series-flowchart/waypoints/
     *         Draggable waypoints on long links
     *
     * @private
     */
    waypoints: {

        enabled: false,

        /**
         * The radius (px) of a waypoint marker. Sized to be grabbable rather
         * than just visible, since it doubles as a drag handle.
         */
        radius: 5

    }

};

/* *
 *
 *  Default Export
 *
 * */

export default FlowchartSeriesDefaults;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `flowchart` series. If the [type](#series.flowchart.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.flowchart
 * @excluding layoutAlgorithm, boostThreshold, animation, animationLimit,
 *            connectEnds, connectNulls, cropThreshold, dragDrop,
 *            getExtremesFromAll, label, linecap, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPlacement, pointStart, softThreshold,
 *            stack, stacking, step, threshold, xAxis, yAxis, zoneAxis,
 *            dataSorting, boostBlending
 * @product   highcharts
 * @requires  modules/networkgraph
 * @requires  modules/flowchart
 * @apioption series.flowchart
 */

/**
 * An array of links between the nodes. For the `flowchart` series type, links
 * can be given in the following ways:
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
 * @basic
 * @type      {Array<Object|Array>}
 * @extends   series.networkgraph.data
 * @excluding drilldown, marker, x, y, dragDrop
 * @product   highcharts
 * @apioption series.flowchart.data
 */

/**
 * The node that the link runs from.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.flowchart.data.from
 */

/**
 * The node that the link runs to.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.flowchart.data.to
 */

/**
 * A label for the connection, shown next to the middle of the link. Use it for
 * the condition a branch out of a decision stands for, like `Yes` and `No`, or
 * for what a loop-closing edge means.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.flowchart.data.text
 */

/**
 * A collection of options for the individual nodes. The nodes in a flowchart
 * are auto-generated instances of `Highcharts.Point`, but options can be
 * applied here and linked by the `id`.
 *
 * @type      {Array<*>}
 * @extends   series.networkgraph.nodes
 * @product   highcharts
 * @apioption series.flowchart.nodes
 */

/**
 * The symbol this node is drawn with, in classic flowchart notation:
 *
 * - `rectangle`: a process step. The default.
 * - `oval`: a terminator, i.e. the start or the end of the flow.
 * - `diamond`: a decision, with one branch out per outcome.
 * - `parallelogram`: input or output.
 * - `hexagon`: preparation.
 * - `subroutine`: a predefined process, defined elsewhere.
 * - `cylinder`: a data store.
 * - `document`: generated output.
 *
 * The shape is sized to fit the node's data label, so a long name widens the
 * shape rather than overflowing it.
 *
 * @sample    {highcharts} highcharts/series-flowchart/node-shapes/
 *            Every node shape
 *
 * @type      {string}
 * @default   rectangle
 * @product   highcharts
 * @apioption series.flowchart.nodes.shape
 */

''; // Adds doclets above to transpiled file
