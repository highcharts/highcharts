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
