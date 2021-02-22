/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
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

import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type DataExtremesObject from '../../Core/Series/DataExtremesObject';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type {
    TreemapSeriesLayoutAlgorithmValue,
    TreemapSeriesOptions,
    TreemapSeriesUpButtonOptions
} from './TreemapSeriesOptions';
import type { SeriesStateHoverOptions } from '../../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import ColorMapMixin from '../../Mixins/ColorMapSeries.js';
const { colorMapSeriesMixin } = ColorMapMixin;
import H from '../../Core/Globals.js';
const { noop } = H;
import LegendSymbolMixin from '../../Mixins/LegendSymbol.js';
import palette from '../../Core/Color/Palette.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        column: ColumnSeries,
        heatmap: HeatmapSeries,
        scatter: ScatterSeries
    }
} = SeriesRegistry;
import TreemapAlgorithmGroup from './TreemapAlgorithmGroup.js';
import TreemapPoint from './TreemapPoint.js';
import TreemapUtilities from './TreemapUtilities.js';
import TreeSeriesMixin from '../../Mixins/TreeSeries.js';
const {
    getColor,
    getLevelOptions,
    updateRootId
} = TreeSeriesMixin;
import U from '../../Core/Utilities.js';
const {
    addEvent,
    correctFloat,
    defined,
    error,
    extend,
    fireEvent,
    isArray,
    isObject,
    isString,
    merge,
    pick,
    stableSort
} = U;
import './TreemapComposition.js';

/* *
 *
 *  Class
 *
 * */

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.treemap
 *
 * @augments Highcharts.Series
 */
