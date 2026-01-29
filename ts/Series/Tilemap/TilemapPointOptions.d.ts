/* *
 *
 *  Tilemaps module
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Øystein Moseng
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

import type ColorType from '../../Core/Color/ColorType';
import type HeatmapPointOptions from '../Heatmap/HeatmapPointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface TilemapPointOptions extends HeatmapPointOptions {

    /**
     * The color of the point. In tilemaps the point color is rarely set
     * explicitly, as we use the color to denote the `value`. Options for
     * this are set in the [colorAxis](#colorAxis) configuration.
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     *
     * @product highcharts highmaps
     */
    color?: ColorType;

    /**
     * The x coordinate of the point.
     *
     * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
     * coordinates are offset.
     *
     * @sample maps/series/tilemap-gridoffset
     *         Offset grid coordinates
     *
     * @product highcharts highmaps
     */
    x?: number;

    /**
     * The y coordinate of the point.
     *
     * Note that for some [tileShapes](#plotOptions.tilemap.tileShape) the grid
     * coordinates are offset.
     *
     * @sample maps/series/tilemap-gridoffset
     *         Offset grid coordinates
     *
     * @product highcharts highmaps
     */
    y?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default TilemapPointOptions;
