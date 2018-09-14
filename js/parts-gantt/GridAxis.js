/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';

var argsToArray = function (args) {
        return Array.prototype.slice.call(args, 1);
    },
    dateFormat = H.dateFormat,
    defined = H.defined,
    each = H.each,
    isArray = H.isArray,
    isNumber = H.isNumber,
    isObject = function (x) {
        // Always use strict mode
        return H.isObject(x, true);
    },
    merge = H.merge,
    pick = H.pick,
    wrap = H.wrap,
    Axis = H.Axis,
    Tick = H.Tick;

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
 * Checks if an axis is a navigator axis.
 * @return {Boolean} true if axis is found in axis.chart.navigator
 */
Axis.prototype.isNavigatorAxis = function () {
    return /highcharts-navigator-[xy]axis/.test(this.options.className);
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
 * @return true if the axis is the outermost axis in its dimension;
 *         false if not
 */
Axis.prototype.isOuterAxis = function () {
    var axis = this,
        chart = axis.chart,
        thisIndex = -1,
        isOuter = true;

    each(chart.axes, function (otherAxis, index) {
        if (otherAxis.side === axis.side && !otherAxis.isNavigatorAxis()) {
            if (otherAxis === axis) {
                // Get the index of the axis in question
                thisIndex = index;

                // Check thisIndex >= 0 in case thisIndex has
                // not been found yet
            } else if (thisIndex >= 0 && index > thisIndex) {
                // There was an axis on the same side with a
                // higher index.
                isOuter = false;
            }
        }
    });
    // There were either no other axes on the same side,
    // or the other axes were not farther from the chart
    return isOuter;
};

/**
 * Get the longest label length.
 * This function can be used in states where the axis.maxLabelLength has not
 * been set.
 *
 * @param  {boolean} force - Optional parameter to force a new calculation, even
 *                           if a value has already been set
 * @return {number} maxLabelLength - the maximum label length of the axis
 */
Axis.prototype.getMaxLabelLength = function (force) {
    var axis = this,
        tickPositions = axis.tickPositions,
        ticks = axis.ticks,
        maxLabelLength = 0;

    if (!axis.maxLabelLength || force) {
        each(tickPositions, function (tick) {
            tick = ticks[tick];
            if (tick && tick.labelLength > maxLabelLength) {
                maxLabelLength = tick.labelLength;
            }
        });
        axis.maxLabelLength = maxLabelLength;
    }
    return axis.maxLabelLength;
};

/**
 * Add custom date formats
 */
H.dateFormats = {
    // Week number
    W: function (timestamp) {
        var d = new Date(timestamp),
            yearStart,
            weekNo;
        d.setHours(0, 0, 0, 0);
        d.setDate(d.getDate() - (d.getDay() || 7));
        yearStart = new Date(d.getFullYear(), 0, 1);
        weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
        return weekNo;
    },
    // First letter of the day of the week, e.g. 'M' for 'Monday'.
    E: function (timestamp) {
        return dateFormat('%a', timestamp, true).charAt(0);
    }
};

/**
 * If chart is stockChart, always return 'left' to avoid labels being placed
 * inside chart. Stock charts place yAxis labels inside by default.
 * @param {function} proceed - the original function
 * @return {string} 'left' if stockChart, or auto calculated alignment
 */
wrap(Axis.prototype, 'autoLabelAlign', function (proceed) {
    var axis = this,
        retVal;
    if (axis.chart.isStock) {
        retVal = 'left';
    } else {
        retVal = proceed.apply(axis, argsToArray(arguments));
    }
    return retVal;
});

/**
 * Center tick labels in cells.
 *
 * @param {function} proceed - the original function
 *
 * @return {object} object - an object containing x and y positions
 *                           for the tick
 */
wrap(Tick.prototype, 'getLabelPosition', function (proceed, x, y, label, horiz,
            labelOpts, tickmarkOffset, index) {
    var tick = this,
        axis = tick.axis,
        reversed = axis.reversed,
        chart = axis.chart,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {},
        align = labelOpts.align,
        // verticalAlign is currently not supported for axis.labels.
        verticalAlign = 'middle', // labelOpts.verticalAlign,
        side = axisSide[axis.side],
        tickPositions = axis.tickPositions,
        tickPos = tick.pos - tickmarkOffset,
        nextTickPos = (
            isNumber(tickPositions[index + 1]) ?
            tickPositions[index + 1] - tickmarkOffset :
            axis.max + tickmarkOffset
        ),
        tickSize = axis.tickSize('tick', true),
        tickWidth = isArray(tickSize) ? tickSize[0] : 0,
        crispCorr = tickSize[1] / 2,
        lblMetrics,
        result,
        bottom,
        top,
        left,
        right;

    // Only center tick labels in grid axes
    if (gridOptions.enabled === true) {
        /**
         * Calculate top and bottom positions of the cell.
         */
        if (side === 'top') {
            bottom = axis.top + axis.offset;
            top = bottom - tickWidth;
        } else if (side === 'bottom') {
            top = chart.chartHeight - axis.bottom + axis.offset;
            bottom = top + tickWidth;
        } else {
            bottom = axis.top + axis.len - axis.translate(
                reversed ? nextTickPos : tickPos
            );
            top = axis.top + axis.len - axis.translate(
                reversed ? tickPos : nextTickPos
            );
        }

        /**
         * Calculate left and right positions of the cell.
         */
        if (side === 'right') {
            left = chart.chartWidth - axis.right + axis.offset;
            right = left + tickWidth;
        } else if (side === 'left') {
            right = axis.left + axis.offset;
            left = right - tickWidth;
        } else {
            left = axis.left + axis.translate(
                reversed ? nextTickPos : tickPos
            );
            right = axis.left + axis.translate(
                reversed ? tickPos : nextTickPos
            );
        }

        /**
         * Calculate the positioning of the label based on alignment.
         */
        result = {
            x: (
                align === 'left' ?
                left :
                align === 'right' ?
                right :
                left + ((right - left) / 2) // default to center
            ),
            y: (
                verticalAlign === 'top' ?
                top :
                verticalAlign === 'bottom' ?
                bottom :
                top + ((bottom - top) / 2) // default to middle
            )
        };

        // Align the baseline of the label.
        // Would be better to have a setter or similar for this.
        lblMetrics = chart.renderer.fontMetrics(
            labelOpts.style.fontSize,
            label.element
        );
        result.y += (lblMetrics.b / 2) - ((lblMetrics.h - lblMetrics.f) / 2);

        // Adjust for crisping logic and round the resulting number
        result.x = Math.round(result.x - crispCorr);
    } else {
        result = proceed.apply(tick, argsToArray(arguments));
    }
    return result;
});

/**
 * Draw vertical axis ticks extra long to create cell floors and roofs.
 * Overrides the tickLength for vertical axes.
 *
 * @param {function} proceed - the original function
 * @returns {array} retVal -
 */
wrap(Axis.prototype, 'tickSize', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {},
        retVal = proceed.apply(axis, argsToArray(arguments)),
        labelPadding,
        distance;

    if (gridOptions.enabled === true) {
        labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
        distance = labelPadding + (axis.horiz ?
            axis.labelMetrics().f :
            axis.getMaxLabelLength());

        if (isArray(retVal)) {
            retVal[0] = distance;
        } else {
            retVal = [distance];
        }
    }
    return retVal;
});