class TreemapSeries extends ScatterSeries {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * A treemap displays hierarchical data using nested rectangles. The data
     * can be laid out in varying ways depending on options.
     *
     * @sample highcharts/demo/treemap-large-dataset/
     *         Treemap
     *
     * @extends      plotOptions.scatter
     * @excluding    dragDrop, marker, jitter, dataSorting
     * @product      highcharts
     * @requires     modules/treemap
     * @optionparent plotOptions.treemap
     */
    static defaultOptions: TreemapSeriesOptions = merge(ScatterSeries.defaultOptions, {

        /**
         * When enabled the user can click on a point which is a parent and
         * zoom in on its children. Deprecated and replaced by
         * [allowTraversingTree](#plotOptions.treemap.allowTraversingTree).
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-allowdrilltonode/
         *         Enabled
         *
         * @deprecated
         * @type      {boolean}
         * @default   false
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.allowDrillToNode
         */

        /**
         * When enabled the user can click on a point which is a parent and
         * zoom in on its children.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-allowtraversingtree/
         *         Enabled
         *
         * @since     7.0.3
         * @product   highcharts
         */
        allowTraversingTree: false,

        animationLimit: 250,
        /**
         * When the series contains less points than the crop threshold, all
         * points are drawn, event if the points fall outside the visible plot
         * area at the current zoom. The advantage of drawing all points
         * (including markers and columns), is that animation is performed on
         * updates. On the other hand, when the series contains more points than
         * the crop threshold, the series data is cropped to only contain points
         * that fall within the plot area. The advantage of cropping away
         * invisible points is to increase performance on large series.
         *
         * @type      {number}
         * @default   300
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.cropThreshold
         */

        /**
         * Fires on a request for change of root node for the tree, before the
         * update is made. An event object is passed to the function, containing
         * additional properties `newRootId`, `previousRootId`, `redraw` and
         * `trigger`.
         *
         * @type {function}
         * @default undefined
         * @sample {highcharts} highcharts/plotoptions/treemap-events-setrootnode/
         *         Alert update information on setRootNode event.
         * @since 7.0.3
         * @product highcharts
         * @apioption plotOptions.treemap.events.setRootNode
         */

        /**
         * This option decides if the user can interact with the parent nodes
         * or just the leaf nodes. When this option is undefined, it will be
         * true by default. However when allowTraversingTree is true, then it
         * will be false by default.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-false/
         *         False
         * @sample {highcharts} highcharts/plotoptions/treemap-interactbyleaf-true-and-allowtraversingtree/
         *         InteractByLeaf and allowTraversingTree is true
         *
         * @type      {boolean}
         * @since     4.1.2
         * @product   highcharts
         * @apioption plotOptions.treemap.interactByLeaf
         */

        /**
         * The sort index of the point inside the treemap level.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-sortindex/
         *         Sort by years
         *
         * @type      {number}
         * @since     4.1.10
         * @product   highcharts
         * @apioption plotOptions.treemap.sortIndex
         */

        /**
         * A series specific or series type specific color set to apply instead
         * of the global [colors](#colors) when
         * [colorByPoint](#plotOptions.treemap.colorByPoint) is true.
         *
         * @type      {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
         * @since     3.0
         * @product   highcharts
         * @apioption plotOptions.treemap.colors
         */

        /**
         * Whether to display this series type or specific series item in the
         * legend.
         */
        showInLegend: false,

        /**
         * @ignore-option
         */
        marker: void 0,

        /**
         * When using automatic point colors pulled from the `options.colors`
         * collection, this option determines whether the chart should receive
         * one color per series or one color per point.
         *
         * @see [series colors](#plotOptions.treemap.colors)
         *
         * @since     2.0
         * @product   highcharts
         * @apioption plotOptions.treemap.colorByPoint
         */
        colorByPoint: false,

        /**
         * @since 4.1.0
         */
        dataLabels: {
            defer: false,
            enabled: true,
            formatter: function (): string {
                var point: TreemapPoint = this && this.point ?
                        this.point :
                        ({} as any),
                    name = isString(point.name) ? point.name : '';

                return name;
            },
            inside: true,
            verticalAlign: 'middle'
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b>: {point.value}<br/>'
        },

        /**
         * Whether to ignore hidden points when the layout algorithm runs.
         * If `false`, hidden points will leave open spaces.
         *
         * @since 5.0.8
         */
        ignoreHiddenPoint: true,

        /**
         * This option decides which algorithm is used for setting position
         * and dimensions of the points.
         *
         * @see [How to write your own algorithm](https://www.highcharts.com/docs/chart-and-series-types/treemap)
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-sliceanddice/
         *         SliceAndDice by default
         * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-stripes/
         *         Stripes
         * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-squarified/
         *         Squarified
         * @sample {highcharts} highcharts/plotoptions/treemap-layoutalgorithm-strip/
         *         Strip
         *
         * @since      4.1.0
         * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
         */
        layoutAlgorithm: 'sliceAndDice',

        /**
         * Defines which direction the layout algorithm will start drawing.
         *
         * @since       4.1.0
         * @validvalue ["vertical", "horizontal"]
         */
        layoutStartingDirection: 'vertical',

        /**
         * Enabling this option will make the treemap alternate the drawing
         * direction between vertical and horizontal. The next levels starting
         * direction will always be the opposite of the previous.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-alternatestartingdirection-true/
         *         Enabled
         *
         * @since 4.1.0
         */
        alternateStartingDirection: false,

        /**
         * Used together with the levels and allowTraversingTree options. When
         * set to false the first level visible to be level one, which is
         * dynamic when traversing the tree. Otherwise the level will be the
         * same as the tree structure.
         *
         * @since 4.1.0
         */
        levelIsConstant: true,
        /**
         * Options for the button appearing when drilling down in a treemap.
         * Deprecated and replaced by
         * [traverseUpButton](#plotOptions.treemap.traverseUpButton).
         *
         * @deprecated
         */
        drillUpButton: {

            /**
             * The position of the button.
             *
             * @deprecated
             */
            position: {

                /**
                 * Vertical alignment of the button.
                 *
                 * @deprecated
                 * @type      {Highcharts.VerticalAlignValue}
                 * @default   top
                 * @product   highcharts
                 * @apioption plotOptions.treemap.drillUpButton.position.verticalAlign
                 */

                /**
                 * Horizontal alignment of the button.
                 *
                 * @deprecated
                 * @type {Highcharts.AlignValue}
                 */
                align: 'right',

                /**
                 * Horizontal offset of the button.
                 *
                 * @deprecated
                 */
                x: -10,

                /**
                 * Vertical offset of the button.
                 *
                 * @deprecated
                 */
                y: 10
            }
        },

        /**
         * Options for the button appearing when traversing down in a treemap.
         */
        traverseUpButton: {

            /**
             * The position of the button.
             */
            position: {

                /**
                 * Vertical alignment of the button.
                 *
                 * @type      {Highcharts.VerticalAlignValue}
                 * @default   top
                 * @product   highcharts
                 * @apioption plotOptions.treemap.traverseUpButton.position.verticalAlign
                 */

                /**
                 * Horizontal alignment of the button.
                 *
                 * @type {Highcharts.AlignValue}
                 */
                align: 'right',

                /**
                 * Horizontal offset of the button.
                 */
                x: -10,

                /**
                 * Vertical offset of the button.
                 */
                y: 10
            }
        },


        /**
         * Set options on specific levels. Takes precedence over series options,
         * but not point options.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-levels/
         *         Styling dataLabels and borders
         * @sample {highcharts} highcharts/demo/treemap-with-levels/
         *         Different layoutAlgorithm
         *
         * @type      {Array<*>}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels
         */

        /**
         * Can set a `borderColor` on all points which lies on the same level.
         *
         * @type      {Highcharts.ColorString}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.borderColor
         */

        /**
         * Set the dash style of the border of all the point which lies on the
         * level. See
         * [plotOptions.scatter.dashStyle](#plotoptions.scatter.dashstyle)
         * for possible options.
         *
         * @type      {Highcharts.DashStyleValue}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.borderDashStyle
         */

        /**
         * Can set the borderWidth on all points which lies on the same level.
         *
         * @type      {number}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.borderWidth
         */

        /**
         * Can set a color on all points which lies on the same level.
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.color
         */

        /**
         * A configuration object to define how the color of a child varies from
         * the parent's color. The variation is distributed among the children
         * of node. For example when setting brightness, the brightness change
         * will range from the parent's original brightness on the first child,
         * to the amount set in the `to` setting on the last node. This allows a
         * gradient-like color scheme that sets children out from each other
         * while highlighting the grouping on treemaps and sectors on sunburst
         * charts.
         *
         * @sample highcharts/demo/sunburst/
         *         Sunburst with color variation
         *
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.colorVariation
         */

        /**
         * The key of a color variation. Currently supports `brightness` only.
         *
         * @type       {string}
         * @since      6.0.0
         * @product    highcharts
         * @validvalue ["brightness"]
         * @apioption  plotOptions.treemap.levels.colorVariation.key
         */

        /**
         * The ending value of a color variation. The last sibling will receive
         * this value.
         *
         * @type      {number}
         * @since     6.0.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.colorVariation.to
         */

        /**
         * Can set the options of dataLabels on each point which lies on the
         * level.
         * [plotOptions.treemap.dataLabels](#plotOptions.treemap.dataLabels) for
         * possible values.
         *
         * @extends   plotOptions.treemap.dataLabels
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.dataLabels
         */

        /**
         * Can set the layoutAlgorithm option on a specific level.
         *
         * @type       {string}
         * @since      4.1.0
         * @product    highcharts
         * @validvalue ["sliceAndDice", "stripes", "squarified", "strip"]
         * @apioption  plotOptions.treemap.levels.layoutAlgorithm
         */

        /**
         * Can set the layoutStartingDirection option on a specific level.
         *
         * @type       {string}
         * @since      4.1.0
         * @product    highcharts
         * @validvalue ["vertical", "horizontal"]
         * @apioption  plotOptions.treemap.levels.layoutStartingDirection
         */

        /**
         * Decides which level takes effect from the options set in the levels
         * object.
         *
         * @sample {highcharts} highcharts/plotoptions/treemap-levels/
         *         Styling of both levels
         *
         * @type      {number}
         * @since     4.1.0
         * @product   highcharts
         * @apioption plotOptions.treemap.levels.level
         */


        // Presentational options

        /**
         * The color of the border surrounding each tree map item.
         *
         * @type {Highcharts.ColorString}
         */
        borderColor: palette.neutralColor10,

        /**
         * The width of the border surrounding each tree map item.
         */
        borderWidth: 1,

        colorKey: 'colorValue',

        /**
         * The opacity of a point in treemap. When a point has children, the
         * visibility of the children is determined by the opacity.
         *
         * @since 4.2.4
         */
        opacity: 0.15,

        /**
         * A wrapper object for all the series options in specific states.
         *
         * @extends plotOptions.heatmap.states
         */
        states: {

            /**
             * Options for the hovered series
             *
             * @extends   plotOptions.heatmap.states.hover
             * @excluding halo
             */
            hover: {

                /**
                 * The border color for the hovered state.
                 */
                borderColor: palette.neutralColor40,

                /**
                 * Brightness for the hovered point. Defaults to 0 if the
                 * heatmap series is loaded first, otherwise 0.1.
                 *
                 * @type    {number}
                 * @default undefined
                 */
                brightness: HeatmapSeries ? 0 : 0.1,

                /**
                 * @extends plotOptions.heatmap.states.hover.halo
                 */
                halo: false,

                /**
                 * The opacity of a point in treemap. When a point has children,
                 * the visibility of the children is determined by the opacity.
                 *
                 * @since 4.2.4
                 */
                opacity: 0.75,

                /**
                 * The shadow option for hovered state.
                 */
                shadow: false
            }
        }
    } as TreemapSeriesOptions);

