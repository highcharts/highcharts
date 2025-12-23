// Handler for Highcharts ColorType (alias for hex string). Uses native color
// picker with a separate opacity input.
export function getHTML(path: string, overrideValue?: any): string {
    let html = `<highcharts-control type="color" path="${path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    html += '></highcharts-control>';

    return html;
}
