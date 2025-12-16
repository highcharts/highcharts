// Handler for Highcharts ColorType (alias for hex string). Uses native color
// picker with a separate opacity slider.
export function getTSCall(path: string, overrideValue?: any) {
    const object: Record<string, any> = {
        type: 'color',
        path
    };
    if (overrideValue !== void 0) {
        object.value = overrideValue;
    }
    return JSON.stringify(object, null, 4);
}
