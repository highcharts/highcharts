/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Lars A. V. Cabrera
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from '../Series/Point';
import Axis from './Axis.js';
import H from '../Globals.js';
import O from '../Options.js';
const {
    dateFormat
} = O;
import Tick from './Tick.js';
import U from '../Utilities.js';
const {
    addEvent,
    defined,
    erase,
    find,
    isArray,
    isNumber,
    merge,
    pick,
    timeUnits,
    wrap
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface Axis {
            getMaxLabelDimensions(
                ticks: Dictionary<Tick>,
                tickPositions: Array<(number|string)>
            ): SizeObject;
        }
        interface AxisLabelsFormatterContextObject {
            point?: Point;
        }
        interface Tick {
            slotWidth?: number;
        }
        interface XAxisOptions {
            grid?: GridAxis.Options;
            isInternal?: boolean;
        }
    }
}

/**
 * @private
 */
declare module './Types' {
    interface AxisComposition {
        grid?: GridAxis['grid'];
    }
    interface AxisTypeRegistry {
        GridAxis: GridAxis;
    }
}

var argsToArray = function (args: IArguments): Array<any> {
        return Array.prototype.slice.call(args, 1);
    },
    isObject = function (x: unknown): x is object {
        // Always use strict mode
        return U.isObject(x, true);
    },
    Chart = H.Chart;

var applyGridOptions = function applyGridOptions(axis: Highcharts.Axis): void {
    var options = axis.options;

    // Center-align by default
    if (!options.labels) {
        options.labels = {};
    }
    options.labels.align = pick(options.labels.align, 'center');

    // @todo: Check against tickLabelPlacement between/on etc

    /* Prevents adding the last tick label if the axis is not a category
       axis.
       Since numeric labels are normally placed at starts and ends of a
       range of value, and this module makes the label point at the value,
       an "extra" label would appear. */
    if (!axis.categories) {
        options.showLastLabel = false;
    }

    // Prevents rotation of labels when squished, as rotating them would not
    // help.
    axis.labelRotation = 0;
    options.labels.rotation = 0;
};

/**
 * Set grid options for the axis labels. Requires Highcharts Gantt.
 *
 * @since     6.2.0
 * @product   gantt
 * @apioption xAxis.grid
 */

/**
 * Enable grid on the axis labels. Defaults to true for Gantt charts.
 *
 * @type      {boolean}
 * @default   true
 * @since     6.2.0
 * @product   gantt
 * @apioption xAxis.grid.enabled
 */

/**
 * Set specific options for each column (or row for horizontal axes) in the
 * grid. Each extra column/row is its own axis, and the axis options can be set
 * here.
 *
 * @sample gantt/demo/left-axis-table
 *         Left axis as a table
 *
 * @type      {Array<Highcharts.XAxisOptions>}
 * @apioption xAxis.grid.columns
 */

/**
 * Set border color for the label grid lines.
 *
 * @type      {Highcharts.ColorString}
 * @apioption xAxis.grid.borderColor
 */

/**
 * Set border width of the label grid lines.
 *
 * @type      {number}
 * @default   1
 * @apioption xAxis.grid.borderWidth
 */

/**
 * Set cell height for grid axis labels. By default this is calculated from font
 * size. This option only applies to horizontal axes.
 *
 * @sample gantt/grid-axis/cellheight
 *         Gant chart with custom cell height
 * @type      {number}
 * @apioption xAxis.grid.cellHeight
 */

''; // detach doclets above

/**
 * Get the largest label width and height.
 *
 * @private
 * @function Highcharts.Axis#getMaxLabelDimensions
 *
 * @param {Highcharts.Dictionary<Highcharts.Tick>} ticks
 * All the ticks on one axis.
 *
 * @param {Array<number|string>} tickPositions
 * All the tick positions on one axis.
 *
 * @return {Highcharts.SizeObject}
 * Object containing the properties height and width.
 *
 * @todo Move this to the generic axis implementation, as it is used there.
 */
