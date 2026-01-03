// Handler for boolean options

import type { ControlOptions } from '../config.ts';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="boolean" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
