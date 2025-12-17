/**
 * Highcharts Demo Kit
 *
 * Provides UI controls to manipulate chart options on the fly.
 *
 * Used by the sample generator to create interactive samples:
 * - node tools/sample-generator/index.ts
 */

/* eslint-disable @highcharts/highcharts/no-highcharts-object */

const Global = (window as any).Highcharts || (window as any).Grid;

interface GenericOptionsObject {
    [key: string]: any;
}
interface ControlTarget {
    options: GenericOptionsObject;
    getOptions(): GenericOptionsObject|void;
    update(
        options: GenericOptionsObject,
        redraw?: boolean,
        oneToOne?: boolean,
        animation?: boolean
    ): void;
}

interface ControlParams {
    type: 'boolean'|'color'|'number'|'array-of-strings';
    path: string;
    value?: any;
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

interface ControlsOptionsObject {
    target?: ControlTarget;
    controls: Array<
        ArrayControlParams|
        BooleanControlParams|
        ColorControlParams|
        NumberControlParams
    >;
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
    chart: ControlTarget,
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

class Controls {
    public container: HTMLElement;
    public target: ControlTarget;

    constructor(renderTo: string|HTMLElement, options: ControlsOptionsObject) {
        renderTo = (
            typeof renderTo === 'string' &&
            document.getElementById(renderTo)
        ) ||
            (
                typeof renderTo === 'object' && renderTo
            ) ||
            document.body.appendChild(Object.assign(
                document.createElement('div')
            ));

        const outerContainer = (renderTo as HTMLElement).appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'highcharts-controls' }
            )
        );

