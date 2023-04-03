/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

import EditMode from './EditMode.js';
import EditGlobals from './EditGlobals.js';
import U from '../../Core/Utilities.js';
import type CSSObject from '../../Core/Renderer/CSSObject';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import Globals from '../Globals.js';

const {
    createElement
} = U;


/* *
*
*  Functions
*
* */

/**
 * Function to create a context button.
 * @intenal
 *
 * @param parentElement
 * The element to which the new elemenet should be appended.
 *
 * @param editMode
 * EditMode instance.
 *
 * @returns
 * Context button element.
 */
function renderContextButton(
    parentNode: HTMLDOMElement,
    editMode: EditMode
): HTMLDOMElement|undefined {

    let ctxBtnElement;

    if (editMode.options.contextMenu) {
        ctxBtnElement = createElement(
            'button', {
                className: EditGlobals.classNames.contextMenuBtn,
                onclick: function (): void {
                    editMode.onContextBtnClick(editMode);
                }
            }, {}, parentNode
        );
        ctxBtnElement.style.background = 'url(' +
            editMode.options.contextMenu.icon +
        ') no-repeat 50% 50%';
    }

    return ctxBtnElement;
}

/**
 * Function to create select element.
 *
 * @param parentElement
 * The element to which the new elemenet should be appended.
 *
 * @param options
 * Select form field options.
 *
 * @returns
 * Select element
 */
function renderSelect(
    parentElement: HTMLDOMElement,
    options: SelectFormField
): HTMLDOMElement|undefined {
    if (!parentElement) {
        return;
    }

    if (options.title) {
        renderText(parentElement, options.title);
    }
    const customSelect = createElement(
        'div',
        {
            className: 'highcharts-dashboards-dropdown'
        },
        {},
        parentElement
    );

    const btn = createElement(
        'button',
        {
            className: 'highcharts-dashboards-dropdown-button'
        },
        {
            margin: 0
        },
        customSelect
    );
    const btnContent = createElement(
        'div',
        {},
        { display: 'flex', 'align-items': 'center' },
        btn
    );
    const iconURL = (
        U.find(options.items, (item): boolean => item.name === options.value) ||
        {}
    ).iconURL;

    let headerIcon;

    if (iconURL) {
        headerIcon = createElement(
            'img',
            {
                src: iconURL,
                className: 'highcharts-dashboards-icon'
            },
            {},
            btnContent
        );
    }
    const placeholder = createElement(
        'span',
        {
            textContent: options.value,
            id: options.id
        },
        {},
        btnContent
    );
    createElement(
        'img',
        {
            className: 'highcharts-dashboards-dropdown-pointer',
            src: Globals.iconsURLPrefix + 'dropdown-pointer.svg'
        },
        {},
        btn
    );

    let dropdown = createElement(
        'ul',
        {
            className: 'highcharts-dashboards-dropdown-content'
        },
        {
            display: 'none'
        },
        customSelect
    );
    btn.addEventListener('click', function (): void {
        dropdown.style.display =
            dropdown.style.display === 'none' ? 'flex' : 'none';
    });

    for (let i = 0, iEnd = options.items.length; i < iEnd; ++i) {
        renderSelectElement(
            options.items[i] || {},
            dropdown,
            placeholder,
            options.id,
            headerIcon,
            options.onchange
        );
    }
    return customSelect;
}

/**
 * @internal
 */
function renderSelectElement(
    option: SelectFormFieldItem,
    dropdown: HTMLElement,
    placeholder: HTMLElement,
    id: string,
    headerIcon?: HTMLElement,
    callback?: Function
): void {
    const selectOption = createElement('li', {}, { margin: 0 }, dropdown);
    const selectOptionBtn = createElement(
        'button',
        { className: 'highcharts-dashboards-select-option-button' },
        { height: '40px', width: '100%' },
        selectOption
    );

    let icon: HTMLElement|undefined;
    if (option.iconURL) {
        icon = createElement(
            'img',
            {
                src: option.iconURL
            },
            { width: '24px', height: '24px' },
            selectOptionBtn
        );
    }
    createElement(
        'span',
        { textContent: option.name || '' },
        {},
        selectOptionBtn
    );

    selectOptionBtn.addEventListener('click', function (): void {
        dropdown.style.display = 'none';
        placeholder.textContent = option.name || '';

        if (headerIcon && option.iconURL) {
            (headerIcon as HTMLImageElement).src = option.iconURL;
        }

        if (callback) {
            return callback(id, option.name);
        }
    });
}

/**
 * Function to create toggle element.
 *
 * @param parentElement
 * The element to which the new elemenet should be appended.
 *
 * @param options
 * Form field options
 *
 * @returns
 * Toggle element
 */
function renderToggle(
    parentElement: HTMLDOMElement,
    options: FormField
): HTMLDOMElement|undefined {
    let toggle;

    if (parentElement) {

        if (options.title) {
            renderText(
                parentElement,
                options.title
            );
        }

        toggle = createElement(
            'label',
            {
                className: EditGlobals.classNames.toggleWrapper
            },
            {},
            parentElement
        );

        renderCheckbox(toggle);

        createElement(
            'span',
            {
                className: EditGlobals.classNames.toggleSlider,
                onclick: options.callback
            },
            {},
            toggle
        );
    }

    return toggle;
}

