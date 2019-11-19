/* *
 *
 *  This module implements sunburst charts in Highcharts.
 *
 *  (c) 2016-2019 Highsoft AS
 *
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        class SunburstPoint extends TreemapPoint {
            public innerArcLength?: number;
            public outerArcLength?: number;
            public node: SunburstNodeObject;
            public options: SunburstPointOptions;
            public series: SunburstSeries;
            public shapeExisting: SunburstNodeValuesObject;
            public sliced?: boolean;
        }
        class SunburstSeries extends TreemapSeries {
            public center: Array<number>;
            public data: Array<SunburstPoint>;
            public mapOptionsToLevel: Dictionary<SunburstSeriesOptions>;
            public nodeMap: Dictionary<SunburstNodeObject>;
            public options: SunburstSeriesOptions;
            public pointAttribs: ColumnSeries['pointAttribs'];
            public pointClass: typeof SunburstPoint;
            public points: Array<SunburstPoint>;
            public shapeRoot?: SunburstNodeValuesObject;
            public startAndEndRadians: RadianAngles;
            public tree: SunburstNodeObject;
            public utils: SunburstSeriesUtilsObject;
            public drawPoints(): void;
            public layoutAlgorithm(
                parent: SunburstNodeValuesObject,
                children: Array<SunburstNodeObject>,
                options: SunburstSeriesOptions
            ): Array<SunburstNodeValuesObject>;
            public setShapeArgs(
                parent: SunburstNodeObject,
                parentValues: SunburstNodeValuesObject,
                mapOptionsToLevel: Dictionary<SunburstSeriesOptions>
            ): void;
            public translate(): void;
        }
        interface SeriesTypesDictionary {
            sunburst: typeof SunburstSeries;
        }
        interface SunburstAnimationParams {
            center: PositionObject;
            idPreviousRoot?: string;
            idRoot: string;
            innerR: number;
            point: SunburstPoint;
            radians: RadianAngles;
            shapeExisting: SunburstNodeValuesObject;
            shapePreviousRoot?: SunburstNodeValuesObject;
            shapeRoot?: SunburstNodeValuesObject;
            visible: boolean;
        }
        interface SunburstDataLabelsOptionsObject
            extends DataLabelsOptionsObject {
            allowOverlap?: boolean;
            rotationMode?: SunburstDataLabelsRotationValue;
        }
        interface SunburstDlOptionsParams {
            level: SunburstSeriesOptions;
            optionsPoint: SunburstPointOptions;
            point: SunburstPoint;
            shapeArgs: SunburstNodeValuesObject;
        }
        interface SunburstNodeObject extends TreemapNodeObject {
            children: Array<SunburstNodeObject>;
            childrenTotal: number;
            color: ColorType;
            colorIndex: number;
            height: number;
            parent: string;
            shapeArgs?: SunburstNodeValuesObject;
            sliced?: boolean;
            val: number;
            values?: SunburstNodeValuesObject;
        }
        interface SunburstNodeValuesObject
            extends
            RadianAngles,
            TreemapNodeValuesObject,
            TreeValuesOptionsObject<SunburstSeries>
        {
            color: ColorType;
            mapOptionsToLevel: SunburstSeriesOptions['levels'];
            index: number;
            innerR: number;
            r: number;
            radius: number;
            siblings: number;
        }
        interface SunburstPointOptions extends TreemapPointOptions {
        }
        interface SunburstSeriesLevelsColorVariationOptions
            extends
            TreemapSeriesLevelsColorVariationOptions
        {
            key?: string;
            to?: number;
        }
        interface SunburstSeriesLevelsOptions
            extends
            TreemapSeriesLevelsOptions
        {
            borderColor?: ColorString;
            borderDashStyle?: DashStyleValue;
            borderWidth?: number;
            color?: ColorType;
            colorVariation?: SunburstSeriesLevelsColorVariationOptions;
            dataLabels?: SunburstDataLabelsOptionsObject;
            levelSize?: unknown;
            rotation?: number;
            rotationMode?: string;
        }
        interface SunburstSeriesLevelSizeOptions {
            unit?: string;
            value?: number;
        }
        interface SunburstSeriesOptions extends TreemapSeriesOptions {
            center?: Array<(number|string|null)>;
            dataLabels?: (
                SunburstDataLabelsOptionsObject|
                Array<SunburstDataLabelsOptionsObject>
            );
            endAngle?: number;
            levels?: Array<SunburstSeriesLevelsOptions>;
            levelSize?: SunburstSeriesLevelSizeOptions;
            mapIdToNode?: SunburstSeries['nodeMap'];
            rootId?: string;
            slicedOffset?: number;
            startAngle?: number;
            states?: SeriesStatesOptionsObject<SunburstSeries>;
        }
        interface SunburstSeriesUtilsObject extends TreemapSeriesUtilsObject {
            calculateLevelSizes(
                levelOptions: SunburstSeriesLevelsOptions,
                params: Dictionary<number>
            ): (SunburstSeriesLevelsOptions|undefined);
            range(from: unknown, to: unknown): Array<number>;
        }
        type SunburstDataLabelsRotationValue = (
            'auto'|'perpendicular'|'parallel'
        );
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    isNumber,
    isObject,
    isString
} = U;

import '../mixins/centered-series.js';
import drawPoint from '../mixins/draw-point.js';
import mixinTreeSeries from '../mixins/tree-series.js';
import '../parts/Series.js';
import './treemap.src.js';

var CenteredSeriesMixin = H.CenteredSeriesMixin,
    Series = H.Series,
    getCenter = CenteredSeriesMixin.getCenter,
    getColor = mixinTreeSeries.getColor,
    getLevelOptions = mixinTreeSeries.getLevelOptions,
    getStartAndEndRadians = CenteredSeriesMixin.getStartAndEndRadians,
    isBoolean = function (x: unknown): x is boolean {
        return typeof x === 'boolean';
    },
    merge = H.merge,
    noop = H.noop,
    rad2deg = 180 / Math.PI,
    seriesType = H.seriesType,
    seriesTypes = H.seriesTypes,
    setTreeValues = mixinTreeSeries.setTreeValues,
    updateRootId = mixinTreeSeries.updateRootId;

// TODO introduce step, which should default to 1.
var range = function range(from: unknown, to: unknown): Array<number> {
    var result: Array<number> = [],
        i: number;

    if (isNumber(from) && isNumber(to) && from <= to) {
        for (i = from; i <= to; i++) {
            result.push(i);
        }
    }
    return result;
};

/**
 * @private
 * @function calculateLevelSizes
 *
 * @param {object} levelOptions
 * Map of level to its options.
 *
 * @param {Highcharts.Dictionary<number>} params
 * Object containing number parameters `innerRadius` and `outerRadius`.
 *
 * @return {Highcharts.SunburstSeriesLevelsOptions|undefined}
 * Returns the modified options, or undefined.
 */
