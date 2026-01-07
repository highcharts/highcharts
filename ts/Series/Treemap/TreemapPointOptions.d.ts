/* *
 *
 *  (c) 2014-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
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

export interface TreemapPointOptions extends ScatterPointOptions {

    /**
     * Serves a purpose only if a `colorAxis` object is defined in the chart
     * options. This value will decide which color the point gets from the
     * scale of the colorAxis.
     *
     * @since 4.1.0
     *
     * @product highcharts
     */
    colorValue?: number;

    name?: string;

    /**
     * Only for trees. Use this option to build a tree structure. The value
     * should be the id of the point which is the parent. If no points has a
     * matching id, or this option is undefined, then the parent will be set to
     * the root.
     *
     * @sample {highcharts} highcharts/point/parent/
     *         Point parent
     *
     * @sample {highcharts} highcharts/demo/treemap-with-levels/
     *         Example where parent id is not matching
     *
     * @since 4.1.0
     *
     * @product highcharts
     */
    parent?: string;

    /**
     * The value of the point, resulting in a relative area of the point
     * in the treemap.
     *
     * @product highcharts
     */
    value?: (number|null);

    width?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default TreemapPointOptions;
