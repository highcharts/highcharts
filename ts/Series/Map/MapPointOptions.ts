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

import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type { GeoJSONGeometryMultiPoint } from '../../Maps/GeoJSON';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel';
import type { PointMarkerStatesOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointOptions extends ScatterPointOptions {
    /**
     * Individual color for the point. By default the color is either used
     * to denote the value, or pulled from the global `colors` array.
     *
     * @product   highmaps
     */
    color?: ColorType;

    /**
     * Individual data label for each point. The options are the same as
     * the ones for [plotOptions.series.dataLabels](
     * #plotOptions.series.dataLabels).
     *
     * @sample maps/series/data-datalabels/
     *         Disable data labels for individual areas
     *
     * @product   highmaps
     */
    dataLabels?: (MapPointDataLabelOptions | Array<MapPointDataLabelOptions>);

    /**
     * The `id` of a series in the [drilldown.series](#drilldown.series)
     * array to use for a drilldown for this point.
     *
     * @sample maps/demo/map-drilldown/
     *         Basic drilldown
     *
     * @product   highmaps
     */
    drilldown?: string;

    /**
     * For map and mapline series types, the geometry of a point.
     *
     * To achieve a better separation between the structure and the data,
     * it is recommended to use `mapData` to define the geometry instead
     * of defining it on the data points themselves.
     *
     * The geometry object is compatible to that of a `feature` in GeoJSON, so
     * features of GeoJSON can be passed directly into the `data`, optionally
     * after first filtering and processing it.
     *
     * For pre-projected maps (like GeoJSON maps from our
     * [map collection](https://code.highcharts.com/mapdata/)), user has to specify
     * coordinates in `projectedUnits` for geometry type other than `Point`,
     * instead of `[longitude, latitude]`.
     *
     * @sample maps/series/mappoint-line-geometry/
     *         Map point and line geometry
     *
     * @sample maps/series/geometry-types/
     *         Geometry types
     *
     * @since 9.3.0
     *
     * @product   highmaps
     */
    geometry?: GeoJSONGeometryMultiPoint;

    /**
     * An id for the point. This can be used after render time to get a
     * pointer to the point object through `chart.get()`.
     *
     * @sample maps/series/data-id/
     *         Highlight a point by id
     *
     * @product   highmaps
     */
    id?: string;

    /**
     * When data labels are laid out on a map, Highmaps runs a simplified
     * algorithm to detect collision. When two labels collide, the one with
     * the lowest rank is hidden. By default the rank is computed from the
     * area.
     *
     * @product   highmaps
     */
    labelrank?: number;

    /**
     * The relative mid point of an area, used to place the data label.
     * Ranges from 0 to 1\. When `mapData` is used, middleX can be defined
     * there.
     *
     * @default   0.5
     *
     * @product   highmaps
     */
    middleX?: number;

    /**
     * The relative mid point of an area, used to place the data label.
     * Ranges from 0 to 1\. When `mapData` is used, middleY can be defined
     * there.
     *
     * @default   0.5
     *
     * @product   highmaps
     */
    middleY?: number;

    /**
     * The name of the point as shown in the legend, tooltip, dataLabel
     * etc.
     *
     * @sample maps/series/data-datalabels/
     *         Point names
     *
     * @product   highmaps
     */
    name?: string;

    /**
     * For map and mapline series types, the SVG path for the shape. For
     * compatibility with old IE, not all SVG path definitions are supported,
     * but M, L and C operators are safe.
     *
     * To achieve a better separation between the structure and the data,
     * it is recommended to use `mapData` to define that paths instead
     * of defining them on the data points themselves.
     *
     * For providing true geographical shapes based on longitude and
     * latitude, use the `geometry` option instead.
     *
     * @sample maps/series/data-path/
     *         Paths defined in data
     *
     * @product   highmaps
     */
    path?: (string|SVGPath);
    properties?: AnyRecord;

    /**
     *
     *
     * @product   highmaps
     */
    states?: PointMarkerStatesOptions<MapPointOptions>;

    /**
     * The numeric value of the data point.
     *
     * @product   highmaps
     */
    value?: (number|null);
}

export type MapPointDataLabelOptions =
    DataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default MapPointOptions;
