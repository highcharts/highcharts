/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Place desriptions on a series and its points.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import AnnotationsA11y from '../AnnotationsA11y.js';
var getPointAnnotationTexts = AnnotationsA11y.getPointAnnotationTexts;
import ChartUtilities from '../../Utils/ChartUtilities.js';
var getAxisDescription = ChartUtilities.getAxisDescription, getSeriesFirstPointElement = ChartUtilities.getSeriesFirstPointElement, getSeriesA11yElement = ChartUtilities.getSeriesA11yElement, unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT;
import F from '../../../Core/FormatUtilities.js';
var format = F.format, numberFormat = F.numberFormat;
import HTMLUtilities from '../../Utils/HTMLUtilities.js';
var reverseChildNodes = HTMLUtilities.reverseChildNodes, stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString;
import U from '../../../Core/Utilities.js';
var find = U.find, isNumber = U.isNumber, pick = U.pick, defined = U.defined;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * @private
 */
function findFirstPointWithGraphic(point) {
    var sourcePointIndex = point.index;
    if (!point.series || !point.series.data || !defined(sourcePointIndex)) {
        return null;
    }
    return find(point.series.data, function (p) {
        return !!(p &&
            typeof p.index !== 'undefined' &&
            p.index > sourcePointIndex &&
            p.graphic &&
            p.graphic.element);
    }) || null;
}
/**
 * @private
 */
function shouldAddDummyPoint(point) {
    // Note: Sunburst series use isNull for hidden points on drilldown.
    // Ignore these.
    var isSunburst = point.series && point.series.is('sunburst'), isNull = point.isNull;
    return isNull && !isSunburst;
}
/**
 * @private
 */
function makeDummyElement(point, pos) {
    var renderer = point.series.chart.renderer, dummy = renderer.rect(pos.x, pos.y, 1, 1);
    dummy.attr({
        'class': 'highcharts-a11y-dummy-point',
        fill: 'none',
        opacity: 0,
        'fill-opacity': 0,
        'stroke-opacity': 0
    });
    return dummy;
}
/**
 * @private
 */
function addDummyPointElement(point) {
    var series = point.series, firstPointWithGraphic = findFirstPointWithGraphic(point), firstGraphic = firstPointWithGraphic && firstPointWithGraphic.graphic, parentGroup = firstGraphic ?
        firstGraphic.parentGroup :
        series.graph || series.group, dummyPos = firstPointWithGraphic ? {
        x: pick(point.plotX, firstPointWithGraphic.plotX, 0),
        y: pick(point.plotY, firstPointWithGraphic.plotY, 0)
    } : {
        x: pick(point.plotX, 0),
        y: pick(point.plotY, 0)
    }, dummyElement = makeDummyElement(point, dummyPos);
    if (parentGroup && parentGroup.element) {
        point.graphic = dummyElement;
        point.hasDummyGraphic = true;
        dummyElement.add(parentGroup);
        // Move to correct pos in DOM
        parentGroup.element.insertBefore(dummyElement.element, firstGraphic ? firstGraphic.element : null);
        return dummyElement.element;
    }
}
/**
 * @private
 */
function hasMorePointsThanDescriptionThreshold(series) {
    var chartA11yOptions = series.chart.options.accessibility, threshold = (chartA11yOptions.series.pointDescriptionEnabledThreshold);
    return !!(threshold !== false &&
        series.points &&
        series.points.length >= threshold);
}
/**
 * @private
 */
function shouldSetScreenReaderPropsOnPoints(series) {
    var seriesA11yOptions = series.options.accessibility || {};
    return !hasMorePointsThanDescriptionThreshold(series) &&
        !seriesA11yOptions.exposeAsGroupOnly;
}
/**
 * @private
 */
function shouldSetKeyboardNavPropsOnPoints(series) {
    var chartA11yOptions = series.chart.options.accessibility, seriesNavOptions = chartA11yOptions.keyboardNavigation.seriesNavigation;
    return !!(series.points && (series.points.length <
        seriesNavOptions.pointNavigationEnabledThreshold ||
        seriesNavOptions.pointNavigationEnabledThreshold === false));
}
/**
 * @private
 */
