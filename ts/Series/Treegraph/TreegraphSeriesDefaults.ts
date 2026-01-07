/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Pawel Lysy Grzegorz Blachlinski
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type TreegraphSeriesOptions from './TreegraphSeriesOptions';

import { Palette } from '../../Core/Color/Palettes';

/* *
 *
 *  Constants
 *
 * */

/**
 * A treegraph series is a diagram, which shows a relation between ancestors
 * and descendants with a clear parent - child relation.
 * The best examples of the dataStructures, which best reflect this chart
 * are e.g. genealogy tree or directory structure.
 *
 * TODO change back the demo path
 * @sample highcharts/demo/treegraph-chart
 *         Treegraph Chart
 *
 * @extends      plotOptions.treemap
 * @excluding    layoutAlgorithm, dashStyle, linecap, lineWidth,
 *               negativeColor, threshold, zones, zoneAxis, colorAxis,
 *               colorKey, compare, dataGrouping, endAngle, gapSize, gapUnit,
 *               ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *               minSize, navigatorOptions, pointRange, allowTraversingTree,
 *               alternateStartingDirection, borderRadius, breadcrumbs,
 *               interactByLeaf, layoutStartingDirection, levelIsConstant,
 *               lineWidth, negativeColor, nodes, sortIndex, zoneAxis,
 *               zones, cluster
 *
 * @product      highcharts
 * @since 10.3.0
 * @requires     modules/treemap
 * @requires     modules/treegraph
 * @optionparent plotOptions.treegraph
 */
