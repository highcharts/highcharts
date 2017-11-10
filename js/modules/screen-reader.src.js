/**
 * Accessibility module - Screen Reader support
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

var win = H.win,
	doc = win.document,
	each = H.each,
	erase = H.erase,
	addEvent = H.addEvent,
	dateFormat = H.dateFormat,
	merge = H.merge,
	// CSS style to hide element from visual users while still exposing it to
	// screen readers
	hiddenStyle = {
		position: 'absolute',
		left: '-9999px',
		top: 'auto',
		width: '1px',
		height: '1px',
		overflow: 'hidden'
	},
	// Human readable description of series and each point in singular and
	// plural
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
		'areasplinerange': [
			'areasplinerange series',
			'data point',
			'data points'
		],
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
		boxplot: ' Box plot charts are typically used to display groups of ' +
			'statistical data. Each data point in the chart can have up to 5 ' +
			'values: minimum, lower quartile, median, upper quartile and ' +
			'maximum. ',
		arearange: ' Arearange charts are line charts displaying a range ' +
			'between a lower and higher value for each point. ',
		areasplinerange: ' These charts are line charts displaying a range ' +
			'between a lower and higher value for each point. ',
		bubble: ' Bubble charts are scatter charts where each data point ' +
			'also has a size value. ',
		columnrange: ' Columnrange charts are column charts displaying a ' +
			'range between a lower and higher value for each point. ',
		errorbar: ' Errorbar series are used to display the variability of ' +
			'the data. ',
		funnel: ' Funnel charts are used to display reduction of data in ' +
			'stages. ',
		pyramid: ' Pyramid charts consist of a single pyramid with item ' +
			'heights corresponding to each point value. ',
		waterfall: ' A waterfall chart is a column chart where each column ' +
			'contributes towards a total end value. '
	};


// If a point has one of the special keys defined, we expose all keys to the
// screen reader.
H.Series.prototype.commonKeys = ['name', 'id', 'category', 'x', 'value', 'y'];
H.Series.prototype.specialKeys = [
	'z', 'open', 'high', 'q3', 'median', 'q1', 'low', 'close'
]; 
if (H.seriesTypes.pie) {
	// A pie is always simple. Don't quote me on that.
	H.seriesTypes.pie.prototype.specialKeys = [];
}


/**
 * Accessibility options
 * @type {Object}
 * @optionparent
 */
