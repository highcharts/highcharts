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

export function getCSS() {
    return `
.highcharts-demo-button {
    background: #f2f2f2;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: inline-block;
    font-size: 0.8rem;
    padding: 0.5rem 1.5rem;
    margin: 0.5rem -5px 0.5rem 10px;
    transition: background 250ms;
}

.highcharts-demo-button:hover {
    background: #e6e6e6;
}

.highcharts-demo-button.active {
    background: #2caffe;
    color: white;
}

.highcharts-demo-button.active:hover {
    background: #1fb8e6;
}
`;
}
