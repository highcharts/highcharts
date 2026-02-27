/* *
 *
 *  Popup generator for Stock tools
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Sebastian Bochan
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type AnnotationChart from '../AnnotationChart';
import type AnnotationOptions from '../AnnotationOptions';
import type Chart from '../../../Core/Chart/Chart';
import type { HTMLDOMElement } from '../../../Core/Renderer/DOMElementType';

import BaseForm from '../../../Shared/BaseForm.js';
import Color from '../../../Core/Color/Color.js';
import H from '../../../Core/Globals.js';
const { doc } = H;
import D from '../../../Core/Defaults.js';
const { getOptions } = D;
import PopupAnnotations from './PopupAnnotations.js';
import PopupIndicators from './PopupIndicators.js';
import PopupTabs from './PopupTabs.js';
import U from '../../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    extend,
    fireEvent,
    pick
} = U;

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
interface InputAttributes {
    value?: string;
    type?: string;
    htmlFor?: string;
    labelClassName?: string;
}

/** @internal */
export interface PopupFieldsObject {
    actionType: string;
    fields: PopupFieldsTree;
    linkedTo?: string;
    seriesId?: string;
    type?: string;
}

/** @internal */
export interface PopupFieldsTree {
    [key: string]: (string | PopupFieldsTree);
}

/* *
 *
 *  Functions
 *
 * */

/**
 * Get values from all inputs and selections then create JSON.
 *
 * @internal
 *
 * @param {Highcharts.HTMLDOMElement} parentDiv
 * The container where inputs and selections are created.
 *
 * @param {string} type
 * Type of the popup bookmark (add|edit|remove).
 */
function getFields(
    parentDiv: HTMLDOMElement,
    type: string
): PopupFieldsObject {
    const inputList = Array.prototype.slice.call(
            parentDiv.querySelectorAll('input')
        ),
        selectList = Array.prototype.slice.call(
            parentDiv.querySelectorAll('select')
        ),
        optionSeries = '#highcharts-select-series > option:checked',
        optionVolume = '#highcharts-select-volume > option:checked',
        linkedTo = parentDiv.querySelectorAll(optionSeries)[0],
        volumeTo = parentDiv.querySelectorAll(optionVolume)[0];

    const fieldsOutput: PopupFieldsObject = {
        actionType: type,
        linkedTo: linkedTo && linkedTo.getAttribute('value') || '',
        fields: { }
    };

    inputList.forEach((input: HTMLInputElement): void => {
        const param = input.getAttribute('highcharts-data-name'),
            seriesId = input.getAttribute('highcharts-data-series-id');

        // Params
        if (seriesId) {
            fieldsOutput.seriesId = input.value;
        } else if (param) {
            const wrapper = input.closest('.highcharts-popup-color-wrapper'),
                slider = wrapper?.querySelector(
                    '.highcharts-popup-opacity'
                ) as HTMLInputElement,
                opacity = slider ? Number(slider.value) / 100 : 1;

            if (slider) {
                const rgba = Color.parse(input.value).rgba;
                fieldsOutput.fields[param] = !Number.isNaN(rgba[0]) ?
                    `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${opacity})` :
                    input.value;
            } else {
                fieldsOutput.fields[param] = input.value;
            }
        } else {
            // Type like sma / ema
            fieldsOutput.type = input.value;
        }
    });

    selectList.forEach((select: HTMLInputElement): void => {
        const id = select.id;

        // Get inputs only for the parameters, not for series and volume.
        if (
            id !== 'highcharts-select-series' &&
            id !== 'highcharts-select-volume'
        ) {
            const parameter = id.split('highcharts-select-')[1];

            fieldsOutput.fields[parameter] = select.value;
        }
    });

    if (volumeTo) {
        fieldsOutput.fields['params.volumeSeriesID'] = volumeTo
            .getAttribute('value') || '';
    }

    return fieldsOutput;
}

/**
 * Resolve CSS 'var()', 'color-mix()' and 'rgba()' values to hex and alpha.
 * @internal
 */
