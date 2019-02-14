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
            titleElement,
            descElement = chart.container.getElementsByTagName('desc')[0],
            textElements = chart.container.getElementsByTagName('text'),
            titleId = 'highcharts-title-' + chart.index,
            chartTitle = chart.options.title.text || chart.langFormat(
                'accessibility.defaultChartTitle', { chart: chart }
            ),
            svgContainerTitle = this.stripTags(chart.langFormat(
                'accessibility.svgContainerTitle', {
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

        // Hide desc & text elements from screen readers
        // TODO: Expand to hide everything we don't want?
        [].forEach.call(textElements, function (el) {
            if (el.getAttribute('aria-hidden') !== 'false') {
                el.setAttribute('aria-hidden', 'true');
            }
        });
        descElement.setAttribute('aria-hidden', 'true');
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
