// Handler for number options
export function getHTML(path: string, overrideValue?: any): string {
    let html = `<highcharts-control type="number" path="${path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
