/* *
 *
 *  (c) 2016-2026 Highsoft AS
 *  Authors: Jon Arild Nygard
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Axis from '../Axis';
import type {
    AxisBreakOptions,
    AxisCollectionKey,
    AxisLabelOptions,
    AxisOptions
} from '../AxisOptions';
import type Chart from '../../Chart/Chart';
import type { ChartAddSeriesEventObject } from '../../Chart/ChartOptions';
import type { DeepPartial } from '../../../Shared/Types';
import type GanttPoint from '../../../Series/Gantt/GanttPoint';
import type GanttPointOptions from '../../../Series/Gantt/GanttPointOptions';
import type GanttSeries from '../../../Series/Gantt/GanttSeries';
import type {
    PointOptions,
    PointShortOptions
} from '../../Series/PointOptions';
import type Series from '../../Series/Series';
import type Tick from '../Tick';
import type {
    TreeGetOptionsObject,
    TreeNode,
    TreePointOptionsObject
} from '../../../Gantt/Tree';

import BrokenAxis from '../BrokenAxis.js';
import GridAxis from '../GridAxis.js';
import Tree from '../../../Gantt/Tree.js';
import TreeGridTick from './TreeGridTick.js';
import TU from '../../../Series/TreeUtilities.js';
const { getLevelOptions } = TU;
import U from '../../Utilities.js';
const {
    addEvent,
    isArray,
    splat,
    find,
    fireEvent,
    isObject,
    isString,
    merge,
    removeEvent,
    wrap
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
declare module '../AxisComposition' {
    interface AxisComposition {
        treeGrid?: TreeGridAxisComposition['treeGrid'];
    }
}

/** @internal */
declare module '../AxisBase' {
    interface AxisBase {
        utils: TreeGridAxisUtilsObject;
    }
}

/** @internal */
declare module '../AxisType' {
    interface AxisTypeRegistry {
        TreeGridAxis: TreeGridAxisComposition;
    }
}

/** @internal */
declare module '../../Series/PointOptions' {
    interface PointOptions extends TreePointOptionsObject {
        collapsed?: boolean;
        seriesIndex?: number;
    }
}

/** @internal */
interface AxisBreakObject extends AxisBreakOptions {
    showPoints?: boolean;
    maxOffset?: number;
}