    /* *
     *
     *  Properties
     *
     * */

    public axisRatio: number = void 0 as any;

    public colorValueData?: Array<number>;

    public colorAxis?: Highcharts.ColorSeries['colorAxis'];

    public data: Array<TreemapPoint> = void 0 as any;

    public drillUpButton?: SVGElement;

    public idPreviousRoot?: string;

    public mapOptionsToLevel: Record<string, TreemapSeriesOptions> = void 0 as any;

    public nodeMap: Record<string, TreemapSeries.NodeObject> = void 0 as any;

    public options: TreemapSeriesOptions = void 0 as any;

    public points: Array<TreemapPoint> = void 0 as any;

    public rootNode: string = void 0 as any;

    public tree: TreemapSeries.NodeObject = void 0 as any;

    /* *
     *
     *  Function
     *
     * */

    /* eslint-disable valid-jsdoc */

    public algorithmCalcPoints(
        directionChange: boolean,
        last: boolean,
        group: TreemapAlgorithmGroup,
        childrenArea: Array<unknown>
    ): void {
        var pX,
            pY,
            pW,
            pH,
            gW = group.lW,
            gH = group.lH,
            plot = group.plot,
            keep: (number|undefined),
            i = 0,
            end = group.elArr.length - 1;

        if (last) {
            gW = group.nW;
            gH = group.nH;
        } else {
            keep = group.elArr[group.elArr.length - 1];
        }
        group.elArr.forEach(function (p: number): void {
            if (last || (i < end)) {
                if (group.direction === 0) {
                    pX = plot.x;
                    pY = plot.y;
                    pW = gW;
                    pH = p / pW;
                } else {
                    pX = plot.x;
                    pY = plot.y;
                    pH = gH;
                    pW = p / pH;
                }
                childrenArea.push({
                    x: pX,
                    y: pY,
                    width: pW,
                    height: correctFloat(pH)
                });
                if (group.direction === 0) {
                    plot.y = plot.y + pH;
                } else {
                    plot.x = plot.x + pW;
                }
            }
            i = i + 1;
        });
        // Reset variables
        group.reset();
        if (group.direction === 0) {
            group.width = group.width - gW;
        } else {
            group.height = group.height - gH;
        }
        plot.y = plot.parent.y + (plot.parent.height - group.height);
        plot.x = plot.parent.x + (plot.parent.width - group.width);
        if (directionChange) {
            group.direction = 1 - group.direction;
        }
        // If not last, then add uncalculated element
        if (!last) {
            group.addElement(keep as any);
        }
    }

    public algorithmFill(
        directionChange: boolean,
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        var childrenArea: Array<unknown> = [],
            pTot,
            direction = parent.direction,
            x = parent.x,
            y = parent.y,
            width = parent.width,
            height = parent.height,
            pX,
            pY,
            pW,
            pH;

        children.forEach(function (
            child: TreemapSeries.NodeObject
        ): void {
            pTot =
                (parent.width * parent.height) * (child.val / parent.val);
            pX = x;
            pY = y;
            if (direction === 0) {
                pH = height;
                pW = pTot / pH;
                width = width - pW;
                x = x + pW;
            } else {
                pW = width;
                pH = pTot / pW;
                height = height - pH;
                y = y + pH;
            }
            childrenArea.push({
                x: pX,
                y: pY,
                width: pW,
                height: pH
            });
            if (directionChange) {
                direction = 1 - direction;
            }
        });
        return childrenArea;
    }

    public algorithmLowAspectRatio(
        directionChange: boolean,
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        var childrenArea: Array<unknown> = [],
            series = this,
            pTot,
            plot: TreemapAlgorithmGroup.PlotObject = {
                x: parent.x,
                y: parent.y,
                parent: parent
            },
            direction = parent.direction,
            i = 0,
            end = children.length - 1,
            group = new TreemapAlgorithmGroup(
                parent.height,
                parent.width,
                direction,
                plot
            );

        // Loop through and calculate all areas
        children.forEach(function (
            child: TreemapSeries.NodeObject
        ): void {
            pTot =
                (parent.width * parent.height) * (child.val / parent.val);
            group.addElement(pTot);
            if (group.lP.nR > group.lP.lR) {
                (series.algorithmCalcPoints as any)(
                    directionChange,
                    false,
                    group,
                    childrenArea,
                    plot // @todo no supported
                );
            }
            // If last child, then calculate all remaining areas
            if (i === end) {
                (series.algorithmCalcPoints as any)(
                    directionChange,
                    true,
                    group,
                    childrenArea,
                    plot // @todo not supported
                );
            }
            i = i + 1;
        });
        return childrenArea;
    }

    /**
     * Over the alignment method by setting z index.
     * @private
     */
    public alignDataLabel(
        point: TreemapPoint,
        dataLabel: SVGElement,
        labelOptions: DataLabelOptions
    ): void {
        var style = labelOptions.style;

        // #8160: Prevent the label from exceeding the point's
        // boundaries in treemaps by applying ellipsis overflow.
        // The issue was happening when datalabel's text contained a
        // long sequence of characters without a whitespace.
        if (
            style &&
            !defined(style.textOverflow) &&
            dataLabel.text &&
            dataLabel.getBBox().width > dataLabel.text.textWidth
        ) {
            dataLabel.css({
                textOverflow: 'ellipsis',
                // unit (px) is required when useHTML is true
                width: style.width += 'px'
            });
        }
        ColumnSeries.prototype.alignDataLabel.apply(this, arguments);
        if (point.dataLabel) {
        // point.node.zIndex could be undefined (#6956)
            point.dataLabel.attr({ zIndex: (point.node.zIndex || 0) + 1 });
        }
    }

