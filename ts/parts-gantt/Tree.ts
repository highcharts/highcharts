/* *
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

/* eslint no-console: 0 */

'use strict';

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface TreeGetOptionsObject {
            after?: TreeNodeCallbackFunction;
            before?: TreeNodeCallbackFunction;
        }
        interface Tree {
            getListOfParents(
                data: Array<TreePointOptionsObject>,
                ids: Array<string>
            ): Dictionary<Array<TreePointOptionsObject>>;
            getNode(
                id: string,
                parent: (string|null),
                level: number,
                data: (TreePointOptionsObject|null),
                mapOfIdToChildren: Dictionary<Array<TreePointOptionsObject>>,
                options: TreeGetOptionsObject
            ): TreeNode;
            getTree(
                data: Array<TreePointOptionsObject>,
                options: TreeGetOptionsObject
            ): TreeNode;
        }
        interface TreeNode {
            children: Array<TreeNode>;
            data: (TreePointOptionsObject|null);
            depth: number;
            descendants: number;
            height: number;
            id: string;
            level: number;
            parent: (string|null);
        }
        interface TreeNodeCallbackFunction {
            (node: TreeNode, options?: TreeGetOptionsObject): void;
        }
        interface TreePointOptionsObject extends PointOptionsObject {
            end?: number;
            id?: string;
            milestone?: boolean;
            parent?: string;
            start?: number;
        }
    }
}

import U from '../parts/Utilities.js';
const {
    extend,
    isNumber,
    pick
} = U;

var isFunction = function (x: unknown): x is Function {
    return typeof x === 'function';
};

/**
 * Creates an object map from parent id to childrens index.
 *
 * @private
 * @function Highcharts.Tree#getListOfParents
 *
 * @param {Array<*>} data
 *        List of points set in options. `Array.parent` is parent id of point.
 *
 * @param {Array<string>} ids
 *        List of all point ids.
 *
 * @return {Highcharts.Dictionary<Array<*>>}
 *         Map from parent id to children index in data
 */
var getListOfParents = function (
    data: Array<Highcharts.TreePointOptionsObject>,
    ids: Array<string>
): Highcharts.Dictionary<Array<Highcharts.TreePointOptionsObject>> {
    var listOfParents = data.reduce(function (
            prev: (
                Highcharts.Dictionary<Array<Highcharts.TreePointOptionsObject>>
            ),
            curr: Highcharts.TreePointOptionsObject
        ): Highcharts.Dictionary<Array<Highcharts.TreePointOptionsObject>> {
            var parent = pick(curr.parent, '');

            if (typeof prev[parent] === 'undefined') {
                prev[parent] = [];
            }
            prev[parent].push(curr);
            return prev;
        }, {} as (
            Highcharts.Dictionary<Array<Highcharts.TreePointOptionsObject>>
        )),
        parents = Object.keys(listOfParents);

    // If parent does not exist, hoist parent to root of tree.
    parents.forEach(function (parent: string, list: number): void {
        var children = listOfParents[parent];

        if ((parent !== '') && (ids.indexOf(parent) === -1)) {
            children.forEach(function (
                child: Highcharts.TreePointOptionsObject
            ): void {
                (list as any)[''].push(child);
            });
            delete (list as any)[parent];
        }
    });
    return listOfParents;
};
var getNode = function (
    id: string,
    parent: (string|null),
    level: number,
    data: (Highcharts.TreePointOptionsObject|null),
    mapOfIdToChildren: (
        Highcharts.Dictionary<Array<Highcharts.TreePointOptionsObject>>
    ),
    options: Highcharts.TreeGetOptionsObject
): Highcharts.TreeNode {
    var descendants = 0,
        height = 0,
        after = options && options.after,
        before = options && options.before,
        node = {
            data: data,
            depth: level - 1,
            id: id,
            level: level,
            parent: parent
        } as Highcharts.TreeNode,
        start: (number|undefined),
        end: (number|undefined),
        children: Array<Highcharts.TreeNode>;

    // Allow custom logic before the children has been created.
    if (isFunction(before)) {
        before(node, options);
    }

    // Call getNode recursively on the children. Calulate the height of the
    // node, and the number of descendants.
    children = ((mapOfIdToChildren[id] || [])).map(function (
        child: Highcharts.TreePointOptionsObject
    ): Highcharts.TreeNode {
        var node = getNode(
                child.id as any,
                id,
                (level + 1),
                child,
                mapOfIdToChildren,
                options
            ),
            childStart = child.start,
            childEnd = (
                child.milestone === true ?
                    childStart :
                    child.end
            );

        // Start should be the lowest child.start.
        start = (
            (!isNumber(start) || (childStart as any) < start) ?
                childStart :
                start
        );

        // End should be the largest child.end.
        // If child is milestone, then use start as end.
        end = (
            (!isNumber(end) || (childEnd as any) > end) ?
                childEnd :
                end
        );

        descendants = descendants + 1 + node.descendants;
        height = Math.max(node.height + 1, height);
        return node;
    });

    // Calculate start and end for point if it is not already explicitly set.
    if (data) {
        data.start = pick(data.start, start);
        data.end = pick(data.end, end);
    }

    extend(node, {
        children: children,
        descendants: descendants,
        height: height
    });

    // Allow custom logic after the children has been created.
    if (isFunction(after)) {
        after(node, options);
    }

    return node;
};
var getTree = function (
    data: Array<Highcharts.TreePointOptionsObject>,
    options: Highcharts.TreeGetOptionsObject
): Highcharts.TreeNode {
    var ids = data.map(function (d: Highcharts.TreePointOptionsObject): string {
            return d.id as any;
        }),
        mapOfIdToChildren = getListOfParents(data, ids);

    return getNode('', null, 1, null, mapOfIdToChildren, options);
};

var Tree: Highcharts.Tree = {
    getListOfParents: getListOfParents,
    getNode: getNode,
    getTree: getTree
};

export default Tree;
