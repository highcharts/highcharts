/* *
 *
 *  (c) 2009-2021 Torstein Honsi
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

import type SeriesLabelOptions from './SeriesLabelOptions';

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
 * @optionparent plotOptions.series.label
 */
const SeriesLabelDefaults: SeriesLabelOptions = {

    /**
     * Enable the series label per series.
     */
    enabled: true,

    /**
     * Allow labels to be placed distant to the graph if necessary,
     * and draw a connector line to the graph. Setting this option
     * to true may decrease the performance significantly, since the
     * algorithm with systematically search for open spaces in the
     * whole plot area. Visually, it may also result in a more
     * cluttered chart, though more of the series will be labeled.
     */
    connectorAllowed: false,

    /**
     * If the label is closer than this to a neighbour graph, draw a
     * connector.
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
     */
    format: void 0,

    /**
     * Callback function to format each of the series' labels. The
     * `this` keyword refers to the series object. By default the
     * `formatter` is undefined and the `series.name` is rendered.
     *
     * @type {Highcharts.FormatterCallbackFunction<Series>}
     * @since 8.1.0
     */
    formatter: void 0,

    /**
     * For area-like series, allow the font size to vary so that
     * small areas get a smaller font size. The default applies this
     * effect to area-like series but not line-like series.
     *
     * @type {number|null}
     */
    minFontSize: null,

    /**
     * For area-like series, allow the font size to vary so that
     * small areas get a smaller font size. The default applies this
     * effect to area-like series but not line-like series.
     *
     * @type {number|null}
     */
    maxFontSize: null,

    /**
     * Draw the label on the area of an area series. By default it
     * is drawn on the area. Set it to `false` to draw it next to
     * the graph instead.
     *
     * @type {boolean|null}
     */
    onArea: null,

    /**
     * Styles for the series label. The color defaults to the series
     * color, or a contrast color if `onArea`.
     *
     * @type {Highcharts.CSSObject}
     */
    style: {
        /** @internal */
        fontSize: '0.8em',
        /** @internal */
        fontWeight: 'bold'
    },

    /**
     * Whether to use HTML to render the series label.
     */
    useHTML: false,

    /**
     * An array of boxes to avoid when laying out the labels. Each
     * item has a `left`, `right`, `top` and `bottom` property.
     *
     * @type {Array<Highcharts.LabelIntersectBoxObject>}
     */
    boxesToAvoid: []

};

/* *
 *
 *  Default Export
 *
 * */

export default SeriesLabelDefaults;
