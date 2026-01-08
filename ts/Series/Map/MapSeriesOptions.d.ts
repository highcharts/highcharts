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

import type ColorAxisComposition from '../../Core/Axis/Color/ColorAxisComposition';
import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type MapPointOptions from './MapPointOptions';
import type {
    PointOptions,
    PointShortOptions,
    PointMarkerOptions
} from '../../Core/Series/PointOptions';
import type ScatterSeriesOptions from '../Scatter/ScatterSeriesOptions';
import type {
    SeriesStatesOptions,
    SeriesLinecapValue,
    LegendSymbolType
} from '../../Core/Series/SeriesOptions';
import type TooltipOptions from '../../Core/TooltipOptions';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Whether all areas of the map defined in `mapData` should be rendered.
 * If `true`, areas which don't correspond to a data point, are rendered
 * as `null` points. If `false`, those areas are skipped.
 *
 * @sample maps/plotoptions/series-allareas-false/
 *         All areas set to false
 *
 * @type {boolean}
 *
 * @default true
 *
 * @product highmaps
 *
 * @apioption plotOptions.series.allAreas
 */

/**
 * The border color of the map areas.
 *
 * In styled mode, the border stroke is given in the `.highcharts-point`
 * class.
 *
 * @sample {highmaps} maps/plotoptions/series-border/
 *         Borders demo
 *
 * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 *
 * @default #cccccc
 *
 * @product highmaps
 *
 * @apioption plotOptions.series.borderColor
 */

/**
 * The border width of each map area.
 *
 * In styled mode, the border stroke width is given in the
 * `.highcharts-point` class.
 *
 * @sample maps/plotoptions/series-border/
 *         Borders demo
 *
 * @type {number}
 *
 * @default 1
 *
 * @product highmaps
 *
 * @apioption plotOptions.series.borderWidth
 */

/**
 * What property to join the `mapData` to the value data. For example,
 * if joinBy is "code", the mapData items with a specific code is merged
 * into the data with the same code. For maps loaded from GeoJSON, the
 * keys may be held in each point's `properties` object.
 *
 * The joinBy option can also be an array of two values, where the first
 * points to a key in the `mapData`, and the second points to another
 * key in the `data`.
 *
 * When joinBy is `null`, the map items are joined by their position in
 * the array, which performs much better in maps with many data points.
 * This is the recommended option if you are printing more than a
 * thousand data points and have a backend that can preprocess the data
 * into a parallel array of the mapData.
 *
 * @sample maps/plotoptions/series-border/
 *         Joined by "code"
 *
 * @sample maps/demo/geojson/
 *         GeoJSON joined by an array
 *
 * @sample maps/series/joinby-null/
 *         Simple data joined by null
 *
 * @type {string|Array<string>}
 *
 * @default hc-key
 *
 * @product highmaps
 *
 * @apioption plotOptions.series.joinBy
 */

/**
 * Define the z index of the series.
 *
 * @type {number}
 *
 * @product highmaps
 *
 * @apioption plotOptions.series.zIndex
 */

/**
 * The map series is used for basic choropleth maps, where each map area has
 * a color based on its value.
 *
 * @sample maps/demo/all-maps/
 *         Choropleth map
 *
 * @extends plotOptions.scatter
 *
 * @excluding boostBlending, boostThreshold, dragDrop, cluster, marker
 *
 * @product highmaps
 */
export interface MapSeriesOptions
    extends ColorAxisComposition.SeriesCompositionOptions,
    ScatterSeriesOptions {

    /**
     * Whether the MapView takes this series into account when computing the
     * default zoom and center of the map.
     *
     * @sample maps/series/affectsmapview/
     *         US map with world map backdrop
     *
     * @since 10.0.0
     */
    affectsMapView?: boolean;

    /**
     * @default value
     */
    colorKey?: string;

    data?: Array<(MapPointOptions|PointOptions|PointShortOptions)>;

    dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);

    legendSymbol?: LegendSymbolType;

    /**
     * The SVG value used for the `stroke-linecap` and `stroke-linejoin` of
     * the map borders. Round means that borders are rounded in the ends and
     * bends.
     *
     * @sample maps/demo/mappoint-mapmarker/
     *         Backdrop coastline with round linecap
     *
     * @since 10.3.3
     */
    linecap?: SeriesLinecapValue;

    /**
     * @ignore-option
     */
    marker?: PointMarkerOptions;

    /**
     * The color to apply to null points.
     *
     * In styled mode, the null point fill is set in the
     * `.highcharts-null-point` class.
     *
     * @sample maps/demo/all-areas-as-null/
     *         Null color
     *
     * @type {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     */
    nullColor?: ColorType;

    /**
     * Whether to allow pointer interaction like tooltips and mouse events
     * on null points.
     *
     * @since 4.2.7
     */
    nullInteraction?: boolean;

    states?: SeriesStatesOptions<MapSeriesOptions>;

    /**
     * @ignore-option
     */
    turboThreshold?: number;

    tooltip?: Partial<TooltipOptions>;

}

/* *
 *
 *  Default Export
 *
 * */

export default MapSeriesOptions;
