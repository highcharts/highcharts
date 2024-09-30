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
import type { Options as HTMLOptions } from '../Components/HTMLComponent/HTMLComponentOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
import EditGlobals from './EditGlobals.js';
import ConfirmationPopup from './ConfirmationPopup.js';
const {
    createElement,
    merge,
    error,
    fireEvent
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
    private component?: Component;
    private oldOptionsBuffer: DeepPartial<Component.Options> = {};
    private confirmationPopup?: ConfirmationPopup;
    public waitingForConfirmation = false;

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

     * @param sidebarMainContainer
     * The main container of the sidebar.
     */
    public renderContent(
        container: HTMLElement,
        component: Component,
        sidebarMainContainer: HTMLElement
    ): void {
        const { editMode } = component.board;
        const menu = this;
        const editableOptions = component.editableOptions.getOptions();
        let options: EditableOptions.Options;
        let content: HTMLElement;

        this.component = component;
        this.oldOptionsBuffer = merge({}, component.options);

        if (editMode) {
            this.confirmationPopup = new ConfirmationPopup(
                component.board.container,
                editMode.iconsURLPrefix,
                editMode,
                { close: { icon: '' } }
            );
        }

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
            sidebarMainContainer
        );

        EditRenderer.renderButton(
            buttonContainer,
            {
                text: (component.board?.editMode || EditGlobals)
                    .lang.confirmButton,
                className: EditGlobals.classNames.popupConfirmBtn,
                callback: async (): Promise<void> => {
                    await this.confirmChanges();
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
                    this.cancelChanges();
                }
            }
        );
        sidebarMainContainer.appendChild(buttonContainer);
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
        let currentChartOptionsLevel;
        let currentOldChartOptionsBufferLevel;
        let currentDataGridOptionsLevel;
        let currentOldDataGridOptionsBufferLevel;

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

            if (key === 'dataGridOptions') {
                const realDataGridOptions =
                    (this.component as any).dataGrid?.options;

                if (realDataGridOptions) {
                    const oldOptionsBuffer =
                        this.oldOptionsBuffer as Globals.AnyRecord;
                    if (!oldOptionsBuffer.dataGridOptions) {
                        oldOptionsBuffer.dataGridOptions = {};
                    }
                    currentOldDataGridOptionsBufferLevel =
                        oldOptionsBuffer.dataGridOptions as Globals.AnyRecord;
                    currentDataGridOptionsLevel = realDataGridOptions;
                }
            } else if (
                currentDataGridOptionsLevel &&
                currentOldDataGridOptionsBufferLevel
            ) {
                currentDataGridOptionsLevel = currentDataGridOptionsLevel[key];

                if (currentOldDataGridOptionsBufferLevel[key] === void 0) {
                    currentOldDataGridOptionsBufferLevel[key] = {};
                }

                currentOldDataGridOptionsBufferLevel =
                    currentOldDataGridOptionsBufferLevel[key];
            }

            if (key === 'chartOptions') {
                const realChartOptions = (this.component as any).chart?.options;

                if (realChartOptions) {
                    const oldOptionsBuffer =
                        this.oldOptionsBuffer as Globals.AnyRecord;
                    if (!oldOptionsBuffer.chartOptions) {
                        oldOptionsBuffer.chartOptions = {};
                    }
                    currentOldChartOptionsBufferLevel =
                        oldOptionsBuffer.chartOptions as Globals.AnyRecord;
                    currentChartOptionsLevel = realChartOptions;
                }
            } else if (
                currentChartOptionsLevel &&
                currentOldChartOptionsBufferLevel
            ) {
                currentChartOptionsLevel = currentChartOptionsLevel[key];

                if (currentOldChartOptionsBufferLevel[key] === void 0) {
                    currentOldChartOptionsBufferLevel[key] = {};
                }

                currentOldChartOptionsBufferLevel =
                    currentOldChartOptionsBufferLevel[key];
            }
        }

        const lastKey = propertyPath[pathLength];
        currentLevel[lastKey] = value;

        if (currentOldChartOptionsBufferLevel && currentChartOptionsLevel) {
            currentOldChartOptionsBufferLevel[lastKey] = (
                currentOldChartOptionsBufferLevel[lastKey] ??
                currentChartOptionsLevel[lastKey]
            );
        }

        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.component?.update(
            this.changedOptions as Partial<Component.Options>
        );
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

    /**
     * Closes the sidebar discarding changes. If there are any changes, it will
     * show a confirmation popup. If no changes, it will close the sidebar.
     */
    public cancelChanges(): void {
        if (Object.keys(this.changedOptions).length < 1) {
            this.closeSidebar();
        } else {
            this.showCancelConfirmationPopup();
        }
    }

    /**
     * Confirms changes made in the component.
     *
     * @fires EditMode#componentChanged
     */
    private async confirmChanges(): Promise<void> {
        const component = this.component;
        if (!component) {
            return;
        }

        if (
            component.type === 'Highcharts' &&
            Object.keys(this.chartOptionsJSON).length
        ) {
            await component.update({
                chartOptions: this.chartOptionsJSON
            } as any);
        } else if (component.type === 'HTML') {
            const options = this.changedOptions as HTMLOptions;

            await component.update(options, true);
        }

        fireEvent(
            component.board.editMode,
            'componentChanged',
            {
                target: component,
                changedOptions: merge({}, this.changedOptions),
                oldOptions: merge({}, this.oldOptionsBuffer)
            }
        );

        this.changedOptions = {};
        this.chartOptionsJSON = {};
        this.closeSidebar();
    }

    /**
     * Discards changes made in the component.
     *
     * @fires EditMode#componentChangesDiscarded
     */
    private async discardChanges(): Promise<void> {
        const component = this.component;
        if (!component) {
            return;
        }

        await component.update(
            this.oldOptionsBuffer as Partial<Component.Options>
        );

        fireEvent(
            component.board.editMode,
            'componentChangesDiscarded',
            {
                target: component,
                changedOptions: merge({}, this.changedOptions),
                oldOptions: merge({}, this.oldOptionsBuffer)
            }
        );

        this.changedOptions = {};
        this.chartOptionsJSON = {};
    }

    /**
     * Shows a confirmation popup when the user tries to discard changes.
     */
    private showCancelConfirmationPopup(): void {
        const popup = this.confirmationPopup;
        const editMode = this.component?.board?.editMode;
        if (!popup || !editMode || this.waitingForConfirmation) {
            return;
        }

        this.waitingForConfirmation = true;
        popup.show({
            text: editMode.lang.confirmDiscardChanges,
            confirmButton: {
                value: editMode.lang.confirmButton,
                callback: async (): Promise<void> => {
                    await this.discardChanges();
                    this.waitingForConfirmation = false;
                    this.closeSidebar();
                },
                context: this as any
            },
            cancelButton: {
                value: editMode.lang.cancelButton,
                callback: (): void => {
                    popup.closePopup();
                    editMode.setEditOverlay();

                    setTimeout((): void => {
                        this.waitingForConfirmation = false;
                    }, 100);
                }
            }
        });
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default AccordionMenu;
