/* *
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

var addEvent = H.addEvent,
    argsToArray = function (args) {
        return Array.prototype.slice.call(args, 1);
    },
    defined = H.defined,
    extend = H.extend,
    find = H.find,
    fireEvent = H.fireEvent,
    getLevelOptions = mixinTreeSeries.getLevelOptions,
    merge = H.merge,
    isBoolean = function (x) {
        return typeof x === 'boolean';
    },
    isNumber = H.isNumber,
    isObject = function (x) {
        // Always use strict mode.
        return H.isObject(x, true);
    },
    isString = H.isString,
    pick = H.pick,
    wrap = H.wrap,
    GridAxis = H.Axis,
    GridAxisTick = H.Tick;

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
 * @private
 * @function getTickPositions
 *
 * @param {Highcharts.Axis} axis
 *        The Axis to get the tick positions from.
 *
 * @return {Array<number>}
 *         List of positions.
 */
var getTickPositions = function (axis) {
    return Object.keys(axis.mapOfPosToGridNode).reduce(
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
 *
 * @private
 * @function isCollapsed
 *
 * @param {Highcharts.Axis} axis
 *        The axis to check against.
 *
 * @param {object} node
 *        The node to check if is collapsed.
 *
 * @param {number} pos
 *        The tick position to collapse.
 *
 * @return {boolean}
 *         Returns true if collapsed, false if expanded.
 */
var isCollapsed = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);

    return breaks.some(function (b) {
        return b.from === obj.from && b.to === obj.to;
    });
};

/**
 * Calculates the new axis breaks to collapse a node.
 *
 * @private
 * @function collapse
 *
 * @param {Highcharts.Axis} axis
 *        The axis to check against.
 *
 * @param {object} node
 *        The node to collapse.
 *
 * @param {number} pos
 *        The tick position to collapse.
 *
 * @return {Array<object>}
 *         Returns an array of the new breaks for the axis.
 */
var collapse = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);

    breaks.push(obj);
    return breaks;
};

/**
 * Calculates the new axis breaks to expand a node.
 *
 * @private
 * @function expand
 *
 * @param {Highcharts.Axis} axis
 *        The axis to check against.
 *
 * @param {object} node
 *        The node to expand.
 *
 * @param {number} pos
 *        The tick position to expand.
 *
 * @returns {Array<object>} Returns an array of the new breaks for the axis.
 */
