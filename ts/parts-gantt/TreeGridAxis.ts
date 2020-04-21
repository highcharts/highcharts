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
import TreeGridData from './TreeGridData.js';
import TreeGridTick from './TreeGridTick.js';
import TreeGridUtils from './TreeGridUtils.js';
const {
    collapse
} = TreeGridUtils;
import TreeSeriesMixin from '../mixins/tree-series.js';
import U from '../parts/Utilities.js';
const {
    addEvent,
    fireEvent,
    isNumber,
    isObject,
    merge,
    pick,
    wrap
} = U;

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
            getNode: Tree['getNode'];
        }
    }
}

import '../modules/broken-axis.src.js';

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
    series: Array<Highcharts.GanttSeries>;
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

    export interface LabelsOptions extends Highcharts.XAxisLabelsOptions {
        levels?: number;
        symbol?: Highcharts.SVGAttributes;
    }

    /**
     * @private
     */
    export interface Options extends Highcharts.XAxisOptions {
        labels?: LabelsOptions;
    }

    /* *
     *
     *  Functions
     *
     * */

    /**
     * @private
     */
    export function compose(AxisClass: typeof Axis): void {

        addEvent(AxisClass, 'init', onInit);

        wrap(AxisClass.prototype, 'generateTick', wrapGenerateTick);
        wrap(AxisClass.prototype, 'getMaxLabelDimensions', wrapGetMaxLabelDimensions);
        wrap(AxisClass.prototype, 'init', wrapInit);
        wrap(AxisClass.prototype, 'setTickInterval', wrapSetTickInterval);

        TreeGridTick.compose(Tick);
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
            target: Highcharts.Chart;
            type: string;
        }
    ): void {
        var chart = e.target,
            axes = chart.axes;

        (axes.filter(function (axis: Highcharts.Axis): boolean {
            return axis.options.type === 'treegrid';
        }) as Array<TreeGridAxis>).forEach(
            function (axis: TreeGridAxis): void {
                var options = axis.options || {},
                    labelOptions = options.labels,
                    removeFoundExtremesEvent: Function,
                    uniqueNames = options.uniqueNames,
                    numberOfSeries = 0,
                    isDirty: (boolean|undefined),
                    data: Array<TreeGridData.PointOptionsObject>,
                    treeGrid: TreeGridData.TreeGridObject;
                // Check whether any of series is rendering for the first time,
                // visibility has changed, or its data is dirty,
                // and only then update. #10570, #10580
                // Also check if mapOfPosToGridNode exists. #10887
                isDirty = (
                    !axis.treeGrid.mapOfPosToGridNode ||
                    axis.series.some(function (series: Highcharts.GanttSeries): boolean {
                        return !series.hasRendered ||
                            series.isDirtyData ||
                            series.isDirty;
                    })
                );

                if (isDirty) {
                    // Concatenate data from all series assigned to this axis.
                    data = axis.series.reduce(function (
                        arr: Array<TreeGridData.PointOptionsObject>,
                        s: Highcharts.GanttSeries
                    ): Array<TreeGridData.PointOptionsObject> {
                        if (s.visible) {
                            // Push all data to array
                            (s.options.data || []).forEach(function (data): void {
                                if (isObject(data, true)) {
                                    // Set series index on data. Removed again
                                    // after use.
                                    (data as TreeGridData.PointOptionsObject).seriesIndex = numberOfSeries;
                                    arr.push(data as TreeGridData.PointOptionsObject);
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
                    treeGrid = TreeGridData.getTreeGridFromData(
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
                    axis.series.forEach(function (series: Highcharts.Series): void {
                        var data = (series.options.data || []).map(function (
                            d: Highcharts.PointOptionsType
                        ): Highcharts.PointOptionsType {
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

                    // Collapse all the nodes belonging to a point where
                    // collapsed equals true. Only do this on init.
                    // Can be called from beforeRender, if getBreakFromNode
                    // removes its dependency on axis.max.
                    if (e.type === 'beforeRender') {
                        removeFoundExtremesEvent =
                            addEvent(axis, 'foundExtremes', function (): void {
                                treeGrid.collapsedNodes.forEach(function (
                                    node: TreeGridData.GridNode
                                ): void {
                                    var breaks = collapse(axis, node);

                                    if (axis.brokenAxis) {
                                        axis.brokenAxis.setBreaks(breaks, false);
                                    }
                                });
                                removeFoundExtremesEvent();
                            });
                    }
                }
            }
        );
    }

    /**
     * @private
     */
    function onInit(this: Axis, userOptions: Options): void {
        const axis = this;

        if (!axis.treeGrid) {
            axis.treeGrid = new Additions(axis as TreeGridAxis);
        }
    }

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
    function wrapGenerateTick(
        this: TreeGridAxis,
        proceed: Function,
        pos: number
    ): void {

        var axis = this,
            mapOptionsToLevel = axis.treeGrid.mapOptionsToLevel || {},
            isTreeGrid = axis.options.type === 'treegrid',
            ticks = axis.ticks,
            tick = ticks[pos],
            levelOptions,
            options: (TreeGridAxis.Options|undefined),
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
     *        The original function
     */
    function wrapGetMaxLabelDimensions(
        this: TreeGridAxis,
        proceed: Function
    ): Highcharts.SizeObject {

        var axis = this,
            options = axis.options,
            labelOptions = options && options.labels,
            indentation = (
                labelOptions && isNumber(labelOptions.indentation) ?
                    labelOptions.indentation :
                    0
            ),
            retVal = proceed.apply(axis, Array.prototype.slice.call(arguments, 1)),
            isTreeGrid = axis.options.type === 'treegrid',
            treeDepth: number;

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
        chart: Highcharts.Chart,
        userOptions: TreeGridAxis.Options
    ): void {
        const axis = this,
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
     *        The original setTickInterval function.
     */
    function wrapSetTickInterval(
        this: TreeGridAxis,
        proceed: Function
    ): void {
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
        public mapOfPosToGridNode?: Record<string, TreeGridData.GridNode>;
        public mapOptionsToLevel?: Record<string, LabelsOptions>;
        public tree?: Highcharts.TreeNode;

        /* *
         *
         *  Functions
         *
         * */

        /**
         * Creates a list of positions for the ticks on the axis. Filters out
         * positions that are outside min and max, or is inside an axis break.
         *
         * @private
         * @function getTickPositions
         *
         * @return {Array<number>}
         * List of positions.
         */
        public getTickPositions(): Array<number> {
            const axis = this.axis;

            return Object.keys(axis.treeGrid.mapOfPosToGridNode || {}).reduce(
                function (arr: Array<number>, key: string): Array<number> {
                    var pos = +key;
                    if (
                        axis.min <= pos &&
                        axis.max >= pos &&
                        !(axis.brokenAxis && axis.brokenAxis.isInAnyBreak(pos))
                    ) {
                        arr.push(pos);
                    }
                    return arr;
                },
                [] as Array<number>
            );
        }

    }

}

// Make utility functions available for testing.
(Axis.prototype as TreeGridAxis).utils = {
    getNode: Tree.getNode
};

export default TreeGridAxis;