Axis.prototype.getMaxLabelDimensions = function (
    ticks: Highcharts.Dictionary<Highcharts.Tick>,
    tickPositions: Array<(number|string)>
): Highcharts.SizeObject {
    var dimensions: Highcharts.SizeObject = {
        width: 0,
        height: 0
    };

    tickPositions.forEach(function (pos: (number|string)): void {
        var tick = ticks[pos],
            tickHeight = 0,
            tickWidth = 0,
            label: Highcharts.SVGElement;

        if (isObject(tick)) {
            label = isObject(tick.label) ? tick.label : ({} as any);

            // Find width and height of tick
            tickHeight = label.getBBox ? label.getBBox().height : 0;
            if (label.textStr && !isNumber(label.textPxLength)) {
                label.textPxLength = label.getBBox().width;
            }
            tickWidth = isNumber(label.textPxLength) ?
                // Math.round ensures crisp lines
                Math.round(label.textPxLength) :
                0;

            // Update the result if width and/or height are larger
            dimensions.height = Math.max(tickHeight, dimensions.height);
            dimensions.width = Math.max(tickWidth, dimensions.width);
        }
    });

    return dimensions;
};

// Adds week date format
H.dateFormats.W = function (this: Highcharts.Time, timestamp: number): string {
    const d = new this.Date(timestamp);
    const firstDay = (this.get('Day', d) + 6) % 7;
    const thursday = new this.Date(d.valueOf());
    this.set('Date', thursday, this.get('Date', d) - firstDay + 3);

    const firstThursday = new this.Date(this.get('FullYear', thursday), 0, 1);

    if (this.get('Day', firstThursday) !== 4) {
        this.set('Month', d, 0);
        this.set('Date', d, 1 + (11 - this.get('Day', firstThursday)) % 7);
    }
    return (
        1 +
        Math.floor((thursday.valueOf() - firstThursday.valueOf()) / 604800000)
    ).toString();
};

// First letter of the day of the week, e.g. 'M' for 'Monday'.
H.dateFormats.E = function (timestamp: number): string {
    return dateFormat('%a', timestamp, true).charAt(0);
};

/* eslint-disable no-invalid-this */

addEvent(
    Chart,
    'afterSetChartSize',
    function (): void {
        this.axes.forEach(function (axis: Axis): void {
            (axis.grid && axis.grid.columns || []).forEach(function (column): void {
                column.setAxisSize();
                column.setAxisTranslation();
            });
        } as any);
    }
);

