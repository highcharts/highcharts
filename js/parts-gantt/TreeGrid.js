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
import './GridAxis.js';
import Tree from './Tree.js';
import mixinTreeSeries from '../mixins/tree-series.js';
import '../modules/broken-axis.src.js';
var argsToArray = function (args) {
        return Array.prototype.slice.call(args, 1);
    },
    defined = H.defined,
    each = H.each,
    extend = H.extend,
    find = H.find,
    fireEvent = H.fireEvent,
    getLevelOptions = mixinTreeSeries.getLevelOptions,
    map = H.map,
    merge = H.merge,
    inArray = H.inArray,
    isBoolean = function (x) {
        return typeof x === 'boolean';
    },
    isNumber = H.isNumber,
    isObject = function (x) {
        // Always use strict mode.
        return H.isObject(x, true);
    },
    isString = H.isString,
    keys = H.keys,
    pick = H.pick,
    reduce = H.reduce,
    wrap = H.wrap,
    GridAxis = H.Axis,
    GridAxisTick = H.Tick;

/**
 * some - Equivalent of Array.prototype.some
 *
 * @param  {Array}    arr       Array to look for matching elements in.
 * @param  {function} condition The condition to check against.
 * @return {boolean}            Whether some elements pass the condition.
 */
var some = function (arr, condition) {
    var result = false;
    each(arr, function (element, index, array) {
        if (!result) {
            result = condition(element, index, array);
        }
    });
    return result;
};

var override = function (obj, methods) {
    var method,
        func;
    for (method in methods) {
        if (methods.hasOwnProperty(method)) {
            func = methods[method];
            wrap(obj, method, func);
        }
    }
};

/**
 * getCategoriesFromTree - getCategories based on a tree
 *
 * @param  {object} tree Root of tree to collect categories from
 * @return {Array}       Array of categories
 */
var getCategoriesFromTree = function (tree) {
    var categories = [];
    if (tree.data) {
        categories.push(tree.data.name);
    }
    each(tree.children, function (child) {
        categories = categories.concat(getCategoriesFromTree(child));
    });
    return categories;
};

var mapTickPosToNode = function (node, categories) {
    var map = {},
        name = node.data && node.data.name,
        pos = inArray(name, categories);
    map[pos] = node;
    each(node.children, function (child) {
        extend(map, mapTickPosToNode(child, categories));
    });
    return map;
};

var getBreakFromNode = function (node, max) {
    var from = node.collapseStart,
        to = node.collapseEnd;

    // In broken-axis, the axis.max is minimized until it is not within a break.
    // Therefore, if break.to is larger than axis.max, the axis.to should not
    // add the 0.5 axis.tickMarkOffset, to avoid adding a break larger than
    // axis.max
    // TODO consider simplifying broken-axis and this might solve itself
    if (to >= max) {
        from -= 0.5;
    }

    return {
        from: from,
        to: to,
        showPoints: false
    };
};

/**
 * Creates a list of positions for the ticks on the axis. Filters out positions
 * that are outside min and max, or is inside an axis break.
 *
 * @param {Object} axis The Axis to get the tick positions from.
 * @param {number} axis.min The minimum value of the axis.
 * @param {number} axis.max The maximum value of the axis.
 * @param {function} axis.isInAnyBreak Function to determine if a position is
 * inside any breaks on the axis.
 * @returns {number[]} List of positions.
 */
var getTickPositions = function (axis) {
    return reduce(
        keys(axis.mapOfPosToGridNode),
        function (arr, key) {
            var pos = +key;
            if (
                axis.min <= pos &&
                axis.max >= pos &&
                !axis.isInAnyBreak(pos)
            ) {
                arr.push(pos);
            }
            return arr;
        },
        []
    );
};
/**
 * Check if a node is collapsed.
 * @param {object} axis The axis to check against.
 * @param {object} node The node to check if is collapsed.
 * @param {number} pos The tick position to collapse.
 * @returns {boolean} Returns true if collapsed, false if expanded.
 */
