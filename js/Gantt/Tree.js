/* *
 *
 *  (c) 2016-2020 Highsoft AS
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
import U from '../Core/Utilities.js';
var extend = U.extend, isNumber = U.isNumber, pick = U.pick;
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
var getListOfParents = function (data, ids) {
    var listOfParents = data.reduce(function (prev, curr) {
        var parent = pick(curr.parent, '');
        if (typeof prev[parent] === 'undefined') {
            prev[parent] = [];
        }
        prev[parent].push(curr);
        return prev;
    }, {}), parents = Object.keys(listOfParents);
    // If parent does not exist, hoist parent to root of tree.
    parents.forEach(function (parent, list) {
        var children = listOfParents[parent];
        if ((parent !== '') && (ids.indexOf(parent) === -1)) {
            children.forEach(function (child) {
                list[''].push(child);
            });
            delete list[parent];
        }
    });
    return listOfParents;
};
var getNode = function (id, parent, level, data, mapOfIdToChildren, options) {
    var descendants = 0, height = 0, after = options && options.after, before = options && options.before, node = {
        data: data,
        depth: level - 1,
        id: id,
        level: level,
        parent: parent
    }, start, end, children;
    // Allow custom logic before the children has been created.
    if (typeof before === 'function') {
        before(node, options);
    }
    // Call getNode recursively on the children. Calulate the height of the
    // node, and the number of descendants.
    children = ((mapOfIdToChildren[id] || [])).map(function (child) {
        var node = getNode(child.id, id, (level + 1), child, mapOfIdToChildren, options), childStart = child.start, childEnd = (child.milestone === true ?
            childStart :
            child.end);
        // Start should be the lowest child.start.
        start = ((!isNumber(start) || childStart < start) ?
            childStart :
            start);
        // End should be the largest child.end.
        // If child is milestone, then use start as end.
        end = ((!isNumber(end) || childEnd > end) ?
            childEnd :
            end);
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
    return node;
};
var getTree = function (data, options) {
    var ids = data.map(function (d) {
        return d.id;
    }), mapOfIdToChildren = getListOfParents(data, ids);
    return getNode('', null, 1, null, mapOfIdToChildren, options);
};
var Tree = {
    getListOfParents: getListOfParents,
    getNode: getNode,
    getTree: getTree
};
export default Tree;