H.setOptions({

	/**
	 * Options for configuring accessibility for the chart. Requires the
	 * [accessibility module](//code.highcharts.com/modules/accessibility.
	 * js) to be loaded. For a description of the module and information
	 * on its features, see [Highcharts Accessibility](http://www.highcharts.
	 * com/docs/chart-concepts/accessibility).
	 * 
	 * @since 5.0.0
	 */
	accessibility: {

		/**
		 * Enable accessibility features for the chart.
		 * 
		 * @type {Boolean}
		 * @default true
		 * @since 5.0.0
		 */
		enabled: true,

		/**
		 * When a series contains more points than this, we no longer expose
		 * information about individual points to screen readers.
		 * 
		 * Set to `false` to disable.
		 * 
		 * @type {Number|Boolean}
		 * @default 30
		 * @since 5.0.0
		 */
		pointDescriptionThreshold: 30 // set to false to disable

		/**
		 * Whether or not to add series descriptions to charts with a single
		 * series.
		 * 
		 * @type {Boolean}
		 * @default false
		 * @since 5.0.0
		 * @apioption accessibility.describeSingleSeries
		 */

		/**
		 * Function to run upon clicking the "View as Data Table" link in the
		 * screen reader region.
		 * 
		 * By default Highcharts will insert and set focus to a data table
		 * representation of the chart.
		 * 
		 * @type {Function}
		 * @since 5.0.0
		 * @apioption accessibility.onTableAnchorClick
		 */
		
		/**
		 * Date format to use for points on datetime axes when describing them
		 * to screen reader users.
		 * 
		 * Defaults to the same format as in tooltip.
		 * 
		 * For an overview of the replacement codes, see
		 * [dateFormat](#Highcharts.dateFormat).
		 * 
		 * @type {String}
		 * @see [pointDateFormatter](#accessibility.pointDateFormatter)
		 * @since 5.0.0
		 * @apioption accessibility.pointDateFormat
		 */

		/**
		 * Formatter function to determine the date/time format used with
		 * points on datetime axes when describing them to screen reader users.
		 * Receives one argument, `point`, referring to the point to describe.
		 * Should return a date format string compatible with
		 * [dateFormat](#Highcharts.dateFormat).
		 * 
		 * @type {Function}
		 * @see [pointDateFormat](#accessibility.pointDateFormat)
		 * @since 5.0.0
		 * @apioption accessibility.pointDateFormatter
		 */
		
		/**
		 * Formatter function to use instead of the default for point
		 * descriptions.
		 * Receives one argument, `point`, referring to the point to describe.
		 * Should return a String with the description of the point for a screen
		 * reader user.
		 * 
		 * @type {Function}
		 * @see [point.description](#series.line.data.description)
		 * @since 5.0.0
		 * @apioption accessibility.pointDescriptionFormatter
		 */
		
		/**
		 * A formatter function to create the HTML contents of the hidden screen
		 * reader information region. Receives one argument, `chart`, referring
		 * to the chart object. Should return a String with the HTML content
		 * of the region.
		 * 
		 * The link to view the chart as a data table will be added
		 * automatically after the custom HTML content.
		 * 
		 * @type {Function}
		 * @default undefined
		 * @since 5.0.0
		 * @apioption accessibility.screenReaderSectionFormatter
		 */
		
		/**
		 * Formatter function to use instead of the default for series
		 * descriptions. Receives one argument, `series`, referring to the
		 * series to describe. Should return a String with the description of
		 * the series for a screen reader user.
		 * 
		 * @type {Function}
		 * @see [series.description](#plotOptions.series.description)
		 * @since 5.0.0
		 * @apioption accessibility.seriesDescriptionFormatter
		 */
	}
});

/**
 * A text description of the chart.
 * 
 * If the Accessibility module is loaded, this is included by default
 * as a long description of the chart and its contents in the hidden
 * screen reader information region.
 * 
 * @type {String}
 * @see [typeDescription](#chart.typeDescription)
 * @default undefined
 * @since 5.0.0
 * @apioption chart.description
 */

 /**
 * A text description of the chart type.
 * 
 * If the Accessibility module is loaded, this will be included in the
 * description of the chart in the screen reader information region.
 * 
 * 
 * Highcharts will by default attempt to guess the chart type, but for
 * more complex charts it is recommended to specify this property for
 * clarity.
 * 
 * @type {String}
 * @default undefined
 * @since 5.0.0
 * @apioption chart.typeDescription
 */


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

/**
 * Strip HTML tags away from a string. Used for aria-label attributes, painting
 * on a canvas will fail if the text contains tags.
 * @param  {String} s The input string
 * @return {String}   The filtered string
 */
