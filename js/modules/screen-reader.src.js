/**
 * Accessibility module - Screen Reader support
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

var win = H.win,
	doc = win.document,
	each = H.each,
	map = H.map,
	erase = H.erase,
	addEvent = H.addEvent,
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
 * String trim that works for IE6-8 as well.
 * @param  {string} str The input string
 * @return {string} The trimmed string
 */
function stringTrim(str) {
	return str.trim && str.trim() || str.replace(/^\s+|\s+$/g, '');
}

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

/** 
 * i18n utility function. Format a single array statement in a format string. If
 * the statement is not an array statement, returns the statement within
 * brackets. Invalid array statements return an empty string.
 */
function formatArrayStatement(statement, ctx) {
	var eachStart = statement.indexOf('_each('),
		pluralStart = statement.indexOf('_plural('),
		indexStart = statement.indexOf('['),
		indexEnd = statement.indexOf(']'),
		arr,
		result;

	// Dealing with an each-function?
	if (eachStart > -1) {
		var eachEnd = statement.slice(eachStart).indexOf(')') + eachStart,
			preEach = statement.substring(0, eachStart),
			postEach = statement.substring(eachEnd + 1),
			eachStatement = statement.substring(eachStart + 6, eachEnd),
			eachArguments = eachStatement.split(','),
			lenArg = Number(eachArguments[1]),
			len;
		result = '';
		arr = ctx[eachArguments[0]];
		if (arr) {
			lenArg = isNaN(lenArg) ? arr.length : lenArg;
			len = lenArg < 0 ?
				arr.length + lenArg :
				Math.min(lenArg, arr.length); // Overshoot
			// Run through the array for the specified length
			for (var i = 0; i < len; ++i) {
				result += preEach + arr[i] + postEach;
			}
		}
		return result.length ? result : '';	
	}

	// Dealing with a plural-function?
	if (pluralStart > -1) {
		var pluralEnd = statement.slice(pluralStart).indexOf(')') + pluralStart,
			pluralStatement = statement.substring(pluralStart + 8, pluralEnd),
			pluralArguments = pluralStatement.split(','),
			num = Number(ctx[pluralArguments[0]]);			
		switch (num) {
		case 0:
			result = pluralArguments[4] || pluralArguments[1];
			break;
		case 1:
			result = pluralArguments[2] || pluralArguments[1];
			break;
		case 2:
			result = pluralArguments[3] || pluralArguments[1];
			break;
		default:
			result = pluralArguments[1];
		}
		return result ? stringTrim(result) : '';
	}

	// Array index
	if (indexStart > -1) {
		var arrayName = statement.substring(0, indexStart),
			ix = Number(statement.substring(indexStart + 1, indexEnd)),
			val;
		arr = ctx[arrayName];
		if (!isNaN(ix) && arr) {
			if (ix < 0) {
				val = arr[arr.length + ix];
				// Handle negative overshoot
				if (val === undefined) {
					val = arr[0];
				}
			} else {
				val = arr[ix];
				// Handle positive overshoot
				if (val === undefined) {
					val = arr[arr.length - 1];
				}
			}
		}
		return val !== undefined ? val : '';
	}

	// Standard substitution, delegate to H.format or similar
	return '{' + statement + '}';
}


/**
 * i18n formatting function. Extends H.format() functionality by also handling
 * arrays and plural conditionals. Arrays can be indexed as follows:
 *
 *  Format: 'This is the first index: {myArray[0]}. The last: {myArray[-1]}.'
 *  Context: { myArray: [0, 1, 2, 3, 4, 5] }
 *  Result: 'This is the first index: 0. The last: 5.'
 *
 * They can also be iterated using the _each() function. This will repeat the
 * contents of the bracket expression for each element. Example:
 *
 *  Format: 'List contains: {_each(myArray)cm }'
 *  Context: { myArray: [0, 1, 2] }
 *  Result: 'List contains: 0cm 1cm 2cm '
 *
 * The _each() function optionally takes a length parameter. If positive, this
 * parameter specifies the max number of elements to iterate through. If
 * negative, the function will subtract the number from the length of the array.
 * Use this to stop iterating before the array ends. Example:
 *
 *  Format: 'List contains: {_each(myArray, -1), }and {myArray[-1]}.'
 *  Context: { myArray: [0, 1, 2, 3] }
 *  Result: 'List contains: 0, 1, 2, and 3.'
 *
 * Use the _plural() function to pick a string depending on whether or not a
 * context object is 1. Arguments are _plural(obj, plural, singular). Example:
 *
 *  Format: 'Has {numPoints} {_plural(numPoints, points, point}.'
 *  Context: { numPoints: 5 }
 *  Result: 'Has 5 points.'
 *
 * Optionally there are additional parameters for dual and none:
 *  _plural(obj,plural,singular,dual,none)
 * Example:
 *
 *  Format: 'Has {_plural(numPoints, many points, one point, two points, none}.'
 *  Context: { numPoints: 5 }
 *  Result: 'Has many points.'
 *
 * The dual or none parameters will take precedence if they are supplied.
 *
 * @param   {string} formatString The string to format.
 * @param   {object} context Context to apply to the format string.
 * @param   {Time} time A `Time` instance for date formatting, passed on to
 *                 H.format().
 * @return  {string} The formatted string.
 */
