// Handler for boolean options

import type { ControlOptions } from '../config-example.js';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="boolean" path="${ctrlOpt.path}"`;

    if (ctrlOpt.nullable) {
        html += ' nullable';
    }

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
