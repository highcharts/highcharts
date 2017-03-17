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
 *		 false if not
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
 * Get the maximum label length.
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
		var date = new Date(timestamp),
			day = date.getUTCDay() === 0 ? 7 : date.getUTCDay(),
			time = date.getTime(),
			startOfYear = new Date(date.getUTCFullYear(), 0, 1, -6),
			dayNumber;
		date.setDate(date.getUTCDate() + 4 - day);
		dayNumber = Math.floor((time - startOfYear) / 86400000);
		return 1 + Math.floor(dayNumber / 7);
	},
	// First letter of the day of the week, e.g. 'M' for 'Monday'.
	E: function (timestamp) {
		return dateFormat('%a', timestamp, true).charAt(0);
	}
};

/**
 * If chart is stockChart, always return 'left' to avoid first label being
 * placed inside chart.
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
 * Center tick labels vertically and horizontally between ticks
 *
 * @param {function} proceed - the original function
 *
 * @return {object} object - an object containing x and y positions
 *						 for the tick
 */
wrap(Tick.prototype, 'getLabelPosition', function (proceed, x, y, label, horiz, labelOpts, tmo, index) {
	var tick = this,
		retVal = proceed.apply(tick, argsToArray(arguments)),
		axis = tick.axis,
		options = axis.options,
		categoryAxis = axis.categories,
		tickInterval = options.tickInterval || axis.tickInterval,
		tickPositions = axis.tickPositions,
		lastTickPos = tickPositions[tickPositions.length - 2],
		nextTickPos = tickPositions[index + 1],
		align = labelOpts.align,
		tickPixelInterval,
		xChange,
		axisMin,
		lblMetrics,
		axisYCenter,
		labelYCenter;

	// Only center tick labels in grid axes
	if (options.grid) {
		lblMetrics = axis.chart.renderer.fontMetrics(
			labelOpts.style.fontSize,
			label.element
		);
		labelYCenter = (lblMetrics.b / 2) - ((lblMetrics.h - lblMetrics.f) / 2);

		if (horiz) {
			if (!categoryAxis) {
				// Center x position
				if (tick.pos === lastTickPos) { // Last tick
					retVal.x = (axis.left + axis.len + x) / 2;
				} else { // First and subsequent ticks
					if (isNumber(nextTickPos)) {
						x = axis.translate((tick.pos + nextTickPos) / 2);
					}
					retVal.x = x + axis.left;
				}
			}

			axisYCenter = (axis.axisGroup.getBBox().height / 2);

			y += labelYCenter;

			// Center y position
			if (axis.side === axisSide.top) {
				retVal.y = y - axisYCenter;
			} else {
				retVal.y = y + axisYCenter;
			}
		} else {
			// Center y position
			if (!categoryAxis) {
				axisMin = axis.reversed ? axis.max : axis.min;
				tickPixelInterval = axis.translate(axisMin + tickInterval);
				retVal.y = y - (tickPixelInterval / 2) + labelYCenter;
			}

			// Center x position
			xChange = 10;
			if (align === 'left') {
				if (!categoryAxis || axis.side === axisSide.left) {
					retVal.x -= axis.getMaxLabelLength();
				} else {
					xChange = -10;
				}
			} else if (align === 'right') {
				if (!categoryAxis || axis.side === axisSide.right) {
					retVal.x += axis.getMaxLabelLength();
				} else {
					xChange = -10;
				}
			} else { // Default: 'center'
				xChange = axis.getMaxLabelLength() / 2;
			}

			if (axis.side === axisSide.left) {
				retVal.x -= xChange;
			} else {
				retVal.x += xChange;
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
		retVal = proceed.apply(axis, argsToArray(arguments)),
		labelPadding,
		distance;

	if (axis.options.grid && !axis.horiz) {
		labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
		distance = axis.getMaxLabelLength() + labelPadding;

		if (isArray(retVal)) {
			retVal[0] = distance;
		}
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
		tickSize;

	if (axis.options.grid) {

		proceed.apply(axis, argsToArray(arguments));

		// Calculate tick size and see if it's larger than the calculated axis
		// offset.
		tickSize = axis.tickSize('tick')[0];
		axisOffset[side] = Math.max(axisOffset[side], tickSize);
	} else {
		proceed.apply(axis, argsToArray(arguments));
	}
});

/**
 * Avoid altering tickInterval when reserving space.
 */
wrap(Axis.prototype, 'unsquish', function (proceed) {
	var axis = this,
		retVal;
	if (axis.categories) {
		retVal = this.tickInterval;
	} else {
		retVal = proceed.apply(axis, argsToArray(arguments));
	}
	return retVal;
});

/**
 * Creates a left and right wall on horizontal axes:
 * - Places leftmost tick at the start of the axis, to create a left wall
 * - Ensures that the rightmost tick is at the end of the axis, minus the tick
 *   interval, to create a right wall.
 *
 * @param {function} proceed - the original function
 * @param {object} options - the pure axis options as input by the user
 */
wrap(Axis.prototype, 'setOptions', function (proceed, options) {
	var axis = this;

	if (options.grid) {

		/**
		 * Sets the axis title to null unless otherwise specified by user.
		 */
		if (!options.title) {
			options.title = '';
		} else if (options.title && !options.title.text) {
			options.title.text = null;
		}

		if (axis.horiz) {
			/**              _________________________
			 * Make this:    ___|_____|_____|_____|__|
			 *               ^                     ^
			 *               _________________________
			 * Into this:    |_____|_____|_____|_____|
			 *                  ^                 ^
			 */
			options.minPadding = pick(options.minPadding, 0);
			options.maxPadding = pick(options.maxPadding, 0);
		}
	}

	proceed.apply(this, argsToArray(arguments));
});

/**
 * Ensures a left wall on horizontal axes with series inheriting from column:
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
	var axis = this;
	if (axis.options.grid && axis.horiz) {
		each(axis.series, function (series) {
			series.options.pointRange = 0;
		});
	}
	proceed.apply(axis, argsToArray(arguments));
});

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
		isGridAxis = axis.options.grid,
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

	if (isGridAxis && !categoryAxis && (axis.horiz || axis.isLinked)) {
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
		horiz = axis.horiz,
		axisGroupBox;

	if (options.grid) {
		// TODO acutual label padding (top, bottom, left, right)
		labelPadding = (Math.abs(axis.defaultLeftAxisOptions.labels.x) * 2);
		distance = axis.getMaxLabelLength() + labelPadding;
		lineWidth = options.lineWidth;

		// Remove right wall before rendering
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
 * Wraps axis init with the following customizations:
 * 1. Prohibit timespans of multitudes of a time unit
 * 2. Draw cell walls on vertical axes
 *
 * @param {function} proceed - the original function
 */
wrap(Axis.prototype, 'init', function (proceed, chart, userOptions) {
	var axis = this,
		columnOptions,
		column,
		columnIndex,
		i;
	function applyGridOptions(axis) {
		var options = axis.options,
			// 25 is optimal height for default fontSize (11px)
			// 25 / 11 ≈ 2.28
			fontSizeToCellHeightRatio = 25 / 11,
			fontSize = options.labels.style.fontSize,
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

		// Center-align by default
		if (!options.labels) {
			options.labels = {};
		}
		options.labels.align = pick(options.labels.align, 'center');

		/**
		 * Prevents adding the last tick label if the axis is not a category axis.
		 *
		 * Since numeric labels are normally placed at starts and ends of a range of
		 * value, and this module makes the label point at the value, an "extra" label
		 * would appear.
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
			if (!options.lineWidth) {
				options.lineWidth = 1;
			}
		}

		/**
		 * Prevents rotation of labels when squished, as rotating them would not
		 * help.
		 */
		axis.labelRotation = 0;
		options.labels.rotation = 0;
	}
	
	if (userOptions.grid) {
		if (defined(userOptions.grid.borderColor)) {
			userOptions.tickColor = userOptions.grid.borderColor;
			userOptions.lineColor = userOptions.grid.borderColor;
		}
		if (defined(userOptions.grid.borderWidth)) {
			userOptions.tickWidth = userOptions.grid.borderWidth;
			userOptions.lineWidth = userOptions.grid.borderWidth;
		}

		if (isArray(userOptions.grid.columns)) {
			axis.columns = [];
			columnIndex = 0;
			i = userOptions.grid.columns.length;
			while (i--) {
				columnOptions = merge(userOptions, userOptions.grid.columns[i]);
				delete columnOptions.grid.columns; // Prevent recursion
				column = new Axis(chart, columnOptions);
				column.isColumn = true;
				column.columnIndex = columnIndex;
				axis.columns.push(column); // eslint-disable-line no-new
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
