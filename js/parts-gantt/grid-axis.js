/**
* (c) 2016 Highsoft AS
* Authors: Lars A. V. Cabrera
*
* License: www.highcharts.com/license
*/
'use strict';
import H from '../parts/Globals.js';

var each = H.each,
    isObject = H.isObject,
    pick = H.pick,
    wrap = H.wrap,
    Axis = H.Axis,
    Chart = H.Chart,
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
        thisIndex = -1,
        isOuter = true;

    each(this.chart.axes, function (otherAxis, index) {
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
Tick.prototype.getLabelWidth = function () {
    return this.label.getBBox().width;
};

/**
 * Get the maximum label length.
 * This function can be used in states where the axis.maxLabelLength has not
 * been set.
 *
 * @param  {boolean} force - Optional parameter to force a new calculation, even
 *                           if a value has already been set
 * @return {number} maxLabelLength - the maximum label length of the axis
 */
Axis.prototype.getMaxLabelLength = function (force) {
    var tickPositions = this.tickPositions,
        ticks = this.ticks,
        maxLabelLength = 0;

    if (!this.maxLabelLength || force) {
        each(tickPositions, function (tick) {
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
 * Adds the axis defined in axis.options.title
 */
Axis.prototype.addTitle = function () {
    var axis = this,
        renderer = axis.chart.renderer,
        axisParent = axis.axisParent,
        horiz = axis.horiz,
        opposite = axis.opposite,
        options = axis.options,
        axisTitleOptions = options.title,
        hasData,
        showAxis,
        textAlign;

    // For reuse in Axis.render
    hasData = axis.hasData();
    axis.showAxis = showAxis = hasData || pick(options.showEmpty, true);

    // Disregard title generation in original Axis.getOffset()
    options.title = '';

    if (!axis.axisTitle) {
        textAlign = axisTitleOptions.textAlign;
        if (!textAlign) {
            textAlign = (horiz ? {
                low: 'left',
                middle: 'center',
                high: 'right'
            } : {
                low: opposite ? 'right' : 'left',
                middle: 'center',
                high: opposite ? 'left' : 'right'
            })[axisTitleOptions.align];
        }
        axis.axisTitle = renderer.text(
            axisTitleOptions.text,
            0,
            0,
            axisTitleOptions.useHTML
        )
        .attr({
            zIndex: 7,
            rotation: axisTitleOptions.rotation || 0,
            align: textAlign
        })
        .addClass('highcharts-axis-title')
        /*= if (build.classic) { =*/
        .css(axisTitleOptions.style)
        /*= } =*/
        // Add to axisParent instead of axisGroup, to ignore the space
        // it takes
        .add(axisParent);
        axis.axisTitle.isNew = true;
    }


    // hide or show the title depending on whether showEmpty is set
    axis.axisTitle[showAxis ? 'show' : 'hide'](true);
};

/**
 * Add custom date formats
 */
H.dateFormats = {
    // Week number
    W: function (timestamp) {
        var date = new this.Date(timestamp),
            day = this.get('Day', date) === 0 ? 7 : this.get('Day', date),
            time = date.getTime(),
            startOfYear = new Date(this.get('FullYear', date), 0, 1, -6),
            dayNumber;
        this.set('Date', date, this.get('Date', date) + 4 - day);
        dayNumber = Math.floor((time - startOfYear) / 86400000);
        return 1 + Math.floor(dayNumber / 7);
    },
    // First letter of the day of the week, e.g. 'M' for 'Monday'.
    E: function (timestamp) {
        return this.dateFormat('%a', timestamp, true).charAt(0);
    }
};

/**
 * Prevents adding the last tick label if the axis is not a category axis.
 *
 * Since numeric labels are normally placed at starts and ends of a range of
 * value, and this module makes the label point at the value, an "extra" label
 * would appear.
 *
 * @param {function} proceed - the original function
 */
wrap(Tick.prototype, 'addLabel', function (proceed) {
    var axis = this.axis,
        isCategoryAxis = axis.options.categories !== undefined,
        tickPositions = axis.tickPositions,
        lastTick = tickPositions[tickPositions.length - 1],
        isLastTick = this.pos !== lastTick;

    if (!axis.options.grid || isCategoryAxis || isLastTick) {
        proceed.apply(this);
    }
});

/**
 * Center tick labels vertically and horizontally between ticks
 *
 * @param {function} proceed - the original function
 *
 * @return {object} object - an object containing x and y positions
 *                         for the tick
 */
wrap(Tick.prototype, 'getLabelPosition', function (proceed, x, y, label) {
    var retVal = proceed.apply(this, Array.prototype.slice.call(arguments, 1)),
        axis = this.axis,
        options = axis.options,
        tickInterval = options.tickInterval || 1,
        newX,
        newPos,
        axisHeight,
        fontSize,
        labelMetrics,
        lblB,
        lblH,
        labelCenter;

    // Only center tick labels if axis has option grid: true
    if (options.grid) {
        fontSize = options.labels.style.fontSize;
        labelMetrics = axis.chart.renderer.fontMetrics(fontSize, label);
        lblB = labelMetrics.b;
        lblH = labelMetrics.h;

        if (axis.horiz && options.categories === undefined) {
            // Center x position
            axisHeight = axis.axisGroup.getBBox().height;
            newPos = this.pos + tickInterval / 2;
            retVal.x = axis.translate(newPos) + axis.left;
            labelCenter = (axisHeight / 2) + (lblH / 2) - Math.abs(lblH - lblB);

            // Center y position
            if (axis.side === axisSide.top) {
                retVal.y = y - labelCenter;
            } else {
                retVal.y = y + labelCenter;
            }
        } else {
            // Center y position
            if (options.categories === undefined) {
                newPos = this.pos + (tickInterval / 2);
                retVal.y = axis.translate(newPos) + axis.top + (lblB / 2);
            }

            // Center x position
            newX = (this.getLabelWidth() / 2) - (axis.maxLabelLength / 2);
            if (axis.side === axisSide.left) {
                retVal.x += newX;
            } else {
                retVal.x -= newX;
            }
        }
    }
    return retVal;
});


/**
 * Draw vertical ticks extra long to create cell floors and roofs.
 * Overrides the tickLength for vertical axes.
 *
 * @param {function} proceed - the original function
 * @returns {array} retVal -
 */
wrap(Axis.prototype, 'tickSize', function (proceed) {
    var axis = this,
        retVal = proceed.apply(axis, Array.prototype.slice.call(arguments, 1)),
        labelPadding,
        distance;

    if (axis.options.grid && !axis.horiz) {
        labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
        if (!axis.maxLabelLength) {
            axis.maxLabelLength = axis.getMaxLabelLength();
        }
        distance = axis.maxLabelLength + labelPadding;

        retVal[0] = distance;
    }
    return retVal;
});

/**
 * Disregards space required by axisTitle, by adding axisTitle to axisParent
 * instead of axisGroup, and disregarding margins and offsets related to
 * axisTitle.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'getOffset', function (proceed) {
    var axis = this,
        axisOffset = axis.chart.axisOffset,
        side = axis.side,
        axisHeight,
        tickSize,
        options = axis.options,
        axisTitleOptions = options.title,
        addTitle = axisTitleOptions &&
                axisTitleOptions.text &&
                axisTitleOptions.enabled !== false;

    if (axis.options.grid && isObject(axis.options.title)) {

        tickSize = axis.tickSize('tick')[0];
        if (axisOffset[side] && tickSize) {
            axisHeight = axisOffset[side] + tickSize;
        }

        if (addTitle) {
            // Use the custom addTitle() to add it, while preventing making room
            // for it
            axis.addTitle();
        }

        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));

        axisOffset[side] = pick(axisHeight, axisOffset[side]);


        // Put axis options back after original Axis.getOffset() has been called
        options.title = axisTitleOptions;

    } else {
        proceed.apply(axis, Array.prototype.slice.call(arguments, 1));
    }
});

/**
 * Prevents rotation of labels when squished, as rotating them would not
 * help.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'renderUnsquish', function (proceed) {
    if (this.options.grid) {
        this.labelRotation = 0;
        this.options.labels.rotation = 0;
    }
    proceed.apply(this);
});

/**
 * Places leftmost tick at the start of the axis, to create a left wall.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'setOptions', function (proceed, userOptions) {
    var axis = this;
    if (userOptions.grid && axis.horiz) {
        userOptions.startOnTick = true;
        userOptions.minPadding = 0;
        userOptions.endOnTick = true;
    }
    proceed.apply(this, Array.prototype.slice.call(arguments, 1));
});

/**
 * Draw an extra line on the far side of the the axisLine,
 * creating cell roofs of a grid.
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'render', function (proceed) {
    var axis = this,
        options = axis.options,
        labelPadding,
        distance,
        lineWidth,
        linePath,
        yStartIndex,
        yEndIndex,
        xStartIndex,
        xEndIndex,
        renderer = axis.chart.renderer,
        axisGroupBox;

    if (options.grid) {
        labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
        distance = axis.maxLabelLength + labelPadding;
        lineWidth = options.lineWidth;

        // Remove right wall before rendering
        if (axis.rightWall) {
            axis.rightWall.destroy();
        }

        // Call original Axis.render() to obtain axis.axisLine and
        // axis.axisGroup
        proceed.apply(axis);

        axisGroupBox = axis.axisGroup.getBBox();

        // Add right wall on horizontal axes
        if (axis.horiz) {
            axis.rightWall = renderer.path([
                'M',
                axisGroupBox.x + axis.width + 1, // account for left wall
                axisGroupBox.y,
                'L',
                axisGroupBox.x + axis.width + 1, // account for left wall
                axisGroupBox.y + axisGroupBox.height
            ])
            .attr({
                stroke: options.tickColor || '#ccd6eb',
                'stroke-width': options.tickWidth || 1,
                zIndex: 7,
                class: 'grid-wall'
            })
            .add(axis.axisGroup);
        }

        if (axis.isOuterAxis() && axis.axisLine) {
            if (axis.horiz) {
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
                if (axis.horiz) {
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
 * Wraps chart rendering with the following customizations:
 * 1. Prohibit timespans of multitudes of a time unit
 * 2. Draw cell walls on vertical axes
 *
 * @param {function} proceed - the original function
 */
wrap(Chart.prototype, 'render', function (proceed) {
    // 25 is optimal height for default fontSize (11px)
    // 25 / 11 ≈ 2.28
    var fontSizeToCellHeightRatio = 25 / 11,
        fontMetrics,
        fontSize;

    each(this.axes, function (axis) {
        var options = axis.options;
        if (options.grid) {
            fontSize = options.labels.style.fontSize;
            fontMetrics = axis.chart.renderer.fontMetrics(fontSize);

            // Prohibit timespans of multitudes of a time unit,
            // e.g. two days, three weeks, etc.
            if (options.type === 'datetime') {
                options.units = [
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
                options.tickLength = options.cellHeight ||
                        fontMetrics.h * fontSizeToCellHeightRatio;
            } else {
                options.tickWidth = 1;
                if (!options.lineWidth) {
                    options.lineWidth = 1;
                }
            }
        }
    });

    // Call original Chart.render()
    proceed.apply(this);
});
