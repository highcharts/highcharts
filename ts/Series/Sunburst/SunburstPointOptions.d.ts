/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2026 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
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

import type { SunburstDataLabelOptions } from './SunburstSeriesOptions';
import type TreemapPointOptions from '../Treemap/TreemapPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SunburstPointOptions extends TreemapPointOptions {

    /**
     * @product highcharts
     */
    dataLabels?: (SunburstDataLabelOptions|Array<SunburstDataLabelOptions>);

    /**
     * Use this option to build a tree structure. The value should be the id of
     * the point which is the parent. If no points has a matching id, or this
     * option is undefined, then the parent will be set to the root.
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    parent?: string;

    /**
     * Whether to display a slice offset from the center. When a sunburst point
     * is sliced, its children are also offset.
     *
     * @sample highcharts/plotoptions/sunburst-sliced
     *         Sliced sunburst
     *
     * @default false
     *
     * @since 6.0.4
     *
     * @product highcharts
     */
    sliced?: boolean;

    /**
     * The value of the point, resulting in a relative area of the point
     * in the sunburst.
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    value?: (number|null);

    x?: undefined;

    y?: undefined;

}

/* *
 *
 *  Default Export
 *
 * */

export default SunburstPointOptions;