var calculateLevelSizes = function calculateLevelSizes(
    levelOptions: Highcharts.SunburstSeriesLevelsOptions,
    params: Highcharts.Dictionary<number>
): (Highcharts.SunburstSeriesLevelsOptions|undefined) {
    var result: (Highcharts.SunburstSeriesLevelsOptions|undefined),
        p = isObject(params) ? params : {},
        totalWeight = 0,
        diffRadius: number,
        levels: Array<number>,
        levelsNotIncluded,
        remainingSize: number,
        from,
        to;

    if (isObject(levelOptions)) {
        result = merge<Highcharts.SunburstSeriesLevelsOptions>(
            {},
            levelOptions
        );
        from = isNumber(p.from) ? p.from : 0;
        to = isNumber(p.to) ? p.to : 0;
        levels = range(from, to);
        levelsNotIncluded = Object.keys(result).filter(function (
            k: string
        ): boolean {
            return levels.indexOf(+k) === -1;
        });
        diffRadius = remainingSize = isNumber(p.diffRadius) ? p.diffRadius : 0;

        // Convert percentage to pixels.
        // Calculate the remaining size to divide between "weight" levels.
        // Calculate total weight to use in convertion from weight to pixels.
        levels.forEach(function (level: number): void {
            var options = (result as any)[level],
                unit = options.levelSize.unit,
                value = options.levelSize.value;

            if (unit === 'weight') {
                totalWeight += value;
            } else if (unit === 'percentage') {
                options.levelSize = {
                    unit: 'pixels',
                    value: (value / 100) * diffRadius
                };
                remainingSize -= options.levelSize.value;
            } else if (unit === 'pixels') {
                remainingSize -= value;
            }
        });

        // Convert weight to pixels.
        levels.forEach(function (level: number): void {
            var options = (result as any)[level],
                weight;

            if (options.levelSize.unit === 'weight') {
                weight = options.levelSize.value;
                (result as any)[level].levelSize = {
                    unit: 'pixels',
                    value: (weight / totalWeight) * remainingSize
                };
            }
        });

        // Set all levels not included in interval [from,to] to have 0 pixels.
        levelsNotIncluded.forEach(function (level: string): void {
            (result as any)[level].levelSize = {
                value: 0,
                unit: 'pixels'
            };
        });
    }
    return result;
};

