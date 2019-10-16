/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Place desriptions on a series and its points.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../../parts/Globals.js';
var numberFormat = H.numberFormat;

import U from '../../../../parts/Utilities.js';
var isNumber = U.isNumber,
    pick = U.pick;

import HTMLUtilities from '../../utils/htmlUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString,
    reverseChildNodes = HTMLUtilities.reverseChildNodes;

import ChartUtilities from '../../utils/chartUtilities.js';
var getAxisDescription = ChartUtilities.getAxisDescription,
    getSeriesFirstPointElement = ChartUtilities.getSeriesFirstPointElement,
    getSeriesA11yElement = ChartUtilities.getSeriesA11yElement,
    unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;


/**
 * @private
 * @param {Highcharts.Series} series
 * @return {boolean}
 */
function shouldSetScreenReaderPropsOnPoints(series) {
    var chartA11yOptions = series.chart.options.accessibility,
        seriesA11yOptions = series.options.accessibility || {};

    return !!(
        series.points && (
            series.points.length <
            chartA11yOptions.series.pointDescriptionEnabledThreshold ||
            chartA11yOptions.series.pointDescriptionEnabledThreshold === false
        ) && !seriesA11yOptions.exposeAsGroupOnly
    );
}


/**
 * @private
 * @param {Highcharts.Series} series
 * @return {boolean}
 */
function shouldSetKeyboardNavPropsOnPoints(series) {
    var chartA11yOptions = series.chart.options.accessibility,
        seriesNavOptions = chartA11yOptions.keyboardNavigation
            .seriesNavigation;

    return !!(
        series.points && (
            series.points.length <
                seriesNavOptions.pointNavigationEnabledThreshold ||
                seriesNavOptions.pointNavigationEnabledThreshold === false
        )
    );
}


/**
 * @private
 * @param {Highcharts.Point} point
 * @param {number} value
 * @return {string}
 */
function pointNumberToString(point, value) {
    var chart = point.series.chart,
        a11yPointOptions = chart.options.accessibility.point || {},
        tooltipOptions = point.series.tooltipOptions || {},
        lang = chart.options.lang;

    if (isNumber(value)) {
        return numberFormat(
            value,
            a11yPointOptions.valueDecimals ||
                tooltipOptions.valueDecimals || -1,
            lang.decimalPoint,
            lang.accessibility.thousandsSep || lang.thousandsSep
        );
    }

    return value;
}


/**
 * @private
 * @param {Highcharts.Series} series
 * @return {string}
 */
function getSeriesDescriptionText(series) {
    var seriesA11yOptions = series.options.accessibility || {},
        descOpt = seriesA11yOptions.description;

    return descOpt && series.chart.langFormat(
        'accessibility.series.description', {
            description: descOpt,
            series: series
        }
    );
}


/**
 * @private
 * @param {Highcharts.series} series
 * @param {string} axisCollection
 * @return {string}
 */
function getSeriesAxisDescriptionText(series, axisCollection) {
    var axis = series[axisCollection];

    return series.chart.langFormat(
        'accessibility.series.' + axisCollection + 'Description',
        {
            name: getAxisDescription(axis),
            series: series
        }
    );
}


/**
 * Get accessible time description for a point on a datetime axis.
 *
 * @private
 * @function Highcharts.Point#getTimeDescription
 *
 * @return {string}
 *         The description as string.
 */
function getPointA11yTimeDescription(point) {
    var series = point.series,
        chart = series.chart,
        a11yOptions = chart.options.accessibility.point || {},
        hasDateXAxis = series.xAxis && series.xAxis.isDatetimeAxis;

    if (hasDateXAxis) {
        var tooltipDateFormat = H.Tooltip.prototype.getXDateFormat.call(
                {
                    getDateFormat: H.Tooltip.prototype.getDateFormat,
                    chart: chart
                },
                point,
                chart.options.tooltip,
                series.xAxis
            ),
            dateFormat = a11yOptions.dateFormatter &&
                a11yOptions.dateFormatter(point) ||
                a11yOptions.dateFormat ||
                tooltipDateFormat;

        return chart.time.dateFormat(dateFormat, point.x);
    }
}


