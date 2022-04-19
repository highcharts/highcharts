/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Utils for dealing with charts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../Core/Globals.js';
var doc = H.doc;
import HU from './HTMLUtilities.js';
var stripHTMLTags = HU.stripHTMLTagsFromString;
import U from '../../Core/Utilities.js';
var defined = U.defined, find = U.find, fireEvent = U.fireEvent;
/* *
 *
 *  Functions
 *
 * */
/* eslint-disable valid-jsdoc */
/**
 * Fire an event on an element that is either wrapped by Highcharts,
 * or a DOM element.
 * @private
 */
function fireEventOnWrappedOrUnwrappedElement(el, eventObject) {
    var type = eventObject.type;
    var hcEvents = el.hcEvents;
    if (doc.createEvent &&
        (el.dispatchEvent || el.fireEvent)) {
        if (el.dispatchEvent) {
            el.dispatchEvent(eventObject);
        }
        else {
            el.fireEvent(type, eventObject);
        }
    }
    else if (hcEvents && hcEvents[type]) {
        fireEvent(el, type, eventObject);
    }
    else if (el.element) {
        fireEventOnWrappedOrUnwrappedElement(el.element, eventObject);
    }
}
/**
 * @private
 */
function getChartTitle(chart) {
    return stripHTMLTags(chart.options.title.text ||
        chart.langFormat('accessibility.defaultChartTitle', { chart: chart }));
}
/**
 * Return string with the axis name/title.
 * @private
 */
function getAxisDescription(axis) {
    return axis && (axis.userOptions && axis.userOptions.accessibility &&
        axis.userOptions.accessibility.description ||
        axis.axisTitle && axis.axisTitle.textStr ||
        axis.options.id ||
        axis.categories && 'categories' ||
        axis.dateTime && 'Time' ||
        'values');
}
/**
 * Return string with text description of the axis range.
 * @private
 * @param {Highcharts.Axis} axis
 * The axis to get range desc of.
 * @return {string}
 * A string with the range description for the axis.
 */
function getAxisRangeDescription(axis) {
    var axisOptions = axis.options || {};
    // Handle overridden range description
    if (axisOptions.accessibility &&
        typeof axisOptions.accessibility.rangeDescription !== 'undefined') {
        return axisOptions.accessibility.rangeDescription;
    }
    // Handle category axes
    if (axis.categories) {
        return getCategoryAxisRangeDesc(axis);
    }
    // Use time range, not from-to?
    if (axis.dateTime && (axis.min === 0 || axis.dataMin === 0)) {
        return getAxisTimeLengthDesc(axis);
    }
    // Just use from and to.
    // We have the range and the unit to use, find the desc format
    return getAxisFromToDescription(axis);
}
/**
 * Describe the range of a category axis.
 * @private
 */
function getCategoryAxisRangeDesc(axis) {
    var chart = axis.chart;
    if (axis.dataMax && axis.dataMin) {
        return chart.langFormat('accessibility.axis.rangeCategories', {
            chart: chart,
            axis: axis,
            numCategories: axis.dataMax - axis.dataMin + 1
        });
    }
    return '';
}
/**
 * Describe the length of the time window shown on an axis.
 * @private
 */
function getAxisTimeLengthDesc(axis) {
    var chart = axis.chart, range = {};
    var rangeUnit = 'Seconds';
    range.Seconds = ((axis.max || 0) - (axis.min || 0)) / 1000;
    range.Minutes = range.Seconds / 60;
    range.Hours = range.Minutes / 60;
    range.Days = range.Hours / 24;
    ['Minutes', 'Hours', 'Days'].forEach(function (unit) {
        if (range[unit] > 2) {
            rangeUnit = unit;
        }
    });
    var rangeValue = range[rangeUnit].toFixed(rangeUnit !== 'Seconds' &&
        rangeUnit !== 'Minutes' ? 1 : 0 // Use decimals for days/hours
    );
    // We have the range and the unit to use, find the desc format
    return chart.langFormat('accessibility.axis.timeRange' + rangeUnit, {
        chart: chart,
        axis: axis,
        range: rangeValue.replace('.0', '')
    });
}
/**
 * Describe an axis from-to range.
 * @private
 */
function getAxisFromToDescription(axis) {
    var chart = axis.chart, options = chart.options, dateRangeFormat = (options &&
        options.accessibility &&
        options.accessibility.screenReaderSection.axisRangeDateFormat ||
        ''), format = function (axisKey) {
        return axis.dateTime ? chart.time.dateFormat(dateRangeFormat, axis[axisKey]) : axis[axisKey];
    };
    return chart.langFormat('accessibility.axis.rangeFromTo', {
        chart: chart,
        axis: axis,
        rangeFrom: format('min'),
        rangeTo: format('max')
    });
}
/**
 * Get the DOM element for the first point in the series.
 * @private
 * @param {Highcharts.Series} series
 * The series to get element for.
 * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement|undefined}
 * The DOM element for the point.
 */
