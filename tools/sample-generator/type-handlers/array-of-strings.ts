// Handler for discrete string options (array of string literals)
export function getTSCall(
    path: string,
    overrideValue?: any,
    options?: string[]
): string {
    // Reorder so that the UI makes more sense
    if (options.toString() === 'center,left,right') {
        options = ['left', 'center', 'right'];
    } else if (options.toString() === 'bottom,middle,top') {
        options = ['top', 'middle', 'bottom'];
    }

    const obj: Record<string, any> = {
        type: 'array-of-strings',
        path
    };

    if (overrideValue !== void 0) {
        obj.value = overrideValue;
    }
    if (options !== void 0) {
        obj.options = options;
    }
    return JSON.stringify(obj, null, 4);
}