wrap(Axis.prototype, 'getTitlePosition', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {};

    if (gridOptions.enabled === true) {
        // compute anchor points for each of the title align options
        var title = axis.axisTitle,
            titleWidth = title && title.getBBox().width,
            horiz = axis.horiz,
            axisLeft = axis.left,
            axisTop = axis.top,
            axisWidth = axis.width,
            axisHeight = axis.height,
            axisTitleOptions = options.title,
            opposite = axis.opposite,
            offset = axis.offset,
            tickSize = axis.tickSize() || [0],
            xOption = axisTitleOptions.x || 0,
            yOption = axisTitleOptions.y || 0,
            titleMargin = pick(axisTitleOptions.margin, horiz ? 5 : 10),
            titleFontSize = axis.chart.renderer.fontMetrics(
                axisTitleOptions.style && axisTitleOptions.style.fontSize,
                title
            ).f,
            // TODO account for alignment
            // the position in the perpendicular direction of the axis
            offAxis = (horiz ? axisTop + axisHeight : axisLeft) +
                (horiz ? 1 : -1) * // horizontal axis reverses the margin
                (opposite ? -1 : 1) * // so does opposite axes
                (tickSize[0] / 2) +
                (axis.side === axisSide.bottom ? titleFontSize : 0);

        return {
            x: horiz ?
                axisLeft - titleWidth / 2 - titleMargin + xOption :
                offAxis + (opposite ? axisWidth : 0) + offset + xOption,
            y: horiz ?
                (
                    offAxis -
                    (opposite ? axisHeight : 0) +
                    (opposite ? titleFontSize : -titleFontSize) / 2 +
                    offset +
                    yOption
                ) :
                axisTop - titleMargin + yOption
        };
    }

    return proceed.apply(this, argsToArray(arguments));
});

