/* *
 *
 *  Sankey diagram module
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { PlotOptionsOf } from '../../Core/Series/SeriesOptions';
import type Point from '../../Core/Series/Point';
import type { SankeyDataLabelFormatterContext } from './SankeyDataLabelOptions';
import type SankeySeries from './SankeySeries';

/* *
 *
 *  API Options
 *
 * */

/**
 * A sankey diagram is a type of flow diagram, in which the width of the
 * link between two nodes is shown proportionally to the flow quantity.
 *
 * @sample highcharts/demo/sankey-diagram/
 *         Sankey diagram
 * @sample highcharts/plotoptions/sankey-inverted/
 *         Inverted sankey diagram
 * @sample highcharts/plotoptions/sankey-outgoing
 *         Sankey diagram with outgoing links
 *
 * @extends      plotOptions.column
 * @since        6.0.0
 * @product      highcharts
 * @excluding    animationLimit, boostThreshold, borderRadius,
 *               crisp, cropThreshold, colorAxis, colorKey, depth, dragDrop,
 *               edgeColor, edgeWidth, findNearestPointBy, grouping,
 *               groupPadding, groupZPadding, maxPointWidth, negativeColor,
 *               pointInterval, pointIntervalUnit, pointPadding,
 *               pointPlacement, pointRange, pointStart, pointWidth,
 *               shadow, softThreshold, stacking, threshold, zoneAxis,
 *               zones, minPointLength, dataSorting, boostBlending
 * @requires     modules/sankey
 * @optionparent plotOptions.sankey
 *
 * @private
 */
