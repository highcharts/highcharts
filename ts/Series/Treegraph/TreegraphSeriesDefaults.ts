/* *
 *
 *  (c) 2010-2022 Pawel Lysy Grzegorz Blachlinski
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

import type Point from '../../Core/Series/Point';
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
 *               colorKey, compare, dataGrouping, endAgle, gapSize, gapUnit,
 *               ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *               minSize, navigatorOptions, pointRange, allowTraversingTree,
 *               alternateStartingDirection, borderRadius, breadcrumbs,
 *               interactByLeaf, layoutStartingDirection, levelIsConstant,
 *               lineWidth, negativeColor, nodes, sortIndex, zoneAxis,
 *               zones
 *
 * @product      highcharts
 * @since 10.3.0
 * @requires     modules/treemap.js
 * @requires     modules/treegraph.js
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
         * @apioption series.treegraph.link.curveFactor
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
         * Works for `default` link type.
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
         * @type {'default' | 'curved' | 'straight'}
         * @product highcharts
         *
         */
        type: 'curved'
    },
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
            fontSize: '16px'
        }
    },
    /**
     * @extends plotOptions.series.tooltip
     */
    tooltip: {
        /**
         * The HTML of the point's line in the tooltip. Variables are
         * enclosed by curly brackets. Available variables are
         * `point.id`,  `point.fromNode.id`, `point.toNode.id`,
         * `series.name`, `series.color` and other properties on the
         * same form. Furthermore, This can also be overridden for each
         * series, which makes it a good hook for displaying units. In
         * styled mode, the dot is colored by a class name rather than
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
        style: {
            textOverflow: 'none'
        }
    }
} as TreegraphSeriesOptions;

/* *
 *
 *  Default Export
 *
 * */

export default TreegraphSeriesDefaults;