const TreegraphSeriesDefaults = {
    /**
     * Flips the positions of the nodes of a treegraph along the
     * horizontal axis (vertical if chart is inverted).
     *
     * @sample highcharts/series-treegraph/reversed-nodes
     *         Treegraph series with reversed nodes.
     *
     * @type    {boolean}
     * @default false
     * @product highcharts
     * @since 10.3.0
     */
    reversed: false,
    /**
     * @extends   plotOptions.series.marker
     * @excluding enabled, enabledThreshold
     */
    marker: {
        radius: 10,
        lineWidth: 0,
        symbol: 'circle',
        fillOpacity: 1,
        states: {}
    },
    link: {
        /**
         * Modifier of the shape of the curved link. Works best for
         * values between 0 and 1, where 0 is a straight line, and 1 is
         * a shape close to the default one.
         *
         * @type      {number}
         * @default   0.5
         * @product   highcharts
         * @since 10.3.0
         * @apioption plotOptions.treegraph.link.curveFactor
         */

        /**
         * For the orthogonal link type, this defines how far down the link
         * bends. A number defines the pixel offset from the start of the link,
         * and a percentage defines the relative position on the link. For
         * example, a `bendAt` of `50%` means that the link bends in the middle.
         *
         * @type      {number|string}
         * @since     next
         * @product   highcharts
         * @default   50%
         * @apioption plotOptions.treegraph.link.bendAt
         */

        /**
         * The color of the links between nodes.
         *
         * @type {Highcharts.ColorString}
         * @private
         */
        color: Palette.neutralColor60,
        /**
         * The line width of the links connecting nodes, in pixels.
         * @type {number}
         *
         * @private
         */
        lineWidth: 1,
        /**
         * Radius for the rounded corners of the links between nodes.
         * Works for the `orthogonal` link type.
         *
         * @private
         */
        radius: 10,
        cursor: 'default',
        /**
         * Type of the link shape.
         *
         * @sample   highcharts/series-treegraph/link-types
         *           Different link types
         *
         * @type {'orthogonal' | 'curved' | 'straight'}
         * @product highcharts
         *
         */
        type: 'curved'
    },
    /**
     * Can set the options of dataLabels on each point which lies on the
     * level.
     * [plotOptions.treegraph.dataLabels](#plotOptions.treegraph.dataLabels)
     * for possible values.
     *
     * @extends   plotOptions.treegraph.dataLabels
     * @product   highcharts
     * @apioption plotOptions.treegraph.levels.dataLabels
     */
    /**
     * Options applied to collapse Button. The collape button is the
     * small button which indicates, that the node is collapsable.
     */
    collapseButton: {
        /**
         * Whether the button should be visible only when the node is
         * hovered. When set to true, the button is hidden for nodes,
         * which are not collapsed, and shown for the collapsed ones.
         */
        onlyOnHover: true,
        /**
         * Whether the button should be visible.
         */
        enabled: true,
        /**
         * The line width of the button in pixels
         */
        lineWidth: 1,
        /**
         * Offset of the button in the x direction.
         */
        x: 0,
        /**
         * Offset of the button in the y direction.
         */
        y: 0,
        /**
         * Height of the button.
         */
        height: 18,
        /**
         * Width of the button.
         */
        width: 18,
        /**
         * The symbol of the collapse button.
         */
        shape: 'circle',
        /**
         * CSS styles for the collapse button.
         *
         * In styled mode, the collapse button style is given in the
         * `.highcharts-collapse-button` class.
         */
        style: {
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '1em'
        }
    },
    /**
     * Whether the treegraph series should fill the entire plot area in the X
     * axis direction, even when there are collapsed points.
     *
     * @sample  highcharts/series-treegraph/fillspace
     *          Fill space demonstrated
     *
     * @product highcharts
     */
    fillSpace: false,
    /**
     * @extends plotOptions.series.tooltip
     * @excluding clusterFormat
     */
    tooltip: {
        /**
         * The HTML of the point's line in the tooltip. Variables are enclosed
         * by curly brackets. Available variables are `point.id`,
         * `point.fromNode.id`, `point.toNode.id`, `series.name`, `series.color`
         * and other properties on the same form. Furthermore, This can also be
         * overridden for each series, which makes it a good hook for displaying
         * units. In styled mode, the dot is colored by a class name rather than
         * the point color.
         *
         * @type {string}
         * @since 10.3.0
         * @product highcharts
         */
        linkFormat: '{point.fromNode.id} \u2192 {point.toNode.id}',
        pointFormat: '{point.id}'
        /**
         * A callback function for formatting the HTML output for a
         * single link in the tooltip. Like the `linkFormat` string,
         * but with more flexibility.
         *
         * @type {Highcharts.FormatterCallbackFunction.<Highcharts.Point>}
         * @apioption series.treegraph.tooltip.linkFormatter
         *
         */
    },
    /**
     * Options for the data labels appearing on top of the nodes and
     * links. For treegraph charts, data labels are visible for the
     * nodes by default, but hidden for links. This is controlled by
     * modifying the `nodeFormat`, and the `format` that applies to
     * links and is an empty string by default.
     *
     * @declare Highcharts.SeriesTreegraphDataLabelsOptionsObject
     */
    dataLabels: {
        defer: true,
        /**
         * Options for a _link_ label text which should follow link
         * connection. Border and background are disabled for a label
         * that follows a path.
         *
         * **Note:** Only SVG-based renderer supports this option.
         * Setting `useHTML` to true will disable this option.
         *
         * @sample highcharts/series-treegraph/link-text-path
         *         Treegraph series with link text path dataLabels.
         *
         * @extends plotOptions.treegraph.dataLabels.textPath
         * @since 10.3.0
         */
        linkTextPath: {
            attributes: {
                startOffset: '50%'
            }
        },
        enabled: true,
        linkFormatter: (): string => '',
        /**
         * The
         * [format string](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting)
         * specifying what to show for _nodes_ in the treegraph. Overrides
         * `format`. Use `pointFormat` and `linkFormat` to differentiate between
         * node and link data labels.
         *
         * @type {string}
         */
        pointFormat: void 0,
        padding: 5,
        style: {
            textOverflow: 'none'
        }
        /**
         * Callback function to format data labels for _nodes_ in the
         * treegraph, when `pointFormat` is not sufficient.
         *
         * @type {function}
         * @apioption series.treegraph.dataLabels.pointFormatter
         */

    },
    /**
     * The distance between nodes in a tree graph in the longitudinal direction.
     * The longitudinal direction means the direction that the chart flows - in
     * a horizontal chart the distance is horizontal, in an inverted chart
     * (vertical), the distance is vertical.
     *
     * If a number is given, it denotes pixels. If a percentage string is given,
     * the distance is a percentage of the rendered node width. A `nodeDistance`
     * of `100%` will render equal widths for the nodes and the gaps between
     * them.
     *
     * This option applies only when the `nodeWidth` option is `auto`, making
     * the node width respond to the number of columns.
     *
     * @since 11.4.0
     * @sample highcharts/series-treegraph/node-distance
     *         Node distance of 100% means equal to node width
     * @type   {number|string}
     */
    nodeDistance: 30,

    /**
     * The pixel width of each node in a, or the height in case the chart is
     * inverted. For tree graphs, the node width is only applied if the marker
     * symbol is `rect`, otherwise the `marker` sizing options apply.
     *
     * Can be a number or a percentage string, or `auto`. If `auto`, the nodes
     * are sized to fill up the plot area in the longitudinal direction,
     * regardless of the number of levels.
     *
     * @since 11.4.0
     * @see    [treegraph.nodeDistance](#nodeDistance)
     * @sample highcharts/series-treegraph/node-distance
     *         Node width is auto and combined with node distance
     *
     * @type {number|string}
     */
    nodeWidth: void 0
} as TreegraphSeriesOptions;

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphSeriesDefaults;
