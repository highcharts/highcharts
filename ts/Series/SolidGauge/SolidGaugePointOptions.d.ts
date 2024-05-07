/* *
 *
 *  (c) 2010-2024 Torstein Honsi
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

import type GaugePointOptions from '../Gauge/GaugePointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SolidGaugePointOptions extends GaugePointOptions {

    /**
     * The inner radius of an individual point in a solid gauge. Can be given
     * only in percentage, either as a number or a string like `"50%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @since 4.1.6
     *
     * @product highcharts
     */
    innerRadius?: string;

    /**
     * The outer radius of an individual point in a solid gauge. Can be given
     * only in percentage, either as a number or a string like `"100%"`.
     *
     * @sample {highcharts} highcharts/plotoptions/solidgauge-radius/
     *         Individual radius and innerRadius
     *
     * @since 4.1.6
     *
     * @product highcharts
     */
    radius?: string;

}

/* *
 *
 *  Default Export
 *
 * */

export default SolidGaugePointOptions;
