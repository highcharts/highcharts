/**********************************
 * Highcharts GridAxis module *
 **********************************/
'use strict';
import H from '../parts/Globals.js';

var isObject = H.isObject;

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
 * @return true if the axis is the outermost axis in its dimension;
 *         false if not
 */
H.Axis.prototype.isOuterAxis = function () {
    var axis = this,
        thisIndex = -1,
        isOuter = true;

    H.each(this.chart.axes, function (otherAxis, index) {
        if (otherAxis.side === axis.side) {
            if (otherAxis === axis) {
                // Get the index of the axis in question
                thisIndex = index;

                // Check thisIndex >= 0 in case thisIndex has
                // not been found yet
            } else if (thisIndex >= 0 && index > thisIndex) {
                // There was an axis on the same side with a
                // higher index. Exit the loop.
                isOuter = false;
                return;
            }
        }
    });
    // There were either no other axes on the same side,
    // or the other axes were not farther from the chart
    return isOuter;
};

/**
 * Shortcut function to Tick.label.getBBox().width.
 *
 * @return {number} width - the width of the tick label
 */
H.Tick.prototype.getLabelWidth = function () {
    return this.label.getBBox().width;
};

/**
 * Add custom date formats
 */
H.dateFormats = {
    // Week number
    W: function (timestamp) {
        var date = new Date(timestamp),
            day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
            dayNumber;
        date.setDate(date.getUTCDate() + 4 - day);
        dayNumber = Math.floor((date.getTime() - new Date(date.getUTCFullYear(), 0, 1, -6)) / 86400000);
        return 1 + Math.floor(dayNumber / 7);
    },
    // First letter of the day of the week, e.g. 'M' for 'Monday'.
    E: function (timestamp) {
        return H.dateFormat('%a', timestamp, true).charAt(0);
    }
};

/**
 * Prevents adding the last tick label if the axis type is datetime.
 *
 * Since datetime labels are normally placed at starts and ends of a
 * period of time, and this module converts labels to
 *
 * @param proceed - the original function
 */
H.wrap(H.Tick.prototype, 'addLabel', function (proceed) {
    var axis = this.axis,
        tickPositions = axis.tickPositions;

    if (axis.options.type !== 'datetime' || this.pos !== tickPositions[tickPositions.length - 1]) {
        proceed.apply(this);
    }
});

/**
 * Center tick labels vertically and horizontally between ticks
 *
 * @param proceed - the original function
 *
 * @return {object} object - an object containing x and y positions
 *                         for the tick
 */
H.wrap(H.Tick.prototype, 'getLabelPosition', function (proceed, x, y, label) {
    var returnValue = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
        axis = this.axis,
        tickInterval = axis.options.tickInterval || 1,
        newX,
        newPos,
        axisHeight,
        fontSize,
        labelMetrics;

    // Only center tick labels if axis has option grid: true
    if (axis.options.grid) {
        fontSize = axis.options.labels.style.fontSize;
        labelMetrics = axis.chart.renderer.fontMetrics(fontSize, label);
        axisHeight = axis.axisGroup.getBBox().height;

        if (axis.horiz && axis.options.categories === undefined) {
            // Center x position
            newPos = this.pos + tickInterval / 2;
            returnValue.x = axis.translate(newPos) + axis.left;

            // Center y position
            if (axis.side === axisSide.top) {
                returnValue.y = y - (axisHeight / 2) + (labelMetrics.h / 2) - Math.abs(labelMetrics.h - labelMetrics.b);
            } else {
                returnValue.y = y + (axisHeight / 2) + (labelMetrics.h / 2) - Math.abs(labelMetrics.h - labelMetrics.b);
            }
        } else {
            // Center y position
            if (axis.options.categories === undefined) {
                newPos = this.pos + (tickInterval / 2);
                returnValue.y = axis.translate(newPos) + axis.top + (labelMetrics.b / 2);
            }

            // Center x position
            newX = (this.getLabelWidth() / 2) - (axis.maxLabelLength / 2);
            if (axis.side === axisSide.left) {
                returnValue.x += newX;
            } else {
                returnValue.x -= newX;
            }
        }
    }
    return returnValue;
});

H.Axis.prototype.getMaxLabelLength = function (force) {
    var tickPositions = this.tickPositions,
        ticks = this.ticks,
        maxLabelLength = 0;

    if (!this.maxLabelLength || force) {
        H.each(tickPositions, function (tick) {
            tick = ticks[tick];
            if (tick && tick.labelLength > maxLabelLength) {
                maxLabelLength = tick.labelLength;
            }
        });
        this.maxLabelLength = maxLabelLength;
    }
    return this.maxLabelLength;
};

/**
 * Draw vertical ticks extra long to create cell floors and roofs.
 * Overrides the tickLength for vertical axes.
 *
 * @param {function} proceed - the original function
 * @returns {array} returnValue -
 */
H.wrap(H.Axis.prototype, 'tickSize', function (proceed) {
    var returnValue = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
        labelPadding,
        distance;

    if (!this.horiz) {
        labelPadding = (Math.abs(this.defaultLeftAxisOptions.labels.x) * 2);
        if (!this.maxLabelLength) {
            this.maxLabelLength = this.getMaxLabelLength();
        }
        distance = this.maxLabelLength + labelPadding;

        returnValue[0] = distance;
    }
    return returnValue;
});

