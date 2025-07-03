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

export type A11yModel = undefined | 'summary' | 'list' | 'application';

/**
 * Information about the chart, to be injected in the right place by the
 * accessibility module.
 *
 * @internal
 */
export interface ChartInfo {
    title: string;
    subtitle: string;
}

/**
 * Build a ChartInfo object for the given chart. The model may determine the
 * detail level of the information.
 *
 * @internal
 */
export const getChartInfo = (chart: Chart, model: A11yModel): ChartInfo => {
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
                format(formatString, ctx, this) : '';
        },

        // Get first pass of info
        info = {
            title: o.title?.text || f('a11y.defaultChartTitle'),
            subtitle: o.subtitle?.text || ''
        };

    // Additional information for more complex models
    if (model === 'list' || model === 'application') {
        Object.assign(info, {
            extra: 'placeholder'
        });
    }
    return info;
};
