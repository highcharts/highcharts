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
import '../modules/broken-axis.src.js';
var argsToArray = function (args) {
        return Array.prototype.slice.call(args, 1);
    },
    indentPx = 10,
    iconRadius = 5,
    iconSpacing = 5,
    each = H.each,
    extend = H.extend,
    merge = H.merge,
    inArray = H.inArray,
    pick = H.pick,
    reduce = Tree.reduce,
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

var getBreakFromNode = function (node, pos, max) {
    var from = pos + 0.5,
        to = from + node.descendants;

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
 * Check if a node is collapsed.
 * @param {object} axis The axis to check against.
 * @param {object} node The node to check if is collapsed.
 * @param {number} pos The tick position to collapse.
 * @returns {boolean} Returns true if collapsed, false if expanded.
 */
var isCollapsed = function (axis, node, pos) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, pos, axis.max);
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
var collapse = function (axis, node, pos) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, pos, axis.max);
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
var expand = function (axis, node, pos) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, pos, axis.max);
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
var toggleCollapse = function (axis, node, pos) {
    return (
        isCollapsed(axis, node, pos) ?
        expand(axis, node, pos) :
        collapse(axis, node, pos)
    );
};

var renderLabelIcon = function (label, radius, spacing, collapsed) {
    var renderer = label.renderer,
        labelBox = label.xy,
        icon = label.treeIcon,
        iconPosition = {
            x: labelBox.x - (radius * 2) - spacing,
            y: labelBox.y - (radius * 2)
        },
        iconCenter = {
            x: iconPosition.x + radius,
            y: iconPosition.y + radius
        },
        rotation = collapsed ? 90 : 180;
    if (!icon) {
        label.treeIcon = icon = renderer.path(renderer.symbols.triangle(
            0 - radius,
            0 - radius,
            radius * 2,
            radius * 2
        ))
        .attr({
            translateX: iconCenter.x,
            translateY: iconCenter.y,
            rotation: rotation
        })
        .add(label.parentGroup);
    } else {
        icon.animate({
            translateX: iconCenter.x,
            translateY: iconCenter.y,
            rotation: rotation
        });
    }
    icon.attr({
        'stroke-width': 1,
        'fill': pick(label.styles.color, '#666')
    });

    // Set the new position, and show or hide
    if (!H.isNumber(iconPosition.y)) {
        icon.attr('y', -9999); // #1338
    }
};
var onTickHover = function (label) {
    label.addClass('highcharts-treegrid-node-active');
    /*= if (build.classic) { =*/
    label.css({
        textDecoration: 'underline'
    });
    /*= } =*/
};
var onTickHoverExit = function (label) {
    label.addClass('highcharts-treegrid-node-active');
    /*= if (build.classic) { =*/
    label.css({
        textDecoration: 'none'
    });
    /*= } =*/
};
override(GridAxis.prototype, {
    init: function (proceed, chart, userOptions) {
        var axis = this,
            isTreeGrid = userOptions.type === 'tree-grid';
        // Set default and forced options for TreeGrid
        if (isTreeGrid) {
            merge(true, userOptions, {
                // Default options
                grid: true,
                labels: {
                    align: 'left'
                }
            }, userOptions, { // User options
                // Forced options
                reversed: true
            });
        }

        // Now apply the original function with the original arguments,
        // which are sliced off this function's arguments
        proceed.apply(axis, argsToArray(arguments));
        if (isTreeGrid) {
            axis.hasNames = true;
            axis.options.showLastLabel = true;
        }
    },
    /**
     * Override to add indentation to axis.maxLabelLength.
     * @param  {Function}   proceed the original function
     * @returns {undefined}
     */
    getMaxLabelLength: function (proceed) {
        var axis = this,
            retVal = proceed.apply(axis, argsToArray(arguments)),
            treeDepth = axis.tree && axis.tree.height;

        if (axis.options.type === 'tree-grid') {
            retVal += indentPx * (treeDepth - 1);
        }

        return retVal;
    }
});
override(GridAxisTick.prototype, {
    renderLabel: function (proceed, xy) {
        var tick = this,
            pos = tick.pos,
            axis = tick.axis,
            label = tick.label,
            treeGridMap = axis.treeGridMap,
            options = axis.options,
            node = treeGridMap && treeGridMap[pos],
            level = node && node.depth - 1,
            isTreeGrid = options.type === 'tree-grid',
            hasLabel = label && label.element;

        if (isTreeGrid && node) {
            xy.x += iconRadius + (iconSpacing * 2) + (level * indentPx);
        }
        proceed.apply(tick, argsToArray(arguments));
        if (isTreeGrid && node) {
            if (hasLabel && node.children.length > 0) {
                renderLabelIcon(
                    label,
                    iconRadius,
                    iconSpacing,
                    isCollapsed(axis, node, pos)
                );
                label.css({
                    cursor: 'pointer'
                });
                label.treeIcon.css({
                    cursor: 'pointer'
                });

                // Add events to both label text and icon
                each([label, label.treeIcon], function (object) {
                    if (!object.attachedTreeGridEvents) {
                        // On hover
                        H.addEvent(object.element, 'mouseover', function () {
                            onTickHover(label);
                        });

                        // On hover out
                        H.addEvent(object.element, 'mouseout', function () {
                            onTickHoverExit(label);
                        });

                        H.addEvent(object.element, 'click', function () {
                            tick.toggleCollapse();
                        });
                        object.attachedTreeGridEvents = true;
                    }
                });
            }
        }
    }
});

