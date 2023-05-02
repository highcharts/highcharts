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

import type Component from '../Components/Component';
import type HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent';
import type EditableOptions from '../Components/EditableOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
const {
    createElement,
    merge,
    error,
    splat,
    isArray
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
    private changedOptions: DeepPartial<Component.ComponentOptions> = {};
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
     * @param component
     * The component to render the menu for.
     */
    public renderContent(container: HTMLElement, component: Component): void {
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let option, content;

        const accordionContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordionMenu
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapseHeader(
                accordionContainer,
                { name: option.name }
            ).content;

            this.renderAccordion(option, content, component);
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
                value: EditGlobals.lang.confirmButton,
                callback: (): void => {
                    const changedOptions = this
                        .changedOptions as Partial<Component.ComponentOptions>;

                    component.update(
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
                value: EditGlobals.lang.cancelButton,
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
     * @param value
     * New value of the property.
     */
    public updateOptions(
        propertyPath: Array<string>,
        value: boolean | string | number
    ): void {
        let currentLevel = this
            .changedOptions as DeepPartial<Component.ComponentOptions>;
        const pathLength = propertyPath.length - 1;

        if (pathLength === 0 && propertyPath[0] === 'chartOptions') {
            try {
                const parsedValue = JSON.parse(value as string);
                this.chartOptionsJSON = parsedValue;
            } catch (e) {
                // TODO: Handle the wrong config passed from the user.
                error(
                    'Dashboards Error: Wrong JSON config structure passed as' +
                        ' a chart options.'
                );
            }

        }
        for (let i = 0; i < pathLength; i++) {
            const key = propertyPath[i];

            if (!currentLevel[key]) {
                currentLevel[key] = {};
            }

            currentLevel = currentLevel[key] as
                DeepPartial<Component.ComponentOptions>;
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
    public renderAccordion(
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
            const allowEnabled = !!detailedOptions[i].allowEnabled;
            const propertyPath = detailedOptions[i].propertyPath || [];
            const collapsedHeader = EditRenderer.renderCollapseHeader(
                parentElement, {
                    name,
                    isEnabled: !!component.getEditableOptionValue(propertyPath),
                    allowEnabled,
                    onchange: (value: boolean | string | number): void =>
                        this.updateOptions(propertyPath, value),
                    isNested: true
                }
            );

            for (let j = 0, jEnd = nestedOptions.length; j < jEnd; ++j) {
                this.renderAccordion(
                    nestedOptions[j] as EditableOptions.Configuration,
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
