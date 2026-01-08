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

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    DataLabelOptions,
    DataLabelTextPathOptions
} from '../../Core/Series/DataLabelOptions';
import type Point from '../../Core/Series/Point';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';
import type TooltipOptions from '../../Core/TooltipOptions';
import type { TreegraphLinkOptions } from './TreegraphLink';
import type TreegraphPoint from './TreegraphPoint';
import type {
    TreemapSeriesLevelOptions,
    TreemapSeriesOptions
} from '../Treemap/TreemapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export type TreegraphLayoutTypes = 'Walker';

export interface CollapseButtonOptions {

    lineColor?: ColorType;

    /**
     * The line width of the button in pixels
     */
    lineWidth?: number;

    /**
     * Whether the button should be visible.
     */
    enabled?: boolean;

    fillColor?: ColorType;

    /**
     * Height of the button.
     */
    height: number;

    /**
     * Whether the button should be visible only when the node is hovered. When
     * set to true, the button is hidden for nodes, which are not collapsed, and
     * shown for the collapsed ones.
     */
    onlyOnHover?: boolean;

    /**
     * The symbol of the collapse button.
     */
    shape?: SymbolKey;

    /**
     * CSS styles for the collapse button.
     *
     * In styled mode, the collapse button style is given in the
     * `.highcharts-collapse-button` class.
     */
    style?: CSSObject;

    /**
     * Width of the button.
     */
    width: number;

    /**
     * Offset of the button in the x direction.
     */
    x: number;

    /**
     * Offset of the button in the y direction.
     */
    y: number;

}

export interface TreegraphDataLabelsFormatterCallbackFunction {
    (
        this: (TreegraphPoint|Point)
    ): (string|undefined);
}

export interface TreegraphDataLabelFormatterContext {
    point: TreegraphPoint
}

export interface TreegraphDataLabelOptions extends DataLabelOptions {
    linkFormat?: string;
    linkFormatter: TreegraphDataLabelsFormatterCallbackFunction;
    linkTextPath?: DataLabelTextPathOptions;
}

export interface TreegraphSeriesLevelOptions extends TreemapSeriesLevelOptions {
    collapseButton?: CollapseButtonOptions;
    collapsed?: boolean;
}


/**
 * A treegraph series is a diagram, which shows a relation between ancestors
 * and descendants with a clear parent - child relation.
 * The best examples of the dataStructures, which best reflect this chart
 * are e.g. genealogy tree or directory structure.
 *
 * TODO change back the demo path
 *
 * @sample highcharts/demo/treegraph-chart
 *         Treegraph Chart
 *
 * @extends plotOptions.treemap
 *
 * @excluding layoutAlgorithm, dashStyle, linecap, lineWidth,
 *            negativeColor, threshold, zones, zoneAxis, colorAxis,
 *            colorKey, compare, dataGrouping, endAngle, gapSize, gapUnit,
 *            ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *            minSize, navigatorOptions, pointRange, allowTraversingTree,
 *            alternateStartingDirection, borderRadius, breadcrumbs,
 *            interactByLeaf, layoutStartingDirection, levelIsConstant,
 *            lineWidth, negativeColor, nodes, sortIndex, zoneAxis,
 *            zones
 *
 * @product highcharts
 *
 * @since 10.3.0
 *
 * @requires modules/treemap
 *
 * @requires modules/treegraph
 */
export interface TreegraphSeriesOptions extends TreemapSeriesOptions {

    /**
     * Options applied to collapse Button. The collape button is the
     * small button which indicates, that the node is collapsable.
     */
    collapseButton?: CollapseButtonOptions;

    /**
     * Options for the data labels appearing on top of the nodes and
     * links. For treegraph charts, data labels are visible for the
     * nodes by default, but hidden for links. This is controlled by
     * modifying the `nodeFormat`, and the `format` that applies to
     * links and is an empty string by default.
     */
    dataLabels?: (TreegraphDataLabelOptions|Array<TreegraphDataLabelOptions>);

    /**
     * Whether the treegraph series should fill the entire plot area in the X
     * axis direction, even when there are collapsed points.
     *
     * @sample highcharts/series-treegraph/fillspace
     *         Fill space demonstrated
     *
     * @product highcharts
     */
    fillSpace?: boolean;

    link?: TreegraphLinkOptions;

    marker: PointMarkerOptions;

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
     *
     * @sample highcharts/series-treegraph/node-distance
     *         Node distance of 100% means equal to node width
     */
    nodeDistance?: (number|string);

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
     *
     * @see [treegraph.nodeDistance](#nodeDistance)
     *
     * @sample highcharts/series-treegraph/node-distance
     *         Node width is auto and combined with node distance
     */
    nodeWidth?: number|string;

    /**
     * Flips the positions of the nodes of a treegraph along the
     * horizontal axis (vertical if chart is inverted).
     *
     * @sample highcharts/series-treegraph/reversed-nodes
     *         Treegraph series with reversed nodes.
     *
     * @default false
     *
     * @product highcharts
     *
     * @since 10.3.0
     */
    reversed?: boolean;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphSeriesOptions;