H.i18nFormat = function (formatString, context, time) {
	var getFirstBracketStatement = function (sourceStr, offset) {
			var str = sourceStr.slice(offset || 0),
				startBracket = str.indexOf('{'),
				endBracket = str.indexOf('}');
			if (startBracket > -1 && endBracket > startBracket) {
				return {
					statement: str.substring(startBracket + 1, endBracket),
					begin: offset + startBracket + 1,
					end: offset + endBracket
				};
			}
		},
		tokens = [],
		bracketRes,
		constRes,
		cursor = 0;

	// Tokenize format string into bracket statements and constants
	do {
		bracketRes = getFirstBracketStatement(formatString, cursor);
		constRes = formatString.substring(
			cursor,
			bracketRes && bracketRes.begin - 1
		);

		// If we have constant content before this bracket statement, add it
		if (constRes.length) {
			tokens.push({
				value: constRes,
				type: 'constant'
			});
		}

		// Add the bracket statement
		if (bracketRes) {
			tokens.push({
				value: bracketRes.statement,
				type: 'statement'
			});
		}

		cursor = bracketRes && bracketRes.end + 1;
	} while (bracketRes);

	// Perform the formatting. The formatArrayStatement function returns the
	// statement in brackets if it is not an array statement, which means it
	// gets picked up by H.format below.
	each(tokens, function (token) {
		if (token.type === 'statement') {
			token.value = formatArrayStatement(token.value, context);
		}
	});

	// Join string back together and pass to H.format to pick up non-array
	// statements.
	return H.format(H.reduce(tokens, function (acc, cur) {
		return acc + cur.value;
	}, ''), context, time);
};


/**
 * Apply context to a format string from lang options of the chart.
 * @param  {string} langKey Key (using dot notation) into lang option structure
 * @param  {object} context Context to apply to the format string
 * @return {string} The formatted string
 */
H.Chart.prototype.langFormat = function (langKey, context, time) {
	var keys = langKey.split('.'),
		formatString = this.options.lang,
		i = 0;
	for (; i < keys.length; ++i) {
		formatString = formatString && formatString[keys[i]];
	}
	return typeof formatString === 'string' && H.i18nFormat(
		formatString, context, time
	);
};


