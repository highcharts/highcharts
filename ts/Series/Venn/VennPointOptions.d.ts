/* *
 *
 *  Experimental Highcharts module which enables visualization of a Venn
 *  diagram.
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  Layout algorithm by Ben Frederickson:
 *  https://www.benfrederickson.com/better-venn-diagrams/
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

import type ScatterPointOptions from '../Scatter/ScatterPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface VennPointOptions extends ScatterPointOptions {

    /**
     * The name of the point. Used in data labels and tooltip. If name is not
     * defined then it will default to the joined values in
     * [sets](#series.venn.sets).
     *
     * @sample {highcharts} highcharts/demo/venn-diagram/
     *         Venn diagram
     *
     * @sample {highcharts} highcharts/demo/euler-diagram/
     *         Euler diagram
     *
     * @since 7.0.0
     *
     * @product highcharts
     */
    name?: string;

    /**
     * The set or sets the options will be applied to. If a single entry is
     * defined, then it will create a new set. If more than one entry is
     * defined, then it will define the overlap between the sets in the array.
     *
     * @sample {highcharts} highcharts/demo/venn-diagram/
     *         Venn diagram
     *
     * @sample {highcharts} highcharts/demo/euler-diagram/
     *         Euler diagram
     *
     * @since 7.0.0
     *
     * @product highcharts
     */
    sets?: Array<string>;

    /**
     * The value of the point, resulting in a relative area of the circle, or
     * area of overlap between two sets in the venn or euler diagram.
     *
     * @sample {highcharts} highcharts/demo/venn-diagram/
     *         Venn diagram
     *
     * @sample {highcharts} highcharts/demo/euler-diagram/
     *         Euler diagram
     *
     * @since 7.0.0
     *
     * @product highcharts
     */
    value?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default VennPointOptions;