// Center tick labels in cells.
addEvent(
    Tick,
    'afterGetLabelPosition',
    function (
        this: Tick,
        e: {
            pos: Highcharts.PositionObject;
            tickmarkOffset: number;
            index: number;
        }
    ): void {
        var tick = this,
            label = tick.label,
            axis = tick.axis,
            reversed = axis.reversed,
            chart = axis.chart,
            options = axis.options,
            gridOptions = options.grid || {},
            labelOpts = axis.options.labels,
            align = (labelOpts as any).align,
            // verticalAlign is currently not supported for axis.labels.
            verticalAlign = 'middle', // labelOpts.verticalAlign,
            side = GridAxis.Side[axis.side],
            tickmarkOffset = e.tickmarkOffset,
            tickPositions = axis.tickPositions,
            tickPos = tick.pos - tickmarkOffset,
            nextTickPos = (
                isNumber(tickPositions[e.index + 1]) ?
                    tickPositions[e.index + 1] - tickmarkOffset :
                    (axis.max as any) + tickmarkOffset
            ),
            tickSize = axis.tickSize('tick'),
            tickWidth = tickSize ? tickSize[0] : 0,
            crispCorr = tickSize ? tickSize[1] / 2 : 0,
            labelHeight: number,
            lblMetrics: Highcharts.FontMetricsObject,
            lines: number,
            bottom: number,
            top: number,
            left: number,
            right: number;

        // Only center tick labels in grid axes
        if (gridOptions.enabled === true) {

            // Calculate top and bottom positions of the cell.
            if (side === 'top') {
                bottom = axis.top + axis.offset;
                top = bottom - tickWidth;
            } else if (side === 'bottom') {
                top = chart.chartHeight - axis.bottom + axis.offset;
                bottom = top + tickWidth;
            } else {
                bottom = axis.top + axis.len - (axis.translate(
                    reversed ? nextTickPos : tickPos
                ) as any);
                top = axis.top + axis.len - (axis.translate(
                    reversed ? tickPos : nextTickPos
                ) as any);
            }

            // Calculate left and right positions of the cell.
            if (side === 'right') {
                left = chart.chartWidth - axis.right + axis.offset;
                right = left + tickWidth;
            } else if (side === 'left') {
                right = axis.left + axis.offset;
                left = right - tickWidth;
            } else {
                left = Math.round(axis.left + (axis.translate(
                    reversed ? nextTickPos : tickPos
                ) as any)) - crispCorr;
                right = Math.round(axis.left + (axis.translate(
                    reversed ? tickPos : nextTickPos
                ) as any)) - crispCorr;
            }

            tick.slotWidth = right - left;

            // Calculate the positioning of the label based on
            // alignment.
            e.pos.x = (
                align === 'left' ?
                    left :
                    align === 'right' ?
                        right :
                        left + ((right - left) / 2) // default to center
            );
            e.pos.y = (
                verticalAlign === 'top' ?
                    top :
                    verticalAlign === 'bottom' ?
                        bottom :
                        top + ((bottom - top) / 2) // default to middle
            );

            lblMetrics = chart.renderer.fontMetrics(
                (labelOpts as any).style.fontSize,
                (label as any).element
            );
            labelHeight = (label as any).getBBox().height;

            // Adjustment to y position to align the label correctly.
            // Would be better to have a setter or similar for this.
            if (!(labelOpts as any).useHTML) {
                lines = Math.round(labelHeight / lblMetrics.h);
                e.pos.y += (
                    // Center the label
                    // TODO: why does this actually center the label?
                    ((lblMetrics.b - (lblMetrics.h - lblMetrics.f)) / 2) +
                    // Adjust for height of additional lines.
                    -(((lines - 1) * lblMetrics.h) / 2)
                );
            } else {
                e.pos.y += (
                    // Readjust yCorr in htmlUpdateTransform
                    lblMetrics.b +
                    // Adjust for height of html label
                    -(labelHeight / 2)
                );
            }

            e.pos.x += (axis.horiz && (labelOpts as any).x || 0);
        }
    }
);

/* eslint-enable no-invalid-this */

/**
 * Additions for grid axes.
 * @private
 * @class
 */
class GridAxisAdditions {

    /* *
     *
     *  Constructors
     *
     * */

    constructor(axis: GridAxis) {
        this.axis = axis;
    }

    /* *
     *
     *  Properties
     *
     * */

    axis: GridAxis;
    axisLineExtra?: Highcharts.SVGElement;
    columnIndex?: number;
    columns?: Array<GridAxis>;
    isColumn?: boolean;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Checks if an axis is the outer axis in its dimension. Since
     * axes are placed outwards in order, the axis with the highest
     * index is the outermost axis.
     *
     * Example: If there are multiple x-axes at the top of the chart,
     * this function returns true if the axis supplied is the last
     * of the x-axes.
     *
     * @private
     *
     * @return {boolean}
     * True if the axis is the outermost axis in its dimension; false if
     * not.
     */
    public isOuterAxis(): boolean {
        const axis = this.axis;
        const chart = axis.chart;
        const columnIndex = axis.grid.columnIndex;
        const columns = (
            axis.linkedParent && axis.linkedParent.grid.columns ||
            axis.grid.columns
        );
        const parentAxis = columnIndex ? axis.linkedParent : axis;

        let thisIndex = -1,
            lastIndex = 0;

        (chart as any)[axis.coll].forEach(function (
            otherAxis: Highcharts.Axis,
            index: number
        ): void {
            if (otherAxis.side === axis.side && !otherAxis.options.isInternal) {
                lastIndex = index;
                if (otherAxis === parentAxis) {
                    // Get the index of the axis in question
                    thisIndex = index;
                }
            }
        });

        return (
            lastIndex === thisIndex &&
            (isNumber(columnIndex) ? (columns as any).length === columnIndex : true)
        );
    }

}

/**
 * Axis with grid support.
 * @private
 * @class
 */
class GridAxis {

