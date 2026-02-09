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
     * connector line to the graph.
     *
     * @requires modules/series-label
     */
    connectorAllowed?: boolean;

    /**
     * If the label is closer than this to a neighbour graph, draw a connector.
     *
     * @requires modules/series-label
     */
    connectorNeighbourDistance?: number;

    /**
     * Enable the series label per series.
     *
     * @requires modules/series-label
     */
    enabled?: boolean;

    /**
     * A format string for the label, with support for a subset of HTML.
     *
     * @since    8.1.0
     * @requires modules/series-label
     */
    format?: string;

    /**
     * Callback function to format each of the series' labels. The `this`
     * keyword refers to the series object.
     *
     * @since    8.1.0
     * @requires modules/series-label
     */
    formatter?: Templating.FormatterCallback<Series>;

    /**
     * For area-like series, allow the font size to vary so that small areas
     * get a smaller font size.
     *
     * @requires modules/series-label
     */
    maxFontSize?: (number|null);

    /**
     * For area-like series, allow the font size to vary so that small areas
     * get a smaller font size.
     *
     * @requires modules/series-label
     */
    minFontSize?: (number|null);

    /**
     * Draw the label on the area of an area series. Set it to `false` to draw
     * it next to the graph instead.
     *
     * @requires modules/series-label
     */
    onArea?: (boolean|null);

    /**
     * Styles for the series label.
     *
     * @requires modules/series-label
     */
    style?: CSSObject;

    /**
     * Whether to use HTML to render the series label.
     *
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
