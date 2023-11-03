/* *
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

import U from '../Core/Utilities.js';
const {
    extend,
    isNumber,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

export interface TreeGetOptionsObject {
    after?: Function;
    before?: Function;
}

export interface TreeNode {
    children: Array<TreeNode>;
    data: (TreePointOptionsObject|null);
    depth: number;
    descendants: number;
    height: number;
    id: string;
    level: number;
    parent: string;
}

export interface TreePointOptionsObject {
    end?: number;
    id?: string;
    milestone?: boolean;
    parent?: string;
    start?: number;
}

/* *
 *
 *  Functions
 *
 * */

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
 * Map from parent id to children index in data
 */
function getListOfParents(
    data: Array<TreePointOptionsObject>
): Record<string, Array<TreePointOptionsObject>> {
    const listOfParents = data.reduce((
        prev,
        curr
    ): Record<string, Array<TreePointOptionsObject>> => {
        const parent = pick(curr.parent, '');

        if (typeof prev[parent] === 'undefined') {
            prev[parent] = [];
        }
        prev[parent].push(curr);
        return prev;
    }, {} as Record<string, Array<TreePointOptionsObject>>);
    // parents = Object.keys(listOfParents);
    // If parent does not exist, hoist parent to root of tree.
    // parents.forEach((parent, list): void => {
    //     const children = listOfParents[parent];
    //     if ((parent !== '') && (ids.indexOf(parent) === -1)) {
    //         for (const child of children) {
    //             (list as any)[''].push(child);
    //         }
    //         delete (list as any)[parent];
    //     }
    // });
    return listOfParents;
}

/** @private */
function getNode(
    id: string,
    parent: (string|null),
    level: number,
    data: (TreePointOptionsObject|null),
    mapOfIdToChildren: Record<string, Array<TreePointOptionsObject>>,
    options: TreeGetOptionsObject
): TreeNode {
    const after = options && options.after,
        before = options && options.before,
        node: Partial<TreeNode> = {
            data,
            depth: level - 1,
            id,
            level,
            parent: (parent || '')
        };

    let descendants = 0,
        height = 0,
        start: (number|undefined),
        end: (number|undefined);

    // Allow custom logic before the children has been created.
    if (typeof before === 'function') {
        before(node, options);
    }

    // Call getNode recursively on the children. Calulate the height of the
    // node, and the number of descendants.
    const children = ((mapOfIdToChildren[id] || [])).map((child): TreeNode => {
        const node = getNode(
                child.id as any,
                id,
                (level + 1),
                child,
                mapOfIdToChildren,
                options
            ),
            childStart = child.start || NaN,
            childEnd = (
                child.milestone === true ?
                    childStart :
                    child.end ||
                    NaN
            );

        // Start should be the lowest child.start.
        start = (
            (!isNumber(start) || childStart < start) ?
                childStart :
                start
        );

        // End should be the largest child.end.
        // If child is milestone, then use start as end.
        end = (
            (!isNumber(end) || childEnd > end) ?
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
    if (typeof after === 'function') {
        after(node, options);
    }

    return node as TreeNode;
}

/** @private */
function getTree(
    data: Array<TreePointOptionsObject>,
    options: TreeGetOptionsObject
): TreeNode {
    const mapOfIdToChildren = getListOfParents(data);

    return getNode('', null, 1, null, mapOfIdToChildren, options);
}

/* *
 *
 *  Default Export
 *
 * */

const Tree = {
    getNode,
    getTree
};

export default Tree;
