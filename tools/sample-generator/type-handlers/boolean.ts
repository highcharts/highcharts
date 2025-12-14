// Handler for boolean options
export function getHTML(path: string) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    return `
    <tr>
      <td><label for="toggle-checkbox-${rid}">${path}</label></td>
      <td>
        <label class="hc-toggle">
          <input type="checkbox" id="toggle-checkbox-${rid}" />
          <span class="hc-toggle-slider" aria-hidden="true"></span>
        </label>
      </td>
    </tr>`;
}

// Generate a reusable function for boolean handlers
export function getTSFunction() {
    return `
function setupBooleanHandler(
  path: string,
  elementId: string,
  overrideValue?: boolean
) {
  const input = document.getElementById(elementId) as HTMLInputElement;
  if (input) {

    // Use override value if provided, otherwise get current value from chart
    const currentValue = overrideValue !== undefined ?
      overrideValue :
      getNestedValue(Highcharts.charts[0]!.options, path);
    input.checked = currentValue;

    input.addEventListener('change', function () {
      const value = this.checked;
      setNestedValue(Highcharts.charts[0]!, path, value);
    });
 }
}

  `;
}

export function getTSCall(path: string, overrideValue?: any) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    const valueParam = overrideValue !== void 0 ? `, ${overrideValue}` : '';
    return `setupBooleanHandler(
    '${path}',
    'toggle-checkbox-${rid}'${valueParam}
);`;
}

export function getCSS() {
    return `
/* Toggle (checkbox) styles */
.hc-toggle {
    position: relative;
    display: inline-block;
    width: 46px;
    height: 26px;
    vertical-align: middle;
    margin-left: 10px;
}

.hc-toggle input {
    opacity: 0;
    width: 0;
    height: 0;
    position: absolute;
}

.hc-toggle-slider {
    position: absolute;
    cursor: pointer;
    top: 0; left: 0; right: 0; bottom: 0;
    background: #cfcfcf;
    border-radius: 9999px;
    transition: background 200ms, box-shadow 200ms;
}

.hc-toggle-slider::before {
    content: '';
    position: absolute;
    height: 20px; width: 20px;
    left: 3px; top: 3px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0,0,0,0.25);
    transition: transform 200ms;
}

.hc-toggle input:checked + .hc-toggle-slider {
    background: #2caffe;
}

.hc-toggle input:checked + .hc-toggle-slider::before {
    transform: translateX(20px);
}

.hc-toggle input:focus + .hc-toggle-slider {
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.35);
}
`;
}
