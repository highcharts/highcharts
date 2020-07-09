/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Utils for dealing with charts.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Axis from '../../../Core/Axis/Axis';
import type Chart from '../../../Core/Chart/Chart';
import type Point from '../../../Core/Series/Point';
import HTMLUtilities from './htmlUtilities.js';
const {
    stripHTMLTagsFromString: stripHTMLTags
} = HTMLUtilities;
import U from '../../../Core/Utilities.js';
const {
    defined,
    find,
    fireEvent
} = U;


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
            scrollToPoint(point: Point): void;
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
            axis.dateTime && 'Time' ||
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
 */
function unhideChartElementFromAT(
    chart: Chart,
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
    chart: Chart,
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
): (Point|undefined) {
    var i = series.length,
        res;

    while (i--) {
        res = find(series[i].points || [], function (p: Point): boolean {
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
 * @param {Highcharts.Axis} axis
 * @param {Highcharts.Point} point
 * @return {number}
 */
function getRelativePointAxisPosition(axis: Axis, point: Point): number {
    if (!defined(axis.dataMin) || !defined(axis.dataMax)) {
        return 0;
    }

    const axisStart = axis.toPixels(axis.dataMin);
    const axisEnd = axis.toPixels(axis.dataMax);
    // We have to use pixel position because of axis breaks, log axis etc.
    const positionProp = axis.coll === 'xAxis' ? 'x' : 'y';
    const pointPos = axis.toPixels(point[positionProp] || 0);

    return (pointPos - axisStart) / (axisEnd - axisStart);
}


/**
 * Get relative position of point on an x/y axis from 0 to 1.
 * @private
 * @param {Highcharts.Point} point
 */
function scrollToPoint(point: Point): void {
    const xAxis = point.series.xAxis;
    const yAxis = point.series.yAxis;
    const axis = xAxis?.scrollbar ? xAxis : yAxis;
    const scrollbar = axis?.scrollbar;

    if (scrollbar && defined(scrollbar.to) && defined(scrollbar.from)) {
        const range = scrollbar.to - scrollbar.from;
        const pos = getRelativePointAxisPosition(axis, point);

        scrollbar.updatePosition(
            pos - range / 2,
            pos + range / 2
        );

        fireEvent(scrollbar, 'changed', {
            from: scrollbar.from,
            to: scrollbar.to,
            trigger: 'scrollbar',
            DOMEvent: null
        });
    }
}


const ChartUtilities: Highcharts.A11yChartUtilities = {
    getChartTitle,
    getAxisDescription,
    getPointFromXY,
    getSeriesFirstPointElement,
    getSeriesFromName,
    getSeriesA11yElement,
    unhideChartElementFromAT,
    hideSeriesFromAT,
    scrollToPoint
};

export default ChartUtilities;
