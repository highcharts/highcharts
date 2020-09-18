/* *
 *
 *  (c) 2009-2020 Øystein Moseng
 *
 *  Accessibility component for chart container.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
var unhideChartElementFromAT = ChartUtilities.unhideChartElementFromAT, getChartTitle = ChartUtilities.getChartTitle;
import H from '../../Core/Globals.js';
var doc = H.doc;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
var stripHTMLTags = HTMLUtilities.stripHTMLTagsFromString;
import U from '../../Core/Utilities.js';
var extend = U.extend;
/* eslint-disable valid-jsdoc */
/**
 * The ContainerComponent class
 *
 * @private
 * @class
 * @name Highcharts.ContainerComponent
 */
var ContainerComponent = function () { };
ContainerComponent.prototype = new AccessibilityComponent();
extend(ContainerComponent.prototype, /** @lends Highcharts.ContainerComponent */ {
    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        this.handleSVGTitleElement();
        this.setSVGContainerLabel();
        this.setGraphicContainerAttrs();
        this.setRenderToAttrs();
        this.makeCreditsAccessible();
    },
    /**
     * @private
     */
    handleSVGTitleElement: function () {
        var chart = this.chart, titleId = 'highcharts-title-' + chart.index, titleContents = stripHTMLTags(chart.langFormat('accessibility.svgContainerTitle', {
            chartTitle: getChartTitle(chart)
        }));
        if (titleContents.length) {
            var titleElement = this.svgTitleElement =
                this.svgTitleElement || doc.createElementNS('http://www.w3.org/2000/svg', 'title');
            titleElement.textContent = titleContents;
            titleElement.id = titleId;
            chart.renderTo.insertBefore(titleElement, chart.renderTo.firstChild);
        }
    },
    /**
     * @private
     */
    setSVGContainerLabel: function () {
        var chart = this.chart, svgContainerLabel = stripHTMLTags(chart.langFormat('accessibility.svgContainerLabel', {
            chartTitle: getChartTitle(chart)
        }));
        if (chart.renderer.box && svgContainerLabel.length) {
            chart.renderer.box.setAttribute('aria-label', svgContainerLabel);
        }
    },
    /**
     * @private
     */
    setGraphicContainerAttrs: function () {
        var chart = this.chart, label = chart.langFormat('accessibility.graphicContainerLabel', {
            chartTitle: getChartTitle(chart)
        });
        if (label.length) {
            chart.container.setAttribute('aria-label', label);
        }
    },
    /**
     * @private
     */
    setRenderToAttrs: function () {
        var chart = this.chart;
        if (chart.options.accessibility.landmarkVerbosity !== 'disabled') {
            chart.renderTo.setAttribute('role', 'region');
        }
        else {
            chart.renderTo.removeAttribute('role');
        }
        chart.renderTo.setAttribute('aria-label', chart.langFormat('accessibility.chartContainerLabel', {
            title: getChartTitle(chart),
            chart: chart
        }));
    },
    /**
     * @private
     */
    makeCreditsAccessible: function () {
        var chart = this.chart, credits = chart.credits;
        if (credits) {
            if (credits.textStr) {
                credits.element.setAttribute('aria-label', stripHTMLTags(chart.langFormat('accessibility.credits', { creditsStr: credits.textStr })));
            }
            unhideChartElementFromAT(chart, credits.element);
        }
    },
    /**
     * Accessibility disabled/chart destroyed.
     */
    destroy: function () {
        this.chart.renderTo.setAttribute('aria-hidden', true);
    }
});
export default ContainerComponent;
