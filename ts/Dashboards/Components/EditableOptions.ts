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

namespace EditableOptions {

    /**
     * Configuration for a single option in editable options.
     */
    export interface Configuration {
        /**
         * Name of the option which will be displayed on the label.
         */
        name: string;
        /**
         * Type of the editable element.
         */
        type: ElementType;
        /**
         * Detailed options that should be included in the accorion menu.
         * Available for `nested` type.
         */
        detailedOptions?: Array<DetailedOptions>
        /**
         * Relative path to the option, that should be changed in the component.
         */
        propertyPath?: Array<string>
        /**
         * Items that should be included in the select element.
         */
        items?: Array<{name?: string, iconURL?: string}>;
    }

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
    export interface DetailedOptions {
        /**
         * Name of the option that should be displayed.
         */
        name: string;
        /**
         * whether the option should have a toggle to be enabled or disabled.
         */
        allowEnabled?: boolean;
        /**
         * Relative path to the option, that should be changed in the component.
         */
        propertyPath?: Array<string>;
        /**
         * Options that should be included in the folded menu.
         */
        options: Array<Configuration>;
    }


    export interface OptionsBindings {
        keyMap: Record<string, string>;
        typeMap: Record<string, string>;
        skipRedraw: string[]; // keys of options that should not trigger redraw
    }

}

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

    public getOptions(): (Array<EditableOptions.Configuration>) {
        return this.component.options.editableOptions;
    }
}

export default EditableOptions;
