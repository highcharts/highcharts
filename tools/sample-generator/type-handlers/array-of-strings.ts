// Handler for discrete string options (array of string literals)
export function getHTML(path: string, options: string[], defaultValue?: any) {
    // Reorder so that the UI makes more sense
    if (options.toString() === 'center,left,right') {
        options = ['left', 'center', 'right'];
    } else if (options.toString() === 'bottom,middle,top') {
        options = ['top', 'middle', 'bottom'];
    }

    let html = `<tr><td><label>${path}</label></td><td>`;
    for (const option of options) {
        const isActive = defaultValue !== void 0 && defaultValue === option;
        const activeClass = isActive ? ' active' : '';
        html += `
      <button
        class="highcharts-demo-button${activeClass}"
        data-path="${path}"
        data-value="${option}"
      >${option}</button>
    `;
    }
    html += '</td></tr>';
    return html;
}

export function getTSCall(path: string) {
    return `DemoKit.setupArrayHandler(
    '${path}',
    '.highcharts-demo-button[data-path="${path}"]'
);`;
}