    public buildNode(
        id: string,
        i: number,
        level: number,
        list: TreemapSeries.ListOfParentsObject,
        parent?: string
    ): TreemapSeries.NodeObject {
        var series = this,
            children: Array<TreemapSeries.NodeObject> = [],
            point = series.points[i],
            height = 0,
            node: TreemapSeries.NodeObject,
            child: TreemapSeries.NodeObject;

        // Actions
        ((list[id] || [])).forEach(function (i: number): void {
            child = series.buildNode(
                series.points[i].id,
                i,
                (level + 1),
                list,
                id
            );
            height = Math.max(child.height + 1, height);
            children.push(child);
        });
        node = {
            id,
            i,
            children,
            height,
            level,
            parent,
            visible: false // @todo move this to better location
        } as any;
        series.nodeMap[node.id] = node;
        if (point) {
            point.node = node;
        }
        return node;
    }

    /**
     * Recursive function which calculates the area for all children of a
     * node.
     *
     * @private
     * @function Highcharts.Series#calculateChildrenAreas
     *
     * @param {object} node
     *        The node which is parent to the children.
     *
     * @param {object} area
     *        The rectangular area of the parent.
     */
    public calculateChildrenAreas(
        parent: TreemapSeries.NodeObject,
        area: TreemapSeries.AreaObject
    ): void {
        var series = this,
            options = series.options,
            mapOptionsToLevel = series.mapOptionsToLevel,
            level = mapOptionsToLevel[parent.level + 1],
            algorithm = pick<TreemapSeriesLayoutAlgorithmValue|undefined, TreemapSeriesLayoutAlgorithmValue>(
                (
                    (series as any)[
                        (level && level.layoutAlgorithm) as any
                    ] &&
                    level.layoutAlgorithm
                ),
                options.layoutAlgorithm as any
            ),
            alternate = options.alternateStartingDirection,
            childrenValues: Array<TreemapSeries.NodeValuesObject> = [],
            children;

        // Collect all children which should be included
        children = parent.children.filter(function (
            n: TreemapSeries.NodeObject
        ): boolean {
            return !n.ignore;
        });

        if (level && level.layoutStartingDirection) {
            area.direction = level.layoutStartingDirection === 'vertical' ?
                0 :
                1;
        }
        childrenValues = series[algorithm](area as any, children) as any;
        children.forEach(function (
            child: TreemapSeries.NodeObject,
            index: number
        ): void {
            var values: TreemapSeries.NodeValuesObject =
                childrenValues[index];

            child.values = merge(values, {
                val: child.childrenTotal,
                direction: (alternate ? 1 - area.direction : area.direction)
            });
            child.pointValues = merge(values, {
                x: (values.x / series.axisRatio),
                // Flip y-values to avoid visual regression with csvCoord in
                // Axis.translate at setPointValues. #12488
                y: TreemapUtilities.AXIS_MAX - values.y - values.height,
                width: (values.width / series.axisRatio)
            } as TreemapSeries.NodeValuesObject);
            // If node has children, then call method recursively
            if (child.children.length) {
                series.calculateChildrenAreas(child, child.values);
            }
        });
    }

    /**
     * Extend drawDataLabels with logic to handle custom options related to
     * the treemap series:
     *
     * - Points which is not a leaf node, has dataLabels disabled by
     *   default.
     *
     * - Options set on series.levels is merged in.
     *
     * - Width of the dataLabel is set to match the width of the point
     *   shape.
     *
     * @private
     */
    public drawDataLabels(): void {
        var series = this,
            mapOptionsToLevel = series.mapOptionsToLevel,
            points = series.points.filter(function (
                n: TreemapPoint
            ): boolean {
                return n.node.visible;
            }),
            options: DataLabelOptions,
            level: TreemapSeriesOptions;

        points.forEach(function (point): void {
            level = mapOptionsToLevel[point.node.level];
            // Set options to new object to avoid problems with scope
            options = { style: {} };

            // If not a leaf, then label should be disabled as default
            if (!point.node.isLeaf) {
                options.enabled = false;
            }

            // If options for level exists, include them as well
            if (level && level.dataLabels) {
                options = merge(options, level.dataLabels);
                series._hasPointLabels = true;
            }

            // Set dataLabel width to the width of the point shape.
            if (point.shapeArgs) {
                (options.style as any).width = point.shapeArgs.width;
                if (point.dataLabel) {
                    point.dataLabel.css({
                        width: point.shapeArgs.width + 'px'
                    });
                }
            }

            // Merge custom options with point options
            point.dlOptions = merge(options, point.options.dataLabels);
        });
        Series.prototype.drawDataLabels.call(this);
    }

    /**
     * Override drawPoints
     * @private
     */
    public drawPoints(): void {
        var series = this,
            chart = series.chart,
            renderer = chart.renderer,
            points = series.points,
            styledMode = chart.styledMode,
            options = series.options,
            shadow = styledMode ? {} : options.shadow,
            borderRadius = options.borderRadius,
            withinAnimationLimit =
                chart.pointCount < (options.animationLimit as any),
            allowTraversingTree = options.allowTraversingTree;

        points.forEach(function (point): void {
            var levelDynamic = point.node.levelDynamic,
                animatableAttribs: SVGAttributes = {},
                attribs: SVGAttributes = {},
                css: CSSObject = {},
                groupKey = 'level-group-' + point.node.level,
                hasGraphic = !!point.graphic,
                shouldAnimate = withinAnimationLimit && hasGraphic,
                shapeArgs = point.shapeArgs;

            // Don't bother with calculate styling if the point is not drawn
            if (point.shouldDraw()) {
                if (borderRadius) {
                    attribs.r = borderRadius;
                }

                merge(
                    true, // Extend object
                    // Which object to extend
                    shouldAnimate ? animatableAttribs : attribs,
                    // Add shapeArgs to animate/attr if graphic exists
                    hasGraphic ? shapeArgs : {},
                    // Add style attribs if !styleMode
                    styledMode ?
                        {} :
                        series.pointAttribs(
                            point, point.selected ? 'select' : void 0
                        )
                );

                // In styled mode apply point.color. Use CSS, otherwise the
                // fill used in the style sheet will take precedence over
                // the fill attribute.
                if (series.colorAttribs && styledMode) {
                    // Heatmap is loaded
                    extend(css, series.colorAttribs(point as any));
                }

                if (!(series as any)[groupKey]) {
                    (series as any)[groupKey] = renderer.g(groupKey)
                        .attr({
                            // @todo Set the zIndex based upon the number of
                            // levels, instead of using 1000
                            zIndex: 1000 - (levelDynamic || 0)
                        })
                        .add(series.group);
                    (series as any)[groupKey].survive = true;
                }
            }

            // Draw the point
            point.draw({
                animatableAttribs,
                attribs,
                css,
                group: (series as any)[groupKey],
                renderer,
                shadow,
                shapeArgs,
                shapeType: 'rect'
            });

            // If setRootNode is allowed, set a point cursor on clickables &
            // add drillId to point
            if (allowTraversingTree && point.graphic) {
                point.drillId = options.interactByLeaf ?
                    series.drillToByLeaf(point) :
                    series.drillToByGroup(point);
            }
        });
    }