function stripTags(s) {
	return typeof s === 'string' ? s.replace(/<\/?[^>]+(>|$)/g, '') : s;
}


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
		firstPointEl = (
			this.points &&
			this.points.length &&
			this.points[0].graphic &&
			this.points[0].graphic.element
		),
		seriesEl = (
			firstPointEl &&
			firstPointEl.parentNode || this.graph &&
			this.graph.element || this.group &&
			this.group.element
		); // Could be tracker series depending on series type

	if (seriesEl) {
		// For some series types the order of elements do not match the order of
		// points in series. In that case we have to reverse them in order for
		// AT to read them out in an understandable order
		if (seriesEl.lastChild === firstPointEl) {
			reverseChildNodes(seriesEl);
		}
		// Make individual point elements accessible if possible. Note: If
		// markers are disabled there might not be any elements there to make
		// accessible.
		if (
			this.points && (
				this.points.length < a11yOptions.pointDescriptionThreshold ||
				a11yOptions.pointDescriptionThreshold === false
			)
		) {
			each(this.points, function (point) {
				if (point.graphic) {
					point.graphic.element.setAttribute('role', 'img');
					point.graphic.element.setAttribute('tabindex', '-1');
					point.graphic.element.setAttribute('aria-label', stripTags(
						point.series.options.pointDescriptionFormatter && 
						point.series.options.pointDescriptionFormatter(point) ||
						a11yOptions.pointDescriptionFormatter && 
						a11yOptions.pointDescriptionFormatter(point) ||
						point.buildPointInfoString()
					));
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
			seriesEl.setAttribute(
				'aria-label',
				stripTags(
					a11yOptions.seriesDescriptionFormatter &&
					a11yOptions.seriesDescriptionFormatter(this) ||
					this.buildSeriesInfoString()
				)
			);
		}
	}
};


// Return string with information about series
H.Series.prototype.buildSeriesInfoString = function () {
	var typeInfo = (
			typeToSeriesMap[this.type] ||
			typeToSeriesMap['default'] // eslint-disable-line dot-notation
		),
		description = this.description || this.options.description;
	return (this.name ? this.name + ', ' : '') +
		(this.chart.types.length === 1 ? typeInfo[0] : 'series') +
		' ' + (this.index + 1) + ' of ' + (this.chart.series.length) +
		(
			this.chart.types.length === 1 ?
				' with ' :
				'. ' + typeInfo[0] + ' with '
		) +
		(
			this.points.length + ' ' +
			(this.points.length === 1 ? typeInfo[1] : typeInfo[2])
		) +
		(description ? '. ' + description : '') +
		(
			this.chart.yAxis.length > 1 && this.yAxis ?
				'. Y axis, ' + this.yAxis.getDescription() :
				''
		) +
		(
			this.chart.xAxis.length > 1 && this.xAxis ?
				'. X axis, ' + this.xAxis.getDescription() :
				''
		);
};


// Return string with information about point
H.Point.prototype.buildPointInfoString = function () {
	var point = this,
		series = point.series,
		a11yOptions = series.chart.options.accessibility,
		infoString = '',
		dateTimePoint = series.xAxis && series.xAxis.isDatetimeAxis,
		timeDesc =
			dateTimePoint &&
			dateFormat(
				a11yOptions.pointDateFormatter &&
				a11yOptions.pointDateFormatter(point) ||
				a11yOptions.pointDateFormat ||
				H.Tooltip.prototype.getXDateFormat(
					point,
					series.chart.options.tooltip,
					series.xAxis
				),
				point.x
			),
		hasSpecialKey = H.find(series.specialKeys, function (key) {
			return point[key] !== undefined;
		});

	// If the point has one of the less common properties defined, display all
	// that are defined
	if (hasSpecialKey) {
		if (dateTimePoint) {
			infoString = timeDesc;
		}
		each(series.commonKeys.concat(series.specialKeys), function (key) {
			if (point[key] !== undefined && !(dateTimePoint && key === 'x')) {
				infoString += (infoString ? '. ' : '') +
					key + ', ' +
					point[key];
			}
		});
	} else {
		// Pick and choose properties for a succint label
		infoString = 
			(
				this.name ||
				timeDesc ||
				this.category ||
				this.id ||
				'x, ' + this.x
			) + ', ' +
			(this.value !== undefined ? this.value : this.y);
	}

	return (this.index + 1) + '. ' + infoString + '.' +
		(this.description ? ' ' + this.description : '');
};


// Get descriptive label for axis
H.Axis.prototype.getDescription = function () {
	return (
		this.userOptions && this.userOptions.description ||
		this.axisTitle && this.axisTitle.textStr ||
		this.options.id ||
		this.categories && 'categories' ||
		'values'
	);
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
			
			// Check if any of the other series have the same type as this one.
			// Otherwise remove it from the list.
			each(chart.series, function (s) {
				if (
					s !== removedSeries &&
					chart.types.indexOf(removedSeries.type) < 0
				) {
					hasType = true;
				}
			});
			if (!hasType) {
				erase(chart.types, removedSeries.type);
			}
		});
	}
});


