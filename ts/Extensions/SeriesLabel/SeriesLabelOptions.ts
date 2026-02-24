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

import type { CSSObject } from '../../Core/Renderer/CSSObject';
import type Templating from '../../Core/Templating';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

export interface LabelIntersectBoxObject {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

export interface SeriesLabelOptions {
    /**
     * An array of boxes to avoid when laying out the labels. Each item has a
     * `left`, `right`, `top` and `bottom` property.
     *
     * @requires modules/series-label
     */
    boxesToAvoid?: Array<LabelIntersectBoxObject>;

    /**
     * Allow labels to be placed distant to the graph if necessary, and draw a
     * connector line to the graph. Setting this option to true may decrease the
     * performance significantly, since the algorithm with systematically search
     * for open spaces in the whole plot area. Visually, it may also result in a
     * more cluttered chart, though more of the series will be labeled.
     *
     * @default  false
     * @requires modules/series-label
     */
    connectorAllowed?: boolean;

    /**
     * If the label is closer than this to a neighbour graph, draw a connector.
     *
     * @default  24
     * @requires modules/series-label
     */
    connectorNeighbourDistance?: number;

    /**
     * Enable the series label per series.
     *
     * @default  true
     * @requires modules/series-label
     */
    enabled?: boolean;

    /**
     * A format string for the label, with support for a subset of HTML.
     * Variables are enclosed by curly brackets. Available variables are
     * `name`, `options.xxx`, `color` and other members from the `series`
     * object. Use this option also to set a static text for the label.
     *
     * @type     {string}
     * @since    8.1.0
     * @requires modules/series-label
     */
    format?: string;

    /**
     * Callback function to format each of the series' labels. The `this`
     * keyword refers to the series object. By default the `formatter` is
     * undefined and the `series.name` is rendered.
     *
     * @type     {Highcharts.FormatterCallbackFunction<Series>}
     * @since    8.1.0
     * @requires modules/series-label
     */
    formatter?: Templating.FormatterCallback<Series>;

    /**
     * For area-like series, allow the font size to vary so that small areas
     * get a smaller font size. The default applies this effect to area-like
     * series but not line-like series.
     *
     * @sample   highcharts/demo/streamgraph
     *           Min and max font size on a streamgraph
     * @type     {number|null}
     * @default  null
     * @requires modules/series-label
     */
    maxFontSize?: (number|null);

    /**
     * For area-like series, allow the font size to vary so that small areas
     * get a smaller font size. The default applies this effect to area-like
     * series but not line-like series.
     *
     * @sample   highcharts/demo/streamgraph
     *           Min and max font size on a streamgraph
     * @type     {number|null}
     * @default  null
     * @requires modules/series-label
     */
    minFontSize?: (number|null);

    /**
     * Draw the label on the area of an area series. By default it
     * is drawn on the area. Set it to `false` to draw it next to
     * the graph instead.
     *
     * @type     {boolean|null}
     * @default  null
     * @requires modules/series-label
     */
    onArea?: (boolean|null);

    /**
     * Styles for the series label. The color defaults to the series
     * color, or a contrast color if `onArea`.
     *
     * @type     {Highcharts.CSSObject}
     * @requires modules/series-label
     */
    style?: CSSObject;

    /**
     * Whether to use HTML to render the series label.
     *
     * @default  false
     * @requires modules/series-label
     */
    useHTML?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesLabelOptions;