const SankeySeriesDefaults: PlotOptionsOf<SankeySeries> = {

    borderWidth: 0,

    colorByPoint: true,

    /**
     * Higher numbers makes the links in a sankey diagram or dependency
     * wheelrender more curved. A `curveFactor` of 0 makes the lines
     * straight.
     *
     * @private
     */
    curveFactor: 0.33,

    /**
     * Options for the data labels appearing on top of the nodes and links.
     * For sankey charts, data labels are visible for the nodes by default,
     * but hidden for links. This is controlled by modifying the
     * `nodeFormat`, and the `format` that applies to links and is an empty
     * string by default.
     *
     * @declare Highcharts.SeriesSankeyDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {

        enabled: true,

        backgroundColor: 'none', // enable padding

        crop: false,

        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _nodes_ in the sankey diagram. By
         * default the `nodeFormatter` returns `{point.name}`.
         *
         * @sample highcharts/plotoptions/sankey-link-datalabels/
         *         Node and link data labels
         *
         * @type {string}
         */
        nodeFormat: void 0,

        /**
         * Callback to format data labels for _nodes_ in the sankey diagram.
         * The `nodeFormat` option takes precedence over the
         * `nodeFormatter`.
         *
         * @type  {Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction}
         * @since 6.0.2
         */
        nodeFormatter: function (
            this: (
                SankeyDataLabelFormatterContext|
                Point.PointLabelObject
            )
        ): (string|undefined) {
            return this.point.name;
        },

        format: void 0,

        /**
         * @type {Highcharts.SeriesSankeyDataLabelsFormatterCallbackFunction}
         */
        formatter: function (): undefined {
            return;
        },

        inside: true

    },

    /**
     * @default   true
     * @extends   plotOptions.series.inactiveOtherPoints
     * @private
     */
    inactiveOtherPoints: true,

    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not node and link options.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @type      {Array<*>}
     * @since     7.1.0
     * @apioption plotOptions.sankey.levels
     */

    /**
     * Can set `borderColor` on all nodes which lay on the same level.
     *
     * @type      {Highcharts.ColorString}
     * @apioption plotOptions.sankey.levels.borderColor
     */

    /**
     * Can set `borderWidth` on all nodes which lay on the same level.
     *
     * @type      {number}
     * @apioption plotOptions.sankey.levels.borderWidth
     */

    /**
     * Can set `color` on all nodes which lay on the same level.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @apioption plotOptions.sankey.levels.color
     */

    /**
     * Can set `colorByPoint` on all nodes which lay on the same level.
     *
     * @type      {boolean}
     * @default   true
     * @apioption plotOptions.sankey.levels.colorByPoint
     */

    /**
     * Can set `dataLabels` on all points which lay on the same level.
     *
     * @extends   plotOptions.sankey.dataLabels
     * @apioption plotOptions.sankey.levels.dataLabels
     */

    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     *
     * @type      {number}
     * @apioption plotOptions.sankey.levels.level
     */

    /**
     * Can set `linkOpacity` on all points which lay on the same level.
     *
     * @type      {number}
     * @default   0.5
     * @apioption plotOptions.sankey.levels.linkOpacity
     */

    /**
     * Can set `states` on all nodes and points which lay on the same level.
     *
     * @extends   plotOptions.sankey.states
     * @apioption plotOptions.sankey.levels.states
     */

    /**
     * Determines color mode for sankey links. Available options:
     *
     * - `from` color of the sankey link will be the same as the 'from node'
     *
     * - `gradient` color of the sankey link will be set to gradient between
     * colors of 'from node' and 'to node'
     *
     * - `to` color of the sankey link will be same as the 'to node'.
     *
     * @sample highcharts/demo/vertical-sankey
     *         Vertical sankey diagram with gradients
     * @sample highcharts/series-sankey/link-color-mode
     *         Sankey diagram with gradients and explanation
     *
     * @type      {('from'|'gradient'|'to')}
     * @since     @next
     */
    linkColorMode: 'from',

    /**
     * Opacity for the links between nodes in the sankey diagram.
     *
     * @private
     */
    linkOpacity: 0.5,

    /**
     * Opacity for the nodes in the sankey diagram.
     *
     * @private
     */
    opacity: 1,

    /**
     * The minimal width for a line of a sankey. By default,
     * 0 values are not shown.
     *
     * @sample highcharts/plotoptions/sankey-minlinkwidth
     *         Sankey diagram with minimal link height
     *
     * @type      {number}
     * @since     7.1.3
     * @default   0
     * @apioption plotOptions.sankey.minLinkWidth
     *
     * @private
     */
    minLinkWidth: 0,

    /**
     * Determines which side of the chart the nodes are to be aligned to. When
     * the chart is inverted, `top` aligns to the left and `bottom` to the
     * right.
     *
     * @sample highcharts/plotoptions/sankey-nodealignment
     *         Node alignment demonstrated
     *
     * @type      {'top'|'center'|'bottom'}
     * @apioption plotOptions.sankey.nodeAlignment
     */
    nodeAlignment: 'center',

    /**
     * The pixel width of each node in a sankey diagram or dependency wheel,
     * or the height in case the chart is inverted.
     *
     * @private
     */
    nodeWidth: 20,

    /**
     * The padding between nodes in a sankey diagram or dependency wheel, in
     * pixels.
     *
     * If the number of nodes is so great that it is possible to lay them
     * out within the plot area with the given `nodePadding`, they will be
     * rendered with a smaller padding as a strategy to avoid overflow.
     *
     * @private
     */
    nodePadding: 10,

    showInLegend: false,

    states: {
        hover: {
            /**
             * Opacity for the links between nodes in the sankey diagram in
             * hover mode.
             */
            linkOpacity: 1,

            /**
             * Opacity for the nodes in the sankey diagram in hover mode.
             */
            opacity: 1
        },
        /**
         * The opposite state of a hover for a single point node/link.
         *
         * @declare Highcharts.SeriesStatesInactiveOptionsObject
         */
        inactive: {
            /**
             * Opacity for the links between nodes in the sankey diagram in
             * inactive mode.
             */
            linkOpacity: 0.1,

            /**
             * Opacity of the nodes in the sankey diagram in inactive mode.
             */
            opacity: 0.1,

            /**
             * Animation when not hovering over the marker.
             *
             * @type      {boolean|Partial<Highcharts.AnimationOptionsObject>}
             * @apioption plotOptions.series.states.inactive.animation
             */
            animation: {
                /** @internal */
                duration: 50
            }
        }
    },
    tooltip: {
        /**
         * A callback for defining the format for _nodes_ in the chart's
         * tooltip, as opposed to links.
         *
         * @type      {Highcharts.FormatterCallbackFunction<Highcharts.SankeyNodeObject>}
         * @since     6.0.2
         * @apioption plotOptions.sankey.tooltip.nodeFormatter
         */

        /**
         * Whether the tooltip should follow the pointer or stay fixed on
         * the item.
         */
        followPointer: true,

        headerFormat:
        '<span style="font-size: 0.8em">{series.name}</span><br/>',
        pointFormat: '{point.fromNode.name} \u2192 {point.toNode.name}: <b>{point.weight}</b><br/>',
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _nodes_ in tooltip of a diagram
         * series, as opposed to links.
         */
        nodeFormat: '{point.name}: <b>{point.sum}</b><br/>'
    }
};

