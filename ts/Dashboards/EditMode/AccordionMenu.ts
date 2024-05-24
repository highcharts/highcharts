/* *
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Pawel Lysy
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Component from '../Components/Component';
import type EditableOptions from '../Components/EditableOptions';
import type Globals from '../Globals';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
const {
    createElement,
    merge,
    error
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Accordion menu class.
 */
class AccordionMenu {

    /* *
     *
     *  Constructor
     *
     * */

    constructor(iconsURLPrefix: string, closeSidebar: Function) {
        this.iconsURLPrefix = iconsURLPrefix;
        this.closeSidebar = closeSidebar;
    }

    /* *
     *
     *  Properties
     *
     * */

    private iconsURLPrefix: string;
    private closeSidebar: Function;
    private changedOptions: DeepPartial<Component.Options> = {};
    private chartOptionsJSON = {};

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Renders the menu for given component.
     *
     * @param container
     * The HTML Element to render the menu in.
     *
     * @param component
     * The component to render the menu for.
     */
    public renderContent(container: HTMLElement, component: Component): void {
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let options: EditableOptions.Options;
        let content: HTMLElement;

        const accordionContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordionMenu
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            options = editableOptions[i];
            content = EditRenderer.renderCollapseHeader(
                accordionContainer,
                merge(
                    {
                        iconsURLPrefix: menu.iconsURLPrefix,
                        lang: (component.board?.editMode || EditGlobals).lang
                    },
                    options
                )
            ).content;

            this.renderAccordion(options, content, component);
        }

        const buttonContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordionMenuButtonsContainer
            },
            {},
            accordionContainer
        );

        EditRenderer.renderButton(
            buttonContainer,
            {
                text: (component.board?.editMode || EditGlobals)
                    .lang.confirmButton,
                className: EditGlobals.classNames.popupConfirmBtn,
                callback: async (): Promise<void> => {
                    const changedOptions = this
                        .changedOptions as Partial<Component.Options>;

                    await component.update(
                        merge(changedOptions, {
                            chartOptions: this.chartOptionsJSON
                        })
                    );

                    menu.changedOptions = {};
                    menu.chartOptionsJSON = {};
                    menu.closeSidebar();
                }
            }
        );

        EditRenderer.renderButton(
            buttonContainer,
            {
                text: (component.board?.editMode || EditGlobals)
                    .lang.cancelButton,
                className: EditGlobals.classNames.popupCancelBtn,
                callback: (): void => {
                    menu.changedOptions = {};
                    menu.chartOptionsJSON = {};
                    menu.closeSidebar();
                }
            }
        );
    }

    /**
     * Update the options object with new nested value, based on the property
     * path. If the objects in the path are not defined, the function will
     * create them.
     *
     * @param propertyPath
     * Path of the property for which the value should be updated.
     * Example: ```['chartOptions', 'chart', 'type']```
     *
     * @param value
     * New value of the property.
     */
    public updateOptions(
        propertyPath: Array<string>,
        value: boolean | string | number
    ): void {
        const pathLength = propertyPath.length - 1;

        let currentLevel = this.changedOptions as Globals.AnyRecord;

        if (pathLength === 0 && propertyPath[0] === 'chartOptions') {
            try {
                const parsedValue = JSON.parse(value as string);
                this.chartOptionsJSON = parsedValue;
            } catch (e) {
                // TODO: Handle the wrong config passed from the user.
                error(
                    `Dashboards Error: Wrong JSON config structure passed as a chart options. \n____________\n${e}`
                );
            }

        }
        for (let i = 0; i < pathLength; i++) {
            const key = propertyPath[i];

            if (!currentLevel[key]) {
                currentLevel[key] = {};
            }

            currentLevel = currentLevel[key];
        }

        currentLevel[propertyPath[pathLength]] = value;
    }

    /**
     * Renders either a basic or nested element. This function can be
     * recursively called, if there are multiple nested options.
     *
     * @param options
     * Configuration object of the Component options.
     *
     * @param parentNode
     * A container where the accordion is rendered.
     *
     * @param component
     * the component for which the menu should be rendered.
     */
    public renderAccordion(
        options: EditableOptions.Options,
        parentNode: HTMLElement,
        component: Component
    ): void {

        if (options.type === 'nested') {
            return this.renderNested(parentNode, options, component);
        }

        const renderFunction = EditRenderer.getRendererFunction(options.type);

        if (!renderFunction) {
            return;
        }

        renderFunction(parentNode, {
            ...options,
            iconsURLPrefix: this.iconsURLPrefix,
            value: component.getEditableOptionValue(options.propertyPath),
            onchange: (
                value: boolean | string | number
            ): void => this.updateOptions(options.propertyPath || [], value)
        });

    }

    /**
     * Render nested menu for the component.
     *
     * @param parentElement
     * HTML element to which the nested structure should be rendered to
     *
     * @param options
     * configuration object for the options
     *
     * @param component
     * The component instance for the options should be rendered
     */
    public renderNested(
        parentElement: HTMLElement,
        options: EditableOptions.Options,
        component: Component
    ): void {
        if (!parentElement || !options.nestedOptions) {
            return;
        }

        const nestedOptions = options.nestedOptions;

        for (let i = 0, iEnd = nestedOptions.length; i < iEnd; ++i) {
            const name = nestedOptions[i].name;
            const accordionOptions = nestedOptions[i].options;
            const showToggle = !!nestedOptions[i].showToggle;
            const propertyPath = nestedOptions[i].propertyPath || [];
            const collapsedHeader = EditRenderer.renderCollapseHeader(
                parentElement, {
                    name,
                    isEnabled: !!component.getEditableOptionValue(propertyPath),
                    iconsURLPrefix: this.iconsURLPrefix,
                    showToggle: showToggle,
                    onchange: (value: boolean | string | number): void =>
                        this.updateOptions(propertyPath, value),
                    isNested: true,
                    lang: (component.board?.editMode || EditGlobals).lang
                }
            );

            for (let j = 0, jEnd = accordionOptions.length; j < jEnd; ++j) {
                this.renderAccordion(
                    accordionOptions[j] as EditableOptions.Options,
                    collapsedHeader.content,
                    component
                );
            }

        }
        return;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default AccordionMenu;