// Return simplified description of chart type. Some types will not be familiar
// to most screen reader users, but we try.
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
		desc.xAxis = 'The chart has ' + numXAxes +
			(numXAxes > 1 ? ' X axes' : ' X axis') + ' displaying ';
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
		desc.yAxis = 'The chart has ' + numYAxes +
		(numYAxes > 1 ? ' Y axes' : ' Y axis') + ' displaying ';
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


// Add screen reader region to chart.
// tableId is the HTML id of the table to focus when clicking the table anchor
// in the screen reader region.
H.Chart.prototype.addScreenReaderRegion = function (id, tableId) {
	var	chart = this,
		series = chart.series,
		options = chart.options,
		a11yOptions = options.accessibility,
		hiddenSection = chart.screenReaderRegion = doc.createElement('div'),
		tableShortcut = doc.createElement('h4'),
		tableShortcutAnchor = doc.createElement('a'),
		chartHeading = doc.createElement('h4'),
		chartTypes = chart.types || [],
		// Build axis info - but not for pies and maps. Consider not adding for
		// certain other types as well (funnel, pyramid?)
		axesDesc = (
			chartTypes.length === 1 && chartTypes[0] === 'pie' ||
			chartTypes[0] === 'map'
		) && {} || chart.getAxesDescription(),
		chartTypeInfo = series[0] && typeToSeriesMap[series[0].type] ||
			typeToSeriesMap['default']; // eslint-disable-line dot-notation

	hiddenSection.setAttribute('id', id);
	hiddenSection.setAttribute('role', 'region');
	hiddenSection.setAttribute(
		'aria-label',
		'Chart screen reader information.'
	);

	hiddenSection.innerHTML = 
		a11yOptions.screenReaderSectionFormatter &&
		a11yOptions.screenReaderSectionFormatter(chart) ||
		'<div>Use regions/landmarks to skip ahead to chart' +
		(series.length > 1 ? ' and navigate between data series' : '') +
		'.</div><h3>' +
		(options.title.text ? htmlencode(options.title.text) : 'Chart') +
		(
			options.subtitle &&	options.subtitle.text ?
				'. ' + htmlencode(options.subtitle.text) :
				''
		) +
		'</h3><h4>Long description.</h4><div>' +
		(options.chart.description || 'No description available.') +
		'</div><h4>Structure.</h4><div>Chart type: ' +
		(options.chart.typeDescription || chart.getTypeDescription()) +
		'</div>' +
		(
			series.length === 1 ?
				(
					'<div>' + chartTypeInfo[0] + ' with ' +
					series[0].points.length + ' ' +
					(
						series[0].points.length === 1 ?
							chartTypeInfo[1] :
							chartTypeInfo[2]
					) +
					'.</div>'
				) : ''
		) +
		(axesDesc.xAxis ? ('<div>' + axesDesc.xAxis + '</div>') : '') +
		(axesDesc.yAxis ? ('<div>' + axesDesc.yAxis + '</div>') : '');

	// Add shortcut to data table if export-data is loaded
	if (chart.getCSV) {
		tableShortcutAnchor.innerHTML = 'View as data table.';
		tableShortcutAnchor.href = '#' + tableId;
		// Make this unreachable by user tabbing
		tableShortcutAnchor.setAttribute('tabindex', '-1');
		tableShortcutAnchor.onclick =
			a11yOptions.onTableAnchorClick || function () {
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

	var	titleElement = doc.createElementNS(
			'http://www.w3.org/2000/svg',
			'title'
		),
		exportGroupElement = doc.createElementNS(
			'http://www.w3.org/2000/svg',
			'g'
		),
		descElement = chart.container.getElementsByTagName('desc')[0],
		textElements = chart.container.getElementsByTagName('text'),
		titleId = 'highcharts-title-' + chart.index,
		tableId = 'highcharts-data-table-' + chart.index,
		hiddenSectionId = 'highcharts-information-region-' + chart.index,
		chartTitle = options.title.text || 'Chart',
		oldColumnHeaderFormatter = (
			options.exporting &&
			options.exporting.csv &&
			options.exporting.csv.columnHeaderFormatter
		),
		topLevelColumns = [];

	// Add SVG title/desc tags
	titleElement.textContent = htmlencode(chartTitle);
	titleElement.id = titleId;
	descElement.parentNode.insertBefore(titleElement, descElement);
	chart.renderTo.setAttribute('role', 'region');
	chart.renderTo.setAttribute(
		'aria-label',
		stripTags(
			'Interactive chart. ' + chartTitle +
			'. Use up and down arrows to navigate with most screen readers.'
		)
	);

	// Set screen reader properties on export menu
	if (
		chart.exportSVGElements &&
		chart.exportSVGElements[0] &&
		chart.exportSVGElements[0].element
	) {
		var oldExportCallback = chart.exportSVGElements[0].element.onclick,
			parent = chart.exportSVGElements[0].element.parentNode;
		chart.exportSVGElements[0].element.onclick = function () {
			oldExportCallback.apply(
				this,
				Array.prototype.slice.call(arguments)
			);
			chart.addAccessibleContextMenuAttribs();
			chart.highlightExportItem(0);
		};
		chart.exportSVGElements[0].element.setAttribute('role', 'button');
		chart.exportSVGElements[0].element.setAttribute(
			'aria-label',
			'View export menu'
		);
		exportGroupElement.appendChild(chart.exportSVGElements[0].element);
		exportGroupElement.setAttribute('role', 'region');
		exportGroupElement.setAttribute('aria-label', 'Chart export menu');
		parent.appendChild(exportGroupElement);
	}

	// Set screen reader properties on input boxes for range selector. We need
	// to do this regardless of whether or not these are visible, as they are 
	// by default part of the page's tabindex unless we set them to -1.
	if (chart.rangeSelector) {
		each(['minInput', 'maxInput'], function (key, i) {
			if (chart.rangeSelector[key]) {
				chart.rangeSelector[key].setAttribute('tabindex', '-1');
				chart.rangeSelector[key].setAttribute('role', 'textbox');
				chart.rangeSelector[key].setAttribute(
					'aria-label',
					'Select ' + (i ? 'end' : 'start') + ' date.'
				);
			}
		});
	}

	// Hide text elements from screen readers
	each(textElements, function (el) {
		el.setAttribute('aria-hidden', 'true');
	});

	// Add top-secret screen reader region
	chart.addScreenReaderRegion(hiddenSectionId, tableId);


	/* Wrap table functionality from export-data */
	/* TODO: Can't we just do this in export-data? */

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
					// Populate a list of column headers to add in addition to
					// the ones added by export-data
					if ((prevCol && prevCol.text) !== item.name) {
						topLevelColumns.push({
							text: item.name,
							span: keyLength
						});
					}
				}
				if (oldColumnHeaderFormatter) {
					return oldColumnHeaderFormatter.call(
						this,
						item,
						key,
						keyLength
					);
				}
				return keyLength > 1 ? key : item.name;
			}
		}
	});

	// Add ID and title/caption to table HTML
	H.wrap(chart, 'getTable', function (proceed) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
			.replace(
				'<table>',
				'<table id="' + tableId + '" summary="Table representation ' +
					'of chart"><caption>' + chartTitle + '</caption>'
			);
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
					columnHeaderRow += '<th scope="col" colspan="' + col.span +
						'">' + col.text + '</th>';
				});
				head.insertAdjacentHTML('afterbegin', columnHeaderRow);
			}
		}
	});
});
