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
import H from '../parts/Globals.js';
import U from '../parts/Utilities.js';
var defined = U.defined, erase = U.erase, isArray = U.isArray, isNumber = U.isNumber, pick = U.pick;
var addEvent = H.addEvent, argsToArray = function (args) {
    return Array.prototype.slice.call(args, 1);
}, dateFormat = H.dateFormat, isObject = function (x) {
    // Always use strict mode
    return U.isObject(x, true);
}, merge = H.merge, wrap = H.wrap, Chart = H.Chart, Axis = H.Axis, Tick = H.Tick;
var applyGridOptions = function applyGridOptions(axis) {
    var options = axis.options, gridOptions = options && isObject(options.grid) ? options.grid : {}, 
    // TODO: Consider using cell margins defined in % of font size?
    // 25 is optimal height for default fontSize (11px)
    // 25 / 11 ≈ 2.28
    fontSizeToCellHeightRatio = 25 / 11, fontSize = options.labels.style.fontSize, fontMetrics = axis.chart.renderer.fontMetrics(fontSize);
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
    // Make tick marks taller, creating cell walls of a grid. Use cellHeight
    // axis option if set
    if (axis.horiz) {
        options.tickLength = gridOptions.cellHeight ||
            fontMetrics.h * fontSizeToCellHeightRatio;
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
 * size.
 *
 * @type      {number}
 * @apioption xAxis.grid.cellHeight
 */
// Enum for which side the axis is on.
// Maps to axis.side
var axisSide = {
    top: 0,
    right: 1,
    bottom: 2,
    left: 3,
    0: 'top',
    1: 'right',
    2: 'bottom',
    3: 'left'
};
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
 * @function Highcharts.Axis#isOuterAxis
 *
 * @return {boolean}
 *         true if the axis is the outermost axis in its dimension; false if not
 */
Axis.prototype.isOuterAxis = function () {
    var axis = this, chart = axis.chart, columnIndex = axis.columnIndex, columns = axis.linkedParent && axis.linkedParent.columns ||
        axis.columns, parentAxis = columnIndex ? axis.linkedParent : axis, thisIndex = -1, lastIndex = 0;
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
 * Get the largest label width and height.
 *
 * @private
 * @function Highcharts.Axis#getMaxLabelDimensions
 *
 * @param {Highcharts.Dictionary<Highcharts.Tick>} ticks
 *        All the ticks on one axis.
 *
 * @param {Array<number|string>} tickPositions
 *        All the tick positions on one axis.
 *
 * @return {Highcharts.SizeObject}
 *         object containing the properties height and width.
 */
Axis.prototype.getMaxLabelDimensions = function (ticks, tickPositions) {
    var dimensions = {
        width: 0,
        height: 0
    };
    tickPositions.forEach(function (pos) {
        var tick = ticks[pos], tickHeight = 0, tickWidth = 0, label;
        if (isObject(tick)) {
            label = isObject(tick.label) ? tick.label : {};
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
// Add custom date formats
H.dateFormats.W = function (timestamp) {
    var d = new Date(timestamp), yearStart, weekNo;
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (d.getDay() || 7));
    yearStart = new Date(d.getFullYear(), 0, 1);
    weekNo =
        Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return weekNo;
};
// First letter of the day of the week, e.g. 'M' for 'Monday'.
H.dateFormats.E = function (timestamp) {
    return dateFormat('%a', timestamp, true).charAt(0);
};
/* eslint-disable no-invalid-this, valid-jsdoc */
addEvent(Tick, 'afterGetLabelPosition', 
/**
 * Center tick labels in cells.
 *
 * @private
 */
function (e) {
    var tick = this, label = tick.label, axis = tick.axis, reversed = axis.reversed, chart = axis.chart, options = axis.options, gridOptions = ((options && isObject(options.grid)) ? options.grid : {}), labelOpts = axis.options.labels, align = labelOpts.align, 
    // verticalAlign is currently not supported for axis.labels.
    verticalAlign = 'middle', // labelOpts.verticalAlign,
    side = axisSide[axis.side], tickmarkOffset = e.tickmarkOffset, tickPositions = axis.tickPositions, tickPos = tick.pos - tickmarkOffset, nextTickPos = (isNumber(tickPositions[e.index + 1]) ?
        tickPositions[e.index + 1] - tickmarkOffset :
        axis.max + tickmarkOffset), tickSize = axis.tickSize('tick', true), tickWidth = isArray(tickSize) ? tickSize[0] : 0, crispCorr = tickSize && tickSize[1] / 2, labelHeight, lblMetrics, lines, bottom, top, left, right;
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
        // Calculate the positioning of the label based on alignment.
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
// Draw vertical axis ticks extra long to create cell floors and roofs.
// Overrides the tickLength for vertical axes.
addEvent(Axis, 'afterTickSize', function (e) {
    var axis = this, dimensions = axis.maxLabelDimensions, options = axis.options, gridOptions = (options && isObject(options.grid)) ? options.grid : {}, labelPadding, distance;
    if (gridOptions.enabled === true) {
        labelPadding =
            (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
        distance = labelPadding + (axis.horiz ?
            dimensions.height :
            dimensions.width);
        if (isArray(e.tickSize)) {
            e.tickSize[0] = distance;
        }
        else {
            e.tickSize = [distance];
        }
    }
});
addEvent(Axis, 'afterGetTitlePosition', function (e) {
    var axis = this, options = axis.options, gridOptions = (options && isObject(options.grid)) ? options.grid : {};
    if (gridOptions.enabled === true) {
        // compute anchor points for each of the title align options
        var title = axis.axisTitle, titleWidth = title && title.getBBox().width, horiz = axis.horiz, axisLeft = axis.left, axisTop = axis.top, axisWidth = axis.width, axisHeight = axis.height, axisTitleOptions = options.title, opposite = axis.opposite, offset = axis.offset, tickSize = axis.tickSize() || [0], xOption = axisTitleOptions.x || 0, yOption = axisTitleOptions.y || 0, titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10), titleFontSize = axis.chart.renderer.fontMetrics(axisTitleOptions.style &&
            axisTitleOptions.style.fontSize, title).f, 
        // TODO account for alignment
        // the position in the perpendicular direction of the axis
        offAxis = (horiz ? axisTop + axisHeight : axisLeft) +
            (horiz ? 1 : -1) * // horizontal axis reverses the margin
                (opposite ? -1 : 1) * // so does opposite axes
                (tickSize[0] / 2) +
            (axis.side === axisSide.bottom ? titleFontSize : 0);
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
});
// Avoid altering tickInterval when reserving space.
wrap(Axis.prototype, 'unsquish', function (proceed) {
    var axis = this, options = axis.options, gridOptions = (options && isObject(options.grid)) ? options.grid : {};
    if (gridOptions.enabled === true && this.categories) {
        return this.tickInterval;
    }
    return proceed.apply(this, argsToArray(arguments));
});
addEvent(Axis, 'afterSetOptions', 
/**
 * Creates a left and right wall on horizontal axes:
 *
 * - Places leftmost tick at the start of the axis, to create a left wall
 *
 * - Ensures that the rightmost tick is at the end of the axis, to create a
 *   right wall.
 *
 * @private
 * @function
 */
function (e) {
    var options = this.options, userOptions = e.userOptions, gridAxisOptions, gridOptions = ((options && isObject(options.grid)) ? options.grid : {});
    if (gridOptions.enabled === true) {
        // Merge the user options into default grid axis options so that
        // when a user option is set, it takes presedence.
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
            // In a grid axis, only allow one unit of certain types, for
            // example we shouln't have one grid cell spanning two days.
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
            // For linked axes, tickPixelInterval is used only if the
            // tickPositioner below doesn't run or returns undefined (like
            // multiple years)
            if (defined(userOptions.linkedTo) &&
                !defined(userOptions.tickPixelInterval)) {
                gridAxisOptions.tickPixelInterval = 350;
            }
            // For the secondary grid axis, use the primary axis' tick
            // intervals and return ticks one level higher.
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
                        // Spanning multiple years, go default
                        if (!units[unitIdx][1]) {
                            return;
                        }
                        // Get the first allowed count on the next unit.
                        if (units[unitIdx + 1]) {
                            unitName = units[unitIdx + 1][0];
                            count =
                                (units[unitIdx + 1][1] || [1])[0];
                        }
                        unitRange = H.timeUnits[unitName];
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
        // If borderWidth is set, then use its value for tick and line
        // width.
        if (isNumber(options.grid.borderWidth)) {
            options.tickWidth = options.lineWidth = gridOptions.borderWidth;
        }
    }
});
addEvent(Axis, 'afterSetAxisTranslation', function () {
    var axis = this, options = axis.options, gridOptions = ((options && isObject(options.grid)) ? options.grid : {}), tickInfo = this.tickPositions && this.tickPositions.info, userLabels = this.userOptions.labels || {};
    if (this.horiz) {
        if (gridOptions.enabled === true) {
            axis.series.forEach(function (series) {
                series.options.pointRange = 0;
            });
        }
        // Lower level time ticks, like hours or minutes, represent points
        // in time and not ranges. These should be aligned left in the grid
        // cell by default. The same applies to years of higher order.
        if (tickInfo &&
            (options.dateTimeLabelFormats[tickInfo.unitName]
                .range === false ||
                tickInfo.count > 1 // years
            ) &&
            !defined(userLabels.align)) {
            options.labels.align = 'left';
            if (!defined(userLabels.x)) {
                options.labels.x = 3;
            }
        }
    }
});
// @todo Does this function do what the drawing says? Seems to affect ticks and
//       not the labels directly?
addEvent(Axis, 'trimTicks', 
/**
 * Makes tick labels which are usually ignored in a linked axis displayed if
 * they are within range of linkedParent.min.
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
 *
 * @private
 */
function () {
    var axis = this, options = axis.options, gridOptions = ((options && isObject(options.grid)) ? options.grid : {}), categoryAxis = axis.categories, tickPositions = axis.tickPositions, firstPos = tickPositions[0], lastPos = tickPositions[tickPositions.length - 1], linkedMin = axis.linkedParent && axis.linkedParent.min, linkedMax = axis.linkedParent && axis.linkedParent.max, min = linkedMin || axis.min, max = linkedMax || axis.max, tickInterval = axis.tickInterval, endMoreThanMin = (firstPos < min &&
        firstPos + tickInterval > min), startLessThanMax = (lastPos > max &&
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
});
addEvent(Axis, 'afterRender', 
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
 *
 * @private
 * @function
 *
 * @param {Function} proceed
 *        the original function
 */
function () {
    var axis = this, options = axis.options, gridOptions = ((options && isObject(options.grid)) ? options.grid : {}), yStartIndex, yEndIndex, xStartIndex, xEndIndex, renderer = axis.chart.renderer;
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
        if (axis.isOuterAxis() && axis.axisLine) {
            var lineWidth = options.lineWidth;
            if (lineWidth) {
                var linePath = axis.getLinePath(lineWidth);
                xStartIndex = linePath.indexOf('M') + 1;
                xEndIndex = linePath.indexOf('L') + 1;
                yStartIndex = linePath.indexOf('M') + 2;
                yEndIndex = linePath.indexOf('L') + 2;
                // Negate distance if top or left axis
                // Subtract 1px to draw the line at the end of the tick
                var distance = (axis.tickSize('tick')[0] - 1) * ((axis.side === axisSide.top ||
                    axis.side === axisSide.left) ? -1 : 1);
                // If axis is horizontal, reposition line path vertically
                if (axis.horiz) {
                    linePath[yStartIndex] =
                        linePath[yStartIndex] + distance;
                    linePath[yEndIndex] =
                        linePath[yEndIndex] + distance;
                }
                else {
                    // If axis is vertical, reposition line path
                    // horizontally
                    linePath[xStartIndex] =
                        linePath[xStartIndex] + distance;
                    linePath[xEndIndex] =
                        linePath[xEndIndex] + distance;
                }
                if (!axis.axisLineExtra) {
                    axis.axisLineExtra = renderer
                        .path(linePath)
                        .attr({
                        zIndex: 7
                    })
                        .addClass('highcharts-axis-line')
                        .add(axis.axisGroup);
                    if (!renderer.styledMode) {
                        axis.axisLineExtra.attr({
                            stroke: options.lineColor,
                            'stroke-width': lineWidth
                        });
                    }
                }
                else {
                    axis.axisLineExtra.animate({
                        d: linePath
                    });
                }
                // show or hide the line depending on options.showEmpty
                axis.axisLine[axis.showAxis ? 'show' : 'hide'](true);
            }
        }
        (axis.columns || []).forEach(function (column) {
            column.render();
        });
    }
});
// Handle columns and getOffset
var onGridAxisAfterGetOffset = function onGridAxisAfterGetOffset() {
    (this.columns || []).forEach(function (column) {
        column.getOffset();
    });
};
var onGridAxisAfterInit = function onGridAxisAfterInit() {
    var axis = this, chart = axis.chart, userOptions = axis.userOptions, options = axis.options, gridOptions = options && isObject(options.grid) ? options.grid : {};
    if (gridOptions.enabled) {
        applyGridOptions(axis);
        // TODO: wrap the axis instead
        wrap(axis, 'labelFormatter', function (proceed) {
            var axis = this.axis, tickPos = axis.tickPositions, value = this.value, series = (axis.isLinked ?
                axis.linkedParent :
                axis).series[0], isFirst = value === tickPos[0], isLast = value === tickPos[tickPos.length - 1], point = series && H.find(series.options.data, function (p) {
                return p[axis.isXAxis ? 'x' : 'y'] === value;
            });
            // Make additional properties available for the
            // formatter
            this.isFirst = isFirst;
            this.isLast = isLast;
            this.point = point;
            // Call original labelFormatter
            return proceed.call(this);
        });
    }
    if (gridOptions.columns) {
        var columns = axis.columns = [], columnIndex = axis.columnIndex = 0;
        // Handle columns, each column is a grid axis
        while (++columnIndex < gridOptions.columns.length) {
            var columnOptions = merge(userOptions, gridOptions.columns[gridOptions.columns.length - columnIndex - 1], {
                linkedTo: 0,
                // Force to behave like category axis
                type: 'category'
            });
            delete columnOptions.grid.columns; // Prevent recursion
            var column = new Axis(axis.chart, columnOptions, true);
            column.isColumn = true;
            column.columnIndex = columnIndex;
            // Remove column axis from chart axes array, and place it
            // in the columns array.
            erase(chart.axes, column);
            erase(chart[axis.coll], column);
            columns.push(column);
        }
    }
};
var onGridAxisAfterSetChartSize = function onGridAxisAfterSetChartSize() {
    this.axes.forEach(function (axis) {
        (axis.columns || []).forEach(function (column) {
            column.setAxisSize();
            column.setAxisTranslation();
        });
    });
};
// Handle columns and setScale
var onGridAxisAfterSetScale = function onGridAxisAfterSetScale() {
    (this.columns || []).forEach(function (column) {
        column.setScale();
    });
};
var onGridAxisDestroy = function onGridAxisDestroy(e) {
    (this.columns || []).forEach(function (column) {
        column.destroy(e.keepEvents);
    });
};
// Wraps axis init to draw cell walls on vertical axes.
var onGridAxisInit = function onGridAxisInit(e) {
    var userOptions = e.userOptions, gridOptions = ((userOptions && isObject(userOptions.grid)) ?
        userOptions.grid :
        {});
    if (gridOptions.enabled && defined(gridOptions.borderColor)) {
        userOptions.tickColor = userOptions.lineColor = gridOptions.borderColor;
    }
};
var onGridAxisAfterSetOptions = function onGridAxisAfterSetOptions(e) {
    var axis = this, userOptions = e.userOptions, gridOptions = ((userOptions && isObject(userOptions.grid)) ?
        userOptions.grid :
        {}), columns = gridOptions.columns;
    // Add column options to the parent axis.
    // Children has their column options set on init in onGridAxisAfterInit.
    if (gridOptions.enabled && columns) {
        merge(true, axis.options, columns[columns.length - 1]);
    }
};
var axisEvents = {
    afterGetOffset: onGridAxisAfterGetOffset,
    afterInit: onGridAxisAfterInit,
    afterSetOptions: onGridAxisAfterSetOptions,
    afterSetScale: onGridAxisAfterSetScale,
    destroy: onGridAxisDestroy,
    init: onGridAxisInit
};
// Add event handlers
Object.keys(axisEvents).forEach(function (event) {
    addEvent(Axis, event, axisEvents[event]);
});
addEvent(Chart, 'afterSetChartSize', onGridAxisAfterSetChartSize);
