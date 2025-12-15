// Handler for number options
function getRange(p: string): [number, number] {
    if (/(lineWidth|borderWidth)$/iu.test(p)) {
        return [0, 5];
    }
    if (/\.(x|y|offsetX|offsetY|offset)$/iu.test(p)) {
        return [-100, 100];
    }
    return [0, 100];
}

export function getHTML(path: string) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    const [min, max] = getRange(path);
    return `
    <tr>
      <td><label for="range-input-${rid}">${path}</label></td>
      <td>
        <input type="range" id="range-input-${rid}"
          min="${min}" max="${max}" step="1" />
        <span id="range-value-${rid}" class="hc-range-value"></span>
      </td>
    </tr>`;
}

export function getTSCall(path: string, overrideValue?: any) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    const valueParam = overrideValue !== void 0 ? `, ${overrideValue}` : '';
    return `DemoKit.setupNumberHandler(
    '${path}',
    'range-input-${rid}',
    'range-value-${rid}'${valueParam}
  );`;
}
