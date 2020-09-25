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
import Axis from './Axis.js';
import H from '../Globals.js';
import O from '../Options.js';
var dateFormat = O.dateFormat;
import Tick from './Tick.js';
import U from '../Utilities.js';
var addEvent = U.addEvent, defined = U.defined, erase = U.erase, find = U.find, isArray = U.isArray, isNumber = U.isNumber, merge = U.merge, pick = U.pick, timeUnits = U.timeUnits, wrap = U.wrap;
var argsToArray = function (args) {
    return Array.prototype.slice.call(args, 1);
}, isObject = function (x) {
    // Always use strict mode
    return U.isObject(x, true);
}, Chart = H.Chart;
var applyGridOptions = function applyGridOptions(axis) {
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
 * @productdesc {gantt}
 * For grid axes (like in Gantt charts),
 * it is possible to declare as a list to provide different
 * formats depending on available space.
 *
 * Defaults to:
 * ```js
 * {
 *     hour: { list: ['%H:%M', '%H'] },
 *     day: { list: ['%A, %e. %B', '%a, %e. %b', '%E'] },
 *     week: { list: ['Week %W', 'W%W'] },
 *     month: { list: ['%B', '%b', '%o'] }
 * }
 * ```
 *
 * @sample {gantt} gantt/grid-axis/date-time-label-formats
 *         Gantt chart with custom axis date format.
 *
 * @apioption xAxis.dateTimeLabelFormats
 */
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
Axis.prototype.getMaxLabelDimensions = function (ticks, tickPositions) {
    var dimensions = {
        width: 0,
        height: 0
    };
    tickPositions.forEach(function (pos) {
        var tick = ticks[pos], labelHeight = 0, labelWidth = 0, label;
        if (isObject(tick)) {
            label = isObject(tick.label) ? tick.label : {};
            // Find width and height of label
            labelHeight = label.getBBox ? label.getBBox().height : 0;
            if (label.textStr && !isNumber(label.textPxLength)) {
                label.textPxLength = label.getBBox().width;
            }
            labelWidth = isNumber(label.textPxLength) ?
                // Math.round ensures crisp lines
                Math.round(label.textPxLength) :
                0;
            if (label.textStr) {
                // Set the tickWidth same as the label width after ellipsis
                // applied #10281
                labelWidth = Math.round(label.getBBox().width);
            }
            // Update the result if width and/or height are larger
            dimensions.height = Math.max(labelHeight, dimensions.height);
            dimensions.width = Math.max(labelWidth, dimensions.width);
        }
    });
    return dimensions;
};
// Adds week date format
H.dateFormats.W = function (timestamp) {
    var d = new this.Date(timestamp);
    var firstDay = (this.get('Day', d) + 6) % 7;
    var thursday = new this.Date(d.valueOf());
    this.set('Date', thursday, this.get('Date', d) - firstDay + 3);
    var firstThursday = new this.Date(this.get('FullYear', thursday), 0, 1);
    if (this.get('Day', firstThursday) !== 4) {
        this.set('Month', d, 0);
        this.set('Date', d, 1 + (11 - this.get('Day', firstThursday)) % 7);
    }
    return (1 +
        Math.floor((thursday.valueOf() - firstThursday.valueOf()) / 604800000)).toString();
};
// First letter of the day of the week, e.g. 'M' for 'Monday'.
H.dateFormats.E = function (timestamp) {
    return this.dateFormat('%a', timestamp, true).charAt(0);
};
/* eslint-disable no-invalid-this */
addEvent(Chart, 'afterSetChartSize', function () {
    this.axes.forEach(function (axis) {
        (axis.grid && axis.grid.columns || []).forEach(function (column) {
            column.setAxisSize();
            column.setAxisTranslation();
        });
    });
});
// Center tick labels in cells.
addEvent(Tick, 'afterGetLabelPosition', function (e) {
    var tick = this, label = tick.label, axis = tick.axis, reversed = axis.reversed, chart = axis.chart, options = axis.options, gridOptions = options.grid || {}, labelOpts = axis.options.labels, align = labelOpts.align, 
    // verticalAlign is currently not supported for axis.labels.
    verticalAlign = 'middle', // labelOpts.verticalAlign,
    side = GridAxis.Side[axis.side], tickmarkOffset = e.tickmarkOffset, tickPositions = axis.tickPositions, tickPos = tick.pos - tickmarkOffset, nextTickPos = (isNumber(tickPositions[e.index + 1]) ?
        tickPositions[e.index + 1] - tickmarkOffset :
        axis.max + tickmarkOffset), tickSize = axis.tickSize('tick'), tickWidth = tickSize ? tickSize[0] : 0, crispCorr = tickSize ? tickSize[1] / 2 : 0, labelHeight, lblMetrics, lines, bottom, top, left, right;
    // Only center tick labels in grid axes
    if (gridOptions.enabled === true) {
        // Calculate top and bottom positions of the cell.
        if (side === 'top') {
            bottom = axis.top + axis.offset;
            top = bottom - tickWidth;
        }
        else if (side === 'bottom') {
            top = chart.chartHeight - axis.bottom + axis.offset;
            bottom = top + tickWidth;
        }
        else {
            bottom = axis.top + axis.len - axis.translate(reversed ? nextTickPos : tickPos);
            top = axis.top + axis.len - axis.translate(reversed ? tickPos : nextTickPos);
        }
        // Calculate left and right positions of the cell.
        if (side === 'right') {
            left = chart.chartWidth - axis.right + axis.offset;
            right = left + tickWidth;
        }
        else if (side === 'left') {
            right = axis.left + axis.offset;
            left = right - tickWidth;
        }
        else {
            left = Math.round(axis.left + axis.translate(reversed ? nextTickPos : tickPos)) - crispCorr;
            right = Math.round(axis.left + axis.translate(reversed ? tickPos : nextTickPos)) - crispCorr;
        }
        tick.slotWidth = right - left;
        // Calculate the positioning of the label based on
        // alignment.
        e.pos.x = (align === 'left' ?
            left :
            align === 'right' ?
                right :
                left + ((right - left) / 2) // default to center
        );
        e.pos.y = (verticalAlign === 'top' ?
            top :
            verticalAlign === 'bottom' ?
                bottom :
                top + ((bottom - top) / 2) // default to middle
        );
        lblMetrics = chart.renderer.fontMetrics(labelOpts.style.fontSize, label.element);
        labelHeight = label.getBBox().height;
        // Adjustment to y position to align the label correctly.
        // Would be better to have a setter or similar for this.
        if (!labelOpts.useHTML) {
            lines = Math.round(labelHeight / lblMetrics.h);
            e.pos.y += (
            // Center the label
            // TODO: why does this actually center the label?
            ((lblMetrics.b - (lblMetrics.h - lblMetrics.f)) / 2) +
                // Adjust for height of additional lines.
                -(((lines - 1) * lblMetrics.h) / 2));
        }
        else {
            e.pos.y += (
            // Readjust yCorr in htmlUpdateTransform
            lblMetrics.b +
                // Adjust for height of html label
                -(labelHeight / 2));
        }
        e.pos.x += (axis.horiz && labelOpts.x || 0);
    }
});
/* eslint-enable no-invalid-this */
/**
 * Additions for grid axes.
 * @private
 * @class
 */
var GridAxisAdditions = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function GridAxisAdditions(axis) {
        this.axis = axis;
    }
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
    GridAxisAdditions.prototype.isOuterAxis = function () {
        var axis = this.axis;
        var chart = axis.chart;
        var columnIndex = axis.grid.columnIndex;
        var columns = (axis.linkedParent && axis.linkedParent.grid.columns ||
            axis.grid.columns);
        var parentAxis = columnIndex ? axis.linkedParent : axis;
        var thisIndex = -1, lastIndex = 0;
        chart[axis.coll].forEach(function (otherAxis, index) {
            if (otherAxis.side === axis.side && !otherAxis.options.isInternal) {
                lastIndex = index;
                if (otherAxis === parentAxis) {
                    // Get the index of the axis in question
                    thisIndex = index;
                }
            }
        });
        return (lastIndex === thisIndex &&
            (isNumber(columnIndex) ? columns.length === columnIndex : true));
    };
    /**
     * Add extra border based on the provided path.
     *  *
     * @private
     *
     * @param {SVGPath} path
     * The path of the border.
     *
     * @return {Highcharts.SVGElement}
     */
    GridAxisAdditions.prototype.renderBorder = function (path) {
        var axis = this.axis, renderer = axis.chart.renderer, options = axis.options, extraBorderLine = renderer.path(path)
            .addClass('highcharts-axis-line')
            .add(axis.axisBorder);
        if (!renderer.styledMode) {
            extraBorderLine.attr({
                stroke: options.lineColor,
                'stroke-width': options.lineWidth,
                zIndex: 7
            });
        }
        return extraBorderLine;
    };
    return GridAxisAdditions;
}());
/**
 * Axis with grid support.
 * @private
 * @class
 */
