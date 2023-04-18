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

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type MenuItem from './Menu/MenuItem.js';
import type CSSObject from '../../Core/Renderer/CSSObject';

import EditMode from './EditMode.js';
import EditGlobals from './EditGlobals.js';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType.js';
import U from '../../Core/Utilities.js';
const {
    merge,
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
            }, {
                background: 'url(' +
                    editMode.options.contextMenu.icon +
                ') no-repeat 50% 50%'
            }, parentNode
        );
    }

    return ctxBtnElement;
}

function renderCollapse(
    parentElement: HTMLDOMElement,
    title: string
): { outerElement: HTMLDOMElement; content: HTMLDOMElement } {

    const accordeon = createElement(
        'div',
        {
            className:
                EditGlobals.classNames.accordeonContainer +
                ' ' +
                EditGlobals.classNames.collapsableContentHeader
        },
        {},
        parentElement
    );
    const header = createElement(
        'div',
        {
            className: EditGlobals.classNames.accordeonHeader
        },
        {},
        accordeon
    );

    const headerBtn = createElement(
        'button',
        { className: EditGlobals.classNames.accordeonHeaderBtn },
        {},
        header
    );
    createElement(
        'span',
        { textContent: title },
        {},
        headerBtn
    );

    const headerIcon = createElement(
        'img',
        {
            className:
                EditGlobals.classNames.accordeonHeaderIcon +
                ' ' +
                EditGlobals.classNames.rotateElement,
            src: EditGlobals.iconsURLPrefix + 'dropdown-pointer.svg'
        },
        {},
        headerBtn
    );

    const content = createElement(
        'div',
        {
            className:
                EditGlobals.classNames.accordeonContent +
                ' ' +
                EditGlobals.classNames.hiddenElement
        },
        {},
        accordeon
    );

    headerBtn.addEventListener('click', function (): void {
        content.classList.toggle(EditGlobals.classNames.hiddenElement);
        headerIcon.classList.toggle(EditGlobals.classNames.rotateElement);
    });

    return { outerElement: accordeon, content: content };
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

    if (options.name) {
        renderText(
            parentElement,
            options.name,
            void 0,
            true
        );
    }

    const iconsURLPrefix = options.iconsURLPrefix || '';
    const customSelect = createElement(
        'div',
        {
            className: EditGlobals.classNames.dropdown +
                ' ' +
                EditGlobals.classNames.collapsableContentHeader
        },
        {},
        parentElement
    );

    const btn = createElement(
        'button',
        {
            className: EditGlobals.classNames.dropdownButton
        },
        {},
        customSelect
    );

    const btnContent = createElement(
        'div',
        {},
        {},
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
                src: iconsURLPrefix + iconURL,
                className: EditGlobals.classNames.icon
            },
            {},
            btnContent
        );
    }
    const placeholder = createElement(
        'span',
        {
            textContent: options.value,
            id: options.id || ''
        },
        {},
        btnContent
    );
    const dropdownPointer = createElement(
        'img',
        {
            className:
                EditGlobals.classNames.dropdownIcon +
                ' ' +
                EditGlobals.classNames.rotateElement,
            src: iconsURLPrefix + 'dropdown-pointer.svg'
        },
        {},
        btn
    );

    const dropdown = createElement(
        'ul',
        {
            className:
                EditGlobals.classNames.dropdownContent +
                ' ' +
                EditGlobals.classNames.hiddenElement
        },
        {},
        customSelect
    );
    btn.addEventListener('click', function (): void {
        dropdown.classList.toggle(EditGlobals.classNames.hiddenElement);
        dropdownPointer.classList.toggle(EditGlobals.classNames.rotateElement);
    });

    for (let i = 0, iEnd = options.items.length; i < iEnd; ++i) {
        renderSelectElement(
            merge(options.items[i] || {}, { iconsURLPrefix }),
            dropdown,
            placeholder,
            options.id,
            dropdownPointer,
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
    dropdownPointer: HTMLElement,
    headerIcon?: HTMLElement,
    callback?: Function
): void {
    const iconURL = option.iconsURLPrefix + option.iconURL;
    const selectOption = createElement('li', {}, {}, dropdown);
    const selectOptionBtn = createElement(
        'button',
        { className: EditGlobals.classNames.customSelectButton },
        {},
        selectOption
    );

    let icon: HTMLElement|undefined;

    if (option.iconURL) {
        icon = createElement(
            'img',
            {
                src: iconURL
            },
            {},
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
        dropdown.classList.remove(EditGlobals.classNames.hiddenElement);
        dropdownPointer.classList.toggle(EditGlobals.classNames.rotateElement);
        placeholder.textContent = option.name || '';

        if (headerIcon && option.iconURL) {
            (headerIcon as HTMLImageElement).src = iconURL;
        }

        if (callback) {
            return callback(option.name);
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

    if (!parentElement) {
        return;
    }

    const toggleContainer = createElement(
        'div',
        { className: EditGlobals.classNames.toggleContainer },
        {},
        parentElement
    );
    if (options.title) {
        renderText(
            toggleContainer,
            options.title
        );
    }

    if (options.enabledOnOffLabels) {
        EditRenderer.renderText(
            toggleContainer,
            EditGlobals.lang.off,
            EditGlobals.classNames.toggleLabels
        );
    }

    const toggle = createElement(
        'label',
        {
            className: EditGlobals.classNames.toggleWrapper +
            ' ' + (options.className || '')
        },
        {},
        toggleContainer
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

    if (options.enabledOnOffLabels) {
        EditRenderer.renderText(
            toggleContainer,
            EditGlobals.lang.on,
            EditGlobals.classNames.toggleLabels
        );
    }

    return toggleContainer;
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
    className?: string,
    isLabel?: boolean
): HTMLDOMElement|undefined {
    let textElem;

    if (parentElement) {
        const labelFor = isLabel ? { htmlFor: text } : {};
        textElem = createElement(
            isLabel ? 'label' : 'div',
            {
                className: EditGlobals.classNames.labelText +
                        ' ' + (className || ''),
                textContent: text,
                ...labelFor
            }, {},
            parentElement
        );
    }

    return textElem;
}

function renderNestedHeader(
    parentElement: HTMLDOMElement,
    name: string,
    allowEnabled: boolean
): HTMLDOMElement {
    const nested = createElement(
        'div',
        {
            className: EditGlobals.classNames.accordeonNestedWrapper + ' ' +
            EditGlobals.classNames.collapsableContentHeader
        },
        {},
        parentElement
    );

    const header = createElement(
        'div',
        {
            className: EditGlobals.classNames.accordeonNestedHeader
        },
        {},
        nested
    );

    const headerBtn = createElement(
        'button',
        { className: EditGlobals.classNames.accordeonNestedHeaderBtn },
        {},
        header
    );

    const headerIcon = createElement(
        'img',
        {
            className:
                EditGlobals.classNames.accordeonNestedHeaderIcon +
                ' ' +
                EditGlobals.classNames.rotateElement,
            src: EditGlobals.iconsURLPrefix + 'dropdown-pointer.svg'
        },
        {},
        headerBtn
    );

    createElement('span', { textContent: name }, {}, headerBtn);

    if (allowEnabled) {
        renderToggle(header, {
            enabledOnOffLabels: true,
            id: name,
            name: name
        });
    }

    const content = createElement(
        'div',
        {
            className:
                EditGlobals.classNames.accordeonNestedContent +
                ' ' +
                EditGlobals.classNames.hiddenElement
        },
        {},
        nested
    );

    headerBtn.addEventListener('click', function (): void {
        content.classList.toggle(EditGlobals.classNames.hiddenElement);
        headerIcon.classList.toggle(
            EditGlobals.classNames.rotateElement
        );
    });

    return content;
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
    options: IconFormField
): HTMLDOMElement|undefined {
    const { icon, callback } = options;

    if (!parentElement) {
        return;
    }

    const iconElem = createElement(
        'div', {
            onclick: callback,
            className: options.className || ''
        }, {},
        parentElement
    );

    (iconElem.style as any)['background-image'] = 'url(' + icon + ')';

    const mousedown = options.mousedown;
    if (mousedown) {
        iconElem.onmousedown = function (): void {
            mousedown.apply(options.menuItem, arguments);
        };
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
): HTMLDOMElement | undefined {

    if (!parentElement) {
        return;
    }

    if (options.name) {
        renderText(
            parentElement,
            options.name,
            void 0,
            true
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
            onchange(e.target.value);
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

    if (options.name) {
        renderText(
            parentElement,
            options.name,
            void 0,
            true
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
            onchange(e.target.value);
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

    if (!parentElement) {
        return;
    }

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

    return button;
}

function getRendererFunction(type: RendererElement): Function|undefined {
    return {
        select: renderSelect,
        toggle: renderToggle,
        text: renderText,
        collapse: renderCollapse,
        icon: renderIcon,
        contextButton: renderContextButton,
        input: renderInput,
        textarea: renderTextarea,
        checkbox: renderCheckbox,
        nestedHeaders: renderNestedHeader,
        button: renderButton
    }[type];
}


const EditRenderer = {
    renderSelect,
    renderToggle,
    renderText,
    renderCollapse,
    renderIcon,
    renderContextButton,
    renderInput,
    renderTextarea,
    renderCheckbox,
    renderButton,
    renderNestedHeaders: renderNestedHeader,
    getRendererFunction
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

export interface IconFormField {
    className?: string;
    icon: string;
    mousedown?: Function;
    menuItem?: MenuItem;
    callback?: Function;
}
export interface FormField {
    propertyPath?: Array<string>;
    iconsURLPrefix?: string;
    icon?: string;
    id: string;
    name: string;
    callback?: Function;
    title?: string;
    onchange?: Function;
    value?: string;
    className?: string;
    enabledOnOffLabels?: boolean;
}

export interface SelectFormField extends FormField {
    title: string;
    value: string;
    items: Array<SelectFormFieldItem>;
}

export interface SelectFormFieldItem {
    iconsURLPrefix: string
    name: string;
    iconURL: string;
}

export interface NestedFormField {
    nestedOptions: Record<string, NestedOptions>;
}
export interface NestedOptions {

}

export type RendererElement =
    | 'select'
    | 'toggle'
    | 'text'
    | 'collapse'
    | 'nestedHeaders'
    | 'icon'
    | 'contextButton'
    | 'input'
    | 'textarea'
    | 'checkbox'
    | 'button';