/**
 * A `sankey` series. If the [type](#series.sankey.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sankey
 * @excluding animationLimit, boostBlending, boostThreshold, borderColor,
 *            borderRadius, borderWidth, crisp, cropThreshold, dataParser,
 *            dataURL, depth, dragDrop, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, grouping, groupPadding,
 *            groupZPadding, label, maxPointWidth, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPadding, pointPlacement, pointRange,
 *            pointStart, pointWidth, shadow, softThreshold, stacking,
 *            threshold, zoneAxis, zones, dataSorting
 * @product   highcharts
 * @requires  modules/sankey
 * @apioption series.sankey
 */

/**
 * A collection of options for the individual nodes. The nodes in a sankey
 * diagram are auto-generated instances of `Highcharts.Point`, but options can
 * be applied here and linked by the `id`.
 *
 * @sample highcharts/css/sankey/
 *         Sankey diagram with node options
 *
 * @declare   Highcharts.SeriesSankeyNodesOptionsObject
 * @type      {Array<*>}
 * @product   highcharts
 * @apioption series.sankey.nodes
 */

/**
 * The id of the auto-generated node, refering to the `from` or `to` setting of
 * the link.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.nodes.id
 */

/**
 * The color of the auto generated node.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts
 * @apioption series.sankey.nodes.color
 */

/**
 * The color index of the auto generated node, especially for use in styled
 * mode.
 *
 * @type      {number}
 * @product   highcharts
 * @apioption series.sankey.nodes.colorIndex
 */

/**
 * An optional column index of where to place the node. The default behaviour is
 * to place it next to the preceding node. Note that this option name is
 * counter intuitive in inverted charts, like for example an organization chart
 * rendered top down. In this case the "columns" are horizontal.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node column
 *
 * @type      {number}
 * @since     6.0.5
 * @product   highcharts
 * @apioption series.sankey.nodes.column
 */

/**
 * Individual data label for each node. The options are the same as
 * the ones for [series.sankey.dataLabels](#series.sankey.dataLabels).
 *
 * @extends   plotOptions.sankey.dataLabels
 * @apioption series.sankey.nodes.dataLabels
 */

/**
 * An optional level index of where to place the node. The default behaviour is
 * to place it next to the preceding node. Alias of `nodes.column`, but in
 * inverted sankeys and org charts, the levels are laid out as rows.
 *
 * @type      {number}
 * @since     7.1.0
 * @product   highcharts
 * @apioption series.sankey.nodes.level
 */

/**
 * The name to display for the node in data labels and tooltips. Use this when
 * the name is different from the `id`. Where the id must be unique for each
 * node, this is not necessary for the name.
 *
 * @sample highcharts/css/sankey/
 *         Sankey diagram with node options
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.nodes.name
 */

