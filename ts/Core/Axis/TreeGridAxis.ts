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

import type AxisTypes from './Types';
import type Chart from '../Chart/Chart';
import type ColorType from '../Color/ColorType';
import type GanttPoint from '../../Series/Gantt/GanttPoint';
import type GanttPointOptions from '../../Series/Gantt/GanttPointOptions';
import type GanttSeries from '../../Series/Gantt/GanttSeries';
import type {
    PointOptions,
    PointShortOptions
} from '../Series/PointOptions';
import type SizeObject from '../Renderer/SizeObject';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import Axis from './Axis.js';
import Tick from './Tick.js';
import Tree from '../../Gantt/Tree.js';
import TreeGridTick from './TreeGridTick.js';
import mixinTreeSeries from '../../Mixins/TreeSeries.js';
const { getLevelOptions } = mixinTreeSeries;
import U from '../Utilities.js';
const {
    addEvent,
    find,
    fireEvent,
    isArray,
    isNumber,
    isObject,
    isString,
    merge,
    pick,
    wrap
} = U;

import './GridAxis.js';
import './BrokenAxis.js';

declare module '../Series/PointOptions' {
    interface PointOptions extends Highcharts.TreePointOptionsObject {
        collapsed?: boolean;
        seriesIndex?: number;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            utils: TreeGridAxisUtilsObject;
        }
        interface TreeGridAxisUtilsObject {
            getNode: typeof Tree['getNode'];
        }
    }
}

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        treeGrid?: TreeGridAxis['treeGrid'];
    }
    interface AxisTypeRegistry {
        TreeGridAxis: TreeGridAxis;
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * @private
 */
interface TreeGridAxis extends Axis {
    dataMax: number;
    dataMin: number;
    max: number;
    min: number;
    options: TreeGridAxis.Options;
    series: Array<GanttSeries>;
    treeGrid: TreeGridAxis.Additions;
}

/**
 * @private
 */
namespace TreeGridAxis {

    /* *
     *
     *  Interfaces
     *
     * */

    export interface AxisBreakObject extends AxisTypes.AxisBreakObject {
        showPoints: boolean;
    }

    export interface GridNode {
        children: Array<GridNode>;
        collapsed?: boolean;
        collapseEnd?: number;
        collapseStart?: number;
        depth: number;
        descendants?: number;
        id?: string;
        height?: number;
        name: string;
        nodes: [TreeGridNode];
        pos: number;
        tickmarkOffset?: number;
    }


    export interface LabelIconOptionsObject {
        height?: number;
        lineColor?: ColorType;
        lineWidth?: number;
        padding?: number;
        type?: number;
        width?: number;
        x?: number;
        y?: number;
    }

    export interface LabelsOptions extends Highcharts.XAxisLabelsOptions {
        levels?: number;
        symbol?: LabelIconOptionsObject;
    }

    export interface Options extends Highcharts.XAxisOptions {
        labels?: LabelsOptions;
    }

    export interface TreeGridNode extends Highcharts.TreeNode {
        data: PointOptions;
        pos: number;
        seriesIndex: number;
    }

    export interface TreeGridObject {
        categories: Array<string>;
        mapOfIdToNode: Record<string, TreeGridNode>;
        mapOfPosToGridNode: Record<string, GridNode>;
        collapsedNodes: Array<GridNode>;
        tree: Highcharts.TreeNode;
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
    export function compose(AxisClass: typeof Axis): void {

        if (!applied) {

            wrap(AxisClass.prototype, 'generateTick', wrapGenerateTick);
            wrap(AxisClass.prototype, 'getMaxLabelDimensions', wrapGetMaxLabelDimensions);
            wrap(AxisClass.prototype, 'init', wrapInit);
            wrap(AxisClass.prototype, 'setTickInterval', wrapSetTickInterval);

            TreeGridTick.compose(Tick);

            applied = true;
        }
    }

    /**
     * @private
     */
    function getBreakFromNode(
        node: GridNode,
        max: number
    ): Partial<AxisBreakObject> {
        var from = node.collapseStart || 0,
            to = node.collapseEnd || 0;

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
    function getTreeGridFromData(
        data: Array<GanttPointOptions>,
        uniqueNames: boolean,
        numberOfSeries: number
    ): TreeGridObject {
        var categories: Array<string> = [],
            collapsedNodes: Array<GridNode> = [],
            mapOfIdToNode: Record<string, TreeGridNode> = {},
            mapOfPosToGridNode: Record<string, GridNode> = {},
            posIterator = -1,
            uniqueNamesEnabled = typeof uniqueNames === 'boolean' ? uniqueNames : false,
            tree: Highcharts.TreeNode;

        // Build the tree from the series data.
        const treeParams: Highcharts.TreeGetOptionsObject = {
            // After the children has been created.
            after: function (node: Highcharts.TreeNode): void {
                var gridNode = mapOfPosToGridNode[(node as TreeGridNode).pos],
                    height = 0,
                    descendants = 0;

                gridNode.children.forEach(function (child: GridNode): void {
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
                var data = isObject(node.data, true) ? (node as TreeGridNode).data : {},
                    name = isString(data.name) ? data.name : '',
                    parentNode = mapOfIdToNode[node.parent],
                    parentGridNode = (
                        isObject(parentNode, true) ?
                            mapOfPosToGridNode[parentNode.pos] :
                            null
                    ),
                    hasSameName = function (x: GridNode): boolean {
                        return x.name === name;
                    },
                    gridNode: (GridNode | undefined),
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
                    gridNode.nodes.push(node as TreeGridNode);
                } else {
                    // If it is a new grid node, increment position.
                    pos = posIterator++;
                }

                // Add new grid node to map.
                if (!mapOfPosToGridNode[pos]) {
                    mapOfPosToGridNode[pos] = gridNode = {
                        depth: parentGridNode ? parentGridNode.depth + 1 : 0,
                        name: name,
                        id: data.id,
                        nodes: [node as TreeGridNode],
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
                    mapOfIdToNode[node.id] = node as TreeGridNode;
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
                (node as TreeGridNode).pos = pos;
            }
        };

        const updateYValuesAndTickPos = function (
            map: Record<string, GridNode>,
            numberOfSeries: number
        ): Record<string, GridNode> {
            const setValues = function (
                gridNode: GridNode,
                start: number,
                result: Record<string, GridNode>
            ): Record<string, GridNode> {
                var nodes = gridNode.nodes,
                    end = start + (start === -1 ? 0 : numberOfSeries - 1),
                    diff = (end - start) / 2,
                    padding = 0.5,
                    pos = start + diff;

                nodes.forEach(function (node: TreeGridNode): void {
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


                gridNode.children.forEach(function (child: GridNode): void {
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

    /**
     * Builds the tree of categories and calculates its positions.
     * @private
     * @param {object} e Event object
     * @param {object} e.target The chart instance which the event was fired on.
     * @param {object[]} e.target.axes The axes of the chart.
     */
    function onBeforeRender(
        e: {
            target: Chart;
            type: string;
        }
    ): void {
        const chart = e.target,
            axes = chart.axes;

        (axes.filter(function (axis: Highcharts.Axis): boolean {
            return axis.options.type === 'treegrid';
        }) as Array<TreeGridAxis>).forEach(
            function (axis: TreeGridAxis): void {
                var options = axis.options || {},
                    labelOptions = options.labels,
                    uniqueNames = options.uniqueNames,
                    numberOfSeries = 0,
                    isDirty: (boolean | undefined),
                    data: Array<PointOptions>,
                    treeGrid: TreeGridObject,
                    max = options.max;
                // Check whether any of series is rendering for the first time,
                // visibility has changed, or its data is dirty,
                // and only then update. #10570, #10580
                // Also check if mapOfPosToGridNode exists. #10887
                isDirty = (
                    !axis.treeGrid.mapOfPosToGridNode ||
                    axis.series.some(function (series): (boolean|undefined) {
                        return !series.hasRendered ||
                            series.isDirtyData ||
                            series.isDirty;
                    })
                );

                if (isDirty) {
                    // Concatenate data from all series assigned to this axis.
                    data = axis.series.reduce(function (arr, s): Array<PointOptions> {
                        if (s.visible) {
                            // Push all data to array
                            (s.options.data || []).forEach(function (data): void {
                                // For using keys - rebuild the data structure
                                if (s.options.keys && s.options.keys.length) {

                                    data = s.pointClass.prototype.optionsToObject.call({ series: s }, data);
                                    s.pointClass.setGanttPointAliases(data);

                                }
                                if (isObject(data, true)) {
                                    // Set series index on data. Removed again
                                    // after use.
                                    (data as PointOptions).seriesIndex = numberOfSeries;
                                    arr.push(data as PointOptions);
                                }
                            });

                            // Increment series index
                            if (uniqueNames === true) {
                                numberOfSeries++;
                            }
                        }
                        return arr;
                    }, [] as Array<PointOptions>);

                    // If max is higher than set data - add a
                    // dummy data to render categories #10779
                    if (max && data.length < max) {
                        for (let i = data.length; i <= max; i++) {
                            data.push({
                                // Use the zero-width character
                                // to avoid conflict with uniqueNames
                                name: i + '\u200B'
                            });
                        }
                    }

                    // setScale is fired after all the series is initialized,
                    // which is an ideal time to update the axis.categories.
                    treeGrid = getTreeGridFromData(
                        data,
                        uniqueNames || false,
                        (uniqueNames === true) ? numberOfSeries : 1
                    );

                    // Assign values to the axis.
                    axis.categories = treeGrid.categories;
                    axis.treeGrid.mapOfPosToGridNode = treeGrid.mapOfPosToGridNode;
                    axis.hasNames = true;
                    axis.treeGrid.tree = treeGrid.tree;

                    // Update yData now that we have calculated the y values
                    axis.series.forEach(function (series): void {
                        var axisData = (series.options.data || []).map(function (
                            d: (PointOptions|PointShortOptions)
                        ): (PointOptions|PointShortOptions) {

                            if (isArray(d) && series.options.keys && series.options.keys.length) {
                                // Get the axisData from the data array used to
                                // build the treeGrid where has been modified
                                data.forEach(function (point: GanttPointOptions): void {
                                    if ((d as any).indexOf(point.x) >= 0 && (d as any).indexOf(point.x2) >= 0) {
                                        d = point;
                                    }
                                });
                            }
                            return isObject(d, true) ? merge(d) : d;
                        });

                        // Avoid destroying points when series is not visible
                        if (series.visible) {
                            series.setData(axisData, false);
                        }
                    });

                    // Calculate the label options for each level in the tree.
                    axis.treeGrid.mapOptionsToLevel =
                        getLevelOptions({
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
            }
        );
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
    function wrapGenerateTick(
        this: TreeGridAxis,
        proceed: Function,
        pos: number
    ): void {
        const axis = this,
            mapOptionsToLevel = axis.treeGrid.mapOptionsToLevel || {},
            isTreeGrid = axis.options.type === 'treegrid',
            ticks = axis.ticks;
        let tick = ticks[pos],
            levelOptions,
            options: (TreeGridAxis.Options | undefined),
            gridNode;

        if (
            isTreeGrid &&
            axis.treeGrid.mapOfPosToGridNode
        ) {
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
            } else {
                // update labels depending on tick interval
                tick.parameters.category = gridNode.name;
                tick.options = options;
                tick.addLabel();
            }
        } else {
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
    function wrapGetMaxLabelDimensions(
        this: TreeGridAxis,
        proceed: Function
    ): SizeObject {
        const axis = this,
            options = axis.options,
            labelOptions = options && options.labels,
            indentation = (
                labelOptions && isNumber(labelOptions.indentation) ?
                    labelOptions.indentation :
                    0
            ),
            retVal = proceed.apply(axis, Array.prototype.slice.call(arguments, 1)),
            isTreeGrid = axis.options.type === 'treegrid';
        let treeDepth: number;

        if (isTreeGrid && axis.treeGrid.mapOfPosToGridNode) {
            treeDepth = axis.treeGrid.mapOfPosToGridNode[-1].height || 0;
            retVal.width += indentation * (treeDepth - 1);
        }

        return retVal;
    }

    /**
     * @private
     */
    function wrapInit(
        this: TreeGridAxis,
        proceed: Function,
        chart: Chart,
        userOptions: TreeGridAxis.Options
    ): void {
        const axis = this,
            isTreeGrid = userOptions.type === 'treegrid';

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
            addEvent(chart, 'addSeries', function (e: Highcharts.ChartAddSeriesEventObject): void {
                if (e.options.data) {
                    const treeGrid = getTreeGridFromData((e.options.data as any), userOptions.uniqueNames || false, 1);

                    axis.treeGrid.collapsedNodes = (axis.treeGrid.collapsedNodes || []).concat(treeGrid.collapsedNodes);
                }
            });

            // Collapse all nodes in axis.treegrid.collapsednodes
            // where collapsed equals true.
            addEvent(axis, 'foundExtremes', function (): void {
                if (axis.treeGrid.collapsedNodes) {
                    axis.treeGrid.collapsedNodes.forEach(function (
                        node: GridNode
                    ): void {
                        const breaks = axis.treeGrid.collapse(node);

                        if (axis.brokenAxis) {
                            axis.brokenAxis.setBreaks(breaks, false);

                            // remove the node from the axis collapsedNodes
                            if (axis.treeGrid.collapsedNodes) {
                                axis.treeGrid.collapsedNodes = axis.treeGrid.collapsedNodes.filter((n): boolean =>
                                    node.collapseStart !== n.collapseStart ||
                                    node.collapseEnd !== n.collapseEnd);
                            }
                        }
                    });
                }
            });

            // If staticScale is not defined on the yAxis
            // and chart height is set, set axis.isDirty
            // to ensure collapsing works (#12012)
            addEvent(axis, 'afterBreaks', function (): void {
                if (axis.coll === 'yAxis' && !axis.staticScale && axis.chart.options.chart?.height) {
                    axis.isDirty = true;
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

            }, userOptions, { // User options
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
    function wrapSetTickInterval(
        this: TreeGridAxis,
        proceed: Function
    ): void {
        const axis = this,
            options = axis.options,
            isTreeGrid = options.type === 'treegrid';

        if (isTreeGrid) {
            axis.min = pick(axis.userMin, options.min, axis.dataMin);
            axis.max = pick(axis.userMax, options.max, axis.dataMax);

            fireEvent(axis, 'foundExtremes');

            // setAxisTranslation modifies the min and max according to
            // axis breaks.
            axis.setAxisTranslation();

            axis.tickmarkOffset = 0.5;
            axis.tickInterval = 1;
            axis.tickPositions = axis.treeGrid.mapOfPosToGridNode ?
                axis.treeGrid.getTickPositions() :
                [];
        } else {
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
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(axis: TreeGridAxis) {
            this.axis = axis;
        }

        /* *
        *
        *  Properties
        *
        * */

        public axis: TreeGridAxis;
        public mapOfPosToGridNode?: Record<string, GridNode>;
        public mapOptionsToLevel?: Record<string, LabelsOptions>;
        public tree?: Highcharts.TreeNode;
        public collapsedNodes?: GridNode[];

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Set the collapse status.
         *
         * @private
         *
         * @param {Highcharts.Axis} axis
         * The axis to check against.
         *
         * @param {Highcharts.GridNode} node
         * The node to collapse.
         */
        public setCollapsedStatus(node: GridNode): void {
            const axis = this.axis,
                chart = axis.chart;

            axis.series.forEach(function (series): void {
                const data = series.options.data;
                if (node.id && data) {
                    const point = chart.get(node.id),
                        dataPoint = data[series.data.indexOf(point as GanttPoint)];

                    if (point && dataPoint) {
                        (point as GanttPoint).collapsed = node.collapsed;
                        (dataPoint as GanttPoint).collapsed = node.collapsed;
                    }
                }
            });
        }

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
        public collapse(node: GridNode): Array<Highcharts.XAxisBreaksOptions> {
            const axis = this.axis,
                breaks = (axis.options.breaks || []),
                obj = getBreakFromNode(node, axis.max);

            breaks.push(obj);
            // Change the collapsed flag #13838
            node.collapsed = true;
            axis.treeGrid.setCollapsedStatus(node);

            return breaks;
        }

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
        public expand(node: GridNode): Array<Highcharts.XAxisBreaksOptions> {
            const axis = this.axis,
                breaks = (axis.options.breaks || []),
                obj = getBreakFromNode(node, axis.max);

            // Change the collapsed flag #13838
            node.collapsed = false;
            axis.treeGrid.setCollapsedStatus(node);

            // Remove the break from the axis breaks array.
            return breaks.reduce(function (
                arr: Array<Highcharts.XAxisBreaksOptions>,
                b: Highcharts.XAxisBreaksOptions
            ): Array<Highcharts.XAxisBreaksOptions> {
                if (b.to !== obj.to || b.from !== obj.from) {
                    arr.push(b);
                }
                return arr;
            }, [] as Array<Highcharts.XAxisBreaksOptions>);
        }

        /**
         * Creates a list of positions for the ticks on the axis. Filters out
         * positions that are outside min and max, or is inside an axis break.
         *
         * @private
         *
         * @return {Array<number>}
         * List of positions.
         */
        public getTickPositions(): Array<number> {
            const axis = this.axis,
                roundedMin = Math.floor(axis.min / axis.tickInterval) * axis.tickInterval,
                roundedMax = Math.ceil(axis.max / axis.tickInterval) * axis.tickInterval;

            return Object.keys(axis.treeGrid.mapOfPosToGridNode || {}).reduce(
                function (arr: Array<number>, key: string): Array<number> {
                    var pos = +key;
                    if (
                        pos >= roundedMin &&
                        pos <= roundedMax &&
                        !(axis.brokenAxis && axis.brokenAxis.isInAnyBreak(pos))
                    ) {
                        arr.push(pos);
                    }
                    return arr;
                },
                [] as Array<number>
            );
        }

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
        public isCollapsed(node: GridNode): boolean {
            const axis = this.axis,
                breaks = (axis.options.breaks || []),
                obj = getBreakFromNode(node, axis.max);

            return breaks.some(function (b: Highcharts.XAxisBreaksOptions): boolean {
                return b.from === obj.from && b.to === obj.to;
            });
        }

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
        public toggleCollapse(node: GridNode): Array<Highcharts.XAxisBreaksOptions> {
            return (
                this.isCollapsed(node) ?
                    this.expand(node) :
                    this.collapse(node)
            );
        }

    }

}

// Make utility functions available for testing.
(Axis.prototype as TreeGridAxis).utils = {
    getNode: Tree.getNode
};

TreeGridAxis.compose(Axis);

export default TreeGridAxis;