/**
 * Find a set of coordinates given a start coordinates, an angle, and a
 * distance.
 *
 * @private
 * @function getEndPoint
 *
 * @param {number} x
 *        Start coordinate x
 *
 * @param {number} y
 *        Start coordinate y
 *
 * @param {number} angle
 *        Angle in radians
 *
 * @param {number} distance
 *        Distance from start to end coordinates
 *
 * @return {Highcharts.SVGAttributes}
 *         Returns the end coordinates, x and y.
 */
var getEndPoint = function getEndPoint(
    x: number,
    y: number,
    angle: number,
    distance: number
): Highcharts.PositionObject {
    return {
        x: x + (Math.cos(angle) * distance),
        y: y + (Math.sin(angle) * distance)
    };
};

var layoutAlgorithm = function layoutAlgorithm(
    parent: Highcharts.SunburstNodeValuesObject,
    children: Array<Highcharts.SunburstNodeObject>,
    options: Highcharts.SunburstSeriesOptions
): Array<Highcharts.SunburstNodeValuesObject> {
    var startAngle = parent.start,
        range = parent.end - startAngle,
        total = parent.val,
        x = parent.x,
        y = parent.y,
        radius = (
            (
                options &&
                isObject(options.levelSize) &&
                isNumber((options.levelSize as any).value)
            ) ?
                (options.levelSize as any).value :
                0
        ),
        innerRadius = parent.r,
        outerRadius = innerRadius + radius,
        slicedOffset = options && isNumber(options.slicedOffset) ?
            options.slicedOffset :
            0;

    return (children || []).reduce(function (
        arr: Array<Highcharts.SunburstNodeValuesObject>,
        child: Highcharts.SunburstNodeObject
    ): Array<Highcharts.SunburstNodeValuesObject> {
        var percentage = (1 / total) * child.val,
            radians = percentage * range,
            radiansCenter = startAngle + (radians / 2),
            offsetPosition = getEndPoint(x, y, radiansCenter, slicedOffset),
            values: Highcharts.SunburstNodeValuesObject = {
                x: child.sliced ? offsetPosition.x : x,
                y: child.sliced ? offsetPosition.y : y,
                innerR: innerRadius,
                r: outerRadius,
                radius: radius,
                start: startAngle,
                end: startAngle + radians
            } as any;

        arr.push(values);
        startAngle = values.end;
        return arr;
    }, []);
};

