// Generic handler. Highcharts Controls is often able to guess type based on
// path or value.

import type { ControlOptions } from '../config.ts';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }

    if (ctrlOpt.options) {
        html += ` options="${ctrlOpt.options.join(',')}"`;
    }

    html += '></highcharts-control>';

    return html;
}
