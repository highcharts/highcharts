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


'use strict';


/* *
 *
 *  Imports
 *
 * */


import type ArcDiagramSeriesOptions from './ArcDiagramSeriesOptions';


/* *
 *
 *  API Options
 *
 * */


/**
 *  Arc diagram series is a chart drawing style in which
 *  the vertices of the chart are positioned along a line
 *  on the Euclidean plane and the edges are drawn as a semicircle
 *  in one of the two half-planes delimited by the line,
 *  or as smooth curves formed by sequences of semicircles.
 *
 * @sample highcharts/demo/arc-diagram/
 *         Arc Diagram
 *
 * @extends      plotOptions.sankey
 * @since 10.0.0
 * @product      highcharts
 * @requires     modules/arc-diagram
 * @exclude      curveFactor, connectEnds, connectNulls, colorAxis, colorKey,
 *               dataSorting, dragDrop, getExtremesFromAll, legendSymbolColor,
 *               nodeAlignment, nodePadding, centerInCategory, pointInterval,
 *               pointIntervalUnit, pointPlacement, pointStart, relativeXValue,
 *               softThreshold, stack, stacking, step, xAxis, yAxis
 * @optionparent plotOptions.arcdiagram
 */
const ArcDiagramSeriesDefaults: ArcDiagramSeriesOptions = {

    /**
     * The option to center links rather than position them one after
     * another
     *
     * @type    {boolean}
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    centeredLinks: false,

    /**
     * Whether nodes with different values should have the same size. If set
     * to true, all nodes are calculated based on the `nodePadding` and
     * current `plotArea`. It is possible to override it using the
     * `marker.radius` option.
     *
     * @type    {boolean}
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    equalNodes: false,

    /**
     * Options for the data labels appearing on top of the nodes and links.
     * For arc diagram charts, data labels are visible for the nodes by
     * default, but hidden for links. This is controlled by modifying the
     * `nodeFormat`, and the `format` that applies to links and is an empty
     * string by default.
     *
     * @declare Highcharts.SeriesArcDiagramDataLabelsOptionsObject
     */
    dataLabels: {

        /**
         * Options for a _link_ label text which should follow link
         * connection. Border and background are disabled for a label that
         * follows a path.
         *
         * **Note:** Only SVG-based renderer supports this option. Setting
         * `useHTML` to true will disable this option.
         *
         * @extends plotOptions.networkgraph.dataLabels.linkTextPath
         * @since 10.0.0
         */
        linkTextPath: {

            /**
             * @type    {Highcharts.SVGAttributes}
             * @default {"startOffset":"25%"}
             */
            attributes: {

                /**
                 * @ignore-option
                 */
                startOffset: '25%'

            }

        }

    },

    /**
     * The radius of the link arc. If not set, series renders a semi-circle
     * between the nodes, except when overflowing the edge of the plot area,
     * in which case an arc touching the edge is rendered. If `linkRadius`
     * is set, an arc extending to the given value is rendered.
     *
     * @type    {number}
     * @since 10.0.0
     * @default undefined
     * @product highcharts
     * @apioption series.arcdiagram.linkRadius
     */

    /**
     * The global link weight, in pixels. If not set, width is calculated
     * per link, depending on the weight value.
     *
     * @sample highcharts/series-arcdiagram/link-weight
     *         Link weight
     *
     * @type    {number}
     * @since 10.0.0
     * @default undefined
     * @product highcharts
     * @apioption series.arcdiagram.linkWeight
     */

    /**
     * Options for the point markers of arc diagram series. Properties like
     * `fillColor`, `lineColor` and `lineWidth` define the visual appearance of
     * the markers, while the `symbol` option defines their shape.
     *
     * In styled mode, the markers can be styled with the `.highcharts-point`,
     * `.highcharts-point-hover` and `.highcharts-point-select` class names.
     *
     * @extends   plotOptions.series.marker
     * @excluding enabled, enabledThreshold, height, width
     */
    marker: {

        fillOpacity: 1,

        lineWidth: 0,

        states: {},

        symbol: 'circle'

    },

    /**
     * The offset of an arc diagram nodes column in relation to the
     * `plotArea`. The offset equal to 50% places nodes in the center of a
     * chart. By default the series is placed so that the biggest node is
     * touching the bottom border of the `plotArea`.
     *
     * @type    {string}
     * @since 10.0.0
     * @default '100%'
     * @product highcharts
     * @apioption series.arcdiagram.offset
     */
    offset: '100%',

    /**
     * Whether the series should be placed on the other side of the
     * `plotArea`.
     *
     * @type    {boolean}
     * @since 10.0.0
     * @default false
     * @product highcharts
     */
    reversed: false

};


/**
 * An `arcdiagram` series. If the [type](#series.arcdiagram.type)
 * option is not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.arcdiagram
 * @exclude   dataSorting, boostThreshold, boostBlending, curveFactor,
 *            connectEnds, connectNulls, colorAxis, colorKey, dataSorting,
 *            dragDrop, getExtremesFromAll, nodePadding, centerInCategory,
 *            pointInterval, pointIntervalUnit, pointPlacement,
 *            pointStart, relativeXValue, softThreshold, stack,
 *            stacking, step, xAxis, yAxis
 * @product   highcharts
 * @requires  modules/sankey
 * @requires  modules/arc-diagram
 * @apioption series.arcdiagram
 */

/**
 * @extends   plotOptions.series.marker
 * @excluding enabled, enabledThreshold, height, radius, width
 * @apioption series.arcdiagram.marker
 */

/**
 * A collection of options for the individual nodes. The nodes in an arc diagram
 * are auto-generated instances of `Highcharts.Point`, but options can be
 * applied here and linked by the `id`.
 *
 * @extends   series.sankey.nodes
 * @type      {Array<*>}
 * @product   highcharts
 * @excluding column, level
 * @apioption series.arcdiagram.nodes
 */

/**
 * Individual data label for each node. The options are the same as the ones for
 * [series.arcdiagram.dataLabels](#series.arcdiagram.dataLabels).
 *
 * @type
 * {Highcharts.SeriesArcDiagramDataLabelsOptionsObject|Array<Highcharts.SeriesArcDiagramDataLabelsOptionsObject>}
 *
 * @apioption series.arcdiagram.nodes.dataLabels
 */

/**
 * An array of data points for the series. For the `arcdiagram` series type,
 * points can be given in the following way:
 *
 * An array of objects with named values. The following snippet shows only a few
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
 * @type      {Array<*>}
 * @extends   series.sankey.data
 * @product   highcharts
 * @excluding outgoing
 * @apioption series.arcdiagram.data
 */

/**
 * @type      {Highcharts.SeriesArcDiagramDataLabelsOptionsObject|Array<Highcharts.SeriesArcDiagramDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.arcdiagram.data.dataLabels
 */

/**
 * The link weight, in pixels. If not set, width is calculated per link,
 * depending on the weight value.
 *
 * @sample highcharts/series-arcdiagram/link-weight
 *         Link weight set on series
 *
 * @type {number}
 * @since 10.0.0
 * @default undefined
 * @product highcharts
 * @apioption series.arcdiagram.data.linkWeight
 */

''; // Adds doclets above to the transpiled file


/* *
 *
 *  Default Export
 *
 * */


export default ArcDiagramSeriesDefaults;