function shouldDescribeSeriesElement(series) {
    var chart = series.chart, chartOptions = chart.options.chart, chartHas3d = chartOptions.options3d && chartOptions.options3d.enabled, hasMultipleSeries = chart.series.length > 1, describeSingleSeriesOption = chart.options.accessibility.series.describeSingleSeries, exposeAsGroupOnlyOption = (series.options.accessibility || {}).exposeAsGroupOnly, noDescribe3D = chartHas3d && hasMultipleSeries;
    return !noDescribe3D && (hasMultipleSeries || describeSingleSeriesOption ||
        exposeAsGroupOnlyOption || hasMorePointsThanDescriptionThreshold(series));
}
/**
 * @private
 */
function pointNumberToString(point, value) {
    var series = point.series, chart = series.chart, a11yPointOptions = chart.options.accessibility.point || {}, seriesA11yPointOptions = series.options.accessibility &&
        series.options.accessibility.point || {}, tooltipOptions = series.tooltipOptions || {}, lang = chart.options.lang;
    if (isNumber(value)) {
        return numberFormat(value, seriesA11yPointOptions.valueDecimals ||
            a11yPointOptions.valueDecimals ||
            tooltipOptions.valueDecimals ||
            -1, lang.decimalPoint, lang.accessibility.thousandsSep || lang.thousandsSep);
    }
    return value;
}
/**
 * @private
 */
function getSeriesDescriptionText(series) {
    var seriesA11yOptions = series.options.accessibility || {}, descOpt = seriesA11yOptions.description;
    return descOpt && series.chart.langFormat('accessibility.series.description', {
        description: descOpt,
        series: series
    }) || '';
}
/**
 * @private
 */
function getSeriesAxisDescriptionText(series, axisCollection) {
    var axis = series[axisCollection];
    return series.chart.langFormat('accessibility.series.' + axisCollection + 'Description', {
        name: getAxisDescription(axis),
        series: series
    });
}
/**
 * Get accessible time description for a point on a datetime axis.
 *
 * @private
 */
function getPointA11yTimeDescription(point) {
    var series = point.series, chart = series.chart, seriesA11yOptions = series.options.accessibility &&
        series.options.accessibility.point || {}, a11yOptions = chart.options.accessibility.point || {}, dateXAxis = series.xAxis && series.xAxis.dateTime;
    if (dateXAxis) {
        var tooltipDateFormat = dateXAxis.getXDateFormat(point.x || 0, chart.options.tooltip.dateTimeLabelFormats), dateFormat = seriesA11yOptions.dateFormatter &&
            seriesA11yOptions.dateFormatter(point) ||
            a11yOptions.dateFormatter && a11yOptions.dateFormatter(point) ||
            seriesA11yOptions.dateFormat ||
            a11yOptions.dateFormat ||
            tooltipDateFormat;
        return chart.time.dateFormat(dateFormat, point.x || 0, void 0);
    }
}
/**
 * @private
 */
function getPointXDescription(point) {
    var timeDesc = getPointA11yTimeDescription(point), xAxis = point.series.xAxis || {}, pointCategory = xAxis.categories && defined(point.category) &&
        ('' + point.category).replace('<br/>', ' '), canUseId = point.id && point.id.indexOf('highcharts-') < 0, fallback = 'x, ' + point.x;
    return point.name || timeDesc || pointCategory ||
        (canUseId ? point.id : fallback);
}
/**
 * @private
 */
function getPointArrayMapValueDescription(point, prefix, suffix) {
    var pre = prefix || '', suf = suffix || '', keyToValStr = function (key) {
        var num = pointNumberToString(point, pick(point[key], point.options[key]));
        return key + ': ' + pre + num + suf;
    }, pointArrayMap = point.series.pointArrayMap;
    return pointArrayMap.reduce(function (desc, key) {
        return desc + (desc.length ? ', ' : '') + keyToValStr(key);
    }, '');
}
/**
 * @private
 */
