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
import U from '../../../parts/Utilities.js';
var inArray = U.inArray;
import HTMLUtilities from '../utils/htmlUtilities.js';
var escapeStringForHTML = HTMLUtilities.escapeStringForHTML, stripHTMLTagsFromString = HTMLUtilities.stripHTMLTagsFromString;
/**
 * Get list of all annotation labels in the chart.
 *
 * @private
 * @param {Highcharts.Chart} chart The chart to get annotation info on.
 * @return {Array<object>} The labels, or empty array if none.
 */
function getChartAnnotationLabels(chart) {
    var annotations = chart.annotations || [];
    return annotations.reduce(function (acc, cur) {
        var _a;
        if (((_a = cur.options) === null || _a === void 0 ? void 0 : _a.visible) !== false) {
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
function getLabelText(label) {
    var _a, _b;
    return ((_b = (_a = label.graphic) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.textStr) || '';
}
/**
 * Describe an annotation label.
 *
 * @private
 * @param {object} label The annotation label object to describe
 * @return {string} The description for the label.
 */
function getAnnotationLabelDescription(label) {
    var chart = label.chart;
    var labelText = getLabelText(label);
    var points = label.points;
    var getAriaLabel = function (point) { var _a, _b, _c; return ((_c = (_b = (_a = point) === null || _a === void 0 ? void 0 : _a.graphic) === null || _b === void 0 ? void 0 : _b.element) === null || _c === void 0 ? void 0 : _c.getAttribute('aria-label')) || ''; };
    var getValueDesc = function (point) {
        var _a, _b, _c;
        var valDesc = ((_b = (_a = point) === null || _a === void 0 ? void 0 : _a.accessibility) === null || _b === void 0 ? void 0 : _b.valueDescription) || getAriaLabel(point);
        var seriesName = ((_c = point) === null || _c === void 0 ? void 0 : _c.series.name) || '';
        return (seriesName ? seriesName + ', ' : '') + 'data point ' + valDesc;
    };
    var pointValueDescriptions = points
        .filter(function (p) { return !!p.graphic; }) // Filter out mock points
        .map(getValueDesc)
        .filter(function (desc) { return !!desc; }); // Filter out points we can't describe
    var numPoints = pointValueDescriptions.length;
    var pointsSelector = numPoints > 1 ? 'MultiplePoints' : numPoints ? 'SinglePoint' : 'NoPoints';
    var langFormatStr = 'accessibility.screenReaderSection.annotations.description' + pointsSelector;
    var context = {
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
function getAnnotationListItems(chart) {
    var labels = getChartAnnotationLabels(chart);
    return labels.map(function (label) {
        var desc = escapeStringForHTML(stripHTMLTagsFromString(getAnnotationLabelDescription(label)));
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
    var annotationItems = getAnnotationListItems(chart);
    return "<ul>" + annotationItems.join(' ') + "</ul>";
}
/**
 * Return the texts for the annotation(s) connected to a point, or empty array
 * if none.
 *
 * @private
 * @param {Highcharts.Point} point The data point to get the annotation info from.
 * @return {Array<string>} Annotation texts
 */
function getPointAnnotationTexts(point) {
    var labels = getChartAnnotationLabels(point.series.chart);
    var pointLabels = labels
        .filter(function (label) { return inArray(point, label.points) > -1; });
    if (!pointLabels.length) {
        return [];
    }
    return pointLabels.map(function (label) { return "" + getLabelText(label); });
}
var AnnotationsA11y = {
    getAnnotationsInfoHTML: getAnnotationsInfoHTML,
    getAnnotationLabelDescription: getAnnotationLabelDescription,
    getAnnotationListItems: getAnnotationListItems,
    getPointAnnotationTexts: getPointAnnotationTexts
};
export default AnnotationsA11y;
