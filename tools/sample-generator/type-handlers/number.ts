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

export function getTSCall(path: string, overrideValue?: any) {
    const valueParam = overrideValue !== void 0 ?
        `, value: ${overrideValue}` :
        '';
    const [min, max] = getRange(path);
    return `DemoKit.addControl({
    type: 'number',
    path: '${path}',
    range: [${min}, ${max}]${valueParam}
});`;
}
