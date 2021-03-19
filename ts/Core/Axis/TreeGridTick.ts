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

import type ColorType from '../Color/ColorType';
import type CSSObject from '../Renderer/CSSObject';
import type PositionObject from '../Renderer/PositionObject';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';
import type Tick from './Tick';
import type TreeGridAxis from './TreeGridAxis';
import palette from '../../Core/Color/Palette.js';
import U from '../Utilities.js';
const {
    addEvent,
    defined,
    isObject,
    isNumber,
    pick,
    wrap
} = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
interface TreeGridTick extends Tick {
    axis: TreeGridAxis;
    options: TreeGridAxis.Options;
    treeGrid: TreeGridTick.Additions;
}

/**
 * @private
 */
namespace TreeGridTick {

    /* *
     *
     *  Interfaces
     *
     * */

    export interface LabelIconObject {
        collapsed?: boolean;
        color: ColorType;
        group?: SVGElement;
        options: TreeGridAxis.LabelIconOptionsObject;
        renderer: Highcharts.Renderer;
        show: boolean;
        xy: PositionObject;
    }

    /* *
     *
     *  Variables
     *
     * */

    let applied: boolean = false;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(TickClass: typeof Tick): void {

        if (!applied) {

            addEvent(TickClass, 'init', onInit);

            wrap(TickClass.prototype, 'getLabelPosition', wrapGetLabelPosition);
            wrap(TickClass.prototype, 'renderLabel', wrapRenderLabel);

            // backwards compatibility
            (TickClass.prototype as any).collapse = function (this: TreeGridTick, redraw?: boolean): void {
                this.treeGrid.collapse(redraw);
            };
            (TickClass.prototype as any).expand = function (this: TreeGridTick, redraw?: boolean): void {
                this.treeGrid.expand(redraw);
            };
            (TickClass.prototype as any).toggleCollapse = function (this: TreeGridTick, redraw?: boolean): void {
                this.treeGrid.toggleCollapse(redraw);
            };

            applied = true;
        }
    }

    /**
     * @private
     */
    function onInit(this: Tick): void {
        const tick = this as TreeGridTick;

        if (!tick.treeGrid) {
            tick.treeGrid = new Additions(tick);
        }
    }

