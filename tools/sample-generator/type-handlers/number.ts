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

export function getTSFunction() {
    return `
function setupNumberHandler(
  path: string,
  inputId: string,
  valueId: string,
  overrideValue?: number
) {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const valueEl = document.getElementById(valueId);

  if (input && valueEl) {

    // Use override value if provided, otherwise get current value from chart
    const currentValue = overrideValue !== undefined ?
      overrideValue :
      (getNestedValue(Highcharts.charts[0]!.options, path) ?? 0);
    input.value = String(currentValue);
    valueEl.textContent = String(currentValue);

    input.addEventListener('input', function () {
      const value = parseFloat(this.value);
      valueEl.textContent = String(value);
      setNestedValue(Highcharts.charts[0]!, path, value, false);
    });
  }
}

  `;
}

export function getTSCall(path: string, overrideValue?: any) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    const valueParam = overrideValue !== void 0 ? `, ${overrideValue}` : '';
    return `setupNumberHandler(
    '${path}',
    'range-input-${rid}',
    'range-value-${rid}'${valueParam}
  );`;
}

export function getCSS() {
    return `
/* Range (number) styles */
.hc-range-value {
    display: inline-block;
    min-width: 2ch;
    margin-left: 8px;
}

input[id^='range-input-'] {
    vertical-align: middle;
    margin-left: 10px;
    width: 180px;
}
`;
}