function resolveColorValue(
    value: string,
    contextElement: HTMLDOMElement
): { value: string, alpha: number } {
    // Convert CSS variable to hex value.
    const varToHex = (value: string): string => window
        .getComputedStyle(contextElement)
        .getPropertyValue(value.slice(4, -1))
        .toUpperCase();

    // Convert rgba() value to hex value.
    const rgbaToHex = (value: string): string => {
        const [r, g, b] = Color.parse(value).rgba,
            toHex = (n: number): string =>
                ('0' + n.toString(16)).slice(-2).toUpperCase();
        return '#' + toHex(r) + toHex(g) + toHex(b);
    };

    if (value.startsWith('rgba(')) {
        return { value: rgbaToHex(value), alpha: 1 };
    }

    if (value.startsWith('var(')) {
        return { value: varToHex(value), alpha: 1 };
    }

    if (value.startsWith('color-mix(')) {
        // Split color-mix into color1, mix ratio, color2.
        const match = value.match(
            /color-mix\(in\s+srgb,\s*(.+?)\s+(\d+%),\s*(.+)\)/
        );
        if (match) {
            const color1 = match[1].trim(),
                mix = parseInt(match[2], 10) / 100,
                color2 = match[3].trim();

            // Convert both colors to hex, or return raw value if not parsable.
            const [parsedColor1, parsedColor2] =
                [color1, color2].map((color: string): string => {
                    if (color.startsWith('var(')) {
                        return varToHex(color) || '';
                    }
                    if (color.startsWith('rgba(')) {
                        return rgbaToHex(color) || '';
                    }
                    return color;
                });

            // If both colors are hex, mix them using mix ratio.
            if (parsedColor1.startsWith('#') && parsedColor2.startsWith('#')) {
                return ({
                    value: Color.parse(parsedColor1).tweenTo(
                        Color.parse(parsedColor2), mix
                    ).toString(),
                    alpha: 1
                });
            }

            // If color2 is transparent, mix ratio becomes opacity for color1.
            if (parsedColor2 === 'transparent') {
                return { value: parsedColor1, alpha: mix };
            }
        }
    }

    return { value, alpha: 1 };
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class Popup extends BaseForm {

    /* *
     *
     *  Constructor
     *
     * */

    public constructor(
        parentDiv: HTMLDOMElement,
        iconsURL: string,
        chart?: Chart
    ) {
        super(parentDiv, iconsURL);

        this.chart = chart;
        this.lang = (getOptions().lang.navigation || {}).popup as any || {};

        addEvent(this.container, 'mousedown', (): void => {
            const activeAnnotation = chart &&
                chart.navigationBindings &&
                chart.navigationBindings.activeAnnotation;

            if (activeAnnotation) {
                activeAnnotation.cancelClick = true;

                const unbind = addEvent(doc, 'click', (): void => {
                    setTimeout((): void => {
                        activeAnnotation.cancelClick = false;
                    }, 0);
                    unbind();
                });
            }
        });
    }

    /* *
     *
     *  Properties
     *
     * */

    public chart?: Chart;
    public type?: string;
    public lang: Record<string, string>;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Create input with label.
     *
     * @param {string} option
     *        Chain of fields i.e params.styles.fontSize separated by the dot.
     *
     * @param {string} indicatorType
     *        Type of the indicator i.e. sma, ema...
     *
     * @param {HTMLDOMElement} parentDiv
     *        HTML parent element.
     *
     * @param {Highcharts.InputAttributes} inputAttributes
     *        Attributes of the input.
     *
     * @return {HTMLInputElement}
     *         Return created input element.
     */
    public addInput(
        option: string,
        indicatorType: string,
        parentDiv: HTMLDOMElement,
        inputAttributes: InputAttributes
    ): HTMLDOMElement {
        const optionParamList = option.split('.'),
            optionName = optionParamList[optionParamList.length - 1],
            lang = this.lang,
            inputName = 'highcharts-' + indicatorType + '-' + pick(
                inputAttributes.htmlFor,
                optionName
            );

        if (!optionName.match(/^\d+$/)) {
            // Add label
            createElement(
                'label',
                {
                    htmlFor: inputName,
                    className: inputAttributes.labelClassName
                },
                void 0,
                parentDiv
            ).appendChild(
                doc.createTextNode(lang[optionName] || optionName)
            );
        }

        if (inputAttributes.type === 'color' && this.chart?.container) {
            return this.createColorInput(
                option,
                inputName,
                inputAttributes,
                parentDiv,
                this.chart.container
            );
        }

        // Add input
        const input = createElement(
            'input',
            {
                name: inputName,
                value: inputAttributes.value,
                type: inputAttributes.type,
                className: 'highcharts-popup-field'
            },
            void 0,
            parentDiv
        );

        input.setAttribute('highcharts-data-name', option);

        return input;
    }

    /**
     * Create color input group with color picker, text field and opacity
     * controls.
     */
    public createColorInput(
        option: string,
        inputName: string,
        inputAttributes: InputAttributes,
        parentDiv: HTMLDOMElement,
        container: HTMLDOMElement
    ): HTMLDOMElement {
        const { value, alpha } = resolveColorValue(
            inputAttributes.value || '',
            container
        );

        const parsedOpacity = Color.parse(inputAttributes.value || '').rgba[3],
            opacity = isNaN(parsedOpacity) ? alpha : parsedOpacity;

        const wrapper = createElement(
            'div',
            { className: 'highcharts-popup-color-wrapper' },
            void 0,
            parentDiv
        );

        const colorInput: HTMLInputElement = createElement(
            'input',
            {
                type: 'color',
                value,
                className: (
                    'highcharts-popup-field highcharts-popup-field-color'
                )
            },
            void 0,
            wrapper
        ) as HTMLInputElement;

        const textInput = createElement(
            'input',
            {
                name: inputName,
                id: inputName,
                value,
                type: 'text',
                className: (
                    'highcharts-popup-field highcharts-popup-field-text'
                )
            },
            void 0,
            wrapper
        ) as HTMLInputElement;
        textInput.setAttribute('highcharts-data-name', option);

        const opacitySlider = createElement(
            'input',
            {
                type: 'range',
                value: String(opacity * 100),
                className: (
                    'highcharts-popup-field highcharts-popup-opacity'
                ),
                min: '0',
                max: '100'
            },
            void 0,
            wrapper
        ) as HTMLInputElement;

        const opacityNumberInput = createElement(
            'input',
            {
                type: 'number',
                value: String(opacity),
                className: (
                    'highcharts-popup-field highcharts-popup-opacity-number'
                ),
                min: '0',
                max: '1',
                step: '0.01'
            },
            void 0,
            wrapper
        ) as HTMLInputElement;

        const setOpacitySliderColor = (): void => {
            opacitySlider.style.setProperty(
                '--highcharts-slider-rgb',
                textInput.value
            );
        };
        setOpacitySliderColor();

        addEvent(opacitySlider, 'input', (): void => {
            opacityNumberInput.value = String(
                Number(opacitySlider.value) / 100
            );
        });
        addEvent(opacityNumberInput, 'input', (): void => {
            opacitySlider.value = String(
                Number(opacityNumberInput.value) * 100
            );
        });
        addEvent(colorInput, 'input', (): void => {
            textInput.value = colorInput.value.toUpperCase();
            setOpacitySliderColor();
        });
        addEvent(textInput, 'input', (): void => {
            colorInput.value = textInput.value;
            setOpacitySliderColor();
        });

        return wrapper;
    }

    public closeButtonEvents(): void {
        if (this.chart) {
            const navigationBindings = this.chart.navigationBindings;

            fireEvent(navigationBindings, 'closePopup');

            if (
                navigationBindings &&
                navigationBindings.selectedButtonElement
            ) {
                fireEvent(
                    navigationBindings,
                    'deselectButton',
                    { button: navigationBindings.selectedButtonElement }
                );
            }
        } else {
            super.closeButtonEvents();
        }
    }

    /**
     * Create button.
     *
     * @param {Highcharts.HTMLDOMElement} parentDiv
     * Container where elements should be added
     * @param {string} label
     * Text placed as button label
     * @param {string} type
     * add | edit | remove
     * @param {Function} callback
     * On click callback
     * @param {Highcharts.HTMLDOMElement} fieldsDiv
     * Container where inputs are generated
     * @return {Highcharts.HTMLDOMElement}
     * HTML button
     */
    public addButton(
        parentDiv: HTMLDOMElement,
        label: string,
        type: string,
        fieldsDiv: HTMLDOMElement,
        callback?: Function
    ): HTMLDOMElement {

        const button = createElement('button', void 0, void 0, parentDiv);

        button.appendChild(doc.createTextNode(label));

        if (callback) {
            ['click', 'touchstart'].forEach((eventName: string): void => {
                addEvent(button, eventName, (): void => {
                    this.closePopup();

                    return callback(getFields(fieldsDiv, type));
                });
            });
        }

        return button;
    }

    /**
     * Create content and show popup.
     *
     * @param {string} - type of popup i.e indicators
     * @param {Highcharts.Chart} - chart
     * @param {Highcharts.AnnotationsOptions} - options
     * @param {Function} - on click callback
     */
    public showForm(
        type: string,
        chart: AnnotationChart,
        options: AnnotationOptions,
        callback: Function
    ): void {

        if (!chart) {
            return;
        }

        // Show blank popup
        this.showPopup();

        // Indicator form
        if (type === 'indicators') {
            this.indicators.addForm.call(this, chart, options, callback);
        }

        // Annotation small toolbar
        if (type === 'annotation-toolbar') {
            this.annotations.addToolbar.call(this, chart, options, callback);
        }

        // Annotation edit form
        if (type === 'annotation-edit') {
            this.annotations.addForm.call(this, chart, options, callback);
        }

        // Flags form - add / edit
        if (type === 'flag') {
            this.annotations.addForm.call(this, chart, options, callback, true);
        }

        this.type = type;

        // Explicit height is needed to make inner elements scrollable
        this.container.style.height = this.container.offsetHeight + 'px';
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface Popup {
    readonly annotations: typeof PopupAnnotations;
    readonly indicators: typeof PopupIndicators;
    readonly tabs: typeof PopupTabs;
}

extend(Popup.prototype, {
    annotations: PopupAnnotations,
    indicators: PopupIndicators,
    tabs: PopupTabs
});

/* *
 *
 *  Default Export
 *
 * */

/** @internal */
export default Popup;
