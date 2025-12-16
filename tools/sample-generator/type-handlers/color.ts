// Handler for Highcharts ColorType (alias for hex string). Uses native color
// picker with a separate opacity slider.
export function getTSCall(path: string, overrideValue?: any) {
    const valueParam = overrideValue !== void 0 ?
        `, value: '${overrideValue}'` : '';
    return `DemoKit.addControl({
    type: 'color',
    path: '${path}'${valueParam}
});`;
}
