// Handler for number options
import type { ControlOptions } from '../config.ts';

export function getHTML(ctrlOpt: ControlOptions, overrideValue?: any): string {
    let html = `<highcharts-control type="number" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }

    if (typeof ctrlOpt.min === 'number') {
        html += ` min="${ctrlOpt.min}"`;
    }

    if (typeof ctrlOpt.max === 'number') {
        html += ` max="${ctrlOpt.max}"`;
    }

    if (typeof ctrlOpt.step === 'number') {
        html += ` step="${ctrlOpt.step}"`;
    }

    html += '></highcharts-control>';

    return html;
}
