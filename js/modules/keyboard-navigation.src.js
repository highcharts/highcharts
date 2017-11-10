/**
 * Accessibility module - Keyboard navigation
 *
 * (c) 2010-2017 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */
/* eslint max-len: ["warn", 80, 4] */
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
	addEvent = H.addEvent,
	fireEvent = H.fireEvent,
	merge = H.merge;

// Set for which series types it makes sense to move to the closest point with
// up/down arrows, and which series types should just move to next series.
H.Series.prototype.keyboardMoveVertical = true;
each(['column', 'pie'], function (type) {
	if (H.seriesTypes[type]) {
		H.seriesTypes[type].prototype.keyboardMoveVertical = false;
	}
});

/**
 * Strip HTML tags away from a string. Used for aria-label attributes, painting
 * on a canvas will fail if the text contains tags.
 * @param  {String} s The input string
 * @return {String}   The filtered string
 */
function stripTags(s) {
	return typeof s === 'string' ? s.replace(/<\/?[^>]+(>|$)/g, '') : s;
}


H.setOptions({
	accessibility: {

		/**
		 * Options for keyboard navigation.
		 * 
		 * @type {Object}
		 * @since 5.0.0
		 */
		keyboardNavigation: {

			/**
			 * Enable keyboard navigation for the chart.
			 * 
			 * @type {Boolean}
			 * @default true
			 * @since 5.0.0
			 */
			enabled: true

			/**
			 * Skip null points when navigating through points with the
			 * keyboard.
			 * 
			 * @type {Boolean}
			 * @default false
			 * @since 5.0.0
			 * @apioption accessibility.keyboardNavigation.skipNullPoints
			 */
		}
	}
});

/**
 * Keyboard navigation for the legend. Requires the Accessibility module.
 * @since 5.0.14
 * @apioption legend.keyboardNavigation
 */

/**
 * Enable/disable keyboard navigation for the legend. Requires the Accessibility
 * module.
 * 
 * @type {Boolean}
 * @see [accessibility.keyboardNavigation](#accessibility.keyboardNavigation.
 * enabled)
 * @default true
 * @since 5.0.13
 * @apioption legend.keyboardNavigation.enabled
 */


// Abstraction layer for keyboard navigation. Keep a map of keyCodes to
// handler functions, and a next/prev move handler for tab order. The
// module's keyCode handlers determine when to move to another module.
// Validate holds a function to determine if there are prerequisites for
// this module to run that are not met. Init holds a function to run once
// before any keyCodes are interpreted. Terminate holds a function to run
// once before moving to next/prev module.
// The chart object keeps track of a list of KeyboardNavigationModules.
function KeyboardNavigationModule(chart, options) {
	this.chart = chart;
	this.id = options.id;
	this.keyCodeMap = options.keyCodeMap;
	this.validate = options.validate;
	this.init = options.init;
	this.terminate = options.terminate;
}
KeyboardNavigationModule.prototype = {
	// Find handler function(s) for key code in the keyCodeMap and run it.
	run: function (e) {
		var navModule = this,
			keyCode = e.which || e.keyCode,
			found = false,
			handled = false;
		each(this.keyCodeMap, function (codeSet) {
			if (codeSet[0].indexOf(keyCode) > -1) {
				found = true;
				handled = codeSet[1].call(navModule, keyCode, e) === false ?
					// If explicitly returning false, we haven't handled it
					false :
					true; 
			}
		});
		// Default tab handler, move to next/prev module
		if (!found && keyCode === 9) {
			handled = this.move(e.shiftKey ? -1 : 1);
		}
		return handled;
	},

	// Move to next/prev valid module, or undefined if none, and init
	// it. Returns true on success and false if there is no valid module
	// to move to.
	move: function (direction) {
		if (this.terminate) {
			this.terminate(direction);
		}
		this.chart.keyboardNavigationModuleIndex += direction;
		var newModule = this.chart.keyboardNavigationModules[
			this.chart.keyboardNavigationModuleIndex
		];
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
		this.chart.keyboardNavigationModuleIndex = 0; // Reset counter

		// Set focus to chart or exit anchor depending on direction
		if (direction > 0) {
			this.chart.exiting = true;
			this.chart.tabExitAnchor.focus();
		} else {
			this.chart.renderTo.focus();
		}

		return false;
	}
};


