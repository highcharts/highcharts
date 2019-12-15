/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Utils for dealing with charts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import HTMLUtilities from './htmlUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString;

import H from '../../../parts/Globals.js';
const find = H.find;


/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface A11yChartUtilities {
            getChartTitle(chart: Chart): string;
            getAxisDescription(axis: Axis): string;
            getPointFromXY(
                series: Array<Series>,
                x: number,
                y: number
            ): (Point|undefined);
            getSeriesFirstPointElement(
                series: Series
            ): (HTMLDOMElement|SVGDOMElement|undefined);
            getSeriesFromName(chart: Chart, name: string): Array<Series>;
            getSeriesA11yElement(
                series: Series
            ): (HTMLDOMElement|SVGDOMElement|undefined);
            unhideChartElementFromAT(
                chart: Chart,
                element: (HTMLDOMElement|SVGDOMElement)
            ): void;
            hideSeriesFromAT(series: Series): void;
        }
    }
}

/* eslint-disable valid-jsdoc */

/**
 * @return {string}
 */
function getChartTitle(chart: Highcharts.AccessibilityChart): string {
    return stripHTMLTags(
        chart.options.title.text ||
        chart.langFormat(
            'accessibility.defaultChartTitle', { chart: chart }
        )
    );
}


/**
 * @param {Highcharts.Axis} axis
 * @return {string}
 */
function getAxisDescription(axis: Highcharts.Axis): string {
    return stripHTMLTags(
        axis && (
            axis.userOptions && axis.userOptions.accessibility &&
                axis.userOptions.accessibility.description ||
            axis.axisTitle && axis.axisTitle.textStr ||
            axis.options.id ||
            axis.categories && 'categories' ||
            axis.isDatetimeAxis && 'Time' ||
            'values'
        )
    );
}


/**
 * Get the DOM element for the first point in the series.
 * @private
 * @param {Highcharts.Series} series
 * The series to get element for.
 * @return {Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement|undefined}
 * The DOM element for the point.
 */
function getSeriesFirstPointElement(
    series: Highcharts.Series
): (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement|undefined) {
    if (
        series.points &&
        series.points.length &&
        series.points[0].graphic
    ) {
        return series.points[0].graphic.element;
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
function getSeriesA11yElement(
    series: Highcharts.Series
): (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement|undefined) {
    var firstPointEl = getSeriesFirstPointElement(series);
    return (
        firstPointEl &&
        (firstPointEl.parentNode as any) || series.graph &&
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
 * @return {void}
 */
function unhideChartElementFromAT(
    chart: Highcharts.Chart,
    element: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement)
): void {
    element.setAttribute('aria-hidden', false);
    if (element === chart.renderTo || !element.parentNode) {
        return;
    }

    // Hide siblings unless their hidden state is already explicitly set
    Array.prototype.forEach.call(
        element.parentNode.childNodes,
        function (
            node: (Highcharts.HTMLDOMElement|Highcharts.SVGDOMElement)
        ): void {
            if (!node.hasAttribute('aria-hidden')) {
                node.setAttribute('aria-hidden', true);
            }
        }
    );
    // Repeat for parent
    unhideChartElementFromAT(chart, element.parentNode as any);
}


/**
 * Hide series from screen readers.
 * @private
 * @param {Highcharts.Series} series
 * The series to hide
 * @return {void}
 */
function hideSeriesFromAT(series: Highcharts.Series): void {
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
function getSeriesFromName(
    chart: Highcharts.Chart,
    name: string
): Array<Highcharts.Series> {
    if (!name) {
        return chart.series;
    }

    return (chart.series || []).filter(function (
        s: Highcharts.Series
    ): boolean {
        return s.name === name;
    });
}


/**
 * Get point in a series from x/y values.
 * @private
 * @param {Array<Highcharts.Series>} series
 * @param {number} x
 * @param {number} y
 * @return {Highcharts.Point|undefined}
 */
function getPointFromXY(
    series: Array<Highcharts.Series>,
    x: number,
    y: number
): (Highcharts.Point|undefined) {
    var i = series.length,
        res;

    while (i--) {
        res = find(series[i].points || [], function (
            p: Highcharts.Point
        ): boolean {
            return p.x === x && p.y === y;
        });
        if (res) {
            return res;
        }
    }
}


var ChartUtilities: Highcharts.A11yChartUtilities = {
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
