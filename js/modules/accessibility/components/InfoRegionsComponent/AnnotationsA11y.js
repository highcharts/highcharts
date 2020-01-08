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
    var chart = label.chart;
    var labelText = ((_b = (_a = label.graphic) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.textStr) || '';
    var points = label.points;
    var getAriaLabel = function (point) { var _a, _b, _c; return ((_c = (_b = (_a = point) === null || _a === void 0 ? void 0 : _a.graphic) === null || _b === void 0 ? void 0 : _b.element) === null || _c === void 0 ? void 0 : _c.getAttribute('aria-label')) || ''; };
    var ariaLabels = points.map(getAriaLabel)
        .filter(function (label) { return !!label; });
    var numPoints = ariaLabels.length;
    var pointsSelector = numPoints > 1 ? 'MultiplePoints' : numPoints ? 'SinglePoint' : 'NoPoints';
    var langFormatStr = 'accessibility.screenReaderSection.annotations.description' + pointsSelector;
    var context = {
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
        var desc = getAnnotationLabelDescription(label);
        return desc ? "<li>" + desc + "</li>" : '';
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
    return "<ul>" + annotationItems.join(' ') + "</ul>";
}
var AnnotationsA11y = {
    getAnnotationsInfoHTML: getAnnotationsInfoHTML,
    getAnnotationItems: getAnnotationItems,
    getAnnotationLabelDescription: getAnnotationLabelDescription
};
export default AnnotationsA11y;