    /**
     * Finds the drill id for a parent node. Returns false if point should
     * not have a click event.
     * @private
     */
    public drillToByGroup(point: TreemapPoint): (boolean|string) {
        var series = this,
            drillId: (boolean|string) = false;

        if ((point.node.level - series.nodeMap[series.rootNode].level) ===
            1 &&
            !point.node.isLeaf
        ) {
            drillId = point.id;
        }
        return drillId;
    }

    /**
     * Finds the drill id for a leaf node. Returns false if point should not
     * have a click event
     * @private
     */
    public drillToByLeaf(point: TreemapPoint): (boolean|string) {
        var series = this,
            drillId: (boolean|string) = false,
            nodeParent: TreemapSeries.NodeObject;

        if ((point.node.parent !== series.rootNode) &&
            point.node.isLeaf
        ) {
            nodeParent = point.node;
            while (!drillId) {
                nodeParent = series.nodeMap[nodeParent.parent as any];
                if (nodeParent.parent === series.rootNode) {
                    drillId = nodeParent.id;
                }
            }
        }
        return drillId;
    }

    /**
     * @todo remove this function at a suitable version.
     * @private
     */
    public drillToNode(
        id: string,
        redraw?: boolean
    ): void {
        error(32, false, void 0, { 'treemap.drillToNode': 'use treemap.setRootNode' });
        this.setRootNode(id, redraw);
    }

    public drillUp(): void {
        var series = this,
            node = series.nodeMap[series.rootNode];

        if (node && isString(node.parent)) {
            series.setRootNode(
                node.parent,
                true,
                { trigger: 'traverseUpButton' }
            );
        }
    }

    public getExtremes(): DataExtremesObject {
        // Get the extremes from the value data
        const { dataMin, dataMax } = Series.prototype.getExtremes
            .call(this, this.colorValueData);
        this.valueMin = dataMin;
        this.valueMax = dataMax;

        // Get the extremes from the y data
        return Series.prototype.getExtremes.call(this);
    }

    /**
     * Creates an object map from parent id to childrens index.
     *
     * @private
     * @function Highcharts.Series#getListOfParents
     *
     * @param {Highcharts.SeriesTreemapDataOptions} [data]
     *        List of points set in options.
     *
     * @param {Array<string>} [existingIds]
     *        List of all point ids.
     *
     * @return {object}
     *         Map from parent id to children index in data.
     */
    public getListOfParents(
        data: Array<TreemapPoint>,
        existingIds: Array<string>
    ): TreemapSeries.ListOfParentsObject {
        var arr = isArray(data) ? data : [],
            ids = isArray(existingIds) ? existingIds : [],
            listOfParents = arr.reduce(function (
                prev: TreemapSeries.ListOfParentsObject,
                curr: TreemapPoint,
                i: number
            ): TreemapSeries.ListOfParentsObject {
                var parent = pick(curr.parent, '');

                if (typeof prev[parent] === 'undefined') {
                    prev[parent] = [];
                }
                prev[parent].push(i);
                return prev;
            }, {
                '': [] // Root of tree
            });

        // If parent does not exist, hoist parent to root of tree.
        TreemapUtilities.eachObject(listOfParents, function (
            children: Array<number>,
            parent: string,
            list: TreemapSeries.ListOfParentsObject
        ): void {
            if ((parent !== '') && (ids.indexOf(parent) === -1)) {
                children.forEach(function (child): void {
                    list[''].push(child);
                });
                delete list[parent];
            }
        });
        return listOfParents;
    }

    /**
     * Creates a tree structured object from the series points.
     * @private
     */
    public getTree(): this['tree'] {
        var series = this,
            allIds = this.data.map(function (
                d: TreemapPoint
            ): string {
                return d.id;
            }),
            parentList = series.getListOfParents(this.data, allIds);

        series.nodeMap = {};
        return series.buildNode('', -1, 0, parentList);
    }

    /**
     * Define hasData function for non-cartesian series. Returns true if the
     * series has points at all.
     * @private
     */
    public hasData(): boolean {
        return !!this.processedXData.length; // != 0
    }

    public init(
        chart: Chart,
        options: DeepPartial<TreemapSeriesOptions>
    ): void {
        var series = this,
            setOptionsEvent;

        // If color series logic is loaded, add some properties
        if (colorMapSeriesMixin) {
            this.colorAttribs = colorMapSeriesMixin.colorAttribs;
        }

        setOptionsEvent = addEvent(series, 'setOptions', function (
            event: { userOptions: TreemapSeriesOptions }
        ): void {
            var options = event.userOptions;

            if (
                defined(options.allowDrillToNode) &&
                !defined(options.allowTraversingTree)
            ) {
                options.allowTraversingTree = options.allowDrillToNode;
                delete options.allowDrillToNode;
            }

            if (
                defined(options.drillUpButton) &&
                !defined(options.traverseUpButton)
            ) {
                options.traverseUpButton = options.drillUpButton;
                delete options.drillUpButton;
            }
        });

        Series.prototype.init.call(series, chart, options);

        // Treemap's opacity is a different option from other series
        delete series.opacity;

        // Handle deprecated options.
        series.eventsToUnbind.push(setOptionsEvent);

        if (series.options.allowTraversingTree) {
            series.eventsToUnbind.push(
                addEvent(series, 'click', series.onClickDrillToNode as any)
            );
        }
    }