var isCollapsed = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);
    return some(breaks, function (b) {
        return b.from === obj.from && b.to === obj.to;
    });
};

/**
 * Calculates the new axis breaks to collapse a node.
 * @param {object} axis The axis to check against.
 * @param {object} node The node to collapse.
 * @param {number} pos The tick position to collapse.
 * @returns {array} Returns an array of the new breaks for the axis.
 */
var collapse = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);
    breaks.push(obj);
    return breaks;
};

/**
 * Calculates the new axis breaks to expand a node.
 * @param {object} axis The axis to check against.
 * @param {object} node The node to expand.
 * @param {number} pos The tick position to expand.
 * @returns {array} Returns an array of the new breaks for the axis.
 */
var expand = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);
    // Remove the break from the axis breaks array.
    return reduce(breaks, function (arr, b) {
        if (b.to !== obj.to || b.from !== obj.from) {
            arr.push(b);
        }
        return arr;
    }, []);
};

/**
 * Calculates the new axis breaks after toggling the collapse/expand state of a
 * node. If it is collapsed it will be expanded, and if it is exapended it will
 * be collapsed.
 * @param {object} axis The axis to check against.
 * @param {object} node The node to toggle.
 * @param {number} pos The tick position to toggle.
 * @returns {array} Returns an array of the new breaks for the axis.
 */
var toggleCollapse = function (axis, node) {
    return (
        isCollapsed(axis, node) ?
        expand(axis, node) :
        collapse(axis, node)
    );
};
var renderLabelIcon = function (tick, params) {
    var icon = tick.labelIcon,
        isNew = !icon,
        renderer = params.renderer,
        labelBox = params.xy,
        options = params.options,
        width = options.width,
        height = options.height,
        iconCenter = {
            x: labelBox.x - (width / 2) - options.padding,
            y: labelBox.y - (height / 2)
        },
        rotation = params.collapsed ? 90 : 180,
        shouldRender = params.show && H.isNumber(iconCenter.y);

    if (isNew) {
        tick.labelIcon = icon = renderer.path(renderer.symbols[options.type](
            options.x,
            options.y,
            width,
            height
        ))
        .addClass('highcharts-label-icon')
        .add(params.group);
    }

    // Set the new position, and show or hide
    if (!shouldRender) {
        icon.attr({ y: -9999 }); // #1338
    }

    /*= if (build.classic) { =*/
    // Presentational attributes
    icon
        .attr({
            'stroke-width': 1,
            'fill': pick(params.color, '${palette.neutralColor60}')
        })
        .css({
            cursor: 'pointer',
            stroke: options.lineColor,
            strokeWidth: options.lineWidth
        });
    /*= } =*/

    // Update the icon positions
    icon[isNew ? 'attr' : 'animate']({
        translateX: iconCenter.x,
        translateY: iconCenter.y,
        rotation: rotation
    });

};
var onTickHover = function (label) {
    label.addClass('highcharts-treegrid-node-active');
    /*= if (build.classic) { =*/
    label.css({
        textDecoration: 'underline'
    });
    /*= } =*/
};
var onTickHoverExit = function (label, options) {
    var css = defined(options.style) ? options.style : {};
    label.removeClass('highcharts-treegrid-node-active');
    /*= if (build.classic) { =*/
    label.css({
        textDecoration: css.textDecoration
    });
    /*= } =*/
};

/**
 * Creates a tree structure of the data, and the treegrid. Calculates
 * categories, and y-values of points based on the tree.
 * @param {Array} data All the data points to display in the axis.
 * @param {boolean} uniqueNames Wether or not the data node with the same name
 * should share grid cell. If true they do share cell. False by default.
 * @returns {object} Returns an object containing categories, mapOfIdToNode,
 * mapOfPosToGridNode, and tree.
 * @todo There should be only one point per line.
 * @todo It should be optional to have one category per point, or merge cells
 * @todo Add unit-tests.
 */
