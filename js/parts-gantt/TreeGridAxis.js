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
import Axis from '../parts/Axis.js';
import Tick from '../parts/Tick.js';
import Tree from './Tree.js';
import TreeGridTick from './TreeGridTick.js';
import TreeSeriesMixin from '../mixins/tree-series.js';
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, find = U.find, fireEvent = U.fireEvent, isNumber = U.isNumber, isObject = U.isObject, isString = U.isString, merge = U.merge, pick = U.pick, wrap = U.wrap;
import './GridAxis.js';
import '../modules/broken-axis.src.js';
/**
 * @private
 */
var TreeGridAxis;
(function (TreeGridAxis) {
    /* *
     *
     *  Interfaces
     *
     * */
    /* *
     *
     *  Variables
     *
     * */
    var applied = false;
    /* *
     *
     *  Functions
     *
     * */
    /**
     * @private
     */
    function compose(AxisClass) {
        if (!applied) {
            wrap(AxisClass.prototype, 'generateTick', wrapGenerateTick);
            wrap(AxisClass.prototype, 'getMaxLabelDimensions', wrapGetMaxLabelDimensions);
            wrap(AxisClass.prototype, 'init', wrapInit);
            wrap(AxisClass.prototype, 'setTickInterval', wrapSetTickInterval);
            TreeGridTick.compose(Tick);
            applied = true;
        }
    }
    TreeGridAxis.compose = compose;
    /**
     * @private
     */
    function getBreakFromNode(node, max) {
        var from = node.collapseStart || 0, to = node.collapseEnd || 0;
        // In broken-axis, the axis.max is minimized until it is not within a
        // break. Therefore, if break.to is larger than axis.max, the axis.to
        // should not add the 0.5 axis.tickMarkOffset, to avoid adding a break
        // larger than axis.max.
        // TODO consider simplifying broken-axis and this might solve itself
        if (to >= max) {
            from -= 0.5;
        }
        return {
            from: from,
            to: to,
            showPoints: false
        };
    }
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
    function getTreeGridFromData(data, uniqueNames, numberOfSeries) {
        var categories = [], collapsedNodes = [], mapOfIdToNode = {}, mapOfPosToGridNode = {}, posIterator = -1, uniqueNamesEnabled = typeof uniqueNames === 'boolean' ? uniqueNames : false, tree;
        // Build the tree from the series data.
        var treeParams = {
            // After the children has been created.
            after: function (node) {
                var gridNode = mapOfPosToGridNode[node.pos], height = 0, descendants = 0;
                gridNode.children.forEach(function (child) {
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
            before: function (node) {
                var data = isObject(node.data, true) ? node.data : {}, name = isString(data.name) ? data.name : '', parentNode = mapOfIdToNode[node.parent], parentGridNode = (isObject(parentNode, true) ?
                    mapOfPosToGridNode[parentNode.pos] :
                    null), hasSameName = function (x) {
                    return x.name === name;
                }, gridNode, pos;
                // If not unique names, look for sibling node with the same name
                if (uniqueNamesEnabled &&
                    isObject(parentGridNode, true) &&
                    !!(gridNode = find(parentGridNode.children, hasSameName))) {
                    // If there is a gridNode with the same name, reuse position
                    pos = gridNode.pos;
                    // Add data node to list of nodes in the grid node.
                    gridNode.nodes.push(node);
                }
                else {
                    // If it is a new grid node, increment position.
                    pos = posIterator++;
                }
                // Add new grid node to map.
                if (!mapOfPosToGridNode[pos]) {
                    mapOfPosToGridNode[pos] = gridNode = {
                        depth: parentGridNode ? parentGridNode.depth + 1 : 0,
                        name: name,
                        nodes: [node],
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
                    mapOfIdToNode[node.id] = node;
                }
                // If one of the points are collapsed, then start the grid node
                // in collapsed state.
                if (gridNode &&
                    data.collapsed === true) {
                    gridNode.collapsed = true;
                }
                // Assign pos to data node
                node.pos = pos;
            }
        };
        var updateYValuesAndTickPos = function (map, numberOfSeries) {
            var setValues = function (gridNode, start, result) {
                var nodes = gridNode.nodes, end = start + (start === -1 ? 0 : numberOfSeries - 1), diff = (end - start) / 2, padding = 0.5, pos = start + diff;
                nodes.forEach(function (node) {
                    var data = node.data;
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
                gridNode.children.forEach(function (child) {
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
        mapOfPosToGridNode = updateYValuesAndTickPos(mapOfPosToGridNode, numberOfSeries);
        // Return the resulting data.
        return {
            categories: categories,
            mapOfIdToNode: mapOfIdToNode,
            mapOfPosToGridNode: mapOfPosToGridNode,
            collapsedNodes: collapsedNodes,
            tree: tree
        };
    }
    /**
     * Builds the tree of categories and calculates its positions.
     * @private
     * @param {object} e Event object
     * @param {object} e.target The chart instance which the event was fired on.
     * @param {object[]} e.target.axes The axes of the chart.
     */
    function onBeforeRender(e) {
        var chart = e.target, axes = chart.axes;
        axes.filter(function (axis) {
            return axis.options.type === 'treegrid';
        }).forEach(function (axis) {
            var options = axis.options || {}, labelOptions = options.labels, uniqueNames = options.uniqueNames, numberOfSeries = 0, isDirty, data, treeGrid;
            // Check whether any of series is rendering for the first time,
            // visibility has changed, or its data is dirty,
            // and only then update. #10570, #10580
            // Also check if mapOfPosToGridNode exists. #10887
            isDirty = (!axis.treeGrid.mapOfPosToGridNode ||
                axis.series.some(function (series) {
                    return !series.hasRendered ||
                        series.isDirtyData ||
                        series.isDirty;
                }));
            if (isDirty) {
                // Concatenate data from all series assigned to this axis.
                data = axis.series.reduce(function (arr, s) {
                    if (s.visible) {
                        // Push all data to array
                        (s.options.data || []).forEach(function (data) {
                            if (isObject(data, true)) {
                                // Set series index on data. Removed again
                                // after use.
                                data.seriesIndex = numberOfSeries;
                                arr.push(data);
                            }
                        });
                        // Increment series index
                        if (uniqueNames === true) {
                            numberOfSeries++;
                        }
                    }
                    return arr;
                }, []);
                // setScale is fired after all the series is initialized,
                // which is an ideal time to update the axis.categories.
                treeGrid = getTreeGridFromData(data, uniqueNames || false, (uniqueNames === true) ? numberOfSeries : 1);
                // Assign values to the axis.
                axis.categories = treeGrid.categories;
                axis.treeGrid.mapOfPosToGridNode = treeGrid.mapOfPosToGridNode;
                axis.hasNames = true;
                axis.treeGrid.tree = treeGrid.tree;
                // Update yData now that we have calculated the y values
                axis.series.forEach(function (series) {
                    var data = (series.options.data || []).map(function (d) {
                        return isObject(d, true) ? merge(d) : d;
                    });
                    // Avoid destroying points when series is not visible
                    if (series.visible) {
                        series.setData(data, false);
                    }
                });
                // Calculate the label options for each level in the tree.
                axis.treeGrid.mapOptionsToLevel =
                    TreeSeriesMixin.getLevelOptions({
                        defaults: labelOptions,
                        from: 1,
                        levels: labelOptions && labelOptions.levels,
                        to: axis.treeGrid.tree && axis.treeGrid.tree.height
                    });
                // Setting initial collapsed nodes
                if (e.type === 'beforeRender') {
                    axis.treeGrid.collapsedNodes = treeGrid.collapsedNodes;
                }
            }
        });
    }
    /**
     * Generates a tick for initial positioning.
     *
     * @private
     * @function Highcharts.GridAxis#generateTick
     *
     * @param {Function} proceed
     * The original generateTick function.
     *
     * @param {number} pos
     * The tick position in axis values.
     */
    function wrapGenerateTick(proceed, pos) {
        var axis = this, mapOptionsToLevel = axis.treeGrid.mapOptionsToLevel || {}, isTreeGrid = axis.options.type === 'treegrid', ticks = axis.ticks;
        var tick = ticks[pos], levelOptions, options, gridNode;
        if (isTreeGrid &&
            axis.treeGrid.mapOfPosToGridNode) {
            gridNode = axis.treeGrid.mapOfPosToGridNode[pos];
            levelOptions = mapOptionsToLevel[gridNode.depth];
            if (levelOptions) {
                options = {
                    labels: levelOptions
                };
            }
            if (!tick) {
                ticks[pos] = tick =
                    new Tick(axis, pos, void 0, void 0, {
                        category: gridNode.name,
                        tickmarkOffset: gridNode.tickmarkOffset,
                        options: options
                    });
            }
            else {
                // update labels depending on tick interval
                tick.parameters.category = gridNode.name;
                tick.options = options;
                tick.addLabel();
            }
        }
        else {
            proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
        }
    }
    /**
     * Override to add indentation to axis.maxLabelDimensions.
     *
     * @private
     * @function Highcharts.GridAxis#getMaxLabelDimensions
     *
     * @param {Function} proceed
     * The original function
     */
    function wrapGetMaxLabelDimensions(proceed) {
        var axis = this, options = axis.options, labelOptions = options && options.labels, indentation = (labelOptions && isNumber(labelOptions.indentation) ?
            labelOptions.indentation :
            0), retVal = proceed.apply(axis, Array.prototype.slice.call(arguments, 1)), isTreeGrid = axis.options.type === 'treegrid';
        var treeDepth;
        if (isTreeGrid && axis.treeGrid.mapOfPosToGridNode) {
            treeDepth = axis.treeGrid.mapOfPosToGridNode[-1].height || 0;
            retVal.width += indentation * (treeDepth - 1);
        }
        return retVal;
    }
    /**
     * @private
     */
    function wrapInit(proceed, chart, userOptions) {
        var axis = this, isTreeGrid = userOptions.type === 'treegrid';
        if (!axis.treeGrid) {
            axis.treeGrid = new Additions(axis);
        }
        // Set default and forced options for TreeGrid
        if (isTreeGrid) {
            // Add event for updating the categories of a treegrid.
            // NOTE Preferably these events should be set on the axis.
            addEvent(chart, 'beforeRender', onBeforeRender);
            addEvent(chart, 'beforeRedraw', onBeforeRender);
            // Add new collapsed nodes on addseries
            addEvent(chart, 'addSeries', function (e) {
                if (e.options.data) {
                    var treeGrid = getTreeGridFromData(e.options.data, userOptions.uniqueNames || false, 1);
                    axis.treeGrid.collapsedNodes = (axis.treeGrid.collapsedNodes || []).concat(treeGrid.collapsedNodes);
                }
            });
            // Collapse all nodes in axis.treegrid.collapsednodes
            // where collapsed equals true.
            addEvent(axis, 'foundExtremes', function () {
                if (axis.treeGrid.collapsedNodes) {
                    axis.treeGrid.collapsedNodes.forEach(function (node) {
                        var breaks = axis.treeGrid.collapse(node);
                        if (axis.brokenAxis) {
                            axis.brokenAxis.setBreaks(breaks, false);
                            // remove the node from the axis collapsedNodes
                            if (axis.treeGrid.collapsedNodes) {
                                axis.treeGrid.collapsedNodes = axis.treeGrid.collapsedNodes.filter(function (n) {
                                    return node.collapseStart !== n.collapseStart ||
                                        node.collapseEnd !== n.collapseEnd;
                                });
                            }
                        }
                    });
                }
            });
            userOptions = merge({
                // Default options
                grid: {
                    enabled: true
                },
                // TODO: add support for align in treegrid.
                labels: {
                    align: 'left',
                    /**
                    * Set options on specific levels in a tree grid axis. Takes
                    * precedence over labels options.
                    *
                    * @sample {gantt} gantt/treegrid-axis/labels-levels
                    *         Levels on TreeGrid Labels
                    *
                    * @type      {Array<*>}
                    * @product   gantt
                    * @apioption yAxis.labels.levels
                    *
                    * @private
                    */
                    levels: [{
                            /**
                            * Specify the level which the options within this object
                            * applies to.
                            *
                            * @type      {number}
                            * @product   gantt
                            * @apioption yAxis.labels.levels.level
                            *
                            * @private
                            */
                            level: void 0
                        }, {
                            level: 1,
                            /**
                             * @type      {Highcharts.CSSObject}
                             * @product   gantt
                             * @apioption yAxis.labels.levels.style
                             *
                             * @private
                             */
                            style: {
                                /** @ignore-option */
                                fontWeight: 'bold'
                            }
                        }],
                    /**
                     * The symbol for the collapse and expand icon in a
                     * treegrid.
                     *
                     * @product      gantt
                     * @optionparent yAxis.labels.symbol
                     *
                     * @private
                     */
                    symbol: {
                        /**
                         * The symbol type. Points to a definition function in
                         * the `Highcharts.Renderer.symbols` collection.
                         *
                         * @type {Highcharts.SymbolKeyValue}
                         *
                         * @private
                         */
                        type: 'triangle',
                        x: -5,
                        y: -5,
                        height: 10,
                        width: 10,
                        padding: 5
                    }
                },
                uniqueNames: false
            }, userOptions, {
                // Forced options
                reversed: true,
                // grid.columns is not supported in treegrid
                grid: {
                    columns: void 0
                }
            });
        }
        // Now apply the original function with the original arguments,
        // which are sliced off this function's arguments
        proceed.apply(axis, [chart, userOptions]);
        if (isTreeGrid) {
            axis.hasNames = true;
            axis.options.showLastLabel = true;
        }
    }
    /**
     * Set the tick positions, tickInterval, axis min and max.
     *
     * @private
     * @function Highcharts.GridAxis#setTickInterval
     *
     * @param {Function} proceed
     * The original setTickInterval function.
     */
    function wrapSetTickInterval(proceed) {
        var axis = this, options = axis.options, isTreeGrid = options.type === 'treegrid';
        if (isTreeGrid) {
            axis.min = pick(axis.userMin, options.min, axis.dataMin);
            axis.max = pick(axis.userMax, options.max, axis.dataMax);
            fireEvent(axis, 'foundExtremes');
            // setAxisTranslation modifies the min and max according to
            // axis breaks.
            axis.setAxisTranslation(true);
            axis.tickmarkOffset = 0.5;
            axis.tickInterval = 1;
            axis.tickPositions = axis.treeGrid.mapOfPosToGridNode ?
                axis.treeGrid.getTickPositions() :
                [];
        }
        else {
            proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
        }
    }
    /* *
     *
     *  Classes
     *
     * */
    /**
     * @private
     * @class
     */
    var Additions = /** @class */ (function () {
        /* *
         *
         *  Constructors
         *
         * */
        /**
         * @private
         */
        function Additions(axis) {
            this.axis = axis;
        }
        /* *
         *
         *  Functions
         *
         * */
        /**
         * Calculates the new axis breaks to collapse a node.
         *
         * @private
         *
         * @param {Highcharts.Axis} axis
         * The axis to check against.
         *
         * @param {Highcharts.GridNode} node
         * The node to collapse.
         *
         * @param {number} pos
         * The tick position to collapse.
         *
         * @return {Array<object>}
         * Returns an array of the new breaks for the axis.
         */
        Additions.prototype.collapse = function (node) {
            var axis = this.axis, breaks = (axis.options.breaks || []), obj = getBreakFromNode(node, axis.max);
            breaks.push(obj);
            return breaks;
        };
        /**
         * Calculates the new axis breaks to expand a node.
         *
         * @private
         *
         * @param {Highcharts.Axis} axis
         * The axis to check against.
         *
         * @param {Highcharts.GridNode} node
         * The node to expand.
         *
         * @param {number} pos
         * The tick position to expand.
         *
         * @return {Array<object>}
         * Returns an array of the new breaks for the axis.
         */
        Additions.prototype.expand = function (node) {
            var axis = this.axis, breaks = (axis.options.breaks || []), obj = getBreakFromNode(node, axis.max);
            // Remove the break from the axis breaks array.
            return breaks.reduce(function (arr, b) {
                if (b.to !== obj.to || b.from !== obj.from) {
                    arr.push(b);
                }
                return arr;
            }, []);
        };
        /**
         * Creates a list of positions for the ticks on the axis. Filters out
         * positions that are outside min and max, or is inside an axis break.
         *
         * @private
         *
         * @return {Array<number>}
         * List of positions.
         */
        Additions.prototype.getTickPositions = function () {
            var axis = this.axis;
            return Object.keys(axis.treeGrid.mapOfPosToGridNode || {}).reduce(function (arr, key) {
                var pos = +key;
                if (axis.min <= pos &&
                    axis.max >= pos &&
                    !(axis.brokenAxis && axis.brokenAxis.isInAnyBreak(pos))) {
                    arr.push(pos);
                }
                return arr;
            }, []);
        };
        /**
         * Check if a node is collapsed.
         *
         * @private
         *
         * @param {Highcharts.Axis} axis
         * The axis to check against.
         *
         * @param {object} node
         * The node to check if is collapsed.
         *
         * @param {number} pos
         * The tick position to collapse.
         *
         * @return {boolean}
         * Returns true if collapsed, false if expanded.
         */
        Additions.prototype.isCollapsed = function (node) {
            var axis = this.axis, breaks = (axis.options.breaks || []), obj = getBreakFromNode(node, axis.max);
            return breaks.some(function (b) {
                return b.from === obj.from && b.to === obj.to;
            });
        };
        /**
         * Calculates the new axis breaks after toggling the collapse/expand
         * state of a node. If it is collapsed it will be expanded, and if it is
         * exapended it will be collapsed.
         *
         * @private
         *
         * @param {Highcharts.Axis} axis
         * The axis to check against.
         *
         * @param {Highcharts.GridNode} node
         * The node to toggle.
         *
         * @return {Array<object>}
         * Returns an array of the new breaks for the axis.
         */
        Additions.prototype.toggleCollapse = function (node) {
            return (this.isCollapsed(node) ?
                this.expand(node) :
                this.collapse(node));
        };
        return Additions;
    }());
    TreeGridAxis.Additions = Additions;
})(TreeGridAxis || (TreeGridAxis = {}));
// Make utility functions available for testing.
Axis.prototype.utils = {
    getNode: Tree.getNode
};
TreeGridAxis.compose(Axis);
export default TreeGridAxis;
