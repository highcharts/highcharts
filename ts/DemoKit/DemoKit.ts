/**
 * Highcharts Demo Kit
 *
 * Provides UI controls to manipulate chart options on the fly.
 *
 * Used by the sample generator to create interactive samples:
 * - node tools/sample-generator/index.ts
 */

/* eslint-disable @highcharts/highcharts/no-highcharts-object */

import type Chart from '../Core/Chart/Chart';

declare const Highcharts: typeof import('../Core/Globals').default;

/**
 * Get a nested value from an object given a dot-separated path.
 */
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key): any => current?.[key], obj);
}

/**
 * Set a nested value on the chart given a dot-separated path.
 */
function setNestedValue(
    chart: Chart,
    path: string,
    value: any,
    animation?: boolean
): void {
    const keys = path.split('.');
    const updateObj: any = {};
    let cur = updateObj;
    for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
            cur[k] = value;
        } else {
            cur[k] = {};
            cur = cur[k];
        }
    }
    chart.update(updateObj, true, true, animation);
}

/**
 * Update the options preview element with the current chart options.
 */
export function updateOptionsPreview(): void {
    const previewEl = document.getElementById('options-preview');
    if (previewEl && Highcharts.charts[0]) {
        const options = Highcharts.charts[0].getOptions();
        // Empty xAxis and yAxis structures
        Object.keys(options).forEach((key): void => {
            if (JSON.stringify((options as any)[key]) === '[{}]') {
                delete (options as any)[key];
            }
        });
        previewEl.textContent = JSON.stringify(options, null, 2);
    }
}

/**
 * Set up a handler for array of strings type.
 */
export function setupArrayHandler(path: string, selector: string): void {
    document.querySelectorAll(selector).forEach((btn): void => {
        btn.addEventListener('click', function (this: HTMLElement): void {
            const value = this.getAttribute('data-value');
            setNestedValue(Highcharts.charts[0]!, path, value);

            // Update active state for all buttons in this group
            const allButtons = document.querySelectorAll(
                `[data-path="${path}"]`
            );
            allButtons.forEach((b): void => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Set up a handler for boolean type.
 */
export function setupBooleanHandler(
    path: string,
    elementId: string,
    overrideValue?: boolean
): void {
    const input = document.getElementById(elementId) as HTMLInputElement;
    if (input) {

        // Use override value if provided, otherwise get current value from
        // chart
        const currentValue = overrideValue !== void 0 ?
            overrideValue :
            getNestedValue(Highcharts.charts[0]!.options, path);
        input.checked = currentValue;

        input.addEventListener('change', function (): void {
            const value = this.checked;
            setNestedValue(Highcharts.charts[0]!, path, value);
        });
    }
}

/**
 * Set up a handler for color type.
 */
export function setupColorHandler(
    path: string,
    colorId: string,
    opacityId: string,
    valueId: string,
    overrideValue?: string
): void {
    const colorEl = document.getElementById(colorId) as HTMLInputElement;
    const opacityEl = document.getElementById(opacityId) as HTMLInputElement;
    const valueEl = document.getElementById(valueId) as HTMLElement;

    if (colorEl && opacityEl) {

        /**
         * Run the update on input change
         */
        const update = (): void => {
            const chart = Highcharts.charts[0]!;
            const rgba = colorEl.value; // E.g. #RRGGBB
            const opacity = parseFloat(opacityEl.value);
            // Use Highcharts.color to apply opacity and produce rgba()/hex
            const hcColor = (Highcharts as any).color(rgba)
                .setOpacity(opacity).get();
            setNestedValue(chart, path, hcColor, false);
            if (valueEl) {
                valueEl.textContent = hcColor;
            }
        };

        // Use override value if provided, otherwise get current chart value
        const chart = Highcharts.charts[0]!;
        const currentValue = overrideValue !== void 0 ?
            overrideValue :
            (getNestedValue(chart.options, path) || '#00000000');
        const hcColor = (Highcharts as any).color(currentValue);
        const rgba = hcColor.get('rgba');
        const opacity = hcColor.rgba[3] || 0;

        colorEl.value = currentValue;
        opacityEl.value = String(opacity);
        if (valueEl) {
            valueEl.textContent = rgba;
        }

        colorEl.addEventListener('input', update);
        opacityEl.addEventListener('input', update);
    }
}

/**
 * Set up a handler for number type.
 */
export function setupNumberHandler(
    path: string,
    inputId: string,
    valueId: string,
    overrideValue?: number
): void {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const valueEl = document.getElementById(valueId);

    if (input && valueEl) {

        // Use override value if provided, otherwise get current value from
        // chart
        const currentValue = overrideValue !== void 0 ?
            overrideValue :
            (getNestedValue(Highcharts.charts[0]!.options, path) ?? 0);
        input.value = String(currentValue);
        valueEl.textContent = String(currentValue);

        input.addEventListener('input', function (): void {
            const value = parseFloat(this.value);
            valueEl.textContent = String(value);
            setNestedValue(Highcharts.charts[0]!, path, value, false);
        });
    }
}
