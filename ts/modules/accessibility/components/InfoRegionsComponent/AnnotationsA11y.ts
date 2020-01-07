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
    const labelText = label.graphic?.text?.textStr || '';

    return labelText;
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

    return labels.map((label: any): string =>
        `<li>${getAnnotationLabelDescription(label)}</li>`);
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
    return `
        Chart annotations:
        <ul>
            ${annotationItems.join(' ')}
        </ul>
    `;
}

const AnnotationsA11y = {
    getAnnotationsInfoHTML,
    getAnnotationItems,
    getAnnotationLabelDescription
};

export default AnnotationsA11y;