    /* *
     *
     *  Static Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends axis class with grid support.
     * @private
     */
    public static compose(AxisClass: typeof Axis): void {

        Axis.keepProps.push('grid');

        wrap(AxisClass.prototype, 'unsquish', GridAxis.wrapUnsquish);

        // Add event handlers
        addEvent(AxisClass, 'init', GridAxis.onInit);
        addEvent(AxisClass, 'afterGetOffset', GridAxis.onAfterGetOffset);
        addEvent(AxisClass, 'afterGetTitlePosition', GridAxis.onAfterGetTitlePosition);
        addEvent(AxisClass, 'afterInit', GridAxis.onAfterInit);
        addEvent(AxisClass, 'afterRender', GridAxis.onAfterRender);
        addEvent(AxisClass, 'afterSetAxisTranslation', GridAxis.onAfterSetAxisTranslation);
        addEvent(AxisClass, 'afterSetOptions', GridAxis.onAfterSetOptions);
        addEvent(AxisClass, 'afterSetOptions', GridAxis.onAfterSetOptions2);
        addEvent(AxisClass, 'afterSetScale', GridAxis.onAfterSetScale);
        addEvent(AxisClass, 'afterTickSize', GridAxis.onAfterTickSize);
        addEvent(AxisClass, 'trimTicks', GridAxis.onTrimTicks);
        addEvent(AxisClass, 'destroy', GridAxis.onDestroy);

    }

    /**
     * Handle columns and getOffset.
     * @private
     */
    public static onAfterGetOffset(this: Axis): void {
        const {
            grid
        } = this;

        (grid && grid.columns || []).forEach(function (column: Axis): void {
            column.getOffset();
        });
    }

    /**
     * @private
     */
    public static onAfterGetTitlePosition(
        this: Axis,
        e: { titlePosition: Highcharts.PositionObject }
    ): void {
        const axis = this;
        const options = axis.options;
        const gridOptions = options.grid || {};

        if (gridOptions.enabled === true) {
            // compute anchor points for each of the title align options
            const {
                axisTitle: title,
                height: axisHeight,
                horiz,
                left: axisLeft,
                offset,
                opposite,
                options: {
                    title: axisTitleOptions = {}
                },
                top: axisTop,
                width: axisWidth
            } = axis;
            const tickSize = axis.tickSize();
            const titleWidth = title && title.getBBox().width;
            const xOption = axisTitleOptions.x || 0;
            const yOption = axisTitleOptions.y || 0;
            const titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
            const titleFontSize = axis.chart.renderer.fontMetrics(
                axisTitleOptions.style &&
                axisTitleOptions.style.fontSize,
                title
            ).f;
            const crispCorr = tickSize ? tickSize[0] / 2 : 0;

            // TODO account for alignment
            // the position in the perpendicular direction of the axis
            const offAxis = (
                (horiz ? axisTop + axisHeight : axisLeft) +
                (horiz ? 1 : -1) * // horizontal axis reverses the margin
                (opposite ? -1 : 1) * // so does opposite axes
                crispCorr +
                (axis.side === GridAxis.Side.bottom ? titleFontSize : 0)
            );

            e.titlePosition.x = horiz ?
                axisLeft - (titleWidth as any) / 2 - titleMargin + xOption :
                offAxis + (opposite ? axisWidth : 0) + offset + xOption;
            e.titlePosition.y = horiz ?
                (
                    offAxis -
                    (opposite ? axisHeight : 0) +
                    (opposite ? titleFontSize : -titleFontSize) / 2 +
                    offset +
                    yOption
                ) :
                axisTop - titleMargin + yOption;
        }
    }