/**
 * Avoid altering tickInterval when reserving space.
 */
wrap(Axis.prototype, 'unsquish', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {};

    if (gridOptions.enabled === true && this.categories) {
        return this.tickInterval;
    }

    return proceed.apply(this, argsToArray(arguments));
});

/**
 * Creates a left and right wall on horizontal axes:
 * - Places leftmost tick at the start of the axis, to create a left wall
 * - Ensures that the rightmost tick is at the end of the axis, to create a
 *    right wall.
 *
 * @param {function} proceed - the original function
 * @param {object} options - the pure axis options as input by the user
 */
H.addEvent(Axis, 'afterSetOptions', function (e) {
    var options = this.options,
        userOptions = e.userOptions,
        gridAxisOptions,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {};

    if (gridOptions.enabled === true) {

        // Merge the user options into default grid axis options so that when a
        // user option is set, it takes presedence.
        gridAxisOptions = merge(true, {
            dateTimeLabelFormats: {
                day: ['%E'],
                week: ['Week %W', null, null, 'W%W'],
                month: ['%b']
            },

            labels: {
                ranges: true,
                style: {
                    fontSize: '13px'
                }
            },

            title: {
                text: null,
                reserveSpace: false,
                rotation: 0
            },

            // In a grid axis, only allow one unit of certain types, for example
            // we shouln't have one grid cell spanning two days.
            units: [[
                'millisecond', // unit name
                [1, 10, 100]
            ], [
                'second',
                [1, 10]
            ], [
                'minute',
                [1, 15]
            ], [
                'hour',
                [1]
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
            if (
                defined(userOptions.linkedTo) &&
                !defined(userOptions.tickPixelInterval)
            ) {
                gridAxisOptions.tickPixelInterval = 350;
            }

            // For the secondary grid axis, use the primary axis' tick intervals
            // and return ticks one level higher.
            if (
                // Check for tick pixel interval in options
                !defined(userOptions.tickPixelInterval) &&

                // Only for linked axes
                defined(userOptions.linkedTo) &&

                !defined(userOptions.tickPositioner) &&
                !defined(userOptions.tickInterval)
            ) {
                gridAxisOptions.tickPositioner = function (min, max) {

                    var parentInfo = (
                        this.linkedParent &&
                        this.linkedParent.tickPositions &&
                        this.linkedParent.tickPositions.info
                    );

                    if (parentInfo) {

                        var unitIdx,
                            countIdx,
                            count,
                            unitName,
                            i,
                            units = gridAxisOptions.units;

                        for (i = 0; i < units.length; i++) {
                            if (units[i][0] === parentInfo.unitName) {
                                unitIdx = i;
                                break;
                            }
                        }

                        // Spanning multiple years, go default
                        if (!units[unitIdx][1]) {
                            return;
                        }

                        for (i = 0; i < units[unitIdx][1].length; i++) {
                            if (
                                units[unitIdx][1][i] ===
                                parentInfo.count
                            ) {
                                countIdx = i;
                                break;
                            }
                        }

                        // Get the next allowed count in the same unit, or the
                        // first allowed count on the next unit.
                        if (
                            units[unitIdx][1][countIdx + 1] !==
                            undefined
                        ) {
                            unitName = units[unitIdx][0];
                            count = units[unitIdx][1][countIdx + 1];
                        } else if (units[unitIdx + 1]) {
                            unitName = units[unitIdx + 1][0];
                            count = (units[unitIdx + 1][1] || [1])[0];
                        }

                        return this.getTimeTicks(
                            {
                                unitRange: H.timeUnits[unitName],
                                count: count,
                                unitName: unitName
                            },
                            min,
                            max,
                            this.options.startOfWeek
                        );
                    }
                };
            }

        }

        // Now merge the combined options into the axis options
        merge(true, this.options, gridAxisOptions);

        if (this.horiz) {
            /**              _________________________
             * Make this:    ___|_____|_____|_____|__|
             *               ^                     ^
             *               _________________________
             * Into this:    |_____|_____|_____|_____|
             *                  ^                 ^
             */
            options.minPadding = pick(userOptions.minPadding, 0);
            options.maxPadding = pick(userOptions.maxPadding, 0);
        }

    }
});

/**
 * Ensures a left wall on horizontal axes with series inheriting from column.
 * ColumnSeries normally sets pointRange to null, resulting in Axis to select
 * other values for point ranges. This enforces the above Axis.setOptions()
 * override.
 *                  _________________________
 * Enforce this:    ___|_____|_____|_____|__|
 *                  ^
 *                  _________________________
 * To be this:      |_____|_____|_____|_____|
 *                  ^
 *
 * @param {function} proceed - the original function
 * @param {object} options - the pure axis options as input by the user
 */
wrap(Axis.prototype, 'setAxisTranslation', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {};

    if (gridOptions.enabled === true && axis.horiz) {
        each(axis.series, function (series) {
            series.options.pointRange = 0;
        });
    }
    proceed.apply(axis, argsToArray(arguments));
});

// TODO: Does this function do what the drawing says? Seems to affect ticks and
//       not the labels directly?
/**
 * Makes tick labels which are usually ignored in a linked axis displayed if
 * they are within range of linkedParent.min.
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
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'trimTicks', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {},
        categoryAxis = axis.categories,
        tickPositions = axis.tickPositions,
        firstPos = tickPositions[0],
        lastPos = tickPositions[tickPositions.length - 1],
        linkedMin = axis.linkedParent && axis.linkedParent.min,
        linkedMax = axis.linkedParent && axis.linkedParent.max,
        min = linkedMin || axis.min,
        max = linkedMax || axis.max,
        tickInterval = axis.tickInterval,
        moreThanMin = firstPos > min,
        lessThanMax = lastPos < max,
        endMoreThanMin = firstPos < min && firstPos + tickInterval > min,
        startLessThanMax = lastPos > max && lastPos - tickInterval < max;

    if (
        gridOptions.enabled === true &&
        !categoryAxis &&
        (axis.horiz || axis.isLinked)
    ) {
        if (moreThanMin || endMoreThanMin) {
            tickPositions[0] = min;
        }

        if (lessThanMax || startLessThanMax) {
            tickPositions[tickPositions.length - 1] = max;
        }
    }

    proceed.apply(axis, argsToArray(arguments));
});

/**
 * Draw an extra line on the far side of the outermost axis,
 * creating floor/roof/wall of a grid. And some padding.
 *
 * Make this:
 *             (axis.min) __________________________ (axis.max)
 *                           |    |    |    |    |
 * Into this:
 *             (axis.min) __________________________ (axis.max)
 *                        ___|____|____|____|____|__
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'render', function (proceed) {
    var axis = this,
        options = axis.options,
        gridOptions = (options && isObject(options.grid)) ? options.grid : {},
        labelPadding,
        distance,
        lineWidth,
        linePath,
        yStartIndex,
        yEndIndex,
        xStartIndex,
        xEndIndex,
        renderer = axis.chart.renderer,
        horiz = axis.horiz,
        axisGroupBox;

    if (gridOptions.enabled === true) {
        // TODO acutual label padding (top, bottom, left, right)
        // Label padding is needed to figure out where to draw the outer line.
        labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
        distance = axis.getMaxLabelLength() + labelPadding;
        lineWidth = options.lineWidth;

        // Remove right wall before rendering if updating
        if (axis.rightWall) {
            axis.rightWall.destroy();
        }

        // Call original Axis.render() to obtain axis.axisLine and
        // axis.axisGroup
        proceed.apply(axis);

        axisGroupBox = axis.axisGroup.getBBox();

        /*
         * Draw an extra axis line on outer axes
         *             >
         * Make this:    |______|______|______|___
         *
         *             > _________________________
         * Into this:    |______|______|______|__|
         *
         */
        if (axis.isOuterAxis() && axis.axisLine) {
            if (horiz) {
                // -1 to avoid adding distance each time the chart updates
                distance = axisGroupBox.height - 1;
            }

            if (lineWidth) {
                linePath = axis.getLinePath(lineWidth);
                xStartIndex = linePath.indexOf('M') + 1;
                xEndIndex = linePath.indexOf('L') + 1;
                yStartIndex = linePath.indexOf('M') + 2;
                yEndIndex = linePath.indexOf('L') + 2;

                // Negate distance if top or left axis
                if (axis.side === axisSide.top || axis.side === axisSide.left) {
                    distance = -distance;
                }

                // If axis is horizontal, reposition line path vertically
                if (horiz) {
                    linePath[yStartIndex] = linePath[yStartIndex] + distance;
                    linePath[yEndIndex] = linePath[yEndIndex] + distance;
                } else {
                    // If axis is vertical, reposition line path horizontally
                    linePath[xStartIndex] = linePath[xStartIndex] + distance;
                    linePath[xEndIndex] = linePath[xEndIndex] + distance;
                }

                if (!axis.axisLineExtra) {
                    axis.axisLineExtra = renderer.path(linePath)
                        .attr({
                            stroke: options.lineColor,
                            'stroke-width': lineWidth,
                            zIndex: 7
                        })
                        .add(axis.axisGroup);
                } else {
                    axis.axisLineExtra.animate({
                        d: linePath
                    });
                }

                // show or hide the line depending on options.showEmpty
                axis.axisLine[axis.showAxis ? 'show' : 'hide'](true);
            }
        }
    } else {
        proceed.apply(axis);
    }
});

