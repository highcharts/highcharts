/**
 * @license @product.name@ JS v@product.version@ (@product.date@)
 * Accessibility module
 *
 * (c) 2010-2016 Highsoft AS
 * Author: Oystein Moseng
 *
 * License: www.highcharts.com/license
 */

(function (factory) {
	if (typeof module === 'object' && module.exports) {
		module.exports = factory;
	} else {
		factory(Highcharts);
	}
}(function (H) {

	var win = H.win,
		doc = win.document;

	H.Chart.prototype.callbacks.push(function (chart) {
		var options = chart.options,
			acsOptions = options.accessibility || {},
			series = chart.series,
			numSeries = series.length,
			numXAxes = chart.xAxis.length,
			numYAxes = chart.yAxis.length,
			titleElement = doc.createElementNS('http://www.w3.org/2000/svg', 'title'),
			exportGroupElement = doc.createElementNS('http://www.w3.org/2000/svg', 'g'),
			descElement = chart.container.getElementsByTagName('desc')[0],
			textElements = chart.container.getElementsByTagName('text'),
			titleId = 'highcharts-title-' + chart.index,
			tableId = 'highcharts-data-table-' + chart.index,
			oldColumnHeaderFormatter = options.exporting && options.exporting.csv && options.exporting.csv.columnHeaderFormatter,
			topLevelColumns = [],
			chartTitle = options.title.text || 'Chart',
			hiddenSection = doc.createElement('div'),
			hiddenSectionContent = '',
			tableShortcut = doc.createElement('h3'),
			tableShortcutAnchor = doc.createElement('a'),
			xAxisDesc,
			yAxisDesc,
			chartTypes = [],
			chartTypeDesc,
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
			commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'],
			specialKeys = ['z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close'],
			i;

		if (!acsOptions.enabled) {
			return;
		}

		// Add SVG title/desc tags
		titleElement.textContent = chartTitle;
		titleElement.id = titleId;
		descElement.parentNode.insertBefore(titleElement, descElement);
		chart.renderTo.setAttribute('role', 'region');
		chart.renderTo.setAttribute('aria-label', chartTitle + '. Use up and down arrows to navigate.');

		// Set attribs on context menu
		function setContextMenuAttribs() {
			var exportList = chart.exportDivElements;
			if (exportList) {
				// Set tabindex on the menu items to allow focusing by script
				// Set role to give screen readers a chance to pick up the contents
				for (var i = 0; i < exportList.length; ++i) {
					if (exportList[i].tagName === 'DIV' &&
						!(exportList[i].children && exportList[i].children.length)) {
						exportList[i].setAttribute('role', 'menuitem');
						exportList[i].setAttribute('tabindex', -1);
					}
				}
				// Set accessibility properties on parent div
				exportList[0].parentNode.setAttribute('role', 'menu');
				exportList[0].parentNode.setAttribute('aria-label', 'Chart export');
			}
		}

		// Set screen reader properties on menu parent div
		if (chart.exportSVGElements && chart.exportSVGElements[0] && chart.exportSVGElements[0].element) {
			var oldExportCallback = chart.exportSVGElements[0].element.onclick,
				parent = chart.exportSVGElements[0].element.parentNode;
			chart.exportSVGElements[0].element.onclick = function () {
				oldExportCallback.apply(this, Array.prototype.slice.call(arguments));
				setContextMenuAttribs();
				chart.focusExportItem(0);
				chart.isExporting = true;
			};
			chart.exportSVGElements[0].element.setAttribute('role', 'button');
			chart.exportSVGElements[0].element.setAttribute('aria-label', 'View export menu');
			exportGroupElement.appendChild(chart.exportSVGElements[0].element);
			exportGroupElement.setAttribute('role', 'region');
			exportGroupElement.setAttribute('aria-label', 'Chart export menu');
			parent.appendChild(exportGroupElement);
		}

		// Get label for axis (x or y)
		function getAxisLabel(axis) {
			return axis.userOptions && axis.userOptions.description || axis.axisTitle && axis.axisTitle.textStr ||
					axis.options.id || axis.categories && 'categories' || 'Undeclared';
		}

		// Hide text elements from screen readers
		for (i = 0; i < textElements.length; ++i) {
			textElements[i].setAttribute('aria-hidden', 'true');
		}

		// Enumerate chart types
		for (i = 0; i < numSeries; ++i) {
			if (chartTypes.indexOf(series[i].type) < 0) {
				chartTypes.push(series[i].type);
			}
		}

		// Simplify description of chart type. Some types will not be familiar to most screen reader users, but we try.
		if (chartTypes.length > 1) {
			chartTypeDesc = 'Combination chart.';
		} else if (chartTypes[0] === 'spline' || chartTypes[0] === 'area' || chartTypes[0] === 'areaspline') {
			chartTypeDesc = 'Line chart.';
		} else {
			chartTypeDesc = chartTypes[0] + ' chart.' + (typeDescriptionMap[chartTypes[0]] || '');
		}

		// Add axis info - but not for pies. Consider not adding for other types as well (funnel, pyramid?)
		if (!(chartTypes.length === 1 && chartTypes[0] === 'pie')) {
			if (numXAxes) {
				xAxisDesc = 'The chart has ' + numXAxes + (numXAxes > 1 ? ' X axes' : ' X axis') + ' displaying ';
				if (numXAxes < 2) {
					xAxisDesc += getAxisLabel(chart.xAxis[0]) + '.';
				} else {
					for (i = 0; i < numXAxes - 1; ++i) {
						xAxisDesc += (i ? ', ' : '') + getAxisLabel(chart.xAxis[i]);
					}
					xAxisDesc += ' and ' + getAxisLabel(chart.xAxis[i]) + '.';
				}
			}

			if (numYAxes) {
				yAxisDesc = 'The chart has ' + numYAxes + (numYAxes > 1 ? ' Y axes' : ' Y axis') + ' displaying ';
				if (numYAxes < 2) {
					yAxisDesc += getAxisLabel(chart.yAxis[0]) + '.';
				} else {
					for (i = 0; i < numYAxes - 1; ++i) {
						yAxisDesc += (i ? ', ' : '') + getAxisLabel(chart.yAxis[i]);
					}
					yAxisDesc += ' and ' + getAxisLabel(chart.yAxis[i]) + '.';
				}
			}
		}


		/* Add secret HTML section */

		hiddenSection.setAttribute('role', 'region');
		hiddenSection.setAttribute('aria-label', 'Chart screen reader information.');

		var chartTypeInfo = series[0] && typeToSeriesMap[series[0].type] || typeToSeriesMap.default;
		hiddenSectionContent = '<div tabindex="0">Use regions/landmarks to skip ahead to chart' +
			(numSeries > 1 ? ' and navigate between data series' : '') + '.</div><h3>Summary.</h3><div>' + chartTitle +
			(options.subtitle && options.subtitle.text ? '. ' + options.subtitle.text : '') +
			'</div><h3>Long description.</h3><div>' + (acsOptions.description || 'No description available.') +
			'</div><h3>Structure.</h3><div>Chart type: ' + (acsOptions.typeDescription || chartTypeDesc) + '</div>' +
			(numSeries === 1 ? '<div>' + chartTypeInfo[0] + ' with ' + series[0].points.length + ' ' +
				(series[0].points.length === 1 ? chartTypeInfo[1] : chartTypeInfo[2]) + '.</div>' : '') +
			(xAxisDesc ? ('<div>' + xAxisDesc + '</div>') : '') +
			(yAxisDesc ? ('<div>' + yAxisDesc + '</div>') : '');

		tableShortcutAnchor.innerHTML = 'View as data table.';
		tableShortcutAnchor.href = '#tableId';
		tableShortcutAnchor.setAttribute('tabindex', '-1'); // Don't make this reachable by user tabbing
		tableShortcutAnchor.onclick = function () {
			chart.viewData();
			doc.getElementById(tableId).focus();
		};
		tableShortcut.appendChild(tableShortcutAnchor);

		hiddenSection.innerHTML = hiddenSectionContent;
		hiddenSection.appendChild(tableShortcut);
		var chartHeading = doc.createElement('h3');
		chartHeading.innerHTML = 'Chart graphic.';
		chart.renderTo.insertBefore(chartHeading, chart.renderTo.firstChild);
		chart.renderTo.insertBefore(hiddenSection, chart.renderTo.firstChild);

		// Shamelessly hide the hidden section and the chart heading
		// TODO: Do this properly
		chartHeading.style.position = 'absolute';
		chartHeading.style.left = '-9999em';
		chartHeading.style.width = '1px';
		chartHeading.style.height = '1px';
		chartHeading.style.overflow = 'hidden';
		hiddenSection.style.position = 'absolute';
		hiddenSection.style.left = '-9999em';
		hiddenSection.style.width = '1px';
		hiddenSection.style.height = '1px';
		hiddenSection.style.overflow = 'hidden';


		/* Put info on points and series groups */

		// Return string with information about point
		function buildPointInfoString(point) {
			var infoString = '',
				hasSpecialKey = false;

			for (var i = 0; i < specialKeys.length; ++i) {
				if (point[specialKeys[i]] !== undefined) {
					hasSpecialKey = true;
					break;
				}
			}

			// If the point has one of the less common properties defined, display all that are defined
			if (hasSpecialKey) {
				H.each(commonKeys.concat(specialKeys), function (key) {
					var value = point[key];
					if (value !== undefined) {
						infoString += (infoString ? '. ' : '') + key + ', ' + value;
					}
				});
			} else {
				// Pick and choose properties for a succint label
				infoString = (point.name || point.category || point.id || 'x, ' + point.x) + ', ' +
					(point.value !== undefined ? point.value : point.y);
			}

			return (point.index + 1) + '. ' + (point.description ? point.description + '. ' : '') + infoString + '.';
		}

		// Return string with information about series
		function buildSeriesInfoString(dataSeries) {
			var typeInfo = typeToSeriesMap[dataSeries.type] || typeToSeriesMap.default;
			return (dataSeries.name ? dataSeries.name + ', ' : '') +
				(chartTypes.length === 1 ? typeInfo[0] : 'series') + ' ' + (dataSeries.index + 1) + ' of ' + (dataSeries.chart.series.length) +
				(chartTypes.length === 1 ? ' with ' : '. ' + typeInfo[0] + ' with ') +
				(dataSeries.points.length + ' ' + (dataSeries.points.length === 1 ? typeInfo[1] : typeInfo[2]) + '.') +
				(dataSeries.description || '') +
				(numYAxes > 1 && dataSeries.yAxis ? 'Y axis, ' + getAxisLabel(dataSeries.yAxis) : '') +
				(numXAxes > 1 && dataSeries.xAxis ? 'X axis, ' + getAxisLabel(dataSeries.xAxis) : '');
		}

		function reverseChildNodes(node) {
			var i = node.childNodes.length;
			while (i--) {
				node.appendChild(node.childNodes[i]);
			}
		}

		// Put info on series and points of a series
		function setSeriesInfo(dataSeries) {
			var firstPointEl = dataSeries.points && dataSeries.points[0].graphic && dataSeries.points[0].graphic.element,
				seriesEl = firstPointEl && firstPointEl.parentNode; // Could be tracker series depending on series type
			if (seriesEl) {
				if (numSeries > 1) {
					seriesEl.setAttribute('role', 'region');
					seriesEl.setAttribute('tabindex', '-1');
					seriesEl.setAttribute('aria-label', buildSeriesInfoString(dataSeries));
				}
				// For some series types the order of elements do not match the order of points in series
				if (seriesEl.lastChild === firstPointEl) {
					reverseChildNodes(seriesEl);
				}
			}
			H.each(dataSeries.points, function (point) {
				// Set aria label on point
				if (point.graphic) {
					point.graphic.element.setAttribute('role', 'img');
					point.graphic.element.setAttribute('tabindex', '-1');
					point.graphic.element.setAttribute('aria-label', acsOptions.pointInfoFormatter && acsOptions.pointInfoFormatter(point) ||
						buildPointInfoString(point));
				}
			});
		}
		H.each(series, setSeriesInfo);

		H.wrap(H.Series.prototype, 'drawPoints', function (proceed) {
			proceed.apply(this, Array.prototype.slice.call(arguments, 1));
			setSeriesInfo(this);
		});


		/* Wrap table functionality */

		// Keep track of columns
		options.exporting = H.merge(options.exporting, {
			csv: {
				columnHeaderFormatter: function (series, key, keyLength) {
					var prevCol = topLevelColumns[topLevelColumns.length - 1];
					if (keyLength > 1) {
						// Populate a list of columns to add in addition to the ones added by the export-csv module
						// Objects don't preserve order, so use array
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
					newCell,
					i;

				// Make table focusable by script
				table.setAttribute('tabindex', '-1');

				// Create row headers
				for (i = 0; i < body.children.length; ++i) {
					cell = body.children[i].firstChild;
					newCell = doc.createElement('th');
					newCell.setAttribute('scope', 'row');
					newCell.innerHTML = cell.innerHTML;
					cell.parentNode.replaceChild(newCell, cell);
				}

				// Set scope for column headers
				for (i = 0; i < firstRow.length; ++i) {
					if (firstRow[i].tagName === 'TH') {
						firstRow[i].setAttribute('scope', 'col');
					}
				}

				// Add top level columns
				if (topLevelColumns.length) {
					for (i = 0; i < topLevelColumns.length; ++i) {
						columnHeaderRow += '<th scope="col" colspan="' + topLevelColumns[i].span + '">' +
							topLevelColumns[i].text + '</th>';
					}
					body.insertAdjacentHTML('afterbegin', columnHeaderRow);
				}
			}
		});


		/* Add keyboard navigation */

		if (acsOptions.keyboardNavigation && acsOptions.keyboardNavigation.enabled === false) {
			return;
		}

		// Make chart reachable by tab
		chart.renderTo.setAttribute('tabindex', '0');

		// Function for highlighting a point
		H.Point.prototype.highlight = function () {
			var point = this,
				chart = point.series.chart;
			if (point.graphic && point.graphic.element.focus) {
				point.graphic.element.focus();
			}
			if (!point.isNull) {
				point.onMouseOver(); // Show the hover marker
				chart.tooltip.refresh(point); // Show the tooltip
			} else {
				chart.tooltip.hide(0);
				// Don't call blur on the element, as it messes up the chart div's focus
			}
			chart.highlightedPoint = point;
		};

		// Function to show the export menu and focus the first item (if exists)
		H.Chart.prototype.showExportMenu = function () {
			this.exportSVGElements[0].element.onclick();
			this.focusExportItem(0);
		};

		H.Chart.prototype.focusExportItem = function (ix) {
			var listItem = chart.exportDivElements && chart.exportDivElements[ix];
			if (listItem) {
				// Focus first menu item
				if (listItem.focus) {
					listItem.focus();
				}
				if (listItem.onmouseover) {
					listItem.onmouseover();
				}
				this.highlightedExportItem = ix; // Keep reference to focused item index
			}
		};

		// Function to highlight next/previous point in chart
		// Returns true on success, false on failure (no adjacent point to highlight in chosen direction)
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
				series[0].points[0].highlight();
				return true;
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
			newPoint.highlight();
			return true;
		};

		H.addEvent(chart.renderTo, 'keydown', function (ev) {
			var e = ev || win.event,
				keyCode = e.which || e.keyCode,
				highlightedExportItem = chart.highlightedExportItem,
				newSeries,
				fakeEvent,
				doExporting = chart.options.exporting && chart.options.exporting.enabled !== false,
				exportList,
				reachedEnd,
				i;

			function highlightExportItem(i) {
				if (exportList[i] && exportList[i].tagName === 'DIV' &&
						!(exportList[i].children && exportList[i].children.length)) {
					if (exportList[i].focus) {
						exportList[i].focus();
					}
					exportList[highlightedExportItem].onmouseout();
					exportList[i].onmouseover();
					chart.highlightedExportItem = i;
					return true;
				}
			}

			function hideExporting() {
				for (var a = 0; a < exportList.length; ++a) {
					H.fireEvent(exportList[a], 'mouseleave');
				}
				exportList[highlightedExportItem].onmouseout();
				chart.highlightedExportItem = 0;
				chart.renderTo.focus();
				chart.isExporting = false;
			}

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
				switch (keyCode) {
				case 37: // Left
				case 39: // Right
					if (!chart.highlightAdjacentPoint(keyCode === 39)) {
						if (keyCode === 39 && doExporting) {
							// Start export menu navigation
							chart.highlightedPoint = null;
							chart.isExporting = true;
							chart.showExportMenu();
						} else {
							// Try to return as if user tabbed or shift+tabbed
							// Some browsers won't allow mutation of event object, but try anyway
							e.which = e.keyCode = 9;
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
				exportList = chart.exportDivElements;
				switch (keyCode) {
				case 37: // Left
				case 38: // Up
					i = highlightedExportItem = highlightedExportItem || 0;
					reachedEnd = true;
					while (i--) {
						if (highlightExportItem(i)) {
							reachedEnd = false;
							break;
						}
					}
					if (reachedEnd) {
						hideExporting();
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
					for (var ix = highlightedExportItem + 1; ix < exportList.length; ++ix) {
						if (highlightExportItem(ix)) {
							reachedEnd = false;
							break;
						}
					}
					if (reachedEnd) {
						hideExporting();
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
						exportList[highlightedExportItem].onclick(fakeEvent);
					}
					break;

				default: return;
				}
			}
			e.preventDefault();
		});
	});
}));
