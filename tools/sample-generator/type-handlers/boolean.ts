// Handler for boolean options
export function getTSCall(path: string, overrideValue?: any) {
    const valueParam = overrideValue !== void 0 ?
        `, value: ${overrideValue}` :
        '';
    return `DemoKit.addControl({
    type: 'boolean',
    path: '${path}'${valueParam}
});`;
}
