/**
 * Accessibility module - internationalization support
 *
 * (c) 2010-2018 Highsoft AS
 * Author: Øystein Moseng
 *
 * License: www.highcharts.com/license
 */

'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';

var each = H.each,
    pick = H.pick;

/**
 * String trim that works for IE6-8 as well.
 * @param  {string} str The input string
 * @return {string} The trimmed string
 */
function stringTrim(str) {
    return str.trim && str.trim() || str.replace(/^\s+|\s+$/g, '');
}

/**
 * i18n utility function. Format a single array or plural statement in a format
 * string. If the statement is not an array or plural statement, returns the
 * statement within brackets. Invalid array statements return an empty string.
 */
function formatExtendedStatement(statement, ctx) {
    var eachStart = statement.indexOf('#each('),
        pluralStart = statement.indexOf('#plural('),
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
                result = pick(pluralArguments[4], pluralArguments[1]);
                break;
            case 1:
                result = pick(pluralArguments[2], pluralArguments[1]);
                break;
            case 2:
                result = pick(pluralArguments[3], pluralArguments[1]);
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
 * They can also be iterated using the #each() function. This will repeat the
 * contents of the bracket expression for each element. Example:
 *
 *  Format: 'List contains: {#each(myArray)cm }'
 *  Context: { myArray: [0, 1, 2] }
 *  Result: 'List contains: 0cm 1cm 2cm '
 *
 * The #each() function optionally takes a length parameter. If positive, this
 * parameter specifies the max number of elements to iterate through. If
 * negative, the function will subtract the number from the length of the array.
 * Use this to stop iterating before the array ends. Example:
 *
 *  Format: 'List contains: {#each(myArray, -1), }and {myArray[-1]}.'
 *  Context: { myArray: [0, 1, 2, 3] }
 *  Result: 'List contains: 0, 1, 2, and 3.'
 *
 * Use the #plural() function to pick a string depending on whether or not a
 * context object is 1. Arguments are #plural(obj, plural, singular). Example:
 *
 *  Format: 'Has {numPoints} {#plural(numPoints, points, point}.'
 *  Context: { numPoints: 5 }
 *  Result: 'Has 5 points.'
 *
 * Optionally there are additional parameters for dual and none:
 *  #plural(obj,plural,singular,dual,none)
 * Example:
 *
 *  Format: 'Has {#plural(numPoints, many points, one point, two points, none}.'
 *  Context: { numPoints: 2 }
 *  Result: 'Has two points.'
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
            token.value = formatExtendedStatement(token.value, context);
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

H.setOptions({
    lang: {
        /**
         * Configure the accessibility strings in the chart. Requires the
         * [accessibility module](//code.highcharts.com/modules/accessibility.
         * js) to be loaded. For a description of the module and information
         * on its features, see [Highcharts Accessibility](http://www.highcharts.
         * com/docs/chart-concepts/accessibility).
         *
         * For more dynamic control over the accessibility functionality, see
         * [accessibility.pointDescriptionFormatter](
         * accessibility.pointDescriptionFormatter),
         * [accessibility.seriesDescriptionFormatter](
         * accessibility.seriesDescriptionFormatter), and
         * [accessibility.screenReaderSectionFormatter](
         * accessibility.screenReaderSectionFormatter).
         *
         * @since 6.0.6
         * @type {Object}
         * @optionparent lang.accessibility
         */
        accessibility: {
            /* eslint-disable max-len */

            screenReaderRegionLabel: 'Chart screen reader information.',
            navigationHint: 'Use regions/landmarks to skip ahead to chart {#plural(numSeries, and navigate between data series,)}',
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
            mapZoomIn: 'Zoom chart',
            mapZoomOut: 'Zoom out chart',
            rangeSelectorButton: 'Select range {buttonText}',
            legendItem: 'Toggle visibility of series {itemName}',

            /**
             * Title element text for the chart SVG element. Leave this
             * empty to disable adding the title element. Browsers will display
             * this content when hovering over elements in the chart. Assistive
             * technology may use this element to label the chart.
             *
             * @since 6.0.8
             */
            svgContainerTitle: '{chartTitle}',

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
                defaultSingle: 'Chart with {numPoints} data {#plural(numPoints, points, point)}.',
                defaultMultiple: 'Chart with {numSeries} data series.',
                splineSingle: 'Line chart with {numPoints} data {#plural(numPoints, points, point)}.',
                splineMultiple: 'Line chart with {numSeries} lines.',
                lineSingle: 'Line chart with {numPoints} data {#plural(numPoints, points, point)}.',
                lineMultiple: 'Line chart with {numSeries} lines.',
                columnSingle: 'Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.',
                columnMultiple: 'Bar chart with {numSeries} data series.',
                barSingle: 'Bar chart with {numPoints} {#plural(numPoints, bars, bar)}.',
                barMultiple: 'Bar chart with {numSeries} data series.',
                pieSingle: 'Pie chart with {numPoints} {#plural(numPoints, slices, slice)}.',
                pieMultiple: 'Pie chart with {numSeries} pies.',
                scatterSingle: 'Scatter chart with {numPoints} {#plural(numPoints, points, point)}.',
                scatterMultiple: 'Scatter chart with {numSeries} data series.',
                boxplotSingle: 'Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.',
                boxplotMultiple: 'Boxplot with {numSeries} data series.',
                bubbleSingle: 'Bubble chart with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
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
                xAxisDescriptionPlural: 'The chart has {numAxes} X axes displaying {#each(names, -1), }and {names[-1]}',
                yAxisDescriptionSingular: 'The chart has 1 Y axis displaying {names[0]}.',
                yAxisDescriptionPlural: 'The chart has {numAxes} Y axes displaying {#each(names, -1), }and {names[-1]}'
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
             * [accessibility.seriesDescriptionFormatter](
             * accessibility.seriesDescriptionFormatter).
             *
             * @since 6.0.6
             * @type {Object}
             * @optionparent lang.accessibility.series
             */
            series: {
                /**
                 * Lang configuration for the series main summary. Each series
                 * type has two modes:
                 *     1. This series type is the only series type used in the
                 *        chart
                 *    2. This is a combination chart with multiple series types
                 *
                 * If a definition does not exist for the specific series type
                 * and mode, the 'default' lang definitions are used.
                 *
                 * @since 6.0.6
                 * @type {Object}
                 * @optionparent lang.accessibility.series.summary
                 */
                summary: {
                    default: '{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                    defaultCombination: '{name}, series {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                    line: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                    lineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                    spline: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                    splineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                    column: '{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.',
                    columnCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.',
                    bar: '{name}, bar series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bars, bar)}.',
                    barCombination: '{name}, series {ix} of {numSeries}. Bar series with {numPoints} {#plural(numPoints, bars, bar)}.',
                    pie: '{name}, pie {ix} of {numSeries} with {numPoints} {#plural(numPoints, slices, slice)}.',
                    pieCombination: '{name}, series {ix} of {numSeries}. Pie with {numPoints} {#plural(numPoints, slices, slice)}.',
                    scatter: '{name}, scatter plot {ix} of {numSeries} with {numPoints} {#plural(numPoints, points, point)}.',
                    scatterCombination: '{name}, series {ix} of {numSeries}, scatter plot with {numPoints} {#plural(numPoints, points, point)}.',
                    boxplot: '{name}, boxplot {ix} of {numSeries} with {numPoints} {#plural(numPoints, boxes, box)}.',
                    boxplotCombination: '{name}, series {ix} of {numSeries}. Boxplot with {numPoints} {#plural(numPoints, boxes, box)}.',
                    bubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                    bubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                    map: '{name}, map {ix} of {numSeries} with {numPoints} {#plural(numPoints, areas, area)}.',
                    mapCombination: '{name}, series {ix} of {numSeries}. Map with {numPoints} {#plural(numPoints, areas, area)}.',
                    mapline: '{name}, line {ix} of {numSeries} with {numPoints} data {#plural(numPoints, points, point)}.',
                    maplineCombination: '{name}, series {ix} of {numSeries}. Line with {numPoints} data {#plural(numPoints, points, point)}.',
                    mapbubble: '{name}, bubble series {ix} of {numSeries} with {numPoints} {#plural(numPoints, bubbles, bubble)}.',
                    mapbubbleCombination: '{name}, series {ix} of {numSeries}. Bubble series with {numPoints} {#plural(numPoints, bubbles, bubble)}.'
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