var GridAxis = /** @class */ (function () {
    function GridAxis() {
    }
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
    GridAxis.compose = function (AxisClass) {
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
    };
    /**
     * Handle columns and getOffset.
     * @private
     */
    GridAxis.onAfterGetOffset = function () {
        var grid = this.grid;
        (grid && grid.columns || []).forEach(function (column) {
            column.getOffset();
        });
    };
    /**
     * @private
     */
    GridAxis.onAfterGetTitlePosition = function (e) {
        var axis = this;
        var options = axis.options;
        var gridOptions = options.grid || {};
        if (gridOptions.enabled === true) {
            // compute anchor points for each of the title align options
            var title = axis.axisTitle, axisHeight = axis.height, horiz = axis.horiz, axisLeft = axis.left, offset = axis.offset, opposite = axis.opposite, _a = axis.options.title, axisTitleOptions = _a === void 0 ? {} : _a, axisTop = axis.top, axisWidth = axis.width;
            var tickSize = axis.tickSize();
            var titleWidth = title && title.getBBox().width;
            var xOption = axisTitleOptions.x || 0;
            var yOption = axisTitleOptions.y || 0;
            var titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10);
            var titleFontSize = axis.chart.renderer.fontMetrics(axisTitleOptions.style &&
                axisTitleOptions.style.fontSize, title).f;
            var crispCorr = tickSize ? tickSize[0] / 2 : 0;
            // TODO account for alignment
            // the position in the perpendicular direction of the axis
            var offAxis = ((horiz ? axisTop + axisHeight : axisLeft) +
                (horiz ? 1 : -1) * // horizontal axis reverses the margin
                    (opposite ? -1 : 1) * // so does opposite axes
                    crispCorr +
                (axis.side === GridAxis.Side.bottom ? titleFontSize : 0));
            e.titlePosition.x = horiz ?
                axisLeft - titleWidth / 2 - titleMargin + xOption :
                offAxis + (opposite ? axisWidth : 0) + offset + xOption;
            e.titlePosition.y = horiz ?
                (offAxis -
                    (opposite ? axisHeight : 0) +
                    (opposite ? titleFontSize : -titleFontSize) / 2 +
                    offset +
                    yOption) :
                axisTop - titleMargin + yOption;
        }
    };
    /**
     * @private
     */
    GridAxis.onAfterInit = function () {
        var axis = this;
        var chart = axis.chart, _a = axis.options.grid, gridOptions = _a === void 0 ? {} : _a, userOptions = axis.userOptions;
        if (gridOptions.enabled) {
            applyGridOptions(axis);
            /* eslint-disable no-invalid-this */
            // TODO: wrap the axis instead
            wrap(axis, 'labelFormatter', function (proceed) {
                var _a = this, axis = _a.axis, value = _a.value;
                var tickPos = axis.tickPositions;
                var series = (axis.isLinked ?
                    axis.linkedParent :
                    axis).series[0];
                var isFirst = value === tickPos[0];
                var isLast = value === tickPos[tickPos.length - 1];
                var point = series && find(series.options.data, function (p) {
                    return p[axis.isXAxis ? 'x' : 'y'] === value;
                });
                var pointCopy;
                if (point && series.is('gantt')) {
                    // For the Gantt set point aliases to the pointCopy
                    // to do not change the original point
                    pointCopy = merge(point);
                    H.seriesTypes.gantt.prototype.setGanttPointAliases(pointCopy);
                }
                // Make additional properties available for the
                // formatter
                this.isFirst = isFirst;
                this.isLast = isLast;
                this.point = pointCopy;
                // Call original labelFormatter
                return proceed.call(this);
            });
            /* eslint-enable no-invalid-this */
        }
        if (gridOptions.columns) {
            var columns = axis.grid.columns = [], columnIndex = axis.grid.columnIndex = 0;
            // Handle columns, each column is a grid axis
            while (++columnIndex < gridOptions.columns.length) {
                var columnOptions = merge(userOptions, gridOptions.columns[gridOptions.columns.length - columnIndex - 1], {
                    linkedTo: 0,
                    // Force to behave like category axis
                    type: 'category',
                    // Disable by default the scrollbar on the grid axis
                    scrollbar: {
                        enabled: false
                    }
                });
                delete columnOptions.grid.columns; // Prevent recursion
                var column = new Axis(axis.chart, columnOptions);
                column.grid.isColumn = true;
                column.grid.columnIndex = columnIndex;
                // Remove column axis from chart axes array, and place it
                // in the columns array.
                erase(chart.axes, column);
                erase(chart[axis.coll], column);
                columns.push(column);
            }
        }
    };
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
    GridAxis.onAfterRender = function () {
        var _a;
        var axis = this, grid = axis.grid, options = axis.options, gridOptions = options.grid || {};
        if (gridOptions.enabled === true) {
            // @todo acutual label padding (top, bottom, left, right)
            axis.maxLabelDimensions = axis.getMaxLabelDimensions(axis.ticks, axis.tickPositions);
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
                var lineWidth = options.lineWidth;
                if (lineWidth) {
                    var linePath = axis.getLinePath(lineWidth), startPoint = linePath[0], endPoint = linePath[1], 
                    // Negate distance if top or left axis
                    // Subtract 1px to draw the line at the end of the tick
                    tickLength = (axis.tickSize('tick') || [1])[0], distance = (tickLength - 1) * ((axis.side === GridAxis.Side.top ||
                        axis.side === GridAxis.Side.left) ? -1 : 1);
                    // If axis is horizontal, reposition line path vertically
                    if (startPoint[0] === 'M' && endPoint[0] === 'L') {
                        if (axis.horiz) {
                            startPoint[2] += distance;
                            endPoint[2] += distance;
                        }
                        else {
                            startPoint[1] += distance;
                            endPoint[1] += distance;
                        }
                    }
                    // If it doesn't exist, add an upper and lower border
                    // for the vertical grid axis.
                    if (!axis.horiz && axis.chart.marginRight) {
                        var upperBorderStartPoint = startPoint, upperBorderEndPoint = ['L', axis.left, startPoint[2]], upperBorderPath = [upperBorderStartPoint, upperBorderEndPoint], lowerBorderEndPoint = ['L', axis.chart.chartWidth - axis.chart.marginRight, axis.toPixels(axis.max + axis.tickmarkOffset)], lowerBorderStartPoint = ['M', endPoint[1], axis.toPixels(axis.max + axis.tickmarkOffset)], lowerBorderPath = [lowerBorderStartPoint, lowerBorderEndPoint];
                        if (!axis.grid.upperBorder && axis.min % 1 !== 0) {
                            axis.grid.upperBorder = axis.grid.renderBorder(upperBorderPath);
                        }
                        if (axis.grid.upperBorder) {
                            axis.grid.upperBorder.animate({
                                d: upperBorderPath
                            });
                        }
                        if (!axis.grid.lowerBorder && axis.max % 1 !== 0) {
                            axis.grid.lowerBorder = axis.grid.renderBorder(lowerBorderPath);
                        }
                        if (axis.grid.lowerBorder) {
                            axis.grid.lowerBorder.animate({
                                d: lowerBorderPath
                            });
                        }
                    }
                    // Render an extra line parallel to the existing axes,
                    // to close the grid.
                    if (!axis.grid.axisLineExtra) {
                        axis.grid.axisLineExtra = axis.grid.renderBorder(linePath);
                    }
                    else {
                        axis.grid.axisLineExtra.animate({
                            d: linePath
                        });
                    }
                    // show or hide the line depending on
                    // options.showEmpty
                    axis.axisLine[axis.showAxis ? 'show' : 'hide'](true);
                }
            }
            (grid && grid.columns || []).forEach(function (column) {
                column.render();
            });
            // Manipulate the tick mark visibility
            // based on the axis.max- allows smooth scrolling.
            if (!axis.horiz && axis.chart.hasRendered && (axis.scrollbar || ((_a = axis.linkedParent) === null || _a === void 0 ? void 0 : _a.scrollbar))) {
                var max = axis.max, min = axis.min, tickmarkOffset = axis.tickmarkOffset, lastTick = axis.tickPositions[axis.tickPositions.length - 1], firstTick = axis.tickPositions[0];
                // Hide/show firts tick label.
                if (min - firstTick > tickmarkOffset) {
                    axis.ticks[firstTick].label.hide();
                }
                else {
                    axis.ticks[firstTick].label.show();
                }
                // Hide/show last tick mark/label.
                if (lastTick - max > tickmarkOffset) {
                    axis.ticks[lastTick].label.hide();
                }
                else {
                    axis.ticks[lastTick].label.show();
                }
                if (lastTick - max < tickmarkOffset && lastTick - max > 0 && axis.ticks[lastTick].isLast) {
                    axis.ticks[lastTick].mark.hide();
                }
                else {
                    axis.ticks[lastTick - 1].mark.show();
                }
            }
        }
    };
    /**
     * @private
     */
    GridAxis.onAfterSetAxisTranslation = function () {
        var _a;
        var axis = this;
        var tickInfo = axis.tickPositions && axis.tickPositions.info;
        var options = axis.options;
        var gridOptions = options.grid || {};
        var userLabels = axis.userOptions.labels || {};
        if (axis.horiz) {
            if (gridOptions.enabled === true) {
                axis.series.forEach(function (series) {
                    series.options.pointRange = 0;
                });
            }
            // Lower level time ticks, like hours or minutes, represent
            // points in time and not ranges. These should be aligned
            // left in the grid cell by default. The same applies to
            // years of higher order.
            if (tickInfo &&
                options.dateTimeLabelFormats &&
                options.labels &&
                !defined(userLabels.align) &&
                (options.dateTimeLabelFormats[tickInfo.unitName].range === false ||
                    tickInfo.count > 1 // years
                )) {
                options.labels.align = 'left';
                if (!defined(userLabels.x)) {
                    options.labels.x = 3;
                }
            }
        }
        else {
            // Don't trim ticks which not in min/max range but
            // they are still in the min/max plus tickInterval.
            if (this.options.type !== 'treegrid' && ((_a = axis.grid) === null || _a === void 0 ? void 0 : _a.columns)) {
                this.minPointOffset = this.tickInterval;
            }
        }
    };
    /**
     * Creates a left and right wall on horizontal axes:
     * - Places leftmost tick at the start of the axis, to create a left
     *   wall
     * - Ensures that the rightmost tick is at the end of the axis, to
     *   create a right wall.
     * @private
     */
    GridAxis.onAfterSetOptions = function (e) {
        var options = this.options, userOptions = e.userOptions, gridAxisOptions, gridOptions = ((options && isObject(options.grid)) ? options.grid : {});
        if (gridOptions.enabled === true) {
            // Merge the user options into default grid axis options so
            // that when a user option is set, it takes presedence.
            gridAxisOptions = merge(true, {
                className: ('highcharts-grid-axis ' + (userOptions.className || '')),
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
                        'millisecond',
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
                if (defined(userOptions.linkedTo) &&
                    !defined(userOptions.tickPixelInterval)) {
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
                    !defined(userOptions.tickInterval)) {
                    gridAxisOptions.tickPositioner = function (min, max) {
                        var parentInfo = (this.linkedParent &&
                            this.linkedParent.tickPositions &&
                            this.linkedParent.tickPositions.info);
                        if (parentInfo) {
                            var unitIdx, count, unitName, i, units = gridAxisOptions.units, unitRange;
                            for (i = 0; i < units.length; i++) {
                                if (units[i][0] ===
                                    parentInfo.unitName) {
                                    unitIdx = i;
                                    break;
                                }
                            }
                            // Get the first allowed count on the next
                            // unit.
                            if (units[unitIdx + 1]) {
                                unitName = units[unitIdx + 1][0];
                                count =
                                    (units[unitIdx + 1][1] || [1])[0];
                                // In case the base X axis shows years, make
                                // the secondary axis show ten times the
                                // years (#11427)
                            }
                            else if (parentInfo.unitName === 'year') {
                                unitName = 'year';
                                count = parentInfo.count * 10;
                            }
                            unitRange = timeUnits[unitName];
                            this.tickInterval = unitRange * count;
                            return this.getTimeTicks({
                                unitRange: unitRange,
                                count: count,
                                unitName: unitName
                            }, min, max, this.options.startOfWeek);
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
            if (isNumber(options.grid.borderWidth)) {
                options.tickWidth = options.lineWidth = gridOptions.borderWidth;
            }
        }
    };
    /**
     * @private
     */
    GridAxis.onAfterSetOptions2 = function (e) {
        var axis = this;
        var userOptions = e.userOptions;
        var gridOptions = userOptions && userOptions.grid || {};
        var columns = gridOptions.columns;
        // Add column options to the parent axis. Children has their column
        // options set on init in onGridAxisAfterInit.
        if (gridOptions.enabled && columns) {
            merge(true, axis.options, columns[columns.length - 1]);
        }
    };
    /**
     * Handle columns and setScale.
     * @private
     */
    GridAxis.onAfterSetScale = function () {
        var axis = this;
        (axis.grid.columns || []).forEach(function (column) {
            column.setScale();
        });
    };
    /**
     * Draw vertical axis ticks extra long to create cell floors and roofs.
     * Overrides the tickLength for vertical axes.
     * @private
     */
    GridAxis.onAfterTickSize = function (e) {
        var defaultLeftAxisOptions = Axis.defaultLeftAxisOptions;
        var _a = this, horiz = _a.horiz, maxLabelDimensions = _a.maxLabelDimensions, _b = _a.options.grid, gridOptions = _b === void 0 ? {} : _b;
        if (gridOptions.enabled && maxLabelDimensions) {
            var labelPadding = (Math.abs(defaultLeftAxisOptions.labels.x) * 2);
            var distance = horiz ?
                gridOptions.cellHeight || labelPadding + maxLabelDimensions.height :
                labelPadding + maxLabelDimensions.width;
            if (isArray(e.tickSize)) {
                e.tickSize[0] = distance;
            }
            else {
                e.tickSize = [distance, 0];
            }
        }
    };
    /**
     * @private
     */
    GridAxis.onDestroy = function (e) {
        var grid = this.grid;
        (grid.columns || []).forEach(function (column) {
            column.destroy(e.keepEvents);
        });
        grid.columns = void 0;
    };
    /**
     * Wraps axis init to draw cell walls on vertical axes.
     * @private
     */
    GridAxis.onInit = function (e) {
        var axis = this;
        var userOptions = e.userOptions || {};
        var gridOptions = userOptions.grid || {};
        if (gridOptions.enabled && defined(gridOptions.borderColor)) {
            userOptions.tickColor = userOptions.lineColor = gridOptions.borderColor;
        }
        if (!axis.grid) {
            axis.grid = new GridAxisAdditions(axis);
        }
    };
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
    GridAxis.onTrimTicks = function () {
        var axis = this;
        var options = axis.options;
        var gridOptions = options.grid || {};
        var categoryAxis = axis.categories;
        var tickPositions = axis.tickPositions;
        var firstPos = tickPositions[0];
        var lastPos = tickPositions[tickPositions.length - 1];
        var linkedMin = axis.linkedParent && axis.linkedParent.min;
        var linkedMax = axis.linkedParent && axis.linkedParent.max;
        var min = linkedMin || axis.min;
        var max = linkedMax || axis.max;
        var tickInterval = axis.tickInterval;
        var endMoreThanMin = (firstPos < min &&
            firstPos + tickInterval > min);
        var startLessThanMax = (lastPos > max &&
            lastPos - tickInterval < max);
        if (gridOptions.enabled === true &&
            !categoryAxis &&
            (axis.horiz || axis.isLinked)) {
            if (endMoreThanMin && !options.startOnTick) {
                tickPositions[0] = min;
            }
            if (startLessThanMax && !options.endOnTick) {
                tickPositions[tickPositions.length - 1] = max;
            }
        }
    };
    /**
     * Avoid altering tickInterval when reserving space.
     * @private
     */
    GridAxis.wrapUnsquish = function (proceed) {
        var axis = this;
        var _a = axis.options.grid, gridOptions = _a === void 0 ? {} : _a;
        if (gridOptions.enabled === true && axis.categories) {
            return axis.tickInterval;
        }
        return proceed.apply(axis, argsToArray(arguments));
    };
    return GridAxis;
}());
(function (GridAxis) {
    /**
     * Enum for which side the axis is on. Maps to axis.side.
     * @private
     */
    var Side;
    (function (Side) {
        Side[Side["top"] = 0] = "top";
        Side[Side["right"] = 1] = "right";
        Side[Side["bottom"] = 2] = "bottom";
        Side[Side["left"] = 3] = "left";
    })(Side = GridAxis.Side || (GridAxis.Side = {}));
})(GridAxis || (GridAxis = {}));
GridAxis.compose(Axis);
export default GridAxis;