/**
 * This option is deprecated, use
 * [offsetHorizontal](#series.sankey.nodes.offsetHorizontal) and
 * [offsetVertical](#series.sankey.nodes.offsetVertical) instead.
 *
 * In a horizontal layout, the vertical offset of a node in terms of weight.
 * Positive values shift the node downwards, negative shift it upwards. In a
 * vertical layout, like organization chart, the offset is horizontal.
 *
 * If a percantage string is given, the node is offset by the percentage of the
 * node size plus `nodePadding`.
 *
 * @deprecated
 * @type      {number|string}
 * @default   0
 * @since     6.0.5
 * @product   highcharts
 * @apioption series.sankey.nodes.offset
 */

/**
 * The horizontal offset of a node. Positive values shift the node right,
 * negative shift it left.
 *
 * If a percantage string is given, the node is offset by the percentage of the
 * node size.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node offset
 *
 * @type      {number|string}
 * @since 9.3.0
 * @product   highcharts
 * @apioption series.sankey.nodes.offsetHorizontal
 */

/**
 * The vertical offset of a node. Positive values shift the node down,
 * negative shift it up.
 *
 * If a percantage string is given, the node is offset by the percentage of the
 * node size.
 *
 * @sample highcharts/plotoptions/sankey-node-column/
 *         Specified node offset
 *
 * @type      {number|string}
 * @since 9.3.0
 * @product   highcharts
 * @apioption series.sankey.nodes.offsetVertical
 */

/**
 * An array of data points for the series. For the `sankey` series type,
 * points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a
 * few settings, see the complete options set below. If the total number of data
 * points exceeds the series' [turboThreshold](#series.area.turboThreshold),
 * this option is not available.
 *
 *  ```js
 *     data: [{
 *         from: 'Category1',
 *         to: 'Category2',
 *         weight: 2
 *     }, {
 *         from: 'Category1',
 *         to: 'Category3',
 *         weight: 5
 *     }]
 *  ```
 *
 *  When you provide the data as tuples, the keys option has to be set as well.
 *
 *  ```js
 *     keys: ['from', 'to', 'weight'],
 *     data: [
 *         ['Category1', 'Category2', 2],
 *         ['Category1', 'Category3', 5]
 *     ]
 *  ```
 *
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @declare   Highcharts.SeriesSankeyPointOptionsObject
 * @type      {Array<*>|Array<Array<(string|number)>>}
 * @extends   series.line.data
 * @excluding dragDrop, drilldown, marker, x, y
 * @product   highcharts
 * @apioption series.sankey.data
 */

/**
 * The color for the individual _link_. By default, the link color is the same
 * as the node it extends from. The `series.fillOpacity` option also applies to
 * the points, so when setting a specific link color, consider setting the
 * `fillOpacity` to 1.
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts
 * @apioption series.sankey.data.color
 */

/**
 * @type      {Highcharts.SeriesSankeyDataLabelsOptionsObject|Array<Highcharts.SeriesSankeyDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.sankey.data.dataLabels
 */

/**
 * The node that the link runs from.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.data.from
 */

/**
 * The node that the link runs to.
 *
 * @type      {string}
 * @product   highcharts
 * @apioption series.sankey.data.to
 */

/**
 * Whether the link goes out of the system.
 *
 * @sample highcharts/plotoptions/sankey-outgoing
 *         Sankey chart with outgoing links
 *
 * @type      {boolean}
 * @default   false
 * @product   highcharts
 * @apioption series.sankey.data.outgoing
 */

/**
 * The weight of the link.
 *
 * @type      {number|null}
 * @product   highcharts
 * @apioption series.sankey.data.weight
 */

''; // adds doclets above to transpiled file

/* *
 *
 *  Default Export
 *
 * */

export default SankeySeriesDefaults;
