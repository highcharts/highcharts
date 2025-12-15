// Handler for Highcharts ColorType (alias for hex string). Uses native color
// picker with a separate opacity slider.

// Sanitize a path like "legend.backgroundColor" to an element id
function toId(path: string) {
    return path.replace(/\./gu, '-');
}

export function getHTML(path: string) {
    const id = toId(path);
    return `
    <tr>
      <td><label for="${id}">${path}</label></td>
      <td>
        <input type="color" id="${id}" name="${id}" />
        <label for="${id}-opacity" class="opacity-label">Opacity</label>
        <input type="range" id="${id}-opacity" name="${id}-opacity" min="0"
          class="opacity-input" max="1" step="0.01" />
        <span class="value" id="${id}-value"></span>
      </td>
    </tr>`;
}

export function getTSCall(path: string, overrideValue?: any) {
    const id = toId(path);
    const valueParam = overrideValue !== void 0 ? `, '${overrideValue}'` : '';
    return `DemoKit.setupColorHandler(
    '${path}',
    '${id}',
    '${id}-opacity',
    '${id}-value'${valueParam}
  );`;
}

export function getCSS() {
    return `
.hc-row label.opacity-label {
    display: inline;
    font-family: inherit;
}

.hc-row .value {
    opacity: 0.5;
}

input[type="color"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-color: transparent;
    width: 2.5em;
    height: 2.5em;
    border: none;
    cursor: pointer;
    vertical-align: middle;
    padding: 0;
    margin-left: 10px;
}

input[type="color"]::-webkit-color-swatch {
    border-radius: 50%;
}

input[type="color"]::-moz-color-swatch {
    border-radius: 50%;
}

input.opacity-input {
    width: 80px;
}
`;
}