    /**
     * Add drilling on the suitable points.
     * @private
     */
    public onClickDrillToNode(event: { point: TreemapPoint }): void {
        var series = this,
            point = event.point,
            drillId = point && point.drillId;

        // If a drill id is returned, add click event and cursor.
        if (isString(drillId)) {
            point.setState(''); // Remove hover
            series.setRootNode(drillId, true, { trigger: 'click' });
        }
    }

    /**
     * Get presentational attributes
     * @private
     */
    public pointAttribs(
        point: TreemapPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        var series = this,
            mapOptionsToLevel = (
                isObject(series.mapOptionsToLevel) ?
                    series.mapOptionsToLevel :
                    {}
            ),
            level = point && mapOptionsToLevel[point.node.level] || {},
            options = this.options,
            attr: SVGAttributes,
            stateOptions: SeriesStateHoverOptions =
                (state && (options.states as any)[state]) || {},
            className = (point && point.getClassName()) || '',
            opacity: number;

        // Set attributes by precedence. Point trumps level trumps series.
        // Stroke width uses pick because it can be 0.
        attr = {
            'stroke':
            (point && (point as any).borderColor) ||
            level.borderColor ||
            stateOptions.borderColor ||
            options.borderColor,
            'stroke-width': pick(
                point && (point as any).borderWidth,
                level.borderWidth,
                stateOptions.borderWidth,
                options.borderWidth
            ),
            'dashstyle':
            (point && (point as any).borderDashStyle) ||
            level.borderDashStyle ||
            stateOptions.borderDashStyle ||
            options.borderDashStyle,
            'fill': (point && point.color) || this.color
        };

        // Hide levels above the current view
        if (className.indexOf('highcharts-above-level') !== -1) {
            attr.fill = 'none';
            attr['stroke-width'] = 0;

            // Nodes with children that accept interaction
        } else if (
            className.indexOf('highcharts-internal-node-interactive') !== -1
        ) {
            opacity = pick(stateOptions.opacity, options.opacity as any);
            attr.fill = color(attr.fill).setOpacity(opacity).get();
            attr.cursor = 'pointer';
            // Hide nodes that have children
        } else if (className.indexOf('highcharts-internal-node') !== -1) {
            attr.fill = 'none';

        } else if (state) {
        // Brighten and hoist the hover nodes
            attr.fill = color(attr.fill)
                .brighten(stateOptions.brightness as any)
                .get();
        }
        return attr;
    }

    public renderTraverseUpButton(rootId: string): void {
        var series = this,
            nodeMap = series.nodeMap,
            node = nodeMap[rootId],
            name = node.name,
            buttonOptions: TreemapSeriesUpButtonOptions = series.options.traverseUpButton as any,
            backText = pick(buttonOptions.text, name, '◁ Back'),
            attr,
            states;

        if (rootId === '' || (
            series.is('sunburst') &&
            series.tree.children.length === 1 &&
            rootId === series.tree.children[0].id
        )) {
            if (series.drillUpButton) {
                series.drillUpButton = series.drillUpButton.destroy();
            }
        } else if (!this.drillUpButton) {
            attr = buttonOptions.theme;
            states = attr && attr.states;

            this.drillUpButton = this.chart.renderer
                .button(
                    backText,
                    0,
                    0,
                    function (): void {
                        series.drillUp();
                    },
                    attr,
                    states && states.hover,
                    states && states.select
                )
                .addClass('highcharts-drillup-button')
                .attr({
                    align: (buttonOptions.position as any).align,
                    zIndex: 7
                })
                .add()
                .align(
                    buttonOptions.position,
                    false,
                    buttonOptions.relativeTo || 'plotBox'
                );
        } else {
            this.drillUpButton.placed = false;
            this.drillUpButton.attr({
                text: backText
            })
                .align();
        }
    }

    /**
     * Set the node's color recursively, from the parent down.
     * @private
     */
    public setColorRecursive(
        node: TreemapSeries.NodeObject,
        parentColor?: ColorType,
        colorIndex?: number,
        index?: number,
        siblings?: unknown
    ): void {
        var series = this,
            chart = series && series.chart,
            colors = chart && chart.options && chart.options.colors,
            colorInfo: Highcharts.TreeColorObject,
            point: (TreemapPoint|undefined);

        if (node) {
            colorInfo = getColor(node, {
                colors: colors,
                index: index,
                mapOptionsToLevel: series.mapOptionsToLevel,
                parentColor: parentColor,
                parentColorIndex: colorIndex,
                series: series,
                siblings: siblings
            });

            point = series.points[node.i];
            if (point) {
                point.color = colorInfo.color;
                point.colorIndex = colorInfo.colorIndex;
            }

            // Do it all again with the children
            (node.children || []).forEach(function (
                child: TreemapSeries.NodeObject,
                i: number
            ): void {
                series.setColorRecursive(
                    child,
                    colorInfo.color,
                    colorInfo.colorIndex,
                    i,
                    node.children.length
                );
            });
        }
    }

    public setPointValues(): void {
        const series = this;
        const { points, xAxis, yAxis } = series;
        const styledMode = series.chart.styledMode;

        // Get the crisp correction in classic mode. For this to work in
        // styled mode, we would need to first add the shape (without x,
        // y, width and height), then read the rendered stroke width
        // using point.graphic.strokeWidth(), then modify and apply the
        // shapeArgs. This applies also to column series, but the
        // downside is performance and code complexity.
        const getCrispCorrection = (point: TreemapPoint): number => (
            styledMode ?
                0 :
                ((series.pointAttribs(point)['stroke-width'] || 0) % 2) / 2
        );

        points.forEach(function (point: TreemapPoint): void {
            const { pointValues: values, visible } = point.node;

            // Points which is ignored, have no values.
            if (values && visible) {
                const { height, width, x, y } = values;
                const crispCorr = getCrispCorrection(point);
                const x1 = Math.round(xAxis.toPixels(x, true)) - crispCorr;
                const x2 = Math.round(xAxis.toPixels(x + width, true)) - crispCorr;
                const y1 = Math.round(yAxis.toPixels(y, true)) - crispCorr;
                const y2 = Math.round(yAxis.toPixels(y + height, true)) - crispCorr;

                // Set point values
                const shapeArgs = {
                    x: Math.min(x1, x2),
                    y: Math.min(y1, y2),
                    width: Math.abs(x2 - x1),
                    height: Math.abs(y2 - y1)
                };
                point.plotX = shapeArgs.x + (shapeArgs.width / 2);
                point.plotY = shapeArgs.y + (shapeArgs.height / 2);

                point.shapeArgs = shapeArgs;
            } else {
            // Reset visibility
                delete point.plotX;
                delete point.plotY;
            }
        });
    }

