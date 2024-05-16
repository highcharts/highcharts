/* *
 *
 *  Arc diagram module
 *
 *  (c) 2021 Piotr Madej, Grzegorz Blachliński
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ArcDiagramPointOptions from './ArcDiagramPointOptions';
import type ArcDiagramSeries from './ArcDiagramSeries';
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
 * @exclude curveFactor, connectEnds, connectNulls, colorAxis, colorKey,
 *          dataSorting, dragDrop, getExtremesFromAll, nodeAlignment,
 *          nodePadding, centerInCategory, pointInterval,
 *          pointIntervalUnit, pointPlacement, pointStart,
 *          relativeXValue, softThreshold, stack, stacking, step,
 *          xAxis, yAxis
 *
 * @exclude dataSorting, boostThreshold, boostBlending, curveFactor,
 *          connectEnds, connectNulls, colorAxis, colorKey, dataSorting,
 *          dragDrop, getExtremesFromAll, nodePadding, centerInCategory,
 *          pointInterval, pointIntervalUnit, pointPlacement,
 *          pointStart, relativeXValue, softThreshold, stack,
 *          stacking, step, xAxis, yAxis
 */
export interface ArcDiagramSeriesOptions extends SankeySeriesOptions {

    /**
     * The option to center links rather than position them one after
     * another
     *
     * @type {boolean}
     *
     * @since 10.0.0
     *
     * @default false
     *
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
     * @type {Array<*>}
     *
     * @extends series.sankey.data
     *
     * @product highcharts
     *
     * @excluding outgoing, dataLabels
     *
     * @apioption series.arcdiagram.data
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
     * @type {boolean}
     *
     * @since 10.0.0
     *
     * @default false
     *
     * @product highcharts
     */
    equalNodes?: boolean;

    /**
     * The radius of the link arc. If not set, series renders a semi-circle
     * between the nodes, except when overflowing the edge of the plot area,
     * in which case an arc touching the edge is rendered. If `linkRadius`
     * is set, an arc extending to the given value is rendered.
     *
     * @type {number}
     *
     * @since 10.0.0
     *
     * @default undefined
     *
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
     * @type {number}
     *
     * @since 10.0.0
     *
     * @default undefined
     *
     * @product highcharts
     */
    linkWeight?: number;

    /**
     *
     * @extends plotOptions.series.marker
     *
     * @excluding enabled, enabledThreshold, height, width
     *
     * @excluding enabled, enabledThreshold, height, radius, width
     *
     * @apioption series.arcdiagram.marker
     */
    marker?: PointMarkerOptions;

    /**
     * A collection of options for the individual nodes. The nodes in an arc
     *  diagram
     * are auto-generated instances of `Highcharts.Point`, but options can be
     * applied here and linked by the `id`.
     *
     * @extends series.sankey.nodes
     *
     * @type {Array<*>}
     *
     * @product highcharts
     *
     * @excluding column, level
     */
    nodes?: Array<ArcDiagramSeriesNodeOptions>;

    /**
     * The offset of an arc diagram nodes column in relation to the
     * `plotArea`. The offset equal to 50% places nodes in the center of a
     * chart. By default the series is placed so that the biggest node is
     * touching the bottom border of the `plotArea`.
     *
     * @type {string}
     *
     * @since 10.0.0
     *
     * @default '100%'
     *
     * @product highcharts
     */
    offset: string;

    /**
     * Whether the series should be placed on the other side of the
     * `plotArea`.
     *
     * @type {boolean}
     *
     * @since 10.0.0
     *
     * @default false
     *
     * @product highcharts
     */
    reversed: boolean;

    scale?: number;

    states?: SeriesStatesOptions<ArcDiagramSeries>;

}

/* *
 *
 *  Default Export
 *
 * */

export default ArcDiagramSeriesOptions;
