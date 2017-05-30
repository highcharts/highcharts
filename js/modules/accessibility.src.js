/**
 * Accessibility module
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Point.js';
import '../parts/Tooltip.js';

var win = H.win,
	doc = win.document,
	each = H.each,
	erase = H.erase,
	addEvent = H.addEvent,
	removeEvent = H.removeEvent,
	fireEvent = H.fireEvent,
	dateFormat = H.dateFormat,
	merge = H.merge,
	// Human readable description of series and each point in singular and plural
	typeToSeriesMap = {
		'default': ['series', 'data point', 'data points'],
		'line': ['line', 'data point', 'data points'],
		'spline': ['line', 'data point', 'data points'],
		'area': ['line', 'data point', 'data points'],
		'areaspline': ['line', 'data point', 'data points'],
		'pie': ['pie', 'slice', 'slices'],
		'column': ['column series', 'column', 'columns'],
		'bar': ['bar series', 'bar', 'bars'],
		'scatter': ['scatter series', 'data point', 'data points'],
		'boxplot': ['boxplot series', 'box', 'boxes'],
		'arearange': ['arearange series', 'data point', 'data points'],
		'areasplinerange': ['areasplinerange series', 'data point', 'data points'],
		'bubble': ['bubble series', 'bubble', 'bubbles'],
		'columnrange': ['columnrange series', 'column', 'columns'],
		'errorbar': ['errorbar series', 'errorbar', 'errorbars'],
		'funnel': ['funnel', 'data point', 'data points'],
		'pyramid': ['pyramid', 'data point', 'data points'],
		'waterfall': ['waterfall series', 'column', 'columns'],
		'map': ['map', 'area', 'areas'],
		'mapline': ['line', 'data point', 'data points'],
		'mappoint': ['point series', 'data point', 'data points'],
		'mapbubble': ['bubble series', 'bubble', 'bubbles']
	},
	// Descriptions for exotic chart types
	typeDescriptionMap = {
		boxplot: ' Box plot charts are typically used to display groups of statistical data. ' +
				'Each data point in the chart can have up to 5 values: minimum, lower quartile, median, upper quartile and maximum. ',
		arearange: ' Arearange charts are line charts displaying a range between a lower and higher value for each point. ',
		areasplinerange: ' These charts are line charts displaying a range between a lower and higher value for each point. ',
		bubble: ' Bubble charts are scatter charts where each data point also has a size value. ',
		columnrange: ' Columnrange charts are column charts displaying a range between a lower and higher value for each point. ',
		errorbar: ' Errorbar series are used to display the variability of the data. ',
		funnel: ' Funnel charts are used to display reduction of data in stages. ',
		pyramid: ' Pyramid charts consist of a single pyramid with item heights corresponding to each point value. ',
		waterfall: ' A waterfall chart is a column chart where each column contributes towards a total end value. '
	};

// If a point has one of the special keys defined, we expose all keys to the
// screen reader.
H.Series.prototype.commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'];
H.Series.prototype.specialKeys = [
	'z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close'
]; 

// A pie is always simple. Don't quote me on that.
if (H.seriesTypes.pie) {
	H.seriesTypes.pie.prototype.specialKeys = [];
}


// Default a11y options
H.setOptions({
	accessibility: {
		enabled: true,
		pointDescriptionThreshold: 30, // set to false to disable
		keyboardNavigation: {
			enabled: true
		//	skipNullPoints: false
		}
		// describeSingleSeries: false
	}
});

/**
 * HTML encode some characters vulnerable for XSS.
 * @param  {string} html The input string
 * @return {string} The excaped string
 */
