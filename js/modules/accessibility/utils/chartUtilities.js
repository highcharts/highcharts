/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Utils for dealing with charts.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import HTMLUtilities from './htmlUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString;


/**
 * @return {string}
 */
function getChartTitle(chart) {
    return stripHTMLTags(chart.options.title.text || chart.langFormat(
        'accessibility.defaultChartTitle', { chart: chart }
    ));
}


/**
 * @param {Highcharts.Axis} axis
 * @return {string}
 */
function getAxisDescription(axis) {
    return axis && (
        axis.userOptions && axis.userOptions.accessibility &&
            axis.userOptions.accessibility.description ||
        axis.axisTitle && axis.axisTitle.textStr ||
        axis.options.id ||
        axis.categories && 'categories' ||
        axis.isDatetimeAxis && 'Time' ||
        'values'
    );
}


/**
 * Get the DOM element for the first point in the series.
 * @private
 * @param {Highcharts.Series} series The series to get element for.
 * @return {Highcharts.SVGDOMElement} The DOM element for the point.
 */
function getSeriesFirstPointElement(series) {
    return (
        series.points &&
        series.points.length &&
        series.points[0].graphic &&
        series.points[0].graphic.element
    );
}


/**
 * Get the DOM element for the series that we put accessibility info on.
 * @private
 * @param {Highcharts.Series} series The series to get element for.
 * @return {Highcharts.SVGDOMElement} The DOM element for the series
 */
function getSeriesA11yElement(series) {
    var firstPointEl = getSeriesFirstPointElement(series);
    return (
        firstPointEl &&
        firstPointEl.parentNode || series.graph &&
        series.graph.element || series.group &&
        series.group.element
    ); // Could be tracker series depending on series type
}


/**
 * Remove aria-hidden from element. Also unhides parents of the element, and
 * hides siblings that are not explicitly unhidden.
 * @private
 * @param {Highcharts.Chart} chart
 * @param {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement} element
 */
function unhideChartElementFromAT(chart, element) {
    element.setAttribute('aria-hidden', false);
    if (element === chart.renderTo || !element.parentNode) {
        return;
    }

    // Hide siblings unless their hidden state is already explicitly set
    Array.prototype.forEach.call(
        element.parentNode.childNodes,
        function (node) {
            if (!node.hasAttribute('aria-hidden')) {
                node.setAttribute('aria-hidden', true);
            }
        }
    );
    // Repeat for parent
    unhideChartElementFromAT(chart, element.parentNode);
}


/**
 * Hide series from screen readers.
 * @private
 * @param {Highcharts.Series} series The series to hide
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
 * @param {Highcharts.Chart} chart
 * @param {string} name
 * @return {Array<Highcharts.Series>}
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
 * @param {Highcharts.Series} series
 * @param {number} x
 * @param {number} y
 * @return {Highcharts.Point}
 */
function getPointFromXY(series, x, y) {
    var i = series.length,
        res;

    while (i--) {
        res = (series[i].points || []).find(function (p) {
            return p.x === x && p.y === y;
        });
        if (res) {
            return res;
        }
    }
}


var ChartUtilities = {
    getChartTitle: getChartTitle,
    getAxisDescription: getAxisDescription,
    getPointFromXY: getPointFromXY,
    getSeriesFirstPointElement: getSeriesFirstPointElement,
    getSeriesFromName: getSeriesFromName,
    getSeriesA11yElement: getSeriesA11yElement,
    unhideChartElementFromAT: unhideChartElementFromAT,
    hideSeriesFromAT: hideSeriesFromAT
};

export default ChartUtilities;
