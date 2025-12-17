// Handler for number options
export function getTSCall(path: string, overrideValue?: any) {
    const obj: Record<string, any> = {
        type: 'number',
        path
    };
    if (overrideValue !== void 0) {
        obj.value = overrideValue;
    }
    return JSON.stringify(obj, null, 4);
}