H.wrap(H.Axis.prototype, 'getOffset', function (proceed) {
    if (this.options.grid && isObject(this.options.title)) {
        this.options.title.margin = 0;
    }
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});

/**
 * Replicates category axis translation to all axis types.
 *
 * @param proceed - the original function
 */
H.wrap(H.Axis.prototype, 'setAxisTranslation', function (proceed) {
    // Call the original setAxisTranslation() to perform all other calculations

    if (this.options.grid && !this.options.categories) {
        this.minPointOffset = 0.5;
        this.pointRangePadding = 1;

        this.translationSlope = this.transA = this.len / ((this.max - this.min + this.pointRangePadding) || 1);
        this.transB = this.horiz ? this.left : this.bottom; // translation addend
        this.minPixelPadding = this.transA * this.minPointOffset;

        // Ensure that linear axes get a minPixelPadding of 0
        if (this.options.type === 'linear') {
            this.minPixelPadding = 0;
        }
    } else {
        proceed.apply(this, Array.prototype.slice.call(arguments, 1));
    }
});

/**
 * Prevents rotation of labels when squished, as rotating them would not
 * help.
 *
 * @param proceed - the original function
 */
H.wrap(H.Axis.prototype, 'renderUnsquish', function (proceed) {
    if (this.options.grid) {
        this.labelRotation = 0;
        this.options.labels.rotation = 0;
    }
    proceed.apply(this);
});

/**
 * Draw an extra line on the far side of the the axisLine,
 * creating cell roofs of a grid.
 *
 * @param proceed - the original function
 */
H.wrap(H.Axis.prototype, 'render', function (proceed) {
    var labelPadding,
        distance,
        lineWidth,
        linePath,
        yStartIndex,
        yEndIndex,
        xStartIndex,
        xEndIndex;

    if (this.options.grid) {
        labelPadding = (Math.abs(this.defaultLeftAxisOptions.labels.x) * 2);
        distance = this.maxLabelLength + labelPadding;
        lineWidth = this.options.lineWidth;

        // Call original Axis.render() to obtain this.axisLine and this.axisGroup
        proceed.apply(this);

        if (this.isOuterAxis() && this.axisLine) {
            if (this.horiz) {
                // -1 to avoid adding distance each time the chart updates
                distance = this.axisGroup.getBBox().height - 1;
            }

            if (lineWidth) {
                linePath = this.getLinePath(lineWidth);
                yStartIndex = linePath.indexOf('M') + 2;
                yEndIndex = linePath.indexOf('L') + 2;
                xStartIndex = linePath.indexOf('M') + 1;
                xEndIndex = linePath.indexOf('L') + 1;

                // Negate distance if top or left axis
                if (this.side === axisSide.top || this.side === axisSide.left) {
                    distance = -distance;
                }

                // If axis is horizontal, reposition line path vertically
                if (this.horiz) {
                    linePath[yStartIndex] = linePath[yStartIndex] + distance;
                    linePath[yEndIndex] = linePath[yEndIndex] + distance;
                } else {
                    // If axis is vertical, reposition line path horizontally
                    linePath[xStartIndex] = linePath[xStartIndex] + distance;
                    linePath[xEndIndex] = linePath[xEndIndex] + distance;
                }

                if (!this.axisLineExtra) {
                    this.axisLineExtra = this.chart.renderer.path(linePath)
                        .attr({
                            stroke: this.options.lineColor,
                            'stroke-width': lineWidth,
                            zIndex: 7
                        })
                        .add(this.axisGroup);
                } else {
                    this.axisLineExtra.animate({
                        d: linePath
                    });
                }

                // show or hide the line depending on options.showEmpty
                this.axisLine[this.showAxis ? 'show' : 'hide'](true);
            }
        }
    } else {
        proceed.apply(this);
    }
});

/**
 * Wraps chart rendering with the following customizations:
 * 1. Prohibit timespans of multitudes of a time unit
 * 2. Draw cell walls on vertical axes
 *
 * @param proceed - the original function
 */
H.wrap(H.Chart.prototype, 'render', function (proceed) {
    // 25 is optimal height for default fontSize (11px)
    // 25 / 11 ≈ 2.28
    var fontSizeToCellHeightRatio = 25 / 11,
        fontMetrics,
        fontSize;

    H.each(this.axes, function (axis) {
        if (axis.options.grid) {
            fontSize = axis.options.labels.style.fontSize;
            fontMetrics = axis.chart.renderer.fontMetrics(fontSize);

            // Prohibit timespans of multitudes of a time unit,
            // e.g. two days, three weeks, etc.
            if (axis.options.type === 'datetime') {
                axis.options.units = [
                    ['millisecond', [1]],
                    ['second', [1]],
                    ['minute', [1]],
                    ['hour', [1]],
                    ['day', [1]],
                    ['week', [1]],
                    ['month', [1]],
                    ['year', null]
                ];
            }

            // Make tick marks taller, creating cell walls of a grid.
            // Use cellHeight axis option if set
            if (axis.horiz) {
                axis.options.tickLength = axis.options.cellHeight || fontMetrics.h * fontSizeToCellHeightRatio;
            } else {
                axis.options.tickWidth = 1;
                if (!axis.options.lineWidth) {
                    axis.options.lineWidth = 1;
                }
            }
        }
    });

    // Call original Chart.render()
    proceed.apply(this);
});
