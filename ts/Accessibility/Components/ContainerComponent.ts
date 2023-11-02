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

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type { SVGDOMElement } from '../../Core/Renderer/DOMElementType';

import AccessibilityComponent from '../AccessibilityComponent.js';
import KeyboardNavigationHandler from '../KeyboardNavigationHandler.js';
import CU from '../Utils/ChartUtilities.js';
const {
    unhideChartElementFromAT,
    getChartTitle
} = CU;
import H from '../../Core/Globals.js';
const { doc } = H;
import HU from '../Utils/HTMLUtilities.js';
const { stripHTMLTagsFromString: stripHTMLTags } = HU;


/**
 * The ContainerComponent class
 *
 * @private
 * @class
 * @name Highcharts.ContainerComponent
 */
class ContainerComponent extends AccessibilityComponent {

    /* *
     *
     *  Properties
     *
     * */

    public svgTitleElement?: SVGDOMElement;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */


    /**
     * Called on first render/updates to the chart, including options changes.
     */
    public onChartUpdate(): void {
        this.handleSVGTitleElement();
        this.setSVGContainerLabel();
        this.setGraphicContainerAttrs();
        this.setRenderToAttrs();
        this.makeCreditsAccessible();
    }


    /**
     * @private
     */
    public handleSVGTitleElement(): void {
        const chart = this.chart,
            titleId = 'highcharts-title-' + chart.index,
            titleContents = stripHTMLTags(chart.langFormat(
                'accessibility.svgContainerTitle', {
                    chartTitle: getChartTitle(chart)
                }
            ));

        if (titleContents.length) {
            const titleElement = this.svgTitleElement =
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
    }


    /**
     * @private
     */
    public setSVGContainerLabel(): void {
        const chart = this.chart,
            svgContainerLabel = chart.langFormat(
                'accessibility.svgContainerLabel', {
                    chartTitle: getChartTitle(chart)
                }
            );

        if (chart.renderer.box && svgContainerLabel.length) {
            chart.renderer.box.setAttribute('aria-label', svgContainerLabel);
        }
    }


    /**
     * @private
     */
    public setGraphicContainerAttrs(): void {
        const chart = this.chart,
            label = chart.langFormat('accessibility.graphicContainerLabel', {
                chartTitle: getChartTitle(chart)
            });

        if (label.length) {
            chart.container.setAttribute('aria-label', label);
        }
    }


    /**
     * Set attributes on the chart container element.
     * @private
     */
    public setRenderToAttrs(): void {
        const chart = this.chart,
            shouldHaveLandmark = chart.options.accessibility
                .landmarkVerbosity !== 'disabled',
            containerLabel = chart.langFormat(
                'accessibility.chartContainerLabel',
                {
                    title: getChartTitle(chart),
                    chart: chart
                }
            );

        if (containerLabel) {
            chart.renderTo.setAttribute(
                'role', shouldHaveLandmark ? 'region' : 'group'
            );
            chart.renderTo.setAttribute('aria-label', containerLabel);
        }
    }


    /**
     * @private
     */
    public makeCreditsAccessible(): void {
        const chart = this.chart,
            credits = chart.credits;

        if (credits) {
            if (credits.textStr) {
                credits.element.setAttribute(
                    'aria-label', chart.langFormat(
                        'accessibility.credits',
                        {
                            creditsStr:
                                stripHTMLTags(
                                    credits.textStr,
                                    chart.renderer.forExport
                                )
                        }
                    )
                );
            }
            unhideChartElementFromAT(chart, credits.element);
        }
    }


    /**
     * Empty handler to just set focus on chart
     * @private
     */
    public getKeyboardNavigation(): KeyboardNavigationHandler {
        const chart = this.chart;
        return new (KeyboardNavigationHandler as any)(chart, {
            keyCodeMap: [],

            validate: function (): (boolean) {
                return true;
            },

            init: function (): void {
                const a11y = chart.accessibility;
                if (a11y) {
                    a11y.keyboardNavigation.tabindexContainer.focus();
                }
            }
        });
    }


    /**
     * Accessibility disabled/chart destroyed.
     */
    public destroy(): void {
        this.chart.renderTo.setAttribute('aria-hidden', true);
    }

}


/* *
 *
 *  Default Export
 *
 * */


export default ContainerComponent;