/** @internal */
interface GridNode {
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

/** @internal */
export declare class TreeGridAxisComposition extends Axis {
    dataMax: number;
    dataMin: number;
    max: number;
    min: number;
    options: AxisOptions;
    series: Array<GanttSeries>;
    treeGrid: TreeGridAxisAdditions;
}

/** @internal */
interface TreeGridAxisUtilsObject {
    getNode: typeof Tree['getNode'];
}

/** @internal */
interface TreeGridNode extends TreeNode {
    data: PointOptions;
    pos: number;
    seriesIndex: number;
}

/** @internal */
interface TreeGridObject {
    categories: Array<string>;
    mapOfIdToNode: Record<string, TreeGridNode>;
    mapOfPosToGridNode: Record<string, GridNode>;
    collapsedNodes: Array<GridNode>;
    tree: TreeNode;
}

/* *
 *
 *  Variables
 *
 * */

/** @internal */
let TickConstructor: (typeof Tick|undefined);

/* *
 *
 *  Functions
 *
 * */

/**
 * Creates a break object from a node.
 * @internal
 * @param {Object} node
 * The node to create a break object from.
 */
function getBreakFromNode(
    node: GridNode
): AxisBreakObject {
    return {
        from: node.collapseStart || 0,
        to: node.collapseEnd || 0,
        showPoints: false
    };
}

/**
 * Creates a tree structure of the data, and the treegrid. Calculates
 * categories, and y-values of points based on the tree.
 *
 * @internal
 * @function getTreeGridFromData
 *
 * @param {Array<Highcharts.GanttPointOptions>} data
 * All the data points to display in the axis.
 *
 * @param {boolean} uniqueNames
 * Whether or not the data node with the same name should share grid cell. If
 * true they do share cell. False by default.
 *
 * @param {number} numberOfSeries
 *
 * @return {Object}
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
    const categories: Array<string> = [],
        collapsedNodes: Array<GridNode> = [],
        mapOfIdToNode: Record<string, TreeGridNode> = {},
        uniqueNamesEnabled = uniqueNames || false;

    let mapOfPosToGridNode: Record<string, GridNode> = {},
        posIterator = -1;

    // Build the tree from the series data.
    const treeParams: TreeGetOptionsObject = {
        // After the children has been created.
        after: function (node: TreeNode): void {
            const gridNode = mapOfPosToGridNode[(node as TreeGridNode).pos];

            let height = 0,
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
        before: function (node: TreeNode): void {
            const data = isObject(node.data, true) ?
                    (node as TreeGridNode).data :
                    {},
                name = isString(data.name) ? data.name : '',
                parentNode = mapOfIdToNode[node.parent],
                parentGridNode = (
                    isObject(parentNode, true) ?
                        mapOfPosToGridNode[parentNode.pos] :
                        null
                ),
                hasSameName = function (x: GridNode): boolean {
                    return x.name === name;
                };

            let gridNode: (GridNode | undefined),
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
            if (gridNode && data.collapsed === true) {
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
            const nodes = gridNode.nodes,
                padding = 0.5;

            let end = start + (start === -1 ? 0 : numberOfSeries - 1);

            const diff = (end - start) / 2,
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
    const tree = Tree.getTree(data, treeParams);

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
 * @internal
 * @param {Object} e Event object
 * @param {Object} e.target The chart instance which the event was fired on.
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

    (axes.filter(
        (axis): boolean => axis.type === 'treegrid'
    ) as Array<TreeGridAxisComposition>).forEach(
        function (axis: TreeGridAxisComposition): void {
            const options = axis.options,
                labelOptions = options.labels,
                uniqueNames = axis.uniqueNames,
                max = chart.time.parse(options.max),
                // Check whether any of series is rendering for the first
                // time, visibility has changed, or its data is dirty, and
                // only then update. #10570, #10580. Also check if
                // mapOfPosToGridNode exists. #10887
                isDirty = (
                    !axis.treeGrid.mapOfPosToGridNode ||
                    axis.series.some(function (
                        series
                    ): (boolean|undefined) {
                        return !series.hasRendered ||
                            series.isDirtyData ||
                            series.isDirty;
                    })
                );

            let numberOfSeries = 0,
                data: Array<PointOptions>,
                treeGrid: TreeGridObject;

            if (isDirty) {
                const seriesHasPrimitivePoints: boolean[] = [];

                // Concatenate data from all series assigned to this axis.
                data = axis.series.reduce(function (arr, s): Array<PointOptions> {
                    const seriesData = (s.options.data || []),
                        firstPoint = seriesData[0],
                        // Check if the first point is a simple array of values.
                        // If so we assume that this is the case for all points.
                        foundPrimitivePoint = Array.isArray(firstPoint) &&
                            !firstPoint.find(
                                (value): boolean => (typeof value === 'object')
                            );

                    seriesHasPrimitivePoints.push(foundPrimitivePoint);

                    if (s.visible) {
                        // Push all data to array
                        seriesData.forEach(function (
                            pointOptions
                        ): void {

                            // For using keys, or when using primitive points,
                            // rebuild the data structure
                            if (foundPrimitivePoint || s.options.keys?.length) {
                                pointOptions = s.pointClass.prototype
                                    .optionsToObject
                                    .call({ series: s }, pointOptions);
                                s.pointClass.setGanttPointAliases(
                                    pointOptions,
                                    chart
                                );
                            }

                            if (isObject(pointOptions, true)) {
                                // Set series index on data. Removed again
                                // after use.
                                pointOptions.seriesIndex = numberOfSeries;
                                arr.push(pointOptions);
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
                // `setScale` is fired after all the series is initialized,
                // which is an ideal time to update the axis.categories.
                treeGrid = getTreeGridFromData(
                    data,
                    uniqueNames || false,
                    (uniqueNames === true) ? numberOfSeries : 1
                );
                // Assign values to the axis.
                axis.categories = treeGrid.categories;
                axis.treeGrid.mapOfPosToGridNode = (
                    treeGrid.mapOfPosToGridNode
                );
                axis.hasNames = true;
                axis.treeGrid.tree = treeGrid.tree;

                // Update yData now that we have calculated the y values
                axis.series.forEach(function (series, index): void {
                    const axisData = (
                        series.options.data || []
                    ).map(function (
                        d: (PointOptions|PointShortOptions)
                    ): (PointOptions|PointShortOptions) {

                        if (
                            seriesHasPrimitivePoints[index] ||
                            (isArray(d) && series.options.keys?.length)
                        ) {
                            // Get the axisData from the data array used to
                            // build the treeGrid where has been modified
                            data.forEach(function (
                                point: GanttPointOptions
                            ): void {
                                const toArray = splat(d);
                                if (
                                    toArray.indexOf(point.x || 0) >= 0 &&
                                    toArray.indexOf(point.x2 || 0) >= 0
                                ) {
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
                            levels: labelOptions?.levels,
                            to: axis.treeGrid.tree?.height
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
 * @internal
 * @function Highcharts.GridAxis#generateTick
 *
 * @param {Function} proceed
 * The original generateTick function.
 *
 * @param {number} pos
 * The tick position in axis values.
 */
function wrapGenerateTick(
    this: TreeGridAxisComposition,
    proceed: Function,
    pos: number
): void {
    const axis = this,
        mapOptionsToLevel = axis.treeGrid.mapOptionsToLevel || {},
        isTreeGrid = axis.type === 'treegrid',
        ticks = axis.ticks;
    let tick = ticks[pos],
        levelOptions,
        options: (DeepPartial<AxisOptions> | undefined),
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

        if (
            !tick &&
            TickConstructor
        ) {
            ticks[pos] = tick =
                new TickConstructor(axis, pos, void 0, void 0, {
                    category: gridNode.name,
                    tickmarkOffset: gridNode.tickmarkOffset,
                    options: options
                });
        } else {
            // Update labels depending on tick interval
            tick.parameters.category = gridNode.name;
            tick.options = options;
            tick.addLabel();
        }
    } else {
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
    }
}