/**
 * @private
 * @param {Highcharts.Point} point
 * @return {string}
 */
function getPointXDescription(point) {
    var timeDesc = getPointA11yTimeDescription(point),
        xAxis = point.series.xAxis || {},
        pointCategory = xAxis.categories && point.category !== undefined &&
            ('' + point.category).replace('<br/>', ' '),
        canUseId = point.id && point.id.indexOf('highcharts-') < 0,
        fallback = 'x, ' + point.x;

    return point.name || timeDesc || pointCategory ||
        (canUseId ? point.id : fallback);
}


/**
 * @private
 * @param {Highcharts.Point} point
 * @return {string}
 */
function getPointValueDescription(point) {
    var series = point.series,
        a11yPointOpts = series.chart.options.accessibility.point || {},
        tooltipOptions = series.tooltipOptions || {},
        numFormat = function (val) {
            return pointNumberToString(point, val);
        },
        valuePrefix = a11yPointOpts.valuePrefix ||
            tooltipOptions.valuePrefix || '',
        valueSuffix = a11yPointOpts.valueSuffix ||
            tooltipOptions.valueSuffix || '',
        addPrefixSuffix = function (val) {
            return valuePrefix + val + valueSuffix;
        },
        keyToValStr = function (key) {
            return key + ': ' + addPrefixSuffix(
                numFormat(pick(point[key], point.options[key]))
            );
        },
        fallbackKey = point.value !== undefined ? 'value' : 'y',
        pointArrayMap = point.series.pointArrayMap;

    return pointArrayMap ?
        pointArrayMap.reduce(function (desc, key) {
            return desc + (desc.length ? ', ' : '') + keyToValStr(key);
        }, '') :
        addPrefixSuffix(numFormat(point[fallbackKey]));
}


/**
 * Return string with information about point.
 * @private
 * @return {string}
 */
function defaultPointDescriptionFormatter(point) {
    var series = point.series,
        chart = series.chart,
        description = point.options && point.options.accessibility &&
            point.options.accessibility.description,
        showXDescription = pick(
            series.xAxis &&
            series.xAxis.options.accessibility &&
            series.xAxis.options.accessibility.enabled,
            !chart.angular
        ),
        xDesc = getPointXDescription(point),
        valueDesc = getPointValueDescription(point),
        indexText = point.index !== undefined ?
            (point.index + 1) + '. ' : '',
        xDescText = showXDescription ? xDesc + ', ' : '',
        valText = valueDesc + '.',
        userDescText = description ? ' ' + description : '',
        seriesNameText = chart.series.length > 1 && series.name ?
            ' ' + series.name + '.' : '';

    return indexText + xDescText + valText + userDescText + seriesNameText;
}


/**
 * Set a11y props on a point element
 * @private
 * @param {Highcharts.Point} point
 * @param {Highcharts.SVGDOMElement} pointElement
 */
function setPointScreenReaderAttribs(point, pointElement) {
    var series = point.series,
        a11yPointOptions = series.chart.options.accessibility.point || {},
        seriesA11yOptions = series.options.accessibility || {},
        label = stripHTMLTags(
            seriesA11yOptions.pointDescriptionFormatter &&
            seriesA11yOptions.pointDescriptionFormatter(point) ||
            a11yPointOptions.descriptionFormatter &&
            a11yPointOptions.descriptionFormatter(point) ||
            defaultPointDescriptionFormatter(point)
        );

    pointElement.setAttribute('role', 'img');
    pointElement.setAttribute('aria-label', label);
}


/**
 * Add accessible info to individual point elements of a series
 * @private
 * @param {Highcharts.Series} series
 */
function describePointsInSeries(series) {
    var setScreenReaderProps = shouldSetScreenReaderPropsOnPoints(series),
        setKeyboardProps = shouldSetKeyboardNavPropsOnPoints(series);

    if (setScreenReaderProps || setKeyboardProps) {
        series.points.forEach(function (point) {
            var pointEl = point.graphic && point.graphic.element;

            if (pointEl) {
                // We always set tabindex, as long as we are setting
                // props.
                pointEl.setAttribute('tabindex', '-1');

                if (setScreenReaderProps) {
                    setPointScreenReaderAttribs(point, pointEl);
                } else {
                    pointEl.setAttribute('aria-hidden', true);
                }
            }
        });
    }
}


