/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Accessibility component for chart container.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type {
    SVGDOMElement
} from '../../Core/Renderer/DOMElementType';
import AccessibilityComponent from '../AccessibilityComponent.js';
import ChartUtilities from '../Utils/ChartUtilities.js';
const {
    unhideChartElementFromAT,
    getChartTitle
} = ChartUtilities;
import H from '../../Core/Globals.js';
const {
    doc
} = H;
import HTMLUtilities from '../Utils/HTMLUtilities.js';
const {
    stripHTMLTagsFromString: stripHTMLTags
} = HTMLUtilities;
import U from '../../Core/Utilities.js';
const {
    extend
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class ContainerComponent extends AccessibilityComponent {
            public constructor();
            public svgTitleElement: SVGDOMElement;
            public destroy(): void;
            public handleSVGTitleElement(): void;
            public makeCreditsAccessible(): void;
            public onChartUpdate(): void;
            public setGraphicContainerAttrs(): void;
            public setRenderToAttrs(): void;
            public setSVGContainerLabel(): void;
        }
    }
}

/* eslint-disable valid-jsdoc */

/**
 * The ContainerComponent class
 *
 * @private
 * @class
 * @name Highcharts.ContainerComponent
 */
var ContainerComponent: typeof Highcharts.ContainerComponent =
    function (): void {} as any;
ContainerComponent.prototype = new (AccessibilityComponent as any)();
extend(ContainerComponent.prototype, /** @lends Highcharts.ContainerComponent */ {

    /**
     * Called on first render/updates to the chart, including options changes.
     */
    onChartUpdate: function (this: Highcharts.ContainerComponent): void {
        this.handleSVGTitleElement();
        this.setSVGContainerLabel();
        this.setGraphicContainerAttrs();
        this.setRenderToAttrs();
        this.makeCreditsAccessible();
    },


    /**
     * @private
     */
    handleSVGTitleElement: function (
        this: Highcharts.ContainerComponent
    ): void {
        var chart = this.chart,
            titleId = 'highcharts-title-' + chart.index,
            titleContents = stripHTMLTags(chart.langFormat(
                'accessibility.svgContainerTitle', {
                    chartTitle: getChartTitle(chart)
                }
            ));

        if (titleContents.length) {
            var titleElement = this.svgTitleElement =
                this.svgTitleElement || doc.createElementNS(
                    'http://www.w3.org/2000/svg',
                    'title'
                );

            titleElement.textContent = titleContents;
            titleElement.id = titleId;
            chart.renderTo.insertBefore(
                titleElement, chart.renderTo.firstChild
            );
        }
    },


    /**
     * @private
     */
    setSVGContainerLabel: function (this: Highcharts.ContainerComponent): void {
        var chart = this.chart,
            svgContainerLabel = chart.langFormat(
                'accessibility.svgContainerLabel', {
                    chartTitle: getChartTitle(chart)
                }
            );

        if (chart.renderer.box && svgContainerLabel.length) {
            chart.renderer.box.setAttribute('aria-label', svgContainerLabel);
        }
    },


    /**
     * @private
     */
    setGraphicContainerAttrs: function (
        this: Highcharts.ContainerComponent
    ): void {
        var chart = this.chart,
            label = chart.langFormat('accessibility.graphicContainerLabel', {
                chartTitle: getChartTitle(chart)
            });

        if (label.length) {
            chart.container.setAttribute('aria-label', label);
        }
    },


    /**
     * @private
     */
    setRenderToAttrs: function (this: Highcharts.ContainerComponent): void {
        var chart = this.chart;

        if (chart.options.accessibility.landmarkVerbosity !== 'disabled') {
            chart.renderTo.setAttribute('role', 'region');
        } else {
            chart.renderTo.removeAttribute('role');
        }

        chart.renderTo.setAttribute(
            'aria-label',
            chart.langFormat(
                'accessibility.chartContainerLabel',
                {
                    title: getChartTitle(chart),
                    chart: chart
                }
            )
        );
    },


    /**
     * @private
     */
    makeCreditsAccessible: function (
        this: Highcharts.ContainerComponent
    ): void {
        var chart = this.chart,
            credits = chart.credits;

        if (credits) {
            if (credits.textStr) {
                credits.element.setAttribute(
                    'aria-label', chart.langFormat(
                        'accessibility.credits',
                        { creditsStr: stripHTMLTags(credits.textStr) }
                    )
                );
            }
            unhideChartElementFromAT(chart, credits.element);
        }
    },


    /**
     * Accessibility disabled/chart destroyed.
     */
    destroy: function (this: Highcharts.ContainerComponent): void {
        this.chart.renderTo.setAttribute('aria-hidden', true);
    }

});

export default ContainerComponent;
