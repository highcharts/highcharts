/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Honsi
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

import type { SeriesLabelOptions } from './SeriesLabelOptions';

/* *
 *
 *  Constants
 *
 * */

/**
 * Series labels are placed as close to the series as possible in a
 * natural way, seeking to avoid other series. The goal of this
 * feature is to make the chart more easily readable, like if a
 * human designer placed the labels in the optimal position.
 *
 * The series labels currently work with series types having a
 * `graph` or an `area`.
 *
 * @sample highcharts/series-label/line-chart
 *         Line chart
 * @sample highcharts/demo/streamgraph
 *         Stream graph
 * @sample highcharts/series-label/stock-chart
 *         Stock chart
 *
 * @declare  Highcharts.SeriesLabelOptionsObject
 * @since    6.0.0
 * @product  highcharts highstock gantt
 * @requires modules/series-label
 */
const SeriesLabelDefaults: SeriesLabelOptions = {

    /**
     * Enable the series label per series.
     *
     * @default  true
     * @requires modules/series-label
     */
    enabled: true,

    /**
     * Allow labels to be placed distant to the graph if necessary,
     * and draw a connector line to the graph. Setting this option
     * to true may decrease the performance significantly, since the
     * algorithm with systematically search for open spaces in the
     * whole plot area. Visually, it may also result in a more
     * cluttered chart, though more of the series will be labeled.
     *
     * @default  false
     * @requires modules/series-label
     */
    connectorAllowed: false,

    /**
     * If the label is closer than this to a neighbour graph, draw a
     * connector.
     *
     * @default  24
     * @requires modules/series-label
     */
    connectorNeighbourDistance: 24,

    /**
     * A format string for the label, with support for a subset of
     * HTML. Variables are enclosed by curly brackets. Available
     * variables are `name`, `options.xxx`, `color` and other
     * members from the `series` object. Use this option also to set
     * a static text for the label.
     *
     * @type string
     * @since 8.1.0
     * @requires modules/series-label
     */
    format: void 0,

    /**
     * Callback function to format each of the series' labels. The
     * `this` keyword refers to the series object.
     *
     * @type {Highcharts.FormatterCallbackFunction<Series>}
     * @since 8.1.0
     * @requires modules/series-label
     */
    formatter: void 0,

    /**
     * For area-like series, allow the font size to vary so that
     * small areas get a smaller font size.
     *
     * @sample highcharts/demo/streamgraph
     *         Min and max font size on a streamgraph
     * @type   {number|null}
     * @default null
     * @requires modules/series-label
     */
    minFontSize: null,

    /**
     * For area-like series, allow the font size to vary so that
     * small areas get a smaller font size.
     *
     * @sample highcharts/demo/streamgraph
     *         Min and max font size on a streamgraph
     *
     * @type   {number|null}
     * @default null
     * @requires modules/series-label
     */
    maxFontSize: null,

    /**
     * Draw the label on the area of an area series. Set it to
     * `false` to draw it next to the graph instead.
     *
     * @type {boolean|null}
     * @default null
     * @requires modules/series-label
     */
    onArea: null,

    /**
     * Styles for the series label.
     *
     * @type {Highcharts.CSSObject}
     * @requires modules/series-label
     */
    style: {
        /**
         * @type {number|string}
         * @default "0.8em"
         */
        fontSize: '0.8em',
        /** @internal */
        fontWeight: 'bold'
    },

    /**
     * Whether to use HTML to render the series label.
     *
     * @default  false
     * @requires modules/series-label
     */
    useHTML: false,

    /**
     * An array of boxes to avoid when laying out the labels. Each
     * item has a `left`, `right`, `top` and `bottom` property.
     *
     * @type {Array<Highcharts.LabelIntersectBoxObject>}
     * @requires modules/series-label
     */
    boxesToAvoid: []

};

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default SeriesLabelDefaults;
