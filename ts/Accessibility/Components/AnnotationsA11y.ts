/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Annotations accessibility code.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Accessibility from '../Accessibility';
import type Annotation from '../../Extensions/Annotations/Annotation';
import type AnnotationChart from '../../Extensions/Annotations/AnnotationChart';
import type { AnnotationPoint } from '../../Extensions/Annotations/AnnotationSeries';
import type {
    ControllableLabelType
} from '../../Extensions/Annotations/Controllables/ControllableType';
import type Point from '../../Core/Series/Point';

import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    escapeStringForHTML,
    stripHTMLTagsFromString
} = HTMLUtilities;


/* *
 *
 *  Functions
 *
 * */


/**
 * Get list of all annotation labels in the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {Array<object>} The labels, or empty array if none.
 */
function getChartAnnotationLabels(
    chart: AnnotationChart
): Array<ControllableLabelType> {
    const annotations = chart.annotations || [];

    return annotations.reduce((
        acc: Array<ControllableLabelType>,
        cur: Annotation
    ): Array<ControllableLabelType> => {
        if (
            cur.options &&
            cur.options.visible !== false
        ) {
            acc = acc.concat(cur.labels);
        }
        return acc;
    }, []);
}


/**
 * Get the text of an annotation label.
 *
 * @private
 * @param {Object} label The annotation label object
 * @return {string} The text in the label.
 */
function getLabelText(label: ControllableLabelType): string {
    return (
        (
            label.options &&
            label.options.accessibility &&
            label.options.accessibility.description
        ) ||
        (
            label.graphic &&
            label.graphic.text &&
            label.graphic.text.textStr
        ) ||
        ''
    );
}


/**
 * Describe an annotation label.
 *
 * @private
 * @param {Object} label The annotation label object to describe
 * @return {string} The description for the label.
 */
function getAnnotationLabelDescription(
    label: ControllableLabelType
): string {
    const a11yDesc = (
        label.options &&
        label.options.accessibility &&
        label.options.accessibility.description
    );

    if (a11yDesc) {
        return a11yDesc;
    }

    const chart = label.chart;
    const labelText = getLabelText(label);
    const points = label.points as Array<Accessibility.PointComposition>;
    const getAriaLabel = (point: Point): string => (
        point.graphic &&
        point.graphic.element &&
        point.graphic.element.getAttribute('aria-label') ||
        ''
    );
    const getValueDesc = (point: Accessibility.PointComposition): string => {
        const valDesc = (
            point.accessibility &&
            point.accessibility.valueDescription ||
            getAriaLabel(point)
        );
        const seriesName = (
            point &&
            point.series.name ||
            ''
        );
        return (seriesName ? seriesName + ', ' : '') + 'data point ' + valDesc;
    };
    const pointValueDescriptions = points
        .filter((p): boolean => !!p.graphic) // Filter out mock points
        .map(getValueDesc)
        // Filter out points we can't describe
        .filter((desc: string): boolean => !!desc);
    const numPoints = pointValueDescriptions.length;
    const pointsSelector = numPoints > 1 ?
        'MultiplePoints' : numPoints ?
            'SinglePoint' : 'NoPoints';
    const langFormatStr = (
        'accessibility.screenReaderSection.annotations.description' +
        pointsSelector
    );
    const context = {
        annotationText: labelText,
        annotation: label,
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
function getAnnotationListItems(chart: AnnotationChart): string[] {
    const labels = getChartAnnotationLabels(chart);

    return labels.map((label): string => {
        const desc = escapeStringForHTML(
            stripHTMLTagsFromString(
                getAnnotationLabelDescription(label),
                chart.renderer.forExport
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
function getAnnotationsInfoHTML(chart: AnnotationChart): string {
    const annotations = chart.annotations;

    if (!(annotations && annotations.length)) {
        return '';
    }

    const annotationItems = getAnnotationListItems(chart);
    return `<ul style="list-style-type: none">${annotationItems.join(' ')}</ul>`;
}


/**
 * Return the texts for the annotation(s) connected to a point, or empty array
 * if none.
 *
 * @private
 * @param {Highcharts.Point} point The data point to get the annotation info from.
 * @return {Array<string>} Annotation texts
 */
function getPointAnnotationTexts(point: AnnotationPoint): Array<string> {
    const labels = getChartAnnotationLabels(point.series.chart);
    const pointLabels = labels
        .filter((label): boolean => label.points.indexOf(point) > -1);

    if (!pointLabels.length) {
        return [];
    }

    return pointLabels.map((label): string => `${getLabelText(label)}`);
}


/* *
 *
 *  Default Export
 *
 * */


const AnnotationsA11y = {
    getAnnotationsInfoHTML,
    getAnnotationLabelDescription,
    getAnnotationListItems,
    getPointAnnotationTexts
};

export default AnnotationsA11y;
