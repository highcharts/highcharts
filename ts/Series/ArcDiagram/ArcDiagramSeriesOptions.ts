/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021-2026 Highsoft AS
 *  Author: Piotr Madej, Grzegorz Blachliński
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

import type ArcDiagramPointOptions from './ArcDiagramPointOptions';
import type { NetworkgraphDataLabelsOptions } from '../Networkgraph/NetworkgraphSeriesOptions';
import type {
    SankeySeriesNodeOptions,
    SankeySeriesOptions
} from '../Sankey/SankeySeriesOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type { PointMarkerOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ArcDiagramSeriesNodeOptions extends SankeySeriesNodeOptions {
    // Nothing to add

    /* *
     *
     *  Excluded
     *
     * */

    column?: undefined;
    level?: undefined;
}

export interface ArcDiagramSeriesMarkerOptions extends PointMarkerOptions {
    // Nothing to add

    /* *
     *
     *  Excluded
     *
     * */

    enabled?: undefined;
    enabledThreshold?: undefined;
    height?: undefined;
    radius?: undefined;
    width?: undefined;
}

/**
 * Arc diagram series is a chart drawing style in which
 * the vertices of the chart are positioned along a line
 * on the Euclidean plane and the edges are drawn as a semicircle
 * in one of the two half-planes delimited by the line,
 * or as smooth curves formed by sequences of semicircles.
 *
 * An `arcdiagram` series. If the [type](#series.arcdiagram.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/arc-diagram/
 *         Arc Diagram
 *
 * @extends plotOptions.sankey
 *
 * @extends series,plotOptions.arcdiagram
 *
 * @since 10.0.0
 *
 * @product highcharts
 *
 * @requires modules/arc-diagram
 *
 * @requires modules/sankey
 *
 * @exclude boostBlending, boostThreshold, centerInCategory, colorAxis,
 * colorKey, connectEnds, connectNulls, curveFactor, dataSorting, dragDrop,
 * getExtremesFromAll, nodeAlignment, nodePadding, pointInterval,
 * pointIntervalUnit, pointPlacement, pointStart, relativeXValue, scale,
 * softThreshold, stack, stacking, step, xAxis, yAxis
 */
export interface ArcDiagramSeriesOptions extends SankeySeriesOptions {
    /**
     * The option to center links rather than position them one after another.
     *
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    centeredLinks?: boolean;

    /**
     * An array of data points for the series. For the `arcdiagram` series type,
     * points can be given in the following way:
     *
     * An array of objects with named values. The following snippet shows only
     *  a few
     * settings, see the complete options set below. If the total number of data
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
     * @product highcharts
     */
    data?: Array<ArcDiagramPointOptions>;

    /**
     * Options for the data labels appearing on top of the nodes and links.
     * For arc diagram charts, data labels are visible for the nodes by
     * default, but hidden for links. This is controlled by modifying the
     * `nodeFormat`, and the `format` that applies to links and is an empty
     * string by default.
     *
     * @declare Highcharts.SeriesArcDiagramDataLabelsOptionsObject
     */
    dataLabels?: Partial<NetworkgraphDataLabelsOptions>;

    /**
     * Whether nodes with different values should have the same size. If set
     * to true, all nodes are calculated based on the `nodePadding` and
     * current `plotArea`. It is possible to override it using the
     * `marker.radius` option.
     *
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    equalNodes?: boolean;

    /**
     * The radius of the link arc. If not set, series renders a semi-circle
     * between the nodes, except when overflowing the edge of the plot area,
     * in which case an arc touching the edge is rendered. If `linkRadius`
     * is set, an arc extending to the given value is rendered.
     *
     * @since 10.0.0
     * @product highcharts
     */
    linkRadius?: number;

    /**
     * The global link weight, in pixels. If not set, width is calculated
     * per link, depending on the weight value.
     *
     * @sample highcharts/series-arcdiagram/link-weight
     *         Link weight
     *
     * @since 10.0.0
     * @product highcharts
     */
    linkWeight?: number;

    /**
     * Options for the point markers of arc diagram series. Properties like
     * `fillColor`, `lineColor` and `lineWidth` define the visual appearance of
     * the markers, while the `symbol` option defines their shape.
     *
     * In styled mode, the markers can be styled with the `.highcharts-point`,
     * `.highcharts-point-hover` and `.highcharts-point-select` class names.
     */
    marker?: ArcDiagramSeriesMarkerOptions;

    /**
     * A collection of options for the individual nodes. The nodes in an arc
     *  diagram
     * are auto-generated instances of `Highcharts.Point`, but options can be
     * applied here and linked by the `id`.
     *
     * @product highcharts
     */
    nodes?: Array<ArcDiagramSeriesNodeOptions>;

    /**
     * The offset of an arc diagram nodes column in relation to the
     * `plotArea`. The offset equal to 50% places nodes in the center of a
     * chart. By default the series is placed so that the biggest node is
     * touching the bottom border of the `plotArea`.
     *
     * @since 10.0.0
     * @default '100%'
     * @product highcharts
     */
    offset?: string;

    /**
     * Whether the series should be placed on the other side of the
     * `plotArea`.
     *
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    reversed?: boolean;

    /** @internal */
    scale?: number;

    states?: SeriesStatesOptions<ArcDiagramSeriesOptions>;
}

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramSeriesOptions;
