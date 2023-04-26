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

        const accordeonContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordeonMenu
            },
            {},
            container
        );

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapseHeader(
                accordeonContainer,
                { name: option.name }
            ).content;

            this.renderAccordeon(option, content, component);
        }

        const buttonContainer = createElement(
            'div',
            {
                className: EditGlobals.classNames.accordeonMenuButtonsContainer
            },
            {},
            accordeonContainer
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
        let currentLevel = this.changedOptions as any;
        const pathLength = propertyPath.length - 1;

        if (pathLength === 0 && propertyPath[0] === 'chartOptions') {
            try {
                const parsedValue = JSON.parse(value as string);
                this.chartOptionsJSON = parsedValue;
            } catch (e) {
                // console.log('Invalid JSON passed to the chart chart config');
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
            const allowEnabled = !!detailedOptions[i].allowEnabled;
            const propertyPath = detailedOptions[i].propertyPath || [];
            const collapsedHeader = EditRenderer.renderCollapseHeader(
                parentElement, {
                    name,
                    isEnabled: !!this.getValue(component, propertyPath),
                    allowEnabled,
                    onchange: (value: boolean | string | number): void =>
                        this.updateOptions(propertyPath, value),
                    isNested: true
                }
            );

            for (let j = 0, jEnd = nestedOptions.length; j < jEnd; ++j) {
                this.renderAccordeon(
                    nestedOptions[j] as EditableOptions.Configuration,
                    collapsedHeader.content,
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
     * Path to a value. Example:  ```['chartOptions', 'chart', 'type']```
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

        const componentOptions = component.options;
        const chart = (component as HighchartsComponent).chart;
        const chartOptions = chart && chart.options;
        const chartType = chartOptions && chartOptions.chart.type || 'line';
        let value = merge(componentOptions, {
            chartOptions
        }, {
            chartOptions: {
                yAxis: splat(chart && chart.yAxis[0].options),
                xAxis: splat(chart && chart.xAxis[0].options),
                plotOptions: {
                    series: (chartOptions?.plotOptions || {})[chartType]
                }
            }
        }) as any;

        for (let i = 0, end = propertyPath.length; i < end; i++) {
            if (!value) {
                return;
            }

            if (isArray(value)) {
                value = value[0];
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
