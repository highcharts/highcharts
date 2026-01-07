// Handler for strings. Uses a text input.

import type { ControlOptions } from '../config-example.js';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="text" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
