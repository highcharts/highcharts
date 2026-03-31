// Handler for strings. Uses a text input.

import type { ControlOptions } from '../config-example.js';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="text" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        // Escape double quotes and HTML special characters in the value
        overrideValue = String(overrideValue)
            .replace(/&/gu, '&amp;')
            .replace(/"/gu, '&quot;');

        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