var getDlOptions = function getDlOptions(
    params: Highcharts.SunburstDlOptionsParams
): Highcharts.SunburstDataLabelsOptionsObject {
    // Set options to new object to avoid problems with scope
    var point = params.point,
        shape: Partial<Highcharts.SunburstNodeValuesObject> =
            isObject(params.shapeArgs) ? params.shapeArgs : {},
        optionsPoint = (
            isObject(params.optionsPoint) ?
                params.optionsPoint.dataLabels :
                {}
        ),
        optionsLevel = (
            isObject(params.level) ?
                params.level.dataLabels :
                {}
        ),
        options = merge<Highcharts.SunburstDataLabelsOptionsObject>({
            style: {}
        }, optionsLevel, optionsPoint),
        rotationRad: (number|undefined),
        rotation: (number|undefined),
        rotationMode = options.rotationMode;

    if (!isNumber(options.rotation)) {
        if (rotationMode === 'auto') {
            if (
                (point.innerArcLength as any) < 1 &&
                (point.outerArcLength as any) > (shape.radius as any)
            ) {
                rotationRad = 0;
            } else if (
                (point.innerArcLength as any) > 1 &&
                (point.outerArcLength as any) > 1.5 * (shape.radius as any)
            ) {
                rotationMode = 'parallel';
            } else {
                rotationMode = 'perpendicular';
            }
        }

        if (rotationMode !== 'auto') {
            rotationRad = (
                (shape.end as any) -
                ((shape.end as any) - (shape.start as any)) / 2
            );
        }

        if (rotationMode === 'parallel') {
            (options.style as any).width = Math.min(
                (shape.radius as any) * 2.5,
                ((point.outerArcLength as any) + point.innerArcLength) / 2
            );
        } else {
            (options.style as any).width = shape.radius;
        }

        if (
            rotationMode === 'perpendicular' &&
            point.series.chart.renderer.fontMetrics(
                (options.style as any).fontSize
            ).h > (point.outerArcLength as any)
        ) {
            (options.style as any).width = 1;
        }

        // Apply padding (#8515)
        (options.style as any).width = Math.max(
            (options.style as any).width - 2 * (options.padding || 0),
            1
        );

        rotation = ((rotationRad as any) * rad2deg) % 180;
        if (rotationMode === 'parallel') {
            rotation -= 90;
        }

        // Prevent text from rotating upside down
        if (rotation > 90) {
            rotation -= 180;
        } else if (rotation < -90) {
            rotation += 180;
        }

        options.rotation = rotation;
    }
    // NOTE: alignDataLabel positions the data label differntly when rotation is
    // 0. Avoiding this by setting rotation to a small number.
    if (options.rotation === 0) {
        options.rotation = 0.001;
    }
    return options;
};

var getAnimation = function getAnimation(
    shape: Highcharts.SunburstNodeValuesObject,
    params: Highcharts.SunburstAnimationParams
): Highcharts.Dictionary<Highcharts.Dictionary<number>> {
    var point = params.point,
        radians = params.radians,
        innerR = params.innerR,
        idRoot = params.idRoot,
        idPreviousRoot = params.idPreviousRoot,
        shapeExisting = params.shapeExisting,
        shapeRoot = params.shapeRoot,
        shapePreviousRoot = params.shapePreviousRoot,
        visible = params.visible,
        from: Highcharts.Dictionary<number> = {},
        to: Highcharts.Dictionary<number> = {
            end: shape.end,
            start: shape.start,
            innerR: shape.innerR,
            r: shape.r,
            x: shape.x,
            y: shape.y
        } as any;

    if (visible) {
        // Animate points in
        if (!point.graphic && shapePreviousRoot) {
            if (idRoot === point.id) {
                from = {
                    start: radians.start,
                    end: radians.end
                };
            } else {
                from = (shapePreviousRoot.end <= shape.start) ? {
                    start: radians.end,
                    end: radians.end
                } : {
                    start: radians.start,
                    end: radians.start
                };
            }
            // Animate from center and outwards.
            from.innerR = from.r = innerR;
        }
    } else {
        // Animate points out
        if (point.graphic) {
            if (idPreviousRoot === point.id) {
                to = {
                    innerR: innerR,
                    r: innerR
                };
            } else if (shapeRoot) {
                to = (shapeRoot.end <= shapeExisting.start) ?
                    {
                        innerR: innerR,
                        r: innerR,
                        start: radians.end,
                        end: radians.end
                    } : {
                        innerR: innerR,
                        r: innerR,
                        start: radians.start,
                        end: radians.start
                    };
            }
        }
    }
    return {
        from: from,
        to: to
    };
};

var getDrillId = function getDrillId(
    point: Highcharts.SunburstPoint,
    idRoot: string,
    mapIdToNode: Highcharts.Dictionary<Highcharts.SunburstNodeObject>
): (string|undefined) {
    var drillId,
        node = point.node,
        nodeRoot;

    if (!node.isLeaf) {
        // When it is the root node, the drillId should be set to parent.
        if (idRoot === point.id) {
            nodeRoot = mapIdToNode[idRoot];
            drillId = nodeRoot.parent;
        } else {
            drillId = point.id;
        }
    }
    return drillId;
};

