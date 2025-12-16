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

interface ControlParams {
    type: 'boolean'|'color'|'number'|'array-of-strings';
    path: string;
}

interface ArrayControlParams extends ControlParams {
    type: 'array-of-strings';
    options: string[];
    value?: string;
}

interface BooleanControlParams extends ControlParams {
    type: 'boolean';
    value?: boolean;
}

interface ColorControlParams extends ControlParams {
    type: 'color';
    value?: string;
}

interface NumberControlParams extends ControlParams {
    type: 'number';
    range?: [number, number];
    step?: number;
    value?: number;
}

/**
 * Type guard for ArrayControlParams
 */
function isArrayControlParams(
    params: ControlParams
): params is ArrayControlParams {
    return params.type === 'array-of-strings';
}

/**
 * Type guard for BooleanControlParams
 */
function isBooleanControlParams(
    params: ControlParams
): params is BooleanControlParams {
    return params.type === 'boolean';
}

/**
 * Type guard for ColorControlParams
 */
function isColorControlParams(
    params: ControlParams
): params is ColorControlParams {
    return params.type === 'color';
}

/**
 * Type guard for NumberControlParams
 */
function isNumberControlParams(
    params: ControlParams
): params is NumberControlParams {
    return params.type === 'number';
}

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
 * Add an array of strings control
 */
