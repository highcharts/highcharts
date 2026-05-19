// Generic handler. Highcharts Controls is often able to guess type based on
// path or value.

import type { ControlOptions } from '../config-example.js';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }

    if (ctrlOpt.min !== void 0) {
        html += ` min="${ctrlOpt.min}"`;
    }
    if (ctrlOpt.max !== void 0) {
        html += ` max="${ctrlOpt.max}"`;
    }
    if (ctrlOpt.step !== void 0) {
        html += ` step="${ctrlOpt.step}"`;
    }
    if (ctrlOpt.options) {
        html += ` options="${ctrlOpt.options.join(',')}"`;
    }

    html += '></highcharts-control>';

    return html;
}
