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
    const [min, max] = getRange(path);
    const obj: Record<string, any> = {
        type: 'number',
        path,
        range: [min, max]
    };
    if (overrideValue !== void 0) {
        obj.value = overrideValue;
    }
    return JSON.stringify(obj, null, 4);
}