    /**
     * @private
     */
    public static onAfterInit(this: Axis): void {
        const axis = this as GridAxis;
        const {
            chart,
            options: {
                grid: gridOptions = {}
            },
            userOptions
        } = axis;

        if (gridOptions.enabled) {
            applyGridOptions(axis);

            /* eslint-disable no-invalid-this */

            // TODO: wrap the axis instead
            wrap(axis, 'labelFormatter', function (
                this: Highcharts.AxisLabelsFormatterContextObject,
                proceed: Function
            ): void {
                const {
                    axis,
                    value
                } = this;
                const tickPos = axis.tickPositions;
                const series: Highcharts.Series = (
                    axis.isLinked ?
                        (axis.linkedParent as any) :
                        axis
                ).series[0];
                const isFirst = value === tickPos[0];
                const isLast = value === tickPos[tickPos.length - 1];
                const point: (Point|undefined) =
                    series && find(series.options.data as any, function (
                        p: Highcharts.PointOptionsType
                    ): boolean {
                        return (p as any)[axis.isXAxis ? 'x' : 'y'] === value;
                    });

                // Make additional properties available for the
                // formatter
                this.isFirst = isFirst;
                this.isLast = isLast;
                this.point = point;

                // Call original labelFormatter
                return proceed.call(this);
            });

            /* eslint-enable no-invalid-this */

        }

        if (gridOptions.columns) {
            var columns = axis.grid.columns = [] as Array<GridAxis>,
                columnIndex = axis.grid.columnIndex = 0;

            // Handle columns, each column is a grid axis
            while (++columnIndex < gridOptions.columns.length) {
                var columnOptions = merge(
                    userOptions,
                    gridOptions.columns[
                        gridOptions.columns.length - columnIndex - 1
                    ],
                    {
                        linkedTo: 0,
                        // Force to behave like category axis
                        type: 'category'
                    }
                );

                delete (columnOptions.grid as any).columns; // Prevent recursion

                var column = new Axis(axis.chart, columnOptions) as GridAxis;
                column.grid.isColumn = true;
                column.grid.columnIndex = columnIndex;

                // Remove column axis from chart axes array, and place it
                // in the columns array.
                erase(chart.axes, column);
                erase((chart as any)[axis.coll], column);
                columns.push(column);
            }
        }
    }

    /**
     * Draw an extra line on the far side of the outermost axis,
     * creating floor/roof/wall of a grid. And some padding.
     * ```
     * Make this:
     *             (axis.min) __________________________ (axis.max)
     *                           |    |    |    |    |
     * Into this:
     *             (axis.min) __________________________ (axis.max)
     *                        ___|____|____|____|____|__
     * ```
     * @private
     */
    public static onAfterRender(this: Axis): void {
        const axis = this;
        const grid = axis.grid;
        const options = axis.options;
        const renderer = axis.chart.renderer;
        const gridOptions = options.grid || {};

        let yStartIndex,
            yEndIndex,
            xStartIndex,
            xEndIndex;

        if (gridOptions.enabled === true) {

            // @todo acutual label padding (top, bottom, left, right)
            axis.maxLabelDimensions = axis.getMaxLabelDimensions(
                axis.ticks,
                axis.tickPositions
            );

            // Remove right wall before rendering if updating
            if (axis.rightWall) {
                axis.rightWall.destroy();
            }

            /*
            Draw an extra axis line on outer axes
                        >
            Make this:    |______|______|______|___

                        > _________________________
            Into this:    |______|______|______|__|
                                                    */
            if (axis.grid && axis.grid.isOuterAxis() && axis.axisLine) {

                const lineWidth = options.lineWidth;
                if (lineWidth) {
                    const linePath = axis.getLinePath(lineWidth);
                    const startPoint = linePath[0];
                    const endPoint = linePath[1];

                    // Negate distance if top or left axis
                    // Subtract 1px to draw the line at the end of the tick
                    const tickLength = (axis.tickSize('tick') || [1])[0];
                    const distance = (tickLength - 1) * ((
                        axis.side === GridAxis.Side.top ||
                        axis.side === GridAxis.Side.left
                    ) ? -1 : 1);

                    // If axis is horizontal, reposition line path vertically
                    if (startPoint[0] === 'M' && endPoint[0] === 'L') {
                        if (axis.horiz) {
                            startPoint[2] += distance;
                            endPoint[2] += distance;
                        } else {
                            // If axis is vertical, reposition line path
                            // horizontally
                            startPoint[1] += distance;
                            endPoint[1] += distance;
                        }
                    }

                    if (!axis.grid.axisLineExtra) {
                        axis.grid.axisLineExtra = renderer
                            .path(linePath)
                            .attr({
                                zIndex: 7
                            })
                            .addClass('highcharts-axis-line')
                            .add(axis.axisGroup);

                        if (!renderer.styledMode) {
                            axis.grid.axisLineExtra.attr({
                                stroke: options.lineColor,
                                'stroke-width': lineWidth
                            });
                        }
                    } else {
                        axis.grid.axisLineExtra.animate({
                            d: linePath
                        });
                    }

                    // show or hide the line depending on
                    // options.showEmpty
                    axis.axisLine[axis.showAxis ? 'show' : 'hide'](true);
                }
            }

            (grid && grid.columns || []).forEach(function (
                column: Highcharts.Axis
            ): void {
                column.render();
            });
        }
    }