// Utility function to attempt to fake a click event on an element
function fakeClickEvent(element) {
	var fakeEvent;
	if (element && element.onclick && doc.createEvent) {
		fakeEvent = doc.createEvent('Events');
		fakeEvent.initEvent('click', true, false);
		element.onclick(fakeEvent);
	}
}


// Determine if a point should be skipped
function isSkipPoint(point) {
	return point.isNull &&
		point.series.chart.options.accessibility
			.keyboardNavigation.skipNullPoints ||
		point.series.options.skipKeyboardNavigation ||
		!point.series.visible;
}


// Get the point in a series that is closest (in distance) to a reference point
// Optionally supply weight factors for x and y directions
function getClosestPoint(point, series, xWeight, yWeight) {
	var minDistance = Infinity,
		dPoint,
		minIx,
		distance,
		i = series.points.length;
	if (point.plotX === undefined || point.plotY === undefined) {
		return;
	}
	while (i--) {
		dPoint = series.points[i];
		if (dPoint.plotX === undefined || dPoint.plotY === undefined) {
			return;
		}
		distance = (point.plotX - dPoint.plotX) *
				(point.plotX - dPoint.plotX) * (xWeight || 1) +
				(point.plotY - dPoint.plotY) *
				(point.plotY - dPoint.plotY) * (yWeight || 1);
		if (distance < minDistance) {
			minDistance = distance;
			minIx = i;
		}
	}
	return series.points[minIx || 0];
}


// Pan along axis in a direction (1 or -1), optionally with a defined
// granularity (number of steps it takes to walk across current view)
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


// Highlight a point (show tooltip and display hover state). Returns the
// highlighted point.
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
// Returns highlighted point on success, false on failure (no adjacent point to
// highlight in chosen direction)
H.Chart.prototype.highlightAdjacentPoint = function (next) {
	var chart = this,
		series = chart.series,
		curPoint = chart.highlightedPoint,
		curPointIndex = curPoint && curPoint.index || 0,
		curPoints = curPoint && curPoint.series.points,
		lastSeries = chart.series && chart.series[chart.series.length - 1],
		lastPoint = lastSeries && lastSeries.points && 
					lastSeries.points[lastSeries.points.length - 1],
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

	if (!curPoint) {
		// No point is highlighted yet. Try first/last point depending on move
		// direction
		newPoint = next ? series[0].points[0] : lastPoint;
	} else {
		// We have a highlighted point.
		// Find index of current point in series.points array. Necessary for
		// dataGrouping (and maybe zoom?)
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
	}

	// Recursively skip null points or points in series that should be skipped
	if (isSkipPoint(newPoint)) {
		chart.highlightedPoint = newPoint;
		return chart.highlightAdjacentPoint(next);
	}

	// There is an adjacent point, highlight it
	return newPoint.highlight();
};


// Highlight first valid point in a series. Returns the point if successfully
// highlighted, otherwise false. If there is a highlighted point in the series,
// use that as starting point.
H.Series.prototype.highlightFirstValidPoint = function () {
	var curPoint = this.chart.highlightedPoint,
		start = curPoint.series === this ? curPoint.index : 0,
		points = this.points;

	for (var i = start, len = points.length; i < len; ++i) {
		if (!isSkipPoint(points[i])) {
			return points[i].highlight();
		}
	}
	for (var j = start; j >= 0; --j) {
		if (!isSkipPoint(points[j])) {
			return points[j].highlight();
		}
	}
	return false;
};


