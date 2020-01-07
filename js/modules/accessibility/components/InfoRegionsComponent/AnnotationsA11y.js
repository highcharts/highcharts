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
function getAnnotationLabelDescription(label) {
    var _a, _b;
    var labelText = ((_b = (_a = label.graphic) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.textStr) || '';
    return labelText;
}
/**
 * Return array of HTML strings for each annotation label in the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {Array<string>} Array of strings with HTML content for each annotation label.
 */
function getAnnotationItems(chart) {
    var annotations = chart.annotations || [];
    var labels = annotations.reduce(function (acc, cur) {
        var _a;
        if (((_a = cur.options) === null || _a === void 0 ? void 0 : _a.visible) !== false) {
            acc = acc.concat(cur.labels);
        }
        return acc;
    }, []);
    return labels.map(function (label) {
        return "<li>" + getAnnotationLabelDescription(label) + "</li>";
    });
}
/**
 * Return the annotation info for a chart as string.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {string} String with HTML content or empty string if no annotations.
 */
function getAnnotationsInfoHTML(chart) {
    var annotations = chart.annotations;
    if (!(annotations && annotations.length)) {
        return '';
    }
    var annotationItems = getAnnotationItems(chart);
    return "\n        Chart annotations:\n        <ul>\n            " + annotationItems.join(' ') + "\n        </ul>\n    ";
}
var AnnotationsA11y = {
    getAnnotationsInfoHTML: getAnnotationsInfoHTML,
    getAnnotationItems: getAnnotationItems,
    getAnnotationLabelDescription: getAnnotationLabelDescription
};
export default AnnotationsA11y;
