/* *
 *
 *  Arc diagram module
 *
 *  (c) 2018-2025 Torstein Honsi
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
     *
     * @type {Highcharts.SeriesArcDiagramDataLabelsOptionsObject|Array<Highcharts.SeriesArcDiagramDataLabelsOptionsObject>}
     *
     * @product highcharts
     *
     * @apioption series.arcdiagram.data.dataLabels
     */
    dataLabels?: SankeyPointOptions['dataLabels'];

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
    linkWeight?: number;

}

export default ArcDiagramPointOptions;