var expand = function (axis, node) {
    var breaks = (axis.options.breaks || []),
        obj = getBreakFromNode(node, axis.max);

    // Remove the break from the axis breaks array.
    return breaks.reduce(function (arr, b) {
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
 *
 * @private
 * @function toggleCollapse
 *
 * @param {Highcharts.Axis} axis
 *        The axis to check against.
 *
 * @param {object} node
 *        The node to toggle.
 *
 * @param {number} pos
 *        The tick position to toggle.
 *
 * @return {Array<object>}
 *         Returns an array of the new breaks for the axis.
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

    // Presentational attributes
    if (!renderer.styledMode) {
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
    }

    // Update the icon positions
    icon[isNew ? 'attr' : 'animate']({
        translateX: iconCenter.x,
        translateY: iconCenter.y,
        rotation: rotation
    });

};
var onTickHover = function (label) {
    label.addClass('highcharts-treegrid-node-active');

    if (!label.renderer.styledMode) {
        label.css({
            textDecoration: 'underline'
        });
    }
};
var onTickHoverExit = function (label, options) {
    var css = defined(options.style) ? options.style : {};

    label.removeClass('highcharts-treegrid-node-active');

    if (!label.renderer.styledMode) {
        label.css({
            textDecoration: css.textDecoration
        });
    }
};

/**
 * Builds the tree of categories and calculates its positions.
 *
 * @param {object} e Event object
 * @param {object} e.target The chart instance which the event was fired on.
 * @param {object[]} e.target.axes The axes of the chart.
 */
var onBeforeRender = function (e) {
    var chart = e.target,
        axes = chart.axes;

    axes
        .filter(function (axis) {
            return axis.options.type === 'treegrid';
        })
        .forEach(function (axis) {
            var labelOptions = axis.options && axis.options.labels,
                removeFoundExtremesEvent;

            // setScale is fired after all the series is initialized,
            // which is an ideal time to update the axis.categories.
            axis.updateYNames();

            // Update yData now that we have calculated the y values
            // TODO: it would be better to be able to calculate y values
            // before Series.setData
            axis.series.forEach(function (series) {
                series.yData = series.options.data.map(function (data) {
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
                    axis.collapsedNodes.forEach(function (node) {
                        var breaks = collapse(axis, node);

                        axis.setBreaks(breaks, false);
                    });
                    removeFoundExtremesEvent();
                });
        });
};

/**
 * Creates a tree structure of the data, and the treegrid. Calculates
 * categories, and y-values of points based on the tree.
 *
 * @private
 * @function getTreeGridFromData
 *
 * @param {Array<*>} data
 *        All the data points to display in the axis.
 *
 * @param {boolean} uniqueNames
 *        Wether or not the data node with the same name should share grid cell.
 *        If true they do share cell. False by default.
 *
 * @return {object}
 *         Returns an object containing categories, mapOfIdToNode,
 *         mapOfPosToGridNode, and tree.
 *
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

            gridNode.children.forEach(function (child) {
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

            nodes.forEach(function (node) {
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


            gridNode.children.forEach(function (child) {
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
            isTreeGrid = userOptions.type === 'treegrid';

        // Set default and forced options for TreeGrid
        if (isTreeGrid) {

            // Add event for updating the categories of a treegrid.
            // NOTE Preferably these events should be set on the axis.
            addEvent(chart, 'beforeRender', onBeforeRender);
            addEvent(chart, 'beforeRedraw', onBeforeRender);

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
                    */
                    levels: [{
                        /**
                        * Specify the level which the options within this object
                        * applies to.
                        *
                        * @sample {gantt} gantt/treegrid-axis/labels-levels
                        *
                        * @type      {number}
                        * @product   gantt
                        * @apioption yAxis.labels.levels.level
                        */
                        level: undefined
                    }, {
                        level: 1,
                        /**
                         * @type      {Highcharts.CSSObject}
                         * @product   gantt
                         * @apioption yAxis.labels.levels.style
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
                     */
                    symbol: {
                        /**
                         * The symbol type. Points to a definition function in
                         * the `Highcharts.Renderer.symbols` collection.
                         *
                         * @validvalue ["arc", "circle", "diamond", "square", "triangle", "triangle-down"]
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
            axis.hasNames = true;
            axis.options.showLastLabel = true;
        }
    },
    /**
     * Override to add indentation to axis.maxLabelDimensions.
     *
     * @private
     * @function Highcharts.GridAxis#getMaxLabelDimensions
     *
     * @param {Function} proceed
     *        The original function
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

        if (isTreeGrid && this.mapOfPosToGridNode) {
            treeDepth = axis.mapOfPosToGridNode[-1].height;
            retVal.width += indentation * (treeDepth - 1);
        }

        return retVal;
    },
    /**
     * Generates a tick for initial positioning.
     *
     * @private
     * @function Highcharts.GridAxis#generateTick
     *
     * @param {Function} proceed
     *        The original generateTick function.
     *
     * @param {number} pos
     *        The tick position in axis values.
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
     * @function Highcharts.GridAxis#setTickInterval
     *
     * @param {Function} proceed
     *        The original setTickInterval function.
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
            axis.tickPositions = this.mapOfPosToGridNode ?
                getTickPositions(axis) :
                [];
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
            shouldRender = axis.tickPositions.indexOf(pos) > -1,
            prefixClassName = 'highcharts-treegrid-node-',
            collapsed,
            addClassName,
            removeClassName,
            styledMode = axis.chart.styledMode;

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
                    color: !styledMode && label.styles.color,
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

            if (!styledMode) {
                label.css({
                    cursor: 'pointer'
                });
            }

            // Add events to both label text and icon
            [label, tick.labelIcon].forEach(function (object) {
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
     *
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.GridAxisTick#collapse
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call to
     *        {@link Highcharts.Chart#redraw}
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
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.GridAxisTick#expand
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call to
     *        {@link Highcharts.Chart#redraw}
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
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.GridAxisTick#toggleCollapse
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart or wait for an explicit call to
     *        {@link Highcharts.Chart#redraw}
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
        data = series.reduce(function (arr, s) {
            if (s.visible) {
                // Push all data to array
                s.options.data.forEach(function (data) {
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
