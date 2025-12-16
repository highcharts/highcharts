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
    const valueParam = overrideValue !== void 0 ?
        `, value: '${overrideValue}'` :
        '';
    const optionsParam = options !== void 0 ?
        `, options: [${options.map((v): string => `'${v}'`).join(', ')}]` :
        '';
    return `HighchartsControls.addControl({
    type: 'array-of-strings',
    path: '${path}'${valueParam}${optionsParam}
});`;
}
