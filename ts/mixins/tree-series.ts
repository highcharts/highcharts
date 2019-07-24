/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import H from '../parts/Globals.js';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface TreeColorObject {
            color: (ColorString|GradientColorObject|PatternObject);
            colorIndex: number;
        }
        interface TreeSeriesMixin {
            getColor( // @todo
                node: any,
                options: any
            ): Highcharts.TreeColorObject;
            getLevelOptions(params: any): (Dictionary<any>|null); // @todo
            setTreeValues(tree: any, options: any): any; // @todo
            updateRootId(series: any): string; // @todo
        }
    }
}

import U from '../parts/Utilities.js';
const {
    isArray,
    isNumber,
    isObject
} = U;

var extend = H.extend,
    isBoolean = function (x: unknown): x is boolean {
        return typeof x === 'boolean';
    },
    isFn = function (x: unknown): x is Function {
        return typeof x === 'function';
    },
    merge = H.merge,
    pick = H.pick;

/* eslint-disable valid-jsdoc */

/**
 * @todo Combine buildTree and buildNode with setTreeValues
 * @todo Remove logic from Treemap and make it utilize this mixin.
 * @private
 */
var setTreeValues = function setTreeValues(
    tree: any,
    options: any
): any {
    var before = options.before,
        idRoot = options.idRoot,
        mapIdToNode = options.mapIdToNode,
        nodeRoot = mapIdToNode[idRoot],
        levelIsConstant = (
            isBoolean(options.levelIsConstant) ?
                options.levelIsConstant :
                true
        ),
        points = options.points,
        point = points[tree.i],
        optionsPoint = point && point.options || {},
        childrenTotal = 0,
        children = [] as Array<any>,
        value;

    extend(tree, {
        levelDynamic: tree.level - (levelIsConstant ? 0 : nodeRoot.level),
        name: pick(point && point.name, ''),
        visible: (
            idRoot === tree.id ||
            (isBoolean(options.visible) ? options.visible : false)
        )
    });
    if (isFn(before)) {
        tree = before(tree, options);
    }
    // First give the children some values
    tree.children.forEach(function (child: any, i: number): void {
        var newOptions = extend({}, options);

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
    tree.visible = childrenTotal > 0 || tree.visible;
    // Set the values
    value = pick(optionsPoint.value, childrenTotal);
    extend(tree, {
        children: children,
        childrenTotal: childrenTotal,
        isLeaf: tree.visible && !childrenTotal,
        val: value
    });
    return tree;
};

/**
 * @private
 */
var getColor = function getColor(
    node: any,
    options: any
): Highcharts.TreeColorObject {
    var index = options.index,
        mapOptionsToLevel = options.mapOptionsToLevel,
        parentColor = options.parentColor,
        parentColorIndex = options.parentColorIndex,
        series = options.series,
        colors = options.colors,
        siblings = options.siblings,
        points = series.points,
        getColorByPoint,
        chartOptionsChart = series.chart.options.chart,
        point,
        level: Highcharts.Dictionary<any>,
        colorByPoint,
        colorIndexByPoint,
        color,
        colorIndex;

    /**
     * @private
     */
    function variation(color: Highcharts.ColorString): Highcharts.ColorString {
        var colorVariation = level && level.colorVariation;

        if (colorVariation) {
            if (colorVariation.key === 'brightness') {
                return H.color(color).brighten(
                    colorVariation.to * (index / siblings)
                ).get() as any;
            }
        }

        return color;
    }

    if (node) {
        point = points[node.i];
        level = mapOptionsToLevel[node.level] || {};
        getColorByPoint = point && level.colorByPoint;

        if (getColorByPoint) {
            colorIndexByPoint = point.index % (colors ?
                colors.length :
                chartOptionsChart.colorCount
            );
            colorByPoint = colors && colors[colorIndexByPoint];
        }

        // Select either point color, level color or inherited color.
        if (!series.chart.styledMode) {
            color = pick(
                point && point.options.color,
                level && level.color,
                colorByPoint,
                parentColor && variation(parentColor),
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
};

/**
 * Creates a map from level number to its given options.
 *
 * @private
 * @function getLevelOptions
 * @param {object} params
 *        Object containing parameters.
 *        - `defaults` Object containing default options. The default options
 *           are merged with the userOptions to get the final options for a
 *           specific level.
 *        - `from` The lowest level number.
 *        - `levels` User options from series.levels.
 *        - `to` The highest level number.
 * @return {Highcharts.Dictionary<object>|null}
 *         Returns a map from level number to its given options.
 */
var getLevelOptions = function getLevelOptions(
    params: any
): (Highcharts.Dictionary<any>|null) {
    var result = null,
        defaults: any,
        converted,
        i,
        from: any,
        to,
        levels;

    if (isObject(params)) {
        result = {} as any;
        from = isNumber(params.from) ? params.from : 1;
        levels = params.levels;
        converted = {} as any;
        defaults = isObject(params.defaults) ? params.defaults : {};
        if (isArray(levels)) {
            converted = levels.reduce(function (obj: any, item: any): any {
                var level,
                    levelIsConstant,
                    options: any;

                if (isObject(item) && isNumber(item.level)) {
                    options = merge({}, item);
                    levelIsConstant = (
                        isBoolean(options.levelIsConstant) ?
                            options.levelIsConstant :
                            defaults.levelIsConstant
                    );
                    // Delete redundant properties.
                    delete options.levelIsConstant;
                    delete options.level;
                    // Calculate which level these options apply to.
                    level = item.level + (levelIsConstant ? 0 : from - 1);
                    if (isObject(obj[level])) {
                        extend(obj[level], options);
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
};

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
var updateRootId = function (series: any): string {
    var rootId,
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
};

var result: Highcharts.TreeSeriesMixin = {
    getColor: getColor,
    getLevelOptions: getLevelOptions,
    setTreeValues: setTreeValues,
    updateRootId: updateRootId
};

export default result;
