// Handler for Highcharts ColorType (alias for hex string). Uses native color
// picker with a separate opacity input.

import type { ControlOptions } from '../config-example.js';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="color" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
