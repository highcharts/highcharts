// Handler for discrete string options (array of string literals)
export function getHTML(
    path: string,
    overrideValue?: any,
    options?: string[]
): string {
    // Reorder so that the UI makes more sense
    if (options.toString() === 'center,left,right') {
        options = ['left', 'center', 'right'];
    } else if (options.toString() === 'bottom,middle,top') {
        options = ['top', 'middle', 'bottom'];
    }

    let html = `<highcharts-control type="select" path="${path}"`;

    if (overrideValue !== void 0) {
        html += ` value="${overrideValue}"`;
    }
    if (options !== void 0) {
        html += ` options="${options.join(',')}"`;
    }
    html += '></highcharts-control>';

    return html;
}