// Highlight next/previous series in chart. Returns false if no adjacent series
// in the direction, otherwise returns new highlighted point.
H.Chart.prototype.highlightAdjacentSeries = function (down) {
	var chart = this,
		newSeries,
		newPoint,
		adjacentNewPoint,
		curPoint = chart.highlightedPoint,
		lastSeries = chart.series && chart.series[chart.series.length - 1],
		lastPoint = lastSeries && lastSeries.points &&
					lastSeries.points[lastSeries.points.length - 1];

	// If no point is highlighted, highlight the first/last point
	if (!chart.highlightedPoint) {
		newSeries = down ? (chart.series && chart.series[0]) : lastSeries;
		newPoint = down ?
			(newSeries && newSeries.points && newSeries.points[0]) : lastPoint;
		return newPoint ? newPoint.highlight() : false;
	}

	newSeries = chart.series[curPoint.series.index + (down ? -1 : 1)];

	if (!newSeries) {
		return false;
	}

	// We have a new series in this direction, find the right point
	// Weigh xDistance as counting much higher than Y distance
	newPoint = getClosestPoint(curPoint, newSeries, 4);

	if (!newPoint) {
		return false;
	}

	// New series and point exists, but we might want to skip it
	if (!newSeries.visible) {
		// Skip the series
		newPoint.highlight();
		adjacentNewPoint = chart.highlightAdjacentSeries(down); // Try recurse
		if (!adjacentNewPoint) {
			// Recurse failed
			curPoint.highlight();
			return false;
		}
		// Recurse succeeded
		return adjacentNewPoint;
	}

	// Highlight the new point or any first valid point back or forwards from it
	newPoint.highlight();
	return newPoint.series.highlightFirstValidPoint();
};


// Highlight the closest point vertically
H.Chart.prototype.highlightAdjacentPointVertical = function (down) {
	var curPoint = this.highlightedPoint,
		minDistance = Infinity,
		bestPoint;

	if (curPoint.plotX === undefined || curPoint.plotY === undefined) {
		return false;
	}
	each(this.series, function (series) {
		each(series.points, function (point) {
			if (point.plotY === undefined || point.plotX === undefined || 
				point === curPoint) {
				return;
			}
			var yDistance = point.plotY - curPoint.plotY,
				width = Math.abs(point.plotX - curPoint.plotX),
				distance = Math.abs(yDistance) * Math.abs(yDistance) + 
					width * width * 4; // Weigh horizontal distance highly

			// Reverse distance number if axis is reversed
			if (series.yAxis.reversed) {
				yDistance *= -1;
			}

			if (
				yDistance < 0 && down || yDistance > 0 && !down || // Wrong dir
				distance < 5 || // Points in same spot => infinite loop
				isSkipPoint(point)
			) {
				return;
			}

			if (distance < minDistance) {
				minDistance = distance;
				bestPoint = point;
			}
		});
	});

	return bestPoint ? bestPoint.highlight() : false;
};


// Show the export menu and focus the first item (if exists)
H.Chart.prototype.showExportMenu = function () {
	if (this.exportSVGElements && this.exportSVGElements[0]) {
		this.exportSVGElements[0].element.onclick();
		this.highlightExportItem(0);
	}
};


// Hide export menu
H.Chart.prototype.hideExportMenu = function () {
	var exportList = this.exportDivElements;
	if (exportList) {
		each(exportList, function (el) {
			fireEvent(el, 'mouseleave');
		});
		if (
			exportList[this.highlightedExportItem] &&
			exportList[this.highlightedExportItem].onmouseout
		) {
			exportList[this.highlightedExportItem].onmouseout();
		}	
		this.highlightedExportItem = 0;
		this.renderTo.focus();
	}
};


