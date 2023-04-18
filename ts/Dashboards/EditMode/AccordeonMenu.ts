/* *
 *
 *  (c) 2009-2023 Highsoft AS
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

import type Component from '../Components/Component.js';
import type EditableOptions from '../Components/EditableOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
const {
    createElement
} = U;

/* *
 *
 *  Class
 *
 * */

/**
 * Accordeon menu class.
 */
class AccordeonMenu {

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
    private changedOptions: DeepPartial<Component.ComponentOptions> = {};

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
     * @param component
     * The component to render the menu for.
     */
    public renderContent(container: HTMLElement, component: Component): void {
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let option, content;
        const accordeonContainer = createElement(
            'div',
            {
                className: 'highcharts-dashboards-accordeon-menu'
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapse(
                accordeonContainer,
                option.name
            ).content;

            this.renderAccordeon(option, content, component);
        }

        EditRenderer.renderButton(
            accordeonContainer,
            {
                value: 'Update',
                callback: (): void => {
                    component.update(this.changedOptions as any);
                    menu.closeSidebar();
                }
            }
        );

        EditRenderer.renderButton(
            accordeonContainer,
            {
                value: 'Cancel',
                callback: (): void => {
                    menu.changedOptions = {};
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
     * Path of the property for which the value should be updated,
     * e.g. ['chartOptions', 'chart', 'type']
     * @param value
     * New value of the property.
     */
    public updateOptions(
        propertyPath: Array<string>,
        value: boolean | string | number
    ): void {
        let currentLevel = this.changedOptions as any;
        const pathLength = propertyPath.length - 1;

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
     * Renders either a basic or nested element. This function can be recursivly
     * called, if there are multiple nested options.
     *
     * @param options
     * Configuration object of the Component options.
     * @param parentNode
     * A container where the accordion is rendered.
     * @param component
     * the component for which the menu should be rendered.
     */
    public renderAccordeon(
        options: EditableOptions.Configuration,
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
            value: this.getValue(component, options.propertyPath),
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
     * @param options
     * configuration object for the options
     * @param component
     * The component instance for the options should be rendered
     */
    public renderNested(
        parentElement: HTMLElement,
        options: EditableOptions.Configuration,
        component: Component
    ): void {
        if (!parentElement || !options.detailedOptions) {
            return;
        }

        const detailedOptions = options.detailedOptions;

        for (let i = 0, iEnd = detailedOptions.length; i < iEnd; ++i) {
            const name = detailedOptions[i].name;
            const nestedOptions = detailedOptions[i].options;
            const allowEnabled = detailedOptions[i].allowEnabled;
            const content = EditRenderer.renderNestedHeader(
                parentElement,
                name,
                !!allowEnabled
            );

            for (let j = 0, jEnd = nestedOptions.length; j < jEnd; ++j) {
                this.renderAccordeon(
                    nestedOptions[j] as any,
                    content,
                    component
                );
            }

        }
        return;
    }

    /**
     * Gets the value from the component based on the provided propertyPath
     * array.
     *
     * @param component
     * The component for which the value should be returned.
     * @param propertyPath
     * Path to a value, e.g. ['chartOptions', 'chart', 'type']
     * @returns
     * The value retrieved from the component.
     */
    public getValue(
        component: Component,
        propertyPath?: Array<string>
    ): number | string | boolean | undefined {
        if (!propertyPath) {
            return;
        }

        if (propertyPath.length === 1 && propertyPath[0] === 'chartOptions') {
            return JSON.stringify(component.options.chartOptions, null, 2);
        }

        let value = component.options as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (!value) {
                return;
            }
            value = value[propertyPath[i]];
        }
        return value;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default AccordeonMenu;