/**
 * Function to create text element.
 *
 * @param parentElement
 * The element to which the new elemenet should be appended
 *
 * @param text
 * Text to be displayed
 *
 * @param callback
 * Callback function to be fired on the click
 *
 * @returns text Element
 */
function renderText(
    parentElement: HTMLDOMElement,
    text: string,
    callback?: Function
): HTMLDOMElement|undefined {
    let textElem;

    if (parentElement) {
        textElem = createElement(
            'div', {
                className: EditGlobals.classNames.labelText,
                textContent: text,
                onclick: callback
            }, {},
            parentElement
        );
    }

    return textElem;
}

/**
 * Function to create Icon element.
 *
 * @param parentElement
 * The element to which the new elemenet should be appended.
 *
 * @param icon
 * Icon URL
 *
 * @param callback
 * Callback function
 *
 * @returns
 * Icon Element
 */
function renderIcon(
    parentElement: HTMLDOMElement,
    icon: string,
    callback?: Function
): HTMLDOMElement|undefined {
    let iconElem;

    if (parentElement) {
        iconElem = createElement(
            'div', {
                onclick: callback
            }, {},
            parentElement
        );

        (iconElem.style as any)['background-image'] = 'url(' + icon + ')';
    }

    return iconElem;
}

/**
 * Function to create input element.
 *
 * @param parentElement
 * the element to which the new elemenet should be appended
 *
 * @param options
 * Form field options
 *
 * @returns
 * Input Element
 */
function renderInput(
    parentElement: HTMLDOMElement,
    options: FormField
): HTMLDOMElement|undefined {

    if (!parentElement) {
        return;
    }

    if (options.title) {
        renderText(
            parentElement,
            options.title
        );
    }

    const input = createElement(
        'input', {
            type: 'text',
            onclick: options.callback,
            id: options.id || '',
            name: options.name || '',
            value: (
                options.value && options.value.replace(/\"/g, '') ||
                ''
            )
        },
        {},
        parentElement
    );

    const onchange = options.onchange;
    if (onchange) {
        input.addEventListener('change', function (e: any): void {
            onchange(options.id, e.target.value);
        });
    }
    return input;
}

/**
 * Function to create textarea element.
 *
 * @param parentElement
 * The element to which the new elemenet should be appended
 *
 * @param options
 * Form field options
 *
 * @returns
 * textarea Element
 */
function renderTextarea(
    parentElement: HTMLDOMElement,
    options: FormField
): HTMLDOMElement|undefined {

    if (!parentElement) {
        return;
    }

    if (options.title) {
        renderText(
            parentElement,
            options.title
        );
    }

    const textarea = createElement(
        'textarea', {
            id: options.id,
            name: options.name,
            value: options.value || ''
        }, {

        },
        parentElement
    );

    const onchange = options.onchange;
    if (onchange) {
        textarea.addEventListener('change', function (e: any): void {
            onchange(options.id, e.target.value);
        });
    }

    return textarea;
}

function renderCheckbox(
    parentElement: HTMLDOMElement
): HTMLDOMElement|undefined {
    let input;

    if (parentElement) {
        input = createElement(
            'input', {
                type: 'checkbox'
            }, {

            },
            parentElement
        );
    }

    return input;
}

/**
 * Function to create button element.
 *
 * @param parentElement
 * the element to which the new elemenet should be appended
 *
 * @param options
 * Button field options
 *
 * @returns
 * Button Element
 */
function renderButton(
    parentElement: HTMLDOMElement,
    options: ButtonOptions
): HTMLDOMElement|undefined {
    let button;

    if (parentElement) {
        button = createElement(
            'button', {
                className: (
                    EditGlobals.classNames.button + ' ' +
                    (options.className || '')
                ),
                onclick: options.callback,
                textContent: options.value
            }, options.style || {},
            parentElement
        );

        if (options.icon) {
            (button.style as any)['background-image'] =
                'url(' + options.icon + ')';
        }
    }

    return button;
}


const EditRenderer = {
    renderSelect,
    renderToggle,
    renderText,
    renderIcon,
    renderContextButton,
    renderInput,
    renderTextarea,
    renderCheckbox,
    renderButton
};

export default EditRenderer;

export interface ButtonOptions {
    callback?: Function;
    value?: string;
    className?: string;
    icon?: string;
    isDisabled?: boolean;
    style?: CSSObject;
}

export interface FormField {
    id: string;
    name: string;
    callback?: Function;
    title?: string;
    onchange?: Function;
    value?: string;
}

export interface SelectFormField {
    callback?: Function;
    onchange?: Function;
    id: string;
    name: string;
    title: string;
    value: string;
    items: Array<SelectFormFieldItem>;
}

export interface SelectFormFieldItem {
    name: 'string';
    iconURL: 'string';

}
