// Handler for discrete string options (array of string literals)

import type { ControlOptions } from '../config.ts';

export function getHTML(
    ctrlOpt: ControlOptions,
    overrideValue?: any,
    options?: string[]
): string {
    // Reorder so that the UI makes more sense
    if (options?.toString() === 'center,left,right') {
        options = ['left', 'center', 'right'];
    } else if (options?.toString() === 'bottom,middle,top') {
        options = ['top', 'middle', 'bottom'];
    } else if (options?.toString() === 'high,low,middle') {
        options = ['low', 'middle', 'high'];
    }

    let html = `<highcharts-control type="select" path="${ctrlOpt.path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    if (options !== void 0) {
        html += ` options="${options.join(',')}"`;
    }
    html += '></highcharts-control>';

    return html;
}