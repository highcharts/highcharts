/* *
 *
 *  Sankey diagram module
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

import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type ColumnSeriesOptions from '../Column/ColumnSeriesOptions';
import type NodesComposition from '../NodesComposition';
import type { PointShortOptions } from '../../Core/Series/PointOptions';
import type SankeyDataLabelOptions from './SankeyDataLabelOptions';
import type SankeyPoint from './SankeyPoint';
import type SankeyPointOptions from './SankeyPointOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type Templating from '../../Core/Templating';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * @optionparent series.sankey.level
 */
export interface SankeySeriesLevelOptions {

    /**
     * Can set `borderColor` on all nodes which lay on the same level.
     */
    borderColor?: ColorString;

    /**
     * Can set `borderWidth` on all nodes which lay on the same level.
     */
    borderWidth?: number;

    /**
     * Can set `color` on all nodes which lay on the same level.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @apioption plotOptions.sankey.levels.color
     */
    color?: ColorType;

    /**
     * Can set `colorByPoint` on all nodes which lay on the same level.
     *
     * @default true
     */
    colorByPoint?: boolean;

    /**
     * Can set `dataLabels` on all points which lay on the same level.
     */
    dataLabels?: SankeyDataLabelOptions;

    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     */
    level?: number;

    /**
     * Can set `linkOpacity` on all points which lay on the same level.
     *
     * @default 0.5
     */
    linkOpacity?: number;

    /**
     * Can set `states` on all nodes and points which lay on the same level.
     *
     * @extends plotOptions.sankey.states
     *
     * @apioption plotOptions.sankey.levels.states
     */
    states?: SeriesStatesOptions<SankeySeriesOptions>;

}

export interface SankeySeriesNodeOptions {

    /**
     * The color of the auto generated node.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts
     */
    color?: ColorType;

    /**
     * The color index of the auto generated node, especially for use in styled
     * mode.
     *
     * @type {number}
     *
     * @product highcharts
     *
     * @apioption series.sankey.nodes.colorIndex
     */
    colorIndex?: number;

    /**
     * An optional column index of where to place the node. The default
     * behaviour is to place it next to the preceding node. Note that this
     * option name is counter intuitive in inverted charts, like for example an
     * organization chart rendered top down. In this case the "columns" are
     * horizontal.
     *
     * @sample highcharts/plotoptions/sankey-node-column/
     *         Specified node column
     *
     * @since 6.0.5
     *
     * @product highcharts
     */
    column?: number;

    /**
     * Individual data label for each node. The options are the same as
     * the ones for [series.sankey.dataLabels](#series.sankey.dataLabels).
     */
    dataLabels?: SankeyDataLabelOptions;

    /**
     * The height of the node.
     *
     * @sample highcharts/series-sankey/height/
     *         Sankey diagram with height options
     *
     * @since 11.3.0
     */
    height?: number;

    /**
     * The id of the auto-generated node, referring to the `from` or `to` setting of
     * the link.
     *
     * @product highcharts
     */
    id?: string;

    /**
     * An optional level index of where to place the node. The default behaviour
     * is to place it next to the preceding node. Alias of `nodes.column`, but
     * in inverted sankeys and org charts, the levels are laid out as rows.
     *
     * @since 7.1.0
     *
     * @product highcharts
     */
    level?: number;

    /**
     * The name to display for the node in data labels and tooltips. Use this
     * when the name is different from the `id`. Where the id must be unique for
     * each node, this is not necessary for the name.
     *
     * @sample highcharts/css/sankey/
     *         Sankey diagram with node options
     *
     * @product highcharts
     */
    name?: string;

    /**
     * This option is deprecated, use
     * [offsetHorizontal](#series.sankey.nodes.offsetHorizontal) and
     * [offsetVertical](#series.sankey.nodes.offsetVertical) instead.
     *
     * In a horizontal layout, the vertical offset of a node in terms of weight.
     * Positive values shift the node downwards, negative shift it upwards. In a
     * vertical layout, like organization chart, the offset is horizontal.
     *
     * If a percentage string is given, the node is offset by the percentage of
     * the node size plus `nodePadding`.
     *
     * @deprecated
     *
     * @default 0
     *
     * @since 6.0.5
     *
     * @product highcharts
     */
    offset?: (number|string);

