/* *
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

import type ColorType from '../Core/Color/ColorType';
import type Point from '../Core/Series/Point';
import type PointOptions from '../Core/Series/PointOptions';
import type Series from '../Core/Series/Series';
import type TreemapSeries from './Treemap/TreemapSeries';

import Color from '../Core/Color/Color.js';
import U from '../Core/Utilities.js';
const {
    extend,
    isArray,
    isNumber,
    isObject,
    merge,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface TreeColorObject {
            color: ColorType;
            colorIndex: number;
        }
        interface TreeNodeObject {
            children: Array<TreeNodeObject>;
            childrenTotal?: number;
            i: number;
            id: string;
            isLeaf?: boolean;
            levelDynamic?: number;
            level: number;
            name?: string;
            val: number;
            visible: boolean;
        }
        interface TreePoint extends Point {
            options: TreePointOptions;
        }
        interface TreePointOptions extends PointOptions {
            value?: (number|null);
        }
        interface TreeSeries extends Series {
            mapOptionsToLevel: any;
            points: Array<TreePoint>;
            tree: TreeNodeObject;
        }
        interface TreeValuesBeforeCallbackFunction<
            T extends TreeSeries = TreeSeries
        > {
            (node: T['tree'], options: TreeValuesOptionsObject<T>): T['tree'];
        }
        interface TreeValuesOptionsObject<T extends TreeSeries = TreeSeries> {
            before?: TreeValuesBeforeCallbackFunction<T>;
            idRoot: string;
            index?: number;
            levelIsConstant?: boolean;
            mapIdToNode: Record<string, TreeNodeObject>;
            points: T['points'];
            series: T;
            siblings?: number;
            visible?: boolean;
        }
    }
}

/* *
 *
 *  Functions
 *
 * */

/* eslint-disable valid-jsdoc */

/**
 * @private
 */
function getColor(
    node: TreemapSeries.NodeObject,
    options: TreeUtilities.GetColorOptions
): Highcharts.TreeColorObject {
    const index = options.index,
        mapOptionsToLevel = options.mapOptionsToLevel,
        parentColor = options.parentColor,
        parentColorIndex = options.parentColorIndex,
        series = options.series,
        colors = options.colors,
        siblings = options.siblings,
        points = series.points,
        chartOptionsChart = series.chart.options.chart;

    let getColorByPoint,
        point,
        level: AnyRecord,
        colorByPoint,
        colorIndexByPoint,
        color,
        colorIndex;

    /**
     * @private
     */
    const variateColor = (color: ColorType): ColorType => {
        const colorVariation = level && level.colorVariation;

        if (
            colorVariation &&
            colorVariation.key === 'brightness' &&
            index &&
            siblings
        ) {
            return Color.parse(color).brighten(
                colorVariation.to * (index / siblings)
            ).get();
        }

        return color;
    };

    if (node) {
        point = points[node.i];
        level = mapOptionsToLevel[node.level] || {};
        getColorByPoint = point && level.colorByPoint;

        if (getColorByPoint) {
            colorIndexByPoint = (point.index as any) % (colors ?
                colors.length :
                (chartOptionsChart.colorCount as any)
            );
            colorByPoint = colors && colors[colorIndexByPoint];
        }

        // Select either point color, level color or inherited color.
        if (!series.chart.styledMode) {
            color = pick(
                point && point.options.color,
                level && level.color,
                colorByPoint,
                parentColor && variateColor(parentColor),
                series.color
            );
        }

        colorIndex = pick(
            point && point.options.colorIndex,
            level && level.colorIndex,
            colorIndexByPoint,
            parentColorIndex,
            options.colorIndex
        );
    }
    return {
        color: color,
        colorIndex: colorIndex
    };
}

/**
 * Creates a map from level number to its given options.
 *
 * @private
 *
 * @param {object} params
 * Object containing parameters.
 * - `defaults` Object containing default options. The default options are
 *   merged with the userOptions to get the final options for a specific
 *   level.
 * - `from` The lowest level number.
 * - `levels` User options from series.levels.
 * - `to` The highest level number.
 *
 * @return {Highcharts.Dictionary<object>|null}
 * Returns a map from level number to its given options.
 */