function htmlencode(html) {
	return html
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#x27;')
		.replace(/\//g, '&#x2F;');
}

// Utility function. Reverses child nodes of a DOM element
function reverseChildNodes(node) {
	var i = node.childNodes.length;
	while (i--) {
		node.appendChild(node.childNodes[i]);
	}
}

// Utility function to attempt to fake a click event on an element
function fakeClickEvent(element) {
	var fakeEvent;
	if (element && element.onclick && doc.createEvent) {
		fakeEvent = doc.createEvent('Events');
		fakeEvent.initEvent('click', true, false);
		element.onclick(fakeEvent);
	}
}

// Whenever drawing series, put info on DOM elements
H.wrap(H.Series.prototype, 'render', function (proceed) {
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	if (this.chart.options.accessibility.enabled) {
		this.setA11yDescription();
	}
});

// Put accessible info on series and points of a series
H.Series.prototype.setA11yDescription = function () {
	var a11yOptions = this.chart.options.accessibility,
		firstPointEl = this.points && this.points.length && this.points[0].graphic && this.points[0].graphic.element,
		seriesEl = firstPointEl && firstPointEl.parentNode || this.graph && this.graph.element || this.group && this.group.element; // Could be tracker series depending on series type

	if (seriesEl) {
		// For some series types the order of elements do not match the order of points in series
		// In that case we have to reverse them in order for AT to read them out in an understandable order
		if (seriesEl.lastChild === firstPointEl) {
			reverseChildNodes(seriesEl);
		}
		// Make individual point elements accessible if possible. Note: If markers are disabled there might not be any elements there to make accessible.
		if (this.points && (this.points.length < a11yOptions.pointDescriptionThreshold || a11yOptions.pointDescriptionThreshold === false)) {
			each(this.points, function (point) {
				if (point.graphic) {
					point.graphic.element.setAttribute('role', 'img');
					point.graphic.element.setAttribute('tabindex', '-1');
					point.graphic.element.setAttribute('aria-label', 
						point.series.options.pointDescriptionFormatter && 
						point.series.options.pointDescriptionFormatter(point) ||
						a11yOptions.pointDescriptionFormatter && 
						a11yOptions.pointDescriptionFormatter(point) ||
						point.buildPointInfoString());
				}
			});
		}
		// Make series element accessible
		if (this.chart.series.length > 1 || a11yOptions.describeSingleSeries) {
			seriesEl.setAttribute(
				'role', 
				this.options.exposeElementToA11y ? 'img' : 'region'
			);
			seriesEl.setAttribute('tabindex', '-1');
			seriesEl.setAttribute('aria-label', a11yOptions.seriesDescriptionFormatter && a11yOptions.seriesDescriptionFormatter(this) ||
				this.buildSeriesInfoString());
		}
	}
};

// Return string with information about series
H.Series.prototype.buildSeriesInfoString = function () {
	var typeInfo = typeToSeriesMap[this.type] || typeToSeriesMap['default'], // eslint-disable-line dot-notation
		description = this.description || this.options.description;
	return (this.name ? this.name + ', ' : '') +
		(this.chart.types.length === 1 ? typeInfo[0] : 'series') + ' ' + (this.index + 1) + ' of ' + (this.chart.series.length) +
		(this.chart.types.length === 1 ? ' with ' : '. ' + typeInfo[0] + ' with ') +
		(this.points.length + ' ' + (this.points.length === 1 ? typeInfo[1] : typeInfo[2])) +
		(description ? '. ' + description : '') +
		(this.chart.yAxis.length > 1 && this.yAxis ? '. Y axis, ' + this.yAxis.getDescription() : '') +
		(this.chart.xAxis.length > 1 && this.xAxis ? '. X axis, ' + this.xAxis.getDescription() : '');
};

// Return string with information about point
H.Point.prototype.buildPointInfoString = function () {
	var point = this,
		series = point.series,
		a11yOptions = series.chart.options.accessibility,
		infoString = '',
		dateTimePoint = series.xAxis && series.xAxis.isDatetimeAxis,
		timeDesc = dateTimePoint && dateFormat(a11yOptions.pointDateFormatter && a11yOptions.pointDateFormatter(point) || a11yOptions.pointDateFormat ||
			H.Tooltip.prototype.getXDateFormat(point, series.chart.options.tooltip, series.xAxis), point.x),
		hasSpecialKey = H.find(series.specialKeys, function (key) {
			return point[key] !== undefined;
		});

	// If the point has one of the less common properties defined, display all that are defined
	if (hasSpecialKey) {
		if (dateTimePoint) {
			infoString = timeDesc;
		}
		each(series.commonKeys.concat(series.specialKeys), function (key) {
			if (point[key] !== undefined && !(dateTimePoint && key === 'x')) {
				infoString += (infoString ? '. ' : '') + key + ', ' + point[key];
			}
		});
	} else {
		// Pick and choose properties for a succint label
		infoString = (this.name || timeDesc || this.category || this.id || 'x, ' + this.x) + ', ' +
			(this.value !== undefined ? this.value : this.y);
	}

	return (this.index + 1) + '. ' + infoString + '.' + (this.description ? ' ' + this.description : '');
};

// Get descriptive label for axis
H.Axis.prototype.getDescription = function () {
	return this.userOptions && this.userOptions.description || this.axisTitle && this.axisTitle.textStr ||
			this.options.id || this.categories && 'categories' || 'values';
};

// Pan along axis in a direction (1 or -1), optionally with a defined granularity (number of steps it takes to walk across current view)
H.Axis.prototype.panStep = function (direction, granularity) {
	var gran = granularity || 3,
		extremes = this.getExtremes(),
		step = (extremes.max - extremes.min) / gran * direction,
		newMax = extremes.max + step,
		newMin = extremes.min + step,
		size = newMax - newMin;
	if (direction < 0 && newMin < extremes.dataMin) {
		newMin = extremes.dataMin;
		newMax = newMin + size;
	} else if (direction > 0 && newMax > extremes.dataMax) {
		newMax = extremes.dataMax;
		newMin = newMax - size;
	}
	this.setExtremes(newMin, newMax);
};

// Whenever adding or removing series, keep track of types present in chart
H.wrap(H.Series.prototype, 'init', function (proceed) {
	proceed.apply(this, Array.prototype.slice.call(arguments, 1));
	var chart = this.chart;
	if (chart.options.accessibility.enabled) {
		chart.types = chart.types || [];
		
		// Add type to list if does not exist
		if (chart.types.indexOf(this.type) < 0) {
			chart.types.push(this.type);
		}
		
		addEvent(this, 'remove', function () {
			var removedSeries = this,
				hasType = false;
			
			// Check if any of the other series have the same type as this one. Otherwise remove it from the list.
			each(chart.series, function (s) {
				if (s !== removedSeries && chart.types.indexOf(removedSeries.type) < 0) {
					hasType = true;
				}
			});
			if (!hasType) {
				erase(chart.types, removedSeries.type);
			}
		});
	}
});

// Return simplified description of chart type. Some types will not be familiar to most screen reader users, but we try.
H.Chart.prototype.getTypeDescription = function () {
	var firstType = this.types && this.types[0],
		mapTitle = this.series[0] && this.series[0].mapTitle;
	if (!firstType) {
		return 'Empty chart.';
	} else if (firstType === 'map') {
		return mapTitle ? 'Map of ' + mapTitle : 'Map of unspecified region.';
	} else if (this.types.length > 1) {
		return 'Combination chart.';
	} else if (['spline', 'area', 'areaspline'].indexOf(firstType) > -1) {
		return 'Line chart.';
	}
	return firstType + ' chart.' + (typeDescriptionMap[firstType] || '');
};

// Return object with text description of each of the chart's axes
H.Chart.prototype.getAxesDescription = function () {
	var numXAxes = this.xAxis.length,
		numYAxes = this.yAxis.length,
		desc = {},
		i;

	if (numXAxes) {
		desc.xAxis = 'The chart has ' + numXAxes + (numXAxes > 1 ? ' X axes' : ' X axis') + ' displaying ';
		if (numXAxes < 2) {
			desc.xAxis += this.xAxis[0].getDescription() + '.';
		} else {
			for (i = 0; i < numXAxes - 1; ++i) {
				desc.xAxis += (i ? ', ' : '') + this.xAxis[i].getDescription();
			}
			desc.xAxis += ' and ' + this.xAxis[i].getDescription() + '.';
		}
	}

	if (numYAxes) {
		desc.yAxis = 'The chart has ' + numYAxes + (numYAxes > 1 ? ' Y axes' : ' Y axis') + ' displaying ';
		if (numYAxes < 2) {
			desc.yAxis += this.yAxis[0].getDescription() + '.';
		} else {
			for (i = 0; i < numYAxes - 1; ++i) {
				desc.yAxis += (i ? ', ' : '') + this.yAxis[i].getDescription();
			}
			desc.yAxis += ' and ' + this.yAxis[i].getDescription() + '.';
		}
	}
	
	return desc;
};

// Set a11y attribs on exporting menu
H.Chart.prototype.addAccessibleContextMenuAttribs =	function () {
	var exportList = this.exportDivElements;
	if (exportList) {
		// Set tabindex on the menu items to allow focusing by script
		// Set role to give screen readers a chance to pick up the contents
		each(exportList, function (item) {
			if (item.tagName === 'DIV' &&
				!(item.children && item.children.length)) {
				item.setAttribute('role', 'menuitem');
				item.setAttribute('tabindex', -1);
			}
		});
		// Set accessibility properties on parent div
		exportList[0].parentNode.setAttribute('role', 'menu');
		exportList[0].parentNode.setAttribute('aria-label', 'Chart export');
	}
};

// Highlight a point (show tooltip and display hover state). Returns the highlighted point.
H.Point.prototype.highlight = function () {
	var chart = this.series.chart;
	if (this.graphic && this.graphic.element.focus) {
		this.graphic.element.focus();
	}
	if (!this.isNull) {
		this.onMouseOver(); // Show the hover marker
		// Show the tooltip
		if (chart.tooltip) {
			chart.tooltip.refresh(chart.tooltip.shared ? [this] : this);
		}
	} else {
		if (chart.tooltip) {
			chart.tooltip.hide(0);
		}
		// Don't call blur on the element, as it messes up the chart div's focus
	}
	chart.highlightedPoint = this;
	return this;
};

// Function to highlight next/previous point in chart
// Returns highlighted point on success, false on failure (no adjacent point to highlight in chosen direction)
H.Chart.prototype.highlightAdjacentPoint = function (next) {
	var series = this.series,
		curPoint = this.highlightedPoint,
		curPointIndex = curPoint && curPoint.index || 0,
		curPoints = curPoint && curPoint.series.points,
		newSeries,
		newPoint,
		// Handle connecting ends - where the points array has an extra last
		// point that is a reference to the first one. We skip this.
		forwardSkipAmount = curPoint && curPoint.series.connectEnds &&
							curPointIndex > curPoints.length - 3 ? 2 : 1;

	// If no points, return false
	if (!series[0] || !series[0].points) {
		return false;
	}

	// Use first point if none already highlighted
	if (!curPoint) {
		return series[0].points[0].highlight();
	}

	// Find index of current point in series.points array. Necessary for dataGrouping (and maybe zoom?)
	if (curPoints[curPointIndex] !== curPoint) {
		for (var i = 0; i < curPoints.length; ++i) {
			if (curPoints[i] === curPoint) {
				curPointIndex = i;
				break;
			}
		}
	}

	// Grab next/prev point & series
	newSeries = series[curPoint.series.index + (next ? 1 : -1)];
	newPoint = curPoints[curPointIndex + (next ? forwardSkipAmount : -1)] || 
				// Done with this series, try next one
				newSeries &&
				newSeries.points[next ? 0 : newSeries.points.length - (
					newSeries.connectEnds ? 2 : 1
				)];

	// If there is no adjacent point, we return false
	if (newPoint === undefined) {
		return false;
	}

	// Recursively skip null points or points in series that should be skipped
	if (
		newPoint.isNull && 
		this.options.accessibility.keyboardNavigation.skipNullPoints ||
		newPoint.series.options.skipKeyboardNavigation
	) {
		this.highlightedPoint = newPoint;
		return this.highlightAdjacentPoint(next);
	}

	// There is an adjacent point, highlight it
	return newPoint.highlight();			
};

// Show the export menu and focus the first item (if exists)
H.Chart.prototype.showExportMenu = function () {
	if (this.exportSVGElements && this.exportSVGElements[0]) {
		this.exportSVGElements[0].element.onclick();
		this.highlightExportItem(0);
	}
};

// Highlight export menu item by index
H.Chart.prototype.highlightExportItem = function (ix) {
	var listItem = this.exportDivElements && this.exportDivElements[ix],
		curHighlighted = this.exportDivElements && this.exportDivElements[this.highlightedExportItem];
		
	if (listItem && listItem.tagName === 'DIV' && !(listItem.children && listItem.children.length)) {			
		if (listItem.focus) {
			listItem.focus();
		}
		if (curHighlighted && curHighlighted.onmouseout) {
			curHighlighted.onmouseout();
		}
		if (listItem.onmouseover) {
			listItem.onmouseover();
		}
		this.highlightedExportItem = ix;
		return true;
	}
};

// Highlight range selector button by index
H.Chart.prototype.highlightRangeSelectorButton = function (ix) {
	var buttons = this.rangeSelector.buttons;
	// Deselect old
	if (buttons[this.highlightedRangeSelectorItemIx]) {
		buttons[this.highlightedRangeSelectorItemIx].setState(this.oldRangeSelectorItemState || 0);
	}
	// Select new
	this.highlightedRangeSelectorItemIx = ix;
	if (buttons[ix]) {
		if (buttons[ix].element.focus) {
			buttons[ix].element.focus();
		}
		this.oldRangeSelectorItemState = buttons[ix].state;
		buttons[ix].setState(2);
		return true;
	}
	return false;
};

// Highlight legend item by index
H.Chart.prototype.highlightLegendItem = function (ix) {
	var items = this.legend.allItems;
	if (items[this.highlightedLegendItemIx]) {
		fireEvent(items[this.highlightedLegendItemIx].legendGroup.element, 'mouseout');
	}
	this.highlightedLegendItemIx = ix;
	if (items[ix]) {
		if (items[ix].legendGroup.element.focus) {
			items[ix].legendGroup.element.focus();
		}
		fireEvent(items[ix].legendGroup.element, 'mouseover');
		return true;
	}
	return false;
};

// Hide export menu
H.Chart.prototype.hideExportMenu = function () {
	var exportList = this.exportDivElements;
	if (exportList) {
		each(exportList, function (el) {
			fireEvent(el, 'mouseleave');
		});
		if (exportList[this.highlightedExportItem] && exportList[this.highlightedExportItem].onmouseout) {
			exportList[this.highlightedExportItem].onmouseout();
		}	
		this.highlightedExportItem = 0;
		this.renderTo.focus();
	}
};

// Add keyboard navigation handling to chart
H.Chart.prototype.addKeyboardNavEvents = function () {
	var chart = this;

	// Abstraction layer for keyboard navigation. Keep a map of keyCodes to handler functions, and a next/prev move handler for tab order.
	// The module's keyCode handlers determine when to move to another module.
	// Validate holds a function to determine if there are prerequisites for this module to run that are not met.
	// Init holds a function to run once before any keyCodes are interpreted.
	// Terminate holds a function to run once before moving to next/prev module.
	// transformTabs determines whether to transform tabs to left/right events or not. Defaults to true.
	function KeyboardNavigationModule(options) {
		this.keyCodeMap = options.keyCodeMap;
		this.move = options.move;
		this.validate = options.validate;
		this.init = options.init;
		this.terminate = options.terminate;
		this.transformTabs = options.transformTabs !== false;
	}
	KeyboardNavigationModule.prototype = {
		// Find handler function(s) for key code in the keyCodeMap and run it.
		run: function (e) {
			var navModule = this,
				keyCode = e.which || e.keyCode,
				handled = false;
			keyCode = this.transformTabs && keyCode === 9 ? (e.shiftKey ? 37 : 39) : keyCode; // Transform tabs
			each(this.keyCodeMap, function (codeSet) {
				if (codeSet[0].indexOf(keyCode) > -1) {
					handled = codeSet[1].call(navModule, keyCode, e) === false ? false : true; // If explicitly returning false, we haven't handled it
				}
			});
			return handled;
		}
	};
	// Maintain abstraction between KeyboardNavigationModule and Highcharts
	// The chart object keeps track of a list of KeyboardNavigationModules that we move through
	function navModuleFactory(keyMap, options) {
		return new KeyboardNavigationModule(merge({
			keyCodeMap: keyMap,
			// Move to next/prev valid module, or undefined if none, and init it.
			// Returns true on success and false if there is no valid module to move to.
			move: function (direction) {
				if (this.terminate) {
					this.terminate(direction);
				}
				chart.keyboardNavigationModuleIndex += direction;
				var newModule = chart.keyboardNavigationModules[chart.keyboardNavigationModuleIndex];
				if (newModule) {
					if (newModule.validate && !newModule.validate()) {
						return this.move(direction); // Invalid module
					}
					if (newModule.init) {
						newModule.init(direction); // Valid module, init it
						return true;
					}
				}
				// No module
				chart.keyboardNavigationModuleIndex = 0; // Reset counter
				chart.slipNextTab = true; // Allow next tab to slip, as we will have focus on chart now
				return false;
			}
		}, options));
	}

	// Route keydown events
	function keydownHandler(ev) {
		var e = ev || win.event,
			keyCode = e.which || e.keyCode,
			curNavModule = chart.keyboardNavigationModules[chart.keyboardNavigationModuleIndex];

		// Handle tabbing
		if (keyCode === 9) {
			// If we reached end of chart, we need to let this tab slip through to allow users to tab further
			if (chart.slipNextTab) {
				chart.slipNextTab = false;
				return;
			}
		}
		// If key was not tab, don't slip the next tab
		chart.slipNextTab = false;

		// If there is a navigation module for the current index, run it. Otherwise, we are outside of the chart in some direction.
		if (curNavModule) {
			if (curNavModule.run(e)) {
				e.preventDefault(); // If successfully handled, stop the event here.
			}
		}
	}

	// List of the different keyboard handling modes we use depending on where we are in the chart.
	// Each mode has a set of handling functions mapped to key codes.
	// Each mode determines when to move to the next/prev mode.
	chart.keyboardNavigationModules = [
		// Points
		navModuleFactory([
			// Left/Right
			[[37, 39], function (keyCode) {
				if (!chart.highlightAdjacentPoint(keyCode === 39)) { // Try to highlight adjacent point
					return this.move(keyCode === 39 ? 1 : -1); // Failed. Move to next/prev module
				}
			}],
			// Up/Down
			[[38, 40], function (keyCode) {
				var newSeries;
				if (chart.highlightedPoint) {
					newSeries = chart.series[chart.highlightedPoint.series.index + (keyCode === 38 ? -1 : 1)]; // Find prev/next series
					if (newSeries && newSeries.points[0]) { // If series exists and has data, go for it
						newSeries.points[0].highlight();
					} else {
						return this.move(keyCode === 40 ? 1 : -1); // Otherwise, attempt to move to next/prev module
					}
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				if (chart.highlightedPoint) {
					chart.highlightedPoint.firePointEvent('click');
				}
			}]
		], {
			// If coming back to points from other module, highlight last point
			init: function (direction) {
				var lastSeries = chart.series && chart.series[chart.series.length - 1],
					lastPoint = lastSeries && lastSeries.points && lastSeries.points[lastSeries.points.length - 1];
				if (direction < 0 && lastPoint) {
					lastPoint.highlight();
				}
			},
			// If leaving points, don't show tooltip anymore
			terminate: function () {
				if (chart.tooltip) {
					chart.tooltip.hide(0);
				}
				delete chart.highlightedPoint;
			}
		}),

		// Exporting
		navModuleFactory([
			// Left/Up
			[[37, 38], function () {
				var i = chart.highlightedExportItem || 0,
					reachedEnd = true,
					series = chart.series,
					newSeries;
				// Try to highlight prev item in list. Highlighting e.g. separators will fail.
				while (i--) {
					if (chart.highlightExportItem(i)) {
						reachedEnd = false;
						break;
					}
				}
				if (reachedEnd) {
					chart.hideExportMenu();
					// Wrap to last point
					if (series && series.length) {
						newSeries = series[series.length - 1];
						if (newSeries.points.length) {
							newSeries.points[newSeries.points.length - 1].highlight();
						}
					}
					// Try to move to prev module (should be points, since we wrapped to last point)
					return this.move(-1);
				}
			}],
			// Right/Down
			[[39, 40], function () {
				var highlightedExportItem = chart.highlightedExportItem || 0,
					reachedEnd = true;
				// Try to highlight next item in list. Highlighting e.g. separators will fail.
				for (var i = highlightedExportItem + 1; i < chart.exportDivElements.length; ++i) {
					if (chart.highlightExportItem(i)) {
						reachedEnd = false;
						break;
					}
				}
				if (reachedEnd) {
					chart.hideExportMenu();
					return this.move(1); // Next module
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				fakeClickEvent(chart.exportDivElements[chart.highlightedExportItem]);
			}]
		], {
			// Only run exporting navigation if exporting support exists and is enabled on chart
			validate: function () {
				return chart.exportChart && !(chart.options.exporting && chart.options.exporting.enabled === false);
			},
			// Show export menu
			init: function (direction) {
				chart.highlightedPoint = null;
				chart.showExportMenu();
				// If coming back to export menu from other module, try to highlight last item in menu
				if (direction < 0 && chart.exportDivElements) {
					for (var i = chart.exportDivElements.length; i > -1; --i) {
						if (chart.highlightExportItem(i)) {
							break;
						}
					}
				}
			}
		}),

		// Map zoom
		navModuleFactory([
			// Up/down/left/right
			[[38, 40, 37, 39], function (keyCode) {
				chart[keyCode === 38 || keyCode === 40 ? 'yAxis' : 'xAxis'][0].panStep(keyCode < 39 ? -1 : 1);
			}],

			// Tabs
			[[9], function (keyCode, e) {
				var button;
				chart.mapNavButtons[chart.focusedMapNavButtonIx].setState(0); // Deselect old
				if (e.shiftKey && !chart.focusedMapNavButtonIx || !e.shiftKey && chart.focusedMapNavButtonIx) { // trying to go somewhere we can't?
					chart.mapZoom(); // Reset zoom
					return this.move(e.shiftKey ? -1 : 1); // Nowhere to go, go to prev/next module
				}
				chart.focusedMapNavButtonIx += e.shiftKey ? -1 : 1;
				button = chart.mapNavButtons[chart.focusedMapNavButtonIx];
				if (button.element.focus) {
					button.element.focus();
				}
				button.setState(2);
			}],

			// Enter/Spacebar
			[[13, 32], function () {
				fakeClickEvent(chart.mapNavButtons[chart.focusedMapNavButtonIx].element);
			}]
		], {
			// Only run this module if we have map zoom on the chart
			validate: function () {
				return chart.mapZoom && chart.mapNavButtons && chart.mapNavButtons.length === 2;
			},

			// Handle tabs separately
			transformTabs: false,

			// Make zoom buttons do their magic
			init: function (direction) {
				var zoomIn = chart.mapNavButtons[0],
					zoomOut = chart.mapNavButtons[1],
					initialButton = direction > 0 ? zoomIn : zoomOut;

				each(chart.mapNavButtons, function (button, i) {
					button.element.setAttribute('tabindex', -1);
					button.element.setAttribute('role', 'button');
					button.element.setAttribute('aria-label', 'Zoom ' + (i ? 'out' : '') + 'chart');
				});

				if (initialButton.element.focus) {						
					initialButton.element.focus();
				}
				initialButton.setState(2);
				chart.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
			}
		}),

		// Highstock range selector (minus input boxes)
		navModuleFactory([
			// Left/Right/Up/Down
			[[37, 39, 38, 40], function (keyCode) {
				var direction = (keyCode === 37 || keyCode === 38) ? -1 : 1;
				// Try to highlight next/prev button
				if (!chart.highlightRangeSelectorButton(chart.highlightedRangeSelectorItemIx + direction)) {
					return this.move(direction);
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				if (chart.oldRangeSelectorItemState !== 3) { // Don't allow click if button used to be disabled
					fakeClickEvent(chart.rangeSelector.buttons[chart.highlightedRangeSelectorItemIx].element);
				}
			}]
		], {
			// Only run this module if we have range selector
			validate: function () {
				return chart.rangeSelector && chart.rangeSelector.buttons && chart.rangeSelector.buttons.length;
			},

			// Make elements focusable and accessible
			init: function (direction) {
				each(chart.rangeSelector.buttons, function (button) {
					button.element.setAttribute('tabindex', '-1');
					button.element.setAttribute('role', 'button');
					button.element.setAttribute('aria-label', 'Select range ' + (button.text && button.text.textStr));
				});
				// Focus first/last button
				chart.highlightRangeSelectorButton(direction > 0 ? 0 : chart.rangeSelector.buttons.length - 1);
			}
		}),

		// Highstock range selector, input boxes
		navModuleFactory([
			// Tab/Up/Down
			[[9, 38, 40], function (keyCode, e) {
				var direction = (keyCode === 9 && e.shiftKey || keyCode === 38) ? -1 : 1,
					newIx = chart.highlightedInputRangeIx = chart.highlightedInputRangeIx + direction;
				// Try to highlight next/prev item in list.
				if (newIx > 1 || newIx < 0) { // Out of range
					return this.move(direction);
				}
				chart.rangeSelector[newIx ? 'maxInput' : 'minInput'].focus(); // Input boxes are HTML, and should have focus support in all browsers
			}]
		], {
			// Only run if we have range selector with input boxes
			validate: function () {
				var inputVisible = chart.rangeSelector && chart.rangeSelector.inputGroup && chart.rangeSelector.inputGroup.element.getAttribute('visibility') !== 'hidden';
				return inputVisible && chart.options.rangeSelector.inputEnabled !== false && chart.rangeSelector.minInput && chart.rangeSelector.maxInput;
			},

			// Handle tabs different from left/right (because we don't want to catch left/right in a text area)
			transformTabs: false,

			// Highlight first/last input box
			init: function (direction) {
				chart.highlightedInputRangeIx = direction > 0 ? 0 : 1;
				chart.rangeSelector[chart.highlightedInputRangeIx ? 'maxInput' : 'minInput'].focus();
			}
		}),

		// Legend navigation
		navModuleFactory([
			// Left/Right/Up/Down
			[[37, 39, 38, 40], function (keyCode) {
				var direction = (keyCode === 37 || keyCode === 38) ? -1 : 1;
				// Try to highlight next/prev legend item
				if (!chart.highlightLegendItem(chart.highlightedLegendItemIx + direction)) {
					return this.move(direction);
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				fakeClickEvent(chart.legend.allItems[chart.highlightedLegendItemIx].legendItem.element.parentNode);
			}]
		], {
			// Only run this module if we have at least one legend - wait for it - item.
			// Don't run if the legend is populated by a colorAxis.
			validate: function () {
				return chart.legend && chart.legend.allItems &&
					!(chart.colorAxis && chart.colorAxis.length);
			},

			// Make elements focusable and accessible
			init: function (direction) {
				each(chart.legend.allItems, function (item) {
					item.legendGroup.element.setAttribute('tabindex', '-1');
					item.legendGroup.element.setAttribute('role', 'button');
					item.legendGroup.element.setAttribute('aria-label', 'Toggle visibility of series ' + item.name);
				});
				// Focus first/last item
				chart.highlightLegendItem(direction > 0 ? 0 : chart.legend.allItems.length - 1);
			}
		})
	];

	// Init nav module index. We start at the first module, and as the user navigates through the chart the index will increase to use different handler modules.
	chart.keyboardNavigationModuleIndex = 0;

	// Make chart reachable by tab
	if (
		chart.container.hasAttribute &&
		!chart.container.hasAttribute('tabIndex')
	) {
		chart.container.setAttribute('tabindex', '0');
	}

	// Handle keyboard events
	addEvent(chart.renderTo, 'keydown', keydownHandler);
	addEvent(chart, 'destroy', function () {
		removeEvent(chart.renderTo, 'keydown', keydownHandler);
	});
};

// Add screen reader region to chart.
// tableId is the HTML id of the table to focus when clicking the table anchor in the screen reader region.
H.Chart.prototype.addScreenReaderRegion = function (id, tableId) {
	var	chart = this,
		series = chart.series,
		options = chart.options,
		a11yOptions = options.accessibility,
		hiddenSection = chart.screenReaderRegion = doc.createElement('div'),
		tableShortcut = doc.createElement('h4'),
		tableShortcutAnchor = doc.createElement('a'),
		chartHeading = doc.createElement('h4'),
		hiddenStyle = { // CSS style to hide element from visual users while still exposing it to screen readers
			position: 'absolute',
			left: '-9999px',
			top: 'auto',
			width: '1px',
			height: '1px',
			overflow: 'hidden'
		},
		chartTypes = chart.types || [],
		// Build axis info - but not for pies and maps. Consider not adding for certain other types as well (funnel, pyramid?)
		axesDesc = (chartTypes.length === 1 && chartTypes[0] === 'pie' || chartTypes[0] === 'map') && {} || chart.getAxesDescription(),
		chartTypeInfo = series[0] && typeToSeriesMap[series[0].type] || typeToSeriesMap['default']; // eslint-disable-line dot-notation

	hiddenSection.setAttribute('id', id);
	hiddenSection.setAttribute('role', 'region');
	hiddenSection.setAttribute('aria-label', 'Chart screen reader information.');

	hiddenSection.innerHTML = a11yOptions.screenReaderSectionFormatter && a11yOptions.screenReaderSectionFormatter(chart) ||
		'<div>Use regions/landmarks to skip ahead to chart' +
		(series.length > 1 ? ' and navigate between data series' : '') +
		'.</div><h3>' + (options.title.text ? htmlencode(options.title.text) : 'Chart') +
		(options.subtitle && options.subtitle.text ? '. ' + htmlencode(options.subtitle.text) : '') +
		'</h3><h4>Long description.</h4><div>' + (options.chart.description || 'No description available.') +
		'</div><h4>Structure.</h4><div>Chart type: ' + (options.chart.typeDescription || chart.getTypeDescription()) + '</div>' +
		(series.length === 1 ? '<div>' + chartTypeInfo[0] + ' with ' + series[0].points.length + ' ' +
			(series[0].points.length === 1 ? chartTypeInfo[1] : chartTypeInfo[2]) + '.</div>' : '') +
		(axesDesc.xAxis ? ('<div>' + axesDesc.xAxis + '</div>') : '') +
		(axesDesc.yAxis ? ('<div>' + axesDesc.yAxis + '</div>') : '');

	// Add shortcut to data table if export-data is loaded
	if (chart.getCSV) {
		tableShortcutAnchor.innerHTML = 'View as data table.';
		tableShortcutAnchor.href = '#' + tableId;
		tableShortcutAnchor.setAttribute('tabindex', '-1'); // Make this unreachable by user tabbing
		tableShortcutAnchor.onclick = a11yOptions.onTableAnchorClick || function () {
			chart.viewData();
			doc.getElementById(tableId).focus();
		};
		tableShortcut.appendChild(tableShortcutAnchor);
		hiddenSection.appendChild(tableShortcut);
	}
	
	// Note: JAWS seems to refuse to read aria-label on the container, so add an
	// h4 element as title for the chart.
	chartHeading.innerHTML = 'Chart graphic.';
	chart.renderTo.insertBefore(chartHeading, chart.renderTo.firstChild);
	chart.renderTo.insertBefore(hiddenSection, chart.renderTo.firstChild);

	// Hide the section and the chart heading
	merge(true, chartHeading.style, hiddenStyle);
	merge(true, hiddenSection.style, hiddenStyle);
};


// Make chart container accessible, and wrap table functionality
H.Chart.prototype.callbacks.push(function (chart) {
	var options = chart.options,
		a11yOptions = options.accessibility;

	if (!a11yOptions.enabled) {
		return;
	}

	var	titleElement = doc.createElementNS('http://www.w3.org/2000/svg', 'title'),
		exportGroupElement = doc.createElementNS('http://www.w3.org/2000/svg', 'g'),
		descElement = chart.container.getElementsByTagName('desc')[0],
		textElements = chart.container.getElementsByTagName('text'),
		titleId = 'highcharts-title-' + chart.index,
		tableId = 'highcharts-data-table-' + chart.index,
		hiddenSectionId = 'highcharts-information-region-' + chart.index,
		chartTitle = options.title.text || 'Chart',
		oldColumnHeaderFormatter = options.exporting && options.exporting.csv && options.exporting.csv.columnHeaderFormatter,
		topLevelColumns = [];

	// Add SVG title/desc tags
	titleElement.textContent = htmlencode(chartTitle);
	titleElement.id = titleId;
	descElement.parentNode.insertBefore(titleElement, descElement);
	chart.renderTo.setAttribute('role', 'region');
	//chart.container.setAttribute('aria-details', hiddenSectionId); // JAWS currently doesn't handle this too well
	chart.renderTo.setAttribute('aria-label', 'Interactive chart. ' + chartTitle +
		'. Use up and down arrows to navigate with most screen readers.');

	// Set screen reader properties on export menu
	if (chart.exportSVGElements && chart.exportSVGElements[0] && chart.exportSVGElements[0].element) {
		var oldExportCallback = chart.exportSVGElements[0].element.onclick,
			parent = chart.exportSVGElements[0].element.parentNode;
		chart.exportSVGElements[0].element.onclick = function () {
			oldExportCallback.apply(this, Array.prototype.slice.call(arguments));
			chart.addAccessibleContextMenuAttribs();
			chart.highlightExportItem(0);
		};
		chart.exportSVGElements[0].element.setAttribute('role', 'button');
		chart.exportSVGElements[0].element.setAttribute('aria-label', 'View export menu');
		exportGroupElement.appendChild(chart.exportSVGElements[0].element);
		exportGroupElement.setAttribute('role', 'region');
		exportGroupElement.setAttribute('aria-label', 'Chart export menu');
		parent.appendChild(exportGroupElement);
	}

	// Set screen reader properties on input boxes for range selector. We need to do this regardless of whether or not these are visible, as they are 
	// by default part of the page's tabindex unless we set them to -1.
	if (chart.rangeSelector) {
		each(['minInput', 'maxInput'], function (key, i) {
			if (chart.rangeSelector[key]) {
				chart.rangeSelector[key].setAttribute('tabindex', '-1');
				chart.rangeSelector[key].setAttribute('role', 'textbox');
				chart.rangeSelector[key].setAttribute('aria-label', 'Select ' + (i ? 'end' : 'start') + ' date.');
			}
		});
	}

	// Hide text elements from screen readers
	each(textElements, function (el) {
		el.setAttribute('aria-hidden', 'true');
	});

	// Add top-secret screen reader region
	chart.addScreenReaderRegion(hiddenSectionId, tableId);

	// Enable keyboard navigation
	if (a11yOptions.keyboardNavigation.enabled) {
		chart.addKeyboardNavEvents();
	}

	/* Wrap table functionality from export-data */

	// Keep track of columns
	merge(true, options.exporting, {
		csv: {
			columnHeaderFormatter: function (item, key, keyLength) {
				if (!item) {
					return 'Category';
				}
				if (item instanceof H.Axis) {
					return (item.options.title && item.options.title.text) ||
						(item.isDatetimeAxis ? 'DateTime' : 'Category');
				}
				var prevCol = topLevelColumns[topLevelColumns.length - 1];
				if (keyLength > 1) {
					// We need multiple levels of column headers
					// Populate a list of column headers to add in addition to the ones added by export-data
					if ((prevCol && prevCol.text) !== item.name) {
						topLevelColumns.push({
							text: item.name,
							span: keyLength
						});
					}
				}
				if (oldColumnHeaderFormatter) {
					return oldColumnHeaderFormatter.call(this, item, key, keyLength);
				}
				return keyLength > 1 ? key : item.name;
			}
		}
	});

	// Add ID and title/caption to table HTML
	H.wrap(chart, 'getTable', function (proceed) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
			.replace('<table>', '<table id="' + tableId + '" summary="Table representation of chart"><caption>' + chartTitle + '</caption>');
	});

	// Add accessibility attributes and top level columns
	H.wrap(chart, 'viewData', function (proceed) {
		if (!this.dataTableDiv) {
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));

			var table = doc.getElementById(tableId),
				head = table.getElementsByTagName('thead')[0],
				body = table.getElementsByTagName('tbody')[0],
				firstRow = head.firstChild.children,
				columnHeaderRow = '<tr><td></td>',
				cell,
				newCell;

			// Make table focusable by script
			table.setAttribute('tabindex', '-1');

			// Create row headers
			each(body.children, function (el) {
				cell = el.firstChild;
				newCell = doc.createElement('th');
				newCell.setAttribute('scope', 'row');
				newCell.innerHTML = cell.innerHTML;
				cell.parentNode.replaceChild(newCell, cell);
			});

			// Set scope for column headers
			each(firstRow, function (el) {
				if (el.tagName === 'TH') {
					el.setAttribute('scope', 'col');
				}
			});

			// Add top level columns
			if (topLevelColumns.length) {
				each(topLevelColumns, function (col) {
					columnHeaderRow += '<th scope="col" colspan="' + col.span + '">' + col.text + '</th>';
				});
				head.insertAdjacentHTML('afterbegin', columnHeaderRow);
			}
		}
	});
});
