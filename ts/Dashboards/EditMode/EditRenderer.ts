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
import type EditMode from './EditMode.js';

import EditGlobals from './EditGlobals.js';
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
    parentNode: HTMLElement,
    editMode: EditMode
): HTMLElement|undefined {

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

/**
 * Creates the collapsable header element.
 * @internal
 *
 * @param parentElement
 * The HTMLElement to which the element should be rendered to.
 *
 * @param options
 * Nested header options.
 *
 * @returns the outer element and content in the collapsable div.
 */
function renderCollapseHeader(
    parentElement: HTMLElement,
    options: NestedHeaderFormFieldOptions
): { outerElement: HTMLElement; content: HTMLElement } {

    const {
        name,
        allowEnabled,
        onchange,
        isEnabled,
        isNested
    } = options;

    const accordion = createElement(
        'div',
        {
            className:
                EditGlobals.classNames[
                    isNested ? 'accordionNestedWrapper' : 'accordionContainer'
                ] + ' ' + EditGlobals.classNames.collapsableContentHeader
        },
        {},
        parentElement
    );
    const header = createElement(
        'div',
        {
            className: EditGlobals.classNames.accordionHeader
        },
        {},
        accordion
    );

    const headerBtn = createElement(
        'button',
        { className: EditGlobals.classNames.accordionHeaderBtn },
        {},
        header
    );

    createElement(
        'span',
        {
            textContent: (EditGlobals.lang)[name] || name
        },
        {},
        headerBtn
    );

    if (allowEnabled) {
        renderToggle(header, {
            enabledOnOffLabels: true,
            id: name,
            name: name,
            onchange,
            value: isEnabled || false
        });
    }

    const headerIcon = createElement(
        'img',
        {
            className:
                EditGlobals.classNames.accordionHeaderIcon + ' ' +
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
                EditGlobals.classNames.accordionContent + ' ' +
                EditGlobals.classNames.hiddenElement
        },
        {},
        accordion
    );

    headerBtn.addEventListener('click', function (): void {
        content.classList.toggle(EditGlobals.classNames.hiddenElement);
        headerIcon.classList.toggle(EditGlobals.classNames.rotateElement);
    });

    return { outerElement: accordion, content: content };
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
    parentElement: HTMLElement,
    options: SelectFormFieldOptions
): HTMLElement|undefined {
    if (!parentElement) {
        return;
    }

    if (options.name) {
        renderText(parentElement, { title: options.name, isLabel: true });
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
        {
            className: EditGlobals.classNames.dropdownButtonContent
        },
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
    option: SelectFormFieldItemOptions,
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
        dropdown.classList.add(EditGlobals.classNames.hiddenElement);
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
    parentElement: HTMLElement,
    options: ToggleFormFieldOptions
): HTMLElement|undefined {

    if (!parentElement) {
        return;
    }

    const { value, title } = options;
    const toggleContainer = createElement(
        'div',
        { className: EditGlobals.classNames.toggleContainer },
        {},
        parentElement
    );
    if (title) {
        renderText(toggleContainer, { title });
    }

    if (options.enabledOnOffLabels) {
        EditRenderer.renderText(toggleContainer, {
            title: EditGlobals.lang.off,
            className: EditGlobals.classNames.toggleLabels
        });
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

    const input = renderCheckbox(toggle, value);
    const onchange = options.onchange;
    if (input && onchange) {
        input.addEventListener('change', (e: any): void => {
            onchange(e.target.checked);
        });

        toggleContainer.addEventListener('click', (e: any): void => {
            onchange((input as HTMLInputElement).checked);
            (input as HTMLInputElement).checked = !(input as HTMLInputElement)
                .checked;
        });
    }


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
        EditRenderer.renderText(toggleContainer, {
            title: EditGlobals.lang.on,
            className: EditGlobals.classNames.toggleLabels
        });
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
    parentElement: HTMLElement,
    options: TextOptions
): HTMLElement | undefined {
    let textElem;

    const { title: text, className, isLabel } = options;
    if (parentElement) {
        const labelFor = isLabel ? { htmlFor: text } : {};
        textElem = createElement(
            isLabel ? 'label' : 'div',
            {
                className:
                    EditGlobals.classNames.labelText + ' ' + (className || ''),
                textContent: text,
                ...labelFor
            },
            {},
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
    parentElement: HTMLElement,
    options: IconFormFieldOptions
): HTMLElement|undefined {
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
    const click = options.click;
    if (mousedown) {
        iconElem.onmousedown = function (): void {
            mousedown.apply(options.item, arguments);
        };
    }

    if (click) {
        iconElem.onclick = function (): void {
            click.apply(options.item, arguments);
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
    parentElement: HTMLElement,
    options: FormFieldOptions
): HTMLElement | undefined {

    if (!parentElement) {
        return;
    }

    if (options.name) {
        renderText(parentElement, { title: options.name, isLabel: true });
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
    parentElement: HTMLElement,
    options: FormFieldOptions
): HTMLElement|undefined {

    if (!parentElement) {
        return;
    }

    if (options.name) {
        renderText(parentElement, { title: options.name, isLabel: true });
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

/**
 * Function to render the input of type checkbox.
 *
 * @param parentElement
 * An element to which render the checkbox to
 *
 * @param checked
 * Whether the checkbox should be checked or not.
 *
 * @returns
 * The checkbox element
 */
function renderCheckbox(
    parentElement: HTMLElement,
    checked?: boolean
): HTMLElement|undefined {
    let input;

    if (parentElement) {
        input = createElement(
            'input', {
                type: 'checkbox',
                checked: !!checked
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
    parentElement: HTMLElement,
    options: ButtonOptions
): HTMLElement|undefined {
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

/**
 * Get the renderer function based on the type of the element to render.
 *
 * @param type
 * Type of the element to render
 *
 * @returns
 * function to render a specific element
 */
function getRendererFunction(type: RendererElement): Function|undefined {
    return {
        select: renderSelect,
        toggle: renderToggle,
        text: renderText,
        collapse: renderCollapseHeader,
        icon: renderIcon,
        contextButton: renderContextButton,
        input: renderInput,
        textarea: renderTextarea,
        checkbox: renderCheckbox,
        button: renderButton
    }[type];
}


const EditRenderer = {
    renderSelect,
    renderToggle,
    renderText,
    renderCollapseHeader,
    renderIcon,
    renderContextButton,
    renderInput,
    renderTextarea,
    renderCheckbox,
    renderButton,
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

export interface IconFormFieldOptions {
    className?: string;
    icon: string;
    click?: Function;
    mousedown?: Function;
    item?: MenuItem;
    callback?: Function;
}
export interface FormFieldOptions {
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

export interface SelectFormFieldOptions extends FormFieldOptions {
    title: string;
    value: string;
    items: Array<SelectFormFieldItemOptions>;
}

export interface SelectFormFieldItemOptions {
    iconsURLPrefix: string
    name: string;
    iconURL: string;
}

export interface TextOptions {
    title: string;
    className?: string;
    isLabel?: boolean;
}

export interface ToggleFormFieldOptions {
    title?: string;
    value: boolean;
    enabledOnOffLabels?: boolean;
    className?: string;
    callback?: Function;
    onchange?: (value: boolean) => void;
    id: string;
    name: string;
}

export interface NestedHeaderFormFieldOptions {
    name: string;
    allowEnabled?: boolean;
    onchange?: (value: boolean) => void;
    isEnabled?: boolean;
    isNested?: boolean;
}

export type RendererElement =
    | 'select'
    | 'toggle'
    | 'text'
    | 'collapse'
    | 'icon'
    | 'contextButton'
    | 'input'
    | 'textarea'
    | 'checkbox'
    | 'button';