// Highlight export menu item by index
H.Chart.prototype.highlightExportItem = function (ix) {
	var listItem = this.exportDivElements && this.exportDivElements[ix],
		curHighlighted = 
			this.exportDivElements &&
			this.exportDivElements[this.highlightedExportItem];
		
	if (
		listItem &&
		listItem.tagName === 'DIV' &&
		!(listItem.children && listItem.children.length)
	) {
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
		buttons[this.highlightedRangeSelectorItemIx].setState(
			this.oldRangeSelectorItemState || 0
		);
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
		fireEvent(
			items[this.highlightedLegendItemIx].legendGroup.element,
			'mouseout'
		);
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


// Add keyboard navigation handling modules to chart
H.Chart.prototype.addKeyboardNavigationModules = function () {
	var chart = this;	

	function navModuleFactory(id, keyMap, options) {
		return new KeyboardNavigationModule(chart, merge({
			keyCodeMap: keyMap
		}, { id: id }, options));
	}

	// List of the different keyboard handling modes we use depending on where
	// we are in the chart. Each mode has a set of handling functions mapped to
	// key codes. Each mode determines when to move to the next/prev mode.
	chart.keyboardNavigationModules = [
		// Entry point catching the first tab, allowing users to tab into points
		// more intuitively.
		navModuleFactory('entry', []),

		// Points
		// Prevents default and ignores failure regardless
		navModuleFactory('points', [
			// Left/Right
			[[37, 39], function (keyCode) {
				chart.highlightAdjacentPoint(keyCode === 39);
				return true;
			}],
			// Up/Down
			[[38, 40], function (keyCode) {
				var highlightMethod = chart.highlightedPoint &&
						chart.highlightedPoint.series.keyboardMoveVertical ?
						'highlightAdjacentPointVertical' :
						'highlightAdjacentSeries';
				chart[highlightMethod](keyCode !== 38);
				return true;
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				if (chart.highlightedPoint) {
					chart.highlightedPoint.firePointEvent('click');
				}
			}]
		], {
			// Always start highlighting from scratch when entering this module
			init: function () {
				delete chart.highlightedPoint;
				// Find first valid point to highlight
				for (var i = 0; i < chart.series.length; ++i) {
					for (var j = 0, len = chart.series[i].points && 
							chart.series[i].points.length; j < len; ++j) {
						if (!isSkipPoint(chart.series[i].points[j])) {
							return chart.series[i].points[j].highlight();
						}
					}
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
		navModuleFactory('exporting', [
			// Left/Up
			[[37, 38], function () {
				var i = chart.highlightedExportItem || 0,
					reachedEnd = true;
				// Try to highlight prev item in list. Highlighting e.g.
				// separators will fail.
				while (i--) {
					if (chart.highlightExportItem(i)) {
						reachedEnd = false;
						break;
					}
				}
				if (reachedEnd) {
					chart.hideExportMenu();
					return this.move(-1);
				}
			}],
			// Right/Down
			[[39, 40], function () {
				var highlightedExportItem = chart.highlightedExportItem || 0,
					reachedEnd = true;
				// Try to highlight next item in list. Highlighting e.g.
				// separators will fail.
				for (
					var i = highlightedExportItem + 1;
					i < chart.exportDivElements.length;
					++i
				) {
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
				fakeClickEvent(
					chart.exportDivElements[chart.highlightedExportItem]
				);
			}]
		], {
			// Only run exporting navigation if exporting support exists and is
			// enabled on chart
			validate: function () {
				return (
					chart.exportChart &&
					!(
						chart.options.exporting &&
						chart.options.exporting.enabled === false
					)
				);
			},
			// Show export menu
			init: function (direction) {
				chart.highlightedPoint = null;
				chart.showExportMenu();
				// If coming back to export menu from other module, try to
				// highlight last item in menu
				if (direction < 0 && chart.exportDivElements) {
					for (var i = chart.exportDivElements.length; i > -1; --i) {
						if (chart.highlightExportItem(i)) {
							break;
						}
					}
				}
			},
			// Hide the menu
			terminate: function () {
				chart.hideExportMenu();
			}
		}),

		// Map zoom
		navModuleFactory('mapZoom', [
			// Up/down/left/right
			[[38, 40, 37, 39], function (keyCode) {
				chart[keyCode === 38 || keyCode === 40 ? 'yAxis' : 'xAxis'][0]
					.panStep(keyCode < 39 ? -1 : 1);
			}],

			// Tabs
			[[9], function (keyCode, e) {
				var button;
				// Deselect old
				chart.mapNavButtons[chart.focusedMapNavButtonIx].setState(0);
				if (
					e.shiftKey && !chart.focusedMapNavButtonIx ||
					!e.shiftKey && chart.focusedMapNavButtonIx
				) { // trying to go somewhere we can't?
					chart.mapZoom(); // Reset zoom
					// Nowhere to go, go to prev/next module
					return this.move(e.shiftKey ? -1 : 1); 
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
				fakeClickEvent(
					chart.mapNavButtons[chart.focusedMapNavButtonIx].element
				);
			}]
		], {
			// Only run this module if we have map zoom on the chart
			validate: function () {
				return (
					chart.mapZoom &&
					chart.mapNavButtons &&
					chart.mapNavButtons.length === 2
				);
			},

			// Make zoom buttons do their magic
			init: function (direction) {
				var zoomIn = chart.mapNavButtons[0],
					zoomOut = chart.mapNavButtons[1],
					initialButton = direction > 0 ? zoomIn : zoomOut;

				each(chart.mapNavButtons, function (button, i) {
					button.element.setAttribute('tabindex', -1);
					button.element.setAttribute('role', 'button');
					button.element.setAttribute(
						'aria-label',
						'Zoom ' + (i ? 'out ' : '') + 'chart'
					);
				});

				if (initialButton.element.focus) {
					initialButton.element.focus();
				}
				initialButton.setState(2);
				chart.focusedMapNavButtonIx = direction > 0 ? 0 : 1;
			}
		}),

		// Highstock range selector (minus input boxes)
		navModuleFactory('rangeSelector', [
			// Left/Right/Up/Down
			[[37, 39, 38, 40], function (keyCode) {
				var direction = (keyCode === 37 || keyCode === 38) ? -1 : 1;
				// Try to highlight next/prev button
				if (
					!chart.highlightRangeSelectorButton(
						chart.highlightedRangeSelectorItemIx + direction
					)
				) {
					return this.move(direction);
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				// Don't allow click if button used to be disabled
				if (chart.oldRangeSelectorItemState !== 3) {
					fakeClickEvent(
						chart.rangeSelector.buttons[
							chart.highlightedRangeSelectorItemIx
						].element
					);
				}
			}]
		], {
			// Only run this module if we have range selector
			validate: function () {
				return (
					chart.rangeSelector &&
					chart.rangeSelector.buttons &&
					chart.rangeSelector.buttons.length
				);
			},

			// Make elements focusable and accessible
			init: function (direction) {
				each(chart.rangeSelector.buttons, function (button) {
					button.element.setAttribute('tabindex', '-1');
					button.element.setAttribute('role', 'button');
					button.element.setAttribute(
						'aria-label',
						'Select range ' + (button.text && button.text.textStr)
					);
				});
				// Focus first/last button
				chart.highlightRangeSelectorButton(
					direction > 0 ? 0 : chart.rangeSelector.buttons.length - 1
				);
			}
		}),

		// Highstock range selector, input boxes
		navModuleFactory('rangeSelectorInput', [
			// Tab/Up/Down
			[[9, 38, 40], function (keyCode, e) {
				var direction =
					(keyCode === 9 && e.shiftKey || keyCode === 38) ? -1 : 1,
					
					newIx = chart.highlightedInputRangeIx =
						chart.highlightedInputRangeIx + direction;
				
				// Try to highlight next/prev item in list.
				if (newIx > 1 || newIx < 0) { // Out of range
					return this.move(direction);
				}
				chart.rangeSelector[newIx ? 'maxInput' : 'minInput'].focus();
			}]
		], {
			// Only run if we have range selector with input boxes
			validate: function () {
				var inputVisible = (
					chart.rangeSelector &&
					chart.rangeSelector.inputGroup &&
					chart.rangeSelector.inputGroup.element
						.getAttribute('visibility') !== 'hidden'
				);
				return (
					inputVisible &&
					chart.options.rangeSelector.inputEnabled !== false &&
					chart.rangeSelector.minInput &&
					chart.rangeSelector.maxInput
				);
			},

			// Highlight first/last input box
			init: function (direction) {
				chart.highlightedInputRangeIx = direction > 0 ? 0 : 1;
				chart.rangeSelector[
					chart.highlightedInputRangeIx ? 'maxInput' : 'minInput'
				].focus();
			}
		}),

		// Legend navigation
		navModuleFactory('legend', [
			// Left/Right/Up/Down
			[[37, 39, 38, 40], function (keyCode) {
				var direction = (keyCode === 37 || keyCode === 38) ? -1 : 1;
				// Try to highlight next/prev legend item
				if (
					!chart.highlightLegendItem(
						chart.highlightedLegendItemIx + direction
					)
				) {
					return this.move(direction);
				}
			}],
			// Enter/Spacebar
			[[13, 32], function () {
				fakeClickEvent(
					chart.legend.allItems[
						chart.highlightedLegendItemIx
					].legendItem.element.parentNode
				);
			}]
		], {
			// Only run this module if we have at least one legend - wait for
			// it - item. Don't run if the legend is populated by a colorAxis.
			// Don't run if legend navigation is disabled.
			validate: function () {
				return chart.legend && chart.legend.allItems &&
					chart.legend.display &&
					!(chart.colorAxis && chart.colorAxis.length) &&
					(chart.options.legend &&
					chart.options.legend.keyboardNavigation && 
					chart.options.legend.keyboardNavigation.enabled) !== false;
			},

			// Make elements focusable and accessible
			init: function (direction) {
				each(chart.legend.allItems, function (item) {
					item.legendGroup.element.setAttribute('tabindex', '-1');
					item.legendGroup.element.setAttribute('role', 'button');
					item.legendGroup.element.setAttribute(
						'aria-label',
						stripTags('Toggle visibility of series ' + item.name)
					);
				});
				// Focus first/last item
				chart.highlightLegendItem(
					direction > 0 ? 0 : chart.legend.allItems.length - 1
				);
			}
		})
	];
};


// Add exit anchor to the chart
// We use this to move focus out of chart whenever we want, by setting focus
// to this div and not preventing the default tab action.
// We also use this when users come back into the chart by tabbing back, in
// order to navigate from the end of the chart.
// Function returns the unbind function for the exit anchor's event handler.
H.Chart.prototype.addExitAnchor = function () {
	var chart = this;
	chart.tabExitAnchor = doc.createElement('div');
	chart.tabExitAnchor.setAttribute('tabindex', '0');

	// Hide exit anchor
	merge(true, chart.tabExitAnchor.style, {
		position: 'absolute',
		left: '-9999px',
		top: 'auto',
		width: '1px',
		height: '1px',
		overflow: 'hidden'
	});

	chart.renderTo.appendChild(chart.tabExitAnchor);
	return addEvent(chart.tabExitAnchor, 'focus', 
		function (ev) {		
			var e = ev || win.event,
				curModule;
			
			// If focusing and we are exiting, do nothing once.
			if (!chart.exiting) {

				// Not exiting, means we are coming in backwards
				chart.renderTo.focus();
				e.preventDefault();

				// Move to last valid keyboard nav module
				// Note the we don't run it, just set the index
				chart.keyboardNavigationModuleIndex =
					chart.keyboardNavigationModules.length - 1;
				curModule = chart.keyboardNavigationModules[
					chart.keyboardNavigationModuleIndex
				];

				// Validate the module
				if (curModule.validate && !curModule.validate()) {
					// Invalid.
					// Move inits next valid module in direction
					curModule.move(-1);
				} else {
					// We have a valid module, init it
					curModule.init(-1);
				}

			} else {
				// Don't skip the next focus, we only skip once.
				chart.exiting = false;
			}
		}
	);
};


// Add keyboard navigation events on chart load
H.Chart.prototype.callbacks.push(function (chart) {
	var a11yOptions = chart.options.accessibility;
	if (a11yOptions.enabled && a11yOptions.keyboardNavigation.enabled) {
		
		// Init nav modules. We start at the first module, and as the user
		// navigates through the chart the index will increase to use different
		// handler modules.
		chart.addKeyboardNavigationModules();
		chart.keyboardNavigationModuleIndex = 0;

		// Make chart container reachable by tab
		if (
			chart.container.hasAttribute &&
			!chart.container.hasAttribute('tabIndex')
		) {
			chart.container.setAttribute('tabindex', '0');
		}

		// Add tab exit anchor
		if (!chart.tabExitAnchor) {
			chart.unbindExitAnchorFocus = chart.addExitAnchor();
		}

		// Handle keyboard events by routing them to active keyboard nav module
		chart.unbindKeydownHandler = addEvent(chart.renderTo, 'keydown',
			function (ev) {
				var e = ev || win.event,
					curNavModule = chart.keyboardNavigationModules[
						chart.keyboardNavigationModuleIndex
					];
				// If there is a nav module for the current index, run it.
				// Otherwise, we are outside of the chart in some direction.
				if (curNavModule) {
					if (curNavModule.run(e)) {
						// Successfully handled this key event, stop default
						e.preventDefault();
					}
				}
			});

		// Add cleanup handlers
		addEvent(chart, 'destroy', function () {
			if (chart.unbindExitAnchorFocus && chart.tabExitAnchor) {
				chart.unbindExitAnchorFocus();
			}
			if (chart.unbindKeydownHandler && chart.renderTo) {
				chart.unbindKeydownHandler();
			}
		});		
	}
});
