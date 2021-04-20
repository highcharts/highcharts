/* eslint-disable */
import Component from './Component.js';
import U from '../../Core/Utilities.js';
const {
    merge
} = U;

namespace EditableOptions {
   export type BindingsType = Record<'keyMap' | 'typeMap', Record<string, string>>;
}

class EditableOptions {
    public static defaultBindings: EditableOptions.BindingsType = {
        keyMap: {
            color: 'colorPicker',
            chartOptions: 'textarea',
            title: 'text',
            caption: 'text'
        },
        typeMap: {
            'string': 'text',
            'number': 'input',
            'boolean': 'toggle'
        }
    }

    // Bindings of basic types to "editor components"
    public static defaultTypeMap: Record<string, string> = {
        'string': 'text',
        'number': 'input',
        'boolean': 'toggle'
    }

    public component: Component;
    public bindings?: EditableOptions.BindingsType;

    constructor(component: Component, bindings?: EditableOptions.BindingsType) {
        this.component = component;
        if (bindings) {
            this.bindings = bindings;
        }
    }

    public getEditableOptions(): (Record<string, string | Record<string, string>> | undefined)[] {
        const { options } = this.component;
        const { keyMap, typeMap } = merge(EditableOptions.defaultBindings, this.bindings);

        function getType(nodeName: string, branch: Record<string, any>): Record<string, any> | undefined {
            const node = branch[nodeName];

            if (keyMap[nodeName]) {
                return { [nodeName]: keyMap[nodeName] };
            }

            const type = typeof node;
            if (typeMap[type]) {
                return { [nodeName]: typeMap[type] };
            }

            if (type === 'object') {
                if (Array.isArray(node)) {
                    return { [nodeName]: 'array' };
                }
                // dive deeper
                return {
                    [nodeName]: Object.keys(node)
                        .map(childNodeName => getType(childNodeName, node))
                };
            }
        }

        return [
            ...Object.keys(Component.defaultOptions.editableOptions),
            ...options.editableOptions
        ]
            .map((optionName: string) => getType(optionName, options))
            .filter(option => option);
    }
}

export default EditableOptions;