/**
 * Collapse the grid cell.
 * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for an
 * explicit call to {@link Highcharts.Chart#redraw}
 * @sample {gantt} gantt/tree-grid-axis/collapsed/demo.js Dynamically collapse
 */
GridAxisTick.prototype.collapse = function (redraw) {
    var tick = this,
        axis = tick.axis,
        pos = tick.pos,
        node = axis.treeGridMap[pos],
        breaks = collapse(axis, node, pos);
    axis.setBreaks(breaks, pick(redraw, true));
};

/**
 * Expand the grid cell.
 * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for an
 * explicit call to {@link Highcharts.Chart#redraw}
 * @sample {gantt} gantt/tree-grid-axis/collapsed/demo.js Dynamically collapse
 */
GridAxisTick.prototype.expand = function (redraw) {
    var tick = this,
        axis = tick.axis,
        pos = tick.pos,
        node = axis.treeGridMap[pos],
        breaks = expand(axis, node, pos);
    axis.setBreaks(breaks, pick(redraw, true));
};

/**
 * Toggle the collapse/expand state of the grid cell.
 * @param  {boolean} [redraw=true] Whether to redraw the chart or wait for an
 * explicit call to {@link Highcharts.Chart#redraw}
 * @sample {gantt} gantt/tree-grid-axis/collapsed/demo.js Dynamically collapse
 */
GridAxisTick.prototype.toggleCollapse = function (redraw) {
    var tick = this,
        axis = tick.axis,
        pos = tick.pos,
        node = axis.treeGridMap[pos],
        breaks = toggleCollapse(axis, node, pos);
    axis.setBreaks(breaks, pick(redraw, true));
};

GridAxis.prototype.updateYNames = function () {
    var axis = this,
        isTreeGrid = axis.options.type === 'tree-grid',
        isYAxis = !axis.isXAxis,
        series = axis.series,
        data;

    if (isTreeGrid && isYAxis) {
        // Concatenate data from all series assigned to this axis.
        data = reduce(series, function (arr, s) {
            return arr.concat(s.options.data);
        }, []);
        // Build the tree from the series data.
        axis.tree = Tree.getTree(data);
        axis.categories = getCategoriesFromTree(axis.tree);
        axis.treeGridMap = mapTickPosToNode(axis.tree, axis.categories);
        axis.hasNames = true;
    }
};

GridAxis.prototype.nameToY = function (point) {
    var axis = this,
        name = point.name;
    if (!axis.categories) {
        axis.updateYNames();
    }
    return inArray(name, axis.categories);
};