        this.container = outerContainer.appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'highcharts-controls-container' }
            )
        );

        this.target = (
            options.target ||
            Global?.charts?.[0] ||
            Global?.grids?.[0]
        ) as ControlTarget;
        if (!this.target) {
            throw new Error('No target chart found for Highcharts Controls');
        }

        // Add the controls
        options.controls?.forEach((control): void => {
            this.addControl(control);
        });

        this.addPreview();

        // Keep the options preview updated
        this.updateOptionsPreview();
        Global.addEvent?.(
            this.target,
            'render',
            this.updateOptionsPreview.bind(this)
        );
    }

    private addPreview(): void {

        const div = this.container.appendChild(
            Object.assign(
                document.createElement('div'),
                {
                    className: 'highcharts-controls-control button-control'
                }
            )
        );
        div.appendChild(
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
        const valueDivInner = valueDiv.appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'highcharts-controls-value-inner' }
            )
        );

        // Add the button
        const button = valueDivInner.appendChild(
            Object.assign(
                document.createElement('button'),
                {
                    className: 'highcharts-controls-button show-preview-button',
                    innerText: 'Preview Options'
                }
            )
        );

        button.addEventListener('click', (): void => {
            const previewSection = this.container.querySelector(
                '.preview-section'
            ) as HTMLElement;
            if (previewSection) {
                const isHidden = previewSection.classList.contains('hidden');
                previewSection.classList.toggle('hidden');
                button.innerText = isHidden ?
                    'Hide Options Preview' :
                    'Show Options Preview';
            }
        });

        // Add the preview element
        this.container.appendChild(
            Object.assign(
                document.createElement('div'),
                {
                    className: 'preview-section hidden',
                    innerHTML:
                        '<h3>Chart Options Preview</h3>' +
                        '<pre class="options-preview"></pre>'
                }
            )
        );
    }

    /**
     * Add an array of strings control
     */
    private addArrayControl(
        params: ArrayControlParams,
        keyDiv: HTMLElement,
        valueDiv: HTMLElement
    ): void {
        const { target } = this;
        keyDiv.appendChild(
            Object.assign(
                document.createElement('label'),
                {
                    innerText: params.path
                }
            )
        );

        valueDiv.classList.add('button-group');

        params.options.forEach((option): void => {
            const button = valueDiv.appendChild(
                Object.assign(
                    document.createElement('button'),
                    {
                        className: 'highcharts-controls-button' +
                            (params.value === option ? ' active' : ''),
                        innerText: option
                    }
                )
            );
            button.dataset.path = params.path;
            button.dataset.value = option;

            button.addEventListener(
                'click',
                function (this: HTMLElement): void {
                    const value = this.getAttribute('data-value');
                    setNestedValue(target, params.path, value);

                    // Update active state for all buttons in this group
                    const allButtons = document.querySelectorAll(
                        `[data-path="${params.path}"]`
                    );
                    allButtons.forEach(
                        (b): void => b.classList.remove('active')
                    );
                    this.classList.add('active');
                }
            );
        });
    }

    /**
     * Add a boolean control
     */
    private addBooleanControl(
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
            getNestedValue(this.target.options, params.path);
        input.checked = currentValue;

        input.addEventListener('change', (): void => {
            const value = input.checked;
            setNestedValue(this.target, params.path, value);
        });
    }

    /**
     * Add a color control
     */
    private addColorControl(
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

        const valueEl = valueDiv.appendChild(
            Object.assign(
                document.createElement('label'),
                {
                    id: `color-value-${rid}`,
                    className: 'hc-color-value',
                    htmlFor: `color-input-${rid}`
                }
            )
        );

        valueDiv.classList.add('color-control');

        const opacityInput = valueDiv.appendChild(
            Object.assign(
                document.createElement('input'),
                {
                    type: 'text',
                    id: `opacity-input-${rid}`,
                    className: 'opacity-input'
                }
            )
        );

        valueDiv.appendChild(
            Object.assign(
                document.createElement('span'),
                {
                    textContent: '%',
                    className: 'opacity-input-label'
                }
            )
        );

        const getHex = (color: { rgba: number[] }): string => {
            const rgba = color.rgba;
            return (`#${(
                ((1 << 24) +
                (rgba[0] << 16) +
                (rgba[1] << 8) +
                rgba[2]
                )
                    .toString(16)
                    .slice(1)
            ).toLowerCase()}`);
        };

        // Add a validator for the opacity input. It should be a number between
        // 0 and 100.
        opacityInput.addEventListener('input', (): void => {
            let value = parseFloat(opacityInput.value);
            if (isNaN(value)) {
                value = 100;
            }
            if (value < 0) {
                value = 0;
            } else if (value > 100) {
                value = 100;
            }
            opacityInput.value = String(value);
        });

        // Use override value if provided, otherwise get current value from
        // chart
        const currentValue = params.value !== void 0 ?
            params.value :
            (getNestedValue(this.target.options, params.path) || '#000000');
        const hcColor = Global.color(currentValue);
        const opacity = (hcColor.rgba[3] || 1) * 100;
        colorInput.value = currentValue;
        opacityInput.value = String(opacity);
        valueEl.textContent = getHex(hcColor);

        const update = (): void => {
            const rgba = colorInput.value; // E.g. #RRGGBB
            const opacity = parseFloat(opacityInput.value) / 100;
            // Use Highcharts.color to apply opacity and produce rgba()/hex
            const hcColor = Global.color(rgba)
                .setOpacity(opacity);
            setNestedValue(this.target, params.path, hcColor.get(), false);
            valueEl.textContent = getHex(hcColor);
        };

        colorInput.addEventListener('input', update);
        opacityInput.addEventListener('input', update);
    }

    /**
     * Add a number control
     */
    private addNumberControl(
        params: NumberControlParams,
        keyDiv: HTMLElement,
        valueDiv: HTMLElement
    ): void {

        const rid = params.path.replace(/[^a-z0-9_-]/gi, '-');

        if (!params.range) {
            if (/(lineWidth|borderWidth)$/i.test(params.path)) {
                params.range = [0, 5];

            } else if (/\.(x|y|offsetX|offsetY|offset)$/i.test(params.path)) {
                params.range = [-100, 100];
            }
        }


        keyDiv.appendChild(
            Object.assign(
                document.createElement('label'),
                {
                    htmlFor: `range-input-${rid}`,
                    innerText: params.path
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

        // Use override value if provided, otherwise get current value from
        // chart
        const currentValue = params.value !== void 0 ?
            params.value :
            (getNestedValue(this.target.options, params.path) ?? 0);
        input.value = String(currentValue);
        valueEl.textContent = String(currentValue);

        input.addEventListener('input', (): void => {
            const value = parseFloat(input.value);
            valueEl.textContent = String(value);
            setNestedValue(this.target, params.path, value, false);
        });
    }

    /**
     * Add a control
     */
    public addControl(params: ControlParams): void {

        if (!this.container) {
            throw new Error('Container for controls not found');
        }

        if (!('value' in params)) {
            // Set default value from chart options
            params.value = getNestedValue(
                Global.defaultOptions,
                params.path
            );
        }

        const div = this.container.appendChild(
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

        const valueDivInner = valueDiv.appendChild(
            Object.assign(
                document.createElement('div'),
                { className: 'highcharts-controls-value-inner' }
            )
        );

        if (isArrayControlParams(params)) {
            this.addArrayControl(params, keyDiv, valueDivInner);
        } else if (isBooleanControlParams(params)) {
            this.addBooleanControl(params, keyDiv, valueDivInner);
        } else if (isColorControlParams(params)) {
            this.addColorControl(params, keyDiv, valueDivInner);
        } else if (isNumberControlParams(params)) {
            this.addNumberControl(params, keyDiv, valueDivInner);
        }
    }


    /**
     * Update the options preview element with the current chart options.
     */
    private updateOptionsPreview(): void {
        const previewEl = this.container.parentElement
            ?.querySelector('.options-preview');
        if (previewEl) {
            const options = this.target.getOptions() || {};
            // Empty xAxis and yAxis structures
            Object.keys(options).forEach((key): void => {
                if (JSON.stringify((options as any)[key]) === '[{}]') {
                    delete (options as any)[key];
                }
            });
            previewEl.textContent = JSON.stringify(options, null, 2);
        }
    }
}

/**
 * Export the factory function
 */
export function controls(
    container: HTMLElement|string,
    options: ControlsOptionsObject
): Controls {
    return new Controls(container, options);
}