/**
 * Wraps axis init to draw cell walls on vertical axes.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {
    var axis = this,
        gridOptions = (
            (userOptions && isObject(userOptions.grid)) ?
            userOptions.grid :
            {}
        ),
        columnOptions,
        column,
        columnIndex,
        i;
    function applyGridOptions(axis) {
        var options = axis.options,
            // TODO: Consider using cell margins defined in % of font size?
            // 25 is optimal height for default fontSize (11px)
            // 25 / 11 ≈ 2.28
            fontSizeToCellHeightRatio = 25 / 11,
            fontSize = options.labels.style.fontSize,
            fontMetrics = axis.chart.renderer.fontMetrics(fontSize);

        // Center-align by default
        if (!options.labels) {
            options.labels = {};
        }
        options.labels.align = pick(options.labels.align, 'center');

        // TODO: Check against tickLabelPlacement between/on etc
        /**
         * Prevents adding the last tick label if the axis is not a category
         * axis.
         *
         * Since numeric labels are normally placed at starts and ends of a
         * range of value, and this module makes the label point at the value,
         * an "extra" label would appear.
         */
        if (!axis.categories) {
            options.showLastLabel = false;
        }

        /**
         * Make tick marks taller, creating cell walls of a grid.
         * Use cellHeight axis option if set
         */
        if (axis.horiz) {
            options.tickLength = options.cellHeight ||
                    fontMetrics.h * fontSizeToCellHeightRatio;
        } else {
            options.tickWidth = pick(options.tickWidth, 1);
            options.lineWidth = pick(options.lineWidth, 1);
        }

        /**
         * Prevents rotation of labels when squished, as rotating them would not
         * help.
         */
        axis.labelRotation = 0;
        options.labels.rotation = 0;
    }

    if (gridOptions.enabled) {
        if (defined(gridOptions.borderColor)) {
            userOptions.tickColor =
                userOptions.lineColor = gridOptions.borderColor;
        }
        if (defined(gridOptions.borderWidth)) {
            userOptions.tickWidth =
                userOptions.lineWidth = gridOptions.borderWidth;
        }

        // Handle columns, each column is a grid axis
        if (isArray(gridOptions.columns)) {
            columnIndex = 0;
            i = gridOptions.columns.length;
            while (i--) {
                columnOptions = merge(
                    {
                        labels: {
                            format: '{point.name}'
                        }
                    },
                    userOptions,
                    gridOptions.columns[i],
                    {
                        // Force to behave like category axis
                        type: 'category'
                    }
                );

                delete columnOptions.grid.columns; // Prevent recursion

                column = new Axis(chart, columnOptions);
                column.isColumn = true;
                column.columnIndex = columnIndex;

                wrap(column, 'labelFormatter', function (proceed) {
                    var axis = this.axis,
                        tickPos = axis.tickPositions,
                        value = this.value,
                        series = axis.series[0],
                        isFirst = value === tickPos[0],
                        isLast = value === tickPos[tickPos.length - 1],
                        point = H.find(series.options.data, function (p) {
                            return p[axis.isXAxis ? 'x' : 'y'] === value;
                        });

                    // Make additional properties available for the formatter
                    this.isFirst = isFirst;
                    this.isLast = isLast;
                    this.point = point;

                    // Call original labelFormatter
                    return proceed.call(this);
                });

                columnIndex++;
            }
        } else {
            // Call original Axis.init()
            proceed.apply(axis, argsToArray(arguments));
            applyGridOptions(axis);
        }
    } else {
        // Call original Axis.init()
        proceed.apply(axis, argsToArray(arguments));
    }
});