    /**
     * @private
     */
    public static onAfterSetAxisTranslation(this: Axis): void {
        const axis = this;
        const tickInfo = axis.tickPositions && axis.tickPositions.info;
        const options = axis.options;
        const gridOptions = options.grid || {};
        const userLabels = axis.userOptions.labels || {};

        if (axis.horiz) {
            if (gridOptions.enabled === true) {
                axis.series.forEach(function (series: Highcharts.Series): void {
                    series.options.pointRange = 0;
                });
            }

            // Lower level time ticks, like hours or minutes, represent
            // points in time and not ranges. These should be aligned
            // left in the grid cell by default. The same applies to
            // years of higher order.
            if (
                tickInfo &&
                options.dateTimeLabelFormats &&
                options.labels &&
                !defined(userLabels.align) &&
                (
                    (options.dateTimeLabelFormats[tickInfo.unitName] as any).range === false ||
                    tickInfo.count > 1 // years
                )
            ) {
                options.labels.align = 'left';

                if (!defined(userLabels.x)) {
                    options.labels.x = 3;
                }
            }
        }
    }

    /**
     * Creates a left and right wall on horizontal axes:
     * - Places leftmost tick at the start of the axis, to create a left
     *   wall
     * - Ensures that the rightmost tick is at the end of the axis, to
     *   create a right wall.
     * @private
     */
    public static onAfterSetOptions(
        this: Axis,
        e: { userOptions: Highcharts.AxisOptions }
    ): void {
        var options = this.options,
            userOptions = e.userOptions,
            gridAxisOptions: Highcharts.AxisOptions,
            gridOptions: GridAxis.Options = (
                (options && isObject(options.grid)) ? (options.grid as any) : {}
            );

        if (gridOptions.enabled === true) {

            // Merge the user options into default grid axis options so
            // that when a user option is set, it takes presedence.
            gridAxisOptions = merge(true, {

                className: (
                    'highcharts-grid-axis ' + (userOptions.className || '')
                ),

                dateTimeLabelFormats: {
                    hour: {
                        list: ['%H:%M', '%H']
                    },
                    day: {
                        list: ['%A, %e. %B', '%a, %e. %b', '%E']
                    },
                    week: {
                        list: ['Week %W', 'W%W']
                    },
                    month: {
                        list: ['%B', '%b', '%o']
                    }
                },

                grid: {
                    borderWidth: 1
                },

                labels: {
                    padding: 2,
                    style: {
                        fontSize: '13px'
                    }
                },

                margin: 0,

                title: {
                    text: null,
                    reserveSpace: false,
                    rotation: 0
                },

                // In a grid axis, only allow one unit of certain types,
                // for example we shouln't have one grid cell spanning
                // two days.
                units: [[
                    'millisecond', // unit name
                    [1, 10, 100]
                ], [
                    'second',
                    [1, 10]
                ], [
                    'minute',
                    [1, 5, 15]
                ], [
                    'hour',
                    [1, 6]
                ], [
                    'day',
                    [1]
                ], [
                    'week',
                    [1]
                ], [
                    'month',
                    [1]
                ], [
                    'year',
                    null
                ]]
            }, userOptions);

            // X-axis specific options
            if (this.coll === 'xAxis') {

                // For linked axes, tickPixelInterval is used only if
                // the tickPositioner below doesn't run or returns
                // undefined (like multiple years)
                if (
                    defined(userOptions.linkedTo) &&
                    !defined(userOptions.tickPixelInterval)
                ) {
                    gridAxisOptions.tickPixelInterval = 350;
                }

                // For the secondary grid axis, use the primary axis'
                // tick intervals and return ticks one level higher.
                if (
                    // Check for tick pixel interval in options
                    !defined(userOptions.tickPixelInterval) &&

                    // Only for linked axes
                    defined(userOptions.linkedTo) &&

                    !defined(userOptions.tickPositioner) &&
                    !defined(userOptions.tickInterval)
                ) {
                    gridAxisOptions.tickPositioner = function (
                        this: Highcharts.Axis,
                        min: number,
                        max: number
                    ): (Highcharts.AxisTickPositionsArray|undefined) {

                        var parentInfo = (
                            this.linkedParent &&
                            this.linkedParent.tickPositions &&
                            this.linkedParent.tickPositions.info
                        );

                        if (parentInfo) {

                            var unitIdx: (number|undefined),
                                count,
                                unitName,
                                i,
                                units = gridAxisOptions.units,
                                unitRange;

                            for (i = 0; i < (units as any).length; i++) {
                                if (
                                    (units as any)[i][0] ===
                                    parentInfo.unitName
                                ) {
                                    unitIdx = i;
                                    break;
                                }
                            }

                            // Get the first allowed count on the next
                            // unit.
                            if ((units as any)[(unitIdx as any) + 1]) {
                                unitName = (units as any)[
                                    (unitIdx as any) + 1
                                ][0];
                                count =
                                    ((units as any)[
                                        (unitIdx as any) + 1
                                    ][1] || [1])[0];

                            // In case the base X axis shows years, make
                            // the secondary axis show ten times the
                            // years (#11427)
                            } else if (parentInfo.unitName === 'year') {
                                unitName = 'year';
                                count = parentInfo.count * 10;
                            }

                            unitRange = timeUnits[unitName];
                            this.tickInterval = unitRange * count;
                            return this.getTimeTicks(
                                {
                                    unitRange: unitRange,
                                    count: count,
                                    unitName: unitName
                                },
                                min,
                                max,
                                this.options.startOfWeek as any
                            );
                        }
                    };
                }

            }

            // Now merge the combined options into the axis options
            merge(true, this.options, gridAxisOptions);

            if (this.horiz) {
                /*               _________________________
                Make this:    ___|_____|_____|_____|__|
                                ^                     ^
                                _________________________
                Into this:    |_____|_____|_____|_____|
                                    ^                 ^    */
                options.minPadding = pick(userOptions.minPadding, 0);
                options.maxPadding = pick(userOptions.maxPadding, 0);
            }

            // If borderWidth is set, then use its value for tick and
            // line width.
            if (isNumber((options.grid as any).borderWidth)) {
                options.tickWidth = options.lineWidth = gridOptions.borderWidth;
            }

        }
    }

