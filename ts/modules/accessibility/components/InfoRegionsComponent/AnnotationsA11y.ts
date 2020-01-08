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

/**
 * Describe an annotation label.
 *
 * @private
 * @param {object} label The annotation label object to describe
 * @return {string} The description for the label.
 */
function getAnnotationLabelDescription(label: any): string {
    const chart = label.chart;
    const labelText = label.graphic?.text?.textStr || '';
    const points = label.points;
    const getAriaLabel = (point: Highcharts.Point): string =>
        point?.graphic?.element?.getAttribute('aria-label') || '';
    const ariaLabels = points.map(getAriaLabel)
        .filter((label: string): boolean => !!label);
    const numPoints = ariaLabels.length;
    const pointsSelector = numPoints > 1 ? 'MultiplePoints' : numPoints ? 'SinglePoint' : 'NoPoints';
    const langFormatStr = 'accessibility.screenReaderSection.annotations.description' + pointsSelector;
    const context = {
        annotationText: labelText,
        numPoints: numPoints,
        annotationPoints: ariaLabels,
        annotationPoint: ariaLabels[0]
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
function getAnnotationItems(chart: Highcharts.Chart): string[] {
    const annotations = (chart as any).annotations || [];
    const labels = annotations.reduce((acc: any, cur: any): any => {
        if (cur.options?.visible !== false) {
            acc = acc.concat(cur.labels);
        }
        return acc;
    }, []);

    return labels.map((label: any): string => {
        const desc = getAnnotationLabelDescription(label);
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
function getAnnotationsInfoHTML(chart: Highcharts.Chart): string {
    const annotations = (chart as any).annotations;

    if (!(annotations && annotations.length)) {
        return '';
    }

    const annotationItems = getAnnotationItems(chart);
    return `<ul>${annotationItems.join(' ')}</ul>`;
}

const AnnotationsA11y = {
    getAnnotationsInfoHTML,
    getAnnotationItems,
    getAnnotationLabelDescription
};

export default AnnotationsA11y;