    /**
     * Sets a new root node for the series.
     *
     * @private
     * @function Highcharts.Series#setRootNode
     *
     * @param {string} id
     * The id of the new root node.
     *
     * @param {boolean} [redraw=true]
     * Wether to redraw the chart or not.
     *
     * @param {object} [eventArguments]
     * Arguments to be accessed in event handler.
     *
     * @param {string} [eventArguments.newRootId]
     * Id of the new root.
     *
     * @param {string} [eventArguments.previousRootId]
     * Id of the previous root.
     *
     * @param {boolean} [eventArguments.redraw]
     * Wether to redraw the chart after.
     *
     * @param {object} [eventArguments.series]
     * The series to update the root of.
     *
     * @param {string} [eventArguments.trigger]
     * The action which triggered the event. Undefined if the setRootNode is
     * called directly.
     *
     * @fires Highcharts.Series#event:setRootNode
     */
    public setRootNode(
        id: string,
        redraw?: boolean,
        eventArguments?: TreemapSeries.SetRootNodeObject
    ): void {
        var series = this,
            eventArgs: TreemapSeries.SetRootNodeObject =
                extend<TreemapSeries.SetRootNodeObject>({
                    newRootId: id,
                    previousRootId: series.rootNode,
                    redraw: pick(redraw, true),
                    series: series
                }, eventArguments as any);

        /**
         * The default functionality of the setRootNode event.
         *
         * @private
         * @param {object} args The event arguments.
         * @param {string} args.newRootId Id of the new root.
         * @param {string} args.previousRootId Id of the previous root.
         * @param {boolean} args.redraw Wether to redraw the chart after.
         * @param {object} args.series The series to update the root of.
         * @param {string} [args.trigger=undefined] The action which
         * triggered the event. Undefined if the setRootNode is called
         * directly.
         * @return {void}
         */
        var defaultFn = function (
            args: {
                newRootId: string;
                previousRootId: string;
                redraw: boolean;
                series: TreemapSeries;
                trigger?: string;
            }
        ): void {
            var series = args.series;

            // Store previous and new root ids on the series.
            series.idPreviousRoot = args.previousRootId;
            series.rootNode = args.newRootId;

            // Redraw the chart
            series.isDirty = true; // Force redraw
            if (args.redraw) {
                series.chart.redraw();
            }
        };

        // Fire setRootNode event.
        fireEvent(series, 'setRootNode', eventArgs, defaultFn);
    }

    /**
     * Workaround for `inactive` state. Since `series.opacity` option is
     * already reserved, don't use that state at all by disabling
     * `inactiveOtherPoints` and not inheriting states by points.
     * @private
     */
    public setState(state: StatesOptionsKey): void {
        this.options.inactiveOtherPoints = true;
        Series.prototype.setState.call(this, state, false);
        this.options.inactiveOtherPoints = false;
    }

    public setTreeValues(tree: TreemapSeries.NodeObject): TreemapSeries.NodeObject {
        var series = this,
            options = series.options,
            idRoot = series.rootNode,
            mapIdToNode = series.nodeMap,
            nodeRoot = mapIdToNode[idRoot],
            levelIsConstant = (
                TreemapUtilities.isBoolean(options.levelIsConstant) ?
                    options.levelIsConstant :
                    true
            ),
            childrenTotal = 0,
            children: Array<TreemapSeries.NodeObject> = [],
            val,
            point = series.points[tree.i];

        // First give the children some values
        tree.children.forEach(function (
            child: TreemapSeries.NodeObject
        ): void {
            child = series.setTreeValues(child);
            children.push(child);
            if (!child.ignore) {
                childrenTotal += child.val as any;
            }
        });
        // Sort the children
        stableSort(children, function (
            a: TreemapSeries.NodeObject,
            b: TreemapSeries.NodeObject
        ): number {
            return (a.sortIndex || 0) - (b.sortIndex || 0);
        });
        // Set the values
        val = pick(point && point.options.value, childrenTotal);
        if (point) {
            point.value = val;
        }
        extend(tree, {
            children: children,
            childrenTotal: childrenTotal,
            // Ignore this node if point is not visible
            ignore: !(pick(point && point.visible, true) && (val > 0)),
            isLeaf: tree.visible && !childrenTotal,
            levelDynamic: (
                tree.level - (levelIsConstant ? 0 : nodeRoot.level)
            ),
            name: pick(point && point.name, ''),
            sortIndex: pick(point && point.sortIndex, -val),
            val: val
        });
        return tree;
    }

    public sliceAndDice(
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        return this.algorithmFill(true, parent, children);
    }

    public squarified(
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        return this.algorithmLowAspectRatio(true, parent, children);
    }

    public strip(
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        return this.algorithmLowAspectRatio(false, parent, children);
    }

    public stripes(
        parent: TreemapSeries.NodeValuesObject,
        children: Array<TreemapSeries.NodeObject>
    ): Array<unknown> {
        return this.algorithmFill(false, parent, children);
    }