function getPointValue(point) {
    var series = point.series, a11yPointOpts = series.chart.options.accessibility.point || {}, seriesA11yPointOpts = series.chart.options.accessibility &&
        series.chart.options.accessibility.point || {}, tooltipOptions = series.tooltipOptions || {}, valuePrefix = seriesA11yPointOpts.valuePrefix ||
        a11yPointOpts.valuePrefix ||
        tooltipOptions.valuePrefix ||
        '', valueSuffix = seriesA11yPointOpts.valueSuffix ||
        a11yPointOpts.valueSuffix ||
        tooltipOptions.valueSuffix ||
        '', fallbackKey = (typeof point.value !==
        'undefined' ?
        'value' : 'y'), fallbackDesc = pointNumberToString(point, point[fallbackKey]);
    if (point.isNull) {
        return series.chart.langFormat('accessibility.series.nullPointValue', {
            point: point
        });
    }
    if (series.pointArrayMap) {
        return getPointArrayMapValueDescription(point, valuePrefix, valueSuffix);
    }
    return valuePrefix + fallbackDesc + valueSuffix;
}
/**
 * Return the description for the annotation(s) connected to a point, or
 * empty string if none.
 *
 * @private
 * @param {Highcharts.Point} point
 * The data point to get the annotation info from.
 * @return {string}
 * Annotation description
 */
function getPointAnnotationDescription(point) {
    var chart = point.series.chart;
    var langKey = 'accessibility.series.pointAnnotationsDescription';
    var annotations = getPointAnnotationTexts(point);
    var context = { point: point, annotations: annotations };
    return annotations.length ? chart.langFormat(langKey, context) : '';
}
/**
 * Return string with information about point.
 * @private
 */
function getPointValueDescription(point) {
    var series = point.series, chart = series.chart, seriesA11yOptions = series.options.accessibility, seriesValueDescFormat = seriesA11yOptions && seriesA11yOptions.point &&
        seriesA11yOptions.point.valueDescriptionFormat, pointValueDescriptionFormat = seriesValueDescFormat ||
        chart.options.accessibility.point.valueDescriptionFormat, showXDescription = pick(series.xAxis &&
        series.xAxis.options.accessibility &&
        series.xAxis.options.accessibility.enabled, !chart.angular), xDesc = showXDescription ? getPointXDescription(point) : '', context = {
        point: point,
        index: defined(point.index) ? (point.index + 1) : '',
        xDescription: xDesc,
        value: getPointValue(point),
        separator: showXDescription ? ', ' : ''
    };
    return format(pointValueDescriptionFormat, context, chart);
}
/**
 * Return string with information about point.
 * @private
 */
function defaultPointDescriptionFormatter(point) {
    var series = point.series, shouldExposeSeriesName = series.chart.series.length > 1 ||
        series.options.name, valText = getPointValueDescription(point), description = point.options && point.options.accessibility &&
        point.options.accessibility.description, userDescText = description ? ' ' + description : '', seriesNameText = shouldExposeSeriesName ? ' ' + series.name + '.' : '', annotationsDesc = getPointAnnotationDescription(point), pointAnnotationsText = annotationsDesc ? ' ' + annotationsDesc : '';
    point.accessibility = point.accessibility || {};
    point.accessibility.valueDescription = valText;
    return valText + userDescText + seriesNameText + pointAnnotationsText;
}
/**
 * Set a11y props on a point element
 * @private
 * @param {Highcharts.Point} point
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} pointElement
 */
function setPointScreenReaderAttribs(point, pointElement) {
    var series = point.series, a11yPointOptions = series.chart.options.accessibility.point || {}, seriesPointA11yOptions = series.options.accessibility &&
        series.options.accessibility.point || {}, label = stripHTMLTags(seriesPointA11yOptions.descriptionFormatter &&
        seriesPointA11yOptions.descriptionFormatter(point) ||
        a11yPointOptions.descriptionFormatter &&
            a11yPointOptions.descriptionFormatter(point) ||
        defaultPointDescriptionFormatter(point));
    pointElement.setAttribute('role', 'img');
    pointElement.setAttribute('aria-label', label);
}
/**
 * Add accessible info to individual point elements of a series
 * @private
 * @param {Highcharts.Series} series
 */
