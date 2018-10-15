/**
* (c) 2016 Highsoft AS
* Authors: Jon Arild Nygard
*
* License: www.highcharts.com/license
*/
/* eslint no-console: 0 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
var each = H.each,
    extend = H.extend,
    isNumber = H.isNumber,
    keys = H.keys,
    map = H.map,
    pick = H.pick,
    reduce = H.reduce,
    isFunction = function (x) {
        return typeof x === 'function';
    };

/**
 * Creates an object map from parent id to childrens index.
 * @param   {Array}  data          List of points set in options.
 * @param   {string} data[].parent Parent id of point.
 * @param   {Array}  ids           List of all point ids.
 * @returns {Object}               Map from parent id to children index in data
 */
var getListOfParents = function (data, ids) {
    var listOfParents = reduce(data, function (prev, curr) {
            var parent = pick(curr.parent, '');
            if (prev[parent] === undefined) {
                prev[parent] = [];
            }
            prev[parent].push(curr);
            return prev;
        }, {}),
        parents = keys(listOfParents);

    // If parent does not exist, hoist parent to root of tree.
    each(parents, function (parent, list) {
        var children = listOfParents[parent];
        if ((parent !== '') && (H.inArray(parent, ids) === -1)) {
            each(children, function (child) {
                list[''].push(child);
            });
            delete list[parent];
        }
    });
    return listOfParents;
};
var getNode = function (id, parent, level, data, mapOfIdToChildren, options) {
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
        },
        start,
        end,
        children;

    // Allow custom logic before the children has been created.
    if (isFunction(before)) {
        before(node, options);
    }

    /**
     * Call getNode recursively on the children. Calulate the height of the
     * node, and the number of descendants.
     */
    children = map((mapOfIdToChildren[id] || []), function (child) {
        var node = getNode(
                child.id,
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
    if (isFunction(after)) {
        after(node, options);
    }

    return node;
};
var getTree = function (data, options) {
    var ids = map(data, function (d) {
            return d.id;
        }),
        mapOfIdToChildren = getListOfParents(data, ids);
    return getNode('', null, 1, null, mapOfIdToChildren, options);
};

var Tree = {
    getListOfParents: getListOfParents,
    getNode: getNode,
    getTree: getTree
};

export default Tree;
