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

var doc = H.win.document;


/**
 * The ContainerComponent class
 *
 * @private
 * @class
 * @param {Highcharts.Chart} chart
 *        Chart object
 */
var ContainerComponent = function (chart) {
    this.initBase(chart);
};
ContainerComponent.prototype = new AccessibilityComponent();
H.extend(ContainerComponent.prototype, {

    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function () {
        var chart = this.chart,
            options = chart.options,
            titleElement,
            descElement = chart.container.getElementsByTagName('desc')[0],
            textElements = chart.container.getElementsByTagName('text'),
            titleId = 'highcharts-title-' + chart.index,
            chartTitle = options.title.text || chart.langFormat(
                'accessibility.defaultChartTitle', { chart: chart }
            ),
            svgContainerTitle = this.stripTags(chart.langFormat(
                'accessibility.svgContainerTitle', {
                    chartTitle: chartTitle
                }
            ));

        // Handle accessibility disabled
        if (!options.accessibility.enabled) {
            chart.renderTo.setAttribute('aria-hidden', true);
            return;
        }

        // Add SVG title tag if it is set
        if (svgContainerTitle.length) {
            titleElement = this.svgTitleElement =
                this.svgTitleElement || doc.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'title'
                );
            titleElement.textContent = svgContainerTitle;
            titleElement.id = titleId;
            descElement.parentNode.insertBefore(titleElement, descElement);
        }

        chart.renderTo.setAttribute('role', 'region');
        chart.renderTo.setAttribute('aria-hidden', false);
        chart.renderTo.setAttribute(
            'aria-label',
            chart.langFormat(
                'accessibility.chartContainerLabel',
                {
                    title: this.stripTags(chartTitle),
                    chart: chart
                }
            )
        );

        // Hide text elements from screen readers
        [].forEach.call(textElements, function (el) {
            if (el.getAttribute('aria-hidden') !== 'false') {
                el.setAttribute('aria-hidden', 'true');
            }
        });

        // Hide desc element
        descElement.setAttribute('aria-hidden', 'true');
    }

});

export default ContainerComponent;