    /**
     * @private
     */
    public static onAfterSetOptions2(
        this: Axis,
        e: { userOptions?: Highcharts.AxisOptions }
    ): void {
        const axis = this;
        const userOptions = e.userOptions;
        const gridOptions = userOptions && userOptions.grid || {};
        const columns = gridOptions.columns;

        // Add column options to the parent axis. Children has their column
        // options set on init in onGridAxisAfterInit.
        if (gridOptions.enabled && columns) {
            merge(true, axis.options, columns[columns.length - 1]);
        }
    }

    /**
     * Handle columns and setScale.
     * @private
     */
    public static onAfterSetScale(this: Axis): void {
        const axis = this as GridAxis;

        (axis.grid.columns || []).forEach(function (column): void {
            column.setScale();
        });
    }

    /**
     * Draw vertical axis ticks extra long to create cell floors and roofs.
     * Overrides the tickLength for vertical axes.
     * @private
     */
    public static onAfterTickSize(
        this: Axis,
        e: { tickSize?: [number, number] }
    ): void {
        const defaultLeftAxisOptions = Axis.defaultLeftAxisOptions;
        const {
            horiz,
            maxLabelDimensions,
            options: {
                grid: gridOptions = {}
            }
        } = this;

        if (gridOptions.enabled && maxLabelDimensions) {
            const labelPadding =
                (Math.abs((defaultLeftAxisOptions.labels as any).x) * 2);
            const distance = horiz ?
                gridOptions.cellHeight || labelPadding + maxLabelDimensions.height :
                labelPadding + maxLabelDimensions.width;
            if (isArray(e.tickSize)) {
                e.tickSize[0] = distance;
            } else {
                e.tickSize = [distance, 0];
            }
        }
    }

