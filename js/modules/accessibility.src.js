/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 * Accessibility module
 *
 * (c) 2010-2016 Highsoft AS
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
		fireEvent = H.fireEvent,
		dateFormat = H.dateFormat,
		merge = H.merge,
		// Human readable description of series and each point in singular and plural
		typeToSeriesMap = {
			'default': ['series', 'data point', 'data point'],
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
			'waterfall': ['waterfall series', 'column', 'columns']
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
		},
		commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'],
		specialKeys = ['z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close']; // Tell user about all properties if points have one of these defined

	// Default a11y options
	H.setOptions({
		accessibility: { // docs
			enabled: true,
			pointDescriptionThreshold: 30,
			keyboardNavigation: {
				enabled: true
			//	skipNullPoints: false
			}
		}
	});

	// Utility function. Reverses child nodes of a DOM element
	function reverseChildNodes(node) {
		var i = node.childNodes.length;
		while (i--) {
			node.appendChild(node.childNodes[i]);
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
			firstPointEl = this.points && this.points[0].graphic && this.points[0].graphic.element,
			seriesEl = firstPointEl && firstPointEl.parentNode; // Could be tracker series depending on series type
		if (seriesEl) {
			if (this.chart.series.length > 1) {
				seriesEl.setAttribute('role', 'region');
				seriesEl.setAttribute('tabindex', '-1');
				seriesEl.setAttribute('aria-label', a11yOptions.seriesDescriptionFormatter && a11yOptions.seriesDescriptionFormatter(this) || // docs
					this.buildSeriesInfoString());
			}
			// For some series types the order of elements do not match the order of points in series
			// In that case we have to reverse them in order for AT to read them out in an understandable order
			if (seriesEl.lastChild === firstPointEl) {
				reverseChildNodes(seriesEl);
			}
		}
		if (this.points && (this.points.length < a11yOptions.pointDescriptionThreshold)) {
			each(this.points, function (point) {
				// Set aria label on point
				if (point.graphic) {
					point.graphic.element.setAttribute('role', 'img');
					point.graphic.element.setAttribute('tabindex', '-1');
					point.graphic.element.setAttribute('aria-label', a11yOptions.pointDescriptionFormatter && a11yOptions.pointDescriptionFormatter(point) || // docs
						point.buildPointInfoString());
				}
			});
		}
	};

	// Return string with information about series
	H.Series.prototype.buildSeriesInfoString = function () {
		var typeInfo = typeToSeriesMap[this.type] || typeToSeriesMap.default;
		return (this.name ? this.name + ', ' : '') +
			(this.chart.types.length === 1 ? typeInfo[0] : 'series') + ' ' + (this.index + 1) + ' of ' + (this.chart.series.length) +
			(this.chart.types.length === 1 ? ' with ' : '. ' + typeInfo[0] + ' with ') +
			(this.points.length + ' ' + (this.points.length === 1 ? typeInfo[1] : typeInfo[2]) + '.') +
			(this.description || '') +	// docs
			(this.chart.yAxis.length > 1 && this.yAxis ? 'Y axis, ' + this.yAxis.getLabel() : '') +
			(this.chart.xAxis.length > 1 && this.xAxis ? 'X axis, ' + this.xAxis.getLabel() : '');
	};

	// Return string with information about point
	H.Point.prototype.buildPointInfoString = function () {
		var point = this,
			a11yOptions = this.series.chart.options.accessibility,
			infoString = '',
			hasSpecialKey = false,
			dateTimePoint = point.series.xAxis.isDatetimeAxis,
			timeDesc = dateTimePoint && dateFormat(a11yOptions.pointDateFormatter && a11yOptions.pointDateFormatter(point) || a11yOptions.pointDateFormat || // docs
				H.Tooltip.prototype.getXDateFormat(point, point.series.chart.options.tooltip, point.series.xAxis), point.x);

		each(specialKeys, function (key) {
			if (point[key] !== undefined) {
				hasSpecialKey = true;
			}
		});

		// If the point has one of the less common properties defined, display all that are defined
		if (hasSpecialKey) {
			if (dateTimePoint) {
				infoString = timeDesc;
			}
			each(commonKeys.concat(specialKeys), function (key) {				
				if (point[key] !== undefined && !(dateTimePoint && key === 'x')) {
					infoString += (infoString ? '. ' : '') + key + ', ' + this[key];
				}
			});
		} else {
			// Pick and choose properties for a succint label
			infoString = (this.name || timeDesc || this.category || this.id || 'x, ' + this.x) + ', ' +
				(this.value !== undefined ? this.value : this.y);
		}

		return (this.index + 1) + '. ' + infoString + '.' + (this.description ? this.description + '. ' : ''); // docs
	};

	// Get descriptive label for axis
	H.Axis.prototype.getDescription = function () {
		return this.userOptions && this.userOptions.description || this.axisTitle && this.axisTitle.textStr ||
				this.options.id || this.categories && 'categories' || 'values';
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
		var firstType = this.types && this.types[0];
		if (!firstType) {
			return 'Empty chart.';
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
			chart.tooltip.refresh(this); // Show the tooltip
		} else {
			chart.tooltip.hide(0);
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
			newSeries,
			newPoint;

		// If no points, return false
		if (!series[0] || !series[0].points) {
			return false;
		}

		// Use first point if none already highlighted
		if (!curPoint) {
			return series[0].points[0].highlight();
		}

		newSeries = series[curPoint.series.index + (next ? 1 : -1)];
		newPoint = next ?
			// Try to grab next point
			curPoint.series.points[curPoint.index + 1] || newSeries && newSeries.points[0] :
			// Try to grab previous point
			curPoint.series.points[curPoint.index - 1] ||
				newSeries && newSeries.points[newSeries.points.length - 1];

		// If there is no adjacent point, we return false
		if (newPoint === undefined) {
			return false;
		}

		// Recursively skip null points
		if (newPoint.isNull && this.options.accessibility.keyboardNavigation &&
				this.options.accessibility.keyboardNavigation.skipNullPoints) {
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
		var chart = this,
			series = chart.series;
		
		// Make chart reachable by tab
		chart.renderTo.setAttribute('tabindex', '0');

		// Handle keyboard events
		addEvent(chart.renderTo, 'keydown', function (ev) {
			var e = ev || win.event,
				keyCode = e.which || e.keyCode,
				highlightedExportItem = chart.highlightedExportItem,
				newSeries,
				doExporting = chart.options.exporting && chart.options.exporting.enabled !== false,
				reachedEnd,
				fakeEvent,
				i;

			// Handle tabbing
			if (keyCode === 9) {
				// If we reached end of chart, we need to let this tab slip through to allow users to tab further
				if (chart.slipNextTab && !e.shiftKey) {
					chart.slipNextTab = false;
					return;
				}
				// Interpret tab as left/right
				keyCode = e.shiftKey ? 37 : 39;
			}
			// If key was not tab, or shift+tab instead, don't slip the next tab
			chart.slipNextTab = false;

			if (!chart.isExporting) {
				// Navigating through points
				switch (keyCode) {
				case 37: // Left
				case 39: // Right
					if (!chart.highlightAdjacentPoint(keyCode === 39)) { // Try to highlight adjacent point
						if (keyCode === 39 && doExporting) {
							// Start export menu navigation
							chart.highlightedPoint = null;
							chart.isExporting = true;
							chart.showExportMenu();
						} else {
							// Try to return as if user tabbed or shift+tabbed
							try {
								e.which = e.keyCode = 9; // Some browsers won't allow mutation of event object, but try anyway
							} catch (ignore) {}
							return;
						}
					}
					break;

				case 38: // Up
				case 40: // Down
					if (chart.highlightedPoint) {
						newSeries = series[chart.highlightedPoint.series.index + (keyCode === 38 ? -1 : 1)];
						if (newSeries && newSeries.points[0]) {
							newSeries.points[0].highlight();
						} else if (keyCode === 40 && doExporting) {
							// Start export menu navigation
							chart.highlightedPoint = null;
							chart.isExporting = true;
							chart.showExportMenu();
						}
					}
					break;

				case 13: // Enter
				case 32: // Spacebar
					if (chart.highlightedPoint) {
						chart.highlightedPoint.firePointEvent('click');
					}
					break;

				default: return;
				}
			} else {
				// Keyboard nav for exporting menu
				switch (keyCode) {
				case 37: // Left
				case 38: // Up
					i = highlightedExportItem = highlightedExportItem || 0;
					reachedEnd = true;
					while (i--) {
						if (chart.highlightExportItem(i)) {
							reachedEnd = false;
							break;
						}
					}
					if (reachedEnd) {
						chart.hideExportMenu();
						chart.isExporting = false;
						// Wrap to last point
						if (series && series.length) {
							newSeries = series[series.length - 1];
							if (newSeries.points.length) {
								newSeries.points[newSeries.points.length - 1].highlight();
							}
						}
					}
					break;

				case 39: // Right
				case 40: // Down
					highlightedExportItem = highlightedExportItem || 0;
					reachedEnd = true;
					for (i = highlightedExportItem + 1; i < chart.exportDivElements.length; ++i) {
						if (chart.highlightExportItem(i)) {
							reachedEnd = false;
							break;
						}
					}
					if (reachedEnd) {
						chart.hideExportMenu();
						chart.isExporting = false;
						// Try to return as if user tabbed
						// Some browsers won't allow mutation of event object, but try anyway
						e.which = e.keyCode = 9;
						e.shiftKey = false;
						chart.slipNextTab = true; // Allow next tab to slip through without processing
						return;
					}
					break;

				case 13: // Enter
				case 32: // Spacebar
					if (highlightedExportItem !== undefined) {
						fakeEvent = doc.createEvent('Events');
						fakeEvent.initEvent('click', true, false);
						chart.exportDivElements[highlightedExportItem].onclick(fakeEvent);
					}
					break;

				default: return;
				}
			}
			e.preventDefault();
		});		
	};

	// Add screen reader region to chart.
	// tableId is the HTML id of the table to focus when clicking the table anchor in the screen reader region.
	H.Chart.prototype.addScreenReaderRegion = function (tableId) {
		var	chart = this,
			series = chart.series,
			options = chart.options,
			a11yOptions = options.accessibility,
			hiddenSection = doc.createElement('div'),
			tableShortcut = doc.createElement('h3'),
			tableShortcutAnchor = doc.createElement('a'),
			chartHeading = doc.createElement('h3'),
			hiddenStyle = { // CSS style to hide element from visual users while still exposing it to screen readers
				position: 'absolute',
				left: '-9999px',
				top: 'auto',
				width: '1px',
				height: '1px',
				overflow: 'hidden'
			},
			// Build axis info - but not for pies. Consider not adding for certain other types as well (funnel, pyramid?)
			axesDesc = chart.types.length === 1 && chart.types[0] === 'pie' && {} || chart.getAxesDescription(),
			chartTypeInfo = series[0] && typeToSeriesMap[series[0].type] || typeToSeriesMap.default;

		hiddenSection.setAttribute('role', 'region');
		hiddenSection.setAttribute('aria-label', 'Chart screen reader information.');

		hiddenSection.innerHTML = a11yOptions.screenReaderSectionFormatter && a11yOptions.screenReaderSectionFormatter(chart) || // docs
			'<div tabindex="0">Use regions/landmarks to skip ahead to chart' +
			(series.length > 1 ? ' and navigate between data series' : '') + '.</div><h3>Summary.</h3><div>' + (options.title.text || 'Chart') +
			(options.subtitle && options.subtitle.text ? '. ' + options.subtitle.text : '') +
			'</div><h3>Long description.</h3><div>' + (options.chart.description || 'No description available.') + // docs
			'</div><h3>Structure.</h3><div>Chart type: ' + (options.chart.typeDescription || chart.getTypeDescription()) + '</div>' +
			(series.length === 1 ? '<div>' + chartTypeInfo[0] + ' with ' + series[0].points.length + ' ' +
				(series[0].points.length === 1 ? chartTypeInfo[1] : chartTypeInfo[2]) + '.</div>' : '') +
			(axesDesc.xAxis ? ('<div>' + axesDesc.xAxis + '</div>') : '') +
			(axesDesc.yAxis ? ('<div>' + axesDesc.yAxis + '</div>') : '');

		// Add shortcut to data table if export-csv is loaded
		if (chart.getCSV) {
			tableShortcutAnchor.innerHTML = 'View as data table.';
			tableShortcutAnchor.href = '#' + tableId;
			tableShortcutAnchor.setAttribute('tabindex', '-1'); // Make this unreachable by user tabbing
			tableShortcutAnchor.onclick = a11yOptions.onTableAnchorClick || function () { // docs
				chart.viewData();
				doc.getElementById(tableId).focus();
			};
			tableShortcut.appendChild(tableShortcutAnchor);

			hiddenSection.appendChild(tableShortcut);
		}
		
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
			chartTitle = options.title.text || 'Chart',
			oldColumnHeaderFormatter = options.exporting && options.exporting.csv && options.exporting.csv.columnHeaderFormatter,
			topLevelColumns = [];

		// Add SVG title/desc tags
		titleElement.textContent = chartTitle;
		titleElement.id = titleId;
		descElement.parentNode.insertBefore(titleElement, descElement);
		chart.renderTo.setAttribute('role', 'region');
		chart.renderTo.setAttribute('aria-label', chartTitle + '. Use up and down arrows to navigate.');

		// Set screen reader properties on export menu
		if (chart.exportSVGElements && chart.exportSVGElements[0] && chart.exportSVGElements[0].element) {
			var oldExportCallback = chart.exportSVGElements[0].element.onclick,
				parent = chart.exportSVGElements[0].element.parentNode;
			chart.exportSVGElements[0].element.onclick = function () {
				oldExportCallback.apply(this, Array.prototype.slice.call(arguments));
				chart.addAccessibleContextMenuAttribs();
				chart.highlightExportItem(0);
				chart.isExporting = true;
			};
			chart.exportSVGElements[0].element.setAttribute('role', 'button');
			chart.exportSVGElements[0].element.setAttribute('aria-label', 'View export menu');
			exportGroupElement.appendChild(chart.exportSVGElements[0].element);
			exportGroupElement.setAttribute('role', 'region');
			exportGroupElement.setAttribute('aria-label', 'Chart export menu');
			parent.appendChild(exportGroupElement);
		}

		// Hide text elements from screen readers
		each(textElements, function (el) {
			el.setAttribute('aria-hidden', 'true');
		});

		// Add top-secret screen reader region
		chart.addScreenReaderRegion(tableId);

		// Enable keyboard navigation
		if (a11yOptions.keyboardNavigation) {
			chart.addKeyboardNavEvents();
		}

		/* Wrap table functionality from export-csv */

		// Keep track of columns
		merge(true, options.exporting, {
			csv: {
				columnHeaderFormatter: function (series, key, keyLength) {
					var prevCol = topLevelColumns[topLevelColumns.length - 1];
					if (keyLength > 1) {
						// We need multiple levels of column headers
						// Populate a list of column headers to add in addition to the ones added by export-csv
						if ((prevCol && prevCol.text) !== series.name) {
							topLevelColumns.push({
								text: series.name,
								span: keyLength
							});
						}
					}
					if (oldColumnHeaderFormatter) {
						return oldColumnHeaderFormatter.call(this, series, key, keyLength);
					}
					return keyLength > 1 ? key : series.name;
				}
			}
		});

		// Add ID and title/caption to table HTML
		H.wrap(H.Chart.prototype, 'getTable', function (proceed) {
			return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
				.replace('<table>', '<table id="' + tableId + '" summary="Table representation of chart"><caption>' + chartTitle + '</caption>');
		});

		// Add accessibility attributes and top level columns
		H.wrap(H.Chart.prototype, 'viewData', function (proceed) {
			if (!this.insertedTable) {
				proceed.apply(this, Array.prototype.slice.call(arguments, 1));
				var table = doc.getElementById(tableId),
					body = table.getElementsByTagName('tbody')[0],
					firstRow = body.firstChild.children,
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
					body.insertAdjacentHTML('afterbegin', columnHeaderRow);
				}
			}
		});
	});