    /**
     * The horizontal offset of a node. Positive values shift the node right,
     * negative shift it left.
     *
     * If a percentage string is given, the node is offset by the percentage of
     * the node size.
     *
     * @sample highcharts/plotoptions/sankey-node-column/
     *         Specified node offset
     *
     * @since 9.3.0
     *
     * @product highcharts
     */
    offsetHorizontal?: (number|string);

    /**
     * The vertical offset of a node. Positive values shift the node down,
     * negative shift it up.
     *
     * If a percentage string is given, the node is offset by the percentage of
     * the node size.
     *
     * @sample highcharts/plotoptions/sankey-node-column/
     *         Specified node offset
     *
     * @since 9.3.0
     *
     * @product highcharts
     */
    offsetVertical?: (number|string);

}


/**
 * A sankey diagram is a type of flow diagram, in which the width of the
 * link between two nodes is shown proportionally to the flow quantity.
 *
 * A `sankey` series. If the [type](#series.sankey.type) option is not
 * specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/sankey-diagram/
 *         Sankey diagram
 *
 * @sample highcharts/plotoptions/sankey-inverted/
 *         Inverted sankey diagram
 *
 * @sample highcharts/plotoptions/sankey-outgoing
 *         Sankey diagram with outgoing links
 *
 * @extends plotOptions.column
 *
 * @extends series,plotOptions.sankey
 *
 * @since 6.0.0
 *
 * @product highcharts
 *
 * @excluding animationLimit, boostThreshold, borderRadius,
 *            crisp, cropThreshold, colorAxis, colorKey, depth, dragDrop,
 *            edgeColor, edgeWidth, findNearestPointBy, grouping,
 *            groupPadding, groupZPadding, maxPointWidth, negativeColor,
 *            pointInterval, pointIntervalUnit, pointPadding,
 *            pointPlacement, pointRange, pointStart, pointWidth,
 *            shadow, softThreshold, stacking, threshold, zoneAxis,
 *            zones, minPointLength, dataSorting, boostBlending
 *
 * @excluding animationLimit, boostBlending, boostThreshold, borderColor,
 *            borderRadius, borderWidth, crisp, cropThreshold, dataParser,
 *            dataURL, depth, dragDrop, edgeColor, edgeWidth,
 *            findNearestPointBy, getExtremesFromAll, grouping, groupPadding,
 *            groupZPadding, label, maxPointWidth, negativeColor, pointInterval,
 *            pointIntervalUnit, pointPadding, pointPlacement, pointRange,
 *            pointStart, pointWidth, shadow, softThreshold, stacking,
 *            threshold, zoneAxis, zones, dataSorting
 *
 * @requires modules/sankey
 */
export interface SankeySeriesOptions extends ColumnSeriesOptions, NodesComposition.SeriesCompositionOptions {

    borderWidth?: number;

    colorByPoint?: boolean;

    /**
     * Higher numbers makes the links in a sankey diagram or dependency
     * wheelrender more curved. A `curveFactor` of 0 makes the lines
     * straight.
     */
    curveFactor?: number;

    /**
     * An array of data points for the series. For the `sankey` series type,
     * points can be given in the following way:
     *
     * An array of objects with named values. The following snippet shows only a
     * few settings, see the complete options set below. If the total number of
     *  data
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
     *  When you provide the data as tuples, the keys option has to be set as
     *  well.
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
     * @declare Highcharts.SeriesSankeyPointOptionsObject
     *
     * @extends series.line.data
     *
     * @excluding dragDrop, drilldown, marker, x, y
     *
     * @product highcharts
     */
    data?: Array<(SankeyPointOptions|PointShortOptions)>

    /**
     * Options for the data labels appearing on top of the nodes and links.
     * For sankey charts, data labels are visible for the nodes by default,
     * but hidden for links. This is controlled by modifying the
     * `nodeFormat`, and the `format` that applies to links and is an empty
     * string by default.
     */
    dataLabels?: SankeyDataLabelOptions;

    height?: number;