    /**
     * @private
     */
    public static onDestroy(
        this: Axis,
        e: { keepEvents: boolean }
    ): void {
        const {
            grid
        } = this as GridAxis;

        (grid.columns || []).forEach(function (column): void {
            column.destroy(e.keepEvents);
        });
        grid.columns = void 0;
    }

    /**
     * Wraps axis init to draw cell walls on vertical axes.
     * @private
     */
    public static onInit(
        this: Axis,
        e: { userOptions?: Highcharts.AxisOptions }
    ): void {
        const axis = this;
        const userOptions = e.userOptions || {};
        const gridOptions = userOptions.grid || {};

        if (gridOptions.enabled && defined(gridOptions.borderColor)) {
            userOptions.tickColor = userOptions.lineColor = gridOptions.borderColor;
        }

        if (!axis.grid) {
            axis.grid = new GridAxisAdditions(axis as GridAxis);
        }
    }

    /**
     * Makes tick labels which are usually ignored in a linked axis
     * displayed if they are within range of linkedParent.min.
     * ```
     *                        _____________________________
     *                        |   |       |       |       |
     * Make this:             |   |   2   |   3   |   4   |
     *                        |___|_______|_______|_______|
     *                          ^
     *                        _____________________________
     *                        |   |       |       |       |
     * Into this:             | 1 |   2   |   3   |   4   |
     *                        |___|_______|_______|_______|
     *                          ^
     * ```
     * @private
     * @todo Does this function do what the drawing says? Seems to affect
     *       ticks and not the labels directly?
     */
    public static onTrimTicks(this: Axis): void {
        const axis = this;
        const options = axis.options;
        const gridOptions = options.grid || {};
        const categoryAxis = axis.categories;
        const tickPositions = axis.tickPositions;
        const firstPos = tickPositions[0];
        const lastPos = tickPositions[tickPositions.length - 1];
        const linkedMin = axis.linkedParent && axis.linkedParent.min;
        const linkedMax = axis.linkedParent && axis.linkedParent.max;
        const min = linkedMin || axis.min;
        const max = linkedMax || axis.max;
        const tickInterval = axis.tickInterval;
        const endMoreThanMin = (
            firstPos < (min as any) &&
            firstPos + tickInterval > (min as any)
        );
        const startLessThanMax = (
            lastPos > (max as any) &&
            lastPos - tickInterval < (max as any)
        );

        if (
            gridOptions.enabled === true &&
            !categoryAxis &&
            (axis.horiz || axis.isLinked)
        ) {
            if (endMoreThanMin && !options.startOnTick) {
                tickPositions[0] = min as any;
            }

            if (startLessThanMax && !options.endOnTick) {
                tickPositions[tickPositions.length - 1] = max as any;
            }
        }
    }

    /**
     * Avoid altering tickInterval when reserving space.
     * @private
     */
    public static wrapUnsquish(
        this: Axis,
        proceed: Function
    ): number {
        const axis = this;
        const {
            options: {
                grid: gridOptions = {}
            }
        } = axis;

        if (gridOptions.enabled === true && axis.categories) {
            return axis.tickInterval;
        }

        return proceed.apply(axis, argsToArray(arguments));
    }

}

interface GridAxis extends Axis {
    grid: GridAxisAdditions;
    linkedParent?: GridAxis;
}

namespace GridAxis {

    export interface Options {
        borderColor?: Highcharts.ColorType;
        borderWidth?: number;
        cellHeight?: number;
        columns?: Array<Highcharts.AxisOptions>;
        enabled?: boolean;
    }

    /**
     * Enum for which side the axis is on. Maps to axis.side.
     * @private
     */
    export enum Side {
        top = 0,
        right = 1,
        bottom = 2,
        left = 3
    }

}

GridAxis.compose(Axis);

export default GridAxis;
