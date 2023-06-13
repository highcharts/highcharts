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

import type Component from './Component.js';

class EditableOptions {

    public static defaultBindings: EditableOptions.OptionsBindings = {
        keyMap: {
            color: 'colorPicker',
            title: 'text',
            caption: 'text',
            style: 'textarea'
        },
        typeMap: {
            'string': 'text',
            'number': 'input',
            'boolean': 'toggle'
        },
        skipRedraw: []
    };

    // Bindings of basic types to "editor components"
    public static defaultTypeMap: Record<string, string> = {
        'string': 'text',
        'number': 'input',
        'boolean': 'toggle'
    };

    public component: Component;
    public bindings: EditableOptions.OptionsBindings;

    constructor(
        component: Component,
        bindings: EditableOptions.OptionsBindings =
        EditableOptions.defaultBindings
    ) {
        this.component = component;
        this.bindings = bindings;
    }

    public getOptions(): (Array<EditableOptions.Options>) {
        const options = this.component.options.editableOptions;
        for (let i = 0, iEnd = options.length; i < iEnd; i++) {
            const option = options[i];
            if (option.name === 'connectorName') {
                const board = this.component.board;
                const selectOptions = !board ?
                    [] :
                    board.dataPool
                        .getConnectorIds()
                        .map((name): { name: string } => ({ name }));
                option.selectOptions = selectOptions;
            }
        }
        return options;
    }
}
namespace EditableOptions {

    /**
     * Configuration for a single option in editable options. If type is
     * `nested` the options are rendered in the accordion menu, with rest of the
     * options defined in the detailed options.
     */
    export interface Options {
        /**
         * Name of the option which will be displayed on the label.
         */
        name: string;
        /**
         * Type of the editable element.
         */
        type: ElementType;
        /**
         * Detailed options that should be included in the accordion menu.
         * Available for `nested` type.
         */
        nestedOptions?: Array<NestedOptions>
        /**
         * Relative path to the option, that should be changed in the component.
         * eg: `['chart', 'title', 'text']`
         */
        propertyPath?: Array<string>
        /**
         * Items that should be included in the select element.
         */
        selectOptions?: Array<SelectOptions>;
    }

    /**
     * Options of the single option in the select dropdown.
     */
    export interface SelectOptions {
        /**
         * Name of the item that should be displayed.
         */
        name: string;
        /**
         * URL of the icon that should be displayed. It is concatenated with
         * `iconURLPrefix` option.
         */
        iconURL?: string;
    }

    /**
     * Type of the input to be displayed.
     */
    export type ElementType =
        | 'input'
        | 'text'
        | 'textarea'
        | 'toggle'
        | 'select'
        | 'nested';

    /**
     * Configuration for a single option in detailed options.
     */
    export interface NestedOptions {
        /**
         * Name of the option that should be displayed.
         */
        name: string;
        /**
         * whether the option should have a toggle to be enabled or disabled.
         */
        showToggle?: boolean;
        /**
         * Relative path to the option, that should be changed in the component.
         */
        propertyPath?: Array<string>;
        /**
         * Options that should be included in the folded menu.
         */
        options: Array<Options>;
    }


    export interface OptionsBindings {
        keyMap: Record<string, string>;
        typeMap: Record<string, string>;
        skipRedraw: string[]; // keys of options that should not trigger redraw
    }

}

export default EditableOptions;