function addArrayControl(
    params: ArrayControlParams,
    keyDiv: HTMLElement,
    valueDiv: HTMLElement
): void {
    keyDiv.appendChild(
        Object.assign(
            document.createElement('label'),
            {
                innerText: params.path
            }
        )
    );

    params.options.forEach((option): void => {
        const button = valueDiv.appendChild(
            Object.assign(
                document.createElement('button'),
                {
                    className: 'highcharts-demo-button' +
                        (params.value === option ? ' active' : ''),
                    innerText: option
                }
            )
        );
        button.dataset.path = params.path;
        button.dataset.value = option;

        button.addEventListener('click', function (this: HTMLElement): void {
            const value = this.getAttribute('data-value');
            setNestedValue(Highcharts.charts[0]!, params.path, value);

            // Update active state for all buttons in this group
            const allButtons = document.querySelectorAll(
                `[data-path="${params.path}"]`
            );
            allButtons.forEach((b): void => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/**
 * Add a boolean control
 */
function addBooleanControl(
    params: BooleanControlParams,
    keyDiv: HTMLElement,
    valueDiv: HTMLElement
): void {

    const rid = params.path.replace(/[^a-z0-9_-]/gi, '-');
    keyDiv.appendChild(
        Object.assign(
            document.createElement('label'),
            {
                htmlFor: `toggle-checkbox-${rid}`,
                innerText: params.path
            }
        )
    );

    const labelToggle = valueDiv.appendChild(
        Object.assign(
            document.createElement('label'),
            { className: 'hc-toggle' }
        )
    );

    const input = labelToggle.appendChild(
        Object.assign(
            document.createElement('input'),
            {
                type: 'checkbox',
                id: `toggle-checkbox-${rid}`
            }
        )
    );

    labelToggle.appendChild(
        Object.assign(
            document.createElement('span'),
            {
                className: 'hc-toggle-slider',
                'aria-hidden': 'true'
            }
        )
    );

    // Use override value if provided, otherwise get current value from
    // chart
    const currentValue = params.value !== void 0 ?
        params.value :
        getNestedValue(Highcharts.charts[0]!.options, params.path);
    input.checked = currentValue;

    input.addEventListener('change', function (): void {
        const value = this.checked;
        setNestedValue(Highcharts.charts[0]!, params.path, value);
    });
}

/**
 * Add a color control
 */
function addColorControl(
    params: ColorControlParams,
    keyDiv: HTMLElement,
    valueDiv: HTMLElement
): void {

    const rid = params.path.replace(/[^a-z0-9_-]/gi, '-');
    keyDiv.appendChild(
        Object.assign(
            document.createElement('label'),
            {
                htmlFor: `color-input-${rid}`,
                innerText: params.path
            }
        )
    );

    const colorInput = valueDiv.appendChild(
        Object.assign(
            document.createElement('input'),
            {
                type: 'color',
                id: `color-input-${rid}`
            }
        )
    );

    const opacityInput = valueDiv.appendChild(
        Object.assign(
            document.createElement('input'),
            {
                type: 'range',
                id: `opacity-input-${rid}`,
                min: '0',
                max: '1',
                step: '0.01',
                value: '1'
            }
        )
    );

    const valueEl = valueDiv.appendChild(
        Object.assign(
            document.createElement('span'),
            {
                id: `color-value-${rid}`,
                className: 'hc-color-value'
            }
        )
    );

    // Use override value if provided, otherwise get current value from
    // chart
    const chart = Highcharts.charts[0]!;
    const currentValue = params.value !== void 0 ?
        params.value :
        (getNestedValue(chart.options, params.path) || '#000000');
    const hcColor = (Highcharts as any).color(currentValue);
    const rgba = hcColor.get('rgba');
    const opacity = hcColor.rgba[3] || 1;
    colorInput.value = currentValue;
    opacityInput.value = String(opacity);
    valueEl.textContent = rgba;

    const update = (): void => {
        const rgba = colorInput.value; // E.g. #RRGGBB
        const opacity = parseFloat(opacityInput.value);
        // Use Highcharts.color to apply opacity and produce rgba()/hex
        const hcColor = (Highcharts as any).color(rgba)
            .setOpacity(opacity).get();
        setNestedValue(chart, params.path, hcColor, false);
        valueEl.textContent = hcColor;
    };

    colorInput.addEventListener('input', update);
    opacityInput.addEventListener('input', update);
}

/**
 * Add a number control
 */
function addNumberControl(
    params: NumberControlParams,
    keyDiv: HTMLElement,
    valueDiv: HTMLElement
): void {

    const rid = params.path.replace(/[^a-z0-9_-]/gi, '-');
    keyDiv.appendChild(
        Object.assign(
            document.createElement('label'),
            {
                htmlFor: `range-input-${rid}`,
                innerText: params.path
            }
        )
    );

    const input = valueDiv.appendChild(
        Object.assign(
            document.createElement('input'),
            {
                type: 'range',
                id: `range-input-${rid}`,
                min: String(params.range ? params.range[0] : 0),
                max: String(params.range ? params.range[1] : 100),
                step: String(params.step || 1)
            }
        )
    );

    const valueEl = valueDiv.appendChild(
        Object.assign(
            document.createElement('span'),
            {
                id: `range-value-${rid}`,
                className: 'hc-range-value'
            }
        )
    );

    // Use override value if provided, otherwise get current value from
    // chart
    const currentValue = params.value !== void 0 ?
        params.value :
        (getNestedValue(Highcharts.charts[0]!.options, params.path) ?? 0);
    input.value = String(currentValue);
    valueEl.textContent = String(currentValue);

    input.addEventListener('input', function (): void {
        const value = parseFloat(this.value);
        valueEl.textContent = String(value);
        setNestedValue(Highcharts.charts[0]!, params.path, value, false);
    });
}

/**
 * Add a control
 */
export function addControl(params: ControlParams): void {

    const container = document.getElementById('highcharts-controls');

    if (!container) {
        throw new Error('Container for controls not found');
    }

    const div = container.appendChild(
        Object.assign(
            document.createElement('div'),
            { className: 'highcharts-controls-control' }
        )
    );
    const keyDiv = div.appendChild(
        Object.assign(
            document.createElement('div'),
            { className: 'highcharts-controls-key' }
        )
    );
    const valueDiv = div.appendChild(
        Object.assign(
            document.createElement('div'),
            { className: 'highcharts-controls-value' }
        )
    );

    if (isArrayControlParams(params)) {
        addArrayControl(params, keyDiv, valueDiv);
    } else if (isBooleanControlParams(params)) {
        addBooleanControl(params, keyDiv, valueDiv);
    } else if (isColorControlParams(params)) {
        addColorControl(params, keyDiv, valueDiv);
    } else if (isNumberControlParams(params)) {
        addNumberControl(params, keyDiv, valueDiv);
    }
}