const getLevelFromAndTo = function getLevelFromAndTo(
    { level, height }: Highcharts.SunburstNodeObject
): { from: number; to: number } {
    //  Never displays level below 1
    const from = level > 0 ? level : 1;
    const to = level + height;
    return { from, to };
};

var cbSetTreeValuesBefore = function before(
    node: Highcharts.SunburstNodeObject,
    options: Highcharts.SunburstNodeValuesObject
): Highcharts.SunburstNodeObject {
    var mapIdToNode: Highcharts.Dictionary<Highcharts.SunburstNodeObject> =
            options.mapIdToNode as any,
        nodeParent = mapIdToNode[node.parent],
        series = options.series,
        chart = series.chart,
        points = series.points,
        point = points[node.i],
        colors = (series.options.colors || chart && chart.options.colors),
        colorInfo = getColor(node, {
            colors: colors,
            colorIndex: series.colorIndex,
            index: options.index,
            mapOptionsToLevel: options.mapOptionsToLevel,
            parentColor: nodeParent && nodeParent.color,
            parentColorIndex: nodeParent && nodeParent.colorIndex,
            series: options.series,
            siblings: options.siblings
        });

    node.color = colorInfo.color;
    node.colorIndex = colorInfo.colorIndex;
    if (point) {
        point.color = node.color;
        point.colorIndex = node.colorIndex;
        // Set slicing on node, but avoid slicing the top node.
        node.sliced = (node.id !== options.idRoot) ? point.sliced : false;
    }
    return node;
};

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
 * @private
 */
var sunburstOptions: Highcharts.SunburstSeriesOptions = {

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
     * Can set a `borderDashStyle` on all points which lies on the same level.
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
     * Can set a `colorVariation` on all points which lies on the same level.
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
     * The ending value of a color variation. The last sibling will receive this
     * value.
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
     * Can set a `levelSize` on all points which lies on the same level.
     *
     * @type      {object}
     * @apioption plotOptions.sunburst.levels.levelSize
     */

    /**
     * Can set a `rotation` on all points which lies on the same level.
     *
     * @type      {number}
     * @apioption plotOptions.sunburst.levels.rotation
     */

    /**
     * Can set a `rotationMode` on all points which lies on the same level.
     *
     * @type      {string}
     * @apioption plotOptions.sunburst.levels.rotationMode
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
     */
    center: ['50%', '50%'],
    colorByPoint: false,
    /**
     * Disable inherited opacity from Treemap series.
     *
     * @ignore-option
     */
    opacity: 1,
    /**
     * @declare Highcharts.SeriesSunburstDataLabelsOptionsObject
     */
    dataLabels: {

        allowOverlap: true,

        defer: true,

        /**
         * Decides how the data label will be rotated relative to the perimeter
         * of the sunburst. Valid values are `auto`, `parallel` and
         * `perpendicular`. When `auto`, the best fit will be computed for the
         * point.
         *
         * The `series.rotation` option takes precedence over `rotationMode`.
         *
         * @type       {string}
         * @validvalue ["auto", "perpendicular", "parallel"]
         * @since      6.0.0
         */
        rotationMode: 'auto',

        style: {
            /** @internal */
            textOverflow: 'ellipsis'
        }

    },
    /**
     * Which point to use as a root in the visualization.
     *
     * @type {string}
     */
    rootId: void 0,

    /**
     * Used together with the levels and `allowDrillToNode` options. When
     * set to false the first level visible when drilling is considered
     * to be level one. Otherwise the level will be the same as the tree
     * structure.
     */
    levelIsConstant: true,

    /**
     * Determines the width of the ring per level.
     *
     * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
     *         Sunburst with various sizes per level
     *
     * @since 6.0.5
     */
    levelSize: {
        /**
         * The value used for calculating the width of the ring. Its' affect is
         * determined by `levelSize.unit`.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         */
        value: 1,
        /**
         * How to interpret `levelSize.value`.
         *
         * - `percentage` gives a width relative to result of outer radius minus
         *   inner radius.
         *
         * - `pixels` gives the ring a fixed width in pixels.
         *
         * - `weight` takes the remaining width after percentage and pixels, and
         *   distributes it accross all "weighted" levels. The value relative to
         *   the sum of all weights determines the width.
         *
         * @sample {highcharts} highcharts/plotoptions/sunburst-levelsize/
         *         Sunburst with various sizes per level
         *
         * @validvalue ["percentage", "pixels", "weight"]
         */
        unit: 'weight'
    },

    /**
     * Options for the button appearing when traversing down in a treemap.
     *
     * @extends   plotOptions.treemap.traverseUpButton
     * @since     6.0.0
     * @apioption plotOptions.sunburst.traverseUpButton
     */

    /**
     * If a point is sliced, moved out from the center, how many pixels
     * should it be moved?.
     *
     * @sample highcharts/plotoptions/sunburst-sliced
     *         Sliced sunburst
     *
     * @since 6.0.4
     */
    slicedOffset: 10
};