function describePointsInSeries(series) {
    var setScreenReaderProps = shouldSetScreenReaderPropsOnPoints(series), setKeyboardProps = shouldSetKeyboardNavPropsOnPoints(series);
    if (setScreenReaderProps || setKeyboardProps) {
        series.points.forEach(function (point) {
            var pointEl = point.graphic && point.graphic.element ||
                shouldAddDummyPoint(point) && addDummyPointElement(point);
            var pointA11yDisabled = (point.options &&
                point.options.accessibility &&
                point.options.accessibility.enabled === false);
            if (pointEl) {
                // We always set tabindex, as long as we are setting props.
                // When setting tabindex, also remove default outline to
                // avoid ugly border on click.
                pointEl.setAttribute('tabindex', '-1');
                if (!series.chart.styledMode) {
                    pointEl.style.outline = 'none';
                }
                if (setScreenReaderProps && !pointA11yDisabled) {
                    setPointScreenReaderAttribs(point, pointEl);
                }
                else {
                    pointEl.setAttribute('aria-hidden', true);
                }
            }
        });
    }
}
/**
 * Return string with information about series.
 * @private
 */
function defaultSeriesDescriptionFormatter(series) {
    var chart = series.chart, chartTypes = chart.types || [], description = getSeriesDescriptionText(series), shouldDescribeAxis = function (coll) {
        return chart[coll] && chart[coll].length > 1 && series[coll];
    }, xAxisInfo = getSeriesAxisDescriptionText(series, 'xAxis'), yAxisInfo = getSeriesAxisDescriptionText(series, 'yAxis'), summaryContext = {
        name: series.name || '',
        ix: series.index + 1,
        numSeries: chart.series && chart.series.length,
        numPoints: series.points && series.points.length,
        series: series
    }, combinationSuffix = chartTypes.length > 1 ? 'Combination' : '', summary = chart.langFormat('accessibility.series.summary.' + series.type + combinationSuffix, summaryContext) || chart.langFormat('accessibility.series.summary.default' + combinationSuffix, summaryContext);
    return summary + (description ? ' ' + description : '') + (shouldDescribeAxis('yAxis') ? ' ' + yAxisInfo : '') + (shouldDescribeAxis('xAxis') ? ' ' + xAxisInfo : '');
}
/**
 * Set a11y props on a series element
 * @private
 * @param {Highcharts.Series} series
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} seriesElement
 */
function describeSeriesElement(series, seriesElement) {
    var seriesA11yOptions = series.options.accessibility || {}, a11yOptions = series.chart.options.accessibility, landmarkVerbosity = a11yOptions.landmarkVerbosity;
    // Handle role attribute
    if (seriesA11yOptions.exposeAsGroupOnly) {
        seriesElement.setAttribute('role', 'img');
    }
    else if (landmarkVerbosity === 'all') {
        seriesElement.setAttribute('role', 'region');
    } /* else do not add role */
    seriesElement.setAttribute('tabindex', '-1');
    if (!series.chart.styledMode) {
        // Don't show browser outline on click, despite tabindex
        seriesElement.style.outline = 'none';
    }
    seriesElement.setAttribute('aria-label', stripHTMLTags(a11yOptions.series.descriptionFormatter &&
        a11yOptions.series.descriptionFormatter(series) ||
        defaultSeriesDescriptionFormatter(series)));
}
/**
 * Put accessible info on series and points of a series.
 * @param {Highcharts.Series} series The series to add info on.
 */
function describeSeries(series) {
    var chart = series.chart, firstPointEl = getSeriesFirstPointElement(series), seriesEl = getSeriesA11yElement(series), is3d = chart.is3d && chart.is3d();
    if (seriesEl) {
        // For some series types the order of elements do not match the
        // order of points in series. In that case we have to reverse them
        // in order for AT to read them out in an understandable order.
        // Due to z-index issues we can not do this for 3D charts.
        if (seriesEl.lastChild === firstPointEl && !is3d) {
            reverseChildNodes(seriesEl);
        }
        describePointsInSeries(series);
        unhideChartElementFromAT(chart, seriesEl);
        if (shouldDescribeSeriesElement(series)) {
            describeSeriesElement(series, seriesEl);
        }
        else {
            seriesEl.setAttribute('aria-label', '');
        }
    }
}
/* *
 *
 *  Default Export
 *
 * */
var SeriesDescriber = {
    defaultPointDescriptionFormatter: defaultPointDescriptionFormatter,
    defaultSeriesDescriptionFormatter: defaultSeriesDescriptionFormatter,
    describeSeries: describeSeries
};
export default SeriesDescriber;
