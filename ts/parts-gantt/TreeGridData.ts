/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AxisTypes from '../parts/axis/types';
import Tree from './Tree.js';
import U from '../parts/Utilities.js';
const {
    find,
    isObject,
    isString
} = U;

/* eslint-disable valid-jsdoc */

/**
 * Creates a tree structure of the data, and the treegrid. Calculates
 * categories, and y-values of points based on the tree.
 *
 * @private
 * @function getTreeGridFromData
 *
 * @param {Array<Highcharts.GanttPointOptions>} data
 * All the data points to display in the axis.
 *
 * @param {boolean} uniqueNames
 * Wether or not the data node with the same name should share grid cell. If
 * true they do share cell. False by default.
 *
 * @param {number} numberOfSeries
 *
 * @return {object}
 * Returns an object containing categories, mapOfIdToNode,
 * mapOfPosToGridNode, and tree.
 *
 * @todo There should be only one point per line.
 * @todo It should be optional to have one category per point, or merge
 *       cells
 * @todo Add unit-tests.
 */
function getTreeGridFromData(
    data: Array<Highcharts.GanttPointOptions>,
    uniqueNames: boolean,
    numberOfSeries: number
): TreeGridData.TreeGridObject {
    var categories: Array<string> = [],
        collapsedNodes: Array<TreeGridData.GridNode> = [],
        mapOfIdToNode: Record<string, TreeGridData.TreeGridNode> = {},
        mapOfPosToGridNode: Record<string, TreeGridData.GridNode> = {},
        posIterator = -1,
        uniqueNamesEnabled = typeof uniqueNames === 'boolean' ? uniqueNames : false,
        tree: Highcharts.TreeNode;

    // Build the tree from the series data.
    const treeParams: Highcharts.TreeGetOptionsObject = {
        // After the children has been created.
        after: function (node: Highcharts.TreeNode): void {
            var gridNode = mapOfPosToGridNode[(node as TreeGridData.TreeGridNode).pos],
                height = 0,
                descendants = 0;

            gridNode.children.forEach(function (child: TreeGridData.GridNode): void {
                descendants += (child.descendants || 0) + 1;
                height = Math.max((child.height || 0) + 1, height);
            });
            gridNode.descendants = descendants;
            gridNode.height = height;
            if (gridNode.collapsed) {
                collapsedNodes.push(gridNode);
            }
        },
        // Before the children has been created.
        before: function (node: Highcharts.TreeNode): void {
            var data = isObject(node.data, true) ? (node as TreeGridData.TreeGridNode).data : {},
                name = isString(data.name) ? data.name : '',
                parentNode = mapOfIdToNode[node.parent],
                parentGridNode = (
                    isObject(parentNode, true) ?
                        mapOfPosToGridNode[parentNode.pos] :
                        null
                ),
                hasSameName = function (x: TreeGridData.GridNode): boolean {
                    return x.name === name;
                },
                gridNode: (TreeGridData.GridNode|undefined),
                pos;

            // If not unique names, look for sibling node with the same name
            if (
                uniqueNamesEnabled &&
                isObject(parentGridNode, true) &&
                !!(gridNode = find(parentGridNode.children, hasSameName))
            ) {
                // If there is a gridNode with the same name, reuse position
                pos = gridNode.pos;
                // Add data node to list of nodes in the grid node.
                gridNode.nodes.push(node as TreeGridData.TreeGridNode);
            } else {
                // If it is a new grid node, increment position.
                pos = posIterator++;
            }

            // Add new grid node to map.
            if (!mapOfPosToGridNode[pos]) {
                mapOfPosToGridNode[pos] = gridNode = {
                    depth: parentGridNode ? parentGridNode.depth + 1 : 0,
                    name: name,
                    nodes: [node as TreeGridData.TreeGridNode],
                    children: [],
                    pos: pos
                };

                // If not root, then add name to categories.
                if (pos !== -1) {
                    categories.push(name);
                }

                // Add name to list of children.
                if (isObject(parentGridNode, true)) {
                    parentGridNode.children.push(gridNode);
                }
            }

            // Add data node to map
            if (isString(node.id)) {
                mapOfIdToNode[node.id] = node as TreeGridData.TreeGridNode;
            }

            // If one of the points are collapsed, then start the grid node
            // in collapsed state.
            if (
                gridNode &&
                data.collapsed === true
            ) {
                gridNode.collapsed = true;
            }

            // Assign pos to data node
            (node as TreeGridData.TreeGridNode).pos = pos;
        }
    };

    const updateYValuesAndTickPos = function (
        map: Highcharts.Dictionary<TreeGridData.GridNode>,
        numberOfSeries: number
    ): Highcharts.Dictionary<TreeGridData.GridNode> {
        const setValues = function (
            gridNode: TreeGridData.GridNode,
            start: number,
            result: Highcharts.Dictionary<TreeGridData.GridNode>
        ): Highcharts.Dictionary<TreeGridData.GridNode> {
            var nodes = gridNode.nodes,
                end = start + (start === -1 ? 0 : numberOfSeries - 1),
                diff = (end - start) / 2,
                padding = 0.5,
                pos = start + diff;

            nodes.forEach(function (node: TreeGridData.TreeGridNode): void {
                const data = node.data;

                if (isObject(data, true)) {
                    // Update point
                    data.y = start + (data.seriesIndex || 0);
                    // Remove the property once used
                    delete data.seriesIndex;
                }
                node.pos = pos;
            });

            result[pos] = gridNode;

            gridNode.pos = pos;
            gridNode.tickmarkOffset = diff + padding;
            gridNode.collapseStart = end + padding;


            gridNode.children.forEach(function (child: TreeGridData.GridNode): void {
                setValues(child, end + 1, result);
                end = (child.collapseEnd || 0) - padding;
            });
            // Set collapseEnd to the end of the last child node.
            gridNode.collapseEnd = end + padding;

            return result;
        };

        return setValues(map['-1'], -1, {});
    };

    // Create tree from data
    tree = Tree.getTree(data, treeParams);

    // Update y values of data, and set calculate tick positions.
    mapOfPosToGridNode = updateYValuesAndTickPos(
        mapOfPosToGridNode,
        numberOfSeries
    );

    // Return the resulting data.
    return {
        categories: categories,
        mapOfIdToNode: mapOfIdToNode,
        mapOfPosToGridNode: mapOfPosToGridNode,
        collapsedNodes: collapsedNodes,
        tree: tree
    };
}

namespace TreeGridData {

    export interface TreeGridObject {
        categories: Array<string>;
        mapOfIdToNode: Record<string, TreeGridNode>;
        mapOfPosToGridNode: Record<string, GridNode>;
        collapsedNodes: Array<GridNode>;
        tree: Highcharts.TreeNode;
    }

    export interface GridNode {
        children: Array<GridNode>;
        collapsed?: boolean;
        collapseEnd?: number;
        collapseStart?: number;
        depth: number;
        descendants?: number;
        height?: number;
        name: string;
        nodes: [TreeGridNode];
        pos: number;
        tickmarkOffset?: number;
    }

    export interface AxisBreakObject extends AxisTypes.AxisBreakObject {
        showPoints: boolean;
    }

    export interface TreeGridNode extends Highcharts.TreeNode {
        data: PointOptionsObject;
        pos: number;
        seriesIndex: number;
    }

    export interface PointOptionsObject extends Highcharts.TreePointOptionsObject {
        collapsed?: boolean;
        seriesIndex?: number;
    }

}

const TreeGridData = {
    getTreeGridFromData
};

export default TreeGridData;
