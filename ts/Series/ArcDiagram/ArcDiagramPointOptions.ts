/* *
 *
 *  Arc diagram module
 *
 *  (c) 2018-2026 Highsoft AS
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

import type SankeyPointOptions from '../Sankey/SankeyPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ArcDiagramPointOptions extends SankeyPointOptions {
    /**
     * The link weight, in pixels. If not set, width is calculated per link,
     * depending on the weight value.
     *
     * @sample highcharts/series-arcdiagram/link-weight
     *         Link weight set on series
     *
     * @since 10.0.0
     * @default undefined
     * @product highcharts
     */
    linkWeight?: number;

    /* *
     *
     *  Excluded
     *
     * */

    dataLabels?: undefined;
    outgoing?: undefined;
}

export default ArcDiagramPointOptions;
