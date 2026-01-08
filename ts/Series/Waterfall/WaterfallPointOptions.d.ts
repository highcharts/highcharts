/* *
 *
 *  (c) 2010-2026 Highsoft AS
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

import ColumnPointOptions from '../Column/ColumnPointOptions.js';

/* *
 *
 *  Declarations
 *
 * */

interface WaterfallPointOptions extends ColumnPointOptions {

    /**
     * When this property is true, the points acts as a summary column for the
     * values added or subtracted since the last intermediate sum, or since the
     * start of the series. The `y` value is ignored.
     *
     * @sample {highcharts} highcharts/demo/waterfall/
     *         Waterfall
     *
     * @default false
     *
     * @product highcharts
     */
    isIntermediateSum?: boolean;

    /**
     * When this property is true, the point display the total sum across the
     * entire series. The `y` value is ignored.
     *
     * @sample {highcharts} highcharts/demo/waterfall/
     *         Waterfall
     *
     * @default false
     *
     * @product highcharts
     */
    isSum?: boolean;

}

/* *
 *
 *  Export
 *
 * */

export default WaterfallPointOptions;
