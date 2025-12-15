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

export function getTSCall(path: string, overrideValue?: any) {
    const rid = path.replace(/[^a-z0-9_-]/gui, '-');
    const valueParam = overrideValue !== void 0 ? `, ${overrideValue}` : '';
    return `DemoKit.setupBooleanHandler(
    '${path}',
    'toggle-checkbox-${rid}'${valueParam}
);`;
}
