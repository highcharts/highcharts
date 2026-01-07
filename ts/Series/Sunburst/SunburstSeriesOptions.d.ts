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

import type BreadcrumbsOptions from '../../Extensions/Breadcrumbs/BreadcrumbsOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type { SeriesStatesOptions } from '../../Core/Series/SeriesOptions';
import type SunburstPointOptions from './SunburstPointOptions';
import type SunburstSeries from './SunburstSeries';
import type {
    TreemapSeriesLevelColorVariationOptions,
    TreemapSeriesLevelOptions,
    TreemapSeriesOptions,
    TreemapSeriesUpButtonOptions
} from '../Treemap/TreemapSeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface SunburstDataLabelOptions extends DataLabelOptions {
    allowOverlap?: boolean;
    rotationMode?: SunburstDataLabelRotationValue;
}

export type SunburstDataLabelRotationValue = (
    'auto'|'perpendicular'|'parallel'|'circular'
);


/**
 * Can set a `colorVariation` on all points which lies on the same
 * level.
 */
export interface SunburstSeriesLevelColorVariationOptions extends TreemapSeriesLevelColorVariationOptions {

    /**
     * The key of a color variation. Currently supports `brightness` only.
     *
     * @type {string}
     */
    key?: string;

    /**
     * The ending value of a color variation. The last sibling will receive
     * this value.
     *
     * @type {number}
     */
    to?: number;
}


/**
 * Determines the width of the ring per level.
 *
 * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
 *         Sunburst with various sizes per level
 *
 * @since 6.0.5
 */
export interface SunburstSeriesLevelSizeOptions {

    /**
     * How to interpret `levelSize.value`.
     *
     * - `percentage` gives a width relative to result of outer radius
     *   minus inner radius.
     *
     * - `pixels` gives the ring a fixed width in pixels.
     *
     * - `weight` takes the remaining width after percentage and pixels,
     *   and distributes it across all "weighted" levels. The value
     *   relative to the sum of all weights determines the width.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     *
     * @validvalue ["percentage", "pixels", "weight"]
     */
    unit?: string;

    /**
     * The value used for calculating the width of the ring. Its' affect
     * is determined by `levelSize.unit`.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     */
    value?: number;
}

/**
 * @optionparent plotOptions.sunburst.levels
 */
export interface SunburstSeriesLevelOptions extends TreemapSeriesLevelOptions {

    /**
     * Can set a `borderColor` on all points which lies on the same level.
     */
    borderColor?: ColorString;

    /**
     * Can set a `borderDashStyle` on all points which lies on the same level.
     */
    borderDashStyle?: DashStyleValue;

    /**
     * Can set a `borderWidth` on all points which lies on the same level.
     */
    borderWidth?: number;

    /**
     * Can set a `color` on all points which lies on the same level.
     */
    color?: ColorType;

    /**
     * Determines whether the chart should receive one color per point based
     * on this level.
     */
    colorByPoint?: boolean;

    colorVariation?: SunburstSeriesLevelColorVariationOptions;

    /**
     * Can set `dataLabels` on all points which lies on the same level.
     */
    dataLabels?: SunburstDataLabelOptions;

    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     */
    level?: number;

    /**
     * Can set a `levelSize` on all points which lies on the same level.
     */
    levelSize?: object;

    rotation?: number;

    rotationMode?: string;

    slicedOffset?: number;

}


/**
 * A Sunburst displays hierarchical data, where a level in the hierarchy is
 * represented by a circle. The center represents the root node of the tree.
 * The visualization bears a resemblance to both treemap and pie charts.
 *
 * A `sunburst` series. If the [type](#series.sunburst.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @sample highcharts/demo/sunburst
 *         Sunburst chart
 *
 * @extends plotOptions.pie
 *
 * @extends series,plotOptions.sunburst
 *
 * @excluding allAreas, clip, colorAxis, colorKey, compare, compareBase,
 *            dataGrouping, depth, dragDrop, endAngle, gapSize, gapUnit,
 *            ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *            minSize, navigatorOptions, pointRange
 *
 * @excluding dataParser, dataURL, stack, dataSorting, boostThreshold,
 *            boostBlending
 *
 * @product highcharts
 *
 * @requires modules/sunburst
 */
export interface SunburstSeriesOptions extends TreemapSeriesOptions {

    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children. Deprecated and replaced by
     * [allowTraversingTree](#plotOptions.sunburst.allowTraversingTree).
     *
     * @deprecated
     *
     * @default false
     *
     * @since 6.0.0
     *
     * @product highcharts
     */
    allowDrillToNode?: boolean;

    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children.
     *
     * @default false
     *
     * @since 7.0.3
     *
     * @product highcharts
     */
    allowTraversingTree?: boolean;

    /**
     * Options for the breadcrumbs, the navigation at the top leading the
     * way up through the traversed levels.
     *
     * @since 10.0.0
     *
     * @product highcharts
     */
    breadcrumbs?: BreadcrumbsOptions;

    /**
     * The center of the sunburst chart relative to the plot area. Can be
     * percentages or pixel values.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-center/
     *         Centered at 100, 100
     *
     * @default ["50%", "50%"]
     *
     * @product highcharts
     */
    center?: Array<(number|string)>;

    /**
     * @product highcharts
     */
    clip?: boolean;

    colorByPoint?: boolean;

    /**
     * @product highcharts
     */
    data?: Array<(number|null|SunburstPointOptions)>;

    dataLabels?: (SunburstDataLabelOptions|Array<SunburstDataLabelOptions>);

    endAngle?: number;

    /**
     * Used together with the levels and `allowDrillToNode` options. When
     * set to false the first level visible when drilling is considered
     * to be level one. Otherwise the level will be the same as the tree
     * structure.
     */
    levelIsConstant?: boolean;

    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not point options.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     */
    levels?: Array<SunburstSeriesLevelOptions>;

    /**
     * Determines the width of the ring per level.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     *
     * @since 6.0.5
     */
    levelSize?: SunburstSeriesLevelSizeOptions;

    mapIdToNode?: SunburstSeries['nodeMap'];

    /**
     * Which point to use as a root in the visualization.
     */
    rootId?: string;

    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample highcharts/plotoptions/sunburst-sliced
     *         Sliced sunburst
     *
     * @since 6.0.4
     */
    slicedOffset?: number;

    startAngle?: number;

    states?: SeriesStatesOptions<SunburstSeriesOptions>;

    /**
     * Options for the button appearing when traversing down in a sunburst.
     * Since v9.3.3 the `traverseUpButton` is replaced by `breadcrumbs`.
     *
     * @deprecated
     *
     * @since 6.0.0
     *
     * @apioption plotOptions.sunburst.traverseUpButton
     */
    traverseUpButton?: TreemapSeriesUpButtonOptions;

    /**
     * Disable inherited opacity from Treemap series.
     *
     * @ignore-option
     */
    opacity?: number;

}

/* *
 *
 *  Default Export
 *
 * */

export default SunburstSeriesOptions;