// Properties of the Sunburst series.
var sunburstSeries = {
    drawDataLabels: noop as any, // drawDataLabels is called in drawPoints
    drawPoints: function drawPoints(this: Highcharts.SunburstSeries): void {
        var series = this,
            mapOptionsToLevel = series.mapOptionsToLevel,
            shapeRoot = series.shapeRoot,
            group: Highcharts.SVGElement = series.group as any,
            hasRendered = series.hasRendered,
            idRoot = series.rootNode,
            idPreviousRoot = series.idPreviousRoot,
            nodeMap = series.nodeMap,
            nodePreviousRoot = nodeMap[idPreviousRoot as any],
            shapePreviousRoot = nodePreviousRoot && nodePreviousRoot.shapeArgs,
            points = series.points,
            radians = series.startAndEndRadians,
            chart = series.chart,
            optionsChart = chart && chart.options && chart.options.chart || {},
            animation = (
                isBoolean(optionsChart.animation) ?
                    optionsChart.animation :
                    true
            ),
            positions = series.center,
            center = {
                x: positions[0],
                y: positions[1]
            },
            innerR = positions[3] / 2,
            renderer = series.chart.renderer,
            animateLabels: (Function|undefined),
            animateLabelsCalled = false,
            addedHack = false,
            hackDataLabelAnimation = !!(
                animation &&
                hasRendered &&
                idRoot !== idPreviousRoot &&
                series.dataLabelsGroup
            );

        if (hackDataLabelAnimation) {
            (series.dataLabelsGroup as any).attr({ opacity: 0 });
            animateLabels = function (): void {
                var s = series;

                animateLabelsCalled = true;
                if (s.dataLabelsGroup) {
                    s.dataLabelsGroup.animate({
                        opacity: 1,
                        visibility: 'visible'
                    });
                }
            };
        }
        points.forEach(function (point: Highcharts.SunburstPoint): void {
            var node = point.node,
                level = mapOptionsToLevel[node.level],
                shapeExisting: Highcharts.SunburstNodeValuesObject =
                    point.shapeExisting || ({} as any),
                shape: Highcharts.SunburstNodeValuesObject =
                    node.shapeArgs || ({} as any),
                animationInfo,
                onComplete,
                visible = !!(node.visible && node.shapeArgs);

            if (hasRendered && animation) {
                animationInfo = getAnimation(shape, {
                    center: center,
                    point: point,
                    radians: radians,
                    innerR: innerR,
                    idRoot: idRoot,
                    idPreviousRoot: idPreviousRoot,
                    shapeExisting: shapeExisting,
                    shapeRoot: shapeRoot,
                    shapePreviousRoot: shapePreviousRoot,
                    visible: visible
                });
            } else {
                // When animation is disabled, attr is called from animation.
                animationInfo = {
                    to: shape,
                    from: {}
                };
            }
            extend(point, {
                shapeExisting: shape, // Store for use in animation
                tooltipPos: [(shape as any).plotX, (shape as any).plotY],
                drillId: getDrillId(point, idRoot, nodeMap),
                name: '' + (point.name || point.id || point.index),
                plotX: (shape as any).plotX, // used for data label position
                plotY: (shape as any).plotY, // used for data label position
                value: node.val,
                isNull: !visible // used for dataLabels & point.draw
            });
            point.dlOptions = getDlOptions({
                point: point,
                level: level,
                optionsPoint: point.options,
                shapeArgs: shape
            });
            if (!addedHack && visible) {
                addedHack = true;
                onComplete = animateLabels;
            }
            point.draw({
                animatableAttribs: animationInfo.to,
                attribs: extend(
                    animationInfo.from,
                    (!chart.styledMode && series.pointAttribs(
                        point,
                        (point.selected && 'select') as any
                    ) as any)
                ),
                onComplete: onComplete,
                group: group,
                renderer: renderer,
                shapeType: 'arc',
                shapeArgs: shape
            });
        });
        // Draw data labels after points
        // TODO draw labels one by one to avoid addtional looping
        if (hackDataLabelAnimation && addedHack) {
            series.hasRendered = false;
            (series.options.dataLabels as any).defer = true;
            Series.prototype.drawDataLabels.call(series);
            series.hasRendered = true;
            // If animateLabels is called before labels were hidden, then call
            // it again.
            if (animateLabelsCalled) {
                (animateLabels as any)();
            }
        } else {
            Series.prototype.drawDataLabels.call(series);
        }
    },

    pointAttribs: seriesTypes.column.prototype.pointAttribs,

    // The layout algorithm for the levels
    layoutAlgorithm: layoutAlgorithm,

    // Set the shape arguments on the nodes. Recursive from root down.
    setShapeArgs: function (
        this: Highcharts.SunburstSeries,
        parent: Highcharts.SunburstNodeObject,
        parentValues: Highcharts.SunburstNodeValuesObject,
        mapOptionsToLevel: (
            Highcharts.Dictionary<Highcharts.SunburstSeriesOptions>
        )
    ): void {
        var childrenValues: Array<Highcharts.SunburstNodeValuesObject> = [],
            level = parent.level + 1,
            options = mapOptionsToLevel[level],
            // Collect all children which should be included
            children = parent.children.filter(function (
                n: Highcharts.SunburstNodeObject
            ): boolean {
                return n.visible;
            }),
            twoPi = 6.28; // Two times Pi.

        childrenValues = this.layoutAlgorithm(parentValues, children, options);
        children.forEach(function (
            child: Highcharts.SunburstNodeObject,
            index: number
        ): void {
            var values = childrenValues[index],
                angle = values.start + ((values.end - values.start) / 2),
                radius = values.innerR + ((values.r - values.innerR) / 2),
                radians = (values.end - values.start),
                isCircle = (values.innerR === 0 && radians > twoPi),
                center = (
                    isCircle ?
                        { x: values.x, y: values.y } :
                        getEndPoint(values.x, values.y, angle, radius)
                ),
                val = (
                    child.val ?
                        (
                            child.childrenTotal > child.val ?
                                child.childrenTotal :
                                child.val
                        ) :
                        child.childrenTotal
                );

            // The inner arc length is a convenience for data label filters.
            if (this.points[child.i]) {
                this.points[child.i].innerArcLength = radians * values.innerR;
                this.points[child.i].outerArcLength = radians * values.r;
            }

            child.shapeArgs = merge(values, {
                plotX: center.x,
                plotY: center.y + 4 * Math.abs(Math.cos(angle))
            });
            child.values = merge(values, {
                val: val
            });
            // If node has children, then call method recursively
            if (child.children.length) {
                this.setShapeArgs(
                    child,
                    child.values as any,
                    mapOptionsToLevel
                );
            }
        }, this);
    },


    translate: function translate(this: Highcharts.SunburstSeries): void {
        var series = this,
            options = series.options,
            positions = series.center = getCenter.call(series),
            radians = series.startAndEndRadians = getStartAndEndRadians(
                options.startAngle,
                options.endAngle
            ),
            innerRadius = positions[3] / 2,
            outerRadius = positions[2] / 2,
            diffRadius = outerRadius - innerRadius,
            // NOTE: updateRootId modifies series.
            rootId = updateRootId(series),
            mapIdToNode = series.nodeMap,
            mapOptionsToLevel: (
                Highcharts.Dictionary<Highcharts.SunburstSeriesOptions>
            ),
            idTop,
            nodeRoot = mapIdToNode && mapIdToNode[rootId],
            nodeTop,
            tree: Highcharts.SunburstNodeObject,
            values: Highcharts.SunburstNodeValuesObject,
            nodeIds: Highcharts.Dictionary<boolean> = {};

        series.shapeRoot = nodeRoot && nodeRoot.shapeArgs;
        // Call prototype function
        Series.prototype.translate.call(series);
        // @todo Only if series.isDirtyData is true
        tree = series.tree = series.getTree();

        // Render traverseUpButton, after series.nodeMap i calculated.
        series.renderTraverseUpButton(rootId);
        mapIdToNode = series.nodeMap;
        nodeRoot = mapIdToNode[rootId];
        idTop = isString(nodeRoot.parent) ? nodeRoot.parent : '';
        nodeTop = mapIdToNode[idTop];
        const { from, to } = getLevelFromAndTo(nodeRoot);
        mapOptionsToLevel = getLevelOptions<Highcharts.SunburstSeries>({
            from,
            levels: series.options.levels,
            to,
            defaults: {
                colorByPoint: options.colorByPoint,
                dataLabels: options.dataLabels,
                levelIsConstant: options.levelIsConstant,
                levelSize: options.levelSize,
                slicedOffset: options.slicedOffset
            }
        }) as any;
        // NOTE consider doing calculateLevelSizes in a callback to
        // getLevelOptions
        mapOptionsToLevel = calculateLevelSizes(mapOptionsToLevel, {
            diffRadius,
            from,
            to
        }) as any;
        // TODO Try to combine setTreeValues & setColorRecursive to avoid
        //  unnecessary looping.
        setTreeValues(tree, {
            before: cbSetTreeValuesBefore,
            idRoot: rootId,
            levelIsConstant: options.levelIsConstant,
            mapOptionsToLevel: mapOptionsToLevel,
            mapIdToNode: mapIdToNode,
            points: series.points,
            series: series
        } as any);
        values = mapIdToNode[''].shapeArgs = {
            end: radians.end,
            r: innerRadius,
            start: radians.start,
            val: nodeRoot.val,
            x: positions[0],
            y: positions[1]
        } as any;
        this.setShapeArgs(nodeTop, values, mapOptionsToLevel);
        // Set mapOptionsToLevel on series for use in drawPoints.
        series.mapOptionsToLevel = mapOptionsToLevel;

        // #10669 - verify if all nodes have unique ids
        series.data.forEach(function (child: Highcharts.SunburstPoint): void {
            if (nodeIds[child.id]) {
                H.error(31, false, series.chart);
            }
            // map
            nodeIds[child.id] = true;
        });

        // reset object
        nodeIds = {};
    },

    // Animate the slices in. Similar to the animation of polar charts.
    animate: function (this: Highcharts.SunburstSeries, init?: boolean): void {
        var chart = this.chart,
            center = [
                chart.plotWidth / 2,
                chart.plotHeight / 2
            ],
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            attribs,
            group: Highcharts.SVGElement = this.group as any;

        // Initialize the animation
        if (init) {

            // Scale down the group and place it in the center
            attribs = {
                translateX: center[0] + plotLeft,
                translateY: center[1] + plotTop,
                scaleX: 0.001, // #1499
                scaleY: 0.001,
                rotation: 10,
                opacity: 0.01
            };

            group.attr(attribs);

        // Run the animation
        } else {
            attribs = {
                translateX: plotLeft,
                translateY: plotTop,
                scaleX: 1,
                scaleY: 1,
                rotation: 0,
                opacity: 1
            };
            group.animate(attribs, this.options.animation);

            // Delete this function to allow it only once
            this.animate = null as any;
        }
    },
    utils: {
        calculateLevelSizes,
        getLevelFromAndTo,
        range
    } as any
};

// Properties of the Sunburst series.
var sunburstPoint = {
    draw: drawPoint,
    shouldDraw: function shouldDraw(this: Highcharts.SunburstPoint): boolean {
        return !this.isNull;
    },
    isValid: function isValid(this: Highcharts.SunburstPoint): boolean {
        return true;
    }
};

/**
 * A `sunburst` series. If the [type](#series.sunburst.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.sunburst
 * @excluding dataParser, dataURL, stack
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

/**
 * @private
 * @class
 * @name Highcharts.seriesTypes.sunburst
 *
 * @augments Highcharts.Series
 */
seriesType<Highcharts.SunburstSeries>(
    'sunburst',
    'treemap',
    sunburstOptions,
    sunburstSeries,
    sunburstPoint
);