    /**
     * @private
     */
    function onTickHover(label: SVGElement): void {
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
    function onTickHoverExit(
        label: SVGElement,
        options: SVGAttributes
    ): void {
        const css: CSSObject = isObject(options.style) ? options.style : {};

        label.removeClass('highcharts-treegrid-node-active');

        if (!label.renderer.styledMode) {
            label.css({ textDecoration: css.textDecoration });
        }
    }

    /**
     * @private
     */
    function renderLabelIcon(
        tick: TreeGridTick,
        params: LabelIconObject
    ): void {
        const treeGrid = tick.treeGrid,
            isNew = !treeGrid.labelIcon,
            renderer = params.renderer,
            labelBox = params.xy,
            options = params.options,
            width = options.width || 0,
            height = options.height || 0,
            iconCenter = {
                x: labelBox.x - (width / 2) - (options.padding || 0),
                y: labelBox.y - (height / 2)
            },
            rotation = params.collapsed ? 90 : 180,
            shouldRender = params.show && isNumber(iconCenter.y);
        let icon = treeGrid.labelIcon;

        if (!icon) {
            treeGrid.labelIcon = icon = renderer
                .path(renderer.symbols[(options as any).type](
                    options.x || 0,
                    options.y || 0,
                    width,
                    height
                ))
                .addClass('highcharts-label-icon')
                .add(params.group);
        }

        // Set the new position, and show or hide
        icon.attr({ y: shouldRender ? 0 : -9999 }); // #14904, #1338

        // Presentational attributes
        if (!renderer.styledMode) {
            icon
                .attr({
                    cursor: 'pointer',
                    'fill': pick(params.color, palette.neutralColor60),
                    'stroke-width': 1,
                    stroke: options.lineColor,
                    strokeWidth: options.lineWidth || 0
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
    function wrapGetLabelPosition(
        this: TreeGridTick,
        proceed: Function,
        x: number,
        y: number,
        label: SVGElement,
        horiz: boolean,
        labelOptions: TreeGridAxis.LabelsOptions,
        tickmarkOffset: number,
        index: number,
        step: number
    ): PositionObject {
        const tick = this,
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
            );
        let symbolOptions,
            indentation,
            mapOfPosToGridNode,
            node,
            level;

        if (isTreeGrid) {
            symbolOptions = (
                lbOptions && isObject(lbOptions.symbol, true) ?
                    lbOptions.symbol :
                    {}
            );
            indentation = (
                lbOptions && isNumber(lbOptions.indentation) ?
                    lbOptions.indentation :
                    0
            );
            mapOfPosToGridNode = axis.treeGrid.mapOfPosToGridNode;
            node = mapOfPosToGridNode && mapOfPosToGridNode[pos];
            level = (node && node.depth) || 1;
            result.x += (
                // Add space for symbols
                (
                    (symbolOptions.width || 0) +
                    ((symbolOptions.padding || 0) * 2)
                ) +
                // Apply indentation
                ((level - 1) * indentation)
            );
        }

        return result;
    }

    /**
     * @private
     */
    function wrapRenderLabel(
        this: TreeGridTick,
        proceed: Function
    ): void {
        const tick = this,
            pos = tick.pos,
            axis = tick.axis,
            label = tick.label,
            mapOfPosToGridNode = axis.treeGrid.mapOfPosToGridNode,
            options = axis.options,
            labelOptions = pick(
                tick.options && tick.options.labels,
                options && options.labels
            ),
            symbolOptions = (
                labelOptions && isObject(labelOptions.symbol, true) ?
                    labelOptions.symbol :
                    {}
            ),
            node = mapOfPosToGridNode && mapOfPosToGridNode[pos],
            level = node && node.depth,
            isTreeGrid = options.type === 'treegrid',
            shouldRender = axis.tickPositions.indexOf(pos) > -1,
            prefixClassName = 'highcharts-treegrid-node-',
            styledMode = axis.chart.styledMode;
        let collapsed,
            addClassName,
            removeClassName;

        if (isTreeGrid && node) {
            // Add class name for hierarchical styling.
            if (
                label &&
                label.element
            ) {
                label.addClass(prefixClassName + 'level-' + level);
            }
        }

        proceed.apply(tick, Array.prototype.slice.call(arguments, 1));

        if (
            isTreeGrid &&
            label &&
            label.element &&
            node &&
            node.descendants &&
            node.descendants > 0
        ) {
            collapsed = axis.treeGrid.isCollapsed(node);

            renderLabelIcon(
                tick,
                {
                    color: !styledMode && label.styles && label.styles.color || '',
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
            [label, tick.treeGrid.labelIcon].forEach(function (
                object: (SVGElement|undefined)
            ): void {
                if (object && !object.attachedTreeGridEvents) {
                    // On hover
                    addEvent(object.element, 'mouseover', function (): void {
                        onTickHover(label);
                    });

                    // On hover out
                    addEvent(object.element, 'mouseout', function (): void {
                        onTickHoverExit(label, labelOptions as SVGAttributes);
                    });

                    addEvent(object.element, 'click', function (): void {
                        tick.treeGrid.toggleCollapse();
                    });
                    object.attachedTreeGridEvents = true;
                }
            });
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
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(tick: TreeGridTick) {
            this.tick = tick;
        }

        /* *
         *
         *  Properties
         *
         * */

        public tick: TreeGridTick;
        public labelIcon?: SVGElement;

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
        public collapse(redraw?: boolean): void {
            const tick = this.tick,
                axis = tick.axis,
                brokenAxis = axis.brokenAxis;

            if (
                brokenAxis &&
                axis.treeGrid.mapOfPosToGridNode
            ) {
                const pos = tick.pos,
                    node = axis.treeGrid.mapOfPosToGridNode[pos],
                    breaks = axis.treeGrid.collapse(node);

                brokenAxis.setBreaks(breaks, pick(redraw, true));
            }
        }

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
        public expand(redraw?: boolean): void {
            const tick = this.tick,
                axis = tick.axis,
                brokenAxis = axis.brokenAxis;

            if (
                brokenAxis &&
                axis.treeGrid.mapOfPosToGridNode
            ) {
                const pos = tick.pos,
                    node = axis.treeGrid.mapOfPosToGridNode[pos],
                    breaks = axis.treeGrid.expand(node);

                brokenAxis.setBreaks(breaks, pick(redraw, true));
            }
        }

        /**
         * Toggle the collapse/expand state of the grid cell. Used when axis is
         * of type treegrid.
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
        public toggleCollapse(redraw?: boolean): void {
            const tick = this.tick,
                axis = tick.axis,
                brokenAxis = axis.brokenAxis;

            if (
                brokenAxis &&
                axis.treeGrid.mapOfPosToGridNode
            ) {
                const pos = tick.pos,
                    node = axis.treeGrid.mapOfPosToGridNode[pos],
                    breaks = axis.treeGrid.toggleCollapse(node);

                brokenAxis.setBreaks(breaks, pick(redraw, true));
            }
        }
    }
}

export default TreeGridTick;