var getTreeGridFromData = function (data, uniqueNames, numberOfSeries) {
    var categories = [],
        collapsedNodes = [],
        mapOfIdToNode = {},
        mapOfPosToGridNode = {},
        posIterator = -1,
        uniqueNamesEnabled = isBoolean(uniqueNames) ? uniqueNames : false,
        tree,
        treeParams,
        updateYValuesAndTickPos;

    // Build the tree from the series data.
    treeParams = {
        // After the children has been created.
        after: function (node) {
            var gridNode = mapOfPosToGridNode[node.pos],
                height = 0,
                descendants = 0;
            each(gridNode.children, function (child) {
                descendants += child.descendants + 1;
                height = Math.max(child.height + 1, height);
            });
            gridNode.descendants = descendants;
            gridNode.height = height;
            if (gridNode.collapsed) {
                collapsedNodes.push(gridNode);
            }
        },
        // Before the children has been created.
        before: function (node) {
            var data = isObject(node.data) ? node.data : {},
                name = isString(data.name) ? data.name : '',
                parentNode = mapOfIdToNode[node.parent],
                parentGridNode = (
                    isObject(parentNode) ?
                    mapOfPosToGridNode[parentNode.pos] :
                    null
                ),
                hasSameName = function (x) {
                    return x.name === name;
                },
                gridNode,
                pos;

            // If not unique names, look for a sibling node with the same name.
            if (
                uniqueNamesEnabled &&
                isObject(parentGridNode) &&
                !!(gridNode = find(parentGridNode.children, hasSameName))
            ) {
                // If if there is a gridNode with the same name, reuse position.
                pos = gridNode.pos;
                // Add data node to list of nodes in the grid node.
                gridNode.nodes.push(node);
            } else {
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
                if (isObject(parentGridNode)) {
                    parentGridNode.children.push(gridNode);
                }
            }

            // Add data node to map
            if (isString(node.id)) {
                mapOfIdToNode[node.id] = node;
            }

            // If one of the points are collapsed, then start the grid node in
            // collapsed state.
            if (data.collapsed === true) {
                gridNode.collapsed = true;
            }

            // Assign pos to data node
            node.pos = pos;
        }
    };

    updateYValuesAndTickPos = function (map, numberOfSeries) {
        var setValues = function (gridNode, start, result) {
            var nodes = gridNode.nodes,
                end = start + (start === -1 ? 0 : numberOfSeries - 1),
                diff = (end - start) / 2,
                padding = 0.5,
                pos = start + diff;

            each(nodes, function (node) {
                var data = node.data;
                if (isObject(data)) {
                    // Update point
                    data.y = start + data.seriesIndex;
                    // Remove the property once used
                    delete data.seriesIndex;
                }
                node.pos = pos;
            });

            result[pos] = gridNode;

            gridNode.pos = pos;
            gridNode.tickmarkOffset = diff + padding;
            gridNode.collapseStart = end + padding;


            each(gridNode.children, function (child) {
                setValues(child, end + 1, result);
                end = child.collapseEnd - padding;
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
};

override(GridAxis.prototype, {
    init: function (proceed, chart, userOptions) {
        var axis = this,
            removeFoundExtremesEvent,
            isTreeGrid = userOptions.type === 'treegrid';
        // Set default and forced options for TreeGrid
        if (isTreeGrid) {
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
                    * @product gantt
                    * @sample {gantt} gantt/treegrid-axis/labels-levels
                    *           Levels on TreeGrid Labels
                    * @type {Array<Object>}
                    * @apioption yAxis.labels.levels
                    */
                    levels: [{
                        /**
                        * Specify the level which the options within this object
                        * applies to.
                        *
                        * @sample {gantt} gantt/treegrid-axis/labels-levels
                        */
                        level: undefined
                    }, {
                        level: 1,
                        style: {
                            fontWeight: 'bold'
                        }
                    }],

                    /**
                     * The symbol for the collapse and expand icon in a
                     * treegrid.
                     *
                     * @product gantt
                     * @optionparent yAxis.labels.symbol
                     */
                    symbol: {
                        /**
                         * The symbol type. Points to a definition function in
                         * the `Highcharts.Renderer.symbols` collection.
                         *
                         * @validvalue ['arc', 'circle', 'diamond', 'square', 'triangle', 'triangle-down']
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

            }, userOptions, { // User options
                // Forced options
                reversed: true,
                // grid.columns is not supported in treegrid
                grid: {
                    columns: undefined
                }
            });
        }

        // Now apply the original function with the original arguments,
        // which are sliced off this function's arguments
        proceed.apply(axis, [chart, userOptions]);
        if (isTreeGrid) {
            H.addEvent(axis.chart, 'beforeRender', function () {
                var labelOptions = axis.options && axis.options.labels;

                // beforeRender is fired after all the series is initialized,
                // which is an ideal time to update the axis.categories.
                axis.updateYNames();

                // Update yData now that we have calculated the y values
                // TODO: it would be better to be able to calculate y values
                // before Series.setData
                each(axis.series, function (series) {
                    series.yData = map(series.options.data, function (data) {
                        return data.y;
                    });
                });

                // Calculate the label options for each level in the tree.
                axis.mapOptionsToLevel = getLevelOptions({
                    defaults: labelOptions,
                    from: 1,
                    levels: labelOptions.levels,
                    to: axis.tree.height
                });

                // Collapse all the nodes belonging to a point where collapsed
                // equals true.
                // Can be called from beforeRender, if getBreakFromNode removes
                // its dependency on axis.max.
                removeFoundExtremesEvent =
                    H.addEvent(axis, 'foundExtremes', function () {
                        each(axis.collapsedNodes, function (node) {
                            var breaks = collapse(axis, node);
                            axis.setBreaks(breaks, false);
                        });
                        removeFoundExtremesEvent();
                    });
            });
            axis.hasNames = true;
            axis.options.showLastLabel = true;
        }
    },
    /**
     * Override to add indentation to axis.maxLabelDimensions.
     * @param  {Function}   proceed the original function
     * @returns {undefined}
     */
    getMaxLabelDimensions: function (proceed) {
        var axis = this,
            options = axis.options,
            labelOptions = options && options.labels,
            indentation = (
                labelOptions && isNumber(labelOptions.indentation) ?
                options.labels.indentation :
                0
            ),
            retVal = proceed.apply(axis, argsToArray(arguments)),
            isTreeGrid = axis.options.type === 'treegrid',
            treeDepth;

        if (isTreeGrid) {
            treeDepth = axis.mapOfPosToGridNode[-1].height;
            retVal.width += indentation * (treeDepth - 1);
        }

        return retVal;
    },
    /**
     * Generates a tick for initial positioning.
     *
     * @private
     * @param {function} proceed The original generateTick function.
     * @param {number} pos The tick position in axis values.
     */
    generateTick: function (proceed, pos) {
        var axis = this,
            mapOptionsToLevel = (
                isObject(axis.mapOptionsToLevel) ? axis.mapOptionsToLevel : {}
            ),
            isTreeGrid = axis.options.type === 'treegrid',
            ticks = axis.ticks,
            tick = ticks[pos],
            levelOptions,
            options,
            gridNode;

        if (isTreeGrid) {
            gridNode = axis.mapOfPosToGridNode[pos];
            levelOptions = mapOptionsToLevel[gridNode.depth];

            if (levelOptions) {
                options = {
                    labels: levelOptions
                };
            }

            if (!tick) {
                ticks[pos] = tick =
                    new GridAxisTick(axis, pos, null, undefined, {
                        category: gridNode.name,
                        tickmarkOffset: gridNode.tickmarkOffset,
                        options: options
                    });
            } else {
                // update labels depending on tick interval
                tick.parameters.category = gridNode.name;
                tick.options = options;
                tick.addLabel();
            }
        } else {
            proceed.apply(axis, argsToArray(arguments));
        }
    },
    /**
     * Set the tick positions, tickInterval, axis min and max.
     *
     * @private
     */
    setTickInterval: function (proceed) {
        var axis = this,
            options = axis.options,
            isTreeGrid = options.type === 'treegrid';

        if (isTreeGrid) {
            axis.min = pick(axis.userMin, options.min, axis.dataMin);
            axis.max = pick(axis.userMax, options.max, axis.dataMax);

            fireEvent(axis, 'foundExtremes');

            // setAxisTranslation modifies the min and max according to
            // axis breaks.
            axis.setAxisTranslation(true);

            axis.tickmarkOffset = 0.5;
            axis.tickInterval = 1;
            axis.tickPositions = getTickPositions(axis);
        } else {
            proceed.apply(axis, argsToArray(arguments));
        }
    }
});
override(GridAxisTick.prototype, {
    getLabelPosition: function (
        proceed,
        x,
        y,
        label,
        horiz,
        labelOptions,
        tickmarkOffset,
        index,
        step
    ) {
        var tick = this,
            lbOptions = pick(
                tick.options && tick.options.labels,
                labelOptions
            ),
            pos = tick.pos,
            axis = tick.axis,
            options = axis.options,
            isTreeGrid = options.type === 'treegrid',
            result = proceed.apply(
                tick,
                [x, y, label, horiz, lbOptions, tickmarkOffset, index, step]
            ),
            symbolOptions,
            indentation,
            mapOfPosToGridNode,
            node,
            level;

        if (isTreeGrid) {
            symbolOptions = (
                lbOptions && isObject(lbOptions.symbol) ?
                lbOptions.symbol :
                {}
            );
            indentation = (
                lbOptions && isNumber(lbOptions.indentation) ?
                lbOptions.indentation :
                0
            );
            mapOfPosToGridNode = axis.mapOfPosToGridNode;
            node = mapOfPosToGridNode && mapOfPosToGridNode[pos];
            level = (node && node.depth) || 1;
            result.x += (
                // Add space for symbols
                ((symbolOptions.width) + (symbolOptions.padding * 2)) +
                // Apply indentation
                ((level - 1) * indentation)
            );
        }

        return result;
    },
    renderLabel: function (proceed) {
        var tick = this,
            pos = tick.pos,
            axis = tick.axis,
            label = tick.label,
            mapOfPosToGridNode = axis.mapOfPosToGridNode,
            options = axis.options,
            labelOptions = pick(
                tick.options && tick.options.labels,
                options && options.labels
            ),
            symbolOptions = (
                labelOptions && isObject(labelOptions.symbol) ?
                labelOptions.symbol :
                {}
            ),
            node = mapOfPosToGridNode && mapOfPosToGridNode[pos],
            level = node && node.depth,
            isTreeGrid = options.type === 'treegrid',
            hasLabel = !!(label && label.element),
            shouldRender = inArray(pos, axis.tickPositions) > -1,
            prefixClassName = 'highcharts-treegrid-node-',
            collapsed,
            addClassName,
            removeClassName;

        if (isTreeGrid && node) {
            // Add class name for hierarchical styling.
            if (hasLabel) {
                label.addClass(prefixClassName + 'level-' + level);
            }
        }

        proceed.apply(tick, argsToArray(arguments));

        if (isTreeGrid && node && hasLabel && node.descendants > 0) {
            collapsed = isCollapsed(axis, node);

            renderLabelIcon(
                tick,
                {
                    /*= if (build.classic) { =*/
                    color: label.styles.color,
                    /*= } =*/
                    collapsed: collapsed,
                    group: label.parentGroup,
                    options: symbolOptions,
                    renderer: label.renderer,
                    show: shouldRender,
                    xy: label.xy
                }
            );

            // Add class name for the node.
            addClassName = prefixClassName +
                (collapsed ? 'collapsed' : 'expanded');
            removeClassName = prefixClassName +
                (collapsed ? 'expanded' : 'collapsed');

            label
                .addClass(addClassName)
                .removeClass(removeClassName);

            /*= if (build.classic) { =*/
            label.css({
                cursor: 'pointer'
            });
            /*= } =*/

            // Add events to both label text and icon
            each([label, tick.labelIcon], function (object) {
                if (!object.attachedTreeGridEvents) {
                    // On hover
                    H.addEvent(object.element, 'mouseover', function () {
                        onTickHover(label);
                    });

                    // On hover out
                    H.addEvent(object.element, 'mouseout', function () {
                        onTickHoverExit(label, labelOptions);
                    });

                    H.addEvent(object.element, 'click', function () {
                        tick.toggleCollapse();
                    });
                    object.attachedTreeGridEvents = true;
                }
            });
        }
    }
});

extend(GridAxisTick.prototype, /** @lends Highcharts.Tick.prototype */{
    /**
     * Collapse the grid cell. Used when axis is of type treegrid.
     * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for
     * an explicit call to {@link Highcharts.Chart#redraw}
     * @sample {gantt} gantt/treegrid-axis/collapsed-dynamically/demo.js
     * Dynamically collapse
     */
    collapse: function (redraw) {
        var tick = this,
            axis = tick.axis,
            pos = tick.pos,
            node = axis.mapOfPosToGridNode[pos],
            breaks = collapse(axis, node);
        axis.setBreaks(breaks, pick(redraw, true));
    },
    /**
     * Expand the grid cell. Used when axis is of type treegrid.
     *
     * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for
     * an explicit call to {@link Highcharts.Chart#redraw}
     * @sample {gantt} gantt/treegrid-axis/collapsed-dynamically/demo.js
     * Dynamically collapse
     */
    expand: function (redraw) {
        var tick = this,
            axis = tick.axis,
            pos = tick.pos,
            node = axis.mapOfPosToGridNode[pos],
            breaks = expand(axis, node);
        axis.setBreaks(breaks, pick(redraw, true));
    },
    /**
     * Toggle the collapse/expand state of the grid cell. Used when axis is of
     * type treegrid.
     *
     * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for
     * an explicit call to {@link Highcharts.Chart#redraw}
     * @sample {gantt} gantt/treegrid-axis/collapsed-dynamically/demo.js
     * Dynamically collapse
     */
    toggleCollapse: function (redraw) {
        var tick = this,
            axis = tick.axis,
            pos = tick.pos,
            node = axis.mapOfPosToGridNode[pos],
            breaks = toggleCollapse(axis, node);
        axis.setBreaks(breaks, pick(redraw, true));
    }
});

GridAxis.prototype.updateYNames = function () {
    var axis = this,
        options = axis.options,
        isTreeGrid = options.type === 'treegrid',
        uniqueNames = options.uniqueNames,
        isYAxis = !axis.isXAxis,
        series = axis.series,
        numberOfSeries = 0,
        treeGrid,
        data;

    if (isTreeGrid && isYAxis) {
        // Concatenate data from all series assigned to this axis.
        data = reduce(series, function (arr, s) {
            if (s.visible) {
                // Push all data to array
                each(s.options.data, function (data) {
                    if (isObject(data)) {
                        // Set series index on data. Removed again after use.
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

        // Calculate categories and the hierarchy for the grid.
        treeGrid = getTreeGridFromData(
            data,
            uniqueNames,
            (uniqueNames === true) ? numberOfSeries : 1
        );

        // Assign values to the axis.
        axis.categories = treeGrid.categories;
        axis.mapOfPosToGridNode = treeGrid.mapOfPosToGridNode;
        // Used on init to start a node as collapsed
        axis.collapsedNodes = treeGrid.collapsedNodes;
        axis.hasNames = true;
        axis.tree = treeGrid.tree;
    }
};

// Make utility functions available for testing.
GridAxis.prototype.utils = {
    getNode: Tree.getNode
};