/**
 * Return string with information about series.
 * @private
 * @return {string}
 */
function defaultSeriesDescriptionFormatter(series) {
    var chart = series.chart,
        chartTypes = chart.types || [],
        description = getSeriesDescriptionText(series),
        shouldDescribeAxis = function (coll) {
            return chart[coll] && chart[coll].length > 1 && series[coll];
        },
        xAxisInfo = getSeriesAxisDescriptionText(series, 'xAxis'),
        yAxisInfo = getSeriesAxisDescriptionText(series, 'yAxis'),
        summaryContext = {
            name: series.name || '',
            ix: series.index + 1,
            numSeries: chart.series && chart.series.length,
            numPoints: series.points && series.points.length,
            series: series
        },
        combinationSuffix = chartTypes.length > 1 ? 'Combination' : '',
        summary = chart.langFormat(
            'accessibility.series.summary.' + series.type + combinationSuffix,
            summaryContext
        ) || chart.langFormat(
            'accessibility.series.summary.default' + combinationSuffix,
            summaryContext
        );

    return summary + (description ? ' ' + description : '') + (
        shouldDescribeAxis('yAxis') ? ' ' + yAxisInfo : ''
    ) + (
        shouldDescribeAxis('xAxis') ? ' ' + xAxisInfo : ''
    );
}


/**
 * Set a11y props on a series element
 * @private
 * @param {Highcharts.Series} series
 * @param {Highcharts.SVGDOMElement} seriesElement
 */
function describeSeriesElement(series, seriesElement) {
    var seriesA11yOptions = series.options.accessibility || {},
        a11yOptions = series.chart.options.accessibility,
        landmarkVerbosity = a11yOptions.landmarkVerbosity;

    // Handle role attribute
    if (seriesA11yOptions.exposeAsGroupOnly) {
        seriesElement.setAttribute('role', 'img');
    } else if (landmarkVerbosity === 'all') {
        seriesElement.setAttribute('role', 'region');
    } /* else do not add role */

    seriesElement.setAttribute('tabindex', '-1');
    seriesElement.setAttribute(
        'aria-label',
        stripHTMLTags(
            a11yOptions.series.descriptionFormatter &&
            a11yOptions.series.descriptionFormatter(series) ||
            defaultSeriesDescriptionFormatter(series)
        )
    );
}


/**
 * Put accessible info on series and points of a series.
 * @param {Highcharts.Series} series The series to add info on.
 */
function describeSeries(series) {
    var chart = series.chart,
        firstPointEl = getSeriesFirstPointElement(series),
        seriesEl = getSeriesA11yElement(series),
        describeSingleSeriesOption = chart.options.accessibility.series
            .describeSingleSeries,
        shouldDescribeSeriesElement = chart.series.length > 1 ||
            describeSingleSeriesOption;

    if (seriesEl) {
        // For some series types the order of elements do not match the
        // order of points in series. In that case we have to reverse them
        // in order for AT to read them out in an understandable order
        if (seriesEl.lastChild === firstPointEl) {
            reverseChildNodes(seriesEl);
        }

        describePointsInSeries(series);

        unhideChartElementFromAT(chart, seriesEl);

        if (shouldDescribeSeriesElement) {
            describeSeriesElement(series, seriesEl);
        } else {
            seriesEl.setAttribute('aria-label', '');
        }
    }
}

var SeriesDescriber = {
    describeSeries: describeSeries,
    defaultPointDescriptionFormatter: defaultPointDescriptionFormatter,
    defaultSeriesDescriptionFormatter: defaultSeriesDescriptionFormatter,
    getPointA11yTimeDescription: getPointA11yTimeDescription,
    getPointXDescription: getPointXDescription,
    getPointValueDescription: getPointValueDescription
};

export default SeriesDescriber;
