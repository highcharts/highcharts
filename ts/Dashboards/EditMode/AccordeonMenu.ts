import type Component from '../Components/Component.js';
import type EditableOptions from '../Components/EditableOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
const { merge } = U;

class AccordeonMenu {
    private iconsURLPrefix: string;
    private changedOptions = {};

    constructor(iconsURLPrefix: string) {
        this.iconsURLPrefix = iconsURLPrefix;
    }
    public createAccordeonMenu(
        container: HTMLElement,
        component: Component
    ): void {
        const editableOptions = component.editableOptions.getOptions();
        let option, content;

        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapse(
                container,
                option.name
            ).content;

            this.renderAccordeon(option, content, component);
        }
    }

    public updateOption(
        optionsToUpdate: DeepPartial<Component.ComponentOptions>
    ) {
        return function (path: Array<string>, value: any): void {
            let currentLevel = optionsToUpdate as any;

            for (let i = 0; i < path.length - 1; i++) {
                const key = path[i];
                if (!(key in currentLevel)) {
                    currentLevel[key] = {};
                }
                currentLevel = currentLevel[key];
            }

            currentLevel[path[path.length - 1]] = value;
        };
    }

    public renderContent(container: HTMLElement, component: Component): void {
        const editableOptions = component.editableOptions.getOptions();
        let option, content;
        for (let i = 0, end = editableOptions.length; i < end; i++) {
            option = editableOptions[i];
            content = EditRenderer.renderCollapse(
                container,
                option.name
            ).content;

            this.renderAccordeon(option, content, component);
        }
    }

    public renderAccordeon(
        option: EditableOptions.Configuration,
        parentNode: HTMLElement,
        component: Component
    ): void {

        if (option.type === 'nested') {
            return this.renderNested(parentNode, option, component);
        }
        const renderFunction = EditRenderer.getRendererFunction(option.type);

        if (!renderFunction) {
            return;
        }

        renderFunction(parentNode, {
            ...option,
            value: this.getValue(component, option.propertyPath)
        });
    }

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
            const content = EditRenderer.renderNestedHeaders(
                parentElement,
                name,
                !!allowEnabled
            );

            for (let j = 0, jEnd = nestedOptions.length; j < jEnd; ++j) {
                const nestedOption = merge(nestedOptions[j], {
                    iconsURLPrefix: this.iconsURLPrefix
                });
                this.renderAccordeon(nestedOption as any, content, component);
            }
        }
        return;
    }
    public getValue(
        component: Component,
        propertyPath?: Array<string>
    ): number | string | boolean | undefined {
        if (!propertyPath) {
            return;
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
