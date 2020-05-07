/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Annotations accessibility code.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../../../annotations/annotations.src';
import U from '../../../parts/Utilities.js';
const {
    inArray
} = U;

import HTMLUtilities from '../utils/htmlUtilities.js';
const {
    escapeStringForHTML,
    stripHTMLTagsFromString
} = HTMLUtilities;


/**
 * Get list of all annotation labels in the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {Array<object>} The labels, or empty array if none.
 */
function getChartAnnotationLabels(
    chart: Highcharts.AnnotationChart
): Array<Highcharts.AnnotationLabelType> {
    const annotations = chart.annotations || [];

    return annotations.reduce((
        acc: Array<Highcharts.AnnotationLabelType>,
        cur: Annotation
    ): Array<Highcharts.AnnotationLabelType> => {
        if (cur.options?.visible !== false) {
            acc = acc.concat(cur.labels);
        }
        return acc;
    }, []);
}


/**
 * Get the text of an annotation label.
 *
 * @private
 * @param {object} label The annotation label object
 * @return {string} The text in the label.
 */
function getLabelText(label: Highcharts.AnnotationLabelType): string {
    const a11yDesc = label.options?.accessibility?.description;
    return a11yDesc ? a11yDesc : label.graphic?.text?.textStr || '';
}


/**
 * Describe an annotation label.
 *
 * @private
 * @param {object} label The annotation label object to describe
 * @return {string} The description for the label.
 */
function getAnnotationLabelDescription(label: Highcharts.AnnotationLabelType): string {
    const a11yDesc = label.options?.accessibility?.description;
    if (a11yDesc) {
        return a11yDesc;
    }

    const chart = label.chart;
    const labelText = getLabelText(label);
    const points = label.points as Array<Highcharts.AccessibilityPoint>;
    const getAriaLabel = (point: Highcharts.Point): string =>
        point?.graphic?.element?.getAttribute('aria-label') || '';
    const getValueDesc = (point: Highcharts.AccessibilityPoint): string => {
        const valDesc = point?.accessibility?.valueDescription || getAriaLabel(point);
        const seriesName = point?.series.name || '';
        return (seriesName ? seriesName + ', ' : '') + 'data point ' + valDesc;
    };
    const pointValueDescriptions = points
        .filter((p): boolean => !!p.graphic) // Filter out mock points
        .map(getValueDesc)
        .filter((desc: string): boolean => !!desc); // Filter out points we can't describe
    const numPoints = pointValueDescriptions.length;
    const pointsSelector = numPoints > 1 ? 'MultiplePoints' : numPoints ? 'SinglePoint' : 'NoPoints';
    const langFormatStr = 'accessibility.screenReaderSection.annotations.description' + pointsSelector;
    const context = {
        annotationText: labelText,
        numPoints: numPoints,
        annotationPoint: pointValueDescriptions[0],
        additionalAnnotationPoints: pointValueDescriptions.slice(1)
    };

    return chart.langFormat(langFormatStr, context);
}


/**
 * Return array of HTML strings for each annotation label in the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {Array<string>} Array of strings with HTML content for each annotation label.
 */
function getAnnotationListItems(chart: Highcharts.AnnotationChart): string[] {
    const labels = getChartAnnotationLabels(chart);

    return labels.map((label): string => {
        const desc = escapeStringForHTML(
            stripHTMLTagsFromString(
                getAnnotationLabelDescription(label)
            )
        );
        return desc ? `<li>${desc}</li>` : '';
    });
}


/**
 * Return the annotation info for a chart as string.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {string} String with HTML content or empty string if no annotations.
 */
function getAnnotationsInfoHTML(chart: Highcharts.AnnotationChart): string {
    const annotations = chart.annotations;

    if (!(annotations && annotations.length)) {
        return '';
    }

    const annotationItems = getAnnotationListItems(chart);
    return `<ul>${annotationItems.join(' ')}</ul>`;
}


/**
 * Return the texts for the annotation(s) connected to a point, or empty array
 * if none.
 *
 * @private
 * @param {Highcharts.Point} point The data point to get the annotation info from.
 * @return {Array<string>} Annotation texts
 */
function getPointAnnotationTexts(point: Highcharts.AnnotationPoint): Array<string> {
    const labels = getChartAnnotationLabels(point.series.chart);
    const pointLabels = labels
        .filter((label): boolean => inArray(point, label.points) > -1);

    if (!pointLabels.length) {
        return [];
    }

    return pointLabels.map((label): string => `${getLabelText(label)}`);
}


const AnnotationsA11y = {
    getAnnotationsInfoHTML,
    getAnnotationLabelDescription,
    getAnnotationListItems,
    getPointAnnotationTexts
};

export default AnnotationsA11y;
