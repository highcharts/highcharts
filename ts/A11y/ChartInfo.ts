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
import type { LangOptions } from '../Core/Options';

import T from '../Core/Templating.js';
const { format } = T;
import G from '../Core/Globals.js';
const { doc } = G;

export type A11yModel = undefined | 'summary' | 'list' | 'application';

/**
 * Information about the chart, to be injected in the right place by the
 * accessibility module.
 *
 * @internal
 */
export interface ChartInfo {
    headingLevel: string;
    chartTitle: string;
    chartSubtitle: string;
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
function getHeadingLevel(chart: Chart): string {
    if (chart.options.a11y?.headingLevel) {
        return chart.options.a11y.headingLevel;
    }
    const getHeadingFromEl = (el: HTMLElement|null): string|undefined => {
        const tagName = el?.tagName || '';
        if (/^H[1-6]$/i.test(tagName)) {
            return 'h' + Math.min(6, +tagName.slice(1) + 1);
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
 * Build a ChartInfo object for the given chart. The model helps determine the
 * detail level of the information.
 *
 * @internal
 */
export function getChartInfo(chart: Chart, model: A11yModel): ChartInfo {
    const o = chart.options,

        // Format function helper to easily get string from lang options
        f = (langKey: string, ctx: AnyRecord = chart): string => {
            const keys = langKey.split('.');
            let formatString: unknown|string|LangOptions = o.lang,
                i = 0;
            for (; i < keys.length; ++i) {
                formatString = formatString &&
                    (formatString as LangOptions)[keys[i] as keyof LangOptions];
            }
            return typeof formatString === 'string' ?
                format(formatString, ctx, chart) : '';
        },

        // Get first pass of info
        info = {
            headingLevel: getHeadingLevel(chart),
            chartTitle: o.title?.text || f('a11y.defaultChartTitle'),
            chartSubtitle: o.subtitle?.text || '',
            linkedDescription: getLinkedDescription(chart),
            caption: o.caption?.text || '',
            chartAutoDescription: 'placeholder auto description'
        };

    // Additional information for more complex models
    if (model === 'list' || model === 'application') {
        Object.assign(info, {
            extra: 'placeholder'
        });
    }
    return info;
}