function getLevelOptions<T extends Highcharts.TreeSeries>(
    params: any
): (T['mapOptionsToLevel']|null) {
    let result: T['mapOptionsToLevel'] = null,
        defaults: any,
        converted,
        i: number,
        from: any,
        to,
        levels;

    if (isObject(params)) {
        result = {};
        from = isNumber(params.from) ? params.from : 1;
        levels = params.levels;
        converted = {} as any;
        defaults = isObject(params.defaults) ? params.defaults : {};
        if (isArray(levels)) {
            converted = levels.reduce(function (obj: any, item: any): any {
                let level,
                    levelIsConstant,
                    options: any;

                if (isObject(item) && isNumber(item.level)) {
                    options = merge({}, item);
                    levelIsConstant = pick(options.levelIsConstant, defaults.levelIsConstant);
                    // Delete redundant properties.
                    delete options.levelIsConstant;
                    delete options.level;
                    // Calculate which level these options apply to.
                    level = item.level + (levelIsConstant ? 0 : from - 1);
                    if (isObject(obj[level])) {
                        merge(true, obj[level], options); // #16329
                    } else {
                        obj[level] = options;
                    }
                }
                return obj;
            }, {});
        }
        to = isNumber(params.to) ? params.to : 1;
        for (i = 0; i <= to; i++) {
            result[i] = merge(
                {},
                defaults,
                isObject(converted[i]) ? converted[i] : {}
            );
        }
    }
    return result;
}

/**
 * @todo Combine buildTree and buildNode with setTreeValues
 * @todo Remove logic from Treemap and make it utilize this mixin.
 * @private
 */
function setTreeValues<T extends Highcharts.TreeSeries>(
    tree: T['tree'],
    options: Highcharts.TreeValuesOptionsObject<T>
): T['tree'] {
    const before = options.before,
        idRoot = options.idRoot,
        mapIdToNode = options.mapIdToNode,
        nodeRoot = mapIdToNode[idRoot],
        levelIsConstant = (options.levelIsConstant !== false),
        points = options.points,
        point = points[tree.i],
        optionsPoint = point && point.options || {},
        children: Array<Highcharts.TreeNodeObject> = [];

    let childrenTotal = 0;

    tree.levelDynamic = tree.level - (levelIsConstant ? 0 : nodeRoot.level);
    tree.name = pick(point && point.name, '');
    tree.visible = (
        idRoot === tree.id ||
        options.visible === true
    );

    if (typeof before === 'function') {
        tree = before(tree, options);
    }
    // First give the children some values
    tree.children.forEach(function (
        child: Highcharts.TreeNodeObject,
        i: number
    ): void {
        const newOptions = extend<Highcharts.TreeValuesOptionsObject<T>>(
            {} as any, options
        );

        extend(newOptions, {
            index: i,
            siblings: tree.children.length,
            visible: tree.visible
        });
        child = setTreeValues(child, newOptions);
        children.push(child);
        if (child.visible) {
            childrenTotal += child.val;
        }
    });
    // Set the values
    const value = pick(optionsPoint.value, childrenTotal);
    tree.visible = value >= 0 && (childrenTotal > 0 || tree.visible);
    tree.children = children;
    tree.childrenTotal = childrenTotal;
    tree.isLeaf = tree.visible && !childrenTotal;
    tree.val = value;

    return tree;
}

/**
 * Update the rootId property on the series. Also makes sure that it is
 * accessible to exporting.
 *
 * @private
 * @function updateRootId
 *
 * @param {object} series
 *        The series to operate on.
 *
 * @return {string}
 *         Returns the resulting rootId after update.
 */
function updateRootId(
    series: any
): string {
    let rootId,
        options;

    if (isObject(series)) {
        // Get the series options.
        options = isObject(series.options) ? series.options : {};

        // Calculate the rootId.
        rootId = pick(series.rootNode, options.rootId, '');

        // Set rootId on series.userOptions to pick it up in exporting.
        if (isObject(series.userOptions)) {
            series.userOptions.rootId = rootId;
        }
        // Set rootId on series to pick it up on next update.
        series.rootNode = rootId;
    }
    return rootId;
}

/* *
 *
 *  Namespace
 *
 * */

namespace TreeUtilities {

    /* *
     *
     *  Declarations
     *
     * */

    export interface GetColorOptions {
        colorIndex?: number;
        colors?: Array<ColorType>;
        index?: number;
        mapOptionsToLevel?: any;
        parentColor?: ColorType;
        parentColorIndex?: number;
        series: Series;
        siblings?: number;
    }

}

/* *
 *
 *  Default Export
 *
 * */

const TreeUtilities = {
    getColor,
    getLevelOptions,
    setTreeValues,
    updateRootId
};

export default TreeUtilities;