function getSeriesFirstPointElement(series) {
    if (series.points && series.points.length) {
        var firstPointWithGraphic = find(series.points, function (p) { return !!p.graphic; });
        return (firstPointWithGraphic &&
            firstPointWithGraphic.graphic &&
            firstPointWithGraphic.graphic.element);
    }
}
/**
 * Get the DOM element for the series that we put accessibility info on.
 * @private
 * @param {Highcharts.Series} series
 * The series to get element for.
 * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement|undefined}
 * The DOM element for the series
 */
function getSeriesA11yElement(series) {
    var firstPointEl = getSeriesFirstPointElement(series);
    return (firstPointEl &&
        firstPointEl.parentNode || series.graph &&
        series.graph.element || series.group &&
        series.group.element); // Could be tracker series depending on series type
}
/**
 * Remove aria-hidden from element. Also unhides parents of the element, and
 * hides siblings that are not explicitly unhidden.
 * @private
 */
function unhideChartElementFromAT(chart, element) {
    element.setAttribute('aria-hidden', false);
    if (element === chart.renderTo ||
        !element.parentNode ||
        element.parentNode === doc.body // #16126: Full screen printing
    ) {
        return;
    }
    // Hide siblings unless their hidden state is already explicitly set
    Array.prototype.forEach.call(element.parentNode.childNodes, function (node) {
        if (!node.hasAttribute('aria-hidden')) {
            node.setAttribute('aria-hidden', true);
        }
    });
    // Repeat for parent
    unhideChartElementFromAT(chart, element.parentNode);
}
/**
 * Hide series from screen readers.
 * @private
 */
function hideSeriesFromAT(series) {
    var seriesEl = getSeriesA11yElement(series);
    if (seriesEl) {
        seriesEl.setAttribute('aria-hidden', true);
    }
}
/**
 * Get series objects by series name.
 * @private
 */
function getSeriesFromName(chart, name) {
    if (!name) {
        return chart.series;
    }
    return (chart.series || []).filter(function (s) {
        return s.name === name;
    });
}
/**
 * Get point in a series from x/y values.
 * @private
 */
function getPointFromXY(series, x, y) {
    var i = series.length, res;
    while (i--) {
        res = find(series[i].points || [], function (p) {
            return p.x === x && p.y === y;
        });
        if (res) {
            return res;
        }
    }
}
/**
 * Get relative position of point on an x/y axis from 0 to 1.
 * @private
 */
function getRelativePointAxisPosition(axis, point) {
    if (!defined(axis.dataMin) || !defined(axis.dataMax)) {
        return 0;
    }
    var axisStart = axis.toPixels(axis.dataMin), axisEnd = axis.toPixels(axis.dataMax), 
    // We have to use pixel position because of axis breaks, log axis etc.
    positionProp = axis.coll === 'xAxis' ? 'x' : 'y', pointPos = axis.toPixels(point[positionProp] || 0);
    return (pointPos - axisStart) / (axisEnd - axisStart);
}
/**
 * Get relative position of point on an x/y axis from 0 to 1.
 * @private
 */
function scrollToPoint(point) {
    var xAxis = point.series.xAxis, yAxis = point.series.yAxis, axis = (xAxis && xAxis.scrollbar ? xAxis : yAxis), scrollbar = (axis && axis.scrollbar);
    if (scrollbar && defined(scrollbar.to) && defined(scrollbar.from)) {
        var range = scrollbar.to - scrollbar.from;
        var pos = getRelativePointAxisPosition(axis, point);
        scrollbar.updatePosition(pos - range / 2, pos + range / 2);
        fireEvent(scrollbar, 'changed', {
            from: scrollbar.from,
            to: scrollbar.to,
            trigger: 'scrollbar',
            DOMEvent: null
        });
    }
}
/* *
 *
 *  Default Export
 *
 * */
var ChartUtilities = {
    fireEventOnWrappedOrUnwrappedElement: fireEventOnWrappedOrUnwrappedElement,
    getChartTitle: getChartTitle,
    getAxisDescription: getAxisDescription,
    getAxisRangeDescription: getAxisRangeDescription,
    getPointFromXY: getPointFromXY,
    getSeriesFirstPointElement: getSeriesFirstPointElement,
    getSeriesFromName: getSeriesFromName,
    getSeriesA11yElement: getSeriesA11yElement,
    unhideChartElementFromAT: unhideChartElementFromAT,
    hideSeriesFromAT: hideSeriesFromAT,
    scrollToPoint: scrollToPoint
};
export default ChartUtilities;