    /**
     * @default true
     *
     * @extends plotOptions.series.inactiveOtherPoints
     */
    inactiveOtherPoints?: boolean;

    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not node and link options.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @since 7.1.0
     */
    levels?: Array<SankeySeriesLevelOptions>;

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
     *
     * @sample highcharts/series-sankey/link-color-mode
     *         Sankey diagram with gradients and explanation
     *
     * @type {('from'|'gradient'|'to')}
     */
    linkColorMode?: ('from'|'gradient'|'to');

    /**
     * Opacity for the links between nodes in the sankey diagram.
     */
    linkOpacity?: number;

    mass?: undefined;

    /**
     * The minimal width for a line of a sankey. By default,
     * 0 values are not shown.
     *
     * @sample highcharts/plotoptions/sankey-minlinkwidth
     *         Sankey diagram with minimal link height
     *
     * @type {number}
     *
     * @since 7.1.3
     *
     * @default 0
     */
    minLinkWidth?: number;

    /**
     * Determines which side of the chart the nodes are to be aligned to. When
     * the chart is inverted, `top` aligns to the left and `bottom` to the
     * right.
     *
     * @sample highcharts/plotoptions/sankey-nodealignment
     *         Node alignment demonstrated
     *
     * @type {'top'|'center'|'bottom'}
     */
    nodeAlignment?: ('top'|'center'|'bottom');

    /**
     * The distance between nodes in a sankey diagram in the longitudinal
     * direction. The longitudinal direction means the direction that the chart
     * flows - in a horizontal chart the distance is horizontal, in an inverted
     * chart (vertical), the distance is vertical.
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
     *
     * @sample highcharts/series-sankey/node-distance
     *         Sankey with dnode distance of 100% means equal to node width
     *
     * @sample highcharts/series-organization/node-distance
     *         Organization chart with node distance of 50%
     */
    nodeDistance?: (number|string);

    /**
     * The padding between nodes in a sankey diagram or dependency wheel, in
     * pixels. For sankey charts, this applies to the nodes of the same column,
     * so vertical distance by default, or horizontal distance in an inverted
     * (vertical) sankey.
     *
     * If the number of nodes is so great that it is impossible to lay them out
     * within the plot area with the given `nodePadding`, they will be rendered
     * with a smaller padding as a strategy to avoid overflow.
     */
    nodePadding?: number;

    /**
     * A collection of options for the individual nodes. The nodes in a sankey
     * diagram are auto-generated instances of `Highcharts.Point`, but options
     *  can
     * be applied here and linked by the `id`.
     *
     * @sample highcharts/css/sankey/
     *         Sankey diagram with node options
     *
     * @declare Highcharts.SeriesSankeyNodesOptionsObject
     *
     * @product highcharts
     */
    nodes?: Array<SankeySeriesNodeOptions>;

    /**
     * The pixel width of each node in a sankey diagram or dependency wheel, or
     * the height in case the chart is inverted.
     *
     * Can be a number or a percentage string.
     *
     * Sankey series also support setting it to `auto`. With this setting, the
     * nodes are sized to fill up the plot area in the longitudinal direction,
     * regardless of the number of levels.
     *
     * @see [sankey.nodeDistance](#nodeDistance)
     *
     * @sample highcharts/series-sankey/node-distance
     *         Sankey with auto node width combined with node distance
     *
     * @sample highcharts/series-organization/node-distance
     *         Organization chart with node distance of 50%
     */
    nodeWidth?: number|string;

    /**
     * Opacity for the nodes in the sankey diagram.
     */
    opacity?: number;

    showInLegend?: boolean;

    states?: SeriesStatesOptions<SankeySeriesOptions>;

    /**
     * The opposite state of a hover for a single point node/link.
     *
     * @declare Highcharts.SeriesStatesInactiveOptionsObject
     *
     * @apioption series.sankey.states.inactive
     */

    tooltip?: SankeySeriesTooltipOptions;

    width?: number;

}

export interface SankeySeriesTooltipOptions extends Partial<TooltipOptions> {
    nodeFormat?: string;
    nodeFormatter?: Templating.FormatterCallback<SankeyPoint>;
}

/* *
 *
 *  Default Export
 *
 * */

export default SankeySeriesOptions;
