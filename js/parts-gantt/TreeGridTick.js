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
import TreeGridUtils from './TreeGridUtils.js';
var collapse = TreeGridUtils.collapse, expand = TreeGridUtils.expand, isCollapsed = TreeGridUtils.isCollapsed, toggleCollapse = TreeGridUtils.toggleCollapse;
import U from '../parts/Utilities.js';
var addEvent = U.addEvent, defined = U.defined, isObject = U.isObject, isNumber = U.isNumber, pick = U.pick, wrap = U.wrap;
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * @private
 * @class
 */
var TreeGridTickAdditions = /** @class */ (function () {
    /* *
     *
     *  Consutructors
     *
     * */
    /**
     * @private
     */
    function TreeGridTickAdditions(tick) {
        this.tick = tick;
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Collapse the grid cell. Used when axis is of type treegrid.
     *
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.Tick#collapse
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart or wait for an explicit call to
     * {@link Highcharts.Chart#redraw}
     */
    TreeGridTickAdditions.prototype.collapse = function (redraw) {
        var tick = this.tick, axis = tick.axis, brokenAxis = axis.brokenAxis, pos = tick.pos, node = axis.mapOfPosToGridNode[pos], breaks = collapse(axis, node);
        if (brokenAxis) {
            brokenAxis.setBreaks(breaks, pick(redraw, true));
        }
    };
    /**
     * Expand the grid cell. Used when axis is of type treegrid.
     *
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.Tick#expand
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart or wait for an explicit call to
     * {@link Highcharts.Chart#redraw}
     */
    TreeGridTickAdditions.prototype.expand = function (redraw) {
        var tick = this.tick, axis = tick.axis, brokenAxis = axis.brokenAxis, pos = tick.pos, node = axis.mapOfPosToGridNode[pos], breaks = expand(axis, node);
        if (brokenAxis) {
            brokenAxis.setBreaks(breaks, pick(redraw, true));
        }
    };
    /**
     * Toggle the collapse/expand state of the grid cell. Used when axis is of
     * type treegrid.
     *
     * @see gantt/treegrid-axis/collapsed-dynamically/demo.js
     *
     * @private
     * @function Highcharts.Tick#toggleCollapse
     *
     * @param {boolean} [redraw=true]
     * Whether to redraw the chart or wait for an explicit call to
     * {@link Highcharts.Chart#redraw}
     */
    TreeGridTickAdditions.prototype.toggleCollapse = function (redraw) {
        var tick = this.tick, axis = tick.axis, brokenAxis = axis.brokenAxis, pos = tick.pos, node = axis.mapOfPosToGridNode[pos], breaks = toggleCollapse(axis, node);
        if (brokenAxis) {
            brokenAxis.setBreaks(breaks, pick(redraw, true));
        }
    };
    return TreeGridTickAdditions;
}());
/**
 * @private
 */
var TreeGridTick;
(function (TreeGridTick) {
    /**
     * @private
     */
    function compose(TickClass) {
        addEvent(TickClass, 'init', onInit);
        // wrap(TickClass.prototype, 'getLabelPosition', wrapGetLabelPosition);
        // wrap(TickClass.prototype, 'renderLabel', wrapRenderLabel);
    }
    TreeGridTick.compose = compose;
    /**
     * @private
     */
    function onInit() {
        var tick = this;
        if (!tick.treeGrid) {
            tick.treeGrid = new TreeGridTickAdditions(tick);
        }
    }
    /**
     * @private
     */
    function onTickHover(label) {
        label.addClass('highcharts-treegrid-node-active');
        if (!label.renderer.styledMode) {
            label.css({
                textDecoration: 'underline'
            });
        }
    }
    /**
     * @private
     */
    function onTickHoverExit(label, options) {
        var css = defined(options.style) ? options.style : {};
        label.removeClass('highcharts-treegrid-node-active');
        if (!label.renderer.styledMode) {
            label.css({ textDecoration: css.textDecoration });
        }
    }
    /**
     * @private
     */
    function renderLabelIcon(tick, params) {
        var icon = tick.labelIcon, isNew = !icon, renderer = params.renderer, labelBox = params.xy, options = params.options, width = options.width, height = options.height, iconCenter = {
            x: labelBox.x - (width / 2) - options.padding,
            y: labelBox.y - (height / 2)
        }, rotation = params.collapsed ? 90 : 180, shouldRender = params.show && isNumber(iconCenter.y);
        if (isNew) {
            tick.labelIcon = icon = renderer
                .path(renderer.symbols[options.type](options.x, options.y, width, height))
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
    }
    /**
     * @private
     */
    function wrapGetLabelPosition(proceed, x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
        var tick = this, lbOptions = pick(tick.options && tick.options.labels, labelOptions), pos = tick.pos, axis = tick.axis, options = axis.options, isTreeGrid = options.type === 'treegrid', result = proceed.apply(tick, [x, y, label, horiz, lbOptions, tickmarkOffset, index, step]), symbolOptions, indentation, mapOfPosToGridNode, node, level;
        if (isTreeGrid) {
            symbolOptions = (lbOptions && isObject(lbOptions.symbol, true) ?
                lbOptions.symbol :
                {});
            indentation = (lbOptions && isNumber(lbOptions.indentation) ?
                lbOptions.indentation :
                0);
            mapOfPosToGridNode = axis.mapOfPosToGridNode;
            node = mapOfPosToGridNode && mapOfPosToGridNode[pos];
            level = (node && node.depth) || 1;
            result.x += (
            // Add space for symbols
            ((symbolOptions.width) + (symbolOptions.padding * 2)) +
                // Apply indentation
                ((level - 1) * indentation));
        }
        return result;
    }
    /**
     * @private
     */
    function wrapRenderLabel(proceed) {
        var tick = this, pos = tick.pos, axis = tick.axis, label = tick.label, mapOfPosToGridNode = axis.mapOfPosToGridNode, options = axis.options, labelOptions = pick(tick.options && tick.options.labels, options && options.labels), symbolOptions = (labelOptions && isObject(labelOptions.symbol, true) ?
            labelOptions.symbol :
            {}), node = mapOfPosToGridNode && mapOfPosToGridNode[pos], level = node && node.depth, isTreeGrid = options.type === 'treegrid', hasLabel = !!(label && label.element), shouldRender = axis.tickPositions.indexOf(pos) > -1, prefixClassName = 'highcharts-treegrid-node-', collapsed, addClassName, removeClassName, styledMode = axis.chart.styledMode;
        if (isTreeGrid && node) {
            // Add class name for hierarchical styling.
            if (hasLabel) {
                label.addClass(prefixClassName + 'level-' + level);
            }
        }
        proceed.apply(tick, arguments);
        if (isTreeGrid &&
            node &&
            hasLabel &&
            node.descendants &&
            node.descendants > 0) {
            collapsed = isCollapsed(axis, node);
            renderLabelIcon(tick, {
                color: !styledMode && label.styles && label.styles.color || '',
                collapsed: collapsed,
                group: label.parentGroup,
                options: symbolOptions,
                renderer: label.renderer,
                show: shouldRender,
                xy: label.xy
            });
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
                    addEvent(object.element, 'mouseover', function () {
                        onTickHover(label);
                    });
                    // On hover out
                    addEvent(object.element, 'mouseout', function () {
                        onTickHoverExit(label, labelOptions);
                    });
                    addEvent(object.element, 'click', function () {
                        tick.treeGrid.toggleCollapse();
                    });
                    object.attachedTreeGridEvents = true;
                }
            });
        }
    }
})(TreeGridTick || (TreeGridTick = {}));
export default TreeGridTick;