    public translate(): void {
        var series = this,
            options = series.options,
            // NOTE: updateRootId modifies series.
            rootId = updateRootId(series),
            rootNode,
            pointValues,
            seriesArea,
            tree: TreemapSeries.NodeObject,
            val: TreemapSeries.NodeValuesObject;

        // Call prototype function
        Series.prototype.translate.call(series);

        // @todo Only if series.isDirtyData is true
        tree = series.tree = series.getTree();
        rootNode = series.nodeMap[rootId];

        if (
            rootId !== '' &&
            (!rootNode || !rootNode.children.length)
        ) {
            series.setRootNode('', false);
            rootId = series.rootNode;
            rootNode = series.nodeMap[rootId];
        }

        series.renderTraverseUpButton(rootId);
        series.mapOptionsToLevel = getLevelOptions<this>({
            from: rootNode.level + 1,
            levels: options.levels,
            to: tree.height,
            defaults: {
                levelIsConstant: series.options.levelIsConstant,
                colorByPoint: options.colorByPoint
            }
        }) as any;

        // Parents of the root node is by default visible
        TreemapUtilities.recursive(series.nodeMap[series.rootNode], function (
            node: TreemapSeries.NodeObject
        ): (boolean|TreemapSeries.NodeObject) {
            var next: (boolean|TreemapSeries.NodeObject) = false,
                p = node.parent;

            node.visible = true;
            if (p || p === '') {
                next = series.nodeMap[p];
            }
            return next;
        });
        // Children of the root node is by default visible
        TreemapUtilities.recursive(
            series.nodeMap[series.rootNode].children,
            function (
                children: Array<TreemapSeries.NodeObject>
            ): (boolean|Array<TreemapSeries.NodeObject>) {
                var next: (boolean|Array<TreemapSeries.NodeObject>) =
                        false;

                children.forEach(function (
                    child: TreemapSeries.NodeObject
                ): void {
                    child.visible = true;
                    if (child.children.length) {
                        next = ((next as any) || []).concat(child.children);
                    }
                });
                return next;
            }
        );
        series.setTreeValues(tree);

        // Calculate plotting values.
        series.axisRatio = (series.xAxis.len / series.yAxis.len);
        series.nodeMap[''].pointValues = pointValues = {
            x: 0,
            y: 0,
            width: TreemapUtilities.AXIS_MAX,
            height: TreemapUtilities.AXIS_MAX
        } as any;
        series.nodeMap[''].values = seriesArea = merge(pointValues, {
            width: (pointValues.width * series.axisRatio),
            direction: (
                options.layoutStartingDirection === 'vertical' ? 0 : 1
            ),
            val: tree.val
        });
        series.calculateChildrenAreas(tree, seriesArea);

        // Logic for point colors
        if (
            !series.colorAxis &&
            !options.colorByPoint
        ) {
            series.setColorRecursive(series.tree);
        }

        // Update axis extremes according to the root node.
        if (options.allowTraversingTree) {
            val = rootNode.pointValues as any;
            series.xAxis.setExtremes(val.x, val.x + val.width, false);
            series.yAxis.setExtremes(val.y, val.y + val.height, false);
            series.xAxis.setScale();
            series.yAxis.setScale();
        }

        // Assign values to points.
        series.setPointValues();
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Prototype Properties
 *
 * */

interface TreemapSeries extends Highcharts.TreeSeries {
    colorAttribs: Highcharts.ColorMapSeriesMixin['colorAttribs'];
    colorKey: string;
    directTouch: boolean;
    getExtremesFromAll: boolean;
    optionalAxis: string;
    parallelArrays: Array<string>;
    pointArrayMap: Array<string>;
    pointClass: typeof TreemapPoint;
    trackerGroups: Array<string>;
    utils: {
        recursive: typeof TreemapUtilities.recursive;
    };
}
extend(TreemapSeries.prototype, {
    buildKDTree: noop as any,
    colorKey: 'colorValue', // Point color option key
    directTouch: true,
    drawLegendSymbol: LegendSymbolMixin.drawRectangle,
    getExtremesFromAll: true,
    getSymbol: noop as any,
    optionalAxis: 'colorAxis',
    parallelArrays: ['x', 'y', 'value', 'colorValue'],
    pointArrayMap: ['value'],
    pointClass: TreemapPoint,
    trackerGroups: ['group', 'dataLabelsGroup'],
    utils: {
        recursive: TreemapUtilities.recursive
    }
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace TreemapSeries {
    export interface AreaObject {
        direction: number;
    }
    export type ListOfParentsObject = Record<string, Array<number>>;
    export interface NodeObject extends Highcharts.TreeNodeObject {
        children: Array<NodeObject>;
        childrenTotal?: number;
        height: number;
        ignore?: boolean;
        isLeaf?: boolean;
        levelDynamic?: number;
        name?: string;
        parent?: string;
        pointValues?: NodeValuesObject;
        sortIndex?: number;
        val: number;
        values?: NodeValuesObject;
        zIndex?: number;
    }
    export interface NodeValuesObject extends BBoxObject {
        direction: number;
        val: number;
    }
    export interface SetRootNodeObject {
        newRootId?: string;
        previousRootId?: string;
        redraw?: boolean;
        series?: object;
        trigger?: string;
    }
}

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        treemap: typeof TreemapSeries;
    }
}
SeriesRegistry.registerSeriesType('treemap', TreemapSeries);

/* *
 *
 *  Default Export
 *
 * */

export default TreemapSeries;

/* *
 *
 *  API Options
 *
 * */

/**
 * A `treemap` series. If the [type](#series.treemap.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.treemap
 * @excluding dataParser, dataURL, stack, dataSorting
 * @product   highcharts
 * @requires  modules/treemap
 * @apioption series.treemap
 */

/**
 * An array of data points for the series. For the `treemap` series
 * type, points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `value` options. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.treemap.turboThreshold),
 *    this option is not available.
 *    ```js
 *      data: [{
 *        value: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *      }, {
 *        value: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *      }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|null|*>}
 * @extends   series.heatmap.data
 * @excluding x, y
 * @product   highcharts
 * @apioption series.treemap.data
 */

/**
 * The value of the point, resulting in a relative area of the point
 * in the treemap.
 *
 * @type      {number|null}
 * @product   highcharts
 * @apioption series.treemap.data.value
 */

/**
 * Serves a purpose only if a `colorAxis` object is defined in the chart
 * options. This value will decide which color the point gets from the
 * scale of the colorAxis.
 *
 * @type      {number}
 * @since     4.1.0
 * @product   highcharts
 * @apioption series.treemap.data.colorValue
 */

/**
 * Only for treemap. Use this option to build a tree structure. The
 * value should be the id of the point which is the parent. If no points
 * has a matching id, or this option is undefined, then the parent will
 * be set to the root.
 *
 * @sample {highcharts} highcharts/point/parent/
 *         Point parent
 * @sample {highcharts} highcharts/demo/treemap-with-levels/
 *         Example where parent id is not matching
 *
 * @type      {string}
 * @since     4.1.0
 * @product   highcharts
 * @apioption series.treemap.data.parent
 */

''; // adds doclets above to transpiled file