/** @internal */
function wrapInit(
    this: TreeGridAxisComposition,
    proceed: Function,
    chart: Chart,
    userOptions: AxisOptions,
    coll: AxisCollectionKey
): void {
    const axis = this,
        isTreeGrid = userOptions.type === 'treegrid';

    if (!axis.treeGrid) {
        axis.treeGrid = new TreeGridAxisAdditions(axis);
    }

    // Set default and forced options for TreeGrid
    if (isTreeGrid) {

        // Add event for updating the categories of a treegrid.
        // NOTE Preferably these events should be set on the axis.
        addEvent(chart, 'beforeRender', onBeforeRender);
        addEvent(chart, 'beforeRedraw', onBeforeRender);

        // Add new collapsed nodes on addseries
        addEvent(chart, 'addSeries', function (
            e: ChartAddSeriesEventObject
        ): void {
            if (e.options.data) {
                const treeGrid = getTreeGridFromData(
                    e.options.data as GanttPointOptions[],
                    userOptions.uniqueNames || false,
                    1
                );

                axis.treeGrid.collapsedNodes = (
                    axis.treeGrid.collapsedNodes || []
                ).concat(treeGrid.collapsedNodes);
            }
        });

        // Collapse all nodes in axis.treegrid.collapsednodes
        // where collapsed equals true.
        addEvent(axis, 'foundExtremes', function (): void {
            axis.treeGrid.collapsedNodes?.forEach(function (
                node: GridNode
            ): void {
                const breaks = axis.treeGrid.collapse(node);

                if (axis.brokenAxis) {
                    axis.brokenAxis.setBreaks(breaks, false);

                    // Remove the node from the axis collapsedNodes
                    if (axis.treeGrid.collapsedNodes) {
                        axis.treeGrid.collapsedNodes = axis.treeGrid
                            .collapsedNodes
                            .filter((n): boolean => (
                                (
                                    node.collapseStart !==
                                    n.collapseStart
                                ) ||
                                node.collapseEnd !== n.collapseEnd
                            ));
                    }
                }
            });
        });

        // If staticScale is not defined on the yAxis
        // and chart height is set, set axis.isDirty
        // to ensure collapsing works (#12012)
        addEvent(axis, 'afterBreaks', function (): void {
            if (
                axis.coll === 'yAxis' &&
                !axis.staticScale &&
                axis.chart.options.chart.height
            ) {
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
                    * @internal
                    */
                    level: void 0
                }, {
                    level: 1,
                    /**
                     * @type      {Highcharts.CSSObject}
                     * @product   gantt
                     * @apioption yAxis.labels.levels.style
                     *
                     * @internal
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
                 * @internal
                 */
                symbol: {
                    /**
                     * The symbol type. Points to a definition function in
                     * the `Highcharts.Renderer.symbols` collection.
                     *
                     * @type {Highcharts.SymbolKeyValue}
                     *
                     * @internal
                     */
                    type: 'triangle',
                    x: -5,
                    y: -5,
                    height: 10,
                    width: 10
                }
            },
            uniqueNames: false

        }, userOptions, { // User options
            // Forced options
            reversed: true
        });
    }

    // Now apply the original function with the original arguments, which are
    // sliced off this function's arguments
    proceed.apply(axis, [chart, userOptions, coll]);

    if (isTreeGrid) {
        axis.hasNames = true;
        axis.options.showLastLabel = true;
    }
}

