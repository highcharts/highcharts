/* *
 *
 *  (c) 2009-2025 Highsoft AS
 *
 *  Accessibility module for Highcharts: Chart information provider
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Chart from '../Core/Chart/Chart';
import type { A11yChartDescriptionSectionOptions, LangA11yOptions } from './A11yOptions';

import T from '../Core/Templating.js';
const { format } = T;
import G from '../Core/Globals.js';
const { doc } = G;

export type A11yModel = undefined | 'summary' | 'list' | 'application';

/**
 * Information about the chart, to be injected in the right place by the
 * accessibility module. This is information that does not change with
 * the model or chart data.
 *
 * @internal
 */
export interface ChartDescriptionInfo {
    headingLevel: keyof HTMLElementTagNameMap;
    chartTitle: string;
    chartSubtitle: string;
    description: string;
}

/**
 * Information about the chart, to be injected in the right place by the
 * accessibility module. This is information that may change with the model
 * or chart data, and should be computed on every chart render.
 *
 * @internal
 */
export interface ChartDetailedInfo {
    chartAutoDescription: string;
    extra?: string;
}


/**
 * Try to determine the heading level for the chart. Fall back to `h6` if
 * ambiguous.
 *
 * Note: Only detects previous headings in the DOM that are siblings, ancestors,
 * or previous siblings of ancestors. Headings that are nested below siblings of
 * ancestors (cousins et al) are not picked up. This is because it is ambiguous
 * whether or not the nesting is for layout purposes or indicates a separate
 * section.
 *
 * @internal
 */
function getHeadingLevel(chart: Chart): keyof HTMLElementTagNameMap {
    const a11yOptions = chart.options.a11y;
    const chartTitle = a11yOptions?.chartDescriptionSection?.chartTitleFormat;

    const headingRegex = /<h([1-6])[^>]*>.*?<\/h\1>/i;
    const chartTitleFormat = chartTitle?.match(headingRegex);

    // If the chartTitleFormat is set, we can parse the heading level from it
    if (chartTitleFormat) {
        const headingTag = `h${chartTitleFormat[1]}` as keyof HTMLElementTagNameMap;
        return headingTag;
    }

    const getHeadingFromEl = (
        el: HTMLElement|null
    ): keyof HTMLElementTagNameMap|undefined => {
        const tagName = el?.tagName || '';
        if (/^H[1-6]$/i.test(tagName)) {
            return (
                'h' + Math.min(6, +tagName.slice(1) + 1)
            ) as keyof HTMLElementTagNameMap;
        }
    };
    let el: HTMLElement | null = chart.container;
    while (el) {
        // Go through siblings first
        for (let sib = el.previousElementSibling as HTMLElement | null;
            sib;
            sib = sib.previousElementSibling as HTMLElement | null) {
            const newHeading = getHeadingFromEl(sib);
            if (newHeading) {
                return newHeading;
            }
        }
        // Move to parent el before next iteration
        el = el.parentElement;
        const newHeading = getHeadingFromEl(el);
        if (newHeading) {
            return newHeading;
        }
    }
    return 'h6';
}

/**
 * Strip heading tags from a string, leaving the text content.
 *
 * @internal
 */
function stripHeadingTags(input: string): string {
    return input.replace(/<\/?h[1-6][^>]*>/gi, '').trim();
}


/**
 * Get the linked description for the chart, if available.
 *
 * @internal
 */
function getLinkedDescription(chart: Chart): string {
    const linkedDescOption = chart.options.a11y
        ?.chartDescriptionSection?.linkedDescription;
    if (!linkedDescOption) {
        return '';
    }
    const query = format(linkedDescOption, chart),
        queryMatch = doc.querySelectorAll(query);
    if (queryMatch.length === 1) {
        return queryMatch[0]?.textContent || '';
    }
    return '';
}


/**
 * Build a ChartDescriptionInfo object for the given chart. This is information
 * that does not change with the model, or the data in the chart, and can be
 * computed once on init only.
 *
 * @internal
 */
export function getChartDescriptionInfo(chart: Chart): ChartDescriptionInfo {
    const o = chart.options,
        descriptionOpts = o.a11y
            ?.chartDescriptionSection as Required<A11yChartDescriptionSectionOptions>,
        langOpts = o.lang?.a11y as Required<LangA11yOptions>,
        defaultTitle = format(langOpts.defaultChartTitle, { chart }, chart);
    return {
        headingLevel: getHeadingLevel(chart),
        chartTitle: stripHeadingTags(format(
            descriptionOpts.chartTitleFormat,
            { chart, chartTitle: o.title?.text || defaultTitle },
            chart
        )),
        chartSubtitle: format(
            descriptionOpts.chartSubtitleFormat,
            { chart, chartSubtitle: o.subtitle?.text || '' }, chart
        ),
        description: format(
            descriptionOpts.chartDescriptionFormat,
            {
                chart,
                linkedDescription: getLinkedDescription(chart),
                caption: o.caption?.text || ''
            },
            chart
        )
    };
}


/**
 * Build a ChartDetailedInfo object for the given chart. This is information
 * that may change with the model, or the data in the chart, and should be
 * computed on every chart render.
 *
 * @internal
 */
export function getChartDetailedInfo(
    chart: Chart,
    model: A11yModel
): ChartDetailedInfo {
    const o = chart.options,
        descriptionOpts = o.a11y
            ?.chartDescriptionSection as Required<A11yChartDescriptionSectionOptions>,
        chartAutoDescription = 'placeholder description';

    // Get first pass of info
    const info = {
        chartAutoDescription: format(
            descriptionOpts.chartAutoDescriptionFormat,
            { chart, chartAutoDescription }, chart
        )
    };

    // Additional information for more complex models
    if (model === 'list' || model === 'application') {
        Object.assign(info, {
            extra: 'placeholder'
        });
    }
    return info;
}
