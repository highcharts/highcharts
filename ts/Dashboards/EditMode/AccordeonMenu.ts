import type Component from '../Components/Component.js';
import type EditableOptions from '../Components/EditableOptions';

import EditRenderer from './EditRenderer.js';
import U from '../../Core/Utilities.js';
const {
    createElement
} = U;


class AccordeonMenu {
    private iconsURLPrefix: string;
    private changedOptions: DeepPartial<Component.ComponentOptions> = {};

    constructor(iconsURLPrefix: string) {
        this.iconsURLPrefix = iconsURLPrefix;
    }
    public createAccordeonMenu(
        container: HTMLElement,
        component: Component
    ): void {

        const editableOptions = component.editableOptions.getOptions();
        let option, content;

        const accordeonMenuContainer = createElement(
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
                accordeonMenuContainer,
                option.name
            ).content;

            this.renderAccordeon(option, content, component);
        }
    }

    public updateOptions(
        optionsToUpdate: DeepPartial<Component.ComponentOptions>,
        path?: Array<string>
    ): (value: boolean | string | number) => void {

        if (!path) {
            return (): void => {};
        }

        return function onChange(value: boolean | string | number): void {
            let currentLevel = optionsToUpdate as any;

            for (let i = 0; i < path.length - 1; i++) {
                const key: string = path[i];
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
                }
            }
        );
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

        const options = {
            ...option,
            iconsURLPrefix: this.iconsURLPrefix,
            value: this.getValue(component, option.propertyPath),
            onchange: this.updateOptions(
                this.changedOptions,
                option.propertyPath
            )
        };
        renderFunction(parentNode, options);

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
                this.renderAccordeon(
                    nestedOptions[j] as any,
                    content,
                    component
                );
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