/**
 * Accessibility options
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
	 * @type {Object}
	 * @optionparent accessibility
	 */
	accessibility: {

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
		 * @since 5.0.0
		 */
		pointDescriptionThreshold: false, // set to false to disable
		
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
		 */
		screenReaderSectionFormatter: function (chart) {
			var options = chart.options,
				chartTypes = chart.types || [],
				formatContext = {
					chart: chart,
					numSeries: chart.series && chart.series.length
				},
				// Build axis info - but not for pies and maps. Consider not
				// adding for certain other types as well (funnel, pyramid?)
				axesDesc = (
					chartTypes.length === 1 && chartTypes[0] === 'pie' ||
					chartTypes[0] === 'map'
				) && {} || chart.getAxesDescription();

			return '<div>' + chart.langFormat(
						'accessibility.navigationHint', formatContext
					) + '</div><h3>' +
					(
						options.title.text ? 
							htmlencode(options.title.text) : 
							chart.langFormat(
								'accessibility.defaultChartTitle', formatContext
							)
					) +
					(
						options.subtitle &&	options.subtitle.text ?
							'. ' + htmlencode(options.subtitle.text) :
							''
					) +
					'</h3><h4>' + chart.langFormat(
						'accessibility.longDescriptionHeading', formatContext
					) + '</h4><div>' +
					(
						options.chart.description || chart.langFormat(
							'accessibility.noDescription', formatContext
						)
					) +
					'</div><h4>' + chart.langFormat(
						'accessibility.structureHeading', formatContext
					) + '</h4><div>' +
					(
						options.chart.typeDescription ||
						chart.getTypeDescription()
					) +	'</div>' +
					(axesDesc.xAxis ? (
						'<div>' + axesDesc.xAxis + '</div>'
					) : '') +
					(axesDesc.yAxis ? (
						'<div>' + axesDesc.yAxis + '</div>'
					) : '');
		}
	},


	lang: {
		/**
		 * Configure the accessibility strings in the chart. Requires the 
		 * [accessibility module](//code.highcharts.com/modules/accessibility.
		 * js) to be loaded. For a description of the module and information
		 * on its features, see [Highcharts Accessibility](http://www.highcharts.
		 * com/docs/chart-concepts/accessibility).
		 *
		 * For more dynamic control over the accessibility functionality, see
		 * [series.pointDescriptionFormatter](plotOptions.series.
		 * pointDescriptionFormatter) and
		 * [accessibility.seriesDescriptionFormatter](accessibility.
		 * seriesDescriptionFormatter).
		 *
		 * @since 6.0.6
		 * @type {Object}
		 * @optionparent lang.accessibility
		 */
		accessibility: {
			/* eslint-disable max-len */

			screenReaderRegionLabel: 'Chart screen reader information.',
			navigationHint: 'Use regions/landmarks to skip ahead to chart {_plural(numSeries, and navigate between data series,)}',
			defaultChartTitle: 'Chart',
			longDescriptionHeading: 'Long description.',
			noDescription: 'No description available.',
			structureHeading: 'Structure.',
			viewAsDataTable: 'View as data table.',
			chartHeading: 'Chart graphic.',
			chartContainerLabel: 'Interactive chart. {title}. Use up and down arrows to navigate with most screen readers.',
			rangeSelectorMinInput: 'Select start date.',
			rangeSelectorMaxInput: 'Select end date.',
			tableSummary: 'Table representation of chart.',

			/**
			 * Descriptions of lesser known series types. The relevant
			 * description is added to the screen reader information region
			 * when these series types are used.
			 *
			 * @since 6.0.6
			 * @type {Object}
			 * @optionparent lang.accessibility.seriesTypeDescriptions
			 */
			seriesTypeDescriptions: {
				boxplot: 'Box plot charts are typically used to display ' +
					'groups of statistical data. Each data point in the ' +
					'chart can have up to 5 values: minimum, lower quartile, ' +
					'median, upper quartile, and maximum.',
				arearange: 'Arearange charts are line charts displaying a ' +
					'range between a lower and higher value for each point.',
				areasplinerange: 'These charts are line charts displaying a ' +
					'range between a lower and higher value for each point.',
				bubble: 'Bubble charts are scatter charts where each data ' +
					'point also has a size value.',
				columnrange: 'Columnrange charts are column charts ' +
					'displaying a range between a lower and higher value for ' +
					'each point.',
				errorbar: 'Errorbar series are used to display the ' +
					'variability of the data.',
				funnel: 'Funnel charts are used to display reduction of data ' +
					'in stages.',
				pyramid: 'Pyramid charts consist of a single pyramid with ' +
					'item heights corresponding to each point value.',
				waterfall: 'A waterfall chart is a column chart where each ' +
					'column contributes towards a total end value.'
			},

			/**
			 * Chart type description strings. This is added to the chart 
			 * information region.
			 * 
			 * If there is only a single series type used in the chart, we use
			 * the format string for the series type, or default if missing.
			 * There is one format string for cases where there is only a single
			 * series in the chart, and one for multiple series of the same
			 * type.
			 *
			 * @since 6.0.6
			 * @type {Object}
			 * @optionparent lang.accessibility.chartTypes
			 */
			chartTypes: {
				emptyChart: 'Empty chart',
				mapTypeDescription: 'Map of {mapTitle} with {numSeries} data series.',
				unknownMap: 'Map of unspecified region with {numSeries} data series.',
				combinationChart: 'Combination chart with {numSeries} data series.',
				defaultSingle: 'Chart with {numPoints} data {_plural(numPoints, points, point)}.',
				defaultMultiple: 'Chart with {numSeries} data series.',
				splineSingle: 'Line chart with {numPoints} data {_plural(numPoints, points, point)}.',
				splineMultiple: 'Line chart with {numSeries} lines.',
				lineSingle: 'Line chart with {numPoints} data {_plural(numPoints, points, point)}.',
				lineMultiple: 'Line chart with {numSeries} lines.',
				columnSingle: 'Bar chart with {numPoints} {_plural(numPoints, bars, bar)}.',
				columnMultiple: 'Bar chart with {numSeries} data series.',
				barSingle: 'Bar chart with {numPoints} {_plural(numPoints, bars, bar)}.',
				barMultiple: 'Bar chart with {numSeries} data series.',
				pieSingle: 'Pie chart with {numPoints} {_plural(numPoints, slices, slice)}.',
				pieMultiple: 'Pie chart with {numSeries} pies.',
				scatterSingle: 'Scatter chart with {numPoints} {_plural(numPoints, points, point)}.',
				scatterMultiple: 'Scatter chart with {numSeries} data series.',
				boxplotSingle: 'Boxplot with {numPoints} {_plural(numPoints, boxes, box)}.',
				boxplotMultiple: 'Boxplot with {numSeries} data series.',
				bubbleSingle: 'Bubble chart with {numPoints} {_plural(numPoints, bubbles, bubble)}.',
				bubbleMultiple: 'Bubble chart with {numSeries} data series.'
			},

			/**
			 * Axis description format strings.
			 *
			 * @since 6.0.6
			 * @type {Object}
			 * @optionparent lang.accessibility.axis
			 */
			axis: {
				xAxisDescriptionSingular: 'The chart has 1 X axis displaying {names[0]}.',
				xAxisDescriptionPlural: 'The chart has {numAxes} X axes displaying {_each(names, -1), }and {names[-1]}',
				yAxisDescriptionSingular: 'The chart has 1 Y axis displaying {names[0]}.',
				yAxisDescriptionPlural: 'The chart has {numAxes} Y axes displaying {_each(names, -1), }and {names[-1]}'
			},

			/**
			 * Exporting menu format strings for accessibility module.
			 *
			 * @since 6.0.6
			 * @type {Object}
			 * @optionparent lang.accessibility.exporting
			 */
			exporting: {
				chartMenuLabel: 'Chart export',
				menuButtonLabel: 'View export menu',
				exportRegionLabel: 'Chart export menu'
			},

			/**
			 * Lang configuration for different series types. For more dynamic
			 * control over the series element descriptions, see
			 * [accessibility.seriesDescriptionFormatter](accessibility.
			 * seriesDescriptionFormatter).
			 *
			 * @since 6.0.6
			 * @type {Object}
			 * @optionparent lang.accessibility.series
			 */
			series: {
				/**
				 * Lang configuration for the series main summary. Each series
				 * type has two modes:
				 * 	1. This series type is the only series type used in the
				 *		chart
				 *	2. This is a combination chart with multiple series types
				 *
				 * If a definition does not exist for the specific series type
				 * and mode, the 'default' lang definitions are used.
				 *
				 * @since 6.0.6
				 * @type {Object}
				 * @optionparent lang.accessibility.series.summary
				 */
				summary: {
					default: '{name}, series {ix} of {numSeries} with {numPoints} data {_plural(numPoints, points, point)}.',
					defaultCombination: '{name}, series {ix} of {numSeries} with {numPoints} data {_plural(numPoints, points, point)}.',
					line: '{name}, line {ix} of {numSeries} with {numPoints} data {_plural(numPoints, points, point)}.',
					lineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {_plural(numPoints, points, point)}.',
					spline: '{name}, line {ix} of {numSeries} with {numPoints} data {_plural(numPoints, points, point)}.',
					splineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {_plural(numPoints, points, point)}.',
					column: '{name}, bar series {ix} of {numSeries} with {numPoints} {_plural(numPoints, bars, bar)}.',
					columnCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {_plural(numPoints, bars, bar)}.',
					bar: '{name}, bar series {ix} of {numSeries} with {numPoints} {_plural(numPoints, bars, bar)}.',
					barCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {_plural(numPoints, bars, bar)}.',
					pie: '{name}, pie {ix} of {numSeries} with {numPoints} {_plural(numPoints, slices, slice)}.',
					pieCombination: '{name}, series {ix} of {numSeries}. Pie with {numPoints} {_plural(numPoints, slices, slice)}.',
					scatter: '{name}, scatter plot {ix} of {numSeries} with {numPoints} {_plural(numPoints, points, point)}.',
					scatterCombination: '{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {_plural(numPoints, points, point)}.',
					boxplot: '{name}, boxplot {ix} of {numSeries} with {numPoints} {_plural(numPoints, boxes, box)}.',
					boxplotCombination: '{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {_plural(numPoints, boxes, box)}.',
					bubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {_plural(numPoints, bubbles, bubble)}.',
					bubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {_plural(numPoints, bubbles, bubble)}.',
					map: '{name}, map {ix} of {numSeries} with {numPoints} {_plural(numPoints, areas, area)}.',
					mapCombination: '{name}, series {ix} of {numSeries}. Map with {numPoints} {_plural(numPoints, areas, area)}.',
					mapline: '{name}, line {ix} of {numSeries} with {numPoints} data {_plural(numPoints, points, point)}.',
					maplineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {_plural(numPoints, points, point)}.',
					mapbubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {_plural(numPoints, bubbles, bubble)}.',
					mapbubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {_plural(numPoints, bubbles, bubble)}.'
				},
				/* eslint-enable max-len */

				/**
				 * User supplied description text. This is added after the main
				 * summary if present.
				 * 
				 * @type {String}
				 * @since 6.0.6
				 */
				description: '{description}',

				/**
				 * xAxis description for series if there are multiple xAxes in
				 * the chart.
				 * 
				 * @type {String}
				 * @since 6.0.6
				 */
				xAxisDescription: 'X axis, {name}',

				/**
				 * yAxis description for series if there are multiple yAxes in
				 * the chart.
				 * 
				 * @type {String}
				 * @since 6.0.6
				 */
				yAxisDescription: 'Y axis, {name}'
			}
		}
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
	var chart = this.chart,
		desc = this.description || this.options.description,
		description = desc && chart.langFormat(
			'accessibility.series.description', {
				description: desc,
				series: this
			}
		),
		xAxisInfo = chart.langFormat(
			'accessibility.series.xAxisDescription',
			{ 
				name: this.xAxis && this.xAxis.getDescription(),
				series: this 
			}
		),
		yAxisInfo = chart.langFormat(
			'accessibility.series.yAxisDescription',
			{
				name: this.yAxis && this.yAxis.getDescription(),
				series: this
			}
		),
		summaryContext = {
			name: this.name || '',
			ix: this.index + 1,
			numSeries: chart.series.length,
			numPoints: this.points.length,
			series: this
		},
		combination = chart.types.length === 1 ? '' : 'Combination',
		summary =  chart.langFormat(
			'accessibility.series.summary.' + this.type + combination,
			summaryContext
		) || chart.langFormat(
			'accessibility.series.summary.default' + combination,
			summaryContext
		);

	return summary + (description ? ' ' + description : '') + (
			chart.yAxis.length > 1 && this.yAxis ?
				' ' + yAxisInfo : ''
		) + (
			chart.xAxis.length > 1 && this.xAxis ?
				' ' + xAxisInfo : ''
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
			series.chart.time.dateFormat.call(
				a11yOptions.pointDateFormatter &&
				a11yOptions.pointDateFormatter(point) ||
				a11yOptions.pointDateFormat ||
				H.Tooltip.prototype.getXDateFormat.call(
					{ 
						getDateFormat: H.Tooltip.prototype.getDateFormat,
						chart: series.chart
					},
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
		this.isDatetimeAxis && 'Time' ||
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
// to most screen reader users, but in those cases we try to add a description
// of the type.
H.Chart.prototype.getTypeDescription = function () {
	var firstType = this.types && this.types[0],
		firstSeries = this.series && this.series[0] || {},
		mapTitle = firstSeries.mapTitle,
		typeDesc = this.langFormat(
			'accessibility.seriesTypeDescriptions.' + firstType,
			{ chart: this }
		),
		formatContext = {
			numSeries: this.series.length,
			numPoints: firstSeries.points && firstSeries.points.length,
			chart: this,
			mapTitle: mapTitle
		},
		multi = this.series && this.series.length === 1 ? 'Single' : 'Multiple';

	if (!firstType) {
		return this.langFormat(
			'accessibility.chartTypes.emptyChart', formatContext
		);
	} else if (firstType === 'map') {
		return mapTitle ?
			this.langFormat(
				'accessibility.chartTypes.mapTypeDescription',
				formatContext
			) :
			this.langFormat(
				'accessibility.chartTypes.unknownMap',
				formatContext
			);
	} else if (this.types.length > 1) {
		return this.langFormat(
			'accessibility.chartTypes.combinationChart', formatContext
		);
	}

	return (
		this.langFormat(
			'accessibility.chartTypes.' + firstType + multi,
			formatContext
		) ||
		this.langFormat(
			'accessibility.chartTypes.default' + multi,
			formatContext
		)
	) +
	(typeDesc ? ' ' + typeDesc : '');
};


// Return object with text description of each of the chart's axes
H.Chart.prototype.getAxesDescription = function () {
	var numXAxes = this.xAxis.length,
		numYAxes = this.yAxis.length,
		desc = {};

	if (numXAxes) {
		desc.xAxis = this.langFormat(
			'accessibility.axis.xAxisDescription' + (
				numXAxes > 1 ? 'Plural' : 'Singular'
			),
			{
				chart: this,
				names: map(this.xAxis, function (axis) {
					return axis.getDescription();
				}),
				numAxes: numXAxes
			}
		);
	}

	if (numYAxes) {
		desc.yAxis = this.langFormat(
			'accessibility.axis.yAxisDescription' + (
				numYAxes > 1 ? 'Plural' : 'Singular'
			),
			{
				chart: this,
				names: map(this.yAxis, function (axis) {
					return axis.getDescription();
				}),
				numAxes: numYAxes
			}
		);
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
		exportList[0].parentNode.setAttribute('aria-label',
			this.langFormat(
				'accessibility.exporting.chartMenuLabel', { chart: this }
			)
		);
	}
};


// Add screen reader region to chart.
// tableId is the HTML id of the table to focus when clicking the table anchor
// in the screen reader region.
H.Chart.prototype.addScreenReaderRegion = function (id, tableId) {
	var	chart = this,
		hiddenSection = chart.screenReaderRegion = doc.createElement('div'),
		tableShortcut = doc.createElement('h4'),
		tableShortcutAnchor = doc.createElement('a'),
		chartHeading = doc.createElement('h4');

	hiddenSection.setAttribute('id', id);
	hiddenSection.setAttribute('role', 'region');
	hiddenSection.setAttribute(
		'aria-label',
		chart.langFormat(
			'accessibility.screenReaderRegionLabel', { chart: this }
		)
	);

	hiddenSection.innerHTML = chart.options.accessibility
		.screenReaderSectionFormatter(chart);

	// Add shortcut to data table if export-data is loaded
	if (chart.getCSV) {
		tableShortcutAnchor.innerHTML = chart.langFormat(
			'accessibility.viewAsDataTable', { chart: chart }
		);
		tableShortcutAnchor.href = '#' + tableId;
		// Make this unreachable by user tabbing
		tableShortcutAnchor.setAttribute('tabindex', '-1');
		tableShortcutAnchor.onclick =
			chart.options.accessibility.onTableAnchorClick || function () {
				chart.viewData();
				doc.getElementById(tableId).focus();
			};
		tableShortcut.appendChild(tableShortcutAnchor);
		hiddenSection.appendChild(tableShortcut);
	}

	// Note: JAWS seems to refuse to read aria-label on the container, so add an
	// h4 element as title for the chart.
	chartHeading.innerHTML = chart.langFormat(
		'accessibility.chartHeading', { chart: chart }
	);
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
		chartTitle = options.title.text || chart.langFormat(
			'accessibility.defaultChartTitle', { chart: chart }
		);

	// Add SVG title/desc tags
	titleElement.textContent = htmlencode(chartTitle);
	titleElement.id = titleId;
	descElement.parentNode.insertBefore(titleElement, descElement);
	chart.renderTo.setAttribute('role', 'region');
	chart.renderTo.setAttribute(
		'aria-label',
		chart.langFormat(
			'accessibility.chartContainerLabel',
			{
				title: stripTags(chartTitle),
				chart: chart
			}
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
			chart.langFormat(
				'accessibility.exporting.menuButtonLabel', { chart: chart }
			)
		);
		exportGroupElement.appendChild(chart.exportSVGElements[0].element);
		exportGroupElement.setAttribute('role', 'region');
		exportGroupElement.setAttribute('aria-label', chart.langFormat(
			'accessibility.exporting.exportRegionLabel', { chart: chart }
		));
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
					chart.langFormat(
						'accessibility.rangeSelector' +
							(i ? 'MaxInput' : 'MinInput'), { chart: chart }
					)
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

	// Add ID and summary attr to table HTML
	H.wrap(chart, 'getTable', function (proceed) {
		return proceed.apply(this, Array.prototype.slice.call(arguments, 1))
			.replace(
				'<table>',
				'<table id="' + tableId + '" summary="' + chart.langFormat(
					'accessibility.tableSummary', { chart: chart }
				) + '">'
			);
	});
});
