/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
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
     * either as a pixel value (number), or as a percentage string, like
     * `"50%"`. Defaults to match the `pane.innerSize` or the series-level
     * `innerRadius` if set.
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
     * either as a pixel value (number), or as a percentage string, like
     * `"100%"`. Defaults to match the `pane.size` or the series-level `radius`
     * if set.
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
