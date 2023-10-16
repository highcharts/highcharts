/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type SunburstSeriesOptions from './SunburstSeriesOptions';

/* *
 *
 *  API Options
 *
 * */


/**
 * A Sunburst displays hierarchical data, where a level in the hierarchy is
 * represented by a circle. The center represents the root node of the tree.
 * The visualization bears a resemblance to both treemap and pie charts.
 *
 * @sample highcharts/demo/sunburst
 *         Sunburst chart
 *
 * @extends      plotOptions.pie
 * @excluding    allAreas, clip, colorAxis, colorKey, compare, compareBase,
 *               dataGrouping, depth, dragDrop, endAngle, gapSize, gapUnit,
 *               ignoreHiddenPoint, innerSize, joinBy, legendType, linecap,
 *               minSize, navigatorOptions, pointRange
 * @product      highcharts
 * @requires     modules/sunburst.js
 * @optionparent plotOptions.sunburst
 *
 * @private
 */
const SunburstSeriesDefaults: SunburstSeriesOptions = {

    /**
     * Options for the breadcrumbs, the navigation at the top leading the
     * way up through the traversed levels.
     *
     * @since 10.0.0
     * @product   highcharts
     * @extends   navigation.breadcrumbs
     * @optionparent plotOptions.sunburst.breadcrumbs
     */

    /**
     * Set options on specific levels. Takes precedence over series options,
     * but not point options.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @type      {Array<*>}
     * @apioption plotOptions.sunburst.levels
     */

    /**
     * Can set a `borderColor` on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorString}
     * @apioption plotOptions.sunburst.levels.borderColor
     */

    /**
     * Can set a `borderWidth` on all points which lies on the same level.
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.borderWidth
     */

    /**
     * Can set a `borderDashStyle` on all points which lies on the same
     * level.
     *
     * @type      {Highcharts.DashStyleValue}
     * @apioption plotOptions.sunburst.levels.borderDashStyle
     */

    /**
     * Can set a `color` on all points which lies on the same level.
     *
     * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
     * @apioption plotOptions.sunburst.levels.color
     */

    /**
     * Determines whether the chart should receive one color per point based
     * on this level.
     *
     * @type      {boolean}
     * @apioption plotOptions.sunburst.levels.colorByPoint
     */

    /**
     * Can set a `colorVariation` on all points which lies on the same
     * level.
     *
     * @apioption plotOptions.sunburst.levels.colorVariation
     */

    /**
     * The key of a color variation. Currently supports `brightness` only.
     *
     * @type      {string}
     * @apioption plotOptions.sunburst.levels.colorVariation.key
     */

    /**
     * The ending value of a color variation. The last sibling will receive
     * this value.
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.colorVariation.to
     */

    /**
     * Can set `dataLabels` on all points which lies on the same level.
     *
     * @extends   plotOptions.sunburst.dataLabels
     * @apioption plotOptions.sunburst.levels.dataLabels
     */

    /**
     * Decides which level takes effect from the options set in the levels
     * object.
     *
     * @sample highcharts/demo/sunburst
     *         Sunburst chart
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.level
     */

    /**
     * Can set a `levelSize` on all points which lies on the same level.
     *
     * @type      {Object}
     * @apioption plotOptions.sunburst.levels.levelSize
     */

    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children. Deprecated and replaced by
     * [allowTraversingTree](#plotOptions.sunburst.allowTraversingTree).
     *
     * @deprecated
     * @type      {boolean}
     * @default   false
     * @since     6.0.0
     * @product   highcharts
     * @apioption plotOptions.sunburst.allowDrillToNode
     */

    /**
     * When enabled the user can click on a point which is a parent and
     * zoom in on its children.
     *
     * @type      {boolean}
     * @default   false
     * @since     7.0.3
     * @product   highcharts
     * @apioption plotOptions.sunburst.allowTraversingTree
     */

    /**
     * The center of the sunburst chart relative to the plot area. Can be
     * percentages or pixel values.
     *
     * @sample {highcharts} highcharts/plotoptions/pie-center/
     *         Centered at 100, 100
     *
     * @type    {Array<number|string>}
     * @default ["50%", "50%"]
     * @product highcharts
     *
     * @private
     */
    center: ['50%', '50%'],

    /**
     * @product highcharts
     *
     * @private
     */
    clip: false,

    colorByPoint: false,
    /**
     * Disable inherited opacity from Treemap series.
     *
     * @ignore-option
     *
     * @private
     */
    opacity: 1,
    /**
     * @declare Highcharts.SeriesSunburstDataLabelsOptionsObject
     *
     * @private
     */
    dataLabels: {

        allowOverlap: true,

        defer: true,

        /**
         * Decides how the data label will be rotated relative to the
         * perimeter of the sunburst. Valid values are `circular`, `auto`,
         * `parallel` and `perpendicular`. When `circular`, the best fit
         * will be computed for the point, so that the label is curved
         * around the center when there is room for it, otherwise
         * perpendicular. The legacy `auto` option works similiar to
         * `circular`, but instead of curving the labels they are tangent to
         * the perimiter.
         *
         * The `rotation` option takes precedence over `rotationMode`.
         *
         * @type       {string}
         * @sample {highcharts}
         *         highcharts/plotoptions/sunburst-datalabels-rotationmode-circular/
         *         Circular rotation mode
         * @validvalue ["auto", "perpendicular", "parallel", "circular"]
         * @since      6.0.0
         */
        rotationMode: 'circular',

        style: {
            /** @internal */
            textOverflow: 'ellipsis'
        }

    },
    /**
     * Which point to use as a root in the visualization.
     *
     * @type {string}
     *
     * @private
     */
    rootId: void 0,

    /**
     * Used together with the levels and `allowDrillToNode` options. When
     * set to false the first level visible when drilling is considered
     * to be level one. Otherwise the level will be the same as the tree
     * structure.
     *
     * @private
     */
    levelIsConstant: true,

    /**
     * Determines the width of the ring per level.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     *
     * @since 6.0.5
     *
     * @private
     */
    levelSize: {
        /**
         * The value used for calculating the width of the ring. Its' affect
         * is determined by `levelSize.unit`.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         */
        value: 1,
        /**
         * How to interpret `levelSize.value`.
         *
         * - `percentage` gives a width relative to result of outer radius
         *   minus inner radius.
         *
         * - `pixels` gives the ring a fixed width in pixels.
         *
         * - `weight` takes the remaining width after percentage and pixels,
         *   and distributes it accross all "weighted" levels. The value
         *   relative to the sum of all weights determines the width.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         *
         * @validvalue ["percentage", "pixels", "weight"]
         */
        unit: 'weight'
    },

    /**
     * Options for the button appearing when traversing down in a sunburst.
     * Since v9.3.3 the `traverseUpButton` is replaced by `breadcrumbs`.
     *
     * @extends   plotOptions.treemap.traverseUpButton
     * @since     6.0.0
     * @deprecated
     * @apioption plotOptions.sunburst.traverseUpButton
     *
     */

    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample highcharts/plotoptions/sunburst-sliced
     *         Sliced sunburst
     *
     * @since 6.0.4
     *
     * @private
     */
    slicedOffset: 10

};

/**
 * A `sunburst` series. If the [type](#series.sunburst.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sunburst
 * @excluding dataParser, dataURL, stack, dataSorting, boostThreshold,
 *            boostBlending
 * @product   highcharts
 * @requires  modules/sunburst.js
 * @apioption series.sunburst
 */

/**
 * @type      {Array<number|null|*>}
 * @extends   series.treemap.data
 * @excluding x, y
 * @product   highcharts
 * @apioption series.sunburst.data
 */

/**
 * @type      {Highcharts.SeriesSunburstDataLabelsOptionsObject|Array<Highcharts.SeriesSunburstDataLabelsOptionsObject>}
 * @product   highcharts
 * @apioption series.sunburst.data.dataLabels
 */

/**
 * The value of the point, resulting in a relative area of the point
 * in the sunburst.
 *
 * @type      {number|null}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.value
 */

/**
 * Use this option to build a tree structure. The value should be the id of the
 * point which is the parent. If no points has a matching id, or this option is
 * undefined, then the parent will be set to the root.
 *
 * @type      {string}
 * @since     6.0.0
 * @product   highcharts
 * @apioption series.sunburst.data.parent
 */

/**
  * Whether to display a slice offset from the center. When a sunburst point is
  * sliced, its children are also offset.
  *
  * @sample highcharts/plotoptions/sunburst-sliced
  *         Sliced sunburst
  *
  * @type      {boolean}
  * @default   false
  * @since     6.0.4
  * @product   highcharts
  * @apioption series.sunburst.data.sliced
  */

''; // detach doclets above

/* *
 *
 *  Default Export
 *
 * */

export default SunburstSeriesDefaults;
