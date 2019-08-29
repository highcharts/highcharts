/* *
 *
 *  (c) 2009-2019 Øystein Moseng
 *
 *  Accessibility component for chart container.
 *
 *  License: www.highcharts.com/license
 *
 * */

'use strict';

import H from '../../../parts/Globals.js';
import AccessibilityComponent from '../AccessibilityComponent.js';
import A11yUtilities from '../utilities.js';

var doc = H.win.document,
    stripHTMLTags = A11yUtilities.stripHTMLTagsFromString;


/**
 * The ContainerComponent class
 *
 * @private
 * @class
 * @name Highcharts.ContainerComponent
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var ContainerComponent = function (chart) {
    this.initBase(chart);
};
ContainerComponent.prototype = new AccessibilityComponent();
H.extend(ContainerComponent.prototype, /** @lends Highcharts.ContainerComponent */ { // eslint-disable-line

    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        var chart = this.chart,
            a11yOptions = chart.options.accessibility,
            titleElement,
            titleId = 'highcharts-title-' + chart.index,
            chartTitle = chart.options.title.text || chart.langFormat(
                'accessibility.defaultChartTitle', { chart: chart }
            ),
            svgContainerTitle = stripHTMLTags(chart.langFormat(
                'accessibility.svgContainerTitle', {
                    chartTitle: chartTitle
                }
            )),
            svgContainerLabel = stripHTMLTags(chart.langFormat(
                'accessibility.svgContainerLabel', {
                    chartTitle: chartTitle
                }
            ));

        // Add SVG title tag if it is set
        if (svgContainerTitle.length) {
            titleElement = this.svgTitleElement =
                this.svgTitleElement || doc.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'title'
                );
            titleElement.textContent = svgContainerTitle;
            titleElement.id = titleId;
            chart.renderTo.insertBefore(
                titleElement, chart.renderTo.firstChild
            );
        }

        // Add label to SVG container
        if (chart.renderer.box && svgContainerLabel.length) {
            chart.renderer.box.setAttribute('aria-label', svgContainerLabel);
        }

        // Add role and label to the div
        if (a11yOptions.landmarkVerbosity !== 'disabled') {
            chart.renderTo.setAttribute('role', 'region');
        } else {
            chart.renderTo.removeAttribute('role');
        }
        chart.renderTo.setAttribute(
            'aria-label',
            chart.langFormat(
                'accessibility.chartContainerLabel',
                {
                    title: stripHTMLTags(chartTitle),
                    chart: chart
                }
            )
        );

        // Make credits readable by screen reader
        var creditsEl = chart.credits && chart.credits.element;
        if (creditsEl) {
            if (chart.credits.textStr) {
                creditsEl.setAttribute(
                    'aria-label', stripHTMLTags(
                        chart.langFormat(
                            'accessibility.credits', {
                                creditsStr: chart.credits.textStr
                            }
                        )
                    )
                );
            }
            this.unhideElementFromScreenReaders(creditsEl);
        }
    },


    /**
     * Accessibility disabled/chart destroyed.
     */
    destroy: function () {
        this.chart.renderTo.setAttribute('aria-hidden', true);
        this.destroyBase();
    }

});

export default ContainerComponent;