/**
 * Set the tick positions, tickInterval, axis min and max.
 *
 * @internal
 * @function Highcharts.GridAxis#setTickInterval
 *
 * @param {Function} proceed
 * The original setTickInterval function.
 */
function wrapSetTickInterval(
    this: TreeGridAxisComposition,
    proceed: Function
): void {
    const axis = this,
        options = axis.options,
        time = axis.chart.time,
        linkedParent = typeof options.linkedTo === 'number' ?
            this.chart[axis.coll]?.[options.linkedTo] :
            void 0,
        isTreeGrid = axis.type === 'treegrid';

    if (isTreeGrid) {
        axis.min = axis.userMin ?? time.parse(options.min) ?? axis.dataMin;
        axis.max = axis.userMax ?? time.parse(options.max) ?? axis.dataMax;

        fireEvent(axis, 'foundExtremes');

        // `setAxisTranslation` modifies the min and max according to axis
        // breaks.
        axis.setAxisTranslation();

        axis.tickInterval = 1;
        axis.tickmarkOffset = 0.5;
        axis.tickPositions = axis.treeGrid.mapOfPosToGridNode ?
            axis.treeGrid.getTickPositions() :
            [];

        if (linkedParent) {
            const linkedParentExtremes = linkedParent.getExtremes();

            axis.min = linkedParentExtremes.min ?? linkedParentExtremes.dataMin;
            axis.max = linkedParentExtremes.max ?? linkedParentExtremes.dataMax;
            axis.tickPositions = linkedParent.tickPositions;
        }
        axis.linkedParent = linkedParent;
    } else {
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
    }
}

/**
 * Wrap axis redraw to remove TreeGrid events from ticks
 *
 * @internal
 * @function Highcharts.GridAxis#redraw
 *
 * @param {Function} proceed
 * The original setTickInterval function.
 */
function wrapRedraw(
    this: TreeGridAxisComposition,
    proceed: Function
): void {
    const axis = this,
        isTreeGrid = this.type === 'treegrid';

    if (isTreeGrid && axis.visible) {
        axis.tickPositions.forEach(function (pos): void {
            const tick = axis.ticks[pos];
            if (tick.label?.attachedTreeGridEvents) {
                removeEvent(tick.label.element);
                tick.label.attachedTreeGridEvents = false;
            }
        });
    }
    proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
}

/* *
 *
 *  Classes
 *
 * */

/**
 * @internal
 * @class
 */
class TreeGridAxisAdditions {

    /* *
     *
     *  Static Functions
     *
     * */

    /** @internal */
    public static compose<T extends typeof Axis>(
        AxisClass: T,
        ChartClass: typeof Chart,
        SeriesClass: typeof Series,
        TickClass: typeof Tick
    ): (T&typeof TreeGridAxisComposition) {

        if (!AxisClass.keepProps.includes('treeGrid')) {
            const axisProps = AxisClass.prototype;

            AxisClass.keepProps.push('treeGrid');

            wrap(axisProps, 'generateTick', wrapGenerateTick);
            wrap(axisProps, 'init', wrapInit);
            wrap(axisProps, 'setTickInterval', wrapSetTickInterval);
            wrap(axisProps, 'redraw', wrapRedraw);

            // Make utility functions available for testing.
            axisProps.utils = {
                getNode: Tree.getNode
            };

            if (!TickConstructor) {
                TickConstructor = TickClass;
            }
        }

        GridAxis.compose(AxisClass, ChartClass, TickClass);
        BrokenAxis.compose(AxisClass, SeriesClass);
        TreeGridTick.compose(TickClass);

        return AxisClass as (T&typeof TreeGridAxisComposition);
    }

