/* *
 *
 *  Arc diagram module
 *
 *  (c) 2018-2024 Torstein Honsi
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

import type SankeyPointOptions from '../Sankey/SankeyPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface ArcDiagramPointOptions extends SankeyPointOptions {

    /**
     * Individual data label for each node. The options are the same as the ones
     * for [series.arcdiagram.dataLabels](#series.arcdiagram.dataLabels).
     *
     * @type {Highcharts.SeriesArcDiagramDataLabelsOptionsObject|Array<Highcharts.SeriesArcDiagramDataLabelsOptionsObject>}
     *
     * @apioption series.arcdiagram.nodes.dataLabels
     */

    /**
     *
     * @type {Highcharts.SeriesArcDiagramDataLabelsOptionsObject|Array<Highcharts.SeriesArcDiagramDataLabelsOptionsObject>}
     *
     * @product highcharts
     *
     * @apioption series.arcdiagram.data.dataLabels
     */

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

}

export default ArcDiagramPointOptions;