    /* *
     *
     *  Constructors
     *
     * */

    /** @internal */
    public constructor(axis: TreeGridAxisComposition) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */


    /** @internal */
    public adjustedMax?: number;

    /** @internal */
    public axis: TreeGridAxisComposition;

    /** @internal */
    public collapsedNodes?: GridNode[];

    /** @internal */
    public mapOfPosToGridNode?: Record<string, GridNode>;

    /** @internal */
    public mapOptionsToLevel?: Record<string, AxisLabelOptions>;

    /** @internal */
    public pendingSizeAdjustment: number = 0;

    /** @internal */
    public tree?: TreeNode;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Set the collapse status.
     *
     * @internal
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
                const point = chart.get(node.id) as GanttPoint,
                    dataPoint = data[series.data.indexOf(point)];

                if (point && dataPoint) {
                    point.collapsed = node.collapsed;
                    dataPoint.collapsed = node.collapsed;
                }
            }
        });
    }

    /**
     * Calculates the new axis breaks to collapse a node.
     *
     * @internal
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
    public collapse(node: GridNode): Array<AxisBreakOptions> {
        const axis = this.axis,
            breaks = axis.options.breaks || [],
            obj = getBreakFromNode(node);

        breaks.push(obj);
        // Change the collapsed flag #13838
        node.collapsed = true;
        axis.treeGrid.setCollapsedStatus(node);

        return breaks;
    }

    /**
     * Calculates the new axis breaks to expand a node.
     *
     * @internal
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
    public expand(node: GridNode): Array<AxisBreakOptions> {
        const axis = this.axis,
            obj = getBreakFromNode(node);

        // Change the collapsed flag #13838
        node.collapsed = false;
        axis.treeGrid.setCollapsedStatus(node);

        // Remove the break from the axis breaks array.
        return axis.options.breaks?.reduce(
            function (arr, b): Array<AxisBreakOptions> {
                if (b.to !== obj.to || b.from !== obj.from) {
                    arr.push(b);
                }
                return arr;
            },
            [] as Array<AxisBreakOptions>
        ) || [];
    }

    /**
     * Creates a list of positions for the ticks on the axis. Filters out
     * positions that are outside min and max, or is inside an axis break.
     *
     * @internal
     *
     * @return {Array<number>}
     * List of positions.
     */
    public getTickPositions(): Array<number> {
        const axis = this.axis,
            roundedMin = Math.floor(
                axis.min / axis.tickInterval
            ) * axis.tickInterval,
            roundedMax = Math.ceil(
                axis.max / axis.tickInterval
            ) * axis.tickInterval;

        return Object.keys(axis.treeGrid.mapOfPosToGridNode || {}).reduce(
            function (arr: Array<number>, key: string): Array<number> {
                const pos = +key;
                if (
                    pos >= roundedMin &&
                    pos <= roundedMax &&
                    !axis.brokenAxis?.isInAnyBreak(pos)
                ) {
                    arr.push(pos);
                }
                return arr;
            },
            []
        );
    }

    /**
     * Check if a node is collapsed.
     *
     * @internal
     *
     * @param {Object} node
     * The node to check if is collapsed.
     *
     * @return {boolean}
     * Returns true if collapsed, false if expanded.
     */
    public isCollapsed(node: GridNode): boolean {
        const axis = this.axis,
            breaks = (axis.options.breaks || []),
            obj = getBreakFromNode(node);

        return breaks.some(function (b): boolean {
            return b.from === obj.from && b.to === obj.to;
        });
    }

    /**
     * Calculates the new axis breaks after toggling the collapse/expand
     * state of a node. If it is collapsed it will be expanded, and if it is
     * expanded it will be collapsed.
     *
     * @internal
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
    public toggleCollapse(node: GridNode): Array<AxisBreakOptions> {
        return (
            this.isCollapsed(node) ?
                this.expand(node) :
                this.collapse(node)
        );
    }

}

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default TreeGridAxisAdditions